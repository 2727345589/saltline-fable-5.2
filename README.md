# Saltline — Fable 5.2 FPS

A small browser first-person shooter: one level in a rainy container port. Cut three uplink relays while drones ("Gulls") and robot dogs ("Hounds") hunt you.
<img width="1685" height="906" alt="image" src="https://github.com/user-attachments/assets/8dd32149-90f4-4d69-a573-4411a49a9ba9" />

## Demo

https://realcodebear.github.io/saltline-fable-5.2/

## Where it comes from

- Built by **Claude Fable 5.2**. The run was set up by Felix Rieseberg (Anthropic) and shared on X on 2026-11-09:
  https://x.com/felixrieseberg/status/2119925633564463609
- Original playable artifact: https://claude.ai/artifact/BGY1SztrAYcJQHSsnHHGmp
- Per his post: one prompt, no human feedback, about 8 hours, about 2.7M output and 445M input tokens (heavily cached), about $550 at API pricing. Models, sounds and textures are all made in code. These numbers are his own and not checked here.

All credit for the game goes to its original author. This repo is a mirror so people can run it locally. If you are the author and want it taken down, open an issue.

## Project layout

The original single-file artifact is now split into maintainable source files:

```text
index.html               dev entry (loads split CSS + JS)
src/styles/*.css         10 stylesheets: tokens, HUD, menus, panels, responsive...
src/js/*.js              19 game modules + vendored three.js
src/index.template.html  build template
scripts/build.mjs        minify + emit multi-file and single-file builds
scripts/dev.mjs          tiny static dev server
scripts/check.mjs        load-order and syntax check
docs/ARCHITECTURE.md     architecture, module map, debug params
docs/THREE-ALIASES.md    minified three.js alias -> export name
```

The game JS was split at top-level statement boundaries from the original
bundle, not rewritten. The fragments still share one top-level scope:

- development: ordered classic `<script>` tags share the global scope
- production: all fragments are concatenated inside one IIFE

This keeps runtime behaviour identical while making the code navigable by system.
The identifiers are still minified; `docs/THREE-ALIASES.md` is the translation
table for three.js names.

## Run the source

```sh
npm install
npm run dev
```

Then open http://localhost:8731 and click the page to capture the mouse and start the sound.

A plain static server also works:

```sh
python3 -m http.server 8731
```

## Build

```sh
npm run check      # validate file order + JS/CSS syntax
npm run build      # dist/ and dist/single/index.html
npm run preview    # serve dist/
```

Build outputs:

- `dist/index.html` + `dist/styles.css` + `dist/game.js` — normal multi-file site
- `dist/single/index.html` — everything inlined, same deployment shape as the original artifact

`dist/game.js` bundles the vendored three.js r180. There are no runtime package
dependencies; esbuild is only used at build time.

## Desktop app (Electron)

```sh
npm install
npm run electron:dev     # build web assets, then launch the desktop app
```

For live web development with the Electron shell:

```sh
npm run dev
# in another terminal:
SALTLINE_DEV_URL=http://localhost:8731 npm run electron:serve
```

Packaging:

```sh
npm run electron:pack    # unpacked app in release/
npm run electron:dist    # installers for the current platform
npm run electron:dist:mac
npm run electron:dist:win
npm run electron:dist:linux
```

Electron details:

- Main process: `electron/main.cjs`
- Preload: `electron/preload.cjs`
- The game is served through a secure custom scheme, `saltline://app/index.html`
- `contextIsolation` and `sandbox` are enabled; Node integration is disabled
- A CSP is applied to the game document
- Fullscreen: `F11` on Windows/Linux, `Ctrl+Cmd+F` on macOS
- Desktop settings use the same `saltline.settings.v1` localStorage key

Packaging targets are configured in `package.json`: dmg/zip (macOS), NSIS +
portable (Windows), AppImage + deb (Linux). Cross-building Windows/Linux
installers from macOS may require additional platform tooling (for example Wine
or Docker), so use the matching platform in CI for release builds.

`electron:dist` first checks whether GitHub's Electron Builder release downloads
are reachable. If they are blocked, it automatically falls back to the npmmirror
binary mirror. The helper binaries (`7zip`, `dmg-builder`) are cached in
`~/Library/Caches/electron-builder` after the first successful build.

You can override the behavior:

```sh
# use a specific mirror
ELECTRON_BUILDER_BINARIES_MIRROR=https://your-mirror.example/electron-builder-binaries/ npm run electron:dist

# or the project-specific alias
SALTLINE_ELECTRON_BUILDER_MIRROR=https://your-mirror.example/electron-builder-binaries/ npm run electron:dist

# skip the connectivity probe
SALTLINE_SKIP_NETWORK_CHECK=1 npm run electron:dist
```

If neither GitHub nor the fallback mirror is reachable, `npm run electron:pack`
still produces a runnable unpacked app in `release/`.

Builds are unsigned by default, so macOS Gatekeeper may require a local override
until a Developer ID certificate is configured. For distribution, set
`CSC_LINK` / `CSC_KEY_PASSWORD` (and notarization credentials if needed).

The app currently uses Electron's default icon. See `build/README.md` for where
to add platform icons.

## What changed from the artifact

- Game code: unchanged in behaviour. The single IIFE was split into ordered
  source fragments; the build reassembles it.
- The claude.ai frame-runtime scripts were removed from `<head>`, and a doctype,
  charset and viewport tag were added so the file runs as a plain web page.
- CSS was split by UI section.
- Added a build/dev/check workflow and architecture docs.

The original game remains one level, one HTML artifact at runtime when built with
`npm run build` (see `dist/single/index.html`).
