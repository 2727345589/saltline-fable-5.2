import { readFile, writeFile, mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { transform } from "esbuild";

const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "src");
const singleOnly = process.argv.includes("--single-only");

const STYLE_FILES = [
  "tokens",
  "boot",
  "hud",
  "radio",
  "touch",
  "menus",
  "panel",
  "overlays",
  "responsive",
  "reduced-motion",
];

async function read(rel) {
  return readFile(path.join(root, rel), "utf8");
}

async function listGameScripts() {
  const files = await readdir(path.join(src, "js"));
  return files
    .filter((file) => /^\d{2}-.+\.js$/.test(file))
    .sort((a, b) => a.localeCompare(b));
}

async function buildCss() {
  const parts = [];
  for (const name of STYLE_FILES) {
    parts.push(`/* ${name}.css */\n${await read(`src/styles/${name}.css`)}`);
  }
  const result = await transform(parts.join("\n"), {
    loader: "css",
    minify: true,
    target: ["es2020"],
  });
  return result.code;
}

async function buildJs() {
  const gameFiles = await listGameScripts();
  const files = ["vendor/three-r180.js", ...gameFiles];
  const parts = [];
  for (const file of files) {
    parts.push(`/* ${file} */\n${await read(`src/js/${file}`)}`);
  }

  // The source fragments share one top-level scope. Reproduce the original
  // single-IIFE scope in the build so minified names stay private.
  const wrapped = `(() => {\n${parts.join("\n\n")}\n})();\n`;
  const result = await transform(wrapped, {
    loader: "js",
    minify: true,
    target: ["es2020"],
    charset: "utf8",
    legalComments: "none",
  });
  return result.code;
}

function applyTemplate(template, styles, scripts) {
  // Use replacer functions: replacement strings would interpret `$&`, `$'`, etc.
  // that occur inside the minified game code.
  return template
    .replace("<!-- SALTLINE_STYLES -->", () => styles)
    .replace("<!-- SALTLINE_SCRIPTS -->", () => scripts);
}

async function main() {
  const template = await read("src/index.template.html");
  const css = await buildCss();
  const js = await buildJs();

  await mkdir(path.join(root, "dist"), { recursive: true });

  if (!singleOnly) {
    await writeFile(path.join(root, "dist/styles.css"), css);
    await writeFile(path.join(root, "dist/game.js"), js);
    await writeFile(
      path.join(root, "dist/index.html"),
      applyTemplate(
        template,
        '<link rel="stylesheet" href="./styles.css">',
        '<script src="./game.js"></script>',
      ),
    );
  }

  const inlineCss = `<style>\n${css.replace(/<\/style/gi, "<\\/style")}\n</style>`;
  const inlineJs = `<script>\n${js.replace(/<\/script/gi, "<\\/script")}\n</script>`;
  await mkdir(path.join(root, "dist/single"), { recursive: true });
  await writeFile(
    path.join(root, "dist/single/index.html"),
    applyTemplate(template, inlineCss, inlineJs),
  );

  const sizes = singleOnly
    ? [["dist/single/index.html", "dist/single/index.html"]]
    : [
        ["dist/index.html", "dist/index.html"],
        ["dist/styles.css", "dist/styles.css"],
        ["dist/game.js", "dist/game.js"],
        ["dist/single/index.html", "dist/single/index.html"],
      ];
  for (const [label, rel] of sizes) {
    try {
      const info = await stat(path.join(root, rel));
      console.log(`${label.padEnd(24)} ${(info.size / 1024).toFixed(1)} KB`);
    } catch {
      // skipped build target
    }
  }
  console.log("build complete");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
