using System;
using System.Drawing;
using SmartCopy.Core.Models;

namespace SmartCopy.Core.Ocr;

public class DualOcrEngine : IOcrEngine
{
    private readonly WindowsMediaOcrEngine _winOcr;
    private readonly TesseractOcrEngine _tesseractOcr;
    private bool _isDisposed;

    public DualOcrEngine()
    {
        _winOcr = new WindowsMediaOcrEngine();
        _tesseractOcr = new TesseractOcrEngine();
    }

    public OcrPage Recognize(Bitmap image, bool autoRotate = true, bool autoDeskew = true, float minConfidence = 15.0f)
    {
        // 1. Try Windows Media OCR (high performance, native Windows 10/11 offline OCR)
        if (_winOcr.IsAvailable)
        {
            var winResult = _winOcr.Recognize(image, autoRotate, autoDeskew, minConfidence);
            if (!string.IsNullOrWhiteSpace(winResult.FullText) || winResult.Words.Count > 0)
            {
                return winResult;
            }
        }

        // 2. Fallback to Tesseract OCR
        if (_tesseractOcr.IsInitialized)
        {
            return _tesseractOcr.Recognize(image, autoRotate, autoDeskew, minConfidence);
        }

        return OcrPage.Empty;
    }

    public void Dispose()
    {
        if (!_isDisposed)
        {
            _winOcr.Dispose();
            _tesseractOcr.Dispose();
            _isDisposed = true;
        }
        GC.SuppressFinalize(this);
    }
}
