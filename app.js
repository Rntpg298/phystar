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
const dailyReward = document.getElementById("daily-reward");
const dailyRewardValue = document.getElementById("daily-reward-value");
const prestigeButton = document.getElementById("prestige-button");
const prestigeValue = document.getElementById("prestige-value");
const guideButton = document.getElementById("guide-button");
const guideDialog = document.getElementById("physics-guide-dialog");
const guideClose = document.getElementById("physics-guide-close");
const soundToggle = document.getElementById("sound-toggle");
const soundState = document.getElementById("sound-state");
const elementDetailDialog = document.getElementById("element-detail-dialog");
const elementDetailClose = document.getElementById("element-detail-close");

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
  version: 3,
  electrons: 0,
  lifetime: 0,
  clickLevel: 0,
  autoLevel: 0,
  magnetLevel: 0,
  fissionLevel: 0,
  laserLevel: 0,
  colliderLevel: 0,
  superconductorLevel: 0,
  nobelLevel: 0,
  prestigeLevel: 0,
  totalClicks: 0,
  criticalClicks: 0,
  dailyClaimDate: "",
  muted: false,
  lastSavedAt: Date.now(),
  offlineGain: 0,
  questClaims: {
    clicks: false,
    lifetime: false,
    upgrades: false,
    elements: false
  }
};

let atomGame = { ...defaultAtomGame };

try {
  const savedGame = JSON.parse(localStorage.getItem("phystar-atom-game"));
  if (savedGame && savedGame.version === defaultAtomGame.version) {
    atomGame = {
      ...defaultAtomGame,
      ...savedGame,
      questClaims: { ...defaultAtomGame.questClaims, ...(savedGame.questClaims || {}) }
    };
  } else {
    atomGame = { ...defaultAtomGame };
  }
} catch {
  atomGame = { ...defaultAtomGame };
}

[
  "clickLevel",
  "autoLevel",
  "magnetLevel",
  "fissionLevel",
  "laserLevel",
  "colliderLevel",
  "superconductorLevel",
  "nobelLevel"
].forEach((levelKey) => {
  atomGame[levelKey] = Math.max(
    0,
    Number.isFinite(atomGame[levelKey]) ? atomGame[levelKey] : 0
  );
});
atomGame.electrons = Math.max(0, Number.isFinite(atomGame.electrons) ? atomGame.electrons : 0);
atomGame.lifetime = Math.max(0, Number.isFinite(atomGame.lifetime) ? atomGame.lifetime : 0);
atomGame.prestigeLevel = Math.max(0, Number.isFinite(atomGame.prestigeLevel) ? atomGame.prestigeLevel : 0);
atomGame.totalClicks = Math.max(0, Number.isFinite(atomGame.totalClicks) ? atomGame.totalClicks : 0);
atomGame.criticalClicks = Math.max(0, Number.isFinite(atomGame.criticalClicks) ? atomGame.criticalClicks : 0);
atomGame.offlineGain = Math.max(0, Number.isFinite(atomGame.offlineGain) ? atomGame.offlineGain : 0);

function formatNumber(value) {
  if (value < 1000) {
    const rounded = Math.round(value * 100) / 100;
    return rounded.toLocaleString("de-DE", {
      maximumFractionDigits: 2
    });
  }
  if (value < 1e6) return `${(value / 1000).toFixed(value < 10000 ? 1 : 0)} Tsd.`;
  if (value < 1e9) return `${(value / 1e6).toFixed(2)} Mio.`;
  if (value < 1e12) return `${(value / 1e9).toFixed(2)} Mrd.`;
  return `${(value / 1e12).toFixed(2)} Bio.`;
}

function upgradeCost(baseCost, level) {
  return Math.floor(baseCost * Math.pow(2.35, level));
}

function limitedCost(baseCost, level) {
  return upgradeCost(baseCost, level);
}

