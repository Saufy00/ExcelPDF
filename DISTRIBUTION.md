# ExcelPDF Distribution Guide

## What's Being Built

Running `npm run electron:build` creates a **Windows installer** that users can download and install.

### Configuration Details

The app is configured to create:
- **Installer Type**: NSIS (Nullsoft Scriptable Install System)
- **Output Folder**: `release/`
- **Installer Name**: `ExcelPDF-Setup-0.0.0.exe`

### What Users Get

When they run the installer:
- ✅ Desktop shortcut
- ✅ Start menu shortcut  
- ✅ Choose installation directory
- ✅ Standalone app (no Node.js required)

---

## Distribution Steps

### 1. Build the Installer
```bash
npm run electron:build
```

This will:
1. Compile TypeScript
2. Build with Vite
3. Package with electron-builder
4. Create installer in `release/` folder

### 2. Find Your Installer

After build completes, look for:
```
release/ExcelPDF-Setup-0.0.0.exe
```

### 3. Distribute

**Option A: GitHub Releases**
1. Go to your GitHub repo
2. Click "Releases" → "Create a new release"
3. Upload `ExcelPDF-Setup-0.0.0.exe`
4. Publish release

**Option B: Direct Share**
- Email the `.exe` file
- Share via cloud storage (Dropbox, Google Drive, etc.)

**Option C: Your Own Website**
- Host the `.exe` on your server
- Provide download link

---

## User Installation

### For End Users:
1. Download `ExcelPDF-Setup-0.0.0.exe`
2. Double-click to run installer
3. Choose installation folder
4. Click "Install"
5. Launch ExcelPDF from desktop/start menu

**No Node.js, npm, or terminal needed!**

---

## Updating Version

To change the version number:

Edit `package.json`:
```json
{
  "version": "1.0.0"
}
```

Next build will create: `ExcelPDF-Setup-1.0.0.exe`

---

## File Sizes (Approximate)

- Installer: 150-250 MB (includes Electron runtime + your app)
- Installed app: 300-400 MB

This is normal for Electron apps (similar to VS Code, Slack, Discord).
