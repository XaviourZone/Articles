using System.Collections.Generic;
using SmartCopy.Core.Models;
using SmartCopy.Core.Selection;
using Xunit;

namespace SmartCopy.Tests;

public class TextSelectionEngineTests
{
    [Fact]
    public void ExtractTextBetweenPoints_HorizontalSingleLine_ReconstructsInOrder()
    {
        var page = new OcrPage
        {
            OrientationAngle = 0,
            Words = new List<OcrWord>
            {
                new("The", new OcrRect(10, 50, 30, 20), 95f),
                new("quick", new OcrRect(45, 50, 40, 20), 92f),
                new("brown", new OcrRect(90, 50, 45, 20), 89f),
                new("fox", new OcrRect(140, 50, 25, 20), 96f)
            }
        };

        // Click start of "quick" and end of "brown"
        var start = new PointD(45, 60);
        var end = new PointD(135, 60);

        var result = TextSelectionEngine.ExtractTextBetweenPoints(page, start, end);

        Assert.Equal("quick brown", result.ExtractedText);
        Assert.Equal(2, result.SelectedWords.Count);
    }

    [Fact]
    public void ExtractTextBetweenPoints_MultiLineParagraph_PreservesLineBreaks()
    {
        var page = new OcrPage
        {
            OrientationAngle = 0,
            Words = new List<OcrWord>
            {
                // Line 1
                new("First", new OcrRect(10, 20, 40, 18), 90f),
                new("line", new OcrRect(55, 20, 35, 18), 90f),
                new("content", new OcrRect(95, 20, 60, 18), 90f),

                // Line 2
                new("Second", new OcrRect(10, 45, 50, 18), 91f),
                new("line", new OcrRect(65, 45, 35, 18), 91f),
                new("paragraph", new OcrRect(105, 45, 75, 18), 91f)
            }
        };

        var start = new PointD(10, 20);
        var end = new PointD(180, 65);

        var result = TextSelectionEngine.ExtractTextBetweenPoints(page, start, end);

        string expected = "First line content\r\nSecond line paragraph";
        Assert.Equal(expected, result.ExtractedText);
        Assert.Equal(6, result.SelectedWords.Count);
    }

    [Fact]
    public void ExtractTextBetweenPoints_EmptyPage_ReturnsEmpty()
    {
        var page = OcrPage.Empty;
        var result = TextSelectionEngine.ExtractTextBetweenPoints(page, new PointD(10, 10), new PointD(50, 50));

        Assert.Empty(result.ExtractedText);
        Assert.Empty(result.SelectedWords);
    }

    [Fact]
    public void ExtractTextBetweenPoints_VerticalText_ReconstructsColumnOrder()
    {
        var page = new OcrPage
        {
            OrientationAngle = 90,
            Words = new List<OcrWord>
            {
                new("Header", new OcrRect(100, 10, 50, 20), 90f),
                new("Item1", new OcrRect(100, 35, 50, 20), 90f),
                new("Item2", new OcrRect(100, 60, 50, 20), 90f)
            }
        };

        var start = new PointD(100, 10);
        var end = new PointD(150, 80);

        var result = TextSelectionEngine.ExtractTextBetweenPoints(page, start, end);

        Assert.Contains("Header", result.ExtractedText);
        Assert.Contains("Item1", result.ExtractedText);
        Assert.Contains("Item2", result.ExtractedText);
    }
}
