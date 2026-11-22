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
const atomCurrencyScore = document.getElementById("atom-currency-score");
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
const skillTreeButton = document.getElementById("skill-tree-button");
const skillTreeDialog = document.getElementById("skill-tree-dialog");
const skillTreeClose = document.getElementById("skill-tree-close");
const skillPointsValue = document.getElementById("skill-points-value");
const skillPointsDashboard = document.getElementById("skill-points-dashboard");
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
  "Ga|Gallium","Ge|Germanium","As|Arsen","Se|Selen","Br|Brom","Kr|Krypton","Rb|Rubidium","Sr|Strontium","Y|Yttrium","Zr|Zirkonium",
  "Nb|Niob","Mo|Molybdän","Tc|Technetium","Ru|Ruthenium","Rh|Rhodium","Pd|Palladium","Ag|Silber","Cd|Cadmium","In|Indium","Sn|Zinn",
  "Sb|Antimon","Te|Tellur","I|Iod","Xe|Xenon","Cs|Cäsium","Ba|Barium","La|Lanthan","Ce|Cer","Pr|Praseodym","Nd|Neodym",
  "Pm|Promethium","Sm|Samarium","Eu|Europium","Gd|Gadolinium","Tb|Terbium","Dy|Dysprosium","Ho|Holmium","Er|Erbium","Tm|Thulium","Yb|Ytterbium",
  "Lu|Lutetium","Hf|Hafnium","Ta|Tantal","W|Wolfram","Re|Rhenium","Os|Osmium","Ir|Iridium","Pt|Platin","Au|Gold","Hg|Quecksilber",
  "Tl|Thallium","Pb|Blei","Bi|Bismut","Po|Polonium","At|Astat","Rn|Radon","Fr|Francium","Ra|Radium","Ac|Actinium","Th|Thorium",
  "Pa|Protactinium","U|Uran","Np|Neptunium","Pu|Plutonium","Am|Americium","Cm|Curium","Bk|Berkelium","Cf|Californium","Es|Einsteinium","Fm|Fermium",
  "Md|Mendelevium","No|Nobelium","Lr|Lawrencium","Rf|Rutherfordium","Db|Dubnium","Sg|Seaborgium","Bh|Bohrium","Hs|Hassium","Mt|Meitnerium","Ds|Darmstadtium",
  "Rg|Roentgenium","Cn|Copernicium","Nh|Nihonium","Fl|Flerovium","Mc|Moscovium","Lv|Livermorium","Ts|Tenness","Og|Oganesson"
];

// Ground-state electron distribution across shells K through Q.
// The numbers describe neutral atoms. Ions can have different electron counts.
const electronShells = [
  [1],[2],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[2,8],
  [2,8,1],[2,8,2],[2,8,3],[2,8,4],[2,8,5],[2,8,6],[2,8,7],[2,8,8],
  [2,8,8,1],[2,8,8,2],[2,8,9,2],[2,8,10,2],[2,8,11,2],[2,8,13,1],[2,8,13,2],[2,8,14,2],[2,8,15,2],[2,8,16,2],[2,8,18,1],[2,8,18,2],
  [2,8,18,3],[2,8,18,4],[2,8,18,5],[2,8,18,6],[2,8,18,7],[2,8,18,8],
  [2,8,18,8,1],[2,8,18,8,2],[2,8,18,9,2],[2,8,18,10,2],[2,8,18,12,1],[2,8,18,13,1],[2,8,18,13,2],[2,8,18,15,1],[2,8,18,16,1],[2,8,18,18],[2,8,18,18,1],[2,8,18,18,2],
  [2,8,18,18,3],[2,8,18,18,4],[2,8,18,18,5],[2,8,18,18,6],[2,8,18,18,7],[2,8,18,18,8],
  [2,8,18,18,8,1],[2,8,18,18,8,2],[2,8,18,18,9,2],[2,8,18,19,9,2],[2,8,18,21,8,2],[2,8,18,22,8,2],
  [2,8,18,23,8,2],[2,8,18,24,8,2],[2,8,18,25,8,2],[2,8,18,25,9,2],[2,8,18,27,8,2],[2,8,18,28,8,2],[2,8,18,29,8,2],[2,8,18,30,8,2],[2,8,18,31,8,2],[2,8,18,32,8,2],
  [2,8,18,32,9,2],[2,8,18,32,10,2],[2,8,18,32,11,2],[2,8,18,32,12,2],[2,8,18,32,13,2],[2,8,18,32,14,2],[2,8,18,32,15,2],[2,8,18,32,17,1],[2,8,18,32,18,1],[2,8,18,32,18,2],
  [2,8,18,32,18,3],[2,8,18,32,18,4],[2,8,18,32,18,5],[2,8,18,32,18,6],[2,8,18,32,18,7],[2,8,18,32,18,8],
  [2,8,18,32,18,8,1],[2,8,18,32,18,8,2],[2,8,18,32,18,9,2],[2,8,18,32,18,10,2],[2,8,18,32,20,9,2],[2,8,18,32,21,9,2],
  [2,8,18,32,22,9,2],[2,8,18,32,24,8,2],[2,8,18,32,25,8,2],[2,8,18,32,25,9,2],[2,8,18,32,27,8,2],[2,8,18,32,28,8,2],[2,8,18,32,29,8,2],[2,8,18,32,30,8,2],[2,8,18,32,31,8,2],[2,8,18,32,32,8,2],
  [2,8,18,32,32,8,3],[2,8,18,32,32,10,2],[2,8,18,32,32,11,2],[2,8,18,32,32,12,2],[2,8,18,32,32,13,2],[2,8,18,32,32,14,2],[2,8,18,32,32,15,2],[2,8,18,32,32,16,2],[2,8,18,32,32,17,2],[2,8,18,32,32,18,2],
  [2,8,18,32,32,18,3],[2,8,18,32,32,18,4],[2,8,18,32,32,18,5],[2,8,18,32,32,18,6],[2,8,18,32,32,18,7],[2,8,18,32,32,18,8]
];

