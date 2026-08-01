const STORAGE_KEY = "filament-flow-state-v1";
const LOCAL_COMMENTS_KEY = "filament-flow-comments-v1";
const LOCAL_REACTIONS_KEY = "filament-flow-reactions-v1";
const THEME_KEY = "filament-flow-theme-v1";
const ADMIN_MODE_KEY = "filament-flow-admin-v1";
const TV_MODE_KEY = "filament-flow-tv-v1";
const STATION_MODE_KEY = "filament-flow-station-v1";
const TEAM_HUB_KEY = "filament-flow-team-hub-v1";
const ADMIN_CODE = "31";
const SITE_ACCESS_CODE = "3131";
const TEAM_HQ_DISCORD_ID = "1472090432358973473";

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

const defaultPrinters = [
  { id: "P1S-1", deviceId: "01P00C582602448", deviceMatch: "448", name: "JenksRobotics1", model: "Bambu Lab P1S", account: "user_44942413", wlan: "JPS_Network", ip: "10.113.168.13", sd: "11.3 / 29.1 GB", source: "Screenshot snapshot", ext: "PLA", slots: [ { slot: "A1", filament: "PETG", color: "Black", k: "K 0.020" }, { slot: "A2", filament: "Unknown", color: "Unknown", k: "" }, { slot: "A3", filament: "PLA", color: "White", k: "K 0.020" }, { slot: "A4", filament: "PLA", color: "Black", k: "K 0.020" } ] },
  { id: "P1S-2", deviceId: "01P00C591201911", deviceMatch: "911", name: "JenksRobotics2", model: "Bambu Lab P1S", account: "user_44942413", wlan: "JPS_Network", ip: "10.113.160.45", sd: "9.0 / 29.1 GB", source: "Screenshot snapshot", ext: "TPU", slots: [ { slot: "A1", filament: "PETG", color: "Black", k: "K 0.040" }, { slot: "A2", filament: "Empty", color: "", k: "" }, { slot: "A3", filament: "PETG", color: "Black", k: "K 0.040" }, { slot: "A4", filament: "PETG", color: "Black", k: "K 0.040" } ] }
];
let printers = defaultPrinters.map((printer) => ({ ...printer, slots: printer.slots.map((slot) => ({ ...slot })) }));

const TEAM_REWARD_LADDER = [
  { threshold: 950, title: "Director Clearance", copy: "Front-of-line comp snack access, playlist veto power, and peak bragging rights." },
  { threshold: 900, title: "Gold Badge", copy: "Can claim first shot at the good pit chair and gets a public leaderboard shoutout." },
  { threshold: 840, title: "Trusted Operative", copy: "Eligible for weekly mini-prizes, merch drawings, and preferred mission picks." },
  { threshold: 760, title: "Field Ready", copy: "Solid standing, steady perks, and no one questions handing over real responsibilities." },
  { threshold: 680, title: "Probationary Hero", copy: "Still in the game, but maybe do one nice thing before the cable bin calls." }
];

const TEAM_CONSEQUENCE_LADDER = [
  { max: 620, title: "Cable Dungeon", copy: "Assigned to the cord untangle pile until order is restored." },
  { max: 680, title: "Bumper Bolt Audit", copy: "Counts hardware and wipes tables while the rest of the team advances the plot." },
  { max: 740, title: "Mystery Bin Patrol", copy: "Gets the glamorous job of figuring out what unlabeled parts are supposed to be." }
];

const TEAM_FUTURE_MODULES = [
  { title: "Pit Duty Scheduler", copy: "Rotation locks, cleanup crews, driver station runners, and match prep checklists in one place." },
  { title: "Battery Command", copy: "Track battery health, charge order, and who forgot to plug one in before playoffs." },
  { title: "Tool Checkout", copy: "A fast accountability board for drills, hex sets, crimpers, and the one wrench that always vanishes." },
  { title: "Meeting Missions", copy: "Assign tonight's objectives by subteam and reward the people who actually close the loop." },
  { title: "Travel Locker", copy: "Packing lists, bus rosters, hotel room groups, waiver reminders, and comp departure timing." },
  { title: "Scout Credit Economy", copy: "Give real points for scouting shifts so drive team support feels like a game, not punishment." }
];

const TEAM_ROSTER_SOURCE = [
  { firstName: "Graham", lastName: "Pinnell", room: "324", role: "Student" },
  { firstName: "Braden", lastName: "Cowan", room: "324", role: "Student" },
  { firstName: "Vinny", lastName: "Wilson", room: "324", role: "Student" },
  { firstName: "James", lastName: "Haney", room: "322", role: "Student" },
  { firstName: "Zachary", lastName: "Pursell", room: "322", role: "Student" },
  { firstName: "Hudson", lastName: "Crisp", room: "322", role: "Student" },
  { firstName: "Noah", lastName: "Thompson", room: "320", role: "Student" },
  { firstName: "Jimmy", lastName: "Awtrey", room: "320", role: "Student" },
  { firstName: "Kieran", lastName: "Dye", room: "320", role: "Student" },
  { firstName: "Ethan", lastName: "Guldan", room: "318", role: "Student" },
  { firstName: "Anders", lastName: "Olson", room: "318", role: "Student" },
  { firstName: "Jace", lastName: "Sanders", room: "318", role: "Student" },
  { firstName: "Miles", lastName: "Stackenwalt", room: "306", role: "Student" },
  { firstName: "Jonathan", lastName: "Coone", room: "306", role: "Student" },
  { firstName: "Bryson", lastName: "Koehling", room: "306", role: "Student" },
  { firstName: "Cate", lastName: "Johnson", room: "300", role: "Student" },
  { firstName: "Shari", lastName: "Schenfield", room: "304", role: "Mentor" },
  { firstName: "Mark", lastName: "Schenfield", room: "304", role: "Mentor" },
  { firstName: "Jennifer", lastName: "Chruchill", room: "307", role: "Mentor" },
  { firstName: "Crystal", lastName: "Finch", room: "307", role: "Mentor" },
  { firstName: "Mason", lastName: "Harper", room: "308", role: "Mentor" },
  { firstName: "Triana", lastName: "Harper", room: "308", role: "Mentor" },
  { firstName: "Todd", lastName: "Langley", room: "309", role: "Mentor" },
  { firstName: "Jacob", lastName: "Johnson", room: "309", role: "Mentor" },
  { firstName: "Kevin", lastName: "Poe", room: "312", role: "Mentor" },
  { firstName: "Cheyenne", lastName: "Phillips", room: "312", role: "Mentor" }
];

const TEAM_CODE_ADJECTIVES = ["Midnight", "Maroon", "Iron", "Phantom", "Velvet", "Silent", "Titan", "Crimson", "Neon", "Cipher", "Granite", "Voltage"];
const TEAM_CODE_NOUNS = ["Falcon", "Circuit", "Comet", "Rook", "Viper", "Relay", "Anvil", "Mirage", "Beacon", "Wrench", "Signal", "Atlas"];
const TEAM_STUDENT_TRACKS = ["Mechanical Ops", "Programming", "CAD Intel", "Electrical", "Media Recon", "Drive Crew", "Strategy", "Fabrication"];
const TEAM_MENTOR_TRACKS = ["Mentor Control", "Systems Advisor", "Build Oversight", "Strategy Counsel", "Safety Watch", "Operations Support"];
const TEAM_GOOD_EVENT_TEMPLATES = [
  "Stayed late and helped reset the pit cart.",
  "Answered a rookie question before the panic spread.",
  "Actually labeled a bin and changed the timeline for the better.",
  "Closed a subteam task without needing three reminders.",
  "Bailed out a teammate during a crunch-time scramble.",
  "Showed up ready and made the room more useful instantly."
];
const TEAM_BAD_EVENT_TEMPLATES = [
  "Created a mystery hardware pile and walked away like it was art.",
  "Vanished during cleanup and returned after the interesting part ended.",
  "Started an unnecessary side quest while the main mission burned.",
  "Generated an avoidable tool hunt with strong goblin energy.",
  "Left behind enough chaos to summon a mentor audit.",
  "Accumulated suspicious snack residue near important equipment."
];
const TEAM_LEGEND_EVENT_TEMPLATES = [
  "Saved a match-day disaster with calm hands and questionable sleep.",
  "Kept the build moving when the room drifted toward pure nonsense.",
  "Pulled off a heroic last-minute fix with witnesses present.",
  "Took command of a messy task and somehow made everyone look organized."
];

