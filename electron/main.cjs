/**
 * Electron shell for BlackBriefCEO desktop (.exe / .dmg / AppImage).
 * Starts the production Node server (TanStack Start) and opens a window.
 */
const { app, BrowserWindow, shell } = require("electron");
const { spawn } = require("node:child_process");
const path = require("node:path");
const http = require("node:http");

const PORT = process.env.BLACKBRIEF_PORT || "4310";
let serverProc = null;
let mainWindow = null;

function waitForServer(url, attempts = 60) {
  return new Promise((resolve, reject) => {
    let left = attempts;
    const tick = () => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve();
      });
      req.on("error", () => {
        left -= 1;
        if (left <= 0) reject(new Error("Server did not start in time"));
        else setTimeout(tick, 500);
      });
    };
    tick();
  });
}

function startServer() {
  const root = path.join(__dirname, "..");
  const entry = path.join(root, ".output", "server", "index.mjs");
  const fs = require("node:fs");
  if (fs.existsSync(entry)) {
    serverProc = spawn(process.execPath, [entry], {
      cwd: root,
      env: {
        ...process.env,
        PORT,
        NITRO_PORT: PORT,
        HOST: "127.0.0.1",
        NODE_ENV: "production",
      },
      stdio: "inherit",
    });
  } else {
    serverProc = spawn(
      process.platform === "win32" ? "npx.cmd" : "npx",
      ["vite", "preview", "--host", "127.0.0.1", "--port", PORT],
      { cwd: root, env: process.env, stdio: "inherit", shell: true },
    );
  }
  serverProc.on("exit", (code) => {
    if (code && code !== 0) console.error("Server exited", code);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: "#0b0b0a",
    title: "BlackBriefCEO",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  const url = `http://127.0.0.1:${PORT}/`;
  mainWindow.loadURL(url);
  mainWindow.webContents.setWindowOpenHandler(({ url: target }) => {
    shell.openExternal(target);
    return { action: "deny" };
  });
}

app.whenReady().then(async () => {
  startServer();
  try {
    await waitForServer(`http://127.0.0.1:${PORT}/`);
  } catch (err) {
    console.error(err);
  }
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (serverProc) {
    try {
      serverProc.kill();
    } catch {
      /* ignore */
    }
  }
  if (process.platform !== "darwin") app.quit();
});
