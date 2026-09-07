/**
 * BRIEF AI desktop shell.
 * Prefer system Node to run the production server (packaged Electron+Nitro is fragile).
 * Falls back to ELECTRON_RUN_AS_NODE if node is not on PATH.
 */
const { app, BrowserWindow, dialog, shell } = require("electron");
const { spawn, execSync } = require("node:child_process");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const PORT = process.env.BLACKBRIEF_PORT || "8080";
const HOST = "127.0.0.1";

let serverProc = null;
let mainWindow = null;
let serverLog = "";

function appRoot() {
  if (app.isPackaged) return app.getAppPath();
  return path.join(__dirname, "..");
}

function findNodeBinary() {
  try {
    if (process.platform === "win32") {
      const out = execSync("where node", { encoding: "utf8" });
      const line = out.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)[0];
      if (line && fs.existsSync(line)) return line;
    } else {
      const out = execSync("which node", { encoding: "utf8" }).trim();
      if (out && fs.existsSync(out)) return out;
    }
  } catch (_) {}
  return null;
}

function resolveServerEntry(root) {
  const candidates = [
    path.join(root, ".output", "server", "index.mjs"),
    path.join(root, ".output", "server", "index.js"),
  ];
  if (app.isPackaged && process.resourcesPath) {
    candidates.push(
      path.join(process.resourcesPath, "app.asar.unpacked", ".output", "server", "index.mjs"),
      path.join(process.resourcesPath, "app.asar.unpacked", ".output", "server", "index.js"),
    );
  }
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

function appendLog(line) {
  serverLog += String(line);
  if (serverLog.length > 12000) serverLog = serverLog.slice(-12000);
}

function waitForServer(url, attempts = 60, intervalMs = 500) {
  return new Promise((resolve, reject) => {
    let left = attempts;
    const tick = () => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve();
      });
      req.setTimeout(2000);
      req.on("error", () => {
        left -= 1;
        if (left <= 0) {
          reject(
            new Error(
              "El servidor no respondió.\n\n" +
                (serverLog.trim() || "(sin log)") +
                "\n\nTip: instalá Node.js LTS y volvé a abrir BRIEF AI, o usá:\nnpm run dev",
            ),
          );
        } else setTimeout(tick, intervalMs);
      });
    };
    tick();
  });
}

function startServer(root) {
  const entry = resolveServerEntry(root);
  const nodeBin = findNodeBinary();
  const env = {
    ...process.env,
    PORT: String(PORT),
    NITRO_PORT: String(PORT),
    HOST,
    NODE_ENV: "production",
    VITE_AUTH_ENABLED: process.env.VITE_AUTH_ENABLED || "true",
  };

  if (entry && nodeBin) {
    appendLog("using system node: " + nodeBin + "\nentry: " + entry + "\n");
    serverProc = spawn(nodeBin, [entry], {
      cwd: root,
      env,
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });
  } else if (entry) {
    appendLog("using ELECTRON_RUN_AS_NODE\nentry: " + entry + "\n");
    serverProc = spawn(process.execPath, [entry], {
      cwd: root,
      env: { ...env, ELECTRON_RUN_AS_NODE: "1" },
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });
  } else {
    const npx = process.platform === "win32" ? "npx.cmd" : "npx";
    appendLog("fallback vite preview\n");
    serverProc = spawn(
      npx,
      ["vite", "preview", "--host", HOST, "--port", String(PORT)],
      {
        cwd: root,
        env,
        stdio: ["ignore", "pipe", "pipe"],
        shell: true,
        windowsHide: true,
      },
    );
  }

  if (serverProc.stdout) serverProc.stdout.on("data", (d) => appendLog(d.toString()));
  if (serverProc.stderr) serverProc.stderr.on("data", (d) => appendLog(d.toString()));
  serverProc.on("error", (err) => appendLog("spawn error: " + err.message + "\n"));
  serverProc.on("exit", (code) => appendLog("server exit=" + code + "\n"));
}

function loadingHtml(message) {
  return (
    "data:text/html;charset=utf-8," +
    encodeURIComponent(
      "<!DOCTYPE html><html><head><meta charset=\"utf-8\"/><style>" +
        "body{margin:0;background:#0b0b0a;color:#eceae3;font-family:system-ui,sans-serif;" +
        "display:flex;min-height:100vh;align-items:center;justify-content:center}" +
        ".box{text-align:center;max-width:32rem;padding:2rem}" +
        "h1{font-size:1.25rem;margin:0 0 .75rem}" +
        "p{opacity:.75;line-height:1.5;margin:0;white-space:pre-wrap}</style></head>" +
        "<body><div class=\"box\"><h1>BRIEF AI</h1><p>" +
        message +
        "</p></div></body></html>",
    )
  );
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: "#0b0b0a",
    title: "BRIEF AI",
    show: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  mainWindow.loadURL(loadingHtml("Iniciando…"));
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

async function boot() {
  const root = appRoot();
  createWindow();

  const nodeBin = findNodeBinary();
  if (!nodeBin && app.isPackaged) {
    const msg =
      "No se encontró Node.js en el sistema.\n\n" +
      "1) Instalá Node.js LTS desde https://nodejs.org\n" +
      "2) Reiniciá la PC\n" +
      "3) Abrí BRIEF AI de nuevo\n\n" +
      "O en la carpeta del proyecto:\nnpm install\nnpm run dev";
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.loadURL(loadingHtml(msg.replace(/\n/g, "<br/>")));
    }
    dialog.showErrorBox("BRIEF AI", msg);
    return;
  }

  startServer(root);
  const url = "http://" + HOST + ":" + PORT + "/";
  try {
    await waitForServer(url);
    if (mainWindow && !mainWindow.isDestroyed()) await mainWindow.loadURL(url);
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.loadURL(loadingHtml("No se pudo iniciar.\n\n" + detail));
    }
    dialog.showErrorBox("BRIEF AI — error", detail);
  }
}

function shutdown() {
  if (!serverProc) return;
  try {
    if (process.platform === "win32" && serverProc.pid) {
      spawn("taskkill", ["/pid", String(serverProc.pid), "/f", "/t"], { windowsHide: true });
    } else {
      serverProc.kill("SIGTERM");
    }
  } catch (_) {}
  serverProc = null;
}

app.whenReady().then(() => {
  boot();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) boot();
  });
});

app.on("window-all-closed", () => {
  shutdown();
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => shutdown());