function slugify(text) {
  return normalize(text).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
function teamHash(text) {
  let hash = 0;
  const input = String(text || "");
  for (let index = 0; index < input.length; index += 1) {
    hash = ((hash << 5) - hash) + input.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}
function clampTeamScore(value) {
  return Math.min(999, Math.max(420, Math.round(Number(value) || 0)));
}
function teamScorePercent(score) {
  return Math.max(0, Math.min(100, Math.round(((clampTeamScore(score) - 420) / 579) * 100)));
}
function formatTeamDelta(delta) {
  const amount = Math.round(Number(delta) || 0);
  return `${amount > 0 ? "+" : ""}${amount}`;
}
function teamBadgeStyle(member) {
  const seed = teamHash(member?.id || member?.name || "");
  const hue = seed % 360;
  const hueB = (hue + 58) % 360;
  return `background: linear-gradient(135deg, hsl(${hue} 76% 66%), hsl(${hueB} 74% 34%));`;
}
function teamInitialsFor(member) {
  return `${String(member?.firstName || "").slice(0, 1)}${String(member?.lastName || "").slice(0, 1)}`.toUpperCase() || "PM";
}
function conductTierForScore(score) {
  const value = clampTeamScore(score);
  if (value >= 930) return { label: "Director clearance", filter: "Elite", tone: "elite", description: "Trusted with the aux, the pit, and the secrets." };
  if (value >= 840) return { label: "Gold clearance", filter: "Elite", tone: "good", description: "Reliable under pressure and clearly dangerous in a useful way." };
  if (value >= 760) return { label: "Field cleared", filter: "Cleared", tone: "steady", description: "Solid standing. Can probably be handed a real task." };
  if (value >= 680) return { label: "Observation tier", filter: "Watch", tone: "warn", description: "Functional, but command would like fewer side quests." };
  return { label: "Watch list", filter: "Critical", tone: "risk", description: "Keep away from mystery bins, power tools, and unsupervised chaos." };
}
function rewardTierForScore(score) {
  return TEAM_REWARD_LADDER.find((entry) => clampTeamScore(score) >= entry.threshold) || {
    threshold: 0,
    title: "Recovery arc",
    copy: "No perks unlocked yet. Time to earn your way out of the cable dungeon storyline."
  };
}
function nextRewardTierForScore(score) {
  return [...TEAM_REWARD_LADDER].reverse().find((entry) => clampTeamScore(score) < entry.threshold) || null;
}
function consequenceTierForScore(score) {
  return TEAM_CONSEQUENCE_LADDER.find((entry) => clampTeamScore(score) <= entry.max) || null;
}
function formatTeamTimestamp(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return date.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
function createTeamEvent(memberId, type, delta, summary, reporter, createdAt) {
  return {
    id: `${memberId}-${Math.abs(teamHash(`${memberId}-${type}-${summary}-${createdAt}`))}`,
    memberId,
    type: String(type || "note"),
    delta: Math.round(Number(delta) || 0),
    summary: String(summary || "").trim(),
    reporter: String(reporter || "Command"),
    createdAt: createdAt || new Date().toISOString()
  };
}
function buildSeededHistory(member, index, score) {
  const seed = teamHash(`${member.id}-${member.room}-${member.role}`);
  const baseTime = Date.parse(`2026-03-${String(31 - (index % 7)).padStart(2, "0")}T1${index % 9}:0${index % 6}:00-05:00`);
  const goodEvent = createTeamEvent(
    member.id,
    "commendation",
    14 + (seed % 19),
    TEAM_GOOD_EVENT_TEMPLATES[seed % TEAM_GOOD_EVENT_TEMPLATES.length],
    member.role === "Mentor" ? "Ops desk" : "Room lead",
    new Date(baseTime).toISOString()
  );
  const badEvent = createTeamEvent(
    member.id,
    "concern",
    -(8 + (seed % 18)),
    TEAM_BAD_EVENT_TEMPLATES[(seed + 2) % TEAM_BAD_EVENT_TEMPLATES.length],
    member.role === "Mentor" ? "Witness statement" : "Shop camera probably",
    new Date(baseTime - 1000 * 60 * 60 * 18).toISOString()
  );
  const events = [goodEvent, badEvent];
  if (score >= 880 || seed % 5 === 0) {
    events.unshift(createTeamEvent(
      member.id,
      "legend",
      26 + (seed % 18),
      TEAM_LEGEND_EVENT_TEMPLATES[(seed + 1) % TEAM_LEGEND_EVENT_TEMPLATES.length],
      "Command board",
      new Date(baseTime + 1000 * 60 * 45).toISOString()
    ));
  }
  return events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}
function normalizeTeamEvent(event, memberId) {
  if (!event || typeof event !== "object") return null;
  const summary = String(event.summary || "").trim();
  if (!summary) return null;
  return {
    id: event.id || `${memberId || event.memberId || "report"}-${Math.abs(teamHash(`${summary}-${event.createdAt || ""}`))}`,
    memberId: event.memberId || memberId || "",
    type: String(event.type || "note"),
    delta: Math.round(Number(event.delta) || 0),
    summary,
    reporter: String(event.reporter || "Command"),
    createdAt: event.createdAt || new Date().toISOString()
  };
}
function normalizeTeamMember(member, fallback = {}) {
  const merged = { ...fallback, ...member };
  const firstName = String(merged.firstName || fallback.firstName || "").trim();
  const lastName = String(merged.lastName || fallback.lastName || "").trim();
  const id = merged.id || fallback.id || slugify(`${firstName}-${lastName}-${merged.room || fallback.room || ""}`);
  const score = clampTeamScore(merged.score ?? fallback.score ?? 720);
  const historySource = Array.isArray(merged.history) ? merged.history : fallback.history;
  return {
    id,
    firstName,
    lastName,
    name: `${firstName} ${lastName}`.trim(),
    room: String(merged.room || fallback.room || "Unknown"),
    role: merged.role === "Mentor" || fallback.role === "Mentor" ? "Mentor" : "Student",
    codename: String(merged.codename || fallback.codename || "Maroon Operative"),
    specialty: String(merged.specialty || fallback.specialty || "General Ops"),
    score,
    streak: Math.max(0, Math.round(Number(merged.streak ?? fallback.streak ?? 0))),
    notes: String(merged.notes || fallback.notes || ""),
    history: Array.isArray(historySource)
      ? historySource.map((event) => normalizeTeamEvent(event, id)).filter(Boolean).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8)
      : []
  };
}
function buildDefaultTeamHubMembers() {
  return TEAM_ROSTER_SOURCE.map((entry, index) => {
    const id = slugify(`${entry.firstName}-${entry.lastName}-${entry.room}`);
    const seed = teamHash(id);
    const scoreBase = entry.role === "Mentor" ? 835 : 690;
    const scoreSpread = entry.role === "Mentor" ? 130 : 230;
    const score = clampTeamScore(scoreBase + (seed % scoreSpread));
    const specialtyPool = entry.role === "Mentor" ? TEAM_MENTOR_TRACKS : TEAM_STUDENT_TRACKS;
    const specialty = specialtyPool[seed % specialtyPool.length];
    const codename = `${TEAM_CODE_ADJECTIVES[index % TEAM_CODE_ADJECTIVES.length]} ${TEAM_CODE_NOUNS[seed % TEAM_CODE_NOUNS.length]}`;
    const history = buildSeededHistory({ ...entry, id }, index, score);
    return normalizeTeamMember({
      ...entry,
      id,
      codename,
      specialty,
      score,
      streak: 1 + (seed % 5),
      notes: "Starter sandbox score. Replace with real receipts whenever you are ready.",
      history
    });
  }).sort((a, b) => b.score - a.score || a.lastName.localeCompare(b.lastName));
}
function createDefaultTeamHubData() {
  const members = buildDefaultTeamHubMembers();
  const reports = members.flatMap((member) => member.history.slice(0, 1)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 12);
  return {
    members,
    reports,
    activeRoom: "All",
    activeConduct: "All",
    selectedAgentId: members[0]?.id || null
  };
}
function loadTeamHubData() {
  const defaults = createDefaultTeamHubData();
  try {
    const saved = JSON.parse(localStorage.getItem(TEAM_HUB_KEY) || "null");
    if (!saved || typeof saved !== "object") return defaults;
    const savedMembers = Array.isArray(saved.members) ? saved.members : [];
    const savedById = new Map(savedMembers.map((member) => [member.id, member]));
    const members = defaults.members.map((member) => normalizeTeamMember(savedById.get(member.id), member));
    const reports = Array.isArray(saved.reports)
      ? saved.reports.map((event) => normalizeTeamEvent(event, event?.memberId)).filter(Boolean).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 40)
      : defaults.reports;
    const selectedAgentId = saved.selectedAgentId && members.some((member) => member.id === saved.selectedAgentId)
      ? saved.selectedAgentId
      : defaults.selectedAgentId;
    return {
      members,
      reports: reports.length ? reports : defaults.reports,
      activeRoom: String(saved.activeRoom || "All"),
      activeConduct: String(saved.activeConduct || "All"),
      selectedAgentId
    };
  } catch {
    return defaults;
  }
}
function sortTeamMembers(members) {
  return [...members].sort((a, b) => b.score - a.score || a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName));
}
function saveTeamHubData() {
  try {
    localStorage.setItem(TEAM_HUB_KEY, JSON.stringify({
      members: state.teamHubMembers,
      reports: state.teamHubReports,
      activeRoom: state.teamHubActiveRoom,
      activeConduct: state.teamHubActiveConduct,
      selectedAgentId: state.selectedAgentId
    }));
  } catch {}
}

function normalize(text) { return String(text || "").trim().toLowerCase(); }
function normalizeDeviceId(value) { return String(value || "").replace(/[^A-Za-z0-9]/g, ""); }
function normalizeTag(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const numeric = Number(raw);
  if (!Number.isFinite(numeric)) return raw;
  return Number.isInteger(numeric) ? String(numeric) : String(numeric);
}
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
function clampAmount(value) { return Math.min(1, Math.max(0, Number(value) || 0)); }
function parseSheetAmount(value) { const clean = normalize(value); if (!clean) return 0; if (clean === "low") return 0.2; if (clean.endsWith("%")) return clampAmount(Number(clean.replace("%", "")) / 100); const parsed = Number(clean); return Number.isFinite(parsed) ? clampAmount(parsed) : 0; }
function loadLocalReactions() { try { return JSON.parse(localStorage.getItem(LOCAL_REACTIONS_KEY) || "{}"); } catch { return {}; } }
function loadBooleanPreference(key) {
  try {
    return localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}
function loadThemePreference() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    return ["light", "dark", "team31"].includes(saved) ? saved : "light";
  } catch {
    return "light";
  }
}
function themeColorFor(theme) {
  if (theme === "dark") return "#111317";
  if (theme === "team31") return "#2f0303";
  return "#ffffff";
}
function applyTheme(theme) {
  const nextTheme = ["light", "dark", "team31"].includes(theme) ? theme : "light";
  document.documentElement.setAttribute("data-theme", nextTheme);
  document.body?.setAttribute("data-theme", nextTheme);
  if (els.themeSelect) els.themeSelect.value = nextTheme;
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.setAttribute("content", themeColorFor(nextTheme));
  try { localStorage.setItem(THEME_KEY, nextTheme); } catch {}
  state.theme = nextTheme;
}
function applyAdminMode(enabled) {
  const next = Boolean(enabled);
  document.documentElement.setAttribute("data-admin-mode", next ? "on" : "off");
  document.body?.setAttribute("data-admin-mode", next ? "on" : "off");
  if (els.adminModeButton) els.adminModeButton.textContent = next ? "Admin unlocked" : "Admin locked";
  try { localStorage.setItem(ADMIN_MODE_KEY, String(next)); } catch {}
  state.adminMode = next;
}
function applyTvMode(enabled) {
  const next = Boolean(enabled);
  document.documentElement.setAttribute("data-tv-mode", next ? "on" : "off");
  document.body?.setAttribute("data-tv-mode", next ? "on" : "off");
  if (els.tvModeButton) els.tvModeButton.textContent = next ? "TV mode on" : "TV mode off";
  if (els.appShell) els.appShell.hidden = next;
  if (els.homeButton) els.homeButton.hidden = next;
  if (els.tvBoard) els.tvBoard.hidden = !next;
  try { localStorage.setItem(TV_MODE_KEY, String(next)); } catch {}
  state.tvMode = next;
}
function applyStationMode(enabled) {
  const next = Boolean(enabled);
  document.documentElement.setAttribute("data-station-mode", next ? "on" : "off");
  document.body?.setAttribute("data-station-mode", next ? "on" : "off");
  if (els.stationModeButton) els.stationModeButton.textContent = next ? "Station mode on" : "Station mode off";
  try { localStorage.setItem(STATION_MODE_KEY, String(next)); } catch {}
  state.stationMode = next;
  if (next) {
    window.setTimeout(() => {
      els.stationScanInput?.focus();
      els.stationScanInput?.select();
    }, 80);
  }
}
function applySiteLock(unlocked) {
  const next = Boolean(unlocked);
  document.documentElement.setAttribute("data-site-locked", next ? "off" : "on");
  document.body?.setAttribute("data-site-locked", next ? "off" : "on");
  if (els.siteLockScreen) {
    els.siteLockScreen.hidden = next;
    els.siteLockScreen.style.display = next ? "none" : "grid";
    els.siteLockScreen.setAttribute("aria-hidden", next ? "true" : "false");
  }
  if (els.siteLockButton) els.siteLockButton.textContent = next ? "Lock site" : "Site locked";
  if (els.siteLockStatus) els.siteLockStatus.textContent = next ? "Unlocked" : "Locked";
  state.siteUnlocked = next;
}

const initialTeamHubState = loadTeamHubData();

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
  theme: loadThemePreference(),
  adminMode: loadBooleanPreference(ADMIN_MODE_KEY),
  tvMode: loadBooleanPreference(TV_MODE_KEY),
  stationMode: loadBooleanPreference(STATION_MODE_KEY),
  siteUnlocked: false,
  bambuSyncStatus: { mode: "fallback", source: "Screenshot snapshot", updatedAt: "", connectedPrinters: 0 },
  scannerActive: false,
  scannerStream: null,
  scannerDetector: null,
  scannerLoopId: 0,
  refreshInFlight: false,
  pendingSheetWrites: {},
  teamHubMembers: initialTeamHubState.members,
  teamHubReports: initialTeamHubState.reports,
  teamHubActiveRoom: initialTeamHubState.activeRoom,
  teamHubActiveConduct: initialTeamHubState.activeConduct,
  selectedAgentId: initialTeamHubState.selectedAgentId
};

const els = {
  appShell: document.querySelector(".app-shell"),
  siteLockScreen: document.getElementById("site-lock-screen"),
  siteLockForm: document.getElementById("site-lock-form"),
  siteLockInput: document.getElementById("site-lock-input"),
  siteLockStatus: document.getElementById("site-lock-status"),
  siteLockButton: document.getElementById("site-lock-button"),
  stationModeButton: document.getElementById("station-mode-button"),
  statStrip: document.getElementById("stat-strip"),
  lowStockGrid: document.getElementById("low-stock-grid"),
  printerLoadGrid: document.getElementById("printer-load-grid"),
  reorderQueueGrid: document.getElementById("reorder-queue-grid"),
  returnPromptGrid: document.getElementById("return-prompt-grid"),
  tvLowStockGrid: document.getElementById("tv-low-stock-grid"),
  tvPrinterGrid: document.getElementById("tv-printer-grid"),
  tvMatchGrid: document.getElementById("tv-match-grid"),
  tvBoard: document.getElementById("tv-board"),
  tvExitButton: document.getElementById("tv-exit-button"),
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
  bambuSyncTitle: document.getElementById("bambu-sync-title"),
  bambuSyncCopy: document.getElementById("bambu-sync-copy"),
  bambuSyncMeta: document.getElementById("bambu-sync-meta"),
  themeSelect: document.getElementById("theme-select"),
  adminModeButton: document.getElementById("admin-mode-button"),
  tvModeButton: document.getElementById("tv-mode-button"),
  startScanButton: document.getElementById("start-scan-button"),
  stationScanInput: document.getElementById("station-scan-input"),
  focusScanInputButton: document.getElementById("focus-scan-input-button"),
  stationScanStatus: document.getElementById("station-scan-status"),
  stationActionsPanel: document.getElementById("station-actions-panel"),
  stationSelectedSummary: document.getElementById("station-selected-summary"),
  printerShortcutGrid: document.getElementById("printer-shortcut-grid"),
  scanUploadInput: document.getElementById("scan-upload-input"),
  scanStatus: document.getElementById("scan-status"),
  scannerFrame: document.getElementById("scanner-frame"),
  scannerVideo: document.getElementById("scanner-video"),
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
  qrPreview: document.getElementById("qr-preview"),
  qrTagCopy: document.getElementById("qr-tag-copy"),
  qrLinkCopy: document.getElementById("qr-link-copy"),
  copySpoolLinkButton: document.getElementById("copy-spool-link-button"),
  downloadQrButton: document.getElementById("download-qr-button"),
  qrDownloadLink: document.getElementById("qr-download-link"),
  deleteFilamentButton: document.getElementById("delete-filament-button"),
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
  newPosition: document.getElementById("new-position"),
  copyDiscordIdButton: document.getElementById("copy-discord-id-button"),
  teamHqCopy: document.getElementById("team-hq-copy"),
  teamKpiGrid: document.getElementById("team-kpi-grid"),
  teamRoomFilters: document.getElementById("team-room-filters"),
  teamConductFilters: document.getElementById("team-conduct-filters"),
  teamLeaderboardCopy: document.getElementById("team-leaderboard-copy"),
  teamLeaderboard: document.getElementById("team-leaderboard"),
  teamRoomGrid: document.getElementById("team-room-grid"),
  teamGridCopy: document.getElementById("team-grid-copy"),
  teamMemberGrid: document.getElementById("team-member-grid"),
  teamSelectedBadge: document.getElementById("team-selected-badge"),
  teamSelectedName: document.getElementById("team-selected-name"),
  teamSelectedCodename: document.getElementById("team-selected-codename"),
  teamSelectedScore: document.getElementById("team-selected-score"),
  teamSelectedClearance: document.getElementById("team-selected-clearance"),
  teamSelectedMeter: document.getElementById("team-selected-meter"),
  teamSelectedStatus: document.getElementById("team-selected-status"),
  teamSelectedTags: document.getElementById("team-selected-tags"),
  teamHistoryList: document.getElementById("team-history-list"),
  teamIncentiveBoard: document.getElementById("team-incentive-board"),
  teamReportForm: document.getElementById("team-report-form"),
  teamReportTarget: document.getElementById("team-report-target"),
  teamReportReporter: document.getElementById("team-report-reporter"),
  teamReportType: document.getElementById("team-report-type"),
  teamReportDelta: document.getElementById("team-report-delta"),
  teamReportSummary: document.getElementById("team-report-summary"),
  teamReportStatus: document.getElementById("team-report-status"),
  teamReportFeed: document.getElementById("team-report-feed"),
  teamRewardGrid: document.getElementById("team-reward-grid"),
  teamModuleGrid: document.getElementById("team-module-grid")
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
  const seenTags = new Set();
  return lines.slice(1).map((line) => parseCsvLine(line)).filter((row) => row[tagIndex]).map((row) => ({
    id: normalizeTag(row[tagIndex] || ""),
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
  })).filter((item) => {
    if (!item.id || seenTags.has(item.id)) return false;
    seenTags.add(item.id);
    return true;
  });
}

