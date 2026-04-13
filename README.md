# GitHub Repos

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.75+-007ACC.svg)](https://code.visualstudio.com/)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/moscovium-mc/moscovium-mc.github-repos-1.0.0/releases)
[![Platform](https://img.shields.io/badge/platform-windows%20%7C%20macos%20%7C%20linux-lightgrey.svg)]()

Browse GitHub repositories without leaving VS Code. Open `index.html` in any browser for a standalone web app.

## Features

- Browse any user's public repos
- Filter and sort by name, stars, or date
- View language, stars, forks, and licenses
- VS Code theme-aware (adapts to light/dark mode)
- Standalone web app version included

## Install

### VS Code Extension

**Option A - Download .vsix**

1. Download `github-repos-1.0.0.vsix` from the [Releases](https://github.com/moscovium-mc/moscovium-mc.github-repos-1.0.0/releases) page
2. `Ctrl+Shift+P` → **Extensions: Install from VSIX**
3. Select the downloaded file

**Option B - Build from source**

```
git clone https://github.com/moscovium-mc/moscovium-mc.github-repos-1.0.0
cd moscovium-mc.github-repos-1.0.0
npm install
npx vsce package
```

Then install the generated .vsix file.

## Web App
Open index.html in any browser - no install required.

## Usage
VS Code:

- Click the GitHub icon in the Activity Bar (sidebar)
- Or: Ctrl+Shift+P → Open GitHub Repos
- Type any GitHub username and press Enter
### Web App:

-Enter a GitHub username and press Enter
-Use the search bar to filter repos
-Sort by recently updated, stars, or name

## How it works
The extension uses the GitHub public API to fetch repository data:
```
https://api.github.com/users/{username}/repos
```

No authentication required - works with any public GitHub profile.

## Support

If you find this project useful, consider supporting my work:

<a href="https://buymeacoffee.com/webmoney" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="40"></a>

**Crypto donations:**
- <a href="bitcoin:bc1quavqz6cxqzfy4qtvq4zxc4fjgap3s7cmxja0k4"><img src="https://img.shields.io/badge/Bitcoin-000000?style=plastic&logo=bitcoin&logoColor=white" alt="Bitcoin"></a> `bc1quavqz6cxqzfy4qtvq4zxc4fjgap3s7cmxja0k4`
- <a href="ethereum:0x5287af72afbc152b09b3bf20af3693157db9e425"><img src="https://img.shields.io/badge/Ethereum-627EEA?style=plastic&logo=ethereum&logoColor=white" alt="Ethereum"></a> `0x5287af72afbc152b09b3bf20af3693157db9e425`
- <a href="solana:HYZjfEx8NbEMJX1vL1GmGj39zA6TgMsHm5KCHWSZxF4j"><img src="https://img.shields.io/badge/Solana-9945FF?style=plastic&logo=solana&logoColor=white" alt="Solana"></a> `HYZjfEx8NbEMJX1vL1GmGj39zA6TgMsHm5KCHWSZxF4j`
- <a href="monero:86zv6vTDuG35sdBzBpwVAsD71hbt2gjH14qiesyrSsMkUAWHQkPZyY9TreeQ5dXRuP57yitP4Yn13SQEcMK4MhtwFzPoRR1"><img src="https://img.shields.io/badge/Monero-FF6600?style=plastic&logo=monero&logoColor=white" alt="Monero"></a> `86zv6vTDuG35sdBzBpwVAsD71hbt2gjH14qiesyrSsMkUAWHQkPZyY9TreeQ5dXRuP57yitP4Yn13SQEcMK4MhtwFzPoRR1`

### Version History
***v1.0.0 (Current)***
Initial release
- Sidebar webview for quick access
- Full editor panel view
- Filter and sort repositories
- Language color indicators
- License badges
- Web app (index.html)

### Author
https://github.com/moscovium-mc

License
MIT License - See LICENSE for details.

<div align="center">

**[Star this repo](https://github.com/moscovium-mc/CloudRip)** if you find it useful

</div>
