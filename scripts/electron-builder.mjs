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

// Electron Builder verifies these downloads against its bundled checksums.
const MIRROR = "https://npmmirror.com/mirrors/electron-builder-binaries/";
const GITHUB = "https://github.com/electron-userland/electron-builder-binaries/releases/download/";

function probeAssetName() {
  const arch = process.arch === "arm64" ? "arm64" : process.arch === "ia32" ? "ia32" : "x64";
  if (process.platform === "darwin") {
    return `7zip@1.0.0/7zip-darwin-${arch === "arm64" ? "arm64" : "x86_64"}.tar.gz`;
  }
  if (process.platform === "win32") {
    return `7zip@1.0.0/7zip-win-${arch}.tar.gz`;
  }
  return `7zip@1.0.0/7zip-linux-${arch}.tar.gz`;
}

async function reachable(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
    });
    return (response.status >= 200 && response.status < 400) || response.status === 405;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

async function chooseMirror() {
  const configured =
    process.env.ELECTRON_BUILDER_BINARIES_MIRROR ||
    process.env.SALTLINE_ELECTRON_BUILDER_MIRROR ||
    "";
  if (configured) {
    console.log(`[electron-builder] using configured binary mirror: ${configured}`);
    return configured;
  }

  // `--dir` packaging does not need 7zip/dmg-builder, so keep it offline-fast.
  if (args.includes("--dir") || process.env.SALTLINE_SKIP_NETWORK_CHECK === "1") {
    return "";
  }

  const asset = probeAssetName();
  console.log("[electron-builder] checking Electron Builder binary download access...");
  if (await reachable(GITHUB + asset)) {
    console.log("[electron-builder] GitHub release downloads reachable");
    return "";
  }

  console.log("[electron-builder] GitHub release downloads unavailable, testing mirror...");
  if (await reachable(MIRROR + asset)) {
    console.log(`[electron-builder] using fallback binary mirror: ${MIRROR}`);
    return MIRROR;
  }

  console.warn(
    "[electron-builder] neither GitHub nor the fallback mirror is reachable. " +
      "Set ELECTRON_BUILDER_BINARIES_MIRROR to a reachable mirror before packaging.",
  );
  return "";
}

const mirror = await chooseMirror();

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
  env: {
    ...process.env,
    ...(mirror ? { ELECTRON_BUILDER_BINARIES_MIRROR: mirror } : {}),
  },
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}
process.exit(result.status ?? 1);
