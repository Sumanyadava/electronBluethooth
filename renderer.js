const { ipcRenderer } = require('electron');

function toggleBluetooth(status) {
  ipcRenderer.send('toggle-bluetooth', status);
}

ipcRenderer.on('bluetooth-status', (event, message) => {
  document.getElementById('status').innerText = message;
});


function listDevices() {
  ipcRenderer.send('list-bluetooth-devices');
}

ipcRenderer.on('bluetooth-devices-list', (event, data) => {
  const lines = data.trim().split('\n');
const container = document.getElementById('devices');
container.innerHTML = '';

lines.forEach(line => {
  const parts = line.split(' ');
  const mac = parts[1];
  const name = parts.slice(2).join(' ');

  const btn = document.createElement('button');
  btn.innerText = `${name} (${mac})`;
  btn.onclick = () => connectToDevice(mac);
  btn.style.display = 'block';
  btn.style.margin = '5px 0';
  container.appendChild(btn);
});

});

function connectToDevice(mac) {
  ipcRenderer.send('connect-device', mac);
}

ipcRenderer.on('device-connection-status', (event, message) => {
  alert(message);
});

