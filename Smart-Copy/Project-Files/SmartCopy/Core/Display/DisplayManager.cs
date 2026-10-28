using System;
using System.Collections.Generic;
using System.Drawing;
using System.Runtime.InteropServices;
using System.Windows.Forms;

namespace SmartCopy.Core.Display;

public class MonitorInfo
{
    public string DeviceName { get; set; } = string.Empty;
    public Rectangle PhysicalBounds { get; set; }
    public double DpiScaleX { get; set; } = 1.0;
    public double DpiScaleY { get; set; } = 1.0;
    public bool IsPrimary { get; set; }

    public double LogicalLeft => PhysicalBounds.Left / DpiScaleX;
    public double LogicalTop => PhysicalBounds.Top / DpiScaleY;
    public double LogicalWidth => PhysicalBounds.Width / DpiScaleX;
    public double LogicalHeight => PhysicalBounds.Height / DpiScaleY;
}

public static class DisplayManager
{
    [DllImport("shcore.dll")]
    private static extern int GetDpiForMonitor(IntPtr hmonitor, int dpiType, out uint dpiX, out uint dpiY);

    [DllImport("user32.dll")]
    private static extern IntPtr MonitorFromPoint(POINT pt, uint dwFlags);

    private const int MDT_EFFECTIVE_DPI = 0;
    private const uint MONITOR_DEFAULTTONEAREST = 2;

    [StructLayout(LayoutKind.Sequential)]
    private struct POINT
    {
        public int x;
        public int y;
    }

    public static List<MonitorInfo> GetAllMonitors()
    {
        var list = new List<MonitorInfo>();
        foreach (var screen in Screen.AllScreens)
        {
            var info = new MonitorInfo
            {
                DeviceName = screen.DeviceName,
                PhysicalBounds = screen.Bounds,
                IsPrimary = screen.Primary
            };

            GetMonitorDpi(screen, out double scaleX, out double scaleY);
            info.DpiScaleX = scaleX;
            info.DpiScaleY = scaleY;

            list.Add(info);
        }
        return list;
    }

    public static MonitorInfo GetMonitorAtPoint(int x, int y)
    {
        var screen = Screen.FromPoint(new Point(x, y));
        var info = new MonitorInfo
        {
            DeviceName = screen.DeviceName,
            PhysicalBounds = screen.Bounds,
            IsPrimary = screen.Primary
        };

        GetMonitorDpi(screen, out double scaleX, out double scaleY);
        info.DpiScaleX = scaleX;
        info.DpiScaleY = scaleY;

        return info;
    }

    private static void GetMonitorDpi(Screen screen, out double scaleX, out double scaleY)
    {
        scaleX = 1.0;
        scaleY = 1.0;
        try
        {
            var pt = new POINT { x = screen.Bounds.Left + 10, y = screen.Bounds.Top + 10 };
            IntPtr hMon = MonitorFromPoint(pt, MONITOR_DEFAULTTONEAREST);
            if (hMon != IntPtr.Zero)
            {
                int hr = GetDpiForMonitor(hMon, MDT_EFFECTIVE_DPI, out uint dpiX, out uint dpiY);
                if (hr == 0 && dpiX > 0 && dpiY > 0)
                {
                    scaleX = dpiX / 96.0;
                    scaleY = dpiY / 96.0;
                }
            }
        }
        catch
        {
            // Fallback to 1.0 if GetDpiForMonitor is unavailable
        }
    }
}
