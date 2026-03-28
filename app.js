const STORAGE_KEY = "filament-flow-state-v1";
const LOCAL_COMMENTS_KEY = "filament-flow-comments-v1";
const LOCAL_REACTIONS_KEY = "filament-flow-reactions-v1";
const THEME_KEY = "filament-flow-theme-v1";

const colorThemes = {
  "ruby red": ["#ff7d8c", "#8c1023"],
  red: ["#ff8d72", "#b11d0e"],
  maroon: ["#a55869", "#4b1622"],
  white: ["#ffffff", "#cfd5dd"],
  black: ["#5e5e60", "#0d0d0e"],
  orange: ["#ffcb66", "#e96a15"],
  green: ["#9ae98c", "#237c38"],
  cyan: ["#8cf6ff", "#0ea9b4"],
  grey: ["#d2d2d6", "#6a6a70"],
  blue: ["#8ab8ff", "#184fa5"],
  silver: ["#f4f4f4", "#8d96a0"],
  tan: ["#e8d3b0", "#a8875f"],
  glow: ["#fff59c", "#72ff73"],
  rainbow: ["#ff6a88", "#ffcf4f", "#5bdd7c", "#6d8eff"],
  "multi-color": ["#ff7e6b", "#ffde59", "#6adc82", "#5aa5ff"],
  "blue + green": ["#58a6ff", "#6fe0af"],
  "rainbow forest": ["#6c51ff", "#00a878", "#d7ff64"],
  "rainbow universe": ["#2238ff", "#ff5cad", "#ffdb54"],
  "red + blue": ["#f33b3b", "#3a6cf7"],
  candy: ["#f84d9f", "#53d7ff"],
  "red + green": ["#f14646", "#3fad67"]
};

const config = window.APP_CONFIG || {};
const hasSharedComments = Boolean(config.supabaseUrl && config.supabaseAnonKey);

const printers = [
  { id: "P1S-1", name: "JenksRobotics1", model: "Bambu Lab P1S", account: "user_44942413", wlan: "JPS_Network", ip: "10.113.168.13", sd: "11.3 / 29.1 GB", source: "Screenshot snapshot", ext: "PLA", slots: [ { slot: "A1", filament: "PETG", color: "Black", k: "K 0.020" }, { slot: "A2", filament: "Unknown", color: "Unknown", k: "" }, { slot: "A3", filament: "PLA", color: "White", k: "K 0.020" }, { slot: "A4", filament: "PLA", color: "Black", k: "K 0.020" } ] },
  { id: "P1S-2", name: "JenksRobotics2", model: "Bambu Lab P1S", account: "user_44942413", wlan: "JPS_Network", ip: "10.113.160.45", sd: "9.0 / 29.1 GB", source: "Screenshot snapshot", ext: "TPU", slots: [ { slot: "A1", filament: "PETG", color: "Black", k: "K 0.040" }, { slot: "A2", filament: "Empty", color: "", k: "" }, { slot: "A3", filament: "PETG", color: "Black", k: "K 0.040" }, { slot: "A4", filament: "PETG", color: "Black", k: "K 0.040" } ] }
];

function normalize(text) { return String(text || "").trim().toLowerCase(); }
function normalizeSealStatus(value) {
  const key = normalize(value);
  if (key === "in a bag") return "in a bag";
  if (key === "no") return "No";
  if (key === "unopened") return "unopened";
  return String(value || "").trim();
}
function locationBucketFor(location) {
  const key = normalize(location);
  if (!key) return "On shelf";
  if (key.includes("printer") || key.includes("p1s") || key.includes("jenksrobotics")) return "In printer";
  return "On shelf";
}
function getRequestedTagFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("tag");
  } catch {
    return null;
  }
}
function syncSelectedTagToUrl(tag) {
  try {
    const url = new URL(window.location.href);
    if (tag) url.searchParams.set("tag", tag);
    else url.searchParams.delete("tag");
    window.history.replaceState({}, "", url.toString());
  } catch {}
}
function defaultThresholdFor(material) { const key = normalize(material); if (key === "tpu") return 0.5; if (key === "petg") return 0.3; return 0.3; }
function colorFamilyFor(color) { const key = normalize(color); if (key.includes("black")) return "Black"; if (key.includes("white") || key.includes("silver") || key.includes("grey")) return "Neutral"; if (key.includes("red") || key.includes("maroon") || key.includes("ruby")) return "Red"; if (key.includes("blue") || key.includes("cyan")) return "Blue"; if (key.includes("green") || key.includes("glow")) return "Green"; if (key.includes("orange") || key.includes("tan")) return "Warm"; if (key.includes("rainbow") || key.includes("multi") || key.includes("candy")) return "Multi"; return "Other"; }
function brandLogoFor(brand) { return String(brand || "Generic").trim() || "Generic"; }
function formatPercent(value) {
  const amount = Math.max(0, Number(value) || 0);
  if (amount < 0.3) return "low";
  return `${Math.round(amount * 100)}% remaining`;
}
function formatAmountSummary(value) { return `${Number(value).toFixed(1)} spools`; }
function parseSheetAmount(value) { const clean = normalize(value); if (!clean) return 0; if (clean === "low") return 0.2; const parsed = Number(clean); return Number.isFinite(parsed) ? parsed : 0; }
function loadLocalReactions() { try { return JSON.parse(localStorage.getItem(LOCAL_REACTIONS_KEY) || "{}"); } catch { return {}; } }
function loadThemePreference() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    return ["light", "dark", "team31"].includes(saved) ? saved : "light";
  } catch {
    return "light";
  }
}
function applyTheme(theme) {
  const nextTheme = ["light", "dark", "team31"].includes(theme) ? theme : "light";
  document.documentElement.setAttribute("data-theme", nextTheme);
  if (els.themeSelect) els.themeSelect.value = nextTheme;
  try { localStorage.setItem(THEME_KEY, nextTheme); } catch {}
  state.theme = nextTheme;
}