function electronUnlockThreshold(atomicNumber) {
  return atomicNumber;
}

let electron118Transitioning = false;
let lastChainClickAt = 0;
let chainClickStreak = 0;
let chainClickMultiplier = 1;
let quantumChallengeActive = false;
let quantumChallengeTimer = 0;
let quantumChallengePrompt = null;
let orbitalShiftTimer = 0;

const defaultAtomGame = {
  version: 10,
  electrons: 0,
  electronCurrency: 0,
  lifetime: 0,
  totalElectronsCollected: 0,
  electronResearchMilestones: 0,
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
  timeMachineRuns: 0,
  skillPoints: 0,
  discoveredElements: [],
  skillNodes: {
    click: 0,
    offline: 0,
    critical: 0,
    periodic: 0,
    elementDiscovery: 0,
    electronEcho: 0,
    quantumCollapse: 0,
    chainReaction: 0,
    electronBurst: 0,
    orbitalShift: 0,
    reactorBurst: 0,
    chrono: 0,
    supernova: 0
  },
  purchasedSkillNodes: [],
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
atomGame.electronCurrency = Math.max(0, Number.isFinite(atomGame.electronCurrency) ? atomGame.electronCurrency : 0);
atomGame.lifetime = Math.max(0, Number.isFinite(atomGame.lifetime) ? atomGame.lifetime : 0);
atomGame.totalElectronsCollected = Math.max(
  atomGame.lifetime,
  Number.isFinite(atomGame.totalElectronsCollected) ? atomGame.totalElectronsCollected : 0
);
atomGame.electronResearchMilestones = Math.max(
  0,
  Number.isFinite(atomGame.electronResearchMilestones) ? atomGame.electronResearchMilestones : 0
);
atomGame.prestigeLevel = Math.max(0, Number.isFinite(atomGame.prestigeLevel) ? atomGame.prestigeLevel : 0);
atomGame.totalClicks = Math.max(0, Number.isFinite(atomGame.totalClicks) ? atomGame.totalClicks : 0);
atomGame.criticalClicks = Math.max(0, Number.isFinite(atomGame.criticalClicks) ? atomGame.criticalClicks : 0);
atomGame.offlineGain = Math.max(0, Number.isFinite(atomGame.offlineGain) ? atomGame.offlineGain : 0);
atomGame.timeMachineRuns = Math.max(0, Number.isFinite(atomGame.timeMachineRuns) ? atomGame.timeMachineRuns : 0);
atomGame.skillPoints = Math.max(0, Number.isFinite(atomGame.skillPoints) ? atomGame.skillPoints : 0);
atomGame.discoveredElements = Array.isArray(atomGame.discoveredElements)
  ? [...new Set(atomGame.discoveredElements.filter((number) =>
    Number.isInteger(number) && number >= 1 && number <= elements.length
  ))]
  : [];
const savedSkillNodeValues = atomGame.skillNodes || {};
const legacySkillNodeKeys = {
  elementDiscovery: "dollarRain",
  quantumCollapse: "isotopeJackpot",
  chainReaction: "streak",
  orbitalShift: "dollarTransmute"
};
atomGame.skillNodes = Object.fromEntries(
  Object.keys(defaultAtomGame.skillNodes).map((skillKey) => [
    skillKey,
    Math.max(
      0,
      Number.isFinite(savedSkillNodeValues[skillKey])
        ? savedSkillNodeValues[skillKey]
        : Number.isFinite(savedSkillNodeValues[legacySkillNodeKeys[skillKey]])
          ? savedSkillNodeValues[legacySkillNodeKeys[skillKey]]
          : 0
    )
  ])
);
const earnedResearchMilestones = Math.floor(atomGame.totalElectronsCollected / 500);
if (earnedResearchMilestones > atomGame.electronResearchMilestones) {
  atomGame.skillPoints += earnedResearchMilestones - atomGame.electronResearchMilestones;
  atomGame.electronResearchMilestones = earnedResearchMilestones;
}
atomGame.purchasedSkillNodes = Array.isArray(atomGame.purchasedSkillNodes)
  ? atomGame.purchasedSkillNodes
  : [];

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
  const skillMultiplier = 1 + atomGame.skillNodes.click * 0.25;
  return (baseClick + magnetBonus) * fissionMultiplier * laserMultiplier * colliderMultiplier * nobelMultiplier * prestigeMultiplier * skillMultiplier;
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
  const skillMultiplier = 1 + atomGame.skillNodes.click * 0.25;
  const reactorBurstMultiplier = 1 + atomGame.skillNodes.reactorBurst * 0.1;
  return (reactor + magnetCollectors + superconductorBonus) * fissionMultiplier * colliderMultiplier * laserMultiplier * nobelMultiplier * prestigeMultiplier * skillMultiplier * reactorBurstMultiplier;
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
  const offlineMultiplier = 0.25 * (1 + atomGame.skillNodes.offline * 0.5);
  const offlineGain = autoPower() * elapsedSeconds * offlineMultiplier;
  if (offlineGain > 0) {
    addElectrons(offlineGain);
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
      addElectrons(quest.reward);
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
    addElectrons(reward);
    playSound("quest");
    renderAtomGame();
  });
}

