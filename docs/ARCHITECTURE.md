# Saltline architecture

## Source layout

```text
.
├─ index.html                  dev entry: loads CSS + ordered classic scripts
├─ package.json                dev/build scripts, esbuild
├─ src/
│  ├─ index.template.html      build template with inline placeholders
│  ├─ styles/
│  │  ├─ index.css             @import entry, order matters
│  │  ├─ tokens.css            tokens, page shell, canvas, UI root
│  │  ├─ boot.css              boot screen, fatal error panel
│  │  ├─ hud.css               compass, objectives, crosshair, ammo, health, markers
│  │  ├─ radio.css             radio subtitles
│  │  ├─ touch.css             touch stick + buttons
│  │  ├─ menus.css             title, pause, death, debrief
│  │  ├─ panel.css             settings / controls panel
│  │  ├─ overlays.css          intro location card
│  │  ├─ responsive.css        narrow screens, short viewports
│  │  └─ reduced-motion.css    prefers-reduced-motion
│  └─ js/
│     ├─ vendor/three-r180.js  vendored three.js r180 (minified)
│     ├─ 01-core.js            config, quality, events, RNG, math, fallbacks
│     ├─ 02-render.js          sky, PCSS shadows, post chain, renderer
│     ├─ 03-materials.js       texture shaders, canvas textures, materials
│     ├─ 04-physics.js         AABB world, raycasts, capsule movement, nav
│     ├─ 05-props.js           prop registry + procedural prop builders
│     ├─ 06-level.js           Berth 4 layout, relays, spawns, zones
│     ├─ 07-backdrop.js        cranes, ship, boat, skyline
│     ├─ 08-ground.js          wet apron, puddles, reflections, sea
│     ├─ 09-fx.js              rain, tracers, smoke, decals, particles
│     ├─ 10-audio-synth.js     offline waveform synthesis
│     ├─ 11-audio-engine.js    Web Audio graph, spatial mix, music
│     ├─ 12-input.js           keyboard/mouse, pointer lock, gamepad, touch
│     ├─ 13-player.js          player movement, camera, damage
│     ├─ 14-weapon.js          PAC-9 viewmodel, reload, hitscan
│     ├─ 15-enemies.js         Gull/Hound models, rig, AI, director
│     ├─ 16-hud.js             DOM HUD
│     ├─ 17-menus.js           settings + menus + panel
│     ├─ 18-game.js            state machine, waves, extraction, scoring
│     └─ 19-boot.js            boot sequence, error surface, main loop
├─ electron/
│  ├─ main.cjs                 desktop window, menu, custom protocol, CSP
│  └─ preload.cjs              sandboxed desktop bridge
├─ build/
│  └─ README.md                icon/build-resource notes
├─ scripts/
│  ├─ build.mjs                minify + emit multi-file and single-file builds
│  ├─ dev.mjs                  tiny static dev server
│  └─ check.mjs                validate load order and syntax
└─ docs/
   ├─ ARCHITECTURE.md
   └─ THREE-ALIASES.md
```

## Important: the JS fragments share one scope

The original game was a single minified IIFE. It was split at top-level statement
boundaries but **not rewritten**. The numbered files are source fragments, not
independent ES modules.

- In development, `index.html` loads them as ordered classic `<script>` tags.
  They share the global lexical scope, so a name declared in `01-core.js` is
  visible in `19-boot.js`.
- In production, `scripts/build.mjs` concatenates them in filename order and
  wraps the result in one IIFE, reproducing the original scope and keeping the
  minified names private.

Rules when editing:

1. Do not rename files without updating `index.html`, `scripts/check.mjs`, and the
   style list in `scripts/build.mjs`.
2. Keep top-level declaration names unique across fragments. The build will fail
   on duplicates.
3. Do not add `import`/`export` to these fragments. They are classic scripts by
   design.
4. Keep load order: dependencies point upward. For example, `18-game.js` may use
   `17-menus.js`, but not the reverse.

The game identifiers are still minified. `docs/THREE-ALIASES.md` maps the
three.js aliases (`W` = `Vector3`, `Lt` = `Quaternion`, …) used by the source.

## Build

```sh
npm install
npm run check     # load order + syntax
npm run dev       # http://localhost:8731
npm run build     # dist/ + dist/single/index.html
npm run preview   # serve dist/
```

Build outputs:

| output | description |
|---|---|
| `dist/index.html` | small HTML shell |
| `dist/styles.css` | bundled, minified CSS |
| `dist/game.js` | bundled, minified IIFE |
| `dist/single/index.html` | everything inlined, equivalent to the original artifact |

`dist/game.js` includes the vendored three.js. It is one scope, so three.js and
game code stay in the same IIFE.

## Runtime flow

```text
19-boot.js: QC()
  ├─ parse URL params
  ├─ render  → 02-render.js
  ├─ mats    → 03-materials.js
  ├─ level   → 06-level.js
  ├─ backdrop→ 07-backdrop.js
  ├─ ground  → 08-ground.js
  ├─ physics → 04-physics.js
  ├─ fx      → 09-fx.js
  ├─ audio   → 11-audio-engine.js
  ├─ player  → 13-player.js
  ├─ combat  → 13-player.js (facade)
  ├─ weapon  → 14-weapon.js
  ├─ enemies → 15-enemies.js
  ├─ hud     → 16-hud.js
  └─ game    → 18-game.js
```

The renderer animation loop calls, in order:

```text
input → game → player / weapon / enemies
      → fx / ground / level / backdrop / materials
      → audio / hud
      → render
```

Game state machine: `title → intro → playing ↔ paused → dead | complete`.