function clickPower() {
  const baseClick = 1 + atomGame.clickLevel;
  const magnetBonus = baseClick * atomGame.magnetLevel * 0.1;
  const fissionMultiplier = Math.pow(2, atomGame.fissionLevel);
  const laserMultiplier = 1 + atomGame.laserLevel * 0.25;
  const colliderMultiplier = Math.pow(2, atomGame.colliderLevel);
  const nobelMultiplier = Math.pow(10, atomGame.nobelLevel);
  const prestigeMultiplier = 1 + atomGame.prestigeLevel * 0.5;
  return (baseClick + magnetBonus) * fissionMultiplier * laserMultiplier * colliderMultiplier * nobelMultiplier * prestigeMultiplier;
}

function autoPower() {
  const reactor = atomGame.autoLevel;
  const magnetCollectors = atomGame.magnetLevel;
  const fissionMultiplier = Math.pow(2, atomGame.fissionLevel);
  const colliderMultiplier = Math.pow(2, atomGame.colliderLevel);
  const superconductorBonus = atomGame.superconductorLevel * 20;
  const laserMultiplier = 1 + atomGame.laserLevel * 0.25;
  const nobelMultiplier = Math.pow(10, atomGame.nobelLevel);
  const prestigeMultiplier = 1 + atomGame.prestigeLevel * 0.5;
  return (reactor + magnetCollectors + superconductorBonus) * fissionMultiplier * colliderMultiplier * laserMultiplier * nobelMultiplier * prestigeMultiplier;
}

function saveAtomGame() {
  atomGame.lastSavedAt = Date.now();
  try {
    localStorage.setItem("phystar-atom-game", JSON.stringify(atomGame));
    const warning = document.getElementById("storage-warning");
    if (warning) warning.hidden = true;
  } catch {
    const warning = document.getElementById("storage-warning");
    if (warning) warning.hidden = false;
  }
}

function applyOfflineProgress() {
  const lastSaved = Number(atomGame.lastSavedAt || 0);
  if (!lastSaved) return;
  const elapsedSeconds = Math.max(
    0,
    Math.min(8 * 60 * 60, Math.floor((Date.now() - lastSaved) / 1000))
  );
  const offlineGain = autoPower() * elapsedSeconds * 0.25;
  if (offlineGain > 0) {
    atomGame.electrons += offlineGain;
    atomGame.lifetime += offlineGain;
    atomGame.offlineGain = offlineGain;
    atomGame.lastSavedAt = Date.now();
  }
}

applyOfflineProgress();

const questDefinitions = [
  {
    key: "clicks",
    title: "Erste Experimente",
    description: "Führe 100 Klicks aus",
    target: 100,
    reward: 500,
    progress: () => atomGame.totalClicks
  },
  {
    key: "lifetime",
    title: "Elektronen sammeln",
    description: "Sammle 1.000 Elektronen insgesamt",
    target: 1000,
    reward: 750,
    progress: () => atomGame.lifetime
  },
  {
    key: "upgrades",
    title: "Labor ausbauen",
    description: "Kaufe insgesamt 3 Upgrade-Stufen",
    target: 3,
    reward: 1000,
    progress: () =>
      atomGame.clickLevel +
      atomGame.autoLevel +
      atomGame.magnetLevel +
      atomGame.fissionLevel +
      atomGame.laserLevel +
      atomGame.colliderLevel +
      atomGame.superconductorLevel +
      atomGame.nobelLevel
  },
  {
    key: "elements",
    title: "Periodensystem",
    description: "Schalte 10 Elemente frei",
    target: 10,
    reward: 1500,
    progress: () => unlockedElementCount()
  }
];

function questReady(quest) {
  return quest.progress() >= quest.target;
}

