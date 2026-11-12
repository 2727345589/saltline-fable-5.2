# Build resources

Electron Builder looks here for application icons and platform resources.

The app currently uses Electron's default icon. To brand the desktop build, add:

- `icon.icns` for macOS
- `icon.ico` for Windows
- `icon.png` (512x512 or 1024x1024) for Linux

Then reference them from the `build` section of `package.json` if you use custom
paths.
