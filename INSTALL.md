# FrameIt Install Guide

## Build + Zip for Release (GitHub Actions)
1. Commit and push
2. Tag a release: `git tag v0.1.0`
3. Push the tag: `git push origin v0.1.0`
4. GitHub Actions will build and attach `frameit.zip` to the Release

## Install from GitHub Release
1. Download `frameit.zip` from the Release
2. Unzip it to a folder
3. Chrome: `chrome://extensions` → enable Developer mode → Load unpacked → pick the folder
4. Firefox (Zen): `about:debugging` → This Firefox → Load Temporary Add-on → pick `manifest.json`
