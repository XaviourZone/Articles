using System.Windows;
using SmartCopy.Core.Config;

namespace SmartCopy.UI;

public partial class SettingsWindow : Window
{
    private readonly AppSettings _settings;

    public SettingsWindow(AppSettings settings)
    {
        InitializeComponent();
        _settings = settings;

        LoadValues();
    }

    private void LoadValues()
    {
        ChkEnableSmartCopy.IsChecked = _settings.IsEnabled;
        ChkStartWithWindows.IsChecked = _settings.StartWithWindows;
        ChkMultiOrientation.IsChecked = _settings.MultiOrientationDetection;
        ChkDeskew.IsChecked = _settings.DeskewEnabled;
        ChkShowNotifications.IsChecked = _settings.ShowNotifications;
    }

    private void BtnSave_Click(object sender, RoutedEventArgs e)
    {
        _settings.IsEnabled = ChkEnableSmartCopy.IsChecked ?? true;
        bool startup = ChkStartWithWindows.IsChecked ?? false;
        _settings.ApplyStartupRegistry(startup);

        _settings.MultiOrientationDetection = ChkMultiOrientation.IsChecked ?? true;
        _settings.DeskewEnabled = ChkDeskew.IsChecked ?? true;
        _settings.ShowNotifications = ChkShowNotifications.IsChecked ?? true;

        _settings.Save();
        Close();
    }

    private void BtnClose_Click(object sender, RoutedEventArgs e)
    {
        Close();
    }
}
