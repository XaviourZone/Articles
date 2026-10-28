using System;
using System.Drawing;
using SmartCopy.Core.Models;

namespace SmartCopy.Core.Ocr;

public interface IOcrEngine : IDisposable
{
    OcrPage Recognize(Bitmap image, bool autoRotate = true, bool autoDeskew = true, float minConfidence = 25.0f);
}
