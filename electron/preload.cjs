"use strict";

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld(
  "saltlineDesktop",
  Object.freeze({
    isDesktop: true,
    platform: process.platform,
    versions: Object.freeze({
      electron: process.versions.electron,
      chrome: process.versions.chrome,
    }),
    toggleFullscreen: () => ipcRenderer.invoke("saltline:toggle-fullscreen"),
  }),
);
