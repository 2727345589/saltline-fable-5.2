import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);

const hostPlatform =
  process.platform === "darwin" ? "mac" : process.platform === "win32" ? "win" : "linux";

const requestedPlatform = ["mac", "win", "linux"].find((platform) =>
  args.includes(`--${platform}`),
);
const targetPlatform = requestedPlatform || hostPlatform;

const localElectron = path.join(root, "node_modules/electron/dist");
const useLocalElectron = targetPlatform === hostPlatform && existsSync(localElectron);

const builderArgs = [...args];
if (useLocalElectron) {
  builderArgs.push(`--config.electronDist=${path.relative(root, localElectron)}`);
  console.log(`[electron-builder] using local Electron distribution: ${localElectron}`);
} else if (targetPlatform !== hostPlatform) {
  console.log(
    `[electron-builder] cross-building ${targetPlatform} from ${hostPlatform}; ` +
      "Electron for the target platform will be downloaded.",
  );
}

const bin = path.join(
  root,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "electron-builder.cmd" : "electron-builder",
);
const result = spawnSync(bin, builderArgs, {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}
process.exit(result.status ?? 1);