function getSheetRowValue(row, keys, fallback = "") {
  if (!row || typeof row !== "object") return fallback;
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(row, key) && row[key] != null && String(row[key]).trim() !== "") {
      return row[key];
    }
  }
  const normalizedEntries = Object.entries(row).map(([key, value]) => [normalize(key), value]);
  for (const key of keys) {
    const match = normalizedEntries.find(([normalizedKey, value]) => normalizedKey === normalize(key) && value != null && String(value).trim() !== "");
    if (match) return match[1];
  }
  return fallback;
}

function buildInventoryFromSheetRows(rows) {
  const seenTags = new Set();
  return rows.map((row) => ({
    id: normalizeTag(getSheetRowValue(row, ["tag", "Asset tag"], "")),
    material: String(getSheetRowValue(row, ["filamentType", "Filament type"], "Unknown")).toUpperCase(),
    finish: getSheetRowValue(row, ["specifics", "Specifics (if neccessary)"], "Unknown"),
    brand: getSheetRowValue(row, ["brand", "Brand"], "Unknown"),
    sealed: normalizeSealStatus(getSheetRowValue(row, ["sealed", "Sealed"], "Unknown")),
    location: getSheetRowValue(row, ["location", "Location", "Location "], "Unknown"),
    amount: parseSheetAmount(getSheetRowValue(row, ["amountRemaining", "Amount remaining (approximate)"], 0)),
    reorderThreshold: defaultThresholdFor(getSheetRowValue(row, ["filamentType", "Filament type"], "Unknown")),
    restock: getSheetRowValue(row, ["orderAgain", "Order again"], "Unknown"),
    notes: getSheetRowValue(row, ["comments", "Comments"], ""),
    color: getSheetRowValue(row, ["color", "Color"], "Unknown"),
    colorFamily: colorFamilyFor(getSheetRowValue(row, ["color", "Color"], "Unknown")),
    position: ""
  })).filter((item) => {
    if (!item.id || seenTags.has(item.id)) return false;
    seenTags.add(item.id);
    return true;
  });
}

function loadInventory() {
  const defaults = Array.isArray(window.DEFAULT_INVENTORY) ? window.DEFAULT_INVENTORY : [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) throw new Error("no saved");
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) throw new Error("bad saved");
    const mergedDefaults = defaults.map((item) => {
      const normalizedId = normalizeTag(item.id);
      const match = parsed.find((savedItem) => normalizeTag(savedItem.id) === normalizedId);
      const merged = match ? { ...item, ...match, id: normalizedId } : { ...item, id: normalizedId };
      return { ...merged, reorderThreshold: merged.reorderThreshold ?? defaultThresholdFor(merged.material), colorFamily: merged.colorFamily || colorFamilyFor(merged.color), position: merged.position || "" };
    });
    const extraSaved = parsed
      .filter((savedItem) => !mergedDefaults.some((item) => normalizeTag(item.id) === normalizeTag(savedItem.id)))
      .map((item) => ({
        ...item,
        id: normalizeTag(item.id),
        reorderThreshold: item.reorderThreshold ?? defaultThresholdFor(item.material),
        colorFamily: item.colorFamily || colorFamilyFor(item.color),
        position: item.position || ""
      }));
    return [...mergedDefaults, ...extraSaved].sort((a, b) => Number(b.id) - Number(a.id) || String(b.id).localeCompare(String(a.id)));
  } catch {
    return defaults.map((item) => ({ ...item, id: normalizeTag(item.id), reorderThreshold: item.reorderThreshold ?? defaultThresholdFor(item.material), colorFamily: item.colorFamily || colorFamilyFor(item.color), position: item.position || "" }));
  }
}

function saveInventory() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.inventory)); } catch {} }
function loadLocalComments() { try { return JSON.parse(localStorage.getItem(LOCAL_COMMENTS_KEY) || "[]"); } catch { return []; } }
function saveLocalComments(comments) { try { localStorage.setItem(LOCAL_COMMENTS_KEY, JSON.stringify(comments)); } catch {} }
function saveLocalReactions() { try { localStorage.setItem(LOCAL_REACTIONS_KEY, JSON.stringify(state.reactions)); } catch {} }
function registerPendingSheetWrite(item) {
  if (!item?.id) return;
  state.pendingSheetWrites[item.id] = {
    startedAt: Date.now(),
    snapshot: {
      amount: clampAmount(item.amount),
      sealed: normalizeSealStatus(item.sealed),
      location: item.location || "",
      restock: item.restock || "Unknown",
      notes: item.notes || "",
      color: item.color || "",
      material: item.material || "",
      finish: item.finish || "",
      brand: item.brand || ""
    }
  };
}
function clearPendingSheetWrite(id) {
  if (!id) return;
  delete state.pendingSheetWrites[id];
}
function getPendingSheetWrite(id) {
  const pending = state.pendingSheetWrites[id];
  if (!pending) return null;
  if (Date.now() - Number(pending.startedAt || 0) > 15000) {
    clearPendingSheetWrite(id);
    return null;
  }
  return pending;
}
function sheetItemMatchesPending(sheetItem, pendingSnapshot) {
  if (!sheetItem || !pendingSnapshot) return false;
  return clampAmount(sheetItem.amount) === clampAmount(pendingSnapshot.amount)
    && normalizeSealStatus(sheetItem.sealed) === normalizeSealStatus(pendingSnapshot.sealed)
    && String(sheetItem.location || "") === String(pendingSnapshot.location || "")
    && String(sheetItem.restock || "Unknown") === String(pendingSnapshot.restock || "Unknown")
    && String(sheetItem.notes || "") === String(pendingSnapshot.notes || "");
}
function mergeInventoryWithSaved(sheetInventory) {
  if (!Array.isArray(sheetInventory) || !sheetInventory.length) return false;
  const saved = loadInventory();
  const merged = sheetInventory.map((item) => {
    const match = saved.find((savedItem) => normalizeTag(savedItem.id) === normalizeTag(item.id));
    const pending = getPendingSheetWrite(item.id);
    const baseItem = match
      ? {
          ...item,
          reorderThreshold: match.reorderThreshold ?? item.reorderThreshold,
          position: match.position || item.position || ""
        }
      : item;
    if (!pending) return baseItem;
    if (sheetItemMatchesPending(baseItem, pending.snapshot)) {
      clearPendingSheetWrite(item.id);
      return baseItem;
    }
    return {
      ...baseItem,
      amount: pending.snapshot.amount,
      sealed: pending.snapshot.sealed,
      location: pending.snapshot.location,
      restock: pending.snapshot.restock,
      notes: pending.snapshot.notes,
      color: pending.snapshot.color,
      material: pending.snapshot.material,
      finish: pending.snapshot.finish,
      brand: pending.snapshot.brand
    };
  });
  state.inventory = merged;
  saveInventory();
  return true;
}

async function loadInventoryFromGoogleSheet() {
  if (!config.googleSheetCsvUrl && !config.googleSheetAppsScriptUrl) return false;
  try {
    if (config.googleSheetAppsScriptUrl) {
      const scriptRows = await fetchSheetRowsFromAppsScript();
      if (scriptRows?.length) {
        const sheetInventory = buildInventoryFromSheetRows(scriptRows);
        if (mergeInventoryWithSaved(sheetInventory)) {
          state.dataSourceLabel = "Google Sheet live";
          return true;
        }
      }
    }
    const sheetUrl = new URL(config.googleSheetCsvUrl);
    sheetUrl.searchParams.set("_ts", String(Date.now()));
    const response = await fetch(sheetUrl.toString(), { cache: "no-store" });
    if (!response.ok) return false;
    const csvText = await response.text();
    const sheetInventory = buildInventoryFromSheetCsv(csvText);
    if (!sheetInventory.length) return false;
    if (!mergeInventoryWithSaved(sheetInventory)) return false;
    state.dataSourceLabel = "Google Sheet live";
    return true;
  } catch {
    return false;
  }
}

async function fetchSheetRowsFromAppsScript(sheetName = null) {
  if (!config.googleSheetAppsScriptUrl) return null;
  try {
    const readUrl = new URL(config.googleSheetAppsScriptUrl);
    readUrl.searchParams.set("action", "read");
    readUrl.searchParams.set("sheetName", sheetName || config.googleSheetName || "Sheet1");
    readUrl.searchParams.set("_ts", String(Date.now()));
    const scriptResponse = await fetch(readUrl.toString(), { cache: "no-store" });
    if (!scriptResponse.ok) return null;
    const scriptData = await scriptResponse.json();
    if (!scriptData?.ok || !Array.isArray(scriptData.rows)) return null;
    return scriptData.rows;
  } catch {
    return null;
  }
}

function amountForSheet(value) {
  const amount = clampAmount(value);
  if (amount < 0.3) return "low";
  return `${Math.round(amount * 100)}%`;
}

function buildSheetPayload(item) {
  return {
        tag: normalizeTag(item.id),
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

async function sendSheetUpsertRequest(item, mode = "upsert") {
  if (!config.googleSheetAppsScriptUrl || !item?.id) return false;
  const sheetPayload = buildSheetPayload(item);
  try {
    const url = new URL(config.googleSheetAppsScriptUrl);
    url.searchParams.set("action", mode);
    url.searchParams.set("secret", config.googleSheetSharedSecret || "");
    url.searchParams.set("sheetName", config.googleSheetName || "Sheet1");
    if (mode === "delete") {
      url.searchParams.set("tag", String(sheetPayload.tag ?? ""));
    } else {
      Object.entries(sheetPayload).forEach(([key, value]) => {
        url.searchParams.set(key, String(value ?? ""));
      });
    }
    const response = await fetch(url.toString(), { cache: "no-store" });
    if (response.ok) {
      const payload = await response.json().catch(() => null);
      if (payload?.ok) return true;
    }
  } catch {}

  try {
    const response = await fetch(config.googleSheetAppsScriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: mode,
        secret: config.googleSheetSharedSecret || "",
        sheetName: config.googleSheetName || "Sheet1",
        item: { tag: sheetPayload.tag, ...(mode === "delete" ? {} : sheetPayload) }
      })
    });
    if (!response.ok) return false;
    const payload = await response.json().catch(() => null);
    return Boolean(payload?.ok);
  } catch {
    return false;
  }
}

