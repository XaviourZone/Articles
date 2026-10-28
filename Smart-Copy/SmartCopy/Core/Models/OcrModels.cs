using System;
using System.Collections.Generic;
using System.Linq;

namespace SmartCopy.Core.Models;

public readonly record struct PointD(double X, double Y)
{
    public double DistanceTo(PointD other)
    {
        double dx = X - other.X;
        double dy = Y - other.Y;
        return Math.Sqrt(dx * dx + dy * dy);
    }

    public static PointD Empty => new(0, 0);
}

public readonly record struct OcrRect(double X, double Y, double Width, double Height)
{
    public double Left => X;
    public double Top => Y;
    public double Right => X + Width;
    public double Bottom => Y + Height;
    public PointD Center => new(X + Width / 2.0, Y + Height / 2.0);

    public bool Contains(PointD p) =>
        p.X >= Left && p.X <= Right && p.Y >= Top && p.Y <= Bottom;

    public bool Contains(double x, double y) =>
        x >= Left && x <= Right && y >= Top && y <= Bottom;

    public bool IntersectsWith(OcrRect other) =>
        Left < other.Right && Right > other.Left && Top < other.Bottom && Bottom > other.Top;

    public static OcrRect FromPoints(PointD p1, PointD p2)
    {
        double x = Math.Min(p1.X, p2.X);
        double y = Math.Min(p1.Y, p2.Y);
        double w = Math.Abs(p1.X - p2.X);
        double h = Math.Abs(p1.Y - p2.Y);
        return new OcrRect(x, y, w, h);
    }
}

public class OcrWord
{
    public string Text { get; set; } = string.Empty;
    public OcrRect BoundingBox { get; set; }
    public float Confidence { get; set; }

    public OcrWord() { }

    public OcrWord(string text, OcrRect boundingBox, float confidence)
    {
        Text = text;
        BoundingBox = boundingBox;
        Confidence = confidence;
    }

    public override string ToString() => $"{Text} [{Confidence:F1}%] ({BoundingBox.X:F0},{BoundingBox.Y:F0})";
}

public class OcrLine
{
    public List<OcrWord> Words { get; set; } = new();
    public OcrRect BoundingBox { get; set; }
    public string Text => string.Join(" ", Words.Select(w => w.Text));
}

public class OcrPage
{
    public string FullText { get; set; } = string.Empty;
    public List<OcrWord> Words { get; set; } = new();
    public List<OcrLine> Lines { get; set; } = new();
    public int OrientationAngle { get; set; }
    public float MeanConfidence { get; set; }

    public static OcrPage Empty => new()
    {
        FullText = string.Empty,
        Words = new List<OcrWord>(),
        Lines = new List<OcrLine>(),
        OrientationAngle = 0,
        MeanConfidence = 0
    };
}