function renderQuests() {
  const questGrid = document.getElementById("quest-grid");
  if (!questGrid) return;

  questGrid.replaceChildren();
  let completed = 0;

  questDefinitions.forEach((quest) => {
    const progress = quest.progress();
    const ready = questReady(quest);
    const claimed = atomGame.questClaims[quest.key];
    if (claimed) completed += 1;

    const card = document.createElement("button");
    card.type = "button";
    card.className = `quest-card${ready ? " is-ready" : ""}${claimed ? " is-claimed" : ""}`;
    card.disabled = !ready || claimed;
    card.innerHTML =
      `<strong>${quest.title}</strong>` +
      `<small>${quest.description}</small>` +
      `<span>${Math.min(progress, quest.target)} / ${quest.target}</span>` +
      `<b>${claimed ? "Fertig" : `+${formatNumber(quest.reward)}`}</b>`;
    card.addEventListener("click", () => {
      if (!questReady(quest) || atomGame.questClaims[quest.key]) return;
      atomGame.questClaims[quest.key] = true;
      atomGame.electrons += quest.reward;
      atomGame.lifetime += quest.reward;
      playSound("quest");
      renderAtomGame();
    });
    questGrid.appendChild(card);
  });

  const questSummary = document.getElementById("quest-summary");
  if (questSummary) questSummary.textContent = `${completed} / ${questDefinitions.length} abgeschlossen`;
}

function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function renderDailyReward() {
  if (!dailyReward) return;
  const claimed = atomGame.dailyClaimDate === todayKey();
  const reward = 500 * (1 + atomGame.prestigeLevel);
  dailyReward.disabled = claimed;
  if (dailyRewardValue) dailyRewardValue.textContent = claimed ? "Heute abgeholt" : formatNumber(reward);
}

if (dailyReward) {
  dailyReward.addEventListener("click", () => {
    if (atomGame.dailyClaimDate === todayKey()) return;
    const reward = 500 * (1 + atomGame.prestigeLevel);
    atomGame.dailyClaimDate = todayKey();
    atomGame.electrons += reward;
    atomGame.lifetime += reward;
    playSound("quest");
    renderAtomGame();
  });
}

function renderPrestige() {
  if (!prestigeButton) return;
  const canPrestige = unlockedElementCount() >= 118;
  prestigeButton.disabled = !canPrestige;
  if (prestigeValue) {
    prestigeValue.textContent = atomGame.prestigeLevel > 0
      ? `${atomGame.prestigeLevel} Stufen · +50 %`
      : "Alle Elemente nötig";
  }
}

if (prestigeButton) {
  prestigeButton.addEventListener("click", () => {
    if (unlockedElementCount() < 118) return;
    if (!window.confirm("Prestige starten? Elektronen und Upgrades werden zurückgesetzt. Elemente und Prägestufe bleiben erhalten.")) return;
    atomGame.prestigeLevel += 1;
    atomGame.electrons = 0;
    atomGame.lifetime = 0;
    atomGame.clickLevel = 0;
    atomGame.autoLevel = 0;
    atomGame.magnetLevel = 0;
    atomGame.fissionLevel = 0;
    atomGame.laserLevel = 0;
    atomGame.colliderLevel = 0;
    atomGame.superconductorLevel = 0;
    atomGame.nobelLevel = 0;
    atomGame.questClaims = { ...defaultAtomGame.questClaims };
    playSound("prestige");
    renderAtomGame();
  });
}

function unlockedElementCount() {
  return elements.reduce((count, element, index) => {
    const atomicNumber = index + 1;
    const threshold = atomicNumber === 1 ? 0 : Math.round(100 * Math.pow(1.12, atomicNumber - 1));
    return count + (atomGame.lifetime >= threshold ? 1 : 0);
  }, 0);
}