const state = {
  inventory: loadInventory(),
  activeMaterial: "All",
  activeLocation: "All",
  activeMode: "All",
  activeFamily: "All",
  search: "",
  selectedId: null,
  comments: [],
  commentsLoading: false,
  dataSourceLabel: "Local inventory",
  currentPrinterId: "P1S-1",
  reactions: loadLocalReactions(),
  theme: loadThemePreference()
};

const els = {
  statStrip: document.getElementById("stat-strip"),
  materialFilters: document.getElementById("material-filters"),
  locationFilters: document.getElementById("location-filters"),
  modeFilters: document.getElementById("mode-filters"),
  familyFilters: document.getElementById("family-filters"),
  inventoryGrid: document.getElementById("inventory-grid"),
  resultsCopy: document.getElementById("results-copy"),
  matchGrid: document.getElementById("match-grid"),
  searchInput: document.getElementById("search-input"),
  searchSuggestions: document.getElementById("search-suggestions"),
  printerGrid: document.getElementById("printer-grid"),
  themeSelect: document.getElementById("theme-select"),
  featuredName: document.getElementById("featured-name"),
  featuredMeta: document.getElementById("featured-meta"),
  featuredAmount: document.getElementById("featured-amount"),
  featuredSwatch: document.getElementById("featured-swatch"),
  jumpFeatured: document.getElementById("jump-featured"),
  spreadsheetLink: document.getElementById("spreadsheet-link"),
  homeButton: document.getElementById("home-button"),
  detailTitle: document.getElementById("detail-title"),
  detailSubtitle: document.getElementById("detail-subtitle"),
  detailAmount: document.getElementById("detail-amount"),
  detailProgress: document.getElementById("detail-progress"),
  detailStatus: document.getElementById("detail-status"),
  detailSwatch: document.getElementById("detail-swatch"),
  detailList: document.getElementById("detail-list"),
  detailNotes: document.getElementById("detail-notes"),
  thresholdForm: document.getElementById("threshold-form"),
  thresholdInput: document.getElementById("threshold-input"),
  sealForm: document.getElementById("seal-form"),
  sealSelect: document.getElementById("seal-select"),
  likeButton: document.getElementById("like-button"),
  favoriteButton: document.getElementById("favorite-button"),
  likeCount: document.getElementById("like-count"),
  favoriteCount: document.getElementById("favorite-count"),
  amazonLink: document.getElementById("amazon-link"),
  addFilamentButton: document.getElementById("add-filament-button"),
  addFilamentModal: document.getElementById("add-filament-modal"),
  addFilamentForm: document.getElementById("add-filament-form"),
  closeAddFilament: document.getElementById("close-add-filament"),
  newTag: document.getElementById("new-tag"),
  newMaterial: document.getElementById("new-material"),
  newFinish: document.getElementById("new-finish"),
  newBrand: document.getElementById("new-brand"),
  newColor: document.getElementById("new-color"),
  newAmount: document.getElementById("new-amount"),
  newThreshold: document.getElementById("new-threshold"),
  newLocation: document.getElementById("new-location"),
  newSealed: document.getElementById("new-sealed"),
  newRestock: document.getElementById("new-restock"),
  newNotes: document.getElementById("new-notes"),
  increaseButton: document.getElementById("increase-button"),
  decreaseButton: document.getElementById("decrease-button"),
  resetButton: document.getElementById("reset-button"),
  commentsStatus: document.getElementById("comments-status"),
  commentForm: document.getElementById("comment-form"),
  commentName: document.getElementById("comment-name"),
  commentText: document.getElementById("comment-text"),
  commentList: document.getElementById("comment-list"),
  locationForm: document.getElementById("location-form"),
  locationSelect: document.getElementById("location-select"),
  positionInput: document.getElementById("position-input"),
  locationBucket: document.getElementById("location-bucket"),
  moveToPrinter: document.getElementById("move-to-printer"),
  moveToShelf: document.getElementById("move-to-shelf"),
  newPosition: document.getElementById("new-position")
};

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];
    if (char === '"' && inQuotes && next === '"') { current += '"'; i += 1; continue; }
    if (char === '"') { inQuotes = !inQuotes; continue; }
    if (char === "," && !inQuotes) { values.push(current); current = ""; continue; }
    current += char;
  }
  values.push(current);
  return values.map((value) => value.trim());
}

