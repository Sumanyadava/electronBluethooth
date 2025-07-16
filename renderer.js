// Bluetooth connection functionality
class BluetoothManager {
    constructor() {
        this.device = null;
        this.server = null;
        this.characteristic = null;
        this.isConnected = false;
        
        this.bluetoothBtn = document.getElementById('bluetoothBtn');
        this.statusDiv = document.getElementById('status');
        this.deviceInfoDiv = document.getElementById('deviceInfo');
        this.deviceNameSpan = document.getElementById('deviceName');
        this.deviceIdSpan = document.getElementById('deviceId');
        this.connectionTimeSpan = document.getElementById('connectionTime');
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        this.bluetoothBtn.addEventListener('click', () => {
            if (this.isConnected) {
                this.disconnect();
            } else {
                this.connect();
            }
        });
    }
    
    updateStatus(status, message) {
        this.statusDiv.className = `status ${status}`;
        this.statusDiv.textContent = `Status: ${message}`;
    }
    
    updateDeviceInfo() {
        if (this.device) {
            this.deviceNameSpan.textContent = this.device.name || 'Unknown Device';
            this.deviceIdSpan.textContent = this.device.id || 'Unknown ID';
            this.connectionTimeSpan.textContent = new Date().toLocaleString();
            this.deviceInfoDiv.style.display = 'block';
        } else {
            this.deviceInfoDiv.style.display = 'none';
        }
    }
    
    async connect() {
        try {
            this.updateStatus('connecting', 'Searching for Bluetooth devices...');
            this.bluetoothBtn.disabled = true;
            this.bluetoothBtn.textContent = '🔍 Searching...';
            
            // Check if Bluetooth is available
            if (!navigator.bluetooth) {
                throw new Error('Bluetooth is not supported in this browser');
            }
            
            // Request Bluetooth device with specific filters
            this.device = await navigator.bluetooth.requestDevice({
                // Accept all devices that are available
                acceptAllDevices: true,
                // Optional: You can specify specific services if needed
                // optionalServices: ['heart_rate', 'battery_service']
            });
            
            this.updateStatus('connecting', 'Connecting to device...');
            this.bluetoothBtn.textContent = '🔗 Connecting...';
            
            // Connect to the device
            this.server = await this.device.gatt.connect();
            
            this.isConnected = true;
            this.updateStatus('connected', `Connected to ${this.device.name || 'Bluetooth Device'}`);
            this.bluetoothBtn.textContent = '🔌 Disconnect';
            this.bluetoothBtn.disabled = false;
            
            this.updateDeviceInfo();
            
            // Listen for disconnection
            this.device.addEventListener('gattserverdisconnected', () => {
                this.handleDisconnection();
            });
            
            console.log('Bluetooth device connected successfully!');
            
        } catch (error) {
            console.error('Bluetooth connection error:', error);
            
            if (error.name === 'NotFoundError') {
                this.updateStatus('disconnected', 'No Bluetooth device selected');
            } else if (error.name === 'NotAllowedError') {
                this.updateStatus('disconnected', 'Bluetooth permission denied');
            } else if (error.name === 'NetworkError') {
                this.updateStatus('disconnected', 'Connection failed - device may be out of range');
            } else {
                this.updateStatus('disconnected', `Connection failed: ${error.message}`);
            }
            
            this.bluetoothBtn.textContent = '🔗 Connect to Bluetooth Device';
            this.bluetoothBtn.disabled = false;
            this.isConnected = false;
        }
    }
    
    async disconnect() {
        try {
            if (this.server && this.server.connected) {
                await this.server.disconnect();
            }
            this.handleDisconnection();
        } catch (error) {
            console.error('Error disconnecting:', error);
            this.handleDisconnection();
        }
    }
    
    handleDisconnection() {
        this.isConnected = false;
        this.device = null;
        this.server = null;
        this.characteristic = null;
        
        this.updateStatus('disconnected', 'Disconnected');
        this.bluetoothBtn.textContent = '🔗 Connect to Bluetooth Device';
        this.bluetoothBtn.disabled = false;
        this.deviceInfoDiv.style.display = 'none';
        
        console.log('Bluetooth device disconnected');
    }
    
    // Method to get available services (for future use)
    async getServices() {
        if (!this.server) {
            throw new Error('Not connected to any device');
        }
        
        const services = await this.server.getPrimaryServices();
        console.log('Available services:', services);
        return services;
    }
    
    // Method to get characteristics of a service (for future use)
    async getCharacteristics(serviceUuid) {
        if (!this.server) {
            throw new Error('Not connected to any device');
        }
        
        const service = await this.server.getPrimaryService(serviceUuid);
        const characteristics = await service.getCharacteristics();
        console.log('Available characteristics:', characteristics);
        return characteristics;
    }
}

// Initialize the Bluetooth manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const bluetoothManager = new BluetoothManager();
    
    // Make it globally accessible for debugging
    window.bluetoothManager = bluetoothManager;
    
    console.log('Bluetooth manager initialized');
}); 