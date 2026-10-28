using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using SmartCopy.Core.Clipboard;
using SmartCopy.Core.Display;
using SmartCopy.Core.Models;
using SmartCopy.Core.Ocr;
using SmartCopy.Core.Selection;
using Point = System.Windows.Point;

namespace SmartCopy.UI;

public partial class SelectionOverlayWindow : Window
{
    private readonly MonitorInfo _monitor;
    private readonly IOcrEngine _ocrEngine;
    private Bitmap? _capturedBitmap;

    private Point? _startPointLogical;
    private bool _isProcessing = false;
    private bool _selectionCompleted = false;

    public event Action? SelectionFinished;

    public SelectionOverlayWindow(MonitorInfo monitor, IOcrEngine ocrEngine, Bitmap? preCapturedBitmap = null)
    {
        InitializeComponent();
        _monitor = monitor;
        _ocrEngine = ocrEngine;
        _capturedBitmap = preCapturedBitmap;

        Loaded += SelectionOverlayWindow_Loaded;
    }

    private void SelectionOverlayWindow_Loaded(object sender, RoutedEventArgs e)
    {
        // Position window precisely over the target monitor
        Left = _monitor.LogicalLeft;
        Top = _monitor.LogicalTop;
        Width = _monitor.LogicalWidth;
        Height = _monitor.LogicalHeight;

        Activate();
        Focus();

        // Fallback capture if not pre-captured
        if (_capturedBitmap == null)
        {
            try
            {
                _capturedBitmap = ScreenCapture.CaptureRegion(_monitor.PhysicalBounds);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"CaptureRegion error: {ex.Message}");
                CloseOverlay();
            }
        }
    }

    private void Window_PreviewMouseDown(object sender, MouseButtonEventArgs e)
    {
        if (_isProcessing || _selectionCompleted) return;

        if (e.ChangedButton == MouseButton.Right)
        {
            CloseOverlay();
            e.Handled = true;
            return;
        }

        if (e.ChangedButton == MouseButton.Left)
        {
            Point currentLogical = e.GetPosition(this);

            if (_startPointLogical == null)
            {
                // First click: Start point
                _startPointLogical = currentLogical;

                StartPointMarker.Visibility = Visibility.Visible;
                Canvas.SetLeft(StartPointMarker, currentLogical.X - StartPointMarker.Width / 2);
                Canvas.SetTop(StartPointMarker, currentLogical.Y - StartPointMarker.Height / 2);

                SelectionRect.Visibility = Visibility.Visible;
                Canvas.SetLeft(SelectionRect, currentLogical.X);
                Canvas.SetTop(SelectionRect, currentLogical.Y);
                SelectionRect.Width = 1;
                SelectionRect.Height = 1;

                HudText.Text = "Click end of text";
            }
            else
            {
                // Second click: End point -> trigger extraction
                Point endPointLogical = currentLogical;
                ExecuteExtraction(_startPointLogical.Value, endPointLogical);
            }
            e.Handled = true;
        }
    }

    private void Window_PreviewMouseMove(object sender, System.Windows.Input.MouseEventArgs e)
    {
        if (_startPointLogical == null || _isProcessing || _selectionCompleted) return;

        Point current = e.GetPosition(this);
        double x = Math.Min(_startPointLogical.Value.X, current.X);
        double y = Math.Min(_startPointLogical.Value.Y, current.Y);
        double w = Math.Abs(_startPointLogical.Value.X - current.X);
        double h = Math.Abs(_startPointLogical.Value.Y - current.Y);

        Canvas.SetLeft(SelectionRect, x);
        Canvas.SetTop(SelectionRect, y);
        SelectionRect.Width = Math.Max(1, w);
        SelectionRect.Height = Math.Max(1, h);
    }

    private void Window_PreviewKeyDown(object sender, System.Windows.Input.KeyEventArgs e)
    {
        if (e.Key == Key.Escape)
        {
            CloseOverlay();
            e.Handled = true;
        }
    }

    private async void ExecuteExtraction(Point startLog, Point endLog)
    {
        if (_capturedBitmap == null || _isProcessing) return;

        _isProcessing = true;
        HudText.Text = "Extracting text...";

        // Convert logical coordinates to monitor physical pixel space
        double pStartX = startLog.X * _monitor.DpiScaleX;
        double pStartY = startLog.Y * _monitor.DpiScaleY;
        double pEndX = endLog.X * _monitor.DpiScaleX;
        double pEndY = endLog.Y * _monitor.DpiScaleY;

        double minX = Math.Min(pStartX, pEndX);
        double maxX = Math.Max(pStartX, pEndX);
        double minY = Math.Min(pStartY, pEndY);
        double maxY = Math.Max(pStartY, pEndY);

        // Crop with padding around the selected region for fast, targeted OCR
        int padding = 24;
        int cropX = Math.Max(0, (int)Math.Floor(minX) - padding);
        int cropY = Math.Max(0, (int)Math.Floor(minY) - padding);
        int cropW = Math.Min(_capturedBitmap.Width - cropX, (int)Math.Ceiling(maxX - minX) + 2 * padding);
        int cropH = Math.Min(_capturedBitmap.Height - cropY, (int)Math.Ceiling(maxY - minY) + 2 * padding);

        if (cropW < 20 || cropH < 20)
        {
            cropW = Math.Max(40, cropW);
            cropH = Math.Max(40, cropH);
        }

        string extractedText = string.Empty;

        await Task.Run(() =>
        {
            try
            {
                using var cropped = new Bitmap(cropW, cropH, PixelFormat.Format24bppRgb);
                using (var g = Graphics.FromImage(cropped))
                {
                    g.DrawImage(_capturedBitmap, new Rectangle(0, 0, cropW, cropH),
                        new Rectangle(cropX, cropY, cropW, cropH), GraphicsUnit.Pixel);
                }

                // Upscale 2x for screen font OCR accuracy
                using var upscaled = new Bitmap(cropW * 2, cropH * 2, PixelFormat.Format24bppRgb);
                using (var g = Graphics.FromImage(upscaled))
                {
                    g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    g.SmoothingMode = SmoothingMode.HighQuality;
                    g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                    g.DrawImage(cropped, 0, 0, upscaled.Width, upscaled.Height);
                }

                // Recognize text in the upscaled crop
                var page = _ocrEngine.Recognize(upscaled, autoRotate: true, autoDeskew: true);
                if (!string.IsNullOrWhiteSpace(page.FullText))
                {
                    extractedText = page.FullText.Trim();
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Extraction error: {ex.Message}");
            }
        });

        if (!string.IsNullOrWhiteSpace(extractedText))
        {
            ClipboardManager.TrySetText(extractedText);

            _selectionCompleted = true;
            HudText.Text = $"Copied: {(extractedText.Length > 28 ? extractedText[..28] + "..." : extractedText)}";
            ToastText.Text = $"Copied {extractedText.Length} characters to clipboard!";
            ToastPill.Visibility = Visibility.Visible;

            await Task.Delay(500);
            CloseOverlay();
        }
        else
        {
            // Helpful user feedback when no text was detected
            HudText.Text = "No text detected in selected region. Try again.";
            await Task.Delay(1200);
            CloseOverlay();
        }
    }

    private void CloseOverlay()
    {
        _capturedBitmap?.Dispose();
        _capturedBitmap = null;

        SelectionFinished?.Invoke();
        Close();
    }

    protected override void OnClosed(EventArgs e)
    {
        base.OnClosed(e);
        _capturedBitmap?.Dispose();
        _capturedBitmap = null;
    }
}