function buildInventoryFromSheetCsv(csvText) {
  const lines = csvText.replace(/\r/g, "").split("\n").filter((line) => line.trim());
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]);
  const indexOfAny = (names, fallbackIndex = -1) => {
    const found = headers.findIndex((header) => names.some((name) => normalize(header) === normalize(name)));
    return found >= 0 ? found : fallbackIndex;
  };
  const tagIndex = indexOfAny(["Tag"], 0);
  const typeIndex = indexOfAny(["Filament type"], 1);
  const specificsIndex = indexOfAny(["Specifics (if neccessary)"], 2);
  const brandIndex = indexOfAny(["Brand"], 3);
  const sealedIndex = indexOfAny(["Sealed"], 4);
  const locationIndex = indexOfAny(["Location", "System.Xml.XmlElement"], 5);
  const amountIndex = indexOfAny(["Amount remaining (approximate)"], 6);
  const reorderIndex = indexOfAny(["Order again"], 7);
  const commentsIndex = indexOfAny(["Comments"], 8);
  const colorIndex = indexOfAny(["Color"], 9);
  return lines.slice(1).map((line) => parseCsvLine(line)).filter((row) => row[tagIndex]).map((row) => ({
    id: row[tagIndex] || "",
    material: (row[typeIndex] || "Unknown").toUpperCase(),
    finish: row[specificsIndex] || "Unknown",
    brand: row[brandIndex] || "Unknown",
    sealed: normalizeSealStatus(row[sealedIndex] || "Unknown"),
    location: row[locationIndex] || "Unknown",
    amount: parseSheetAmount(row[amountIndex]),
    reorderThreshold: defaultThresholdFor(row[typeIndex] || "Unknown"),
    restock: row[reorderIndex] || "Unknown",
    notes: row[commentsIndex] || "",
    color: row[colorIndex] || "Unknown",
    colorFamily: colorFamilyFor(row[colorIndex] || "Unknown"),
    position: ""
  }));
}

function loadInventory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) throw new Error("no saved");
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) throw new Error("bad saved");
    return window.DEFAULT_INVENTORY.map((item) => {
      const match = parsed.find((savedItem) => savedItem.id === item.id);
      const merged = match ? { ...item, ...match } : { ...item };
      return { ...merged, reorderThreshold: merged.reorderThreshold ?? defaultThresholdFor(merged.material), colorFamily: merged.colorFamily || colorFamilyFor(merged.color), position: merged.position || "" };
    });
  } catch {
    return window.DEFAULT_INVENTORY.map((item) => ({ ...item, reorderThreshold: item.reorderThreshold ?? defaultThresholdFor(item.material), colorFamily: item.colorFamily || colorFamilyFor(item.color), position: item.position || "" }));
  }
}

function saveInventory() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.inventory)); } catch {} }
function loadLocalComments() { try { return JSON.parse(localStorage.getItem(LOCAL_COMMENTS_KEY) || "[]"); } catch { return []; } }
function saveLocalComments(comments) { try { localStorage.setItem(LOCAL_COMMENTS_KEY, JSON.stringify(comments)); } catch {} }
function saveLocalReactions() { try { localStorage.setItem(LOCAL_REACTIONS_KEY, JSON.stringify(state.reactions)); } catch {} }

async function loadInventoryFromGoogleSheet() {
  if (!config.googleSheetCsvUrl) return false;
  try {
    const response = await fetch(config.googleSheetCsvUrl, { cache: "no-store" });
    if (!response.ok) return false;
    const csvText = await response.text();
    const sheetInventory = buildInventoryFromSheetCsv(csvText);
    if (!sheetInventory.length) return false;
    const saved = loadInventory();
    state.inventory = sheetInventory.map((item) => {
      const match = saved.find((savedItem) => savedItem.id === item.id);
      return match ? { ...item, reorderThreshold: match.reorderThreshold ?? item.reorderThreshold } : item;
    });
    state.dataSourceLabel = "Google Sheet live";
    return true;
  } catch {
    return false;
  }
}

function amountForSheet(value) {
  const amount = Math.max(0, Number(value) || 0);
  if (amount < 0.3) return "low";
  return `${Math.round(amount * 100)}%`;
}

function buildSheetPayload(item) {
  return {
    tag: item.id,
    filamentType: item.material,
    specifics: item.finish,
    brand: item.brand,
    sealed: normalizeSealStatus(item.sealed),
    location: item.location,
    amountRemaining: amountForSheet(item.amount),
    orderAgain: item.restock || "Unknown",
    comments: item.notes || "",
    color: item.color
  };
}

async function syncItemToGoogleSheet(item, mode = "upsert") {
  if (!config.googleSheetAppsScriptUrl || !item?.id) return false;
  try {
    const response = await fetch(config.googleSheetAppsScriptUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: mode,
        secret: config.googleSheetSharedSecret || "",
        sheetName: config.googleSheetName || "Sheet1",
        item: buildSheetPayload(item)
      })
    });
    return response.ok;
  } catch {
    return false;
  }
}

function isBelowThreshold(item) { return Number(item.amount) <= Number(item.reorderThreshold || defaultThresholdFor(item.material)); }
function swatchFor(color) { const stops = colorThemes[normalize(color)] || ["#f1d3af", "#af8358"]; return `linear-gradient(135deg, ${stops.join(", ")})`; }
function colorStopsFor(color) { return colorThemes[normalize(color)] || ["#f1d3af", "#af8358"]; }
function nameStyleFor(color) {
  const key = normalize(color);
  const gradient = swatchFor(color);
  const darkTheme = state.theme === "dark";
  const needsContrast = ["white", "silver", "glow"].includes(key) || darkTheme;
  const stroke = darkTheme ? "1.2px rgba(0,0,0,0.72)" : needsContrast ? "0.8px rgba(23,23,23,0.28)" : "0 transparent";
  const shadow = darkTheme ? "0 1px 0 rgba(255,255,255,0.08)" : needsContrast ? "0 1px 0 rgba(255,255,255,0.55)" : "none";
  return `--name-gradient:${gradient};--name-stroke:${stroke};--name-shadow:${shadow};`;
}
function getAvailability(item) { if (isBelowThreshold(item)) return { label: "Below reorder threshold", tone: "low" }; if (item.amount >= 0.95) return { label: "Factory fresh", tone: "good" }; if (item.amount >= 0.5) return { label: "Ready for print", tone: "good" }; if (item.amount >= 0.25) return { label: "Watch inventory", tone: "warn" }; if (item.amount > 0) return { label: "Low stock", tone: "low" }; return { label: "Empty spool", tone: "low" }; }
function getReactionCounts(id) { return state.reactions[id] || { likes: 0, favorites: 0 }; }
function getMaterials() { return ["All", ...new Set(state.inventory.map((item) => item.material).sort())]; }
function getLocations() { return ["All", ...new Set(state.inventory.map((item) => item.location).sort())]; }
function getSealChoices() {
  const preferred = ["in a bag", "No", "unopened"];
  const all = [...preferred, ...state.inventory.map((item) => normalizeSealStatus(item.sealed)).filter(Boolean)];
  const deduped = [];
  const seen = new Set();
  all.forEach((status) => {
    const key = normalize(status);
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(status);
    }
  });
  return deduped;
}
function getLocationChoices() {
  return Array.from(new Set([
    "Printer",
    ...printers.map((printer) => printer.name),
    ...state.inventory.map((item) => item.location).filter(Boolean)
  ])).sort((a, b) => a.localeCompare(b));
}
function getFamilies() { return ["All", ...new Set(state.inventory.map((item) => item.colorFamily || colorFamilyFor(item.color)).sort())]; }
function getModes() { return ["All", "Low stock", "Ready to print", "Favorites", "Most liked"]; }

