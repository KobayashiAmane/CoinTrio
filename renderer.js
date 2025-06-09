/************************************************
 * renderer.js
 *
 * This script runs in the renderer process.
 * It handles:
 * 1) Drag-and-drop coin into jars
 * 2) Prompt user for a note
 * 3) Send the data to main process for saving
 * 4) Randomly choose a coin image from local UI folder
 *
 * 该脚本运行在渲染进程：
 * 1）实现将“硬币”拖拽到不同的“罐子”
 * 2）提示用户输入备注信息
 * 3）使用IPC发送数据到主进程进行持久化
 * 4）从本地UI文件夹中随机挑选硬币图片进行展示
 ************************************************/

// 引入 ipcRenderer 模块
// Import ipcRenderer (requires nodeIntegration=true in main process)
const { ipcRenderer } = require('electron');

/**
 * An array of possible coin image filenames in the 'UI' folder.
 * 可能的硬币图片文件名列表，放在 UI 文件夹下
 */
const coinImages = [
  "./UI/coin1.png",
  "./UI/coin2.png",
  // 你可以在这里添加更多图片路径
];

/**
 * Randomly choose one coin image path
 * 随机挑选一张硬币图片
 */
function getRandomCoinImage() {
  const index = Math.floor(Math.random() * coinImages.length);
  return coinImages[index];
}

// DOM elements
const coinImg = document.getElementById('coin');
const jobHuntJar = document.getElementById('jobHuntJar');
const learningJar = document.getElementById('learningJar');
const exerciseJar = document.getElementById('exerciseJar');

// If the coin image element exists, we can set it to a random image on load
if (coinImg) {
  // Set a random coin image source each time the app is opened
  coinImg.src = getRandomCoinImage();

  // Optional: If you want to randomize again each time the user drags, you could do:
  /*
  coinImg.addEventListener('dragstart', () => {
    coinImg.src = getRandomCoinImage();
  });
  */
} else {
  console.warn("coinImg not found. Check index.html <img id='coin'>.");
}

// Setup drag-over & drop for each jar
if (jobHuntJar && learningJar && exerciseJar) {
  [jobHuntJar, learningJar, exerciseJar].forEach(jar => {
    jar.addEventListener('dragover', (e) => {
      e.preventDefault(); // Allow drop
    });

    jar.addEventListener('drop', (e) => {
      e.preventDefault();
      const jarId = jar.id;
      console.log('Dropped coin into:', jarId);
      handleCoinDrop(jarId);
    });
  });
}

// Optional: console log or handle coin dragstart
if (coinImg) {
  coinImg.addEventListener('dragstart', (e) => {
    console.log('Coin drag start...');
  });
}

/**
 * handleCoinDrop
 * Called when user drops a coin into one jar.
 * 当硬币丢到某个罐子时，询问备注并发送到主进程保存
 */
function handleCoinDrop(jarId) {
  const note = prompt(`You dropped a coin into ${jarId}!\nEnter a note:`, "");
  if (note !== null) {
    const coinData = {
      jarId: jarId,
      note: note,
      time: new Date().toISOString()
    };
    // Send to main process via IPC
    ipcRenderer.send('save-coin-data', coinData);

    console.log('Coin data sent to main process:', coinData);
  }
}