const skillEffectCatalog = [
  { effect: "periodic", title: "Perioden-Zerfall", shortTitle: "Zerfall" },
  { effect: "elementDiscovery", title: "Element-Detektiv", shortTitle: "Detektiv" },
  { effect: "electronEcho", title: "Quanten-Echo", shortTitle: "Echo" },
  { effect: "quantumCollapse", title: "Schrödingers Atom", shortTitle: "Schrödinger" },
  { effect: "chainReaction", title: "Klick-Kettenreaktion", shortTitle: "Klick-Kette" },
  { effect: "electronBurst", title: "Orbital-Rückstoß", shortTitle: "Rückstoß" },
  { effect: "orbitalShift", title: "Orbital-Chaos", shortTitle: "Orbital-Chaos" },
  { effect: "reactorBurst", title: "Reaktor-Boost", shortTitle: "Reaktor" },
  { effect: "critical", title: "Kritischer Klick", shortTitle: "Kritisch" },
  { effect: "offline", title: "Zeitkapsel", shortTitle: "Zeitkapsel" },
  { effect: "chrono", title: "Zeit-Riss", shortTitle: "Zeit-Riss" },
  { effect: "supernova", title: "Mini-Supernova", shortTitle: "Nova" }
];

const skillTreeDefinitions = [];
const skillNodeIdsByTier = [];
const SKILL_TREE_LEVELS = 6;
const usedSkillEffectMasks = new Set(skillEffectCatalog.map((_, index) => 1 << index));
const skillEffectMaskQueue = [];
let nextSkillEffectMaskIndex = 0;

const pairMasks = [];
for (let offset = 1; offset < skillEffectCatalog.length; offset += 1) {
  for (let start = 0; start < skillEffectCatalog.length; start += 1) {
    const first = start;
    const second = (start + offset) % skillEffectCatalog.length;
    const mask = (1 << first) | (1 << second);
    if (!pairMasks.includes(mask)) pairMasks.push(mask);
  }
}

const tripleMasks = [];
for (let first = 0; first < skillEffectCatalog.length; first += 1) {
  for (let second = first + 1; second < skillEffectCatalog.length; second += 1) {
    for (let third = second + 1; third < skillEffectCatalog.length; third += 1) {
      tripleMasks.push((1 << first) | (1 << second) | (1 << third));
    }
  }
}
tripleMasks.sort((firstMask, secondMask) => {
  const score = (mask) => {
    let total = 0;
    for (let index = 0; index < skillEffectCatalog.length; index += 1) {
      if (mask & (1 << index)) total += index;
    }
    return total % skillEffectCatalog.length;
  };
  return score(firstMask) - score(secondMask);
});

let pairIndex = 0;
let tripleIndex = 0;
while (pairIndex < pairMasks.length || tripleIndex < tripleMasks.length) {
  for (let count = 0; count < 2 && pairIndex < pairMasks.length; count += 1) {
    skillEffectMaskQueue.push(pairMasks[pairIndex]);
    pairIndex += 1;
  }
  if (tripleIndex < tripleMasks.length) {
    skillEffectMaskQueue.push(tripleMasks[tripleIndex]);
    tripleIndex += 1;
  }
}

function nextUniqueSkillEffects() {
  while (
    nextSkillEffectMaskIndex < skillEffectMaskQueue.length &&
    usedSkillEffectMasks.has(skillEffectMaskQueue[nextSkillEffectMaskIndex])
  ) {
    nextSkillEffectMaskIndex += 1;
  }
  const mask = skillEffectMaskQueue[nextSkillEffectMaskIndex];
  nextSkillEffectMaskIndex += 1;
  usedSkillEffectMasks.add(mask);
  return skillEffectCatalog
    .filter((_, index) => (mask & (1 << index)) !== 0)
    .map((entry) => entry.effect);
}

