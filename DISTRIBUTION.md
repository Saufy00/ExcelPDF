# ExcelPDF Distribution Guide

## Automated Releases (Recommended)

The project is configured with **GitHub Actions** to automatically build and release the app.

### How to Release a New Version

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: Add cool new feature"
   git push origin main
   ```

2. **Create and push a version tag**:
   ```bash
   # Create tag (e.g., v1.0.1)
   git tag v1.0.1

   # Push tag to trigger release
   git push origin v1.0.1
   ```

3. **Wait for GitHub Actions**:
   - Go to the [Actions tab](https://github.com/Saufy00/ExcelPDF/actions) to watch the build.
   - Once complete, go to the **Releases** tab.
   - Your new version will be there with the `.exe` installer ready for download!

---

## Manual Build (Local)

If you need to build locally (requires Node.js & Rust/C++ build tools):

```bash
npm run electron:build
```
*Note: This may fail if your local environment lacks necessary build tools. The automated GitHub method is preferred.*

## Installation

Users simply download the `.exe` file from the Releases page and run it. No other software is required.
