using System;
using System.Drawing;
using System.IO;
using System.Windows.Forms;
using SmartCopy.Core.Config;
using SmartCopy.Core.Display;
using SmartCopy.Core.Hooks;
using SmartCopy.Core.Ocr;
using Application = System.Windows.Application;

namespace SmartCopy.UI;

public class TrayApplicationContext : IDisposable
{
    private readonly NotifyIcon _notifyIcon;
    private readonly AppSettings _settings;
    private readonly GlobalInputHookManager _hookManager;
    private readonly IOcrEngine _ocrEngine;

    private SelectionOverlayWindow? _activeOverlay;
    private SettingsWindow? _settingsWindow;
    private bool _isPaused = false;
    private bool _isDisposed = false;

    public TrayApplicationContext(AppSettings settings, GlobalInputHookManager hookManager, IOcrEngine ocrEngine)
    {
        _settings = settings;
        _hookManager = hookManager;
        _ocrEngine = ocrEngine;

        _notifyIcon = new NotifyIcon();
        InitializeTrayIcon();

        _hookManager.TriggerActivated += OnHookTriggerActivated;
        _hookManager.EscapePressed += OnHookEscapePressed;
    }

    private void InitializeTrayIcon()
    {
        Icon? appIcon = null;
        string iconPath = Path.Combine(AppContext.BaseDirectory, "app.ico");
        if (File.Exists(iconPath))
        {
            try { appIcon = new Icon(iconPath); } catch { }
        }
        
        if (appIcon == null)
        {
            try
            {
                string? processPath = Environment.ProcessPath;
                if (!string.IsNullOrEmpty(processPath) && File.Exists(processPath))
                {
                    appIcon = Icon.ExtractAssociatedIcon(processPath);
                }
            }
            catch { }
        }

        appIcon ??= SystemIcons.Application;

        _notifyIcon.Icon = appIcon;
        _notifyIcon.Text = "Smart Copy - Universal OCR Selection";
        _notifyIcon.Visible = true;
        _notifyIcon.DoubleClick += (s, e) => ShowSettings();

        RebuildContextMenu();
    }

    private void RebuildContextMenu()
    {
        var menu = new ContextMenuStrip();

        // 1. Settings
        var itemSettings = new ToolStripMenuItem("Smart Copy Settings...", null, (s, e) => ShowSettings())
        {
            Font = new Font(menu.Font, System.Drawing.FontStyle.Bold)
        };
        menu.Items.Add(itemSettings);
        menu.Items.Add(new ToolStripSeparator());

        // 2. Enable/Disable
        var itemEnable = new ToolStripMenuItem("Enabled", null, (s, e) => ToggleEnabled());
        itemEnable.Checked = _settings.IsEnabled;
        menu.Items.Add(itemEnable);

        // 3. Pause/Resume
        var itemPause = new ToolStripMenuItem(_isPaused ? "Resume Selection" : "Pause Selection", null, (s, e) => TogglePause());
        menu.Items.Add(itemPause);

        // 4. Start with Windows
        var itemStartup = new ToolStripMenuItem("Start with Windows", null, (s, e) => ToggleStartup());
        itemStartup.Checked = _settings.StartWithWindows;
        menu.Items.Add(itemStartup);

        menu.Items.Add(new ToolStripSeparator());

        // 5. About
        menu.Items.Add(new ToolStripMenuItem("About Smart Copy", null, (s, e) => ShowAbout()));

        // 6. View Logs
        menu.Items.Add(new ToolStripMenuItem("View Diagnostic Logs", null, (s, e) => OpenLogs()));

        menu.Items.Add(new ToolStripSeparator());

        // 7. Exit
        menu.Items.Add(new ToolStripMenuItem("Exit Smart Copy", null, (s, e) => ExitApplication()));

        _notifyIcon.ContextMenuStrip = menu;
    }

    private void OnHookTriggerActivated(int screenX, int screenY)
    {
        if (!_settings.IsEnabled || _isPaused) return;

        // Capture screen immediately before creating or displaying the overlay
        var monitor = DisplayManager.GetMonitorAtPoint(screenX, screenY);
        Bitmap? screenshot = null;
        try
        {
            screenshot = ScreenCapture.CaptureRegion(monitor.PhysicalBounds);
        }
        catch { }

        Application.Current?.Dispatcher.Invoke(() =>
        {
            if (_activeOverlay != null)
            {
                screenshot?.Dispose();
                return;
            }

            _hookManager.IsSelectionActive = true;

            _activeOverlay = new SelectionOverlayWindow(monitor, _ocrEngine, screenshot);
            _activeOverlay.SelectionFinished += () =>
            {
                _hookManager.IsSelectionActive = false;
                _activeOverlay = null;
            };

            _activeOverlay.Show();
        });
    }

    private void OnHookEscapePressed()
    {
        Application.Current?.Dispatcher.Invoke(() =>
        {
            if (_activeOverlay != null)
            {
                _activeOverlay.Close();
                _activeOverlay = null;
                _hookManager.IsSelectionActive = false;
            }
        });
    }

    private void ToggleEnabled()
    {
        _settings.IsEnabled = !_settings.IsEnabled;
        _settings.Save();
        _hookManager.IsActive = _settings.IsEnabled && !_isPaused;
        RebuildContextMenu();
    }

    private void TogglePause()
    {
        _isPaused = !_isPaused;
        _hookManager.IsActive = _settings.IsEnabled && !_isPaused;
        RebuildContextMenu();
    }

    private void ToggleStartup()
    {
        bool newState = !_settings.StartWithWindows;
        _settings.ApplyStartupRegistry(newState);
        RebuildContextMenu();
    }

    public void ShowSettings()
    {
        Application.Current?.Dispatcher.Invoke(() =>
        {
            if (_settingsWindow == null || !_settingsWindow.IsLoaded)
            {
                _settingsWindow = new SettingsWindow(_settings);
                _settingsWindow.Closed += (s, e) =>
                {
                    _settingsWindow = null;
                    RebuildContextMenu();
                };
                _settingsWindow.Show();
            }
            else
            {
                _settingsWindow.Activate();
            }
        });
    }

    private void ShowAbout()
    {
        MessageBox.Show(
            "Smart Copy — Universal Windows OCR Selection Utility\nVersion 1.0.0\n\n" +
            "Trigger: Hold Left Ctrl + Left Alt and Right-Click anywhere to select and copy text.\n\n" +
            "100% Offline • Bundled Tesseract 5 • Privacy-First",
            "About Smart Copy",
            MessageBoxButtons.OK,
            MessageBoxIcon.Information);
    }

    private void OpenLogs()
    {
        string logDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "SmartCopy");
        if (!Directory.Exists(logDir)) Directory.CreateDirectory(logDir);
        string logFile = Path.Combine(logDir, "diagnostic.log");
        if (!File.Exists(logFile))
        {
            File.WriteAllText(logFile, $"Smart Copy v1.0.0 Log initialized at {DateTime.Now}\nEngine: Tesseract 5 Bundled (Offline)\nNo telemetry enabled.\n");
        }
        System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
        {
            FileName = logFile,
            UseShellExecute = true
        });
    }

    private void ExitApplication()
    {
        _notifyIcon.Visible = false;
        Application.Current?.Dispatcher.Invoke(() =>
        {
            Application.Current.Shutdown();
        });
    }

    public void Dispose()
    {
        if (!_isDisposed)
        {
            _notifyIcon.Visible = false;
            _notifyIcon.Dispose();
            _isDisposed = true;
        }
        GC.SuppressFinalize(this);
    }
}
