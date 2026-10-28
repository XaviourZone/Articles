# Smart Copy — Release Notes

## Version 1.0.0 (Production Release)

### Summary of Changes & Capabilities
- **Native C#/.NET 8 LTS Desktop Implementation:** Complete Windows native utility built with WPF and Windows desktop APIs.
- **Exact Global Activation Gesture:** `Left Ctrl` + `Left Alt` + `Right Mouse Button` with strict distinction from right-hand modifier keys and context-menu suppression.
- **Two-Point Selection Overlay:** Transparent per-monitor WPF overlay with crosshair cursor, floating HUD instructions, live bounding highlight, and Escape/Right-click cancellation.
- **Bundled Offline OCR Engine:** Pre-packaged Tesseract 5.2.0 native x64/x86 DLLs and English language model (`eng.traineddata`). Zero external installations required.
- **Multi-Orientation Recognition:** Automatic evaluation of 0°, 90°, 180°, and 270° text layouts with coordinate inverse mapping.
- **Multi-Monitor & Mixed DPI Support:** Per-Monitor V2 DPI awareness with accurate physical-to-logical pixel scaling across multiple connected displays.
- **Robust Clipboard Pipeline:** Thread-safe STA clipboard writer with contention retry logic and non-destructive fallbacks.
- **System Tray Operations:** Quiet background start, single-instance mutex protection, full tray context menu, and persistent JSON settings.
- **Self-Contained Installer & Binaries:** Clean Inno Setup installer (`SmartCopySetup.exe`) and single-file portable executable (`SmartCopy.exe`).

---

### Release Artifacts & SHA-256 Checksums

The release files are located in the `release/` directory:

| Filename | File Size | SHA-256 Checksum |
| :--- | :--- | :--- |
| `SmartCopySetup.exe` | 59,111,624 bytes (~56.3 MB) | `EB35D3747AE1331C025A8A0FFB67C374BEB495222096FB6AEEF1C0A3574A4E1F` |
| `SmartCopy.exe` | 204,095,087 bytes (~194.6 MB) | `C16476E9BBF7136121B14BE60434250AE60422BE073B033C1DEE35F4EFC6DB01` |
| `SHA256SUMS.txt` | 170 bytes | `9A557A3C38440F47DDCB08F9FA76CAEAA57C4CEB545EB65293B330FDF3815D84` |

---

### Known Limitations & Security Boundaries
- **UAC Elevated Windows:** Windows security isolation (UIPI - User Interface Privilege Isolation) restricts user-mode hooks from reading input inside elevated administrative command prompts if Smart Copy is run as a standard user. Running Smart Copy as administrator removes this limitation.
- **Secure Desktops:** The Windows lock screen, Ctrl+Alt+Del secure desktop, and UAC credential dialogs cannot be accessed by design.
