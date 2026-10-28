using SmartCopy.Core.Clipboard;
using SmartCopy.Core.Models;
using SmartCopy.Core.Ocr;
using Xunit;

namespace SmartCopy.Tests;

public class OrientationTransformTests
{
    [Fact]
    public void InverseTransformRect_0Degrees_ReturnsIdentical()
    {
        var original = new OcrRect(20, 30, 100, 40);
        var transformed = ImagePreprocessor.InverseTransformRect(original, 800, 600, 0);

        Assert.Equal(original, transformed);
    }

    [Fact]
    public void InverseTransformRect_90Degrees_CorrectlyReversesCoordinates()
    {
        int origW = 800;
        int origH = 600;

        // An original rect at (100, 150) of size (80, 40)
        // In 90-degree CW image:
        // rotW = origH = 600, rotH = origW = 800
        // rotX = origH - 1 - (origY + h) = 600 - 150 - 40 = 410
        // rotY = origX = 100
        // rotWidth = 40, rotHeight = 80
        var rotRect = new OcrRect(410, 100, 40, 80);

        var inverted = ImagePreprocessor.InverseTransformRect(rotRect, origW, origH, 90);

        Assert.Equal(100, inverted.X);
        Assert.Equal(150, inverted.Y);
        Assert.Equal(80, inverted.Width);
        Assert.Equal(40, inverted.Height);
    }

    [Fact]
    public void InverseTransformRect_180Degrees_CorrectlyReversesCoordinates()
    {
        int origW = 800;
        int origH = 600;

        var rotRect = new OcrRect(800 - 100 - 50, 600 - 200 - 30, 50, 30);
        var inverted = ImagePreprocessor.InverseTransformRect(rotRect, origW, origH, 180);

        Assert.Equal(100, inverted.X);
        Assert.Equal(200, inverted.Y);
        Assert.Equal(50, inverted.Width);
        Assert.Equal(30, inverted.Height);
    }
}

public class ClipboardTests
{
    [Fact]
    public void TrySetText_EmptyOrNull_ReturnsFalseWithoutAlteringClipboard()
    {
        Assert.False(ClipboardManager.TrySetText(""));
        Assert.False(ClipboardManager.TrySetText(null!));
    }
}
