import { readFile, readdir, access } from "node:fs/promises";
import path from "node:path";
import { transform } from "esbuild";

const root = path.resolve(import.meta.dirname, "..");

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

function fail(message) {
  console.error(`check failed: ${message}`);
  process.exitCode = 1;
}

async function main() {
  const html = await readFile(path.join(root, "index.html"), "utf8");

  const scripts = [...html.matchAll(/<script src="\.\/src\/js\/([^"]+)"><\/script>/g)].map(
    (match) => match[1],
  );
  const files = (await readdir(path.join(root, "src/js")))
    .filter((file) => /^\d{2}-.+\.js$/.test(file))
    .sort((a, b) => a.localeCompare(b));
  const expected = ["vendor/three-r180.js", ...files];

  if (scripts.join("\n") !== expected.join("\n")) {
    fail("index.html script order does not match src/js file order");
    console.error("expected:", expected.join(", "));
    console.error("found:   ", scripts.join(", "));
  }

  for (const name of STYLE_FILES) {
    try {
      await access(path.join(root, "src/styles", `${name}.css`));
    } catch {
      fail(`missing src/styles/${name}.css`);
    }
  }

  const parts = [];
  for (const file of expected) {
    parts.push(await readFile(path.join(root, "src/js", file), "utf8"));
  }
  const wrapped = `(() => {\n${parts.join("\n\n")}\n})();\n`;
  await transform(wrapped, { loader: "js", target: ["es2020"] });

  const css = (
    await Promise.all(
      STYLE_FILES.map((name) => readFile(path.join(root, "src/styles", `${name}.css`), "utf8")),
    )
  ).join("\n");
  await transform(css, { loader: "css", target: ["es2020"] });

  if (!process.exitCode) {
    console.log(`ok: ${expected.length} JS files, ${STYLE_FILES.length} CSS files, syntax valid`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
