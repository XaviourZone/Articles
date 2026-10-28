using System;
using System.Diagnostics;
using System.Runtime.InteropServices;

namespace SmartCopy.Core.Hooks;

public sealed class GlobalInputHookManager : IDisposable
{
    private const int WH_KEYBOARD_LL = 13;
    private const int WH_MOUSE_LL = 14;

    private const int WM_RBUTTONDOWN = 0x0204;
    private const int WM_RBUTTONUP = 0x0205;
    private const int WM_KEYDOWN = 0x0100;
    private const int WM_SYSKEYDOWN = 0x0104;

    private const int VK_ESCAPE = 0x1B;
    private const int VK_LCONTROL = 0xA2;
    private const int VK_RCONTROL = 0xA3;
    private const int VK_LMENU = 0xA4;    // Left Alt
    private const int VK_RMENU = 0xA5;    // Right Alt

    private delegate IntPtr LowLevelProc(int nCode, IntPtr wParam, IntPtr lParam);

    [StructLayout(LayoutKind.Sequential)]
    private struct POINT
    {
        public int x;
        public int y;
    }

    [StructLayout(LayoutKind.Sequential)]
    private struct MSLLHOOKSTRUCT
    {
        public POINT pt;
        public uint mouseData;
        public uint flags;
        public uint time;
        public IntPtr dwExtraInfo;
    }

    [StructLayout(LayoutKind.Sequential)]
    private struct KBDLLHOOKSTRUCT
    {
        public uint vkCode;
        public uint scanCode;
        public uint flags;
        public uint time;
        public IntPtr dwExtraInfo;
    }

    [DllImport("user32.dll", SetLastError = true)]
    private static extern IntPtr SetWindowsHookEx(int idHook, LowLevelProc lpfn, IntPtr hMod, uint dwThreadId);

    [DllImport("user32.dll", SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool UnhookWindowsHookEx(IntPtr hhk);

    [DllImport("user32.dll")]
    private static extern IntPtr CallNextHookEx(IntPtr hhk, int nCode, IntPtr wParam, IntPtr lParam);

    [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern IntPtr GetModuleHandle(string? lpModuleName);

    [DllImport("user32.dll")]
    private static extern short GetAsyncKeyState(int vKey);

    private IntPtr _mouseHookId = IntPtr.Zero;
    private IntPtr _keyboardHookId = IntPtr.Zero;
    private readonly LowLevelProc _mouseProc;
    private readonly LowLevelProc _keyboardProc;

    private bool _swallowingRButtonUp = false;
    private bool _isDisposed = false;

    public bool IsActive { get; set; } = true;
    public bool IsSelectionActive { get; set; } = false;

    public event Action<int, int>? TriggerActivated;
    public event Action? EscapePressed;

    public GlobalInputHookManager()
    {
        _mouseProc = MouseHookCallback;
        _keyboardProc = KeyboardHookCallback;
    }

    public void Start()
    {
        if (_mouseHookId != IntPtr.Zero || _keyboardHookId != IntPtr.Zero)
            return;

        using var curProcess = Process.GetCurrentProcess();
        using var curModule = curProcess.MainModule;
        var hMod = GetModuleHandle(curModule?.ModuleName);

        _mouseHookId = SetWindowsHookEx(WH_MOUSE_LL, _mouseProc, hMod, 0);
        _keyboardHookId = SetWindowsHookEx(WH_KEYBOARD_LL, _keyboardProc, hMod, 0);
    }

    public void Stop()
    {
        if (_mouseHookId != IntPtr.Zero)
        {
            UnhookWindowsHookEx(_mouseHookId);
            _mouseHookId = IntPtr.Zero;
        }

        if (_keyboardHookId != IntPtr.Zero)
        {
            UnhookWindowsHookEx(_keyboardHookId);
            _keyboardHookId = IntPtr.Zero;
        }
    }

    private IntPtr MouseHookCallback(int nCode, IntPtr wParam, IntPtr lParam)
    {
        if (nCode >= 0 && IsActive)
        {
            int msg = wParam.ToInt32();

            if (msg == WM_RBUTTONDOWN)
            {
                // Check exact gesture: Left Ctrl + Left Alt held, but NOT Right Ctrl or Right Alt
                bool isLeftCtrl = (GetAsyncKeyState(VK_LCONTROL) & 0x8000) != 0;
                bool isRightCtrl = (GetAsyncKeyState(VK_RCONTROL) & 0x8000) != 0;
                bool isLeftAlt = (GetAsyncKeyState(VK_LMENU) & 0x8000) != 0;
                bool isRightAlt = (GetAsyncKeyState(VK_RMENU) & 0x8000) != 0;

                if (isLeftCtrl && !isRightCtrl && isLeftAlt && !isRightAlt && !IsSelectionActive)
                {
                    var hookStruct = Marshal.PtrToStructure<MSLLHOOKSTRUCT>(lParam);
                    _swallowingRButtonUp = true;

                    // Trigger gesture asynchronously to not block the Windows hook queue
                    int x = hookStruct.pt.x;
                    int y = hookStruct.pt.y;
                    System.Threading.ThreadPool.QueueUserWorkItem(_ =>
                    {
                        TriggerActivated?.Invoke(x, y);
                    });

                    // Swallow right-click so context menu doesn't appear
                    return (IntPtr)1;
                }
            }
            else if (msg == WM_RBUTTONUP)
            {
                if (_swallowingRButtonUp)
                {
                    _swallowingRButtonUp = false;
                    return (IntPtr)1; // Swallow corresponding release
                }
            }
        }

        return CallNextHookEx(_mouseHookId, nCode, wParam, lParam);
    }

    private IntPtr KeyboardHookCallback(int nCode, IntPtr wParam, IntPtr lParam)
    {
        if (nCode >= 0)
        {
            int msg = wParam.ToInt32();
            if (msg == WM_KEYDOWN || msg == WM_SYSKEYDOWN)
            {
                var kbd = Marshal.PtrToStructure<KBDLLHOOKSTRUCT>(lParam);
                if (kbd.vkCode == VK_ESCAPE && IsSelectionActive)
                {
                    System.Threading.ThreadPool.QueueUserWorkItem(_ =>
                    {
                        EscapePressed?.Invoke();
                    });
                    return (IntPtr)1; // Swallow Escape during active selection
                }
            }
        }

        return CallNextHookEx(_keyboardHookId, nCode, wParam, lParam);
    }

    public void Dispose()
    {
        if (!_isDisposed)
        {
            Stop();
            _isDisposed = true;
        }
        GC.SuppressFinalize(this);
    }
}
