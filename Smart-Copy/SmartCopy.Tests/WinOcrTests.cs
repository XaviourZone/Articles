using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Threading.Tasks;
using Windows.Graphics.Imaging;
using Windows.Media.Ocr;
using Windows.Globalization;
using Xunit;

namespace SmartCopy.Tests;

public class WinOcrTests
{
    [Fact]
    public async Task TestWindowsMediaOcrRecognition()
    {
        var lang = new Language("en-US");
        var engine = OcrEngine.TryCreateFromLanguage(lang) ?? OcrEngine.TryCreateFromUserProfileLanguages();
        Assert.NotNull(engine);

        // Create a bitmap with text "Smart Copy OCR"
        using var bmp = new Bitmap(200, 60);
        using (var g = Graphics.FromImage(bmp))
        {
            g.Clear(Color.White);
            g.DrawString("Smart Copy OCR", new Font("Arial", 16), Brushes.Black, new PointF(10, 15));
        }

        using var ms = new MemoryStream();
        bmp.Save(ms, ImageFormat.Bmp);
        ms.Position = 0;
        var ras = ms.AsRandomAccessStream();
        var decoder = await BitmapDecoder.CreateAsync(ras);
        var sb = await decoder.GetSoftwareBitmapAsync();
        var result = await engine.RecognizeAsync(sb);

        Assert.Contains("Smart", result.Text);
        Assert.Contains("Copy", result.Text);
    }
}
