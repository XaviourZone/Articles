using System;
using System.Runtime.InteropServices;
using System.Threading;
using System.Windows;

namespace SmartCopy.Core.Clipboard;

public static class ClipboardManager
{
    private const int MaxRetries = 10;
    private const int RetryDelayMs = 50;

    public static bool TrySetText(string text)
    {
        if (string.IsNullOrEmpty(text))
            return false;

        for (int i = 0; i < MaxRetries; i++)
        {
            try
            {
                // Must run on STA thread or Dispatcher
                if (Thread.CurrentThread.GetApartmentState() == ApartmentState.STA)
                {
                    System.Windows.Clipboard.SetDataObject(text, true);
                    return true;
                }
                else
                {
                    bool success = false;
                    var thread = new Thread(() =>
                    {
                        try
                        {
                            System.Windows.Clipboard.SetDataObject(text, true);
                            success = true;
                        }
                        catch
                        {
                            success = false;
                        }
                    });
                    thread.SetApartmentState(ApartmentState.STA);
                    thread.Start();
                    thread.Join();

                    if (success) return true;
                }
            }
            catch (COMException)
            {
                // Clipboard locked by another process, retry
                Thread.Sleep(RetryDelayMs);
            }
            catch (Exception)
            {
                Thread.Sleep(RetryDelayMs);
            }
        }

        return false;
    }
}