function spoolSvg(color, label, idSeed) {
  const stops = colorStopsFor(color);
  const gradientId = `filament-fill-${idSeed}`;
  const rimDarkId = `rim-dark-${idSeed}`;
  const rimLightId = `rim-light-${idSeed}`;
  const stopMarkup = stops.map((stop, index) => {
    const offset = stops.length === 1 ? "100%" : `${Math.round((index / (stops.length - 1)) * 100)}%`;
    return `<stop offset="${offset}" stop-color="${stop}"></stop>`;
  }).join("");
  return `<svg class="spool-illustration" viewBox="0 0 220 220" role="img" aria-label="${label}"><defs><linearGradient id="${rimDarkId}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#2d2d2f"></stop><stop offset="100%" stop-color="#101012"></stop></linearGradient><linearGradient id="${rimLightId}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#777a82"></stop><stop offset="100%" stop-color="#cfd3da"></stop></linearGradient><linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">${stopMarkup}</linearGradient></defs><ellipse cx="110" cy="190" rx="68" ry="15" fill="rgba(18,18,18,0.14)"></ellipse><circle cx="110" cy="110" r="86" fill="url(#${rimDarkId})"></circle><circle cx="110" cy="110" r="70" fill="url(#${gradientId})"></circle><circle cx="110" cy="110" r="46" fill="url(#${rimLightId})"></circle><circle cx="110" cy="110" r="16" fill="#eceef1"></circle><rect x="96" y="36" width="28" height="148" rx="14" fill="rgba(255,255,255,0.13)"></rect><path d="M55 94c20-10 90-12 111-8" fill="none" stroke="rgba(255,255,255,0.23)" stroke-width="6" stroke-linecap="round"></path><path d="M60 124c35 9 79 10 99 4" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="5" stroke-linecap="round"></path><circle cx="110" cy="110" r="11" fill="#b7bcc5"></circle></svg>`;
}

function renderPrinterGrid() {
  if (!els.printerGrid) return;
  els.printerGrid.innerHTML = printers.map((printer) => {
    const loaded = printer.slots.filter((entry) => entry.filament && entry.filament !== "Empty").length;
    return `<article class="printer-card ${printer.id === state.currentPrinterId ? "active-printer" : ""}" data-printer-id="${printer.id}"><p class="eyebrow">${printer.model}</p><h3>${printer.name}</h3><p class="printer-meta">${loaded}/4 AMS slots loaded / Ext: ${printer.ext}</p><p class="printer-meta">IP ${printer.ip} / WLAN ${printer.wlan}</p><p class="printer-meta">Account ${printer.account} / SD ${printer.sd}</p><div class="slot-grid">${printer.slots.map((entry) => `<div class="slot-chip"><strong>${entry.slot}</strong><small>${entry.filament === "Empty" ? "Empty" : `${entry.color} ${entry.filament}`}</small><small>${entry.k || ""}</small></div>`).join("")}</div></article>`;
  }).join("");
}

function renderMatchGrid() {
  if (!els.matchGrid) return;
  const printer = printers.find((entry) => entry.id === state.currentPrinterId) || printers[0];
  const targetMaterials = new Set([printer.ext, ...printer.slots.map((slot) => slot.filament)].map(normalize));
  const matches = state.inventory.filter((item) => targetMaterials.has(normalize(item.material)) && item.amount >= 0.5).sort((a, b) => b.amount - a.amount || Number(b.id) - Number(a.id)).slice(0, 3);
  els.matchGrid.innerHTML = matches.length ? matches.map((item) => `<article class="match-card"><span class="brand-logo">${brandLogoFor(item.brand)}</span><h3 class="filament-name" style="${nameStyleFor(item.color)}">${item.color} ${item.material}</h3><p class="inventory-subline">${item.brand} / ${item.finish} / ${formatAmountSummary(item.amount)}</p></article>`).join("") : `<article class="match-card"><p class="inventory-subline">No strong matches for ${printer.name} right now.</p></article>`;
}

