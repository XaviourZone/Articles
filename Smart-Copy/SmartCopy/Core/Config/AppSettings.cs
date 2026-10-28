using System;
using System.IO;
using System.Text.Json;
using Microsoft.Win32;

namespace SmartCopy.Core.Config;

public class AppSettings
{
    private static readonly string SettingsDir = Path.Combine(
        Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "SmartCopy");
    private static readonly string SettingsPath = Path.Combine(SettingsDir, "settings.json");

    public bool IsEnabled { get; set; } = true;
    public bool StartWithWindows { get; set; } = false;
    public bool UseDefaultGesture { get; set; } = true;
    public bool MultiOrientationDetection { get; set; } = true;
    public bool DeskewEnabled { get; set; } = true;
    public float MinConfidence { get; set; } = 25.0f;
    public bool ShowNotifications { get; set; } = true;
    public bool PlaySoundOnCopy { get; set; } = false;
    public string OcrLanguage { get; set; } = "eng";

    private static readonly JsonSerializerOptions JsonOptions = new() { WriteIndented = true };

    public static AppSettings Load()
    {
        try
        {
            if (File.Exists(SettingsPath))
            {
                var json = File.ReadAllText(SettingsPath);
                var settings = JsonSerializer.Deserialize<AppSettings>(json, JsonOptions);
                if (settings != null) return settings;
            }
        }
        catch
        {
            // Fallback to defaults on corrupt config
        }

        var defaultSettings = new AppSettings();
        defaultSettings.Save();
        return defaultSettings;
    }

    public void Save()
    {
        try
        {
            if (!Directory.Exists(SettingsDir))
            {
                Directory.CreateDirectory(SettingsDir);
            }
            var json = JsonSerializer.Serialize(this, JsonOptions);
            File.WriteAllText(SettingsPath, json);
        }
        catch
        {
            // Silently ignore or log diagnostics
        }
    }

    public void ApplyStartupRegistry(bool enable)
    {
        StartWithWindows = enable;
        Save();

        try
        {
            using var key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Run", true);
            if (key == null) return;

            string exePath = Environment.ProcessPath ?? Path.Combine(AppContext.BaseDirectory, "SmartCopy.exe");
            if (enable)
            {
                key.SetValue("SmartCopy", $"\"{exePath}\" --silent");
            }
            else
            {
                if (key.GetValue("SmartCopy") != null)
                {
                    key.DeleteValue("SmartCopy", false);
                }
            }
        }
        catch
        {
            // Registry write error handling
        }
    }
}
