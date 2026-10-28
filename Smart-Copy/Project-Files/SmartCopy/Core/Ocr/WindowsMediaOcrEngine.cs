using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Threading.Tasks;
using Windows.Graphics.Imaging;
using Windows.Globalization;
using Windows.Media.Ocr;
using SmartCopy.Core.Models;

namespace SmartCopy.Core.Ocr;

public class WindowsMediaOcrEngine : IOcrEngine
{
    private readonly OcrEngine? _engine;
    public bool IsAvailable => _engine != null;

    public WindowsMediaOcrEngine()
    {
        try
        {
            var lang = new Language("en-US");
            _engine = OcrEngine.TryCreateFromLanguage(lang) ?? OcrEngine.TryCreateFromUserProfileLanguages();
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"WindowsMediaOcr init: {ex.Message}");
        }
    }

    public OcrPage Recognize(Bitmap image, bool autoRotate = true, bool autoDeskew = true, float minConfidence = 15.0f)
    {
        if (_engine == null) return OcrPage.Empty;

        try
        {
            using var ms = new MemoryStream();
            image.Save(ms, ImageFormat.Bmp);
            ms.Position = 0;

            var ras = ms.AsRandomAccessStream();
            var decoder = BitmapDecoder.CreateAsync(ras).AsTask().GetAwaiter().GetResult();
            var softwareBitmap = decoder.GetSoftwareBitmapAsync().AsTask().GetAwaiter().GetResult();
            var ocrResult = _engine.RecognizeAsync(softwareBitmap).AsTask().GetAwaiter().GetResult();

            var words = new List<SmartCopy.Core.Models.OcrWord>();
            foreach (var line in ocrResult.Lines)
            {
                foreach (var w in line.Words)
                {
                    var r = w.BoundingRect;
                    words.Add(new SmartCopy.Core.Models.OcrWord(w.Text, new OcrRect(r.X, r.Y, r.Width, r.Height), 95f));
                }
            }

            return new OcrPage
            {
                FullText = ocrResult.Text?.Trim() ?? string.Empty,
                Words = words,
                OrientationAngle = (int)(ocrResult.TextAngle ?? 0),
                MeanConfidence = 95f
            };
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"WindowsMediaOcr error: {ex.Message}");
            return OcrPage.Empty;
        }
    }

    public void Dispose()
    {
        GC.SuppressFinalize(this);
    }
}
