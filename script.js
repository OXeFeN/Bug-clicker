// ----- Stav hry -----
let coins = 0;
let autoClickerEnabled = false;
let autoClickerPowerLevel = 1;
let autoClickerSpeedLevel = 1;
let autoClickerBasePrice = 10;
let autoClickerPowerBasePrice = 100;
let autoClickerSpeedBasePrice = 10000;

// ----- Selektory -----
const coinsSpan = document.querySelector("#coins");
const autoEnabledSpan = document.querySelector("#autoclicker-enabled");
const autoPowerPriceSpan = document.querySelector("#autoclicker-powerPrice");
const autoSpeedPriceSpan = document.querySelector("#autoclicker-speedPrice");
const autoClickerPriceSpan = document.querySelector("#autoClicker-price");

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
    autoClickerEnabled = data.autoclickerEnabled ?? false;
    autoClickerPowerLevel = data.autoClickerPowerLevel ?? 1;
    autoClickerSpeedLevel = data.autoClickerSpeedLevel ?? 1000;

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
  autoEnabledSpan.textContent = autoClickerEnabled;
  autoPowerPriceSpan.textContent = getAutoClickerPowerPrice();
  autoSpeedPriceSpan.textContent = getAutoClickerSpeedPrice();

  // Aktivace / deaktivace tlačítka podle počtu coinů
  buyAutoButton.disabled = coins < getAutoClickerPrice() || autoClickerEnabled == true;
  buyAutoPower.disabled = coins < getAutoClickerPowerPrice();
  buyAutoSpeed.disabled = coins < getAutoClickerSpeedPrice();
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
    autoClickerEnabled = true
    updateUI();
    saveGame();
  }
});

// ----- Upgrade AutoClickeru -----
buyAutoSpeed.addEventListener("click", () => {
    const price = getAutoClickerSpeedPrice();
    if (coins >= price) {
      coins -= price;
      autoClickerSpeedLevel *= 0.9;
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
setInterval(() => {
  if (autoClickerEnabled == true) {
    // např. každý level = +1 coin za vteřinu
    addCoins(autoClickerPowerLevel * 1,1);
  }
}, 1000);

// ----- Reset hry -----
resetButton.addEventListener("click", () => {
  if (confirm("Opravdu chceš začít znovu?")) {
    coins = 0;
    autoClickerEnabled = false;
    autoClickerSpeedLevel = 5000;
    autoClickerPowerLevel = 1;

    saveGame();
    updateUI();
  }
});

// ----- Start -----
loadGame();