function createElectronBurst(isCritical = false) {
  const burst = document.createElement("span");
  burst.className = "electron-burst";
  burst.textContent = isCritical
    ? `KRITISCH +${formatNumber(clickPower() * 5)}`
    : `+${formatNumber(clickPower())}`;
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
    const threshold = atomicNumber === 1 ? 0 : Math.round(100 * Math.pow(1.12, atomicNumber - 1));
    const isUnlocked = atomGame.lifetime >= threshold;
    if (isUnlocked) unlocked += 1;

    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = `element-tile${isUnlocked ? " is-unlocked" : ""}`;
    tile.title = isUnlocked ? name : `${name} · Freischaltung bei ${formatNumber(threshold)} Elektronen`;
    tile.innerHTML = `<span>${atomicNumber}</span><strong>${isUnlocked ? symbol : "?"}</strong><small>${isUnlocked ? name : formatNumber(threshold)}</small>`;
    tile.addEventListener("click", () => {
      if (!isUnlocked) return;
      const number = document.getElementById("element-detail-number");
      const nameElement = document.getElementById("element-detail-name");
      const symbolElement = document.getElementById("element-detail-symbol");
      const factElement = document.getElementById("element-detail-fact");
      if (number) number.textContent = `ELEMENT ${atomicNumber}`;
      if (nameElement) nameElement.textContent = name;
      if (symbolElement) symbolElement.textContent = symbol;
      if (factElement) factElement.textContent =
        `${name} ist das ${atomicNumber}. Element im Periodensystem. Mit seinem Symbol ${symbol} gehört es zu den Bausteinen der Chemie und Physik.`;
      if (elementDetailDialog) elementDetailDialog.showModal();
      playSound("quest");
    });
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
  atomRates.textContent =
    `+${formatNumber(clickPower())} pro Klick · ${formatNumber(autoPower())} pro Sekunde` +
    (atomGame.offlineGain > 0 ? ` · Offline +${formatNumber(atomGame.offlineGain)}` : "");
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

  const costs = {
    click: limitedCost(50, atomGame.clickLevel),
    auto: limitedCost(150, atomGame.autoLevel),
    magnet: limitedCost(500, atomGame.magnetLevel),
    fission: limitedCost(25000, atomGame.fissionLevel),
    laser: limitedCost(100000, atomGame.laserLevel),
    collider: limitedCost(1000000, atomGame.colliderLevel),
    superconductor: limitedCost(10000000, atomGame.superconductorLevel),
    nobel: limitedCost(100000000, atomGame.nobelLevel)
  };

  const levelText = (level, effect) =>
    `Stufe ${level} · ${effect}`;

  document.getElementById("upgrade-click-level").textContent = levelText(atomGame.clickLevel, "+1 pro Klick");
  document.getElementById("upgrade-auto-level").textContent = levelText(atomGame.autoLevel, "+1 pro Sekunde");
  document.getElementById("upgrade-magnet-level").textContent = levelText(atomGame.magnetLevel, "+10 % + 1 Sammler");
  document.getElementById("upgrade-fission-level").textContent = levelText(atomGame.fissionLevel, "×2 Kraft");
  document.getElementById("upgrade-laser-level").textContent = levelText(atomGame.laserLevel, "+25 % gesamte Kraft");
  document.getElementById("upgrade-collider-level").textContent = levelText(atomGame.colliderLevel, "×2 pro Klick und Sekunde");
  document.getElementById("upgrade-superconductor-level").textContent = levelText(atomGame.superconductorLevel, "+20 pro Sekunde");
  document.getElementById("upgrade-nobel-level").textContent = levelText(atomGame.nobelLevel, "×10 gesamte Kraft");

  const buttons = [
    ["click", upgradeClick],
    ["auto", upgradeAuto],
    ["magnet", upgradeMagnet],
    ["fission", upgradeFission],
    ["laser", upgradeLaser],
    ["collider", upgradeCollider],
    ["superconductor", upgradeSuperconductor],
    ["nobel", upgradeNobel]
  ];

  const levels = {
    click: atomGame.clickLevel,
    auto: atomGame.autoLevel,
    magnet: atomGame.magnetLevel,
    fission: atomGame.fissionLevel,
    laser: atomGame.laserLevel,
    collider: atomGame.colliderLevel,
    superconductor: atomGame.superconductorLevel,
    nobel: atomGame.nobelLevel
  };

  buttons.forEach(([key, button]) => {
    if (!button) return;
    document.getElementById(`upgrade-${key}-cost`).textContent = formatNumber(costs[key]);
    button.disabled = atomGame.electrons < costs[key];
  });
  renderElements();
  renderPhysicistDream();
  renderQuests();
  renderDailyReward();
  renderPrestige();
  const statClicks = document.getElementById("stat-clicks");
  const statCrit = document.getElementById("stat-crit");
  const statElements = document.getElementById("stat-elements");
  if (statClicks) statClicks.textContent = formatNumber(atomGame.totalClicks);
  if (statCrit) statCrit.textContent = formatNumber(atomGame.criticalClicks);
  if (statElements) statElements.textContent = String(unlockedElementCount());
  if (soundState) soundState.textContent = atomGame.muted ? "Aus" : "An";
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

function playUpgradeEffect(effect) {
  if (!atomGameDialog) return;
  const effectClass = `is-${effect}`;
  atomGameDialog.classList.remove(effectClass);
  void atomGameDialog.offsetWidth;
  atomGameDialog.classList.add(effectClass);
  window.setTimeout(() => atomGameDialog.classList.remove(effectClass), 950);
}

let audioContext = null;

function playSound(type) {
  if (atomGame.muted) return;
  try {
    audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const frequencies = {
      click: 340,
      critical: 760,
      quest: 620,
      prestige: 880
    };
    oscillator.type = type === "critical" || type === "prestige" ? "triangle" : "sine";
    oscillator.frequency.value = frequencies[type] || 440;
    gain.gain.setValueAtTime(0.035, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.12);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.12);
  } catch {
    atomGame.muted = true;
  }
}