for (let tier = 0; tier < SKILL_TREE_LEVELS; tier += 1) {
  const nodeCount = Math.pow(2, tier);
  const tierCost = Math.pow(10, tier + 1);
  skillNodeIdsByTier[tier] = [];
  for (let index = 0; index < nodeCount; index += 1) {
    let node;
    if (tier === 0) {
      node = {
        id: "core",
        title: "Quantenfunke",
        effects: ["electronEcho"]
      };
    } else if (tier === 1) {
      node = index === 0
        ? {
            id: "periodic-atom",
            title: "Perioden-Zerfall",
            effects: ["periodic"]
          }
        : {
            id: "dollar-rain",
            title: "Element-Detektiv",
            effects: ["elementDiscovery"]
          };
    } else if (tier === 2) {
      const tierTwoNodes = [
        { id: "isotope-jackpot", title: "Schrödingers Atom", effects: ["quantumCollapse"] },
        { id: "click-streak", title: "Klick-Kettenreaktion", effects: ["chainReaction"] },
        { id: "orbital-recoil", title: "Orbital-Rückstoß", effects: ["electronBurst"] },
        { id: "electron-alchemy", title: "Orbital-Chaos", effects: ["orbitalShift"] }
      ];
      node = tierTwoNodes[index];
    } else if (tier === 3 && index < 5) {
      const effect = ["reactorBurst", "critical", "offline", "chrono", "supernova"][index];
      const definition = skillEffectCatalog.find((entry) => entry.effect === effect);
      node = {
        id: `tier-${tier + 1}-node-${index + 1}`,
        title: definition.shortTitle,
        effects: [effect]
      };
    } else {
      const effects = nextUniqueSkillEffects();
      node = {
        id: `tier-${tier + 1}-node-${index + 1}`,
        title: effects.map((effect) => skillEffectCatalog.find((entry) => entry.effect === effect).shortTitle).join(" + "),
        effects
      };
    }

    const effects = node.effects || [node.effect];
    const power = tier === 1 ? 1 : tier + 1;
    skillNodeIdsByTier[tier][index] = node.id;
    skillTreeDefinitions.push({
      ...node,
      effects,
      description: effects.map((effect) => describeSkillEffect(effect, power)).join(" · "),
      tier,
      index,
      cost: tierCost,
      power,
      parents: tier === 0
        ? []
        : [skillNodeIdsByTier[tier - 1][Math.floor(index / 2)]]
    });
  }
}

function describeSkillEffect(effect, power) {
  const percent = (value) => `${Number(value.toFixed(value < 1 ? 3 : 1)).toLocaleString("de-DE")}%`;
  const descriptions = {
    periodic: `${percent(Math.min(25, 0.1 * power))}: Atom→Kern; Elementzahl als $`,
    elementDiscovery: `${percent(Math.min(25, 0.1 * power))}: Entdeckt das nächste Element`,
    electronEcho: `${percent(Math.min(75, power))}: Klick ×2`,
    quantumCollapse: `${percent(Math.min(20, 0.2 * power))}: 5 s Zeitfenster; nächster Klick ×${2 + power}`,
    chainReaction: "Schnelle Klicks bauen bis ×4 Ertrag auf",
    electronBurst: `25. Klick: +${formatNumber(5 * power)} e⁻`,
    orbitalShift: `Alle ${Math.max(5, 24 - 2 * power)} Klicks: Bahnen wirbeln`,
    reactorBurst: `Reaktor +${percent(10 * power)}`,
    critical: `Krit-Chance +${percent(5 * power)}`,
    offline: `Offline +${percent(50 * power)}`,
    chrono: `${percent(Math.min(25, 0.1 * power))}: ${formatNumber(30 * power)}s Reaktor`,
    supernova: `${percent(Math.min(10, 0.01 * power))}: +${formatNumber(118 * power)} e⁻/$`
  };
  return descriptions[effect] || "";
}

function purchasedSkillNode(nodeId) {
  return atomGame.purchasedSkillNodes.includes(nodeId);
}

function skillNodeUnlocked(node) {
  return node.parents.every((parentId) => purchasedSkillNode(parentId));
}