function getFilteredInventory() {
  return state.inventory.filter((item) => {
    const haystack = [item.id, item.material, item.finish, item.brand, item.location, item.color, item.notes].join(" ").toLowerCase();
    const reaction = getReactionCounts(item.id);
    const matchesSearch = !state.search || haystack.includes(state.search);
    const matchesMaterial = state.activeMaterial === "All" || item.material === state.activeMaterial;
    const matchesLocation = state.activeLocation === "All" || item.location === state.activeLocation;
    const matchesFamily = state.activeFamily === "All" || (item.colorFamily || colorFamilyFor(item.color)) === state.activeFamily;
    const matchesMode = state.activeMode === "All" || (state.activeMode === "Low stock" && isBelowThreshold(item)) || (state.activeMode === "Ready to print" && item.amount >= 0.5) || (state.activeMode === "Favorites" && reaction.favorites > 0) || (state.activeMode === "Most liked" && reaction.likes > 0);
    return matchesSearch && matchesMaterial && matchesLocation && matchesFamily && matchesMode;
  }).sort((a, b) => Number(b.id) - Number(a.id) || b.id.localeCompare(a.id));
}

function getSearchSuggestions() {
  const query = normalize(state.search);
  if (!query) return [];
  return state.inventory.map((item) => {
    const title = `${item.color} ${item.material}`;
    const fields = [item.color, item.brand, item.material, item.finish, item.location, title].map(normalize);
    let score = -1;
    if (fields.some((field) => field.startsWith(query))) score = 3;
    else if (fields.some((field) => field.split(" ").some((part) => part.startsWith(query)))) score = 2;
    else if (fields.some((field) => field.includes(query))) score = 1;
    return { item, score, title };
  }).filter((entry) => entry.score > 0).sort((a, b) => b.score - a.score || Number(b.item.id) - Number(a.item.id)).slice(0, 3);
}

function renderSuggestions() {
  if (!els.searchSuggestions) return;
  const suggestions = getSearchSuggestions();
  els.searchSuggestions.innerHTML = suggestions.map(({ item, title }) => `<button class="search-suggestion" type="button" data-suggest-id="${item.id}"><div class="search-mini-art">${spoolSvg(item.color, `${title} spool`, `suggest-${item.id}`)}</div><div><strong>${title}</strong><small>Tag ${item.id} / ${item.brand}</small></div></button>`).join("");
}

function getSelectedItem(filteredInventory) {
  const selected = filteredInventory.find((item) => item.id === state.selectedId) || state.inventory.find((item) => item.id === state.selectedId);
  return selected || filteredInventory[0] || state.inventory[0];
}

function renderStatStrip() {
  const total = state.inventory.length;
  els.statStrip.innerHTML = `<article class="stat-card"><span>Total spools</span><strong>${total}</strong></article>`;
}

function renderFilters() {
  els.materialFilters.innerHTML = getMaterials().map((material) => `<button class="filter-pill ${material === state.activeMaterial ? "active" : ""}" type="button" data-filter-type="material" data-value="${material}">${material}</button>`).join("");
  els.locationFilters.innerHTML = getLocations().map((location) => `<button class="filter-pill ${location === state.activeLocation ? "active" : ""}" type="button" data-filter-type="location" data-value="${location}">${location}</button>`).join("");
  if (els.modeFilters) els.modeFilters.innerHTML = getModes().map((mode) => `<button class="filter-pill ${mode === state.activeMode ? "active" : ""}" type="button" data-filter-type="mode" data-value="${mode}">${mode}</button>`).join("");
  if (els.familyFilters) els.familyFilters.innerHTML = getFamilies().map((family) => `<button class="filter-pill ${family === state.activeFamily ? "active" : ""}" type="button" data-filter-type="family" data-value="${family}">${family}</button>`).join("");
}

function renderFeatured(item) {
  els.featuredName.textContent = `${item.color} ${item.material}`;
  els.featuredName.classList.add("filament-name");
  els.featuredName.style.cssText = nameStyleFor(item.color);
  els.featuredMeta.textContent = `${item.brand} / ${item.finish} / ${item.location}`;
  els.featuredAmount.innerHTML = `<span class="amount-readout">${formatAmountSummary(item.amount)} <small>${formatPercent(item.amount)}</small></span>`;
  els.featuredSwatch.innerHTML = spoolSvg(item.color, `${item.color} ${item.material} spool`, `featured-${item.id}`);
}

function renderInventoryGrid(items) {
  els.resultsCopy.textContent = `${items.length} spool${items.length === 1 ? "" : "s"} showing`;
  if (!items.length) {
    els.inventoryGrid.innerHTML = `<article class="inventory-card"><div><h3>No matching spool</h3><p class="inventory-subline">Try a different material, storage area, or search phrase.</p></div></article>`;
    return;
  }
  els.inventoryGrid.innerHTML = items.map((item) => {
    const availability = getAvailability(item);
    const reaction = getReactionCounts(item.id);
    return `<article class="inventory-card ${item.id === state.selectedId ? "active" : ""}" data-id="${item.id}"><div class="card-topline"><div class="card-brandline"><span class="card-id">Tag ${item.id}</span><span class="brand-logo">${brandLogoFor(item.brand)}</span></div><div class="color-badge" style="background:${swatchFor(item.color)}"></div></div><div class="card-visual">${spoolSvg(item.color, `${item.color} ${item.material} spool`, `card-${item.id}`)}</div><div><h3 class="filament-name" style="${nameStyleFor(item.color)}">${item.color}</h3><p class="inventory-subline">${item.material} / ${item.finish} / ${item.brand}</p></div><div class="card-tags"><span class="badge">${item.location}</span><span class="badge">${locationBucketFor(item.location)}</span>${item.position ? `<span class="badge">${item.position}</span>` : ""}<span class="badge">${item.colorFamily}</span><span class="badge">${item.sealed}</span>${reaction.favorites > 0 ? `<span class="badge favorite">Favorite ${reaction.favorites}</span>` : ""}${reaction.likes > 0 ? `<span class="badge">Heart ${reaction.likes}</span>` : ""}${isBelowThreshold(item) ? `<span class="chip low">Reorder at ${Number(item.reorderThreshold).toFixed(1)}</span>` : ""}<span class="chip ${availability.tone}">${availability.label}</span></div><div class="card-footer"><strong class="amount-readout">${formatAmountSummary(item.amount)} <small>${formatPercent(item.amount)}</small></strong><button class="card-action" type="button" data-open-id="${item.id}">View</button></div></article>`;
  }).join("") + `<button class="inventory-card add-card" type="button" data-open-add-filament="true"><div class="plus-icon">+</div><div><h3>Add filament</h3><p class="inventory-subline">Create a new spool entry right from the catalog.</p></div></button>`;
}

