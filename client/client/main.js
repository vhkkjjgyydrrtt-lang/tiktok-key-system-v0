const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { machineIdSync } = require('node-machine-id');
const crypto = require('crypto');

const API = 'https://tiktok-api-v0.onrender.com'; // Link Render của bạn

function getDeviceId() {
  return crypto.createHash('sha256').update(machineIdSync(true)).digest('hex').slice(0, 32);
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1100, height: 750, title: "Săn Rương TikTok",
    webPreferences: { 
        preload: path.join(__dirname, 'preload.js'), 
        contextIsolation: true, 
        nodeIntegration: false 
    }
  });
  win.loadFile('index.html');
}

ipcMain.handle('login', async (_e, { key }) => {
  const res = await fetch(API + '/api/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, deviceId: getDeviceId() })
  });
  return await res.json();
});

ipcMain.handle('heartbeat', async (_e, { key }) => {
  const res = await fetch(API + '/api/heartbeat', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, deviceId: getDeviceId() })
  });
  return await res.json();
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
