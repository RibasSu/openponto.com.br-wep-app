const { app, BrowserWindow, nativeImage } = require("electron");
const path = require("path");
const os = require("os");
const { autoUpdater } = require("electron-updater");
const https = require("https");

function sendPing() {
  const deviceInfo = {
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    release: os.release(),
    user: os.userInfo().username,
    appVersion: app.getVersion(),
    electronVersion: process.versions.electron,
    nodeVersion: process.versions.node,
    timestamp: new Date().toISOString(),
  };
  const data = JSON.stringify(deviceInfo);
  const options = {
    hostname: "openponto.ikn.com.br",
    port: 443,
    path: "/api/ping",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(data),
    },
  };
  const req = https.request(options, (res) => {
    // Opcional: tratar resposta
  });
  req.on("error", (error) => {
    // Opcional: tratar erro
  });
  req.write(data);
  req.end();
}

function createWindow() {
  const iconPath = path.join(__dirname, "icon.png");
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "OpenPonto",
    icon: iconPath,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadURL("https://dev.openponto.com.br");

  win.webContents.on("did-fail-load", () => {
    win.loadFile("offline.html");
  });
}

app.whenReady().then(() => {
  createWindow();
  // Atualização automática
  autoUpdater.checkForUpdatesAndNotify();
  // Ping inicial
  sendPing();
  // Ping a cada 5 minutos
  setInterval(sendPing, 5 * 60 * 1000);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
