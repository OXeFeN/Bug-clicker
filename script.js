// ----- Stav hry -----
let coins = 0;
let autoclickerEnabled = false;
let autoClickerPowerLevel = 1;
let autoClickerSpeedLevel = 1000;
let autoClickerBasePrice = 10;
let autoClickerPowerBasePrice = 100;
let autoClickerSpeedBasePrice = 10000;

// ----- Selektory -----
const coinsSpan = document.querySelector("#coins");
const autoLevelSpan = document.querySelector("#autoclicker-level");
const autoPriceSpan = document.querySelector("#autoclicker-price");

const clickButton = document.querySelector("#click-button");
const buyAutoButton = document.querySelector("#autoClick-activate");
const resetButton = document.querySelector("#reset-game");

const openShopButton = document.querySelector("#open-shop");
const shopPanel = document.querySelector("#shop");
const closeShopButton = document.querySelector("#close-shop");

const buyAutoPower = document.querySelector("#autoClick-power");
const buyAutoSpeed = document.querySelector("#autoClick-speed");



// ----- Načtení uložené hry -----
function loadGame() {
  const saved = localStorage.getItem("bugClickerSave");
  if (saved) {
    const data = JSON.parse(saved);
    coins = data.coins ?? 0;
    autoClickerLevel = data.autoClickerLevel ?? 0;
  }
  updateUI();
}

// ----- Uložení hry -----
function saveGame() {
  const data = {
    coins,
    autoClickerLevel,
  };
  localStorage.setItem("bugClickerSave", JSON.stringify(data));
}

// ----- Přepočet ceny AutoClickeru -----
function getAutoClickerPowerPrice() {
  // cena roste s levelem (např. 10, 15, 22, ...)
  return Math.floor(autoClickerPowerBasePrice * Math.pow(1.5, autoClickerPowerLevel));
}
function getAutoClickerSpeedPrice() {
    return Math.floor(autoClickerSpeedBasePrice * Math.pow(2, autoClickerSpeedLevel));
  }

// ----- Přidání coinů -----
function addCoins(amount) {
  coins += amount;
  updateUI();
  saveGame();
}

// ----- Update UI -----
function updateUI() {
  coinsSpan.textContent = coins;
  autoLevelSpan.textContent = autoClickerLevel;
  autoPriceSpan.textContent = getAutoClickerPrice();

  // Aktivace / deaktivace tlačítka podle počtu coinů
  buyAutoButton.disabled = coins < getAutoClickerPrice();
  buyAutoButton.disabled = coins < getAutoClickerPrice();
  buyAutoButton.disabled = coins < getAutoClickerPrice();
}

// ----- Click na hlavní tlačítko -----
clickButton.addEventListener("click", () => {
  addCoins(1);
});

// ----- Click na tlačítko obchodu -----
openShopButton.addEventListener("click", () => {
    shopPanel.classList.remove("hidden")
    openShopButton.classList.add("hidden")
  });

// ----- Click na tlačítko zavřít obchod -----
closeShopButton.addEventListener("click", () => {
    shopPanel.classList.add("hidden")
    openShopButton.classList.remove("hidden")
  });

// ----- Nákup AutoClickeru -----
buyAutoButton.addEventListener("click", () => {
  const price = getAutoClickerPrice();
  if (coins >= price) {
    coins -= price;
    autoClickerLevel += 1;
    updateUI();
    saveGame();
  }
});

// ----- Upgrade AutoClickeru -----
buyAutoButton.addEventListener("click", () => {
    const price = getAutoClickerPrice();
    if (coins >= price) {
      coins -= price;
      autoClickerLevel += 1;
      updateUI();
      saveGame();
    }
  });

buyAutoButton.addEventListener("click", () => {
    const price = getAutoClickerPrice();
    if (coins >= price) {
      coins -= price;
      autoClickerLevel += 1;
      updateUI();
      saveGame();
    }
  });

// ----- Auto-klepání každou vteřinu -----
setInterval(() => {
  if (autoClickerLevel > 0) {
    // např. každý level = +1 coin za vteřinu
    addCoins(autoClickerLevel * 1,1);
  }
}, 1000);

// ----- Reset hry -----
resetButton.addEventListener("click", () => {
  if (confirm("Opravdu chceš začít znovu?")) {
    coins = 0;
    autoClickerLevel = 0;
    saveGame();
    updateUI();
  }
});

// ----- Start -----
loadGame();