function renderComments() {
  if (!els.commentList || !els.commentsStatus) return;
  els.commentsStatus.textContent = hasSharedComments ? "Shared web comments enabled" : "Local-only mode";
  if (state.commentsLoading) { els.commentList.innerHTML = `<p class="comment-empty">Loading comments...</p>`; return; }
  if (!state.comments.length) { els.commentList.innerHTML = `<p class="comment-empty">No comments yet. Be the first to leave a note.</p>`; return; }
  els.commentList.innerHTML = state.comments.map((comment) => `<article class="comment-item"><strong>${comment.display_name || "Anonymous"}</strong><p>${comment.body}</p></article>`).join("");
}

async function fetchCommentsForSpool(spoolId) {
  if (!els.commentList || !els.commentsStatus) return;
  state.commentsLoading = true;
  renderComments();
  if (!hasSharedComments) {
    state.comments = loadLocalComments().filter((comment) => comment.spool_id === spoolId).reverse();
    state.commentsLoading = false;
    renderComments();
    return;
  }
  const url = `${config.supabaseUrl}/rest/v1/filament_comments?spool_id=eq.${encodeURIComponent(spoolId)}&select=display_name,body,created_at&order=created_at.desc`;
  try {
    const response = await fetch(url, { headers: { apikey: config.supabaseAnonKey, Authorization: `Bearer ${config.supabaseAnonKey}` } });
    const data = response.ok ? await response.json() : [];
    state.comments = Array.isArray(data) ? data : [];
  } catch {
    state.comments = [];
  }
  state.commentsLoading = false;
  renderComments();
}

async function postComment(spoolId, displayName, body) {
  const cleanComment = body.trim();
  const cleanName = displayName.trim() || "Anonymous";
  if (!cleanComment) return false;
  if (!hasSharedComments) {
    const comments = loadLocalComments();
    comments.push({ spool_id: spoolId, display_name: cleanName, body: cleanComment, created_at: new Date().toISOString() });
    saveLocalComments(comments);
    return true;
  }
  const response = await fetch(`${config.supabaseUrl}/rest/v1/filament_comments`, { method: "POST", headers: { "Content-Type": "application/json", apikey: config.supabaseAnonKey, Authorization: `Bearer ${config.supabaseAnonKey}`, Prefer: "return=minimal" }, body: JSON.stringify({ spool_id: spoolId, display_name: cleanName, body: cleanComment }) });
  return response.ok;
}

function amazonUrlFor(item) {
  const terms = [item.brand, item.color, item.material, item.finish, "filament"].filter(Boolean).join(" ");
  return `https://www.amazon.com/s?k=${encodeURIComponent(terms)}`;
}

function openAddFilamentModal() {
  if (!els.addFilamentModal) return;
  els.newTag.value = "";
  els.newMaterial.value = "PLA";
  els.newFinish.value = "Normal";
  els.newBrand.value = "Generic";
  els.newColor.value = "";
  els.newAmount.value = "1.0";
  els.newThreshold.value = "0.3";
  els.newLocation.value = "";
  els.newPosition.value = "";
  if (els.newSealed) {
    els.newSealed.innerHTML = getSealChoices().map((status) => `<option value="${status}" ${normalize(status) === "unopened" ? "selected" : ""}>${status}</option>`).join("");
  }
  els.newRestock.value = "Unknown";
  els.newNotes.value = "";
  els.addFilamentModal.showModal();
}

function closeAddFilamentModal() {
  if (els.addFilamentModal?.open) els.addFilamentModal.close();
}

function createFilamentFromForm() {
  const material = els.newMaterial.value.trim() || "Unknown";
  return {
    id: els.newTag.value.trim(),
    material: material.toUpperCase(),
    finish: els.newFinish.value.trim() || "Unknown",
    brand: els.newBrand.value.trim() || "Generic",
    color: els.newColor.value.trim() || "Unknown",
    amount: Number(els.newAmount.value || 0),
    reorderThreshold: Number(els.newThreshold.value || defaultThresholdFor(material)),
    location: els.newLocation.value.trim() || "Unknown",
    position: els.newPosition.value.trim(),
    sealed: normalizeSealStatus(els.newSealed.value.trim() || "Unknown"),
    restock: els.newRestock.value.trim() || "Unknown",
    notes: els.newNotes.value.trim(),
    colorFamily: colorFamilyFor(els.newColor.value)
  };
}

