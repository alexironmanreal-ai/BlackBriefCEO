/**
 * BRIEF AI — Electron shell (Windows installer).
 * Server runs as Node via ELECTRON_RUN_AS_NODE (not Electron UI process).
 */
const { app, BrowserWindow, dialog, shell } = require("electron");
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const PORT = process.env.BLACKBRIEF_PORT || "4310";
const HOST = "127.0.0.1";

let serverProc = null;
let mainWindow = null;
let serverLog = "";

function appRoot() {
  if (app.isPackaged) {
    return app.getAppPath();
  }
  return path.join(__dirname, "..");
}

function resolveServerEntry(root) {
  const candidates = [
    path.join(root, ".output", "server", "index.mjs"),
    path.join(root, ".output", "server", "index.js"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  if (app.isPackaged && process.resourcesPath) {
    const unpacked = path.join(
      process.resourcesPath,
      "app.asar.unpacked",
      ".output",
      "server",
      "index.mjs",
    );
    if (fs.existsSync(unpacked)) return unpacked;
  }
  return null;
}

function appendLog(line) {
  serverLog += String(line);
  if (serverLog.length > 8000) serverLog = serverLog.slice(-8000);
}

function waitForServer(url, attempts = 50, intervalMs = 400) {
  return new Promise((resolve, reject) => {
    let left = attempts;
    const tick = () => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve();
      });
      req.on("error", () => {
        left -= 1;
        if (left <= 0) {
          reject(
            new Error(
              "El servidor no respondió a tiempo.\n\n" +
                (serverLog.trim() || "(sin log del servidor)"),
            ),
          );
        } else {
          setTimeout(tick, intervalMs);
        }
      });
    };
    tick();
  });
}

function startServer(root) {
  const entry = resolveServerEntry(root);

  if (entry) {
    serverProc = spawn(process.execPath, [entry], {
      cwd: root,
      env: {
        ...process.env,
        ELECTRON_RUN_AS_NODE: "1",
        PORT: String(PORT),
        NITRO_PORT: String(PORT),
        HOST,
        NODE_ENV: "production",
      },
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });
  } else {
    const npx = process.platform === "win32" ? "npx.cmd" : "npx";
    serverProc = spawn(
      npx,
      ["vite", "preview", "--host", HOST, "--port", String(PORT)],
      {
        cwd: root,
        env: { ...process.env, NODE_ENV: "production" },
        stdio: ["ignore", "pipe", "pipe"],
        shell: true,
        windowsHide: true,
      },
    );
  }

  if (serverProc.stdout) {
    serverProc.stdout.on("data", (d) => appendLog(d.toString()));
  }
  if (serverProc.stderr) {
    serverProc.stderr.on("data", (d) => appendLog(d.toString()));
  }
  serverProc.on("error", (err) => appendLog("spawn error: " + err.message + "\n"));
  serverProc.on("exit", (code) => appendLog("server exit code=" + code + "\n"));
}

function loadingHtml(message) {
  return (
    "data:text/html;charset=utf-8," +
    encodeURIComponent(
      "<!DOCTYPE html><html><head><meta charset=\"utf-8\"/><style>" +
        "body{margin:0;background:#0b0b0a;color:#eceae3;font-family:system-ui,sans-serif;" +
        "display:flex;min-height:100vh;align-items:center;justify-content:center}" +
        ".box{text-align:center;max-width:28rem;padding:2rem}" +
        "h1{font-size:1.25rem;font-weight:600;margin:0 0 .75rem}" +
        "p{opacity:.7;line-height:1.5;margin:0}</style></head><body>" +
        "<div class=\"box\"><h1>BRIEF AI</h1><p>" +
        message +
        "</p></div></body></html>",
    )
  );
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: "#0b0b0a",
    title: "BRIEF AI",
    show: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.loadURL(loadingHtml("Iniciando el motor local…"));

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

async function boot() {
  const root = appRoot();
  createWindow();
  startServer(root);

  const url = "http://" + HOST + ":" + PORT + "/";
  try {
    await waitForServer(url);
    if (mainWindow && !mainWindow.isDestroyed()) {
      await mainWindow.loadURL(url);
    }
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.loadURL(
        loadingHtml(
          "No se pudo iniciar el servidor local. Cerrá e intentá de nuevo, o usá npm run dev.",
        ),
      );
    }
    dialog.showErrorBox("BRIEF AI — error al iniciar", detail);
  }
}

function shutdown() {
  if (!serverProc) return;
  try {
    if (process.platform === "win32" && serverProc.pid) {
      spawn("taskkill", ["/pid", String(serverProc.pid), "/f", "/t"], {
        windowsHide: true,
      });
    } else {
      serverProc.kill("SIGTERM");
    }
  } catch (_) {
    /* ignore */
  }
  serverProc = null;
}

app.whenReady().then(function () {
  boot();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) boot();
  });
});

app.on("window-all-closed", function () {
  shutdown();
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", function () {
  shutdown();
});
