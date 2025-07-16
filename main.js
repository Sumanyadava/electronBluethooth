const { app, BrowserWindow } = require('electron');

function createWindow () {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      // Enable Bluetooth permissions
      permissions: ['bluetooth']
    }
  });

  // Set permissions for Bluetooth
  win.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    const bluetoothPermissions = ['bluetooth', 'bluetooth-adapter'];
    if (bluetoothPermissions.includes(permission)) {
      callback(true); // Allow Bluetooth permissions
    } else {
      callback(false); // Deny other permissions
    }
  });

  win.loadFile('index.html');
  
  // Open DevTools in development (optional)
  // win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
}); 