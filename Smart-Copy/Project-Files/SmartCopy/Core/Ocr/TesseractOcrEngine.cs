using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;
using SmartCopy.Core.Models;
using Tesseract;

namespace SmartCopy.Core.Ocr;

public class TesseractOcrEngine : IOcrEngine
{
    private TesseractEngine? _engine;
    private bool _isDisposed;
    private readonly string _tessdataPath;

    public bool IsInitialized => _engine != null;

    public TesseractOcrEngine()
    {
        _tessdataPath = EnsureTessdataPath();
        InitializeEngine();
    }

    private static string EnsureTessdataPath()
    {
        // 1. Check local application base directory
        string baseDir = AppContext.BaseDirectory;
        string candidate1 = Path.Combine(baseDir, "tessdata");
        if (Directory.Exists(candidate1) && File.Exists(Path.Combine(candidate1, "eng.traineddata")))
            return candidate1;

        // 2. Check local app data persistent folder
        string localAppData = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "SmartCopy", "tessdata");
        if (Directory.Exists(localAppData) && File.Exists(Path.Combine(localAppData, "eng.traineddata")))
            return localAppData;

        // 3. Auto-extract from embedded assembly resource or copy from known source locations
        try
        {
            if (!Directory.Exists(localAppData))
            {
                Directory.CreateDirectory(localAppData);
            }

            string targetFile = Path.Combine(localAppData, "eng.traineddata");

            // Try embedded resource
            var asm = Assembly.GetExecutingAssembly();
            string? resourceName = asm.GetManifestResourceNames()
                .FirstOrDefault(n => n.EndsWith("eng.traineddata", StringComparison.OrdinalIgnoreCase));

            if (!string.IsNullOrEmpty(resourceName))
            {
                using var resStream = asm.GetManifestResourceStream(resourceName);
                if (resStream != null)
                {
                    using var fs = new FileStream(targetFile, FileMode.Create, FileAccess.Write);
                    resStream.CopyTo(fs);
                    return localAppData;
                }
            }

            // Fallback: check workspace location
            string devSource = @"e:\Dustbin\SMART COPY\SmartCopy\tessdata\eng.traineddata";
            if (File.Exists(devSource))
            {
                File.Copy(devSource, targetFile, true);
                return localAppData;
            }
        }
        catch (Exception ex)
        {
            LogDiagnostic($"Failed to extract tessdata: {ex.Message}");
        }

        return candidate1;
    }

    private void InitializeEngine()
    {
        try
        {
            if (Directory.Exists(_tessdataPath) && File.Exists(Path.Combine(_tessdataPath, "eng.traineddata")))
            {
                _engine = new TesseractEngine(_tessdataPath, "eng", EngineMode.Default);
                LogDiagnostic($"Tesseract initialized successfully with path: {_tessdataPath}");
            }
            else
            {
                LogDiagnostic($"Tesseract init failed: tessdata not found at '{_tessdataPath}'");
            }
        }
        catch (Exception ex)
        {
            LogDiagnostic($"Tesseract init error: {ex}");
        }
    }

    public OcrPage Recognize(Bitmap image, bool autoRotate = true, bool autoDeskew = true, float minConfidence = 15.0f)
    {
        if (_engine == null)
        {
            InitializeEngine();
            if (_engine == null) return OcrPage.Empty;
        }

        int origW = image.Width;
        int origH = image.Height;

        // Base pass: 0 degrees
        var pass0 = ProcessSingleImage(image, 0, minConfidence);

        if (!autoRotate || (pass0.Words.Count > 0 && pass0.MeanConfidence >= 50.0f))
        {
            return pass0;
        }

        // Test 90, 270, 180 orientations if 0 yields sparse results
        var bestPage = pass0;
        int[] testAngles = { 90, 270, 180 };

        foreach (int angle in testAngles)
        {
            using var rotated = ImagePreprocessor.RotateImage(image, angle);
            var pageRot = ProcessSingleImage(rotated, angle, minConfidence);

            var transformedWords = new List<OcrWord>();
            foreach (var w in pageRot.Words)
            {
                var origRect = ImagePreprocessor.InverseTransformRect(w.BoundingBox, origW, origH, angle);
                transformedWords.Add(new OcrWord(w.Text, origRect, w.Confidence));
            }
            pageRot.Words = transformedWords;

            if (pageRot.Words.Count > bestPage.Words.Count ||
               (pageRot.Words.Count == bestPage.Words.Count && pageRot.MeanConfidence > bestPage.MeanConfidence))
            {
                bestPage = pageRot;
                if (bestPage.Words.Count > 0 && bestPage.MeanConfidence >= 50.0f)
                    break;
            }
        }

        return bestPage;
    }

    private OcrPage ProcessSingleImage(Bitmap img, int angle, float minConfidence)
    {
        if (_engine == null) return OcrPage.Empty;

        try
        {
            using var ms = new MemoryStream();
            img.Save(ms, System.Drawing.Imaging.ImageFormat.Bmp);
            using var pix = Pix.LoadFromMemory(ms.ToArray());
            using var page = _engine.Process(pix, PageSegMode.Auto);

            string fullText = page.GetText()?.Trim() ?? string.Empty;
            float meanConf = page.GetMeanConfidence() * 100f;

            var words = new List<OcrWord>();
            using var iter = page.GetIterator();
            if (iter != null)
            {
                iter.Begin();
                do
                {
                    if (iter.TryGetBoundingBox(PageIteratorLevel.Word, out Rect r))
                    {
                        string wordText = iter.GetText(PageIteratorLevel.Word)?.Trim() ?? string.Empty;
                        float conf = iter.GetConfidence(PageIteratorLevel.Word);

                        if (!string.IsNullOrWhiteSpace(wordText))
                        {
                            var box = new OcrRect(r.X1, r.Y1, r.Width, r.Height);
                            words.Add(new OcrWord(wordText, box, conf));
                        }
                    }
                } while (iter.Next(PageIteratorLevel.Word));
            }

            if (words.Count == 0 && !string.IsNullOrWhiteSpace(fullText))
            {
                // Fallback word parsing if iterator was empty
                var tokens = fullText.Split(new[] { ' ', '\r', '\n', '\t' }, StringSplitOptions.RemoveEmptyEntries);
                foreach (var token in tokens)
                {
                    words.Add(new OcrWord(token, new OcrRect(0, 0, img.Width, img.Height), 80f));
                }
            }

            return new OcrPage
            {
                FullText = fullText,
                Words = words,
                OrientationAngle = angle,
                MeanConfidence = meanConf
            };
        }
        catch (Exception ex)
        {
            LogDiagnostic($"ProcessSingleImage error: {ex.Message}");
            return OcrPage.Empty;
        }
    }

    private static void LogDiagnostic(string message)
    {
        try
        {
            string dir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "SmartCopy");
            if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);
            string file = Path.Combine(dir, "diagnostic.log");
            File.AppendAllText(file, $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] {message}\r\n");
        }
        catch { }
    }

    public void Dispose()
    {
        if (!_isDisposed)
        {
            _engine?.Dispose();
            _engine = null;
            _isDisposed = true;
        }
        GC.SuppressFinalize(this);
    }
}