async function verifySheetWrite(item, attempts = 4) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (attempt > 0) {
      await new Promise((resolve) => window.setTimeout(resolve, 1200));
    }
    const rows = await fetchSheetRowsFromAppsScript();
    if (!rows?.length) continue;
    const sheetItem = buildInventoryFromSheetRows(rows).find((entry) => normalizeTag(entry.id) === normalizeTag(item.id));
    if (!sheetItem) continue;
    if (
      clampAmount(sheetItem.amount) === clampAmount(item.amount)
      && normalizeSealStatus(sheetItem.sealed) === normalizeSealStatus(item.sealed)
      && String(sheetItem.location || "") === String(item.location || "")
      && String(sheetItem.restock || "Unknown") === String(item.restock || "Unknown")
      && String(sheetItem.notes || "") === String(item.notes || "")
    ) {
      return true;
    }
  }
  return false;
}
async function verifySheetDelete(itemId, attempts = 4) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (attempt > 0) {
      await new Promise((resolve) => window.setTimeout(resolve, 1200));
    }
    const rows = await fetchSheetRowsFromAppsScript();
    if (!rows?.length) continue;
    const exists = buildInventoryFromSheetRows(rows).some((entry) => normalizeTag(entry.id) === normalizeTag(itemId));
    if (!exists) return true;
  }
  return false;
}
  
async function syncItemToGoogleSheet(item, mode = "upsert") {
  if (!config.googleSheetAppsScriptUrl || !item?.id) return false;
  const wrote = await sendSheetUpsertRequest(item, mode);
  if (!wrote) return false;
  if (mode === "delete") return verifySheetDelete(item.id);
  return verifySheetWrite(item);
}
  
async function syncItemAndRefresh(item, mode = "upsert") {
  registerPendingSheetWrite(item);
  const synced = await syncItemToGoogleSheet(item, mode);
  if (!synced) {
    clearPendingSheetWrite(item?.id);
    await loadInventoryFromGoogleSheet();
    renderAll();
    return false;
  }
  const previousSelected = state.selectedId;
  await new Promise((resolve) => window.setTimeout(resolve, 1200));
  const loaded = await loadInventoryFromGoogleSheet();
  if (loaded && previousSelected) state.selectedId = previousSelected;
  renderAll();
  return true;
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
function firstLoadedSlot(printer) {
  return printer.slots.find((slot) => slot.filament && slot.filament !== "Empty") || null;
}
function bestInventoryMatchForPrinterSlot(slot) {
  if (!slot || !slot.filament || slot.filament === "Empty") return null;
  return state.inventory
    .filter((item) => normalize(item.material) === normalize(slot.filament) && (!slot.color || normalize(slot.color) === "unknown" || normalize(item.color) === normalize(slot.color)))
    .sort((a, b) => b.amount - a.amount || Number(b.id) - Number(a.id))[0] || null;
}
function getLowestStockItems() {
  return [...state.inventory]
    .filter((item) => item.amount < 0.3)
    .sort((a, b) => a.amount - b.amount || Number(a.id) - Number(b.id))
    .slice(0, 4);
}
function getReorderQueueItems() {
  return [...state.inventory]
    .filter((item) => isBelowThreshold(item))
    .sort((a, b) => a.amount - b.amount || Number(a.id) - Number(b.id))
    .slice(0, 8);
}
function getPrinterLoadedInventory() {
  return state.inventory.filter((item) => locationBucketFor(item.location) === "In printer");
}
function updateStationStatus(message) {
  if (els.stationScanStatus) els.stationScanStatus.textContent = message;
}
function getSelectedStationItem() {
  return state.inventory.find((entry) => entry.id === state.selectedId) || null;
}
function setItemAmount(item, nextAmount) {
  if (!item) return;
  item.amount = clampAmount(nextAmount);
  saveInventory();
  void syncItemAndRefresh(item, "upsert");
  renderAll();
}
function setItemPlacement(item, nextLocation, nextPosition = "") {
  if (!item) return;
  item.location = nextLocation || item.location;
  item.position = String(nextPosition || "").trim();
  saveInventory();
  void syncItemAndRefresh(item, "upsert");
  renderAll();
}
function openAddFilamentForScannedTag(tag) {
  if (!state.adminMode) {
    updateStationStatus(`Tag ${tag} is not in the tracker yet. Turn on admin mode to create it quickly.`);
    return;
  }
  openAddFilamentModal();
  if (els.newTag) els.newTag.value = tag;
  if (els.newLocation) els.newLocation.value = "Cabinet 1 Misc.";
  if (els.newPosition) els.newPosition.value = "";
  updateStationStatus(`Tag ${tag} was not found. Fill in the new filament form.`);
}
function handleStationScan(rawValue) {
  const tag = parseScannedTag(rawValue);
  if (!tag) {
    updateStationStatus("No filament tag was found in that scan.");
    return false;
  }
  const found = selectSpoolByTag(tag);
  if (found) {
    updateStationStatus(`Opened spool tag ${tag}. Choose a quick action below.`);
    return true;
  }
  openAddFilamentForScannedTag(tag);
  return false;
}
function renderStationActions() {
  if (!els.stationActionsPanel || !els.stationSelectedSummary || !els.printerShortcutGrid) return;
  const item = getSelectedStationItem();
  if (!item) {
    els.stationSelectedSummary.textContent = "Choose or scan a spool";
    els.printerShortcutGrid.innerHTML = "";
    return;
  }
  els.stationSelectedSummary.textContent = `Tag ${item.id} • ${item.color} ${item.material}`;
  els.printerShortcutGrid.innerHTML = printers.map((printer) => {
    const slotButtons = ["A1", "A2", "A3", "A4", "Ext"].map((slot) => {
      const label = slot === "Ext" ? `${printer.name} Ext` : `${printer.name} ${slot}`;
      return `<button class="filter-pill" type="button" data-station-assign="${printer.id}|${slot}">${label}</button>`;
    }).join("");
    return `<div class="station-printer-group"><strong>${printer.name}</strong><div class="quick-action-grid">${slotButtons}</div></div>`;
  }).join("");
}
function applyStationAction(action) {
  const item = getSelectedStationItem();
  if (!item) {
    updateStationStatus("Scan or choose a spool first.");
    return;
  }
  if (action === "used-some") {
    setItemAmount(item, Math.round((item.amount - 0.1) * 10) / 10);
    updateStationStatus(`Marked tag ${item.id} as used some.`);
    return;
  }
  if (action === "used-lot") {
    setItemAmount(item, Math.round((item.amount - 0.3) * 10) / 10);
    updateStationStatus(`Marked tag ${item.id} as used a lot.`);
    return;
  }
  if (action === "mark-low") {
    setItemAmount(item, 0.2);
    updateStationStatus(`Marked tag ${item.id} as low.`);
    return;
  }
  if (action === "mark-empty") {
    setItemAmount(item, 0);
    updateStationStatus(`Marked tag ${item.id} as empty.`);
    return;
  }
  if (action === "return-shelf") {
    const shelfChoice = getLocationChoices().find((location) => locationBucketFor(location) === "On shelf" && location !== item.location) || "Cabinet 1 Misc.";
    setItemPlacement(item, shelfChoice, "");
    updateStationStatus(`Returned tag ${item.id} to shelf.`);
  }
}
function assignSelectedToPrinterSlot(printerId, slot) {
  const item = getSelectedStationItem();
  if (!item) {
    updateStationStatus("Scan or choose a spool first.");
    return;
  }
  const printer = printers.find((entry) => entry.id === printerId);
  if (!printer) return;
  if (slot === "Ext") {
    setItemPlacement(item, printer.name, "External spool");
    updateStationStatus(`Loaded tag ${item.id} onto ${printer.name} external spool.`);
    return;
  }
  setItemPlacement(item, printer.name, `AMS ${slot}`);
  updateStationStatus(`Loaded tag ${item.id} onto ${printer.name} ${slot}.`);
}
function parseScannedTag(rawValue) {
  const raw = String(rawValue || "").trim();
  if (!raw) return "";
  try {
    const url = new URL(raw);
    const tag = url.searchParams.get("tag");
    if (tag) return normalizeTag(tag);
  } catch {}
  const tagMatch = raw.match(/(?:tag=|tag\s*)(\d+(?:\.\d+)?)/i);
  if (tagMatch) return normalizeTag(tagMatch[1]);
  const numberMatch = raw.match(/\d+(?:\.\d+)?/);
  return numberMatch ? normalizeTag(numberMatch[0]) : "";
}
function selectSpoolByTag(tag) {
  const normalizedTag = normalizeTag(tag);
  if (!normalizedTag) return false;
  const item = state.inventory.find((entry) => normalizeTag(entry.id) === normalizedTag);
  if (!item) return false;
  state.selectedId = item.id;
  renderAll();
  focusDetailPanelIfStacked();
  return true;
}
function updateScanStatus(message) {
  if (els.scanStatus) els.scanStatus.textContent = message;
}
function stopQrScanner() {
  if (state.scannerLoopId) {
    window.cancelAnimationFrame(state.scannerLoopId);
    state.scannerLoopId = 0;
  }
  if (state.scannerStream) {
    state.scannerStream.getTracks().forEach((track) => track.stop());
    state.scannerStream = null;
  }
  if (els.scannerVideo) {
    els.scannerVideo.pause();
    els.scannerVideo.srcObject = null;
  }
  if (els.scannerFrame) els.scannerFrame.hidden = true;
  state.scannerActive = false;
  if (els.startScanButton) els.startScanButton.textContent = "Start camera scanner";
}
function focusDetailPanelIfStacked() {
  if (window.innerWidth > 1100) return;
  const detailPanel = document.getElementById("detail-panel");
  if (!detailPanel) return;
  window.setTimeout(() => {
    detailPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 60);
}
async function handleScannedValue(rawValue) {
  const tag = parseScannedTag(rawValue);
  if (!tag) {
    updateScanStatus("QR scanned, but no spool tag was found in it.");
    return false;
  }
  const ok = selectSpoolByTag(tag);
  updateScanStatus(ok ? `Opened spool tag ${tag}.` : `Scanned tag ${tag}, but it is not in the tracker yet.`);
  if (ok) stopQrScanner();
  return ok;
}
async function scanFrameLoop() {
  if (!state.scannerActive || !state.scannerDetector || !els.scannerVideo) return;
  try {
    const detections = await state.scannerDetector.detect(els.scannerVideo);
    if (detections?.length) {
      const rawValue = detections[0].rawValue || "";
      if (rawValue) {
        await handleScannedValue(rawValue);
        return;
      }
    }
  } catch {}
  state.scannerLoopId = window.requestAnimationFrame(() => { void scanFrameLoop(); });
}
async function startQrScanner() {
  if (state.scannerActive) {
    stopQrScanner();
    updateScanStatus("Camera scanner stopped.");
    return;
  }
  if (!("BarcodeDetector" in window)) {
    if (els.scanUploadInput) {
      updateScanStatus("This browser will use the phone camera upload flow instead of live QR detection.");
      els.scanUploadInput.click();
    } else {
      updateScanStatus("This browser does not support live camera QR scanning. Use Scan from image instead.");
    }
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    updateScanStatus("This browser cannot open a live camera stream here. Use Scan from image instead.");
    return;
  }
  try {
    state.scannerDetector = new window.BarcodeDetector({ formats: ["qr_code"] });
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
    state.scannerStream = stream;
    state.scannerActive = true;
    if (els.scannerVideo) {
      els.scannerVideo.srcObject = stream;
      await els.scannerVideo.play();
    }
    if (els.scannerFrame) els.scannerFrame.hidden = false;
    if (els.startScanButton) els.startScanButton.textContent = "Stop camera scanner";
    updateScanStatus("Camera is live. Point it at a spool QR code.");
    void scanFrameLoop();
  } catch {
    stopQrScanner();
    updateScanStatus("Camera access was blocked or unavailable. Try Scan from image instead.");
  }
}
async function scanQrFromImage(file) {
  if (!file) return;
  if (!("BarcodeDetector" in window)) {
    updateScanStatus("This browser can open the camera, but it cannot decode QR images automatically here. Use the normal camera app if this phone does not scan from the picker.");
    return;
  }
  try {
    const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
    const bitmap = await createImageBitmap(file);
    const detections = await detector.detect(bitmap);
    if (!detections?.length) {
      updateScanStatus("No QR code was found in that image.");
      return;
    }
    await handleScannedValue(detections[0].rawValue || "");
  } catch {
    updateScanStatus("That image could not be scanned.");
  }
}
function titleCase(text) { return String(text || "").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()); }
function colorNameFromHex(hex) {
  const key = normalize(String(hex || "").replace("#", ""));
  if (!key) return "";
  if (key.startsWith("161616") || key.startsWith("000000")) return "Black";
  if (key.startsWith("ffffff")) return "White";
  if (key.startsWith("ff0000")) return "Red";
  if (key.startsWith("00ff00")) return "Green";
  if (key.startsWith("0000ff")) return "Blue";
  return titleCase(key);
}
function createPrinterClone(printer) {
  return { ...printer, slots: printer.slots.map((slot) => ({ ...slot })) };
}
function getPrinterMatch(deviceId) {
  const normalized = normalizeDeviceId(deviceId);
  return printers.find((printer) => normalized && (normalizeDeviceId(printer.deviceId) === normalized || normalized.endsWith(printer.deviceMatch) || normalizeDeviceId(printer.deviceId).endsWith(normalized.slice(-3))));
}
function applyBambuSnapshot(snapshot) {
  printers = defaultPrinters.map((printer) => createPrinterClone(printer));
  const printerSnapshots = Array.isArray(snapshot?.printers) ? snapshot.printers : [];
  let connectedPrinters = 0;
  printerSnapshots.forEach((entry) => {
    const printer = getPrinterMatch(entry.deviceId);
    if (!printer) return;
    connectedPrinters += 1;
    printer.source = "Bambu Studio local log";
    printer.lastSyncedAt = entry.capturedAt || snapshot.generatedAt || "";
    const slotsById = new Map((entry.amsSlots || []).map((slot) => [slot.slotId, slot]));
    printer.slots = ["A1", "A2", "A3", "A4"].map((slotId) => {
      const slot = slotsById.get(slotId);
      if (!slot || slot.status === "empty") return { slot: slotId, filament: "Empty", color: "", k: "" };
      return {
        slot: slotId,
        filament: slot.materialType || "Unknown",
        color: colorNameFromHex(slot.colorHex) || "Unknown",
        k: slot.materialCode || ""
      };
    });
    printer.ext = entry.externalSpool?.materialType || "Empty";
  });
  state.bambuSyncStatus = connectedPrinters
    ? { mode: "live", source: snapshot.sourceLog || snapshot.source || config.bambuSnapshotUrl || "bambu_snapshot.json", updatedAt: snapshot.generatedAt || "", connectedPrinters }
    : { mode: "fallback", source: "Screenshot snapshot", updatedAt: "", connectedPrinters: 0 };
}

function buildBambuSnapshotFromSheetRows(rows) {
  if (!Array.isArray(rows) || !rows.length) return null;
  const grouped = new Map();
  rows.forEach((row) => {
    const deviceId = String(row.DeviceId || row.deviceId || "").trim();
    if (!deviceId) return;
    if (!grouped.has(deviceId)) {
      grouped.set(deviceId, {
        deviceId,
        capturedAt: String(row.CapturedAt || row.capturedAt || "").trim(),
        amsSlots: [],
        externalSpool: null
      });
    }
    const printer = grouped.get(deviceId);
    const slotId = String(row.Slot || row.slotId || "").trim();
    const status = String(row.Status || row.status || "").trim().toLowerCase() || "empty";
    const slot = {
      slotId,
      status,
      materialType: String(row.MaterialType || row.materialType || "").trim(),
      materialCode: String(row.MaterialCode || row.materialCode || "").trim(),
      colorHex: String(row.ColorHex || row.colorHex || "").trim()
    };
    if (!printer.capturedAt && (row.CapturedAt || row.capturedAt)) {
      printer.capturedAt = String(row.CapturedAt || row.capturedAt || "").trim();
    }
    if (slotId === "Ext") {
      printer.externalSpool = slot;
    } else if (slotId) {
      printer.amsSlots.push(slot);
    }
  });

  const printersFromSheet = [...grouped.values()];
  if (!printersFromSheet.length) return null;
  return {
    source: `Google Sheet ${config.bambuSheetName || "BambuLive"}`,
    generatedAt: new Date().toISOString(),
    printers: printersFromSheet
  };
}

async function loadBambuSnapshotFromSheet() {
  if (!config.googleSheetAppsScriptUrl || !config.bambuSheetName) return false;
  try {
    const rows = await fetchSheetRowsFromAppsScript(config.bambuSheetName);
    const snapshot = buildBambuSnapshotFromSheetRows(rows);
    if (!snapshot) return false;
    applyBambuSnapshot(snapshot);
    return state.bambuSyncStatus.mode === "live";
  } catch {
    return false;
  }
}

async function loadBambuSnapshot() {
  if (await loadBambuSnapshotFromSheet()) {
    return true;
  }
  if (!config.bambuSnapshotUrl) {
    printers = defaultPrinters.map((printer) => createPrinterClone(printer));
    state.bambuSyncStatus = { mode: "fallback", source: "Screenshot snapshot", updatedAt: "", connectedPrinters: 0 };
    return false;
  }
  try {
    const url = new URL(config.bambuSnapshotUrl, window.location.href);
    url.searchParams.set("_ts", String(Date.now()));
    const response = await fetch(url.toString(), { cache: "no-store" });
    if (!response.ok) throw new Error("snapshot missing");
    const data = await response.json();
    applyBambuSnapshot(data);
    return state.bambuSyncStatus.mode === "live";
  } catch {
    printers = defaultPrinters.map((printer) => createPrinterClone(printer));
    state.bambuSyncStatus = { mode: "fallback", source: "Screenshot snapshot", updatedAt: "", connectedPrinters: 0 };
    return false;
  }
}

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
    return `<article class="printer-card ${printer.id === state.currentPrinterId ? "active-printer" : ""}" data-printer-id="${printer.id}"><p class="eyebrow">${printer.model}</p><h3>${printer.name}</h3><p class="printer-meta">${loaded}/4 AMS slots loaded / Ext: ${printer.ext}</p><p class="printer-meta">IP ${printer.ip} / WLAN ${printer.wlan}</p><p class="printer-meta">Account ${printer.account} / SD ${printer.sd}</p><p class="printer-meta">Source ${printer.source}</p><div class="slot-grid">${printer.slots.map((entry) => `<div class="slot-chip"><strong>${entry.slot}</strong><small>${entry.filament === "Empty" ? "Empty" : `${entry.color} ${entry.filament}`}</small><small>${entry.k || ""}</small></div>`).join("")}</div></article>`;
  }).join("");
}

