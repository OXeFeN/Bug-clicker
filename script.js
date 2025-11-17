// ----- Stav hry -----
let autoClickIntervalId = null;
let coins = 0;
let autoClickerEnabled = false;
let autoClickerPowerLevel = 1;
let autoClickerSpeedLevel = 1;
let autoClickerBasePrice = 1;
let autoClickerPowerBasePrice = 5;
let autoClickerSpeedBasePrice = 20;
let autoClickerBaseSpeed = 5000;

// ----- Selektory -----
const coinsSpan = document.querySelector("#coins");
const autoEnabledSpan = document.querySelector("#autoclicker-enabled");
const autoPowerPriceSpan = document.querySelector("#autoclicker-powerPrice");
const autoSpeedPriceSpan = document.querySelector("#autoclicker-speedPrice");
const autoClickerPriceSpan = document.querySelector("#autoClicker-price");
const autoPowerLevelSpan = document.querySelector("#autoclicker-powerLevel");
const autoSpeedLevelSpan = document.querySelector("#autoclicker-speedLevel");

const clickButton = document.querySelector("#click-button");
const buyAutoButton = document.querySelector("#buyAutoClick-activate");
const resetButton = document.querySelector("#reset-game");

const openShopButton = document.querySelector("#open-shop");
const shopPanel = document.querySelector("#shop");
const closeShopButton = document.querySelector("#close-shop");

const buyAutoPower = document.querySelector("#buyAutoClick-power");
const buyAutoSpeed = document.querySelector("#buyAutoClick-speed");



// ----- Načtení uložené hry -----
function loadGame() {
  const saved = localStorage.getItem("bugClickerSave");
  if (saved) {
    const data = JSON.parse(saved);
    coins = data.coins ?? 0;
    autoClickerEnabled = data.autoClickerEnabled ?? false;
    autoClickerPowerLevel = data.autoClickerPowerLevel ?? 1;
    autoClickerSpeedLevel = data.autoClickerSpeedLevel ?? 1;

  }
  updateUI();
}

// ----- Uložení hry -----
function saveGame() {
  const data = {
    coins,
    autoClickerEnabled,
    autoClickerPowerLevel,
    autoClickerSpeedLevel,
  };
  localStorage.setItem("bugClickerSave", JSON.stringify(data));
}

// ----- Přepočet ceny AutoClickeru -----
function getAutoClickerPrice(){
    return autoClickerBasePrice
}
function getAutoClickerPowerPrice() {
  // cena roste s levelem (např. 10, 15, 22, ...)
  return Math.floor(autoClickerPowerBasePrice * Math.pow(1.5, autoClickerPowerLevel));
}
function getAutoClickerSpeedPrice() {
    return Math.floor(autoClickerSpeedBasePrice * Math.pow(1.05, autoClickerSpeedLevel));
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
  autoEnabledSpan.textContent = autoClickerEnabled;
  autoPowerPriceSpan.textContent = getAutoClickerPowerPrice();
  autoPowerLevelSpan.textContent = autoClickerPowerLevel;
  autoSpeedPriceSpan.textContent = getAutoClickerSpeedPrice();
  autoSpeedLevelSpan.textContent = autoClickerSpeedLevel;
  autoClickerPriceSpan.textContent = autoClickerBasePrice;

  // Aktivace / deaktivace tlačítka podle počtu coinů
  buyAutoButton.disabled = coins < getAutoClickerPrice() || autoClickerEnabled == true;
  buyAutoPower.disabled = coins < getAutoClickerPowerPrice();
  buyAutoSpeed.disabled = coins < getAutoClickerSpeedPrice();
}

// ----- Click na hlavní tlačítko -----
clickButton.addEventListener("click", () => {
  addCoins(autoClickerPowerLevel);
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
    autoClickerEnabled = true
    startAutoClickLoop();
    updateUI();
    saveGame();
  }
});

// ----- Upgrade AutoClickeru -----
buyAutoSpeed.addEventListener("click", () => {
    const price = getAutoClickerSpeedPrice();
    if (coins >= price) {
      coins -= price;
      autoClickerSpeedLevel += 1;
      startAutoClickLoop();
      updateUI();
      saveGame();
    }
  });

buyAutoPower.addEventListener("click", () => {
    const price = getAutoClickerPowerPrice();
    if (coins >= price) {
      coins -= price;
      autoClickerPowerLevel += 1;
      updateUI();
      saveGame();
    }
  });

// ----- Auto-klepání každou vteřinu -----
function startAutoClickLoop(){
    if (autoClickIntervalId !== null)
        clearInterval(autoClickIntervalId)
    autoClickIntervalId = setInterval(() => {
        if (autoClickerEnabled == true) {
        // každý level = +1 coin za čas
        addCoins(autoClickerPowerLevel);
        }
        }, getAutoClickerSpeed());
}

function getAutoClickerSpeed(){
    return  (autoClickerBaseSpeed * Math.pow(0.5, (autoClickerSpeedLevel - 1)))
}


// ----- Reset hry -----
resetButton.addEventListener("click", () => {
  if (confirm("Opravdu chceš začít znovu?")) {
    coins = 0;
    autoClickerEnabled = false;
    autoClickerSpeedLevel = 1;
    autoClickerPowerLevel = 1;

    saveGame();
    updateUI();
  }
});

// ----- Start -----
loadGame();
