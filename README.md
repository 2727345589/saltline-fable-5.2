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

## What changed from the artifact

- Game code: unchanged in behaviour. The single IIFE was split into ordered
  source fragments; the build reassembles it.
- The claude.ai frame-runtime scripts were removed from `<head>`, and a doctype,
  charset and viewport tag were added so the file runs as a plain web page.
- CSS was split by UI section.
- Added a build/dev/check workflow and architecture docs.

The original game remains one level, one HTML artifact at runtime when built with
`npm run build` (see `dist/single/index.html`).
