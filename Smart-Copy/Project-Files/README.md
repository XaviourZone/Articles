# Smart Copy — Universal Windows OCR Selection Utility

Smart Copy is a high-performance, privacy-first Windows desktop utility that lets you copy non-selectable text from virtually anywhere on your screen using an intuitive global mouse-and-keyboard gesture and a lightweight two-point selection overlay.

---

## Key Features

- **Global Activation Gesture:**  
  Hold **Left Ctrl** + **Left Alt** and **Right-Click** anywhere.  
  Smart Copy immediately intercepts the click, suppresses the context menu, and opens the selection overlay on the active monitor.
- **Two-Point Text Selection:**  
  1. Click the start of the desired text.  
  2. Click the end of the desired text.  
  Smart Copy automatically identifies the text lying between the clicked coordinates and copies it to your clipboard.
- **100% Offline & Dependency-Free:**  
  Includes the bundled Tesseract 5 OCR engine and English language models (`eng.traineddata`). Zero external runtimes required (no Python, no separately installed Tesseract, no internet access needed).
- **Multi-Orientation & Tilt Support:**  
  Accurately handles horizontal (0°), vertical/sideways (90°, 270°), inverted (180°), and tilted/skewed text.
- **Multi-Monitor & Mixed DPI Aware:**  
  Per-Monitor V2 DPI awareness. Works seamlessly across multi-monitor setups with mixed resolutions, DPI scaling factors (100%, 125%, 150%, 200%), and negative virtual desktop coordinates.
- **Silent Background Operation:**  
  Runs quietly in the Windows system tray with low idle CPU/RAM usage.
- **Clean Installer & Uninstaller:**  
  Shipped as a Windows setup executable (`SmartCopySetup.exe`) and portable standalone single-file (`SmartCopy.exe`). Easily uninstalled via Windows Settings → Apps.

---

## Quick Start & Usage

1. **Download & Install:**  
   Run `SmartCopySetup.exe` from the `release/` directory. Complete the setup wizard (optional desktop shortcut and startup toggle).
2. **Background Tray:**  
   Smart Copy launches automatically into your system notification area (system tray).
3. **Trigger Selection:**  
   - Hold the **Left Ctrl** and **Left Alt** keys down.
   - Click the **Right Mouse Button**.
   - The screen dims slightly and the crosshair cursor appears on the active monitor.
4. **Select Text:**  
   - Left-click the beginning of the text.
   - Left-click the end of the text.
   - A subtle green toast confirms: *"Copied N characters to clipboard!"*
5. **Paste:**  
   Switch to any application and press `Ctrl+V` to paste the recognized text.
6. **Cancel:**  
   Press `Escape` or right-click at any point to cancel selection without modifying your clipboard.

---

## System Tray Menu

Right-click the **Smart Copy** tray icon to access:
- **Smart Copy Settings:** Configure startup, orientation detection, notifications, and hotkeys.
- **Enabled (Toggle):** Temporarily enable or disable global gesture hooks.
- **Pause / Resume Selection:** Suspend hotkey monitoring without exiting.
- **Start with Windows:** Register/unregister automatic startup via `HKCU\...\Run`.
- **About Smart Copy:** Version and engine information.
- **View Diagnostic Logs:** Non-sensitive operational diagnostics (`%APPDATA%\SmartCopy\diagnostic.log`).
- **Exit Smart Copy:** Cleanly unhook Windows APIs and exit the background application.

---

## System Requirements

- **Operating System:** Windows 10 (version 1809 or higher) or Windows 11 (64-bit).
- **Runtimes:** None. All required runtimes, native C++ DLLs, and language models are bundled into the executable and installer.
- **Hardware:** Any x64 processor; minimal idle memory footprint (< 35 MB).

---

## Building from Source

Requirements:
- .NET 8.0 SDK (or later) with Windows Desktop workload.
- Inno Setup 6 (optional, for compiling the installer).

Commands:
```powershell
# Restore and build the solution
dotnet restore
dotnet build -c Release

# Run automated tests
dotnet test SmartCopy.Tests\SmartCopy.Tests.csproj

# Publish standalone executable
dotnet publish SmartCopy\SmartCopy.csproj -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -o publish\standalone

# Compile Inno Setup Installer
iscc SmartCopy.iss
```

---

## Security & Privacy Policy

- **No Network Activity:** Smart Copy does not make outbound internet connections, cloud API calls, or telemetry transmissions.
- **Ephemeral Screen Captures:** Captured monitor bitmaps are held temporarily in memory during the active selection session and immediately disposed when selection completes or cancels.
- **Safe Clipboard:** The clipboard is only modified when a non-empty, valid OCR selection is obtained. Existing clipboard contents remain untouched if selection is canceled.
