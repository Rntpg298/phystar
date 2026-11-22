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