function renderDetails(item) {
  if (!item) {
    state.comments = [];
    state.commentsLoading = false;
    els.detailTitle.textContent = "Choose a filament";
    els.detailSubtitle.textContent = "Click any spool card to inspect it here.";
    els.detailAmount.textContent = "0.0";
    els.detailProgress.style.width = "0%";
    els.detailStatus.textContent = "No spool selected.";
    els.detailSwatch.innerHTML = "";
    els.detailList.innerHTML = "";
    els.detailNotes.textContent = "No notes for this spool yet.";
    els.thresholdInput.value = "0.3";
    els.likeCount.textContent = "0";
    els.favoriteCount.textContent = "0";
    els.amazonLink.href = "https://www.amazon.com/";
    if (els.locationSelect) els.locationSelect.innerHTML = "";
    if (els.positionInput) els.positionInput.value = "";
    if (els.sealSelect) els.sealSelect.innerHTML = "";
    if (els.locationBucket) els.locationBucket.textContent = "On shelf";
    renderComments();
    return;
  }

  const reaction = getReactionCounts(item.id);
  const availability = getAvailability(item);
  els.detailTitle.textContent = `${item.color} ${item.material}`;
  els.detailTitle.classList.add("filament-name");
  els.detailTitle.style.cssText = nameStyleFor(item.color);
  els.detailSubtitle.textContent = `${item.brand} / ${item.finish} / Tag ${item.id}`;
  els.detailAmount.innerHTML = `${Number(item.amount).toFixed(1)} <small>${formatPercent(item.amount)}</small>`;
  els.detailProgress.style.width = `${Math.min(100, Math.max(0, item.amount) * 100)}%`;
  els.detailProgress.style.background = swatchFor(item.color);
  els.detailStatus.textContent = `${availability.label} / stored at ${item.location} / restock: ${item.restock}`;
  els.detailSwatch.innerHTML = spoolSvg(item.color, `${item.color} ${item.material} spool`, `detail-${item.id}`);
  if (els.locationSelect) {
    els.locationSelect.innerHTML = getLocationChoices().map((location) => `<option value="${location}" ${location === item.location ? "selected" : ""}>${location}</option>`).join("");
  }
  if (els.sealSelect) {
    els.sealSelect.innerHTML = getSealChoices().map((status) => `<option value="${status}" ${status === item.sealed ? "selected" : ""}>${status}</option>`).join("");
  }
  if (els.positionInput) {
    els.positionInput.value = item.position || "";
  }
  if (els.locationBucket) {
    els.locationBucket.textContent = locationBucketFor(item.location);
  }
  els.detailList.innerHTML = [
    ["Material", item.material],
    ["Finish", item.finish],
    ["Brand", item.brand],
    ["Color", item.color],
    ["Color family", item.colorFamily || colorFamilyFor(item.color)],
    ["Storage", item.location],
    ["Position", item.position || "Not set"],
    ["Placement", locationBucketFor(item.location)],
    ["Seal status", item.sealed],
    ["Order again", item.restock],
    ["Spool tag", item.id],
    ["Reorder at", formatAmountSummary(item.reorderThreshold ?? defaultThresholdFor(item.material))]
  ].map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("");
  els.detailNotes.textContent = item.notes || "No notes for this spool yet.";
  els.thresholdInput.value = Number(item.reorderThreshold ?? defaultThresholdFor(item.material)).toFixed(1);
  els.likeCount.textContent = String(reaction.likes || 0);
  els.favoriteCount.textContent = String(reaction.favorites || 0);
  els.amazonLink.href = amazonUrlFor(item);
  fetchCommentsForSpool(item.id);
}

function adjustSelectedAmount(delta) {
  const item = state.inventory.find((entry) => entry.id === state.selectedId);
  if (!item) return;
  item.amount = Math.max(0, Math.round((Number(item.amount) + delta) * 10) / 10);
  saveInventory();
  void syncItemToGoogleSheet(item, "upsert");
  renderAll();
}

function updateSelectedPlacement(nextLocation, nextPosition) {
  const item = state.inventory.find((entry) => entry.id === state.selectedId);
  if (!item) return;
  if (nextLocation) item.location = nextLocation;
  item.position = String(nextPosition || "").trim();
  saveInventory();
  void syncItemToGoogleSheet(item, "upsert");
  renderAll();
}

function updateSelectedSeal(nextSeal) {
  const item = state.inventory.find((entry) => entry.id === state.selectedId);
  if (!item || !nextSeal) return;
  item.sealed = nextSeal;
  saveInventory();
  void syncItemToGoogleSheet(item, "upsert");
  renderAll();
}