function renderSkillTree() {
  const grid = document.querySelector(".skill-tree-grid");
  if (!grid) return;
  const expandedTier = Number(grid.dataset.expandedTier || 0);
  const renderKey = `${atomGame.skillPoints}:${atomGame.purchasedSkillNodes.join(",")}:${expandedTier}`;
  if (grid.dataset.renderKey === renderKey) return;
  grid.dataset.renderKey = renderKey;
  grid.replaceChildren();

  for (let tier = 0; tier < SKILL_TREE_LEVELS; tier += 1) {
    const level = document.createElement("div");
    level.className = "skill-tree-tier";
    level.dataset.tier = String(tier + 1);
    const tierNodes = skillTreeDefinitions.slice(Math.pow(2, tier) - 1, Math.pow(2, tier + 1) - 1);
    const isExpanded = expandedTier === tier + 1;
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "skill-tree-tier-toggle";
    toggle.dataset.skillTier = String(tier + 1);
    toggle.setAttribute("aria-expanded", String(isExpanded));
    toggle.setAttribute("aria-controls", `skill-tree-tier-${tier + 1}-nodes`);
    const price = document.createElement("span");
    price.className = "skill-tree-tier-price";
    price.textContent = `${Math.pow(10, tier + 1).toLocaleString("de-DE")} Punkte`;
    const label = document.createElement("span");
    label.className = "skill-tree-tier-label";
    const title = document.createElement("strong");
    title.textContent = `Ebene ${tier + 1}`;
    const count = document.createElement("small");
    count.textContent = `${tierNodes.length.toLocaleString("de-DE")} ${tierNodes.length === 1 ? "Fähigkeit" : "Fähigkeiten"}`;
    label.append(title, count);
    const chevron = document.createElement("span");
    chevron.className = "skill-tree-tier-chevron";
    chevron.setAttribute("aria-hidden", "true");
    chevron.textContent = isExpanded ? "−" : "+";
    toggle.append(price, label, chevron);
    level.appendChild(toggle);
    const nodes = document.createElement("div");
    nodes.className = "skill-tree-tier-nodes";
    nodes.id = `skill-tree-tier-${tier + 1}-nodes`;
    nodes.hidden = !isExpanded;

    if (isExpanded) {
      tierNodes.forEach((node) => {
        const purchased = purchasedSkillNode(node.id);
        const unlocked = skillNodeUnlocked(node);
        const button = document.createElement("button");
        button.type = "button";
        button.className = `skill-node${purchased ? " is-purchased" : ""}${unlocked ? " is-unlocked" : ""}`;
        button.disabled = purchased || !unlocked || atomGame.skillPoints < node.cost;
        button.innerHTML =
          `<span>${["⚛", "◆", "✦", "☄", "⌁", "✧", "◉", "⏳", "☀", "∞", "⚡", "✺"][tier]}</span>` +
          `<strong>${node.title}</strong>` +
          `<small>${node.description}</small>` +
          `<b>${purchased ? "✓ Gekauft" : !unlocked ? "Gesperrt" : atomGame.skillPoints < node.cost ? "Punkte fehlen" : "Kaufbar"}</b>`;
        button.dataset.skillNode = node.id;
        nodes.appendChild(button);
      });
    }

    level.appendChild(nodes);
    grid.appendChild(level);
  }

  if (!grid.dataset.bound) {
    grid.dataset.bound = "true";
    grid.addEventListener("click", (event) => {
      const tierButton = event.target.closest("[data-skill-tier]");
      if (tierButton && grid.contains(tierButton)) {
        const selectedTier = Number(tierButton.dataset.skillTier);
        const openTier = Number(grid.dataset.expandedTier || 0);
        grid.dataset.expandedTier = String(openTier === selectedTier ? 0 : selectedTier);
        grid.dataset.renderKey = "";
        renderSkillTree();
        return;
      }

      const button = event.target.closest("[data-skill-node]");
      if (!button || !grid.contains(button)) return;
      const node = skillTreeDefinitions.find((definition) => definition.id === button.dataset.skillNode);
      if (!node || purchasedSkillNode(node.id) || !skillNodeUnlocked(node) || atomGame.skillPoints < node.cost) return;
      atomGame.skillPoints -= node.cost;
      atomGame.purchasedSkillNodes.push(node.id);
      node.effects.forEach((effect) => {
        atomGame.skillNodes[effect] += node.power;
      });
      playSound("quest");
      renderAtomGame();
    });
  }
}

function renderPrestige() {
  if (!prestigeButton) return;
  const timeMachineCost = timeMachineCostForRun(atomGame.timeMachineRuns);
  const canPrestige = atomGame.lifetime >= timeMachineCost;
  prestigeButton.disabled = !canPrestige;
  if (prestigeValue) {
    const remaining = Math.max(0, timeMachineCost - atomGame.lifetime);
    prestigeValue.textContent = atomGame.timeMachineRuns > 0
      ? `${atomGame.timeMachineRuns} Reisen · ${formatNumber(remaining)} nötig`
      : remaining > 0
        ? `${formatNumber(remaining)} Elektronen nötig`
        : "Zeitreise starten";
  }
}

function timeMachineCostForRun(timeMachineRuns) {
  return 1000000 * Math.pow(4, Math.max(0, timeMachineRuns));
}

