const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.on('toggle-bluetooth', (event, status) => {
    const command = status === 'on' ? 'bluetoothctl power on' : 'bluetoothctl power off';
    exec(command, (error, stdout, stderr) => {
      if (error) {
        event.reply('bluetooth-status', `Error: ${stderr}`);
      } else {
        event.reply('bluetooth-status', `Bluetooth turned ${status}`);
      }
    });
  });






  ipcMain.on('list-bluetooth-devices', (event) => {
  exec('bluetoothctl devices', (error, stdout, stderr) => {
    if (error) {
      event.reply('bluetooth-devices-list', `Error: ${stderr}`);
    } else {
      event.reply('bluetooth-devices-list', stdout);
    }
  });
});

ipcMain.on('connect-device', (event, macAddress) => {
  const command = `bluetoothctl connect ${macAddress}`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      event.reply('device-connection-status', `Failed to connect: ${stderr}`);
    } else {
      event.reply('device-connection-status', `Connected to ${macAddress}`);
    }
  });
});


});
