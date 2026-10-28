using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

namespace SmartCopy.Core.Display;

public static class ScreenCapture
{
    private const int SRCCOPY = 0x00CC0020;
    private const int CAPTUREBLT = 0x40000000;

    [DllImport("gdi32.dll")]
    private static extern bool BitBlt(IntPtr hdcDest, int nXDest, int nYDest, int nWidth, int nHeight,
                                     IntPtr hdcSrc, int nXSrc, int nYSrc, int dwRop);

    [DllImport("gdi32.dll")]
    private static extern IntPtr CreateCompatibleBitmap(IntPtr hdc, int nWidth, int nHeight);

    [DllImport("gdi32.dll")]
    private static extern IntPtr CreateCompatibleDC(IntPtr hdc);

    [DllImport("gdi32.dll")]
    private static extern bool DeleteDC(IntPtr hdc);

    [DllImport("gdi32.dll")]
    private static extern bool DeleteObject(IntPtr hObject);

    [DllImport("gdi32.dll")]
    private static extern IntPtr SelectObject(IntPtr hdc, IntPtr hgdiobj);

    [DllImport("user32.dll")]
    private static extern IntPtr GetDesktopWindow();

    [DllImport("user32.dll")]
    private static extern IntPtr GetWindowDC(IntPtr hWnd);

    [DllImport("user32.dll")]
    private static extern int ReleaseDC(IntPtr hWnd, IntPtr hDC);

    public static Bitmap CaptureRegion(Rectangle physicalBounds)
    {
        int width = physicalBounds.Width;
        int height = physicalBounds.Height;
        int x = physicalBounds.X;
        int y = physicalBounds.Y;

        IntPtr desktopWnd = GetDesktopWindow();
        IntPtr desktopDc = GetWindowDC(desktopWnd);
        IntPtr memDc = CreateCompatibleDC(desktopDc);
        IntPtr hBmp = CreateCompatibleBitmap(desktopDc, width, height);
        IntPtr oldBmp = SelectObject(memDc, hBmp);

        try
        {
            BitBlt(memDc, 0, 0, width, height, desktopDc, x, y, SRCCOPY | CAPTUREBLT);
            SelectObject(memDc, oldBmp);

            var capturedBitmap = Image.FromHbitmap(hBmp);
            // Convert to 24bpp RGB to be ideal for OCR
            var result = new Bitmap(width, height, PixelFormat.Format24bppRgb);
            using (var g = Graphics.FromImage(result))
            {
                g.DrawImage(capturedBitmap, 0, 0, width, height);
            }
            capturedBitmap.Dispose();
            return result;
        }
        finally
        {
            DeleteObject(hBmp);
            DeleteDC(memDc);
            ReleaseDC(desktopWnd, desktopDc);
        }
    }
}
