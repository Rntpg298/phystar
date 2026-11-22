const statusElement = document.getElementById("status");
const hintElement = document.getElementById("hint");
const cameraButton = document.getElementById("camera-button");
const resultCard = document.getElementById("result-card");
const emptyState = document.getElementById("empty-state");
const contentState = document.getElementById("content-state");
const cardKind = document.getElementById("card-kind");
const cardTitle = document.getElementById("card-title");
const cardText = document.getElementById("card-text");
const cardLink = document.getElementById("card-link");
const cardNumber = document.getElementById("card-number");
const scanTime = document.getElementById("scan-time");
const successDot = document.getElementById("success-dot");
const manualButton = document.getElementById("manual-button");
const manualDialog = document.getElementById("manual-dialog");
const manualInput = document.getElementById("manual-input");
const manualSubmit = document.getElementById("manual-submit");
const privacyButton = document.getElementById("privacy-button");
const privacyDialog = document.getElementById("privacy-dialog");
const privacyClose = document.getElementById("privacy-close");
const atomButton = document.getElementById("atom-button");
const atomGameDialog = document.getElementById("atom-game-dialog");
const atomGameClose = document.getElementById("atom-game-close");
const atomGameBack = document.getElementById("atom-game-back");
const electronTarget = document.getElementById("electron-target");
const atomScore = document.getElementById("atom-score");
const atomRates = document.getElementById("atom-rates");
const elementGrid = document.getElementById("element-grid");
const elementProgressText = document.getElementById("element-progress-text");
const atomReset = document.getElementById("atom-reset");
const upgradeClick = document.getElementById("upgrade-click");
const upgradeAuto = document.getElementById("upgrade-auto");
const upgradeMagnet = document.getElementById("upgrade-magnet");
const upgradeFission = document.getElementById("upgrade-fission");
const upgradeLaser = document.getElementById("upgrade-laser");
const upgradeCollider = document.getElementById("upgrade-collider");
const upgradeSuperconductor = document.getElementById("upgrade-superconductor");
const upgradeNobel = document.getElementById("upgrade-nobel");
const electronCore = document.getElementById("electron-core");
const electronCoreValue = document.getElementById("electron-core-value");
const electronOrbits = document.getElementById("electron-orbits");

function createStarfield() {
  const starfield = document.getElementById("starfield");
  if (!starfield) return;

  const colors = [
    "rgba(255, 255, 255, 0.96)",
    "rgba(140, 232, 255, 0.96)",
    "rgba(217, 255, 115, 0.96)",
    "rgba(196, 173, 255, 0.96)",
  ];
  const stars = document.createDocumentFragment();

  for (let index = 0; index < 110; index += 1) {
    const star = document.createElement("span");
    const size = 1 + Math.random() * 2.2;
    const directionX = (Math.random() * 2 - 1) * 90;
    const directionY = (Math.random() * 2 - 1) * 90;

    star.className = "star-particle";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty("--star-size", `${size.toFixed(1)}px`);
    star.style.setProperty("--star-x", `${directionX.toFixed(0)}px`);
    star.style.setProperty("--star-y", `${directionY.toFixed(0)}px`);
    star.style.setProperty("--star-duration", `${(7 + Math.random() * 15).toFixed(1)}s`);
    star.style.setProperty("--star-delay", `${(-Math.random() * 18).toFixed(1)}s`);
    star.style.setProperty("--star-opacity", (0.45 + Math.random() * 0.5).toFixed(2));
    star.style.setProperty("--star-color", colors[Math.floor(Math.random() * colors.length)]);
    stars.appendChild(star);
  }

  starfield.appendChild(stars);
}

let scanner = null;
let scanCount = 0;
let lastScannedValue = "";

createStarfield();

function isUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function showResult(value) {
  const cleanValue = value.trim();
  if (!cleanValue) return;

  scanCount += 1;
  cardNumber.textContent = String(scanCount).padStart(2, "0");
  const isWebLink = isUrl(cleanValue);
  cardKind.textContent = isWebLink
    ? "Gescannter QR-Inhalt"
    : "Physikalischer Begriff / Phänomen";
  cardTitle.textContent = isWebLink ? "Webseite" : cleanValue;
  cardText.textContent = isWebLink
    ? cleanValue
    : "Ein Begriff aus deiner Physik-Kartensammlung.";

  if (isWebLink) {
    cardLink.href = cleanValue;
    cardLink.hidden = false;
  } else {
    cardLink.hidden = true;
  }

  emptyState.hidden = true;
  contentState.hidden = false;
  resultCard.classList.add("is-active");
  successDot.classList.add("is-active");

  const now = new Date();
  scanTime.textContent = `Gescannt um ${now.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

async function startScanner() {
  if (!window.Html5Qrcode) {
    statusElement.textContent = "Bibliothek fehlt";
    hintElement.textContent = "Die QR-Bibliothek konnte nicht geladen werden.";
    return;
  }

  scanner = scanner || new Html5Qrcode("reader");

  try {
    await scanner.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1,
      },
      (decodedText) => {
        if (decodedText === lastScannedValue) return;
        lastScannedValue = decodedText;
        showResult(decodedText);
        statusElement.textContent = "Erkannt";
        hintElement.textContent = "QR-Code erfolgreich gescannt.";
      },
      () => {}
    );

    cameraButton.hidden = true;
    statusElement.textContent = "Scanne...";
  } catch (error) {
    statusElement.textContent = "Kamera blockiert";
    hintElement.textContent =
      "Erlaube den Kamerazugriff oder nutze den Plus-Button zum Testen.";
  }
}

cameraButton.addEventListener("click", startScanner);
manualButton.addEventListener("click", () => {
  manualDialog.showModal();
  manualInput.focus();
});

manualSubmit.addEventListener("click", (event) => {
  event.preventDefault();
  if (manualInput.value.trim()) {
    showResult(manualInput.value);
    statusElement.textContent = "Erkannt";
    hintElement.textContent = "Inhalt erfolgreich angezeigt.";
  }
  manualDialog.close();
  manualInput.value = "";
});

manualDialog.addEventListener("click", (event) => {
  if (event.target === manualDialog) manualDialog.close();
});

privacyButton.addEventListener("click", () => privacyDialog.showModal());
privacyClose.addEventListener("click", () => privacyDialog.close());
privacyDialog.addEventListener("click", (event) => {
  if (event.target === privacyDialog) privacyDialog.close();
});

const elements = [
  "H|Wasserstoff","He|Helium","Li|Lithium","Be|Beryllium","B|Bor","C|Kohlenstoff","N|Stickstoff","O|Sauerstoff","F|Fluor","Ne|Neon",
  "Na|Natrium","Mg|Magnesium","Al|Aluminium","Si|Silicium","P|Phosphor","S|Schwefel","Cl|Chlor","Ar|Argon","K|Kalium","Ca|Calcium",
  "Sc|Scandium","Ti|Titan","V|Vanadium","Cr|Chrom","Mn|Mangan","Fe|Eisen","Co|Cobalt","Ni|Nickel","Cu|Kupfer","Zn|Zink",
  "Ga|Gallium","Ge|Germanium","As|Arsen","Se|Selen","Br|Brom","Kr|Krypton","Rb|Rubidium","Sr|Strontium","Y|Yttrium","Zr|Zirconium",
  "Nb|Niob","Mo|Molybdän","Tc|Technetium","Ru|Ruthenium","Rh|Rhodium","Pd|Palladium","Ag|Silber","Cd|Cadmium","In|Indium","Sn|Zinn",
  "Sb|Antimon","Te|Tellur","I|Iod","Xe|Xenon","Cs|Cäsium","Ba|Barium","La|Lanthan","Ce|Cer","Pr|Praseodym","Nd|Neodym",
  "Pm|Promethium","Sm|Samarium","Eu|Europium","Gd|Gadolinium","Tb|Terbium","Dy|Dysprosium","Ho|Holmium","Er|Erbium","Tm|Thulium","Yb|Ytterbium",
  "Lu|Lutetium","Hf|Hafnium","Ta|Tantal","W|Wolfram","Re|Rhenium","Os|Osmium","Ir|Iridium","Pt|Platin","Au|Gold","Hg|Quecksilber",
  "Tl|Thallium","Pb|Blei","Bi|Bismut","Po|Polonium","At|Astat","Rn|Radon","Fr|Francium","Ra|Radium","Ac|Actinium","Th|Thorium",
  "Pa|Protactinium","U|Uran","Np|Neptunium","Pu|Plutonium","Am|Americium","Cm|Curium","Bk|Berkelium","Cf|Californium","Es|Einsteinium","Fm|Fermium",
  "Md|Mendelevium","No|Nobelium","Lr|Lawrencium","Rf|Rutherfordium","Db|Dubnium","Sg|Seaborgium","Bh|Bohrium","Hs|Hassium","Mt|Meitnerium","Ds|Darmstadtium",
  "Rg|Roentgenium","Cn|Copernicium","Nh|Nihonium","Fl|Flerovium","Mc|Moscovium","Lv|Livermorium","Ts|Tenness","Og|Oganesson"
];

const defaultAtomGame = {
  electrons: 0,
  lifetime: 0,
  clickLevel: 0,
  autoLevel: 0,
  magnetLevel: 0,
  fissionLevel: 0,
  laserLevel: 0,
  colliderLevel: 0,
  superconductorLevel: 0,
  nobelLevel: 0
};

let atomGame = { ...defaultAtomGame };

try {
  const savedGame = JSON.parse(localStorage.getItem("phystar-atom-game"));
  if (savedGame) atomGame = { ...defaultAtomGame, ...savedGame };
} catch {
  atomGame = { ...defaultAtomGame };
}

function formatNumber(value) {
  if (value < 1000) return Math.floor(value).toLocaleString("de-DE");
  if (value < 1e6) return `${(value / 1000).toFixed(value < 10000 ? 1 : 0)} Tsd.`;
  if (value < 1e9) return `${(value / 1e6).toFixed(2)} Mio.`;
  if (value < 1e12) return `${(value / 1e9).toFixed(2)} Mrd.`;
  return `${(value / 1e12).toFixed(2)} Bio.`;
}

function upgradeCost(baseCost, level) {
  return Math.floor(baseCost * Math.pow(1.72, level));
}

function clickPower() {
  const baseClick = 1 + atomGame.clickLevel;
  const magnetBonus = baseClick * atomGame.magnetLevel * 0.1;
  const fissionMultiplier = Math.pow(5, atomGame.fissionLevel);
  const laserMultiplier = 1 + atomGame.laserLevel * 0.25;
  const colliderMultiplier = Math.pow(2, atomGame.colliderLevel);
  const nobelMultiplier = Math.pow(10, atomGame.nobelLevel);
  return (baseClick + magnetBonus) * fissionMultiplier * laserMultiplier * colliderMultiplier * nobelMultiplier;
}

function autoPower() {
  const reactor = atomGame.autoLevel;
  const magnetCollectors = atomGame.magnetLevel;
  const fissionMultiplier = Math.pow(10, atomGame.fissionLevel);
  const colliderMultiplier = Math.pow(2, atomGame.colliderLevel);
  const superconductorBonus = atomGame.superconductorLevel * 20;
  const laserMultiplier = 1 + atomGame.laserLevel * 0.25;
  const nobelMultiplier = Math.pow(10, atomGame.nobelLevel);
  return (reactor + magnetCollectors + superconductorBonus) * fissionMultiplier * colliderMultiplier * laserMultiplier * nobelMultiplier;
}

function saveAtomGame() {
  localStorage.setItem("phystar-atom-game", JSON.stringify(atomGame));
}

function unlockedElementCount() {
  return elements.reduce((count, element, index) => {
    const atomicNumber = index + 1;
    const threshold = atomicNumber === 1 ? 0 : Math.round(20 * Math.pow(1.095, atomicNumber - 1));
    return count + (atomGame.lifetime >= threshold ? 1 : 0);
  }, 0);
}

function createElectronBurst() {
  const burst = document.createElement("span");
  burst.className = "electron-burst";
  burst.textContent = `+${formatNumber(clickPower())}`;
  burst.style.left = "50%";
  burst.style.top = "50%";
  electronTarget.parentElement.appendChild(burst);
  window.setTimeout(() => burst.remove(), 700);
}

function renderElements() {
  elementGrid.replaceChildren();
  let unlocked = 0;

  elements.forEach((entry, index) => {
    const atomicNumber = index + 1;
    const [symbol, name] = entry.split("|");
    const threshold = atomicNumber === 1 ? 0 : Math.round(20 * Math.pow(1.095, atomicNumber - 1));
    const isUnlocked = atomGame.lifetime >= threshold;
    if (isUnlocked) unlocked += 1;

    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = `element-tile${isUnlocked ? " is-unlocked" : ""}`;
    tile.title = isUnlocked ? name : `${name} · Freischaltung bei ${formatNumber(threshold)} Elektronen`;
    tile.innerHTML = `<span>${atomicNumber}</span><strong>${isUnlocked ? symbol : "?"}</strong><small>${isUnlocked ? name : formatNumber(threshold)}</small>`;
    elementGrid.appendChild(tile);
  });

  elementProgressText.textContent = `${unlocked} / 118 freigeschaltet`;
}

function renderPhysicistDream() {
  const stageElement = document.getElementById("dream-stage");
  const progressElement = document.getElementById("dream-progress");
  if (!stageElement || !progressElement) return;

  let stage = "PHYSIK-STUDENT";
  let progress = "Erster Schritt: Elektronen sammeln";
  if (atomGame.lifetime >= 100) {
    stage = "LABOR-ASSISTENT";
    progress = "Das erste Physik-Labor erwacht";
  }
  if (atomGame.fissionLevel > 0) {
    stage = "KERNPHYSIKER";
    progress = "Kernspaltung beherrscht";
  }
  if (atomGame.colliderLevel > 0) {
    stage = "TEILCHENFORSCHER";
    progress = "Teilchen werden beschleunigt";
  }
  if (atomGame.superconductorLevel > 0) {
    stage = "QUANTEN-FORSCHER";
    progress = "Supraleitung stabilisiert das Labor";
  }
  if (atomGame.nobelLevel > 0) {
    stage = "NOBELPREIS-TRAUM";
    progress = "Eine große Entdeckung ist zum Greifen nah";
  }

  stageElement.textContent = stage;
  progressElement.textContent = progress;
  const dreamLevel =
    atomGame.fissionLevel +
    atomGame.laserLevel +
    atomGame.colliderLevel * 2 +
    atomGame.superconductorLevel * 2 +
    atomGame.nobelLevel * 3;
  atomGameDialog.dataset.dreamLevel = String(Math.min(8, dreamLevel));
}

function renderAtomGame() {
  atomScore.textContent = formatNumber(atomGame.electrons);
  atomRates.textContent = `+${formatNumber(clickPower())} pro Klick · ${formatNumber(autoPower())} pro Sekunde`;
  if (electronCoreValue) electronCoreValue.textContent = formatNumber(clickPower());
  if (electronCore) {
    const visualLevel = Math.min(5, atomGame.clickLevel + atomGame.magnetLevel + atomGame.fissionLevel);
    electronCore.dataset.level = String(visualLevel);
  }
  if (electronOrbits) {
    electronOrbits.replaceChildren();
    const orbitCount = Math.min(8, 1 + atomGame.clickLevel);
    for (let index = 0; index < orbitCount; index += 1) {
      const satellite = document.createElement("span");
      satellite.className = "orbit-electron";
      satellite.style.setProperty("--orbit-index", String(index));
      satellite.style.setProperty("--orbit-count", String(orbitCount));
      electronOrbits.appendChild(satellite);
    }
  }

  const clickCost = upgradeCost(25, atomGame.clickLevel);
  const autoCost = upgradeCost(50, atomGame.autoLevel);
  const magnetCost = upgradeCost(100, atomGame.magnetLevel);
  const fissionCost = upgradeCost(2500, atomGame.fissionLevel);
  const laserCost = upgradeCost(10000, atomGame.laserLevel);
  const colliderCost = upgradeCost(75000, atomGame.colliderLevel);
  const superconductorCost = upgradeCost(500000, atomGame.superconductorLevel);
  const nobelCost = upgradeCost(5000000, atomGame.nobelLevel);

  document.getElementById("upgrade-click-level").textContent = `Stufe ${atomGame.clickLevel} · +1 pro Klick`;
  document.getElementById("upgrade-auto-level").textContent = `Stufe ${atomGame.autoLevel} · +1 pro Sekunde`;
  document.getElementById("upgrade-magnet-level").textContent = `Stufe ${atomGame.magnetLevel} · +10 % Klickkraft + 1 Sammler`;
  document.getElementById("upgrade-fission-level").textContent = `Stufe ${atomGame.fissionLevel} · ×5 Klickkraft und ×10 Automatik`;
  document.getElementById("upgrade-laser-level").textContent = `Stufe ${atomGame.laserLevel} · +25 % gesamte Kraft`;
  document.getElementById("upgrade-collider-level").textContent = `Stufe ${atomGame.colliderLevel} · ×2 pro Klick und Sekunde`;
  document.getElementById("upgrade-superconductor-level").textContent = `Stufe ${atomGame.superconductorLevel} · +20 pro Sekunde`;
  document.getElementById("upgrade-nobel-level").textContent = `Stufe ${atomGame.nobelLevel} · ×10 gesamte Kraft`;
  document.getElementById("upgrade-click-cost").textContent = formatNumber(clickCost);
  document.getElementById("upgrade-auto-cost").textContent = formatNumber(autoCost);
  document.getElementById("upgrade-magnet-cost").textContent = formatNumber(magnetCost);
  document.getElementById("upgrade-fission-cost").textContent = formatNumber(fissionCost);
  document.getElementById("upgrade-laser-cost").textContent = formatNumber(laserCost);
  document.getElementById("upgrade-collider-cost").textContent = formatNumber(colliderCost);
  document.getElementById("upgrade-superconductor-cost").textContent = formatNumber(superconductorCost);
  document.getElementById("upgrade-nobel-cost").textContent = formatNumber(nobelCost);

  upgradeClick.disabled = atomGame.electrons < clickCost;
  upgradeAuto.disabled = atomGame.electrons < autoCost;
  upgradeMagnet.disabled = atomGame.electrons < magnetCost;
  upgradeFission.disabled = atomGame.electrons < fissionCost;
  upgradeLaser.disabled = atomGame.electrons < laserCost;
  upgradeCollider.disabled = atomGame.electrons < colliderCost;
  upgradeSuperconductor.disabled = atomGame.electrons < superconductorCost;
  upgradeNobel.disabled = atomGame.electrons < nobelCost;
  renderElements();
  renderPhysicistDream();
  saveAtomGame();
}

function addElectrons(amount) {
  atomGame.electrons += amount;
  atomGame.lifetime += amount;
  renderAtomGame();
}

function animateUpgrade(button) {
  if (!button) return;
  button.classList.remove("is-purchased");
  void button.offsetWidth;
  button.classList.add("is-purchased");
  window.setTimeout(() => button.classList.remove("is-purchased"), 650);

  electronTarget.classList.remove("is-shaking");
  void electronTarget.offsetWidth;
  electronTarget.classList.add("is-shaking");
  window.setTimeout(() => electronTarget.classList.remove("is-shaking"), 650);
}

if (electronTarget) electronTarget.addEventListener("click", () => {
  addElectrons(clickPower());
  createElectronBurst();
  electronTarget.classList.remove("is-clicked");
  void electronTarget.offsetWidth;
  electronTarget.classList.add("is-clicked");
});

if (upgradeClick) upgradeClick.addEventListener("click", () => {
  const cost = upgradeCost(25, atomGame.clickLevel);
  if (atomGame.electrons < cost) return;
  atomGame.electrons -= cost;
  atomGame.clickLevel += 1;
  renderAtomGame();
  animateUpgrade(upgradeClick);
});

if (upgradeAuto) upgradeAuto.addEventListener("click", () => {
  const cost = upgradeCost(50, atomGame.autoLevel);
  if (atomGame.electrons < cost) return;
  atomGame.electrons -= cost;
  atomGame.autoLevel += 1;
  renderAtomGame();
  animateUpgrade(upgradeAuto);
});

if (upgradeMagnet) upgradeMagnet.addEventListener("click", () => {
  const cost = upgradeCost(100, atomGame.magnetLevel);
  if (atomGame.electrons < cost) return;
  atomGame.electrons -= cost;
  atomGame.magnetLevel += 1;
  renderAtomGame();
  animateUpgrade(upgradeMagnet);
});

if (upgradeFission) upgradeFission.addEventListener("click", () => {
  const cost = upgradeCost(2500, atomGame.fissionLevel);
  if (atomGame.electrons < cost) return;
  atomGame.electrons -= cost;
  atomGame.fissionLevel += 1;
  renderAtomGame();
  animateUpgrade(upgradeFission);
  atomGameDialog.classList.remove("is-fission");
  void atomGameDialog.offsetWidth;
  atomGameDialog.classList.add("is-fission");
  window.setTimeout(() => atomGameDialog.classList.remove("is-fission"), 850);
});

function buyAdvancedUpgrade(upgrade, stateKey, cost) {
  if (!upgrade) return;
  upgrade.addEventListener("click", () => {
    if (atomGame.electrons < cost()) return;
    atomGame.electrons -= cost();
    atomGame[stateKey] += 1;
    renderAtomGame();
    animateUpgrade(upgrade);
    atomGameDialog.classList.remove("is-experiment");
    void atomGameDialog.offsetWidth;
    atomGameDialog.classList.add("is-experiment");
    window.setTimeout(() => atomGameDialog.classList.remove("is-experiment"), 900);
  });
}

buyAdvancedUpgrade(upgradeLaser, "laserLevel", () => upgradeCost(10000, atomGame.laserLevel));
buyAdvancedUpgrade(upgradeCollider, "colliderLevel", () => upgradeCost(75000, atomGame.colliderLevel));
buyAdvancedUpgrade(upgradeSuperconductor, "superconductorLevel", () => upgradeCost(500000, atomGame.superconductorLevel));
buyAdvancedUpgrade(upgradeNobel, "nobelLevel", () => upgradeCost(5000000, atomGame.nobelLevel));

if (atomReset) atomReset.addEventListener("click", () => {
  if (!window.confirm("Das Elektronen-Spiel wirklich zurücksetzen?")) return;
  atomGame = { ...defaultAtomGame };
  renderAtomGame();
});

if (atomButton && atomGameDialog) atomButton.addEventListener("click", () => {
  renderAtomGame();
  atomGameDialog.showModal();
});

if (atomGameClose) atomGameClose.addEventListener("click", () => atomGameDialog.close());
if (atomGameBack) atomGameBack.addEventListener("click", () => atomGameDialog.close());

if (atomGameDialog) atomGameDialog.addEventListener("click", (event) => {
  if (event.target === atomGameDialog) atomGameDialog.close();
});

window.setInterval(() => {
  if (autoPower() <= 0) return;
  addElectrons(autoPower());
}, 1000);

window.addEventListener("load", () => {
  const secureContext =
    location.protocol === "https:" ||
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1";

  if (secureContext) {
    startScanner();
  } else {
    hintElement.textContent =
      "Für den Kamerazugriff öffne die Seite über localhost oder HTTPS.";
  }
});