function goHome() {
  state.search = "";
  state.activeMaterial = "All";
  state.activeLocation = "All";
  state.activeMode = "All";
  state.activeFamily = "All";
  state.selectedId = null;
  if (els.searchInput) els.searchInput.value = "";
  renderAll();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderAll() {
  const filtered = getFilteredInventory();
  const selected = getSelectedItem(filtered);
  state.selectedId = selected ? selected.id : null;
  syncSelectedTagToUrl(state.selectedId);
  renderPrinterGrid();
  renderMatchGrid();
  renderStatStrip();
  renderFilters();
  renderSuggestions();
  renderFeatured(selected || state.inventory[0]);
  renderInventoryGrid(filtered);
  renderDetails(selected || null);
  if (config.googleSheetWebUrl && els.spreadsheetLink) {
    els.spreadsheetLink.href = config.googleSheetWebUrl;
  }
}

function bindStaticEvents() {
  els.jumpFeatured?.addEventListener("click", () => {
    const item = getSelectedItem(getFilteredInventory());
    if (!item) return;
    state.selectedId = item.id;
    renderAll();
    document.getElementById("detail-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  els.homeButton?.addEventListener("click", goHome);

  els.resetButton?.addEventListener("click", async () => {
    localStorage.removeItem(STORAGE_KEY);
    state.inventory = window.DEFAULT_INVENTORY.map((item) => ({
      ...item,
      reorderThreshold: item.reorderThreshold ?? defaultThresholdFor(item.material),
      colorFamily: item.colorFamily || colorFamilyFor(item.color)
    }));
    await loadInventoryFromGoogleSheet();
    renderAll();
  });

  els.searchInput?.addEventListener("input", (event) => {
    state.search = normalize(event.target.value);
    renderAll();
  });

  els.themeSelect?.addEventListener("change", (event) => {
    applyTheme(event.target.value);
    renderAll();
  });

  document.addEventListener("click", (event) => {
    const filterButton = event.target.closest("[data-filter-type]");
    if (filterButton) {
      const type = filterButton.dataset.filterType;
      const value = filterButton.dataset.value;
      if (type === "material") state.activeMaterial = value;
      if (type === "location") state.activeLocation = value;
      if (type === "mode") state.activeMode = value;
      if (type === "family") state.activeFamily = value;
      renderAll();
      return;
    }

    const card = event.target.closest("[data-id]");
    if (card && card.dataset.id) {
      state.selectedId = card.dataset.id;
      renderAll();
      return;
    }

    const openButton = event.target.closest("[data-open-id]");
    if (openButton && openButton.dataset.openId) {
      state.selectedId = openButton.dataset.openId;
      renderAll();
      document.getElementById("detail-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const suggestion = event.target.closest("[data-suggest-id]");
    if (suggestion && suggestion.dataset.suggestId) {
      state.selectedId = suggestion.dataset.suggestId;
      state.search = "";
      if (els.searchInput) els.searchInput.value = "";
      renderAll();
      document.getElementById("detail-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const printer = event.target.closest("[data-printer-id]");
    if (printer && printer.dataset.printerId) {
      state.currentPrinterId = printer.dataset.printerId;
      renderAll();
      return;
    }

    const quickComment = event.target.closest("[data-quick-comment]");
    if (quickComment && els.commentText) {
      const text = quickComment.dataset.quickComment || "";
      els.commentText.value = els.commentText.value ? `${els.commentText.value} ${text}`.trim() : text;
      els.commentText.focus();
      return;
    }

    if (event.target.closest("[data-open-add-filament='true']")) {
      openAddFilamentModal();
    }
  });

  els.increaseButton?.addEventListener("click", () => adjustSelectedAmount(0.1));
  els.decreaseButton?.addEventListener("click", () => adjustSelectedAmount(-0.1));

  els.thresholdForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const item = state.inventory.find((entry) => entry.id === state.selectedId);
    if (!item) return;
    item.reorderThreshold = Math.max(0, Number(els.thresholdInput.value || defaultThresholdFor(item.material)));
    saveInventory();
    renderAll();
  });

  els.sealForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    updateSelectedSeal(els.sealSelect?.value);
  });

  els.likeButton?.addEventListener("click", () => {
    if (!state.selectedId) return;
    const current = getReactionCounts(state.selectedId);
    state.reactions[state.selectedId] = { ...current, likes: (current.likes || 0) + 1 };
    saveLocalReactions();
    renderAll();
  });

  els.favoriteButton?.addEventListener("click", () => {
    if (!state.selectedId) return;
    const current = getReactionCounts(state.selectedId);
    state.reactions[state.selectedId] = { ...current, favorites: (current.favorites || 0) + 1 };
    saveLocalReactions();
    renderAll();
  });

  els.locationForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    updateSelectedPlacement(els.locationSelect?.value, els.positionInput?.value);
  });

  els.moveToPrinter?.addEventListener("click", () => {
    const printer = printers.find((entry) => entry.id === state.currentPrinterId) || printers[0];
    const printerName = printer?.name || "Printer";
    updateSelectedPlacement(printerName, "Loaded on printer");
  });

  els.moveToShelf?.addEventListener("click", () => {
    const item = state.inventory.find((entry) => entry.id === state.selectedId);
    if (!item) return;
    const shelfChoice = getLocationChoices().find((location) => locationBucketFor(location) === "On shelf" && location !== item.location);
    updateSelectedPlacement(shelfChoice || "Cabinet 1 Misc.", "");
  });

  els.addFilamentButton?.addEventListener("click", openAddFilamentModal);
  els.closeAddFilament?.addEventListener("click", closeAddFilamentModal);

  els.addFilamentForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const newItem = createFilamentFromForm();
    if (!newItem.id) return;
    state.inventory = [newItem, ...state.inventory.filter((item) => item.id !== newItem.id)]
      .sort((a, b) => Number(b.id) - Number(a.id) || b.id.localeCompare(a.id));
    state.selectedId = newItem.id;
    saveInventory();
    void syncItemToGoogleSheet(newItem, "upsert");
    closeAddFilamentModal();
    renderAll();
  });

  els.commentForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!state.selectedId) return;
    const ok = await postComment(state.selectedId, els.commentName.value, els.commentText.value);
    if (!ok) return;
    els.commentName.value = "";
    els.commentText.value = "";
    fetchCommentsForSpool(state.selectedId);
  });
}

async function initializeApp() {
  applyTheme(state.theme);
  await loadInventoryFromGoogleSheet();
  const requestedTag = getRequestedTagFromUrl();
  if (requestedTag && state.inventory.some((item) => item.id === requestedTag)) {
    state.selectedId = requestedTag;
  }
  bindStaticEvents();
  renderAll();
  window.setInterval(async () => {
    const previousSelected = state.selectedId;
    const loaded = await loadInventoryFromGoogleSheet();
    if (loaded && previousSelected) state.selectedId = previousSelected;
    if (loaded) renderAll();
  }, 60000);
}

initializeApp();