function renderMatchGrid() {
  if (!els.matchGrid) return;
  const printer = printers.find((entry) => entry.id === state.currentPrinterId) || printers[0];
  const targetMaterials = new Set([printer.ext, ...printer.slots.map((slot) => slot.filament)].map(normalize));
  const matches = state.inventory.filter((item) => targetMaterials.has(normalize(item.material)) && item.amount >= 0.5).sort((a, b) => b.amount - a.amount || Number(b.id) - Number(a.id)).slice(0, 3);
  els.matchGrid.innerHTML = matches.length
    ? matches.map((item) => `<button class="match-card" type="button" data-match-id="${item.id}"><div class="match-card-head"><span class="brand-logo">${brandLogoFor(item.brand)}</span><h3 class="filament-name" style="${nameStyleFor(item.color)}">${item.color} ${item.material}</h3></div><p class="inventory-subline">${item.brand} / ${item.finish} / ${formatAmountSummary(item.amount)}</p></button>`).join("")
    : `<article class="match-card"><p class="inventory-subline">No strong matches for ${printer.name} right now.</p></article>`;
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
  if (!els.statStrip) return;
  const total = state.inventory.length;
  els.statStrip.innerHTML = `<article class="stat-card"><span>Total spools</span><strong>${total}</strong></article>`;
}

function renderFilters() {
  if (els.materialFilters) els.materialFilters.innerHTML = getMaterials().map((material) => `<button class="filter-pill ${material === state.activeMaterial ? "active" : ""}" type="button" data-filter-type="material" data-value="${material}">${material}</button>`).join("");
  if (els.locationFilters) els.locationFilters.innerHTML = getLocations().map((location) => `<button class="filter-pill ${location === state.activeLocation ? "active" : ""}" type="button" data-filter-type="location" data-value="${location}">${location}</button>`).join("");
  if (els.modeFilters) els.modeFilters.innerHTML = getModes().map((mode) => `<button class="filter-pill ${mode === state.activeMode ? "active" : ""}" type="button" data-filter-type="mode" data-value="${mode}">${mode}</button>`).join("");
  if (els.familyFilters) els.familyFilters.innerHTML = getFamilies().map((family) => `<button class="filter-pill ${family === state.activeFamily ? "active" : ""}" type="button" data-filter-type="family" data-value="${family}">${family}</button>`).join("");
}

function renderFeatured(item) {
  if (!item) {
    els.featuredName.textContent = "No filament loaded";
    els.featuredMeta.textContent = "Add or sync inventory to populate the spotlight.";
    els.featuredAmount.innerHTML = `<span class="amount-readout">0.0 spools <small>low</small></span>`;
    els.featuredSwatch.innerHTML = "";
    return;
  }
  els.featuredName.textContent = `${item.color} ${item.material}`;
  els.featuredName.classList.add("filament-name");
  els.featuredName.style.cssText = nameStyleFor(item.color);
  els.featuredMeta.textContent = `${item.brand} / ${item.finish} / ${item.location}`;
  els.featuredAmount.innerHTML = `<span class="amount-readout">${formatAmountSummary(item.amount)} <small>${formatPercent(item.amount)}</small></span>`;
  els.featuredSwatch.innerHTML = spoolSvg(item.color, `${item.color} ${item.material} spool`, `featured-${item.id}`);
}

function renderHomeDashboard() {
  if (els.lowStockGrid) {
    const lowItems = getLowestStockItems();
    els.lowStockGrid.innerHTML = lowItems.length
      ? lowItems.map((item) => `<button class="mini-home-card" type="button" data-home-id="${item.id}"><div class="home-card-top"><span class="brand-logo">${brandLogoFor(item.brand)}</span><span class="badge">${formatPercent(item.amount)}</span></div><strong class="filament-name" style="${nameStyleFor(item.color)}">${item.color} ${item.material}</strong><small>Tag ${item.id} / ${item.location}</small></button>`).join("")
      : `<article class="mini-home-card"><strong>No low spools right now</strong><small>Everything is above the low threshold.</small></article>`;
  }
  if (els.printerLoadGrid) {
    els.printerLoadGrid.innerHTML = printers.map((printer) => {
      const loadedSlot = firstLoadedSlot(printer);
      const matchedItem = bestInventoryMatchForPrinterSlot(loadedSlot);
      const loadedText = loadedSlot ? `${loadedSlot.slot} ${loadedSlot.color ? `${loadedSlot.color} ` : ""}${loadedSlot.filament}`.trim() : `Ext ${printer.ext}`;
      return `<button class="mini-home-card" type="button" data-printer-id="${printer.id}"><div class="home-card-top"><strong>${printer.name}</strong><span class="badge">${printer.ext}</span></div><small>${loadedText}</small><span>${matchedItem ? `Best spool match: Tag ${matchedItem.id}` : "Tap to inspect this printer."}</span></button>`;
    }).join("");
  }
  if (els.reorderQueueGrid) {
    const reorderItems = getReorderQueueItems();
    els.reorderQueueGrid.innerHTML = reorderItems.length
      ? reorderItems.map((item) => `<button class="mini-home-card" type="button" data-home-id="${item.id}"><div class="home-card-top"><span class="brand-logo">${brandLogoFor(item.brand)}</span><span class="badge">${formatPercent(item.amount)}</span></div><strong class="filament-name" style="${nameStyleFor(item.color)}">${item.color} ${item.material}</strong><small>Tag ${item.id} / reorder at ${formatAmountSummary(item.reorderThreshold ?? defaultThresholdFor(item.material))}</small></button>`).join("")
      : `<article class="mini-home-card"><strong>No reorder queue</strong><small>Nothing is currently below threshold.</small></article>`;
  }
  if (els.returnPromptGrid) {
    const printerItems = getPrinterLoadedInventory();
    els.returnPromptGrid.innerHTML = printerItems.length
      ? printerItems.map((item) => `<article class="mini-home-card"><div class="home-card-top"><span class="brand-logo">${brandLogoFor(item.brand)}</span><span class="badge">${item.location}</span></div><strong class="filament-name" style="${nameStyleFor(item.color)}">${item.color} ${item.material}</strong><small>Tag ${item.id} / ${item.position || "Loaded on printer"}</small><button class="card-action" type="button" data-return-home-id="${item.id}">Yes, return to shelf</button></article>`).join("")
      : `<article class="mini-home-card"><strong>All clear</strong><small>No spool is currently marked as sitting on a printer.</small></article>`;
  }
  renderStationActions();
}
function renderTvBoard() {
  const lowItems = getLowestStockItems();
  if (els.tvLowStockGrid) {
    els.tvLowStockGrid.innerHTML = lowItems.length
      ? lowItems.map((item) => `<button class="mini-home-card" type="button" data-home-id="${item.id}"><div class="home-card-top"><span class="brand-logo">${brandLogoFor(item.brand)}</span><span class="badge">${formatPercent(item.amount)}</span></div><strong class="filament-name" style="${nameStyleFor(item.color)}">${item.color} ${item.material}</strong><small>Tag ${item.id} / ${item.location}</small></button>`).join("")
      : `<article class="mini-home-card"><strong>No low spools right now</strong><small>Everything is above the low threshold.</small></article>`;
  }
  if (els.tvPrinterGrid) {
    els.tvPrinterGrid.innerHTML = printers.map((printer) => {
      const loaded = printer.slots.filter((entry) => entry.filament && entry.filament !== "Empty").length;
      return `<article class="printer-card ${printer.id === state.currentPrinterId ? "active-printer" : ""}" data-printer-id="${printer.id}"><p class="eyebrow">${printer.model}</p><h3>${printer.name}</h3><p class="printer-meta">${loaded}/4 AMS slots loaded / Ext: ${printer.ext}</p><div class="slot-grid">${printer.slots.map((entry) => `<div class="slot-chip"><strong>${entry.slot}</strong><small>${entry.filament === "Empty" ? "Empty" : `${entry.color} ${entry.filament}`}</small></div>`).join("")}</div></article>`;
    }).join("");
  }
  if (els.tvMatchGrid) {
    const printer = printers.find((entry) => entry.id === state.currentPrinterId) || printers[0];
    const targetMaterials = new Set([printer.ext, ...printer.slots.map((slot) => slot.filament)].map(normalize));
    const matches = state.inventory.filter((item) => targetMaterials.has(normalize(item.material)) && item.amount >= 0.5).sort((a, b) => b.amount - a.amount || Number(b.id) - Number(a.id)).slice(0, 4);
    els.tvMatchGrid.innerHTML = matches.length
      ? matches.map((item) => `<button class="match-card" type="button" data-match-id="${item.id}"><div class="match-card-head"><span class="brand-logo">${brandLogoFor(item.brand)}</span><h3 class="filament-name" style="${nameStyleFor(item.color)}">${item.color} ${item.material}</h3></div><p class="inventory-subline">${item.brand} / ${item.finish} / ${formatAmountSummary(item.amount)}</p></button>`).join("")
      : `<article class="match-card"><p class="inventory-subline">No strong matches for ${printer.name} right now.</p></article>`;
  }
}

