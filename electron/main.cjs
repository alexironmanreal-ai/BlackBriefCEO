/**
 * BRIEF AI — desktop shell.
 * Requires system Node.js. Starts production server (.output) or vite preview.
 * Writes userData/BRIEF-AI/start.log for debugging.
 */
const { app, BrowserWindow, dialog } = require("electron");
const { spawn, execSync } = require("node:child_process");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const PORT = process.env.BLACKBRIEF_PORT || "8080";
const HOST = "127.0.0.1";

let serverProc = null;
let mainWindow = null;
let logPath = "";

function log(line) {
  const msg = "[" + new Date().toISOString() + "] " + line + "\n";
  try {
    if (!logPath) {
      const dir = path.join(app.getPath("userData"), "BRIEF-AI");
      fs.mkdirSync(dir, { recursive: true });
      logPath = path.join(dir, "start.log");
    }
    fs.appendFileSync(logPath, msg);
  } catch (_) {}
  console.log(line);
}

function appRoot() {
  if (app.isPackaged) {
    if (process.resourcesPath) {
      const unpacked = path.join(process.resourcesPath, "app.asar.unpacked");
      if (fs.existsSync(unpacked)) return unpacked;
      const resApp = path.join(process.resourcesPath, "app");
      if (fs.existsSync(resApp)) return resApp;
    }
    return app.getAppPath();
  }
  return path.join(__dirname, "..");
}

function findNode() {
  try {
    if (process.platform === "win32") {
      const out = execSync("where node", { encoding: "utf8" });
      const line = out.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)[0];
      if (line && fs.existsSync(line)) return line;
    } else {
      const out = execSync("which node", { encoding: "utf8" }).trim();
      if (out) return out;
    }
  } catch (_) {}
  return null;
}

function resolveEntry(root) {
  const list = [
    path.join(root, ".output", "server", "index.mjs"),
    path.join(root, ".output", "server", "index.js"),
  ];
  for (const p of list) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function waitForServer(url, attempts = 80) {
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
        if (left <= 0) reject(new Error("Timeout esperando " + url));
        else setTimeout(tick, 400);
      });
    };
    tick();
  });
}

function startServer(root, nodeBin) {
  const entry = resolveEntry(root);
  const env = {
    ...process.env,
    PORT: String(PORT),
    NITRO_PORT: String(PORT),
    HOST,
    NODE_ENV: "production",
    VITE_AUTH_ENABLED: "true",
  };

  if (entry && nodeBin) {
    log("start: node " + entry);
    serverProc = spawn(nodeBin, [entry], {
      cwd: root,
      env,
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });
  } else if (nodeBin) {
    const viteJs = path.join(root, "node_modules", "vite", "bin", "vite.js");
    if (fs.existsSync(viteJs)) {
      log("start: vite preview via " + viteJs);
      serverProc = spawn(
        nodeBin,
        [viteJs, "preview", "--host", HOST, "--port", String(PORT)],
        { cwd: root, env, stdio: ["ignore", "pipe", "pipe"], windowsHide: true },
      );
    } else {
      log("start: npx vite preview");
      serverProc = spawn(
        process.platform === "win32" ? "npx.cmd" : "npx",
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
  } else {
    throw new Error("Node.js no encontrado");
  }

  serverProc.stdout.on("data", (d) => log("out: " + d.toString().trim()));
  serverProc.stderr.on("data", (d) => log("err: " + d.toString().trim()));
  serverProc.on("exit", (c) => log("server exit " + c));
  serverProc.on("error", (e) => log("spawn error " + e.message));
}

function loadingHtml(html) {
  return (
    "data:text/html;charset=utf-8," +
    encodeURIComponent(
      "<!DOCTYPE html><html><body style=\"margin:0;background:#0b0b0a;color:#eceae3;font-family:system-ui;display:flex;min-height:100vh;align-items:center;justify-content:center;text-align:center;padding:2rem\"><div><h1>BRIEF AI</h1><p style=\"opacity:.8;max-width:28rem;line-height:1.5\">" +
        html +
        "</p></div></body></html>",
    )
  );
}

async function boot() {
  const root = appRoot();
  log("appRoot=" + root);
  log("isPackaged=" + app.isPackaged);

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    backgroundColor: "#0b0b0a",
    title: "BRIEF AI",
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  mainWindow.loadURL(loadingHtml("Iniciando motor local…"));

  const nodeBin = findNode();
  log("node=" + (nodeBin || "MISSING"));

  if (!nodeBin) {
    const msg =
      "No se encontró Node.js.<br/><br/>Instalá LTS desde nodejs.org, reiniciá Windows y volvé a abrir BRIEF AI.<br/><br/>Mientras tanto usá BRIEF-AI.bat en la carpeta del proyecto.";
    mainWindow.loadURL(loadingHtml(msg));
    dialog.showErrorBox(
      "BRIEF AI",
      "Falta Node.js.\n\n1) https://nodejs.org (LTS)\n2) Reiniciar PC\n3) Abrir BRIEF AI\n\nO usá BRIEF-AI.bat",
    );
    return;
  }

  try {
    startServer(root, nodeBin);
    const url = "http://" + HOST + ":" + PORT + "/";
    await waitForServer(url);
    log("ready " + url);
    await mainWindow.loadURL(url);
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    log("FAIL " + detail);
    mainWindow.loadURL(
      loadingHtml(
        "No arrancó el servidor.<br/><br/>" +
          detail +
          "<br/><br/>Log: " +
          (logPath || "(n/a)") +
          "<br/><br/>Usá BRIEF-AI.bat o npm run dev",
      ),
    );
    dialog.showErrorBox("BRIEF AI — error", detail + "\n\nLog: " + logPath);
  }
}

function shutdown() {
  if (!serverProc) return;
  try {
    if (process.platform === "win32" && serverProc.pid) {
      spawn("taskkill", ["/pid", String(serverProc.pid), "/f", "/t"], { windowsHide: true });
    } else serverProc.kill("SIGTERM");
  } catch (_) {}
  serverProc = null;
}

app.whenReady().then(() => {
  boot();
});

app.on("window-all-closed", () => {
  shutdown();
  if (process.platform !== "darwin") app.quit();
});
app.on("before-quit", () => shutdown());
