# Smart Copy — Test Report & Verification Matrix

## 1. Automated Test Results
- **Test Framework:** xUnit v2.5.3 on .NET 8.0 Windows Desktop
- **Project:** `SmartCopy.Tests/SmartCopy.Tests.csproj`
- **Execution Date:** 2026-10-28
- **Results:** 8 Passed, 0 Failed, 0 Skipped (100% Pass Rate)

| Test Name | Component | Status | Notes |
| :--- | :--- | :--- | :--- |
| `ExtractTextBetweenPoints_HorizontalSingleLine_ReconstructsInOrder` | Selection Engine | **PASS** | Validates word order and boundary exclusion |
| `ExtractTextBetweenPoints_MultiLineParagraph_PreservesLineBreaks` | Selection Engine | **PASS** | Reconstructs multi-line paragraphs with `\r\n` |
| `ExtractTextBetweenPoints_EmptyPage_ReturnsEmpty` | Selection Engine | **PASS** | Handles empty OCR pages without throwing |
| `ExtractTextBetweenPoints_VerticalText_ReconstructsColumnOrder` | Selection Engine | **PASS** | Validates top-to-bottom vertical column ordering |
| `InverseTransformRect_0Degrees_ReturnsIdentical` | Coordinate Mapping | **PASS** | Validates identity transform |
| `InverseTransformRect_90Degrees_CorrectlyReversesCoordinates` | Coordinate Mapping | **PASS** | Validates 90° clockwise inverse rotation math |
| `InverseTransformRect_180Degrees_CorrectlyReversesCoordinates` | Coordinate Mapping | **PASS** | Validates 180° inverted coordinate inversion |
| `TrySetText_EmptyOrNull_ReturnsFalseWithoutAlteringClipboard` | Clipboard Safety | **PASS** | Ensures empty selections do not wipe clipboard |

---

## 2. Windows-Specific Integration & Manual Verification Checklist

| Test Scenario | Verification Procedure | Result |
| :--- | :--- | :--- |
| **Exact Activation Gesture** | Hold Left Ctrl + Left Alt and Right-Click | **VERIFIED:** Activates overlay immediately, context menu suppressed |
| **Modifier Distinction** | Right Ctrl + Left Alt + Right Click | **VERIFIED:** Does not activate; regular right-click passes through |
| **Normal Right-Click** | Right-click anywhere without modifiers | **VERIFIED:** Context menu functions 100% normally |
| **Escape Cancellation** | Press `Escape` or Right-Click during selection | **VERIFIED:** Overlay closes cleanly, clipboard untouched |
| **Two-Point Selection** | Click start of sentence, then click end | **VERIFIED:** Inferred words extracted, copied, and toast shown |
| **System Tray Integration** | Check Windows notification area | **VERIFIED:** Tray icon active, menu items responsive |
| **Single Instance Mutex** | Launch second instance | **VERIFIED:** Prompts user that app is already running, prevents duplicate |
| **Installer Execution** | Run `SmartCopySetup.exe` | **VERIFIED:** Installs to `%LOCALAPPDATA%\Programs\Smart Copy` with shortcuts |
| **Clean Uninstallation** | Run `unins000.exe` / Windows Settings | **VERIFIED:** Removes binaries, shortcuts, and startup entries cleanly |
