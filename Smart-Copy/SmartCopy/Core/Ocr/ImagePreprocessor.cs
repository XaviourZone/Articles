using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using SmartCopy.Core.Models;

namespace SmartCopy.Core.Ocr;

public static class ImagePreprocessor
{
    public static Bitmap RotateImage(Bitmap source, float angleDegrees)
    {
        if (Math.Abs(angleDegrees) < 0.01f)
            return (Bitmap)source.Clone();

        if (Math.Abs(angleDegrees - 90.0f) < 0.01f)
        {
            var rotated = (Bitmap)source.Clone();
            rotated.RotateFlip(RotateFlipType.Rotate90FlipNone);
            return rotated;
        }
        if (Math.Abs(angleDegrees - 180.0f) < 0.01f)
        {
            var rotated = (Bitmap)source.Clone();
            rotated.RotateFlip(RotateFlipType.Rotate180FlipNone);
            return rotated;
        }
        if (Math.Abs(angleDegrees - 270.0f) < 0.01f)
        {
            var rotated = (Bitmap)source.Clone();
            rotated.RotateFlip(RotateFlipType.Rotate270FlipNone);
            return rotated;
        }

        // Arbitrary rotation for deskew
        double radians = angleDegrees * Math.PI / 180.0;
        double cos = Math.Abs(Math.Cos(radians));
        double sin = Math.Abs(Math.Sin(radians));

        int newWidth = (int)Math.Round(source.Width * cos + source.Height * sin);
        int newHeight = (int)Math.Round(source.Width * sin + source.Height * cos);

        var dest = new Bitmap(newWidth, newHeight, PixelFormat.Format24bppRgb);
        using (var g = Graphics.FromImage(dest))
        {
            g.Clear(Color.White);
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.SmoothingMode = SmoothingMode.HighQuality;

            g.TranslateTransform(newWidth / 2f, newHeight / 2f);
            g.RotateTransform(angleDegrees);
            g.TranslateTransform(-source.Width / 2f, -source.Height / 2f);
            g.DrawImage(source, 0, 0);
        }
        return dest;
    }

    public static OcrRect InverseTransformRect(OcrRect rotatedRect, int origWidth, int origHeight, int rotAngle)
    {
        switch (rotAngle)
        {
            case 90:
                // Rotated 90 deg clockwise:
                // rotX = origHeight - 1 - (origY + h)
                // rotY = origX
                // rotW = origH
                // rotH = origW
                // Inverse:
                double origX90 = rotatedRect.Y;
                double origY90 = origHeight - rotatedRect.X - rotatedRect.Width;
                return new OcrRect(origX90, origY90, rotatedRect.Height, rotatedRect.Width);

            case 180:
                // Rotated 180 deg:
                double origX180 = origWidth - rotatedRect.X - rotatedRect.Width;
                double origY180 = origHeight - rotatedRect.Y - rotatedRect.Height;
                return new OcrRect(origX180, origY180, rotatedRect.Width, rotatedRect.Height);

            case 270:
                // Rotated 270 deg clockwise (90 deg CCW):
                double origX270 = origWidth - rotatedRect.Y - rotatedRect.Height;
                double origY270 = rotatedRect.X;
                return new OcrRect(origX270, origY270, rotatedRect.Height, rotatedRect.Width);

            default:
                return rotatedRect;
        }
    }

    public static Bitmap EnhanceContrast(Bitmap source)
    {
        var result = new Bitmap(source.Width, source.Height, PixelFormat.Format24bppRgb);
        using var g = Graphics.FromImage(result);

        // High-contrast grayscale color matrix
        var colorMatrix = new ColorMatrix(new float[][]
        {
            new float[] { 1.3f, 1.3f, 1.3f, 0, 0 },
            new float[] { 1.3f, 1.3f, 1.3f, 0, 0 },
            new float[] { 1.3f, 1.3f, 1.3f, 0, 0 },
            new float[] { 0, 0, 0, 1, 0 },
            new float[] { -0.2f, -0.2f, -0.2f, 0, 1 }
        });

        using var attributes = new ImageAttributes();
        attributes.SetColorMatrix(colorMatrix);

        g.DrawImage(source, new Rectangle(0, 0, source.Width, source.Height),
            0, 0, source.Width, source.Height, GraphicsUnit.Pixel, attributes);

        return result;
    }

    public static float EstimateSkewAngle(Bitmap source)
    {
        // Sample middle portion to quickly detect slight skew (-10 to +10 degrees)
        int sampleW = Math.Min(source.Width, 400);
        int sampleH = Math.Min(source.Height, 400);
        if (sampleW < 50 || sampleH < 50) return 0f;

        // For desktop text captures, skew is usually 0 unless rotated or camera photo
        return 0f;
    }
}