## Key parameters

Search for these strings to jump to the relevant source file:

| area | search anchor | file |
|---|---|---|
| quality presets | `name: "low"` / `name: "ultra"` | `01-core.js` |
| world bounds | `quayX: 30` | `01-core.js` |
| render pipeline | `softShadows` / `SALTLINE_POST` | `02-render.js` |
| material recipes | `container20` | `03-materials.js` / `05-props.js` |
| physics tuning | `moveCapsule` | `04-physics.js` |
| level zones | `gate` / `yard` / `shed` / `quay` | `06-level.js` |
| rain / puddles | `isPuddle` / `uWetG` | `08-ground.js` |
| sound recipes | `gull_cry` / `rifle_shot` | `10-audio-synth.js` |
| player tuning | `walk: 3.8` | `13-player.js` |
| weapon tuning | `PAC-9 Longshore` / `magSize` | `14-weapon.js` |
| enemy tuning | `maxTokensCrowd` / `sightRange` | `15-enemies.js` |
| waves / scoring | `pursuitExtra` / `waves` | `18-game.js` |
| settings key | `saltline.settings.v1` | `17-menus.js` |

## Debug URL parameters

| parameter | effect |
|---|---|
| `?q=low\|medium\|high\|ultra` | force quality preset |
| `?seed=4207` | procedural seed |
| `?shot=1` | screenshot/test quality, autostart |
| `?autostart=1` | skip title and start playing |
| `?bench=1` or `#bench` | benchmark overlay + autostart |
| `?show=level` | show one module (`mats`, `level`, `backdrop`, `ground`, `fx`, `weapon`, `enemies`, `props`, `render`) |
| `?cam=x,y,z,tx,ty,tz` | fixed camera |
| `?fov=60` | field of view |
| `?exposure=1` | exposure |
| `?noaudio=1` | disable audio |
| `?noweapon=1` | hide weapon |
| `?dt=0.016` | fixed timestep |
| `?post=0` | disable post-processing |
| `?ao=0` / `?vol=0` / `?bloom=0` | disable AO / volumetrics / bloom |
| `?mb=1` | force motion blur |
| `?dynres=0` | disable dynamic resolution |

Global debug handles: `window.__G`, `window.__stats()`, `window.__ready`,
`window.__fatal`, `window.__errors`, `window.__frames`, `window.__setShot()`.

## Desktop shell (Electron)

The desktop build is a thin Electron wrapper around the existing multi-file web
build. The game itself is unchanged.

```text
electron/main.cjs
  ├─ single-instance lock
  ├─ registers saltline:// as a privileged, secure custom scheme
  ├─ creates a 1600x900 BrowserWindow (min 960x600)
  ├─ loads saltline://app/index.html from dist/
  ├─ applies CSP + fullscreen/pointer-lock permissions
  ├─ native menu: fullscreen, zoom, reload/devtools (dev), GitHub help
  └─ denies navigation, popups and webviews

electron/preload.cjs
  └─ exposes window.saltlineDesktop = {
       isDesktop, platform, versions,
       toggleFullscreen()
     }
```

Security baseline:

- `contextIsolation: true`
- `sandbox: true`
- `nodeIntegration: false`
- custom protocol restricted to `dist/` (path traversal rejected)
- navigation limited to the app origin
- `setWindowOpenHandler` denies popups
- CSP on the game document; Google Fonts is the only allowed external origin

Development:

```sh
npm run electron:dev
```

Load the web dev server inside Electron:

```sh
npm run dev
SALTLINE_DEV_URL=http://localhost:8731 npm run electron:serve
```

Packaging:

```sh
npm run electron:pack      # release/<platform>-<arch>/Saltline.app
npm run electron:dist      # platform installer(s)
```

`scripts/electron-builder.mjs` reuses the locally installed Electron distribution
when the target platform matches the host, so packaging does not re-download the
runtime. Cross-platform targets fall back to Electron Builder's normal download.
Targets are declared per platform. Release builds should run on their target OS
(or in a matching CI runner) because Windows/Linux installers may need Wine,
Docker, fpm or similar tooling when cross-built from macOS.

Installer builds need Electron Builder helper binaries (`7zip`, `dmg-builder`).
`scripts/electron-builder.mjs` probes GitHub's release download host first and
falls back to `https://npmmirror.com/mirrors/electron-builder-binaries/` when it
is unreachable. The check is skipped for `--dir` packaging and can be controlled
with:

- `ELECTRON_BUILDER_BINARIES_MIRROR` — standard Electron Builder mirror variable
- `SALTLINE_ELECTRON_BUILDER_MIRROR` — project-specific alias
- `SALTLINE_SKIP_NETWORK_CHECK=1` — skip the probe

Downloaded tools are cached in `~/Library/Caches/electron-builder`. If no source
is reachable, `--dir` packaging still produces a runnable app.

## Verification

`npm run check` validates the file order and both JS/CSS syntax.

The build was smoke-tested in headless Chromium with SwiftShader:

- dev source tree: boots to `title`, no page errors
- `dist/`: matches the original single-file stats at the same camera/time
  (416/322 draw calls depending on cinematic frame; geometry and texture counts
  identical)
- `dist/single/index.html`: boots to `title`, no page errors
- `?autostart=1`: reaches `playing`, 3 relays, 3 enemies, HUD visible
- Electron dev run: `saltline://app/index.html` boots to `title`, preload bridge
  present, localStorage working, no CSP violations
- Electron packaged run (`release/mac-arm64/Saltline.app`): same result
- Electron gameplay: `playing`, 3 relays, 3 enemies, HUD visible, audio present