if (prestigeButton) {
  prestigeButton.addEventListener("click", () => {
    const timeMachineCost = timeMachineCostForRun(atomGame.timeMachineRuns);
    if (atomGame.lifetime < timeMachineCost) return;
    if (!window.confirm("Zeitmaschine starten? Elektronen, Dollar, Lifetime, Elemente und normale Upgrades werden zurückgesetzt. Dauerhafte Skillpunkte bleiben erhalten.")) return;
    atomGame.prestigeLevel += 1;
    atomGame.timeMachineRuns += 1;
    atomGame.skillPoints += 1;
    atomGame.electrons = 0;
    atomGame.electronCurrency = 0;
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
  return elements.reduce(
    (count, _, index) => count + (isElementUnlocked(index + 1) ? 1 : 0),
    0
  );
}

function isElementUnlocked(atomicNumber) {
  return atomGame.lifetime >= electronUnlockThreshold(atomicNumber) ||
    atomGame.discoveredElements.includes(atomicNumber);
}

function createElectronBurst(isCritical = false, chainMultiplier = 1) {
  const burst = document.createElement("span");
  burst.className = "electron-burst";
  burst.textContent = chainMultiplier > 1
    ? `KETTE ×${chainMultiplier.toFixed(1)}`
    : isCritical
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
    const threshold = electronUnlockThreshold(atomicNumber);
    const isUnlocked = isElementUnlocked(atomicNumber);
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
      const shells = electronShells[atomicNumber - 1] || [atomicNumber];
      const shellNames = ["K", "L", "M", "N", "O", "P", "Q"];
      const shellText = shells
        .map((count, shellIndex) => `${shellNames[shellIndex]}: ${count}`)
        .join(" · ");
      if (factElement) factElement.textContent =
        `${name} ist das ${atomicNumber}. Element. Ein neutrales ${name}-Atom hat ${atomicNumber} Protonen und ${atomicNumber} Elektronen (Symbol: ${symbol}). Elektronenverteilung: ${shellText}.`;
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
  if (atomCurrencyScore) atomCurrencyScore.textContent = formatNumber(atomGame.electronCurrency);
  const totalElectronScore = document.getElementById("atom-total-electron-score");
  if (totalElectronScore) totalElectronScore.textContent = formatNumber(atomGame.totalElectronsCollected);
  if (skillPointsValue) skillPointsValue.textContent = String(atomGame.skillPoints);
  if (skillPointsDashboard) skillPointsDashboard.textContent = String(atomGame.skillPoints);
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
    const currentElement = Math.min(
      118,
      Math.max(0, Math.floor(Number.isFinite(atomGame.electrons) ? atomGame.electrons : 0))
    );
    const orbitSettings = [
      { size: 210, height: 118, tilt: -42, duration: 6.2 },
      { size: 260, height: 148, tilt: 18, duration: 8.4 },
      { size: 310, height: 178, tilt: 52, duration: 10.6 }
    ];

    orbitSettings.forEach((settings, orbitIndex) => {
      const orbit = document.createElement("span");
      orbit.className = "electron-orbit-plane";
      orbit.style.setProperty("--orbit-size", `${settings.size}px`);
      orbit.style.setProperty("--orbit-height", `${settings.height}px`);
      orbit.style.setProperty("--orbit-tilt", `${settings.tilt}deg`);
      orbit.style.setProperty("--orbit-duration", `${settings.duration}s`);
      orbit.style.setProperty("--orbit-direction", orbitIndex % 2 === 0 ? "normal" : "reverse");

      const electronsPerOrbit = [0, 0, 0];
      for (let electronIndex = 0; electronIndex < currentElement; electronIndex += 1) {
        electronsPerOrbit[electronIndex % 3] += 1;
      }

      for (let electronIndex = 0; electronIndex < electronsPerOrbit[orbitIndex]; electronIndex += 1) {
        const angle = (electronIndex / electronsPerOrbit[orbitIndex]) * Math.PI * 2;
        const electron = document.createElement("span");
        electron.className = "orbit-electron";
        electron.style.left = `${50 + Math.cos(angle) * 50}%`;
        electron.style.top = `${50 + Math.sin(angle) * 50}%`;
        orbit.appendChild(electron);
      }
      electronOrbits.appendChild(orbit);
    });

    electronOrbits.dataset.elementNumber = String(currentElement);
    if (currentElement > 0) {
      const [symbol, name] = elements[currentElement - 1].split("|");
      electronOrbits.setAttribute(
        "aria-label",
        `Darstellung eines neutralen ${name}-Atoms mit ${currentElement} Elektronen auf drei Bahnen`
      );
      electronCoreValue.textContent = `${symbol} · ${formatNumber(currentElement)} e-`;
    } else {
      electronOrbits.setAttribute(
        "aria-label",
        "Keine verfügbaren Elektronen"
      );
      electronCoreValue.textContent = "0 e-";
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
  document.getElementById("upgrade-fission-level").textContent = levelText(atomGame.fissionLevel, "×2 Kraft · Elektronen halbiert");
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
    button.disabled = atomGame.electronCurrency < costs[key];
  });
  renderElements();
  renderPhysicistDream();
  renderQuests();
  renderDailyReward();
  renderPrestige();
  if (skillTreeDialog?.open) renderSkillTree();
  const statClicks = document.getElementById("stat-clicks");
  const statCrit = document.getElementById("stat-crit");
  const statElements = document.getElementById("stat-elements");
  if (statClicks) statClicks.textContent = formatNumber(atomGame.totalClicks);
  if (statCrit) statCrit.textContent = formatNumber(atomGame.criticalClicks);
  if (statElements) statElements.textContent = String(unlockedElementCount());
  if (soundState) soundState.textContent = atomGame.muted ? "Aus" : "An";
  saveAtomGame();
}

function start118ElectronTransition() {
  if (electron118Transitioning) return;
  electron118Transitioning = true;
  if (electronTarget) {
    electronTarget.classList.add("is-converting");
  }
  if (electronOrbits) {
    electronOrbits.classList.add("is-converting");
  }
  playSound("critical");

  window.setTimeout(() => {
    atomGame.electronCurrency += 118;
    atomGame.electrons = 0;
    electron118Transitioning = false;
    if (electronTarget) electronTarget.classList.remove("is-converting");
    if (electronOrbits) electronOrbits.classList.remove("is-converting");
    renderAtomGame();
  }, 900);
}

function addElectrons(amount) {
  const gained = Math.max(0, Number.isFinite(amount) ? amount : 0);
  atomGame.electronCurrency += gained;
  atomGame.totalElectronsCollected += gained;
  const newMilestones = Math.floor(atomGame.totalElectronsCollected / 500);
  atomGame.skillPoints += Math.max(0, newMilestones - atomGame.electronResearchMilestones);
  atomGame.electronResearchMilestones = newMilestones;
  if (electron118Transitioning) {
    atomGame.electrons += gained;
    atomGame.lifetime += gained;
    return;
  }
  atomGame.electrons += gained;
  atomGame.lifetime += gained;
  if (atomGame.electrons >= 118) {
    start118ElectronTransition();
    return;
  }
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

function triggerPeriodicBreakup() {
  if (atomGame.skillNodes.periodic < 1) return;
  if (Math.random() >= Math.min(0.25, 0.001 * atomGame.skillNodes.periodic)) return;

  const unlockedCount = unlockedElementCount();
  if (unlockedCount < 1) return;

  const atomicNumber = 1 + Math.floor(Math.random() * unlockedCount);
  const [symbol, name] = elements[atomicNumber - 1].split("|");
  animateElementToCore(symbol, name);

  atomGame.electronCurrency += atomicNumber;
  playSound("critical");
}

function animateElementToCore(symbol, name, message = `${name} zerfällt`) {
  const targetRect = electronTarget.getBoundingClientRect();
  const gridRect = elementGrid?.getBoundingClientRect();
  const startRect = gridRect || targetRect;

  const startX = startRect.left + startRect.width * (0.2 + Math.random() * 0.6);
  const startY = startRect.top + startRect.height * (0.2 + Math.random() * 0.6);
  const endX = targetRect.left + targetRect.width / 2;
  const endY = targetRect.top + targetRect.height / 2;

  const atom = document.createElement("span");
  atom.className = "periodic-atom-fly";
  atom.textContent = symbol;
  atom.title = message;
  atom.style.left = `${startX}px`;
  atom.style.top = `${startY}px`;
  atom.style.setProperty("--fly-x", `${endX - startX}px`);
  atom.style.setProperty("--fly-y", `${endY - startY}px`);
  document.body.appendChild(atom);
  window.setTimeout(() => atom.remove(), 1300);
}

function finishQuantumChallenge() {
  quantumChallengeActive = false;
  window.clearTimeout(quantumChallengeTimer);
  electronTarget?.classList.remove("is-quantum-ready");
  electronTarget?.setAttribute("aria-label", "Elektron sammeln");
  quantumChallengePrompt?.remove();
  quantumChallengePrompt = null;
}

function startQuantumChallenge() {
  if (!electronTarget) return;
  quantumChallengeActive = true;
  electronTarget.classList.add("is-quantum-ready");
  electronTarget.setAttribute("aria-label", "Schrödingers Atom: jetzt klicken");
  quantumChallengePrompt = document.createElement("span");
  quantumChallengePrompt.className = "quantum-skill-prompt";
  quantumChallengePrompt.textContent = "JETZT KLICKEN";
  electronTarget.appendChild(quantumChallengePrompt);
  quantumChallengeTimer = window.setTimeout(finishQuantumChallenge, 5000);
}

function triggerOrbitalShift() {
  if (!electronOrbits) return;
  electronOrbits.classList.remove("is-orbit-shifting");
  void electronOrbits.offsetWidth;
  electronOrbits.classList.add("is-orbit-shifting");
  window.clearTimeout(orbitalShiftTimer);
  orbitalShiftTimer = window.setTimeout(() => {
    electronOrbits.classList.remove("is-orbit-shifting");
  }, 1400);
}

function triggerCreativeSkillEffects(gainedElectrons) {
  const skills = atomGame.skillNodes;
  let bonusElectrons = 0;

  if (skills.electronEcho > 0 && Math.random() < Math.min(0.75, 0.01 * skills.electronEcho)) {
    bonusElectrons += gainedElectrons;
  }
  if (quantumChallengeActive) {
    bonusElectrons += gainedElectrons * (1 + skills.quantumCollapse);
    finishQuantumChallenge();
    playSound("critical");
  } else if (skills.quantumCollapse > 0 && Math.random() < Math.min(0.2, 0.002 * skills.quantumCollapse)) {
    startQuantumChallenge();
  }

  if (skills.chainReaction > 0) {
    const now = performance.now();
    chainClickStreak = now - lastChainClickAt <= 1200
      ? Math.min(26, chainClickStreak + 1)
      : 1;
    lastChainClickAt = now;
    const chainBonusMultiplier = Math.min(3, 0.12 * skills.chainReaction * Math.max(0, chainClickStreak - 1));
    chainClickMultiplier = 1 + chainBonusMultiplier;
    bonusElectrons += gainedElectrons * chainBonusMultiplier;
  } else {
    chainClickStreak = 0;
    lastChainClickAt = 0;
    chainClickMultiplier = 1;
  }

  if (skills.electronBurst > 0 && atomGame.totalClicks % 25 === 0) {
    bonusElectrons += 5 * skills.electronBurst;
  }

  const orbitalShiftInterval = Math.max(5, 24 - 2 * skills.orbitalShift);
  if (skills.orbitalShift > 0 && atomGame.totalClicks % orbitalShiftInterval === 0) {
    triggerOrbitalShift();
  }
  if (skills.chrono > 0 && Math.random() < Math.min(0.25, 0.001 * skills.chrono)) {
    bonusElectrons += autoPower() * 30 * skills.chrono;
  }
  if (skills.supernova > 0 && Math.random() < Math.min(0.1, 0.0001 * skills.supernova)) {
    bonusElectrons += 118 * skills.supernova;
    atomGame.electronCurrency += 118 * skills.supernova;
    playUpgradeEffect("nobel");
  }

  if (skills.elementDiscovery > 0 && Math.random() < Math.min(0.25, 0.001 * skills.elementDiscovery)) {
    const projectedLifetime = atomGame.lifetime + gainedElectrons + bonusElectrons;
    const nextAtomicNumber = elements.findIndex((_, index) =>
      !isElementUnlocked(index + 1) && index + 1 > projectedLifetime
    ) + 1;
    if (nextAtomicNumber > 0 && nextAtomicNumber <= elements.length) {
      atomGame.discoveredElements.push(nextAtomicNumber);
      const [symbol, name] = elements[nextAtomicNumber - 1].split("|");
      animateElementToCore(symbol, name, `${name} entdeckt`);
      playSound("quest");
    }
  }

  return bonusElectrons;
}

if (electronTarget) electronTarget.addEventListener("click", () => {
  atomGame.totalClicks += 1;
  const isCritical = Math.random() < Math.min(0.9, 0.1 + atomGame.skillNodes.critical * 0.05);
  const gained = clickPower() * (isCritical ? 5 : 1);
  if (isCritical) atomGame.criticalClicks += 1;
  triggerPeriodicBreakup();
  addElectrons(gained + triggerCreativeSkillEffects(gained));
  createElectronBurst(isCritical, chainClickMultiplier);
  playSound(isCritical ? "critical" : "click");
  electronTarget.classList.remove("is-clicked");
  void electronTarget.offsetWidth;
  electronTarget.classList.add("is-clicked");
});

if (upgradeClick) upgradeClick.addEventListener("click", () => {
  const cost = upgradeCost(50, atomGame.clickLevel);
  if (atomGame.electronCurrency < cost) return;
  atomGame.electronCurrency -= cost;
  atomGame.clickLevel += 1;
  renderAtomGame();
  animateUpgrade(upgradeClick);
  playUpgradeEffect("click");
});

if (upgradeAuto) upgradeAuto.addEventListener("click", () => {
  const cost = upgradeCost(150, atomGame.autoLevel);
  if (atomGame.electronCurrency < cost) return;
  atomGame.electronCurrency -= cost;
  atomGame.autoLevel += 1;
  renderAtomGame();
  animateUpgrade(upgradeAuto);
  playUpgradeEffect("reactor");
});

if (upgradeMagnet) upgradeMagnet.addEventListener("click", () => {
  const cost = upgradeCost(500, atomGame.magnetLevel);
  if (atomGame.electronCurrency < cost) return;
  atomGame.electronCurrency -= cost;
  atomGame.magnetLevel += 1;
  renderAtomGame();
  animateUpgrade(upgradeMagnet);
  playUpgradeEffect("magnet");
});

if (upgradeFission) upgradeFission.addEventListener("click", () => {
  const cost = upgradeCost(25000, atomGame.fissionLevel);
  if (atomGame.electronCurrency < cost) return;
  atomGame.electronCurrency -= cost;
  atomGame.electrons = Math.floor(atomGame.electrons / 2);
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
    if (atomGame.electronCurrency < cost()) return;
    atomGame.electronCurrency -= cost();
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

if (skillTreeButton && skillTreeDialog) {
  skillTreeButton.addEventListener("click", () => {
    skillTreeDialog.showModal();
    const grid = skillTreeDialog.querySelector(".skill-tree-grid");
    if (grid && grid.childElementCount === 0) {
      grid.textContent = "Skilltree wird geladen …";
      grid.dataset.renderKey = "";
    }
    window.requestAnimationFrame(() => {
      if (skillTreeDialog.open) renderSkillTree();
    });
  });
}

if (skillTreeClose && skillTreeDialog) {
  skillTreeClose.addEventListener("click", () => skillTreeDialog.close());
  skillTreeDialog.addEventListener("click", (event) => {
    if (event.target === skillTreeDialog) skillTreeDialog.close();
  });
}

if (elementDetailClose && elementDetailDialog) {
  elementDetailClose.addEventListener("click", () => elementDetailDialog.close());
}

if (atomReset) atomReset.addEventListener("click", () => {
  if (!window.confirm("Einkommen und gesamten Elektronen-Spielstand wirklich zurücksetzen?")) return;
  atomGame = {
    ...defaultAtomGame,
    questClaims: { ...defaultAtomGame.questClaims },
    lastSavedAt: Date.now()
  };
  localStorage.removeItem("phystar-atom-game");
  renderAtomGame();
});

if (atomButton && atomGameDialog) atomButton.addEventListener("click", () => {
  if (atomGameDialog.open) return;
  atomGameDialog.showModal();
  renderAtomGame();
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
