using System;
using System.Threading;
using System.Windows;
using SmartCopy.Core.Config;
using SmartCopy.Core.Hooks;
using SmartCopy.Core.Ocr;
using SmartCopy.UI;
using Forms = System.Windows.Forms;

namespace SmartCopy;

public partial class App : System.Windows.Application
{
    private const string MutexName = "SmartCopy_SingleInstance_Mutex_9B8A7F";
    private Mutex? _mutex;
    private GlobalInputHookManager? _hookManager;
    private DualOcrEngine? _ocrEngine;
    private TrayApplicationContext? _trayContext;

    protected override void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);

        // Enforce single instance
        _mutex = new Mutex(true, MutexName, out bool createdNew);
        if (!createdNew)
        {
            Forms.MessageBox.Show(
                "Smart Copy is already running silently in the system tray.\n" +
                "Use Left Ctrl + Left Alt + Right Click to trigger OCR selection.",
                "Smart Copy",
                Forms.MessageBoxButtons.OK,
                Forms.MessageBoxIcon.Information);
            Shutdown();
            return;
        }

        try
        {
            // Load application settings
            var settings = AppSettings.Load();

            // Initialize global input hooks
            _hookManager = new GlobalInputHookManager();
            _hookManager.Start();

            // Initialize bundled Dual OCR engine (Windows Media OCR + Tesseract fallback)
            _ocrEngine = new DualOcrEngine();

            // Initialize tray icon and background coordinator
            _trayContext = new TrayApplicationContext(settings, _hookManager, _ocrEngine);
        }
        catch (Exception ex)
        {
            Forms.MessageBox.Show(
                $"Failed to start Smart Copy: {ex.Message}",
                "Smart Copy Error",
                Forms.MessageBoxButtons.OK,
                Forms.MessageBoxIcon.Error);
            Shutdown();
        }
    }

    protected override void OnExit(ExitEventArgs e)
    {
        _trayContext?.Dispose();
        _hookManager?.Dispose();
        _ocrEngine?.Dispose();

        if (_mutex != null)
        {
            try { _mutex.ReleaseMutex(); } catch { }
            _mutex.Dispose();
            _mutex = null;
        }

        base.OnExit(e);
    }
}
