const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Enable Node.js integration in the renderer process
      nodeIntegration: true
    }
  });

  mainWindow.loadFile('index.html');
}

// === 1) Initialize the app ===
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// === 2) Quit on close (except mac) ===
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// === 3) IPC Handler: save coin data ===
ipcMain.on('save-coin-data', (event, coinData) => {
  try {
    // We'll store the data file in the userData directory
    const filePath = path.join(app.getPath('userData'), 'coinData.json');

    // 1. Load existing data if file exists
    let existingData = [];
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      existingData = JSON.parse(raw);
    }

    // 2. Add new record
    existingData.push(coinData);

    // 3. Save back to file
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), 'utf-8');

    console.log('Saved coin data:', coinData);
  } catch (error) {
    console.error('Error saving coin data:', error);
  }
});