if (electronTarget) electronTarget.addEventListener("click", () => {
  atomGame.totalClicks += 1;
  const isCritical = Math.random() < 0.1;
  const gained = clickPower() * (isCritical ? 5 : 1);
  if (isCritical) atomGame.criticalClicks += 1;
  addElectrons(gained);
  createElectronBurst(isCritical);
  playSound(isCritical ? "critical" : "click");
  electronTarget.classList.remove("is-clicked");
  void electronTarget.offsetWidth;
  electronTarget.classList.add("is-clicked");
});

if (upgradeClick) upgradeClick.addEventListener("click", () => {
  const cost = upgradeCost(50, atomGame.clickLevel);
  if (atomGame.electrons < cost) return;
  atomGame.electrons -= cost;
  atomGame.clickLevel += 1;
  renderAtomGame();
  animateUpgrade(upgradeClick);
  playUpgradeEffect("click");
});

if (upgradeAuto) upgradeAuto.addEventListener("click", () => {
  const cost = upgradeCost(150, atomGame.autoLevel);
  if (atomGame.electrons < cost) return;
  atomGame.electrons -= cost;
  atomGame.autoLevel += 1;
  renderAtomGame();
  animateUpgrade(upgradeAuto);
  playUpgradeEffect("reactor");
});

if (upgradeMagnet) upgradeMagnet.addEventListener("click", () => {
  const cost = upgradeCost(500, atomGame.magnetLevel);
  if (atomGame.electrons < cost) return;
  atomGame.electrons -= cost;
  atomGame.magnetLevel += 1;
  renderAtomGame();
  animateUpgrade(upgradeMagnet);
  playUpgradeEffect("magnet");
});

if (upgradeFission) upgradeFission.addEventListener("click", () => {
  const cost = upgradeCost(25000, atomGame.fissionLevel);
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
    const effectNames = {
      laserLevel: "laser",
      colliderLevel: "collider",
      superconductorLevel: "superconductor",
      nobelLevel: "nobel"
    };
    playUpgradeEffect(effectNames[stateKey]);
  });
}

buyAdvancedUpgrade(upgradeLaser, "laserLevel", () => upgradeCost(100000, atomGame.laserLevel));
buyAdvancedUpgrade(upgradeCollider, "colliderLevel", () => upgradeCost(1000000, atomGame.colliderLevel));
buyAdvancedUpgrade(upgradeSuperconductor, "superconductorLevel", () => upgradeCost(10000000, atomGame.superconductorLevel));
buyAdvancedUpgrade(upgradeNobel, "nobelLevel", () => upgradeCost(100000000, atomGame.nobelLevel));

if (soundToggle) {
  soundToggle.addEventListener("click", () => {
    atomGame.muted = !atomGame.muted;
    if (soundState) soundState.textContent = atomGame.muted ? "Aus" : "An";
    saveAtomGame();
  });
}

if (guideButton && guideDialog) {
  guideButton.addEventListener("click", () => guideDialog.showModal());
}

if (guideClose && guideDialog) {
  guideClose.addEventListener("click", () => guideDialog.close());
}

if (elementDetailClose && elementDetailDialog) {
  elementDetailClose.addEventListener("click", () => elementDetailDialog.close());
}

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