function renderInventoryGrid(items) {
  if (!els.inventoryGrid || !els.resultsCopy) return;
  els.resultsCopy.textContent = `${items.length} spool${items.length === 1 ? "" : "s"} showing`;
  if (!items.length) {
    els.inventoryGrid.innerHTML = `<article class="inventory-card"><div><h3>No matching spool</h3><p class="inventory-subline">Try a different material, storage area, or search phrase.</p></div></article>`;
    return;
  }
  els.inventoryGrid.innerHTML = items.map((item) => {
    const availability = getAvailability(item);
    const reaction = getReactionCounts(item.id);
    return `<article class="inventory-card ${item.id === state.selectedId ? "active" : ""}" data-id="${item.id}"><div class="card-topline"><div class="card-brandline"><span class="card-id">Tag ${item.id}</span><span class="brand-logo">${brandLogoFor(item.brand)}</span></div><div class="color-badge" style="background:${swatchFor(item.color)}"></div></div><div class="card-visual">${spoolSvg(item.color, `${item.color} ${item.material} spool`, `card-${item.id}`)}</div><div><h3 class="filament-name" style="${nameStyleFor(item.color)}">${item.color}</h3><p class="inventory-subline">${item.material} / ${item.finish} / ${item.brand}</p></div><div class="card-tags"><span class="badge">${item.location}</span><span class="badge">${locationBucketFor(item.location)}</span>${item.position ? `<span class="badge">${item.position}</span>` : ""}<span class="badge">${item.colorFamily}</span><span class="badge">${item.sealed}</span>${reaction.favorites > 0 ? `<span class="badge favorite">Favorite ${reaction.favorites}</span>` : ""}${reaction.likes > 0 ? `<span class="badge">Heart ${reaction.likes}</span>` : ""}${isBelowThreshold(item) ? `<span class="chip low">Reorder at ${Number(item.reorderThreshold).toFixed(1)}</span>` : ""}<span class="chip ${availability.tone}">${availability.label}</span></div><div class="card-footer"><strong class="amount-readout">${formatAmountSummary(item.amount)} <small>${formatPercent(item.amount)}</small></strong><button class="card-action" type="button" data-open-id="${item.id}">View</button></div></article>`;
  }).join("") + (state.adminMode ? `<button class="inventory-card add-card" type="button" data-open-add-filament="true"><div class="plus-icon">+</div><div><h3>Add filament</h3><p class="inventory-subline">Create a new spool entry right from the catalog.</p></div></button>` : "");
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
function spoolUrlFor(item) {
  const url = new URL(window.location.href);
  url.searchParams.set("tag", item.id);
  return url.toString();
}
function qrImageUrlFor(item) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=12&data=${encodeURIComponent(spoolUrlFor(item))}`;
}

function openAddFilamentModal() {
  if (!state.adminMode || !els.addFilamentModal) return;
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
    amount: clampAmount(els.newAmount.value || 0),
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
      if (els.qrPreview) els.qrPreview.src = "";
      if (els.qrTagCopy) els.qrTagCopy.textContent = "Tag";
      if (els.qrLinkCopy) els.qrLinkCopy.textContent = "Open this spool directly from a phone camera or from inside the tracker scanner.";
      if (els.downloadQrButton) els.downloadQrButton.href = "#";
      if (els.qrDownloadLink) els.qrDownloadLink.href = "#";
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
  const spoolUrl = spoolUrlFor(item);
  const qrUrl = qrImageUrlFor(item);
  if (els.qrPreview) els.qrPreview.src = qrUrl;
  if (els.qrTagCopy) els.qrTagCopy.textContent = `Tag ${item.id}`;
  if (els.qrLinkCopy) els.qrLinkCopy.textContent = spoolUrl;
  if (els.downloadQrButton) els.downloadQrButton.href = qrUrl;
  if (els.qrDownloadLink) els.qrDownloadLink.href = qrUrl;
  fetchCommentsForSpool(item.id);
}

function renderBambuSyncCard() {
  if (!els.bambuSyncTitle || !els.bambuSyncCopy) return;
  if (state.bambuSyncStatus.mode === "live") {
    els.bambuSyncTitle.textContent = "Automatic printer reading connected";
    els.bambuSyncCopy.textContent = `${state.bambuSyncStatus.connectedPrinters} printer${state.bambuSyncStatus.connectedPrinters === 1 ? "" : "s"} are being read from your local Bambu Studio log snapshot. The dashboard will keep using the live snapshot when the JSON feed is refreshed.`;
    if (els.bambuSyncMeta) {
      const sourceName = String(state.bambuSyncStatus.source || "").split(/[\\/]/).pop();
      els.bambuSyncMeta.textContent = sourceName ? `Source ${sourceName}` : "";
    }
  } else {
    els.bambuSyncTitle.textContent = "Automatic printer reading not connected";
    els.bambuSyncCopy.textContent = "The tracker is using your saved printer snapshots right now. Run the local Bambu snapshot helper to generate bambu_snapshot.json and this section will switch over automatically.";
    if (els.bambuSyncMeta) els.bambuSyncMeta.textContent = "Fallback mode";
  }
}

function getTeamRooms() {
  const rooms = new Set(state.teamHubMembers.map((member) => String(member.room || "Unknown")));
  return ["All", ...[...rooms].sort((a, b) => Number(a) - Number(b) || a.localeCompare(b))];
}
function getTeamConductFilters() {
  return ["All", "Elite", "Cleared", "Watch", "Critical"];
}
function getFilteredTeamMembers() {
  return sortTeamMembers(state.teamHubMembers.filter((member) => {
    const roomMatches = state.teamHubActiveRoom === "All" || member.room === state.teamHubActiveRoom;
    const conductMatches = state.teamHubActiveConduct === "All" || conductTierForScore(member.score).filter === state.teamHubActiveConduct;
    return roomMatches && conductMatches;
  }));
}
function getSelectedTeamMember(filteredMembers = getFilteredTeamMembers()) {
  const selected = state.teamHubMembers.find((member) => member.id === state.selectedAgentId);
  if (selected && filteredMembers.some((member) => member.id === selected.id)) return selected;
  return filteredMembers[0] || sortTeamMembers(state.teamHubMembers)[0] || null;
}
function getAverageTeamScore(members) {
  if (!members.length) return 0;
  return Math.round(members.reduce((sum, member) => sum + clampTeamScore(member.score), 0) / members.length);
}
function getTopRoomSummary() {
  const summaries = getTeamRooms().slice(1).map((room) => {
    const members = state.teamHubMembers.filter((member) => member.room === room);
    return { room, members, average: getAverageTeamScore(members) };
  }).sort((a, b) => b.average - a.average || b.members.length - a.members.length);
  return summaries[0] || null;
}
function teamEventToneClass(event) {
  if (!event) return "";
  if (event.type === "legend") return "tone-legend";
  if (event.delta >= 0) return "tone-good";
  if (event.delta <= -30) return "tone-critical";
  return "tone-watch";
}
function renderTeamKpis(filteredMembers) {
  if (!els.teamKpiGrid) return;
  const total = state.teamHubMembers.length;
  const average = getAverageTeamScore(state.teamHubMembers);
  const watchCount = state.teamHubMembers.filter((member) => conductTierForScore(member.score).filter === "Critical").length;
  const topRoom = getTopRoomSummary();
  const visibleCopy = filteredMembers.length === total ? "All visible" : `${filteredMembers.length} visible`;
  const cards = [
    { label: "Agents tracked", value: total, copy: visibleCopy },
    { label: "Average score", value: average, copy: "Sandbox rep index" },
    { label: "Watch list", value: watchCount, copy: watchCount ? "Needs intervention" : "No current villains" },
    { label: "Top room", value: topRoom ? `Room ${topRoom.room}` : "None", copy: topRoom ? `${topRoom.average} average` : "Awaiting data" }
  ];
  els.teamKpiGrid.innerHTML = cards.map((card) => `<article class="hq-kpi-card"><span>${escapeHtml(card.label)}</span><strong>${escapeHtml(card.value)}</strong><small>${escapeHtml(card.copy)}</small></article>`).join("");
}
function renderTeamFilters() {
  if (els.teamRoomFilters) {
    els.teamRoomFilters.innerHTML = getTeamRooms().map((room) => {
      const count = room === "All" ? state.teamHubMembers.length : state.teamHubMembers.filter((member) => member.room === room).length;
      return `<button class="filter-pill ${state.teamHubActiveRoom === room ? "active" : ""}" type="button" data-team-room="${escapeHtml(room)}">${room === "All" ? "All rooms" : `Room ${escapeHtml(room)}`} <span>${count}</span></button>`;
    }).join("");
  }
  if (els.teamConductFilters) {
    els.teamConductFilters.innerHTML = getTeamConductFilters().map((filter) => {
      const count = filter === "All" ? state.teamHubMembers.length : state.teamHubMembers.filter((member) => conductTierForScore(member.score).filter === filter).length;
      return `<button class="filter-pill ${state.teamHubActiveConduct === filter ? "active" : ""}" type="button" data-team-conduct="${escapeHtml(filter)}">${escapeHtml(filter)} <span>${count}</span></button>`;
    }).join("");
  }
}
function renderTeamLeaderboard(filteredMembers) {
  if (!els.teamLeaderboard) return;
  const leaders = filteredMembers.slice(0, 5);
  if (els.teamLeaderboardCopy) {
    els.teamLeaderboardCopy.textContent = leaders.length ? `${leaders.length} agent${leaders.length === 1 ? "" : "s"} in contention under the current filters.` : "No agents match those filters.";
  }
  els.teamLeaderboard.innerHTML = leaders.length
    ? leaders.map((member, index) => {
      const conduct = conductTierForScore(member.score);
      return `<button class="hq-rank-card" type="button" data-team-agent-id="${escapeHtml(member.id)}"><div class="hq-rank-top"><span class="badge">#${index + 1}</span><span class="badge">${escapeHtml(conduct.filter)}</span></div><div class="hq-rank-body"><div class="hq-agent-badge" style="${teamBadgeStyle(member)}">${escapeHtml(teamInitialsFor(member))}</div><div><strong>${escapeHtml(member.name)}</strong><p>${escapeHtml(member.codename)}</p></div></div><div class="hq-rank-foot"><strong>${member.score}</strong><small>Room ${escapeHtml(member.room)} / ${escapeHtml(member.specialty)}</small></div></button>`;
    }).join("")
    : `<article class="hq-empty-state"><strong>No leaderboard results</strong><p>Try widening the room or conduct filters.</p></article>`;
}
function renderTeamRoomGrid() {
  if (!els.teamRoomGrid) return;
  const roomCards = getTeamRooms().slice(1).map((room) => {
    const members = sortTeamMembers(state.teamHubMembers.filter((member) => member.room === room));
    const average = getAverageTeamScore(members);
    const leader = members[0];
    const mentorCount = members.filter((member) => member.role === "Mentor").length;
    return `<button class="hq-room-card ${state.teamHubActiveRoom === room ? "active" : ""}" type="button" data-team-room="${escapeHtml(room)}"><div class="hq-room-head"><strong>Room ${escapeHtml(room)}</strong><span class="badge">${members.length} member${members.length === 1 ? "" : "s"}</span></div><div class="hq-room-meter"><span style="width:${teamScorePercent(average)}%"></span></div><p class="inventory-subline">${average} average reputation / ${mentorCount ? `${mentorCount} mentor${mentorCount === 1 ? "" : "s"}` : "student squad"}</p><small>${leader ? `Lead presence: ${escapeHtml(leader.name)}` : "Waiting for roster"}</small></button>`;
  });
  els.teamRoomGrid.innerHTML = roomCards.join("");
}
function renderTeamMemberGrid(filteredMembers) {
  if (!els.teamMemberGrid) return;
  if (els.teamGridCopy) {
    els.teamGridCopy.textContent = `${filteredMembers.length} visible account${filteredMembers.length === 1 ? "" : "s"} out of ${state.teamHubMembers.length}.`;
  }
  els.teamMemberGrid.innerHTML = filteredMembers.length
    ? filteredMembers.map((member) => {
      const conduct = conductTierForScore(member.score);
      const latest = member.history?.[0];
      return `<button class="hq-agent-card ${member.id === state.selectedAgentId ? "active" : ""}" type="button" data-team-agent-id="${escapeHtml(member.id)}"><div class="hq-agent-card-head"><div class="hq-agent-badge" style="${teamBadgeStyle(member)}">${escapeHtml(teamInitialsFor(member))}</div><div><strong>${escapeHtml(member.name)}</strong><p>${escapeHtml(member.codename)}</p></div></div><div class="hq-agent-meta"><span class="chip">${member.role === "Mentor" ? "Mentor" : `Room ${escapeHtml(member.room)}`}</span><span class="chip">${escapeHtml(member.specialty)}</span></div><div class="hq-agent-foot"><strong>${member.score}</strong><small>${escapeHtml(conduct.label)}</small></div><p class="inventory-subline">${latest ? `${formatTeamDelta(latest.delta)} ${escapeHtml(latest.summary)}` : "No reports filed yet."}</p></button>`;
    }).join("")
    : `<article class="hq-empty-state"><strong>No agents found</strong><p>The current filters hide everyone. That probably means command got too specific.</p></article>`;
}
function renderTeamReportTargets(selectedMember) {
  if (!els.teamReportTarget) return;
  const previousValue = els.teamReportTarget.value;
  const members = sortTeamMembers(state.teamHubMembers);
  els.teamReportTarget.innerHTML = members.map((member) => `<option value="${escapeHtml(member.id)}">${escapeHtml(member.name)} - Room ${escapeHtml(member.room)}${member.role === "Mentor" ? " - Mentor" : ""}</option>`).join("");
  const nextValue = members.some((member) => member.id === previousValue) ? previousValue : (selectedMember?.id || members[0]?.id || "");
  if (nextValue) els.teamReportTarget.value = nextValue;
}
function renderTeamDossier(member) {
  if (!els.teamSelectedName || !els.teamSelectedBadge || !els.teamSelectedScore || !els.teamSelectedMeter || !els.teamSelectedStatus || !els.teamSelectedTags || !els.teamHistoryList || !els.teamIncentiveBoard) return;
  if (!member) {
    els.teamSelectedBadge.textContent = "PM";
    els.teamSelectedBadge.removeAttribute("style");
    els.teamSelectedName.textContent = "Choose an agent";
    els.teamSelectedCodename.textContent = "Select a roster card to inspect score, room, and recent reports.";
    els.teamSelectedScore.textContent = "000";
    els.teamSelectedClearance.textContent = "Standby";
    els.teamSelectedMeter.style.width = "0%";
    els.teamSelectedStatus.textContent = "Starter sandbox is waiting for a selection.";
    els.teamSelectedTags.innerHTML = "";
    els.teamHistoryList.innerHTML = `<article class="hq-empty-state"><strong>No paper trail yet</strong><p>Pick someone from the roster to open the dossier.</p></article>`;
    els.teamIncentiveBoard.innerHTML = "";
    return;
  }
  const conduct = conductTierForScore(member.score);
  const reward = rewardTierForScore(member.score);
  const nextReward = nextRewardTierForScore(member.score);
  const consequence = consequenceTierForScore(member.score);
  els.teamSelectedBadge.textContent = teamInitialsFor(member);
  els.teamSelectedBadge.style.cssText = teamBadgeStyle(member);
  els.teamSelectedName.textContent = member.name;
  els.teamSelectedCodename.textContent = `${member.codename} / Room ${member.room} / ${member.role}`;
  els.teamSelectedScore.textContent = String(member.score);
  els.teamSelectedClearance.textContent = conduct.label;
  els.teamSelectedMeter.style.width = `${teamScorePercent(member.score)}%`;
  els.teamSelectedStatus.textContent = `${conduct.description} ${member.notes || ""}`.trim();
  const latest = member.history?.[0];
  const tagMarkup = [
    `<span class="chip ${member.role === "Mentor" ? "good" : ""}">${member.role}</span>`,
    `<span class="chip">Room ${escapeHtml(member.room)}</span>`,
    `<span class="chip">${escapeHtml(member.specialty)}</span>`,
    `<span class="chip ${member.streak >= 3 ? "good" : ""}">${member.streak} report streak</span>`,
    latest ? `<span class="chip ${latest.delta >= 0 ? "good" : "low"}">${formatTeamDelta(latest.delta)} latest swing</span>` : ""
  ].filter(Boolean);
  els.teamSelectedTags.innerHTML = tagMarkup.join("");
  els.teamHistoryList.innerHTML = member.history?.length
    ? member.history.map((event) => `<article class="hq-history-item ${teamEventToneClass(event)}"><div class="hq-history-top"><strong>${escapeHtml(titleCase(event.type))}</strong><span class="badge">${formatTeamDelta(event.delta)}</span></div><p>${escapeHtml(event.summary)}</p><small>${escapeHtml(event.reporter)} / ${escapeHtml(formatTeamTimestamp(event.createdAt))}</small></article>`).join("")
    : `<article class="hq-empty-state"><strong>No paper trail yet</strong><p>This account has no reports. Suspiciously clean.</p></article>`;
  const incentiveCards = [
    `<article class="hq-incentive-card active"><strong>Unlocked now</strong><p>${escapeHtml(reward.title)}</p><small>${escapeHtml(reward.copy)}</small></article>`,
    nextReward
      ? `<article class="hq-incentive-card"><strong>Next prize</strong><p>${escapeHtml(nextReward.title)}</p><small>${escapeHtml(nextReward.copy)} Need ${nextReward.threshold - member.score} more points.</small></article>`
      : `<article class="hq-incentive-card"><strong>Next prize</strong><p>Top tier reached</p><small>This agent already has full command swagger.</small></article>`,
    consequence
      ? `<article class="hq-incentive-card warning"><strong>Current consequence</strong><p>${escapeHtml(consequence.title)}</p><small>${escapeHtml(consequence.copy)}</small></article>`
      : `<article class="hq-incentive-card"><strong>Risk outlook</strong><p>No active punishment</p><small>Keep the score up and the cable dungeon remains theoretical.</small></article>`
  ];
  els.teamIncentiveBoard.innerHTML = incentiveCards.join("");
}
function renderTeamReportFeed() {
  if (!els.teamReportFeed) return;
  const feed = state.teamHubReports.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 12);
  els.teamReportFeed.innerHTML = feed.length
    ? feed.map((event) => {
      const member = state.teamHubMembers.find((entry) => entry.id === event.memberId);
      return `<article class="hq-feed-item ${teamEventToneClass(event)}"><div class="hq-feed-top"><strong>${escapeHtml(member?.name || "Unknown agent")}</strong><span class="badge">${formatTeamDelta(event.delta)}</span></div><p>${escapeHtml(event.summary)}</p><small>${escapeHtml(titleCase(event.type))} / ${escapeHtml(event.reporter)} / ${escapeHtml(formatTeamTimestamp(event.createdAt))}</small></article>`;
    }).join("")
    : `<article class="hq-empty-state"><strong>No reports yet</strong><p>Once someone does something legendary or silly, it will land here.</p></article>`;
}
function renderTeamRewardGrid(selectedMember) {
  if (!els.teamRewardGrid) return;
  const score = selectedMember?.score ?? 0;
  els.teamRewardGrid.innerHTML = TEAM_REWARD_LADDER.map((reward) => `<article class="hq-prize-card ${score >= reward.threshold ? "active" : ""}"><div class="hq-prize-top"><strong>${escapeHtml(reward.title)}</strong><span class="badge">${reward.threshold}+</span></div><p>${escapeHtml(reward.copy)}</p></article>`).join("");
}
function renderTeamModuleGrid() {
  if (!els.teamModuleGrid) return;
  els.teamModuleGrid.innerHTML = TEAM_FUTURE_MODULES.map((module) => `<article class="hq-module-card"><strong>${escapeHtml(module.title)}</strong><p>${escapeHtml(module.copy)}</p></article>`).join("");
}
function renderTeamHub() {
  const filteredMembers = getFilteredTeamMembers();
  const selectedMember = getSelectedTeamMember(filteredMembers);
  const previousSelectedId = state.selectedAgentId;
  if (selectedMember) state.selectedAgentId = selectedMember.id;
  renderTeamKpis(filteredMembers);
  renderTeamFilters();
  renderTeamLeaderboard(filteredMembers);
  renderTeamRoomGrid();
  renderTeamMemberGrid(filteredMembers);
  renderTeamReportTargets(selectedMember);
  renderTeamDossier(selectedMember);
  renderTeamReportFeed();
  renderTeamRewardGrid(selectedMember);
  renderTeamModuleGrid();
  if (els.teamHqCopy) {
    els.teamHqCopy.textContent = `Starter scores are satire/demo values until real receipts are imported. ${filteredMembers.length} of ${state.teamHubMembers.length} accounts are currently visible.`;
  }
  if (selectedMember && previousSelectedId !== state.selectedAgentId) {
    saveTeamHubData();
  }
}
function focusTeamDossierIfStacked() {
  if (window.innerWidth > 1100) return;
  const panel = document.getElementById("team-dossier-panel");
  if (!panel) return;
  window.setTimeout(() => {
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 40);
}
function recordTeamScoreChange(memberId, delta, summary, type = delta >= 0 ? "commendation" : "concern", reporter = "Command") {
  const member = state.teamHubMembers.find((entry) => entry.id === memberId);
  if (!member) return false;
  const event = createTeamEvent(member.id, type, delta, summary, reporter, new Date().toISOString());
  member.score = clampTeamScore(member.score + delta);
  member.streak = delta >= 0 ? member.streak + 1 : Math.max(0, member.streak - 1);
  member.history = [event, ...(member.history || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);
  state.teamHubReports = [event, ...state.teamHubReports].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 40);
  state.selectedAgentId = member.id;
  saveTeamHubData();
  renderAll();
  return true;
}

function adjustSelectedAmount(delta) {
  const item = state.inventory.find((entry) => entry.id === state.selectedId);
  if (!item) return;
  item.amount = clampAmount(Math.round((Number(item.amount) + delta) * 10) / 10);
  saveInventory();
  void syncItemAndRefresh(item, "upsert");
  renderAll();
}

function updateSelectedPlacement(nextLocation, nextPosition) {
  if (!state.adminMode) return;
  const item = state.inventory.find((entry) => entry.id === state.selectedId);
  if (!item) return;
  if (nextLocation) item.location = nextLocation;
  item.position = String(nextPosition || "").trim();
  saveInventory();
  void syncItemAndRefresh(item, "upsert");
  renderAll();
}

function updateSelectedSeal(nextSeal) {
  if (!state.adminMode) return;
  const item = state.inventory.find((entry) => entry.id === state.selectedId);
  if (!item || !nextSeal) return;
  item.sealed = nextSeal;
  saveInventory();
  void syncItemAndRefresh(item, "upsert");
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
  renderBambuSyncCard();
  renderMatchGrid();
  renderStatStrip();
  renderHomeDashboard();
  renderTvBoard();
  renderFilters();
  renderSuggestions();
  renderFeatured(selected || state.inventory[0]);
  renderInventoryGrid(filtered);
  renderDetails(selected || null);
  renderTeamHub();
  if (config.googleSheetWebUrl && els.spreadsheetLink) {
    els.spreadsheetLink.href = config.googleSheetWebUrl;
  }
}
async function deleteSelectedFilament() {
  if (!state.adminMode || !state.selectedId) return;
  const item = state.inventory.find((entry) => entry.id === state.selectedId);
  if (!item) return;
  const confirmed = window.confirm(`Remove filament tag ${item.id} from the tracker and spreadsheet?`);
  if (!confirmed) return;
  const previousId = state.selectedId;
  state.inventory = state.inventory.filter((entry) => entry.id !== previousId);
  delete state.reactions[previousId];
  clearPendingSheetWrite(previousId);
  state.selectedId = state.inventory[0]?.id || null;
  saveInventory();
  saveLocalReactions();
  renderAll();
  const deleted = await syncItemToGoogleSheet(item, "delete");
  if (!deleted) {
    await loadInventoryFromGoogleSheet();
    renderAll();
    window.alert("The filament was removed locally, but the spreadsheet delete did not confirm. Please refresh and try again.");
  } else {
    await loadInventoryFromGoogleSheet();
    renderAll();
  }
}

async function refreshLiveData() {
  if (state.refreshInFlight) return false;
  if (Object.keys(state.pendingSheetWrites).length) return false;
  state.refreshInFlight = true;
  try {
    const previousSelected = state.selectedId;
    const loaded = await loadInventoryFromGoogleSheet();
    await loadBambuSnapshot();
    if (loaded && previousSelected && state.inventory.some((item) => item.id === previousSelected)) {
      state.selectedId = previousSelected;
    }
    renderAll();
    return loaded;
  } finally {
    state.refreshInFlight = false;
  }
}

function bindStaticEvents() {
  els.siteLockForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const code = String(els.siteLockInput?.value || "").trim();
    if (code === SITE_ACCESS_CODE) {
      if (els.siteLockInput) els.siteLockInput.value = "";
      applySiteLock(true);
      renderAll();
    } else {
      if (els.siteLockStatus) els.siteLockStatus.textContent = "That site code did not work.";
    }
  });
  els.siteLockButton?.addEventListener("click", () => {
    if (!state.siteUnlocked) return;
    applySiteLock(false);
    stopQrScanner();
  });
  els.stationModeButton?.addEventListener("click", () => {
    applyStationMode(!state.stationMode);
    renderAll();
  });
  els.jumpFeatured?.addEventListener("click", () => {
    const item = getSelectedItem(getFilteredInventory());
    if (!item) return;
    state.selectedId = item.id;
    renderAll();
    focusDetailPanelIfStacked();
  });
  els.copyDiscordIdButton?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(TEAM_HQ_DISCORD_ID);
      if (els.teamHqCopy) els.teamHqCopy.textContent = `Discord HQ ID copied: ${TEAM_HQ_DISCORD_ID}`;
      window.setTimeout(() => renderTeamHub(), 1800);
    } catch {
      if (els.teamHqCopy) els.teamHqCopy.textContent = `Discord HQ ID: ${TEAM_HQ_DISCORD_ID}`;
    }
  });

  els.homeButton?.addEventListener("click", goHome);
  els.focusScanInputButton?.addEventListener("click", () => {
    els.stationScanInput?.focus();
    els.stationScanInput?.select();
  });
  els.stationScanInput?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const rawValue = String(event.target.value || "").trim();
    if (!rawValue) return;
    handleStationScan(rawValue);
    event.target.value = "";
  });
  els.startScanButton?.addEventListener("click", () => { void startQrScanner(); });
  els.scanUploadInput?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    void scanQrFromImage(file);
    event.target.value = "";
  });

  els.resetButton?.addEventListener("click", async () => {
    if (!state.adminMode) return;
    localStorage.removeItem(STORAGE_KEY);
    state.inventory = window.DEFAULT_INVENTORY.map((item) => ({
      ...item,
      reorderThreshold: item.reorderThreshold ?? defaultThresholdFor(item.material),
      colorFamily: item.colorFamily || colorFamilyFor(item.color)
    }));
    await refreshLiveData();
  });

  els.searchInput?.addEventListener("input", (event) => {
    state.search = normalize(event.target.value);
    renderAll();
  });

  els.themeSelect?.addEventListener("change", (event) => {
    applyTheme(event.target.value);
    renderAll();
  });
  els.adminModeButton?.addEventListener("click", () => {
    if (state.adminMode) {
      applyAdminMode(false);
      renderAll();
      return;
    }
    const code = window.prompt("Enter admin code");
    if (code === ADMIN_CODE) {
      applyAdminMode(true);
      renderAll();
    } else if (code !== null) {
      window.alert("That code did not work.");
    }
  });
  els.tvModeButton?.addEventListener("click", () => {
    applyTvMode(!state.tvMode);
    renderAll();
  });
  els.tvExitButton?.addEventListener("click", () => {
    applyTvMode(false);
    renderAll();
  });

  document.addEventListener("click", (event) => {
    const roomFilter = event.target.closest("[data-team-room]");
    if (roomFilter && roomFilter.dataset.teamRoom) {
      state.teamHubActiveRoom = state.teamHubActiveRoom === roomFilter.dataset.teamRoom ? "All" : roomFilter.dataset.teamRoom;
      saveTeamHubData();
      renderAll();
      return;
    }

    const conductFilter = event.target.closest("[data-team-conduct]");
    if (conductFilter && conductFilter.dataset.teamConduct) {
      state.teamHubActiveConduct = state.teamHubActiveConduct === conductFilter.dataset.teamConduct ? "All" : conductFilter.dataset.teamConduct;
      saveTeamHubData();
      renderAll();
      return;
    }

    const teamAgent = event.target.closest("[data-team-agent-id]");
    if (teamAgent && teamAgent.dataset.teamAgentId) {
      state.selectedAgentId = teamAgent.dataset.teamAgentId;
      saveTeamHubData();
      renderAll();
      focusTeamDossierIfStacked();
      return;
    }

    const teamAdjustment = event.target.closest("[data-agent-adjust]");
    if (teamAdjustment) {
      if (!state.selectedAgentId) {
        if (els.teamReportStatus) els.teamReportStatus.textContent = "Pick an agent first so command knows who gets the paperwork.";
        return;
      }
      const delta = Math.round(Number(teamAdjustment.dataset.agentAdjust) || 0);
      const reason = teamAdjustment.dataset.agentReason || "Manual score change";
      const type = delta >= 25 ? "legend" : (delta >= 0 ? "commendation" : "concern");
      recordTeamScoreChange(state.selectedAgentId, delta, reason, type, "Quick ruling");
      if (els.teamReportStatus) els.teamReportStatus.textContent = `${formatTeamDelta(delta)} applied to the selected agent.`;
      return;
    }

    const filterButton = event.target.closest("[data-filter-type]");
    if (filterButton) {
      const type = filterButton.dataset.filterType;
      const value = filterButton.dataset.value;
      if (type === "material") state.activeMaterial = state.activeMaterial === value ? "All" : value;
      if (type === "location") state.activeLocation = state.activeLocation === value ? "All" : value;
      if (type === "mode") state.activeMode = state.activeMode === value ? "All" : value;
      if (type === "family") state.activeFamily = state.activeFamily === value ? "All" : value;
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
      focusDetailPanelIfStacked();
      return;
    }

    const suggestion = event.target.closest("[data-suggest-id]");
    if (suggestion && suggestion.dataset.suggestId) {
      state.selectedId = suggestion.dataset.suggestId;
      state.search = "";
      if (els.searchInput) els.searchInput.value = "";
      renderAll();
      focusDetailPanelIfStacked();
      return;
    }

    const printer = event.target.closest("[data-printer-id]");
    if (printer && printer.dataset.printerId) {
      state.currentPrinterId = printer.dataset.printerId;
      renderAll();
      return;
    }

    const matchCard = event.target.closest("[data-match-id]");
    if (matchCard && matchCard.dataset.matchId) {
      state.selectedId = matchCard.dataset.matchId;
      renderAll();
      focusDetailPanelIfStacked();
      return;
    }

    const homeCard = event.target.closest("[data-home-id]");
    if (homeCard && homeCard.dataset.homeId) {
      state.selectedId = homeCard.dataset.homeId;
      renderAll();
      focusDetailPanelIfStacked();
      return;
    }

    const returnHomeButton = event.target.closest("[data-return-home-id]");
    if (returnHomeButton && returnHomeButton.dataset.returnHomeId) {
      state.selectedId = returnHomeButton.dataset.returnHomeId;
      const item = getSelectedStationItem();
      if (item) {
        const shelfChoice = getLocationChoices().find((location) => locationBucketFor(location) === "On shelf" && location !== item.location) || "Cabinet 1 Misc.";
        setItemPlacement(item, shelfChoice, "");
        updateStationStatus(`Returned tag ${item.id} to shelf.`);
      }
      return;
    }

    const stationAction = event.target.closest("[data-station-action]");
    if (stationAction && stationAction.dataset.stationAction) {
      applyStationAction(stationAction.dataset.stationAction);
      return;
    }

    const stationAssign = event.target.closest("[data-station-assign]");
    if (stationAssign && stationAssign.dataset.stationAssign) {
      const [printerId, slot] = stationAssign.dataset.stationAssign.split("|");
      assignSelectedToPrinterSlot(printerId, slot);
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
    if (!state.adminMode) return;
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
  els.copySpoolLinkButton?.addEventListener("click", async () => {
    const item = state.inventory.find((entry) => entry.id === state.selectedId);
    if (!item) return;
    const link = spoolUrlFor(item);
    try {
      await navigator.clipboard.writeText(link);
      if (els.qrLinkCopy) els.qrLinkCopy.textContent = "Spool link copied.";
      window.setTimeout(() => {
        if (els.qrLinkCopy && state.selectedId === item.id) els.qrLinkCopy.textContent = link;
      }, 1800);
    } catch {
      if (els.qrLinkCopy) els.qrLinkCopy.textContent = link;
    }
  });
  els.deleteFilamentButton?.addEventListener("click", () => {
    void deleteSelectedFilament();
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
    if (!state.adminMode) return;
    const newItem = createFilamentFromForm();
    if (!newItem.id) return;
    state.inventory = [newItem, ...state.inventory.filter((item) => item.id !== newItem.id)]
      .sort((a, b) => Number(b.id) - Number(a.id) || b.id.localeCompare(a.id));
    state.selectedId = newItem.id;
    saveInventory();
    void syncItemAndRefresh(newItem, "upsert");
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
  els.teamReportForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const targetId = String(els.teamReportTarget?.value || "").trim();
    const summary = String(els.teamReportSummary?.value || "").trim();
    const reporter = String(els.teamReportReporter?.value || "").trim() || "Anonymous witness";
    const type = String(els.teamReportType?.value || "commendation");
    const delta = Math.round(Number(els.teamReportDelta?.value || 0));
    if (!targetId) {
      if (els.teamReportStatus) els.teamReportStatus.textContent = "Choose a target agent first.";
      return;
    }
    if (!summary) {
      if (els.teamReportStatus) els.teamReportStatus.textContent = "Add a summary so the report is at least slightly actionable.";
      return;
    }
    const ok = recordTeamScoreChange(targetId, delta, summary, type, reporter);
    if (!ok) {
      if (els.teamReportStatus) els.teamReportStatus.textContent = "That report could not be filed.";
      return;
    }
    if (els.teamReportSummary) els.teamReportSummary.value = "";
    if (els.teamReportStatus) els.teamReportStatus.textContent = `Report filed with a ${formatTeamDelta(delta)} swing.`;
  });
}

async function initializeApp() {
  applyTheme(state.theme);
  applyAdminMode(state.adminMode);
  applyTvMode(state.tvMode);
  applyStationMode(state.stationMode);
  applySiteLock(false);
  const requestedTag = getRequestedTagFromUrl();
  if (requestedTag && state.inventory.some((item) => item.id === requestedTag)) {
    state.selectedId = requestedTag;
  }
  bindStaticEvents();
  renderAll();
  void refreshLiveData();
  window.setInterval(async () => {
    await refreshLiveData();
  }, Number(config.googleSheetRefreshMs || 5000));
  document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState !== "visible") return;
    applyTheme(loadThemePreference());
    applyAdminMode(loadBooleanPreference(ADMIN_MODE_KEY));
    applyTvMode(loadBooleanPreference(TV_MODE_KEY));
    applyStationMode(loadBooleanPreference(STATION_MODE_KEY));
    await refreshLiveData();
  });
  window.addEventListener("pageshow", () => {
    applyTheme(loadThemePreference());
    applyAdminMode(loadBooleanPreference(ADMIN_MODE_KEY));
    applyTvMode(loadBooleanPreference(TV_MODE_KEY));
    applyStationMode(loadBooleanPreference(STATION_MODE_KEY));
    applySiteLock(false);
    renderAll();
  });
  window.addEventListener("beforeunload", stopQrScanner);
}

initializeApp();
