using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SmartCopy.Core.Models;

namespace SmartCopy.Core.Selection;

public class TextSelectionEngine
{
    public static SelectionResult ExtractTextBetweenPoints(
        OcrPage page,
        PointD startPoint,
        PointD endPoint,
        double padding = 8.0)
    {
        if (page.Words.Count == 0)
        {
            return new SelectionResult(string.Empty, new List<OcrWord>(), new OcrRect(0, 0, 0, 0));
        }

        // Determine selection bounds
        double minX = Math.Min(startPoint.X, endPoint.X);
        double maxX = Math.Max(startPoint.X, endPoint.X);
        double minY = Math.Min(startPoint.Y, endPoint.Y) - padding;
        double maxY = Math.Max(startPoint.Y, endPoint.Y) + padding;

        var selectionBox = new OcrRect(minX - padding, minY, Math.Max(1.0, maxX - minX + 2 * padding), Math.Max(1.0, maxY - minY));

        // A word is selected if:
        // 1. Its center falls within the horizontal and vertical range (with small tolerance)
        // 2. OR it directly contains the startPoint or endPoint
        var selectedWords = page.Words.Where(w =>
            w.BoundingBox.Contains(startPoint) ||
            w.BoundingBox.Contains(endPoint) ||
            (w.BoundingBox.Center.X >= minX - 2.0 &&
             w.BoundingBox.Center.X <= maxX + 2.0 &&
             w.BoundingBox.Center.Y >= minY &&
             w.BoundingBox.Center.Y <= maxY)
        ).ToList();

        if (selectedWords.Count == 0)
        {
            // If no word directly overlaps, find closest word to startPoint or endPoint within reasonable distance
            var closest = page.Words
                .OrderBy(w => Math.Min(w.BoundingBox.Center.DistanceTo(startPoint), w.BoundingBox.Center.DistanceTo(endPoint)))
                .FirstOrDefault();

            if (closest != null &&
                (closest.BoundingBox.Center.DistanceTo(startPoint) < 40.0 || closest.BoundingBox.Center.DistanceTo(endPoint) < 40.0))
            {
                selectedWords.Add(closest);
            }
        }

        if (selectedWords.Count == 0)
        {
            return new SelectionResult(string.Empty, new List<OcrWord>(), selectionBox);
        }

        // Check if text orientation is predominantly vertical (90 deg or 270 deg)
        bool isVertical = page.OrientationAngle == 90 || page.OrientationAngle == 270;
        string reconstructedText = isVertical
            ? ReconstructVerticalText(selectedWords)
            : ReconstructHorizontalText(selectedWords);

        // Calculate enclosing bounding box of all selected words
        double rMinX = selectedWords.Min(w => w.BoundingBox.Left);
        double rMinY = selectedWords.Min(w => w.BoundingBox.Top);
        double rMaxX = selectedWords.Max(w => w.BoundingBox.Right);
        double rMaxY = selectedWords.Max(w => w.BoundingBox.Bottom);

        var enclosingBox = new OcrRect(rMinX, rMinY, rMaxX - rMinX, rMaxY - rMinY);

        return new SelectionResult(reconstructedText.Trim(), selectedWords, enclosingBox);
    }

    private static string ReconstructHorizontalText(List<OcrWord> words)
    {
        if (words.Count == 0) return string.Empty;

        // Group words into lines by comparing Y center within a vertical threshold
        double avgHeight = words.Average(w => w.BoundingBox.Height);
        double lineThreshold = Math.Max(6.0, avgHeight * 0.55);

        var lines = new List<List<OcrWord>>();
        var sortedByY = words.OrderBy(w => w.BoundingBox.Center.Y).ToList();

        foreach (var word in sortedByY)
        {
            var matchedLine = lines.FirstOrDefault(line =>
            {
                double lineAvgY = line.Average(w => w.BoundingBox.Center.Y);
                return Math.Abs(word.BoundingBox.Center.Y - lineAvgY) <= lineThreshold;
            });

            if (matchedLine != null)
            {
                matchedLine.Add(word);
            }
            else
            {
                lines.Add(new List<OcrWord> { word });
            }
        }

        // Sort lines top-to-bottom
        lines = lines.OrderBy(l => l.Average(w => w.BoundingBox.Center.Y)).ToList();

        var sb = new StringBuilder();
        for (int i = 0; i < lines.Count; i++)
        {
            var line = lines[i];
            // Sort words within line left-to-right
            var sortedLineWords = line.OrderBy(w => w.BoundingBox.Left).ToList();

            string lineText = string.Join(" ", sortedLineWords.Select(w => w.Text));
            sb.Append(lineText);

            if (i < lines.Count - 1)
            {
                sb.AppendLine();
            }
        }

        return sb.ToString();
    }

    private static string ReconstructVerticalText(List<OcrWord> words)
    {
        if (words.Count == 0) return string.Empty;

        double avgWidth = words.Average(w => w.BoundingBox.Width);
        double colThreshold = Math.Max(6.0, avgWidth * 0.55);

        var columns = new List<List<OcrWord>>();
        var sortedByX = words.OrderBy(w => w.BoundingBox.Center.X).ToList();

        foreach (var word in sortedByX)
        {
            var matchedCol = columns.FirstOrDefault(col =>
            {
                double colAvgX = col.Average(w => w.BoundingBox.Center.X);
                return Math.Abs(word.BoundingBox.Center.X - colAvgX) <= colThreshold;
            });

            if (matchedCol != null)
            {
                matchedCol.Add(word);
            }
            else
            {
                columns.Add(new List<OcrWord> { word });
            }
        }

        columns = columns.OrderBy(c => c.Average(w => w.BoundingBox.Center.X)).ToList();

        var sb = new StringBuilder();
        for (int i = 0; i < columns.Count; i++)
        {
            var col = columns[i];
            var sortedColWords = col.OrderBy(w => w.BoundingBox.Top).ToList();

            string colText = string.Join(" ", sortedColWords.Select(w => w.Text));
            sb.Append(colText);

            if (i < columns.Count - 1)
            {
                sb.AppendLine();
            }
        }

        return sb.ToString();
    }
}

public class SelectionResult
{
    public string ExtractedText { get; set; }
    public List<OcrWord> SelectedWords { get; set; }
    public OcrRect InferredRegion { get; set; }

    public SelectionResult(string extractedText, List<OcrWord> selectedWords, OcrRect inferredRegion)
    {
        ExtractedText = extractedText;
        SelectedWords = selectedWords;
        InferredRegion = inferredRegion;
    }
}
