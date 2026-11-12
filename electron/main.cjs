"use strict";

const {
  app,
  BrowserWindow,
  Menu,
  dialog,
  ipcMain,
  protocol,
  session,
  shell,
} = require("electron");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const INDEX = path.join(DIST, "index.html");
const DEV_URL = process.env.SALTLINE_DEV_URL || "";
const isDev = !app.isPackaged || process.argv.includes("--dev") || Boolean(DEV_URL);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

// A privileged custom scheme gives the game a normal, secure origin. This keeps
// localStorage, fullscreen, pointer lock and audio behaviour close to a browser.
protocol.registerSchemesAsPrivileged([
  {
    scheme: "saltline",
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
    },
  },
]);

// The game starts audio from a click, but this avoids Chromium's stricter
// autoplay gating on desktop.
app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    const win = BrowserWindow.getAllWindows()[0];
    if (!win) return;
    if (win.isMinimized()) win.restore();
    win.focus();
  });

  app.whenReady().then(onReady).catch((error) => {
    dialog.showErrorBox("Saltline failed to start", String(error && error.stack ? error.stack : error));
    app.quit();
  });
}

function mimeType(file) {
  return MIME[path.extname(file).toLowerCase()] || "application/octet-stream";
}

function safeDistPath(urlPath) {
  const decoded = decodeURIComponent(urlPath || "/");
  const relative = decoded === "/" || decoded === "" ? "/index.html" : decoded;
  const target = path.resolve(DIST, `.${relative}`);
  if (target !== DIST && !target.startsWith(DIST + path.sep)) return null;
  return target;
}

async function serveGameFile(request) {
  try {
    const url = new URL(request.url);
    const file = safeDistPath(url.pathname);
    if (!file) return new Response("Forbidden", { status: 403 });
    const body = await fsp.readFile(file);
    const headers = {
      "Content-Type": mimeType(file),
      "Cache-Control": "no-cache",
    };
    if (path.extname(file).toLowerCase() === ".html") {
      headers["Content-Security-Policy"] = [
        "default-src 'self' saltline:",
        "script-src 'self' saltline:",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: blob:",
        "media-src 'self' data: blob:",
        "connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com",
        "object-src 'none'",
        "base-uri 'none'",
        "frame-ancestors 'none'",
      ].join("; ");
    }
    return new Response(body, { status: 200, headers });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

function buildMenu() {
  const template = [];

  if (process.platform === "darwin") template.push({ role: "appMenu" });

  template.push({
    label: "File",
    submenu: [
      { role: "close" },
      ...(process.platform === "darwin" ? [] : [{ type: "separator" }, { role: "quit" }]),
    ],
  });

  template.push({ role: "editMenu" });

  const viewSubmenu = [
    {
      label: "Toggle Full Screen",
      accelerator: process.platform === "darwin" ? "Ctrl+Command+F" : "F11",
      click: () => {
        const win = BrowserWindow.getFocusedWindow();
        if (win) win.setFullScreen(!win.isFullScreen());
      },
    },
    { type: "separator" },
    { role: "resetZoom" },
    { role: "zoomIn" },
    { role: "zoomOut" },
  ];

  if (isDev) {
    viewSubmenu.push(
      { type: "separator" },
      { role: "reload" },
      { role: "toggleDevTools" },
    );
  }

  template.push({ label: "View", submenu: viewSubmenu });

  if (process.platform === "darwin") template.push({ role: "windowMenu" });

  template.push({
    label: "Help",
    submenu: [
      {
        label: "Project on GitHub",
        click: () => shell.openExternal("https://github.com/realcodebear/saltline-fable-5.2"),
      },
    ],
  });

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function isAllowedNavigation(url) {
  try {
    const parsed = new URL(url);
    if (DEV_URL) return parsed.origin === new URL(DEV_URL).origin;
    return parsed.protocol === "saltline:" && parsed.host === "app";
  } catch {
    return false;
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    minWidth: 960,
    minHeight: 600,
    title: "Saltline",
    backgroundColor: "#0b0d0f",
    show: false,
    autoHideMenuBar: process.platform !== "darwin",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false,
      backgroundThrottling: false,
    },
  });

  win.once("ready-to-show", () => win.show());

  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  win.webContents.on("will-navigate", (event, url) => {
    if (!isAllowedNavigation(url)) event.preventDefault();
  });
  win.webContents.on("will-attach-webview", (event) => event.preventDefault());

  win.webContents.on("did-fail-load", (_event, code, description, url) => {
    if (code === -3) return; // aborted by a newer navigation
    dialog.showErrorBox(
      "Saltline failed to load",
      `${description} (${code})\n${url}\n\nRun "npm run build" and try again.`,
    );
  });

  if (DEV_URL) {
    win.loadURL(DEV_URL);
  } else {
    win.loadURL("saltline://app/index.html");
  }

  return win;
}

async function onReady() {
  if (!DEV_URL && !fs.existsSync(INDEX)) {
    dialog.showErrorBox(
      "Saltline has not been built",
      `Missing ${INDEX}\n\nRun "npm run build" before starting the desktop app.`,
    );
    app.quit();
    return;
  }

  app.setName("Saltline");
  if (process.platform === "win32") {
    app.setAppUserModelId("io.github.realcodebear.saltline");
  }

  app.setAboutPanelOptions({
    applicationName: "Saltline",
    applicationVersion: app.getVersion(),
    copyright: "Original game by Claude Fable 5.2 / Felix Rieseberg",
    credits: "Desktop shell added for local play.",
  });

  if (!DEV_URL) protocol.handle("saltline", serveGameFile);

  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    callback(permission === "fullscreen" || permission === "pointerLock");
  });
  session.defaultSession.setPermissionCheckHandler((_webContents, permission) => {
    return permission === "fullscreen" || permission === "pointerLock";
  });

  ipcMain.handle("saltline:toggle-fullscreen", (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) return false;
    win.setFullScreen(!win.isFullScreen());
    return win.isFullScreen();
  });

  buildMenu();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
