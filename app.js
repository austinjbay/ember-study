const STORAGE_KEY = "margin-chapters-v2";
const DRAFT_KEY = "margin-draft-v2";
const AUTH_KEY = "margin-auth-v1";
const BOOKS_KEY = "margin-books-v1";
const COLLAPSED_BOOKS_KEY = "margin-collapsed-books-v1";
const BOOK_ORDER_KEY = "margin-book-order-v1";
const PRACTICE_KEY = "margin-practice-v1";
const PROFILE_KEY = "margin-profile-v1";
const FOCUS_BOOK_KEY = "margin-focus-book-v1";
const DEFAULT_COLOR_THEME = "moss-paper";
const DEFAULT_COLOR_MODE = "light";

const COLOR_PALETTES = {
  "moss-paper": {
    label: "Moss paper",
    description: "Near-black surfaces with restrained moss accents.",
    vars: {
      "--ink": "#2f312d",
      "--muted": "#737367",
      "--faint": "#a09d91",
      "--paper": "#f3eee3",
      "--white": "#fffdf7",
      "--line": "#ddd5c8",
      "--line-dark": "#c7bcae",
      "--green": "#496553",
      "--green-soft": "#e3ebe4",
      "--amber": "#9a6b43",
      "--amber-soft": "#f3e5cf",
      "--red": "#8a5146",
      "--red-soft": "#f0ded7",
      "--blue": "#536f76"
    },
    darkVars: {
      "--ink": "#f4f2eb",
      "--muted": "#c5c2b9",
      "--faint": "#96968f",
      "--paper": "#111312",
      "--white": "#1d211e",
      "--line": "#303631",
      "--line-dark": "#495149",
      "--green": "#bdd2bf",
      "--green-soft": "#243028",
      "--amber": "#f0c085",
      "--amber-soft": "#30251b",
      "--red": "#eeaa9c",
      "--red-soft": "#30201e",
      "--blue": "#b9d0d8"
    },
    swatches: ["#2f312d", "#496553", "#9a6b43", "#f3eee3"],
    darkSwatches: ["#111312", "#bdd2bf", "#f0c085", "#1d211e"]
  },
  "clay-library": {
    label: "Clay library",
    description: "Near-black surfaces with warm clay accents.",
    vars: {
      "--ink": "#332f2b",
      "--muted": "#766f65",
      "--faint": "#a69b8d",
      "--paper": "#f4eadc",
      "--white": "#fffaf2",
      "--line": "#e0d1bf",
      "--line-dark": "#c9b59f",
      "--green": "#65735b",
      "--green-soft": "#e8eadb",
      "--amber": "#9b643f",
      "--amber-soft": "#f4dfca",
      "--red": "#8b4e43",
      "--red-soft": "#efd9d2",
      "--blue": "#5d6872"
    },
    darkVars: {
      "--ink": "#f6f1e9",
      "--muted": "#c9c0b5",
      "--faint": "#9c948b",
      "--paper": "#131211",
      "--white": "#211e1b",
      "--line": "#38312b",
      "--line-dark": "#554a40",
      "--green": "#c9d2aa",
      "--green-soft": "#2a2d21",
      "--amber": "#f5bf86",
      "--amber-soft": "#332319",
      "--red": "#eea99a",
      "--red-soft": "#321f1c",
      "--blue": "#bfd0d9"
    },
    swatches: ["#332f2b", "#65735b", "#9b643f", "#f4eadc"],
    darkSwatches: ["#131211", "#c9d2aa", "#f5bf86", "#211e1b"]
  },
  "sage-slate": {
    label: "Sage slate",
    description: "Near-black surfaces with cool sage accents.",
    vars: {
      "--ink": "#303436",
      "--muted": "#6f746e",
      "--faint": "#9ca198",
      "--paper": "#f1eadf",
      "--white": "#fffdf8",
      "--line": "#d8d2c5",
      "--line-dark": "#bfb9ab",
      "--green": "#5d6f64",
      "--green-soft": "#e2e9e2",
      "--amber": "#967344",
      "--amber-soft": "#f0e4cf",
      "--red": "#82524b",
      "--red-soft": "#eadbd6",
      "--blue": "#4d6874"
    },
    darkVars: {
      "--ink": "#f3f5ef",
      "--muted": "#c1c8c0",
      "--faint": "#949c95",
      "--paper": "#101213",
      "--white": "#1c2021",
      "--line": "#303738",
      "--line-dark": "#485253",
      "--green": "#bfd7c5",
      "--green-soft": "#223029",
      "--amber": "#efca8f",
      "--amber-soft": "#30271d",
      "--red": "#eba79c",
      "--red-soft": "#30201f",
      "--blue": "#bad3de"
    },
    swatches: ["#303436", "#5d6f64", "#967344", "#f1eadf"],
    darkSwatches: ["#101213", "#bfd7c5", "#efca8f", "#1c2021"]
  }
};

const state = {
  view: "home",
  step: 0,
  intakeStep: 0,
  currentId: null,
  evaluation: null,
  repairResolved: false,
  reviewId: null,
  reviewStep: 0,
  reviewDraft: null,
  reviewSession: null,
  currentBookKey: null,
  draggedBookKey: null,
  activePracticeSkill: "central-claim",
  availableBooks: [],
  supabaseClient: null,
  supabaseSession: null,
  draftRestored: false,
  authMode: "login"
};

const sample = {
  bookTitle: "Deep Work",
  authorName: "Cal Newport",
  chapterTitle: "Deep Work Is Valuable",
  bookTotalChapters: 15,
  sourceKind: "full",
  sourceText: "The chapter argues that deep work is increasingly valuable in an economy shaped by automation, abundant information, and global competition. Newport claims that people who can quickly master hard things and produce at an elite level will thrive. These two core abilities depend on sustained concentration and deliberate practice. The chapter contrasts deep work with shallow activity: routine communication, logistical tasks, and low-value busyness that can be performed while distracted. Shallow work may create the feeling of productivity, but it rarely creates new value and is easy to replicate. As knowledge work becomes more competitive, the ability to work deeply is becoming rarer at the same time that it is becoming more valuable. Technology does not automatically improve work. A tool is useful when it supports meaningful concentration and high-quality output, not simply because it is new, popular, or convenient.",
  recall: "Deep work is becoming more valuable because the economy rewards people who can learn difficult things and produce high-quality work. Both abilities require concentration. The chapter contrasts this with shallow work like messages and busywork, which can feel productive but does not create much value. Technology should support focused work rather than constant distraction.",
  wantsApplication: true
};

const stopWords = new Set(["about","after","again","also","because","before","being","between","chapter","could","every","from","have","into","more","most","only","other","over","should","some","that","their","there","these","they","this","through","when","where","which","while","with","would","your","what","where","than","then","them","were"]);

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const MARKETING_ROUTES = {
  "how-it-works": "/how-it-works",
  "reading-skills": "/reading-skills",
  "why-it-works": "/why-it-works",
  examples: "/examples",
  trust: "/trust",
  account: "/settings"
};
const ROUTE_VIEWS = Object.fromEntries(Object.entries(MARKETING_ROUTES).map(([view, path]) => [path, view]));
const PENDING_ROUTE_KEY = "ember-pending-route";

function routeForView(name) {
  return MARKETING_ROUTES[name] || "/";
}

function viewForPath(pathname = window.location.pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";
  return ROUTE_VIEWS[path] || "home";
}

function cleanHashRoute(hash = window.location.hash) {
  if (!hash || hash === "#app") return null;
  const cleaned = hash.replace(/^#!/, "").replace(/^#\/?/, "");
  if (!cleaned) return "/";
  const normalized = `/${cleaned.replace(/^\/+/, "").replace(/\/+$/, "")}`;
  return ROUTE_VIEWS[normalized] ? normalized : null;
}

function syncUrlForView(name, mode = "push") {
  const target = routeForView(name);
  const current = `${window.location.pathname}${window.location.search}`;
  if (current === target && !window.location.hash) return;
  const method = mode === "replace" ? "replaceState" : "pushState";
  window.history?.[method]?.({ view: name }, "", target);
}

function authRedirectUrl() {
  return window.location.origin || window.location.href.split("#")[0];
}

function initialRouteState() {
  const pending = sessionStorage.getItem(PENDING_ROUTE_KEY);
  if (pending) {
    sessionStorage.removeItem(PENDING_ROUTE_KEY);
    return { path: pending, replace: true };
  }
  const hashRoute = cleanHashRoute();
  if (hashRoute) return { path: hashRoute, replace: true };
  return { path: window.location.pathname, replace: false };
}

function isLoggedIn() {
  return Boolean(state.supabaseSession);
}

function loadLocalProfile() {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY)) || {}; } catch { return {}; }
}

function saveLocalProfile(profile = {}) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...loadLocalProfile(), ...profile }));
}

function currentColorTheme() {
  const local = loadLocalProfile();
  const metadata = currentUserMetadata();
  const theme = local.color_theme || metadata.color_theme || DEFAULT_COLOR_THEME;
  return COLOR_PALETTES[theme] ? theme : DEFAULT_COLOR_THEME;
}

function currentColorMode() {
  const local = loadLocalProfile();
  const metadata = currentUserMetadata();
  const mode = local.color_mode || metadata.color_mode || DEFAULT_COLOR_MODE;
  return ["system", "dark", "light"].includes(mode) ? mode : DEFAULT_COLOR_MODE;
}

function resolvedColorMode(mode = currentColorMode()) {
  if (mode === "system") {
    return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
  }
  return mode === "dark" ? "dark" : "light";
}

function applyColorTheme(theme = currentColorTheme(), mode = currentColorMode()) {
  const palette = COLOR_PALETTES[theme] || COLOR_PALETTES[DEFAULT_COLOR_THEME];
  const resolvedMode = resolvedColorMode(mode);
  const vars = resolvedMode === "dark" ? palette.darkVars : palette.vars;
  document.documentElement.dataset.colorTheme = theme;
  document.documentElement.dataset.colorMode = resolvedMode;
  document.documentElement.dataset.colorPreference = mode;
  Object.entries(vars).forEach(([name, value]) => {
    document.documentElement.style.setProperty(name, value);
  });
}

function hydrateColorSettings() {
  const theme = currentColorTheme();
  const mode = currentColorMode();
  const resolvedMode = resolvedColorMode(mode);
  $$('input[name="colorTheme"]').forEach(input => {
    const inputPalette = COLOR_PALETTES[input.value] || COLOR_PALETTES[DEFAULT_COLOR_THEME];
    const swatches = resolvedMode === "dark" ? inputPalette.darkSwatches : inputPalette.swatches;
    input.checked = input.value === theme;
    const option = input.closest(".color-theme-option");
    option?.classList.toggle("is-selected", input.checked);
    option?.querySelectorAll(".palette-swatches i").forEach((swatch, index) => {
      swatch.style.background = swatches[index] || swatches[0];
    });
  });
  $$('input[name="colorMode"]').forEach(input => {
    input.checked = input.value === mode;
    input.closest(".color-mode-option")?.classList.toggle("is-selected", input.checked);
  });
  const palette = COLOR_PALETTES[theme] || COLOR_PALETTES[DEFAULT_COLOR_THEME];
  const label = $("#active-color-theme");
  if (label) label.textContent = `${palette.label}, ${mode === "system" ? `system ${resolvedMode}` : mode}`;
}

function currentUserMetadata() {
  return state.supabaseSession?.user?.user_metadata || {};
}

function currentDisplayName() {
  const metadata = currentUserMetadata();
  const local = loadLocalProfile();
  return metadata.display_name || metadata.full_name || metadata.name || local.display_name || "";
}

function currentUserEmail() {
  return state.supabaseSession?.user?.email || loadLocalProfile().email || "";
}

function currentUserAvatarUrl() {
  const metadata = currentUserMetadata();
  return metadata.avatar_url || metadata.picture || metadata.photo_url || "";
}

function profileInitial(name = currentDisplayName(), email = currentUserEmail()) {
  const source = name || email || "Reader";
  return source.trim().charAt(0).toUpperCase() || "R";
}

function renderProfileAvatar(node, name = currentDisplayName(), email = currentUserEmail()) {
  if (!node) return;
  const avatarUrl = currentUserAvatarUrl();
  node.textContent = "";
  node.classList.toggle("has-image", Boolean(avatarUrl));
  if (avatarUrl) {
    const image = document.createElement("img");
    image.src = avatarUrl;
    image.alt = "";
    image.referrerPolicy = "no-referrer";
    node.append(image);
    return;
  }
  node.textContent = profileInitial(name, email);
}

function updateProfileUI() {
  const name = currentDisplayName();
  const email = currentUserEmail();
  const label = name || "Reader profile";
  renderProfileAvatar($("#profile-button .avatar"), name, email);
  renderProfileAvatar($(".profile-menu-head .avatar"), name, email);
  $("#profile-button span:nth-child(2)").textContent = label;
  const menuName = $(".profile-menu-head strong");
  const menuEmail = $(".profile-menu-head small");
  if (menuName) menuName.textContent = label;
  if (menuEmail) menuEmail.textContent = email || "Prototype account";
}

function setSidebarCollapsed(collapsed) {
  document.body.classList.toggle("sidebar-collapsed", collapsed);
  const toggle = $("#toggle-sidebar");
  if (!toggle) return;
  toggle.setAttribute("aria-label", collapsed ? "Expand library" : "Collapse library");
  toggle.title = collapsed ? "Expand library" : "Collapse library";
}

function getSupabaseClient() {
  if (state.supabaseClient) return state.supabaseClient;
  const config = window.MARGIN_SUPABASE_CONFIG;
  if (!window.supabase?.createClient || !config?.url || !config?.anonKey) return null;
  state.supabaseClient = window.supabase.createClient(config.url, config.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
  return state.supabaseClient;
}

async function refreshSupabaseSession(render = false) {
  const client = getSupabaseClient();
  if (!client) return null;
  const { data, error } = await client.auth.getSession();
  if (error) {
    console.warn("Unable to read Supabase session.", error);
    return null;
  }
  state.supabaseSession = data.session || null;
  if (state.supabaseSession) localStorage.setItem(AUTH_KEY, "true");
  if (render) renderAuthState();
  return state.supabaseSession;
}

function renderAuthState() {
  const loggedIn = isLoggedIn();
  applyColorTheme();
  document.body.classList.toggle("logged-out", !loggedIn);
  setSidebarCollapsed(!loggedIn);
  updateProfileUI();
  if (loggedIn) {
    $("#onboarding-title").innerHTML = `<span data-local-greeting>${localGreeting()}</span><br><em>What stayed with you?</em>`;
    $("#onboarding-copy").textContent = "Turn the chapter you just finished into something you can explain, question, and use.";
    $("#hero-start-label").textContent = "Start a chapter check";
    $("#hero-reassurance").textContent = "No perfect summary required. Start with what you remember.";
  } else {
    $("#onboarding-title").innerHTML = "Remember what you read.<br><em>Use it when it matters.</em>";
    $("#onboarding-copy").textContent = "You already highlight, annotate, and save the good parts. Ember helps you find out what actually stuck, strengthen what didn’t, and turn nonfiction into knowledge you can explain and apply.";
    $("#hero-start-label").textContent = "Try it on a chapter";
    $("#hero-reassurance").textContent = "Use it for the chapters worth remembering. A focused check takes about six minutes.";
  }
  $("#profile-menu").hidden = true;
  $("#profile-button").setAttribute("aria-expanded", "false");
  renderDashboard();
}

function setLoggedIn(loggedIn) {
  localStorage.setItem(AUTH_KEY, String(loggedIn));
  if (!loggedIn) {
    state.currentId = null;
    state.reviewId = null;
    setView("home");
    toast("You successfully logged out.");
  } else {
    setView("home");
    toast("Welcome back. Your reading dashboard is restored.");
  }
  renderAuthState();
}

function setAccountStatus(id, message, type = "") {
  const node = $(id);
  if (!node) return;
  node.textContent = message;
  node.classList.toggle("is-success", type === "success");
  node.classList.toggle("is-error", type === "error");
}

function hydrateAccountSettings() {
  const metadata = currentUserMetadata();
  const local = loadLocalProfile();
  if ($("#account-name")) $("#account-name").value = currentDisplayName();
  if ($("#account-location")) $("#account-location").value = metadata.location || local.location || "";
  if ($("#account-email")) $("#account-email").value = currentUserEmail();
  if ($("#account-recovery-email")) $("#account-recovery-email").value = metadata.recovery_email || local.recovery_email || "";
  hydrateColorSettings();
}

function setAuthStatus(message = "") {
  const note = $("#auth-setup-note");
  if (!note) return;
  if (!message) {
    note.hidden = true;
    return;
  }
  note.hidden = false;
  note.innerHTML = `<strong>${escapeHtml(message)}</strong>`;
}

function openAuthDialog(mode = "login") {
  const dialog = $("#auth-dialog");
  if (!dialog) return;
  const client = getSupabaseClient();
  const isSignup = mode === "signup";
  state.authMode = isSignup ? "signup" : "login";
  $("#auth-dialog-title").textContent = isSignup ? "Create your Ember account" : "Log in to Ember";
  $("#email-auth-button").textContent = isSignup ? "Create account with email link" : "Email me a sign-in link";
  $("#password-auth-button").textContent = isSignup ? "Create account" : "Log in";
  setAuthStatus(client ? "" : "Real auth is not connected yet. Check supabase-config.js.");
  dialog.showModal();
  setTimeout(() => $("#auth-email")?.focus(), 100);
}

async function logOut() {
  const client = getSupabaseClient();
  if (client) await client.auth.signOut();
  state.supabaseSession = null;
  setLoggedIn(false);
}

async function handleMagicLinkSignIn(event) {
  event.preventDefault();
  const client = getSupabaseClient();
  if (!client) {
    setAuthStatus("Supabase is not connected yet. Check supabase-config.js.");
    return;
  }
  const email = $("#auth-email").value.trim();
  $("#auth-email").removeAttribute("aria-invalid");
  if (!email) {
    setAuthStatus("Enter an email address to continue.");
    $("#auth-email").setAttribute("aria-invalid", "true");
    $("#auth-email").focus();
    return;
  }
  const { error } = await client.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: authRedirectUrl(),
      shouldCreateUser: state.authMode === "signup"
    }
  });
  if (error) {
    toast(error.message);
    return;
  }
  toast("Check your email for the sign-in link.");
}

async function handlePasswordSignIn(event) {
  event.preventDefault();
  const client = getSupabaseClient();
  if (!client) {
    setAuthStatus("Supabase is not connected yet. Check supabase-config.js.");
    return;
  }
  const email = $("#password-auth-email").value.trim();
  const password = $("#password-auth-password").value;
  $("#password-auth-email").removeAttribute("aria-invalid");
  $("#password-auth-password").removeAttribute("aria-invalid");
  if (!email || !password) {
    setAuthStatus("Enter both your email address and password.");
    const field = !email ? $("#password-auth-email") : $("#password-auth-password");
    field.setAttribute("aria-invalid", "true");
    field.focus();
    return;
  }
  const { data, error } = state.authMode === "signup"
    ? await client.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: authRedirectUrl() }
    })
    : await client.auth.signInWithPassword({ email, password });
  if (error) {
    toast(error.message);
    return;
  }
  state.supabaseSession = data.session || null;
  localStorage.setItem(AUTH_KEY, "true");
  $("#auth-dialog").close();
  renderAuthState();
  toast(state.authMode === "signup" && !data.session ? "Check your email to confirm your account." : "You’re signed in.");
}

async function updateSupabaseUser(payload) {
  const client = getSupabaseClient();
  const session = await refreshSupabaseSession(false);
  if (!client || !session) return { error: null, skipped: true };
  const { data, error } = await client.auth.updateUser(payload);
  if (!error && data?.user) {
    state.supabaseSession = {
      ...session,
      user: data.user
    };
  }
  return { data, error, skipped: false };
}

async function handleAccountNameSubmit(event) {
  event.preventDefault();
  const displayName = $("#account-name").value.trim();
  if (!displayName) {
    setAccountStatus("#account-name-status", "Add the name you want Ember to use.", "error");
    return;
  }
  saveLocalProfile({ display_name: displayName });
  const { error, skipped } = await updateSupabaseUser({ data: { display_name: displayName } });
  if (error) {
    setAccountStatus("#account-name-status", error.message, "error");
    return;
  }
  updateProfileUI();
  setAccountStatus("#account-name-status", skipped ? "Saved locally for this prototype session." : "Display name saved.", "success");
}

async function handleReadingContextSubmit(event) {
  event.preventDefault();
  const location = $("#account-location").value.trim();
  saveLocalProfile({ location });
  const { error, skipped } = await updateSupabaseUser({ data: { location } });
  if (error) {
    setAccountStatus("#account-reading-context-status", error.message, "error");
    return;
  }
  setAccountStatus("#account-reading-context-status", skipped ? "Saved locally for this prototype session." : "Reading context saved.", "success");
}

async function handleColorThemeChange(event) {
  const input = event.target.closest('input[name="colorTheme"]');
  if (!input || !COLOR_PALETTES[input.value]) return;
  const colorTheme = input.value;
  saveLocalProfile({ color_theme: colorTheme });
  applyColorTheme(colorTheme, currentColorMode());
  hydrateColorSettings();
  const { error, skipped } = await updateSupabaseUser({ data: { color_theme: colorTheme } });
  if (error) {
    setAccountStatus("#account-color-status", error.message, "error");
    return;
  }
  setAccountStatus("#account-color-status", skipped ? "Saved locally for this prototype session." : "Color preference saved.", "success");
}

async function handleColorModeChange(event) {
  const input = event.target.closest('input[name="colorMode"]');
  if (!input) return;
  const colorMode = input.value === "system" ? "system" : input.value === "dark" ? "dark" : "light";
  saveLocalProfile({ color_mode: colorMode });
  applyColorTheme(currentColorTheme(), colorMode);
  hydrateColorSettings();
  const { error, skipped } = await updateSupabaseUser({ data: { color_mode: colorMode } });
  if (error) {
    setAccountStatus("#account-color-status", error.message, "error");
    return;
  }
  setAccountStatus("#account-color-status", skipped ? "Saved locally for this prototype session." : "Color mode saved.", "success");
}

function handleSystemColorSchemeChange() {
  if (currentColorMode() !== "system") return;
  applyColorTheme(currentColorTheme(), "system");
  hydrateColorSettings();
}

async function handleAccountEmailSubmit(event) {
  event.preventDefault();
  const email = $("#account-email").value.trim();
  if (!email) {
    setAccountStatus("#account-email-status", "Enter an email address.", "error");
    return;
  }
  saveLocalProfile({ email });
  const { error, skipped } = await updateSupabaseUser({ email });
  if (error) {
    setAccountStatus("#account-email-status", error.message, "error");
    return;
  }
  updateProfileUI();
  setAccountStatus("#account-email-status", skipped ? "Saved locally for this prototype session." : "Check your email to confirm this change if Supabase requires it.", "success");
}

async function handleAccountPasswordSubmit(event) {
  event.preventDefault();
  const password = $("#account-password").value;
  const confirm = $("#account-password-confirm").value;
  if (!password || !confirm) {
    setAccountStatus("#account-password-status", "Enter and confirm the new password.", "error");
    (!password ? $("#account-password") : $("#account-password-confirm")).focus();
    return;
  }
  if (password.length < 8) {
    setAccountStatus("#account-password-status", "Use at least 8 characters.", "error");
    $("#account-password").focus();
    return;
  }
  if (password !== confirm) {
    setAccountStatus("#account-password-status", "The passwords do not match.", "error");
    return;
  }
  const { error, skipped } = await updateSupabaseUser({ password });
  if (error) {
    setAccountStatus("#account-password-status", error.message, "error");
    return;
  }
  $("#account-password").value = "";
  $("#account-password-confirm").value = "";
  setAccountStatus("#account-password-status", skipped ? "Password changes require a Supabase session." : "Password updated.", skipped ? "error" : "success");
}

async function handleRecoveryEmailSubmit(event) {
  event.preventDefault();
  const recoveryEmail = $("#account-recovery-email").value.trim();
  saveLocalProfile({ recovery_email: recoveryEmail });
  const { error, skipped } = await updateSupabaseUser({ data: { recovery_email: recoveryEmail } });
  if (error) {
    setAccountStatus("#account-recovery-status", error.message, "error");
    return;
  }
  setAccountStatus("#account-recovery-status", skipped ? "Stored locally as an unverified secondary email." : "Stored as private account metadata · Unverified", "success");
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function safeHttpUrl(value = "") {
  const raw = String(value || "").trim();
  if (!raw) return "";
  try {
    const url = new URL(raw);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function readingTypeLabel(type = "book") {
  return {
    book: "Book",
    article: "Article",
    essay: "Essay",
    paper: "Paper",
    newsletter: "Newsletter",
    webpage: "Web page",
    other: "Something else"
  }[type] || "Book";
}

function displayBand(band = "") {
  return band === "Needs repair" ? "Needs another pass" : band;
}

function displayGapType(gap = "") {
  return gap === "Optional challenge" ? "Study challenge" : gap;
}

function isStudyChallengeGap(gap = "") {
  return ["Optional challenge", "Study challenge", "Limits and exceptions", "qualification_loss"].includes(gap);
}

function normalizeReviewPrompt(prompt = "") {
  const clean = String(prompt);
  const boundaryPrompts = [
    "Where might the chapter’s argument stop being useful or true?",
    "Where might the chapter's argument stop being useful or true?",
    "What assumption or boundary would make the chapter's argument less convincing?",
    "What assumption or boundary would make the chapter’s argument less convincing?"
  ];
  return boundaryPrompts.includes(clean)
    ? "Where might this chapter’s main idea break down?"
    : clean;
}

function words(text = "") {
  return (text.toLowerCase().match(/[a-z0-9']+/g) || []).filter(word => word.length > 3 && !stopWords.has(word));
}

function sentences(text = "") {
  return text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(item => item.trim()).filter(Boolean) || [];
}

function wordCount(text = "") {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function localGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return "Good morning.";
  if (hour >= 12 && hour < 17) return "Good afternoon.";
  return "Good evening.";
}

function topTerms(text, limit = 14) {
  const counts = new Map();
  words(text).forEach(word => counts.set(word, (counts.get(word) || 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([word]) => word);
}

function loadChapters() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}

function saveChapters(chapters) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chapters));
}

function safeReadStorage(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function safeWriteStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function bookKey(title, author = "") {
  return `${title.trim().toLocaleLowerCase()}::${author.trim().toLocaleLowerCase()}`;
}

function loadBookMetadata() {
  try { return JSON.parse(localStorage.getItem(BOOKS_KEY)) || []; } catch { return []; }
}

function saveBookMetadata(values) {
  const books = loadBookMetadata();
  const key = bookKey(values.bookTitle, values.authorName);
  const index = books.findIndex(book => book.key === key);
  const existing = index >= 0 ? books[index] : {};
  const total = Number(values.bookTotalChapters);
  const book = {
    ...existing,
    key,
    title: values.bookTitle,
    author: values.authorName || "",
    totalChapters: Number.isInteger(total) && total > 0 ? total : null,
    createdAt: existing.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  if (index >= 0) books[index] = book; else books.push(book);
  localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
}

function libraryTransferPayload() {
  return {
    app: "ember",
    version: 1,
    exportedAt: new Date().toISOString(),
    data: {
      chapters: safeReadStorage(STORAGE_KEY, []),
      books: safeReadStorage(BOOKS_KEY, []),
      practice: safeReadStorage(PRACTICE_KEY, []),
      collapsedBooks: safeReadStorage(COLLAPSED_BOOKS_KEY, []),
      bookOrder: safeReadStorage(BOOK_ORDER_KEY, []),
      focusBook: localStorage.getItem(FOCUS_BOOK_KEY) || ""
    }
  };
}

function sortNewestFirstValue(item = {}) {
  return Date.parse(item.updatedAt || item.createdAt || item.completedAt || "") || 0;
}

function mergeByKey(current = [], incoming = [], keyForItem) {
  const merged = new Map();
  current.forEach(item => {
    const key = keyForItem(item);
    if (key) merged.set(key, item);
  });
  incoming.forEach(item => {
    const key = keyForItem(item);
    if (!key) return;
    const existing = merged.get(key);
    if (!existing || sortNewestFirstValue(item) >= sortNewestFirstValue(existing)) {
      merged.set(key, { ...existing, ...item });
    }
  });
  return [...merged.values()];
}

function normalizeLibraryTransferPayload(payload = {}) {
  const data = payload.data || payload;
  return {
    chapters: Array.isArray(data.chapters) ? data.chapters : [],
    books: Array.isArray(data.books) ? data.books : [],
    practice: Array.isArray(data.practice) ? data.practice : [],
    collapsedBooks: Array.isArray(data.collapsedBooks) ? data.collapsedBooks : [],
    bookOrder: Array.isArray(data.bookOrder) ? data.bookOrder : [],
    focusBook: typeof data.focusBook === "string" ? data.focusBook : ""
  };
}

function exportLibraryData() {
  const payload = libraryTransferPayload();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `ember-library-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  setAccountStatus("#account-transfer-status", "Library export created. Import that file on ember.study.", "success");
}

function importLibraryData(payload) {
  const data = normalizeLibraryTransferPayload(payload);
  if (!data.chapters.length && !data.books.length && !data.practice.length) {
    throw new Error("That file does not include an Ember library export.");
  }

  const currentChapters = loadChapters();
  const nextChapters = mergeByKey(currentChapters, data.chapters, chapter => (
    chapter.id || `${bookKey(chapter.bookTitle || "", chapter.authorName || "")}::${(chapter.chapterTitle || "").trim().toLocaleLowerCase()}`
  ));
  saveChapters(nextChapters);

  const currentBooks = loadBookMetadata();
  const nextBooks = mergeByKey(currentBooks, data.books, book => (
    book.key || bookKey(book.title || book.bookTitle || "", book.author || book.authorName || "")
  ));
  safeWriteStorage(BOOKS_KEY, nextBooks);

  const currentPractice = safeReadStorage(PRACTICE_KEY, []);
  const nextPractice = mergeByKey(currentPractice, data.practice, record => (
    record.id || `${record.createdAt || ""}::${record.skillId || record.skill || ""}::${record.chapterId || record.chapterClientId || ""}`
  ));
  safeWriteStorage(PRACTICE_KEY, nextPractice);

  safeWriteStorage(COLLAPSED_BOOKS_KEY, [...new Set([...(safeReadStorage(COLLAPSED_BOOKS_KEY, []) || []), ...data.collapsedBooks])]);
  safeWriteStorage(BOOK_ORDER_KEY, [...new Set([...(safeReadStorage(BOOK_ORDER_KEY, []) || []), ...data.bookOrder])]);
  if (!localStorage.getItem(FOCUS_BOOK_KEY) && data.focusBook) localStorage.setItem(FOCUS_BOOK_KEY, data.focusBook);

  renderDashboard();
  toast("Library imported.");
  return {
    chapters: Math.max(0, nextChapters.length - currentChapters.length),
    books: Math.max(0, nextBooks.length - currentBooks.length),
    practice: Math.max(0, nextPractice.length - currentPractice.length)
  };
}

function bookRecordForChapter(chapter = {}, books = loadBookMetadata()) {
  const key = bookKey(chapter.bookTitle || "", chapter.authorName || "");
  const metadata = books.find(book => (book.key || bookKey(book.title, book.author)) === key) || {};
  const total = Number.parseInt(metadata.totalChapters || chapter.bookTotalChapters || "", 10);
  return {
    key,
    title: chapter.bookTitle || metadata.title || "Untitled book",
    author: chapter.authorName || metadata.author || "",
    total: Number.isFinite(total) && total > 0 ? total : null,
    metadata
  };
}

function bookStateFromEntry(entry, entries = [], books = loadBookMetadata()) {
  if (!entry) return null;
  const book = bookRecordForChapter(entry, books);
  const chapters = entries.filter(chapter => chapter.status !== "Draft");
  const bookEntries = entries.filter(chapter => bookKey(chapter.bookTitle, chapter.authorName || "") === book.key);
  const completed = chapters.filter(chapter => bookKey(chapter.bookTitle, chapter.authorName || "") === book.key).length;
  const latestChapter = bookEntries.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0] || entry;
  return {
    kind: latestChapter.status === "Draft"
      ? "draft"
      : book.total && completed >= book.total
        ? "complete"
        : "active",
    chapter: latestChapter,
    book,
    completed
  };
}

function focusBookOptions(entries = []) {
  const books = loadBookMetadata();
  const seen = new Set();
  return entries
    .map(entry => bookRecordForChapter(entry, books))
    .filter(book => {
      if (!book.key || seen.has(book.key)) return false;
      seen.add(book.key);
      return true;
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

function chooseCurrentReadingState(entries = []) {
  const chapters = entries.filter(chapter => chapter.status !== "Draft");
  const drafts = entries.filter(chapter => chapter.status === "Draft");
  const books = loadBookMetadata();
  const byUpdated = [...entries].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const focusKey = localStorage.getItem(FOCUS_BOOK_KEY);
  const focusedEntry = focusKey && byUpdated.find(chapter => bookKey(chapter.bookTitle, chapter.authorName || "") === focusKey);
  if (focusedEntry) return bookStateFromEntry(focusedEntry, entries, books);

  const draft = drafts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
  if (draft) {
    const book = bookRecordForChapter(draft, books);
    const completed = chapters.filter(chapter => bookKey(chapter.bookTitle, chapter.authorName || "") === book.key).length;
    return {
      kind: "draft",
      chapter: draft,
      book,
      completed
    };
  }

  const groups = new Map();
  chapters.forEach(chapter => {
    const book = bookRecordForChapter(chapter, books);
    if (!groups.has(book.key)) {
      groups.set(book.key, {
        book,
        chapters: [],
        latestChapter: chapter,
        latestUpdatedAt: chapter.updatedAt || chapter.createdAt
      });
    }
    const group = groups.get(book.key);
    group.chapters.push(chapter);
    const updatedAt = chapter.updatedAt || chapter.createdAt;
    if (new Date(updatedAt) > new Date(group.latestUpdatedAt || 0)) {
      group.latestChapter = chapter;
      group.latestUpdatedAt = updatedAt;
    }
  });

  const activeBook = [...groups.values()]
    .filter(group => group.book.total && group.chapters.length < group.book.total)
    .sort((a, b) => new Date(b.latestUpdatedAt) - new Date(a.latestUpdatedAt))[0];
  if (activeBook) {
    return {
      kind: "active",
      chapter: activeBook.latestChapter,
      book: activeBook.book,
      completed: activeBook.chapters.length
    };
  }

  const completedBook = [...groups.values()]
    .filter(group => group.book.total && group.chapters.length >= group.book.total)
    .sort((a, b) => new Date(b.latestUpdatedAt) - new Date(a.latestUpdatedAt))[0];
  if (completedBook) {
    return {
      kind: "complete",
      chapter: completedBook.latestChapter,
      book: completedBook.book,
      completed: completedBook.chapters.length
    };
  }

  const latest = byUpdated[0];
  if (!latest) return null;
  const book = bookRecordForChapter(latest, books);
  const completed = chapters.filter(chapter => bookKey(chapter.bookTitle, chapter.authorName || "") === book.key).length;
  return {
    kind: latest.status === "Draft" ? "draft" : "active",
    chapter: latest,
    book,
    completed
  };
}

function getValues() {
  return {
    bookPath: $('[name="bookPath"]:checked')?.value || "",
    bookTitle: $("#book-title").value.trim(),
    authorName: $("#author-name").value.trim(),
    bookTotalChapters: $("#book-total-chapters").value,
    chapterTitle: $("#chapter-title").value.trim(),
    readingType: $("#reading-type")?.value || "book",
    sourceUrl: $("#source-url")?.value.trim() || "",
    sourceKind: $('[name="sourceKind"]:checked')?.value || "full",
    sourceText: $("#source-text").value.trim(),
    pdfName: $("#pdf-source").dataset.fileName || "",
    pdfSize: Number($("#pdf-source").dataset.fileSize) || 0,
    recall: $("#recall").value.trim(),
    confidence: $('[name="confidence"]:checked')?.value || "",
    repair: $("#repair").value.trim(),
    wantsApplication: $("#wants-application")?.checked || false
  };
}

function setValues(values = {}) {
  $("#book-title").value = values.bookTitle || "";
  $("#author-name").value = values.authorName || "";
  $("#book-total-chapters").value = values.bookTotalChapters || "";
  $("#chapter-title").value = values.chapterTitle || "";
  if ($("#reading-type")) $("#reading-type").value = values.readingType || "book";
  if ($("#source-url")) $("#source-url").value = values.sourceUrl || "";
  syncReadingType();
  $("#source-text").value = values.sourceText || "";
  setPdfStatus(values.pdfName || "", values.pdfSize || 0, Boolean(values.pdfName));
  $("#recall").value = values.recall || "";
  $("#repair").value = values.repair || "";
  if ($("#wants-application")) $("#wants-application").checked = Boolean(values.wantsApplication);
  const bookPath = values.bookPath && $(`[name="bookPath"][value="${values.bookPath}"]`);
  if (bookPath) bookPath.checked = true;
  const sourceKind = $(`[name="sourceKind"][value="${values.sourceKind || "full"}"]`);
  if (sourceKind) sourceKind.checked = true;
  const confidence = values.confidence && $(`[name="confidence"][value="${values.confidence}"]`);
  if (confidence) confidence.checked = true;
  updateCounts();
  syncBookPath();
  syncSourceKind();
}

function renderBookOptions(preferredTitle = "", preferredAuthor = "") {
  const books = new Map();
  loadBookMetadata().forEach(book => {
    books.set(book.key || bookKey(book.title, book.author), {
      title: book.title,
      author: book.author || "",
      totalChapters: book.totalChapters || null
    });
  });
  loadChapters().forEach(chapter => {
    const key = bookKey(chapter.bookTitle, chapter.authorName || "");
    if (!books.has(key)) books.set(key, {
      title: chapter.bookTitle,
      author: chapter.authorName || "",
      totalChapters: chapter.bookTotalChapters || null
    });
  });
  const chapters = loadChapters();
  state.availableBooks = [...books.values()].map(book => ({
    ...book,
    completedChapters: chapters.filter(chapter => chapter.status !== "Draft" && bookKey(chapter.bookTitle, chapter.authorName || "") === bookKey(book.title, book.author)).length
  }));
  $("#existing-book").innerHTML = '<option value="">Select from your library</option>' +
  state.availableBooks.map((book, index) => `<option value="${index}">${escapeHtml(book.title)}${book.author ? ` by ${escapeHtml(book.author)}` : ""} · ${book.completedChapters}${book.totalChapters ? ` of ${book.totalChapters}` : ""} completed</option>`).join("");
  const existingRadio = $('[name="bookPath"][value="existing"]');
  existingRadio.disabled = state.availableBooks.length === 0;
  existingRadio.closest("label").hidden = state.availableBooks.length === 0;

  const preferredIndex = state.availableBooks.findIndex(book => book.title === preferredTitle && book.author === (preferredAuthor || ""));
  if (preferredIndex >= 0) {
    $("#existing-book").value = String(preferredIndex);
    existingRadio.checked = true;
    $("#book-details").open = true;
  } else if (state.availableBooks.length) {
    existingRadio.checked = true;
    $("#existing-book").value = "0";
  } else {
    $('[name="bookPath"][value="new"]').checked = true;
  }
  syncReadingType();
}

function syncBookPath() {
  const path = $('[name="bookPath"]:checked')?.value;
  $("#existing-book-panel").hidden = path !== "existing";
  $("#new-book-panel").hidden = path !== "new";
  if (path === "existing") {
    const selected = state.availableBooks[Number($("#existing-book").value)];
    $("#book-title").value = selected?.title || "";
    $("#author-name").value = selected?.author || "";
    $("#book-total-chapters").value = selected?.totalChapters || "";
    $("#existing-book-help").textContent = selected
      ? `${selected.completedChapters}${selected.totalChapters ? ` of ${selected.totalChapters}` : ""} chapters completed. Book metadata will be carried forward.`
      : "The author and book title will be carried forward automatically.";
  }
}

function syncReadingType() {
  const type = $("#reading-type")?.value || "book";
  const isBook = type === "book";
  const typeNames = {
    article: "Article",
    essay: "Essay",
    paper: "Paper",
    newsletter: "Newsletter",
    webpage: "Web page",
    other: "Source"
  };
  const sourceName = typeNames[type] || "Source";
  $("#book-title-label").innerHTML = isBook ? 'Book title <b>Required</b>' : `${sourceName} title <b>Required</b>`;
  $("#book-title").placeholder = isBook ? "e.g. Deep Work" : "e.g. The Art of Noticing";
  $("#chapter-title-label").innerHTML = isBook ? 'Chapter or section <b>Required</b>' : 'Section or focus <b>Required</b>';
  $("#chapter-title").placeholder = isBook ? "e.g. Deep Work Is Valuable" : "e.g. Main argument, introduction, or section title";
  $("#book-details").hidden = !isBook;
  if (!isBook) {
    $('[name="bookPath"][value="new"]').checked = true;
    $("#book-total-chapters").value = "";
  }
  syncBookPath();
}

function setIntakeStep(step, { focus = true } = {}) {
  state.intakeStep = Math.max(0, Math.min(2, Number(step) || 0));
  $$("[data-intake-panel]").forEach(panel => {
    const active = Number(panel.dataset.intakePanel) === state.intakeStep;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
  });
  $$("[data-intake-progress]").forEach(item => {
    const index = Number(item.dataset.intakeProgress);
    item.classList.toggle("is-active", index === state.intakeStep);
    item.classList.toggle("is-complete", index < state.intakeStep);
  });
  if (!focus) return;
  const focusTargets = ["#reading-type", "#author-name", "#source-text"];
  setTimeout(() => $(focusTargets[state.intakeStep])?.focus(), 80);
}

function validateIntakeStep() {
  const values = getValues();
  ["#book-title", "#chapter-title", "#source-url"].forEach(selector => $(selector)?.removeAttribute("aria-invalid"));
  if (state.intakeStep === 0 && (!values.bookTitle || !values.chapterTitle)) {
    const isBook = values.readingType === "book";
    toast(`Add a ${isBook ? "book" : "source"} title and ${isBook ? "chapter" : "section"} first.`);
    const field = !values.bookTitle ? $("#book-title") : $("#chapter-title");
    field.setAttribute("aria-invalid", "true");
    field.focus();
    return false;
  }
  if (state.intakeStep === 1 && values.sourceUrl && !safeHttpUrl(values.sourceUrl)) {
    toast("Add a valid source URL beginning with http or https, or leave it blank.");
    $("#source-url").setAttribute("aria-invalid", "true");
    $("#source-url").focus();
    return false;
  }
  return true;
}

function saveDraft() {
  if (!isLoggedIn()) return;
  const values = getValues();
  localStorage.setItem(DRAFT_KEY, JSON.stringify({
    ...values,
    id: state.currentId,
    draftStep: state.step,
    draftIntakeStep: state.intakeStep
  }));
  autosaveVisibleDraft(values);
}

function restoreSavedDraft() {
  if (state.draftRestored) return true;
  if (!isLoggedIn()) {
    renderBookOptions();
    return false;
  }
  try {
    const draft = JSON.parse(localStorage.getItem(DRAFT_KEY));
    if (draft && Object.values(draft).some(Boolean)) {
      state.draftRestored = true;
      state.currentId = draft.id || null;
      renderBookOptions(draft.bookTitle, draft.authorName);
      setValues(draft);
      setIntakeStep(draft.draftIntakeStep || 0, { focus: false });
      return true;
    }
  } catch {
    localStorage.removeItem(DRAFT_KEY);
  }
  renderBookOptions();
  return false;
}

function autosaveVisibleDraft(values = getValues()) {
  if (!values.bookTitle || !values.chapterTitle) return null;
  const chapters = loadChapters();
  const now = new Date().toISOString();
  const id = state.currentId || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const existingIndex = chapters.findIndex(chapter => chapter.id === id);
  const draft = {
    ...(existingIndex >= 0 ? chapters[existingIndex] : {}),
    id,
    ...values,
    status: "Draft",
    evaluation: state.evaluation,
    repairResolved: state.repairResolved,
    reviewDue: null,
    reviewSchedule: null,
    fsrsCard: null,
    delayedAttempts: existingIndex >= 0 ? chapters[existingIndex].delayedAttempts || [] : [],
    draftStep: state.step,
    updatedAt: now,
    createdAt: existingIndex >= 0 ? chapters[existingIndex].createdAt : now
  };
  if (existingIndex >= 0) chapters[existingIndex] = draft; else chapters.push(draft);
  saveChapters(chapters);
  saveBookMetadata(values);
  state.currentId = id;
  renderDashboard();
  return draft;
}

function saveEntryDraft() {
  const values = getValues();
  if (!values.bookTitle || !values.chapterTitle) {
    toast("Choose a book and add a chapter title before saving this draft.");
    (!values.bookTitle ? $("#book-title") : $("#chapter-title")).focus();
    return;
  }
  autosaveVisibleDraft(values);
  localStorage.removeItem(DRAFT_KEY);
  setView("home");
  toast("Draft saved. Resume it whenever you’re ready.");
}

function toast(message) {
  const element = $("#toast");
  element.textContent = message;
  element.classList.add("is-visible");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => element.classList.remove("is-visible"), 2800);
}

function setView(name, { updateUrl = true, replaceUrl = false } = {}) {
  state.view = name;
  $$(".view").forEach(view => view.classList.toggle("is-active", view.dataset.view === name));
  $$(".nav-item").forEach(item => item.classList.toggle("is-active", item.dataset.nav === name));
  $$("[data-marketing-nav]").forEach(item => item.classList.toggle("is-active", item.dataset.marketingNav === name));
  document.body.classList.remove("mobile-nav-open");
  $("#marketing-mobile-menu")?.removeAttribute("open");
  $("#profile-menu").hidden = true;
  $("#profile-button").setAttribute("aria-expanded", "false");
  if (updateUrl && (MARKETING_ROUTES[name] || name === "home")) syncUrlForView(name, replaceUrl ? "replace" : "push");
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (name === "home" || name === "reviews") renderDashboard();
  if (name === "account") hydrateAccountSettings();
}

function setStep(step) {
  state.step = Math.max(0, Math.min(5, step));
  $$(".flow-step").forEach(panel => panel.classList.toggle("is-active", Number(panel.dataset.step) === state.step));
  $$("#progress li").forEach((item, index) => {
    const mapped = state.step === 2 ? 1 : state.step > 2 ? state.step - 1 : state.step;
    item.classList.toggle("is-active", index === mapped);
    item.classList.toggle("is-complete", index < mapped);
    if (index === mapped) item.setAttribute("aria-current", "step");
    else item.removeAttribute("aria-current");
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function closeProfileMenu({ returnFocus = false } = {}) {
  const menu = $("#profile-menu");
  const button = $("#profile-button");
  if (!menu || !button) return;
  const wasOpen = !menu.hidden;
  menu.hidden = true;
  button.setAttribute("aria-expanded", "false");
  if (returnFocus && wasOpen) button.focus();
}

function resetAnalysisTransition() {
  const transition = $("#analysis-transition");
  const results = $("#feedback-results");
  if (!transition || !results) return;
  transition.hidden = false;
  transition.classList.remove("is-exiting");
  results.hidden = true;
  results.classList.remove("is-entering");
  $$("[data-analysis-module]").forEach(module => {
    module.classList.remove("is-measuring", "is-complete");
    module.style.setProperty("--analysis-progress", "0%");
    const stateLabel = module.querySelector("em");
    if (stateLabel) stateLabel.textContent = "Queued";
  });
}

function completeAnalysisTransition(evaluation) {
  const modules = [
    ["central-claim", evaluation.band === "Strong" ? "Strong" : evaluation.gapType === "Missed central claim" ? "Needs work" : "Measured"],
    ["supporting-ideas", evaluation.gapType === "Missed supporting evidence" ? "Needs work" : "Measured"],
    ["source-fidelity", evaluation.gapType === "Unsupported claim" || evaluation.gapType === "Distorted idea" ? "Review" : "Aligned"],
    ["next-challenge", "Ready"],
  ];
  modules.forEach(([name, label]) => {
    const module = $(`[data-analysis-module="${name}"]`);
    if (!module) return;
    module.classList.remove("is-measuring");
    module.classList.add("is-complete");
    module.style.setProperty("--analysis-progress", "100%");
    const stateLabel = module.querySelector("em");
    if (stateLabel) stateLabel.textContent = label;
  });
}

function revealFeedbackResults() {
  const transition = $("#analysis-transition");
  const results = $("#feedback-results");
  if (!transition || !results) return;
  transition.classList.add("is-exiting");
  setTimeout(() => {
    transition.hidden = true;
    transition.classList.remove("is-exiting");
    results.hidden = false;
    results.classList.add("is-entering");
    requestAnimationFrame(() => results.classList.remove("is-entering"));
  }, 260);
}

function runAnalysisTransition(evaluation, onComplete) {
  resetAnalysisTransition();
  let workSettled = false;
  const workPromise = Promise.resolve()
    .then(onComplete)
    .finally(() => {
      workSettled = true;
    });
  const modules = $$("[data-analysis-module]");
  const stepDuration = 520;
  modules.forEach((module, index) => {
    setTimeout(() => {
      module.classList.add("is-measuring");
      module.style.setProperty("--analysis-progress", "72%");
      const stateLabel = module.querySelector("em");
      if (stateLabel) stateLabel.textContent = "Measuring";
    }, index * stepDuration);
    setTimeout(() => {
      module.classList.remove("is-measuring");
      module.classList.add("is-complete");
      module.style.setProperty("--analysis-progress", "100%");
      const stateLabel = module.querySelector("em");
      if (stateLabel) stateLabel.textContent = "Measured";
    }, index * stepDuration + stepDuration - 110);
  });
  setTimeout(async () => {
    if (!workSettled) {
      const finalModule = modules.at(-1);
      const stateLabel = finalModule?.querySelector("em");
      if (stateLabel) stateLabel.textContent = "Finalizing";
      finalModule?.classList.add("is-measuring");
      finalModule?.classList.remove("is-complete");
      finalModule?.style.setProperty("--analysis-progress", "86%");
    }
    await workPromise;
    completeAnalysisTransition(state.evaluation || evaluation);
    setTimeout(revealFeedbackResults, 850);
  }, modules.length * stepDuration + 450);
}

function startNew(prefill = null) {
  state.currentId = null;
  state.evaluation = null;
  state.repairResolved = false;
  state.intakeStep = 0;
  $("#check-form").reset();
  renderBookOptions(prefill?.bookTitle, prefill?.authorName);
  const bookPath = prefill?.bookPath || (prefill?.bookTitle && state.availableBooks.length ? "existing" : "new");
  setValues({ ...(prefill || {}), bookPath });
  if (prefill?.bookTitle && state.availableBooks.some(book => book.title === prefill.bookTitle && book.author === (prefill.authorName || ""))) {
    renderBookOptions(prefill.bookTitle, prefill.authorName);
  }
  localStorage.removeItem(DRAFT_KEY);
  setIntakeStep(0, { focus: false });
  setStep(0);
  setView("flow");
  setTimeout(() => {
    const activePath = $('[name="bookPath"]:checked')?.value;
    (activePath === "existing" ? $("#chapter-title") : $("#book-title"))?.focus();
  }, 100);
}

function updateCounts() {
  $("#recall-words").textContent = `${wordCount($("#recall").value)} words`;
  const count = wordCount($("#source-text").value);
  $("#source-status").textContent = count
    ? `${count.toLocaleString()} words supplied · ${count < 45 ? "More context will improve feedback." : "Enough context for a prototype check."}`
    : "Your text stays private in this prototype.";
}

function syncSourceKind() {
  const isPdf = $('[name="sourceKind"]:checked')?.value === "pdf";
  $("#pdf-source").hidden = !isPdf;
  $("#source-text").placeholder = isPdf
    ? "Extracted PDF text will appear here. Review it or paste the relevant chapter text."
    : "Paste the chapter, excerpt, or detailed notes here.";
}

function setPdfStatus(name = "", size = 0, attached = false) {
  const container = $("#pdf-source");
  container.dataset.fileName = name;
  container.dataset.fileSize = String(size || 0);
  container.classList.toggle("has-file", attached);
  $("#pdf-upload-title").textContent = attached ? name : "Choose a PDF";
  $("#pdf-upload-copy").textContent = attached
    ? `${(size / 1024 / 1024).toFixed(1)} MB · attached`
    : "Text-based PDF · up to 10 MB";
  $(".pdf-remove").hidden = !attached;
}

function decodePdfString(value) {
  return value
    .replace(/\\([nrtbf()\\])/g, (_, char) => ({ n: "\n", r: "\r", t: "\t", b: "\b", f: "\f", "(": "(", ")": ")", "\\": "\\" })[char])
    .replace(/\\([0-7]{1,3})/g, (_, octal) => String.fromCharCode(parseInt(octal, 8)));
}

function extractPdfText(buffer) {
  const raw = new TextDecoder("latin1").decode(buffer);
  const textBlocks = raw.match(/BT[\s\S]*?ET/g) || [];
  const pieces = [];
  textBlocks.forEach(block => {
    const strings = block.match(/\((?:\\.|[^\\)])*\)/g) || [];
    strings.forEach(item => pieces.push(decodePdfString(item.slice(1, -1))));
  });
  return pieces.join(" ").replace(/\s+/g, " ").trim();
}

async function handlePdfUpload(file) {
  if (!file) return;
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    toast("Choose a PDF file.");
    $("#pdf-file").value = "";
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    toast("Choose a PDF smaller than 10 MB.");
    $("#pdf-file").value = "";
    return;
  }
  const buffer = await file.arrayBuffer();
  const header = new TextDecoder("latin1").decode(buffer.slice(0, 5));
  if (header !== "%PDF-") {
    toast("This file does not appear to be a valid PDF.");
    $("#pdf-file").value = "";
    return;
  }
  setPdfStatus(file.name, file.size, true);
  const extracted = extractPdfText(buffer);
  if (wordCount(extracted) >= 25) {
    $("#source-text").value = extracted;
    updateCounts();
    $("#source-status").textContent = `${wordCount(extracted).toLocaleString()} words extracted from ${file.name}. Review the text before continuing.`;
    toast("PDF attached and text extracted.");
  } else {
    $("#source-status").textContent = `${file.name} is attached, but its text could not be extracted reliably. Paste the relevant chapter text below.`;
    toast("PDF attached. Paste the chapter text to continue.");
  }
  saveDraft();
}

function removePdf() {
  $("#pdf-file").value = "";
  $("#source-text").value = "";
  setPdfStatus();
  updateCounts();
  saveDraft();
  toast("PDF removed.");
}

function validateSource() {
  const values = getValues();
  ["#book-title", "#chapter-title", "#source-text", "#pdf-file", "#source-url"].forEach(selector => $(selector)?.removeAttribute("aria-invalid"));
  if (values.sourceUrl && !safeHttpUrl(values.sourceUrl)) {
    toast("Add a valid source URL beginning with http or https, or leave it blank.");
    $("#source-url").setAttribute("aria-invalid", "true");
    $("#source-url").focus();
    return false;
  }
  if (values.sourceKind === "pdf" && !values.pdfName) {
    toast("Attach a PDF before beginning recall.");
    $("#pdf-file").setAttribute("aria-invalid", "true");
    $("#pdf-file").focus();
    return false;
  }
  if (!values.bookTitle || !values.chapterTitle || !values.sourceText) {
    toast(`Add a ${values.readingType === "book" ? "book" : "source"} title, ${values.readingType === "book" ? "chapter" : "section"}, and source material first.`);
    const field = !values.bookTitle ? $("#book-title") : !values.chapterTitle ? $("#chapter-title") : $("#source-text");
    field.setAttribute("aria-invalid", "true");
    field.focus();
    return false;
  }
  if (wordCount(values.sourceText) < 25) {
    toast("Add a little more source material so the feedback has a reliable anchor.");
    $("#source-text").setAttribute("aria-invalid", "true");
    $("#source-text").focus();
    return false;
  }
  return true;
}

function findEvidence(source, terms, answerTerms, preferMissing = false) {
  const candidates = sentences(source).map((sentence, index) => {
    const sentenceTerms = new Set(words(sentence));
    const sourceHits = terms.filter(term => sentenceTerms.has(term)).length;
    const answerHits = [...answerTerms].filter(term => sentenceTerms.has(term)).length;
    return { sentence, index, score: sourceHits + (preferMissing ? Math.max(0, 4 - answerHits) : answerHits * 1.5) };
  }).sort((a, b) => b.score - a.score);
  return candidates[0] || { sentence: sentences(source)[0] || source.slice(0, 240), index: 0, score: 0 };
}

function sentenceSnippet(text = "") {
  return String(text).replace(/\s+/g, " ").trim();
}

function keyNamesFromSource(source = "") {
  const matches = String(source).match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2}\b/g) || [];
  const stop = new Set(["The", "This", "That", "These", "Those", "Chapter", "When", "After", "Before", "But", "And"]);
  return [...new Set(matches.filter(name => !stop.has(name.split(" ")[0])))]
    .slice(0, 8)
    .map(name => ({ name, role: "Named detail the author uses to make the idea easier to explain later." }));
}

function keyTimeMarkersFromSource(source = "") {
  const matches = String(source).match(/\b(?:\d{3,4}s?|\d+\s+(?:years|decades|centuries|months|weeks|days)|Victorian|modern|ancient|early|late)\b/gi) || [];
  return [...new Set(matches.map(match => match.trim()))].slice(0, 4);
}

function buildLocalReadingMap(source = "", evaluation = {}) {
  const sourceSentences = sentences(source);
  const strongest = evaluation.strengthEvidence?.sentence || sourceSentences[0] || source.slice(0, 260);
  const terms = topTerms(source).slice(0, 6);
  const relationshipSignals = /\b(because|therefore|depends|leads|requires|means|while|but|however|instead|rather|although)\b/i;
  const relationSentences = sourceSentences.filter(sentence => relationshipSignals.test(sentence)).slice(0, 4);
  const contrastSentences = sourceSentences.filter(sentence => /\b(but|while|however|rather|instead|contrast|unlike)\b/i.test(sentence)).slice(0, 3);
  const qualificationSentences = sourceSentences.filter(sentence => /\b(if|unless|only|except|boundary|limit|condition|depends|not enough)\b/i.test(sentence)).slice(0, 3);
  const timeMarkers = keyTimeMarkersFromSource(source);
  const entityAnchors = keyNamesFromSource(source).slice(0, 4).map((entity, index) => ({
    id: `entity-${index + 1}`,
    type: "entity",
    text: entity.name,
    why_it_matters: entity.role
  }));
  const temporalAnchors = timeMarkers.map((text, index) => ({
    id: `temporal-${index + 1}`,
    type: "temporal",
    text,
    why_it_matters: "Timing can explain why an example matters, not just when it happened."
  }));
  const relationshipAnchors = relationSentences.slice(0, 3).map((sentence, index) => ({
    id: `relationship-${index + 1}`,
    type: "relationship",
    text: sentenceSnippet(sentence),
    why_it_matters: "This sentence helps show how two ideas depend on, contrast with, or change one another."
  }));
  const evidenceAnchors = [evaluation.gapEvidence?.sentence, evaluation.strengthEvidence?.sentence]
    .filter(Boolean)
    .slice(0, 2)
    .map((sentence, index) => ({
      id: `evidence-${index + 1}`,
      type: "evidence",
      text: sentenceSnippet(sentence),
      why_it_matters: "This concrete detail can help the reader explain the chapter with evidence."
    }));

  return {
    central_claim: sentenceSnippet(strongest, 28),
    supporting_ideas: terms.slice(0, 6).map((term, index) => ({
      id: `idea-${index + 1}`,
      idea: term,
      role: "Recurring source idea to check against the reader's recall."
    })),
    key_examples: [evaluation.gapEvidence?.sentence, evaluation.strengthEvidence?.sentence]
      .filter(Boolean)
      .slice(0, 4)
      .map((sentence, index) => ({
        id: `example-${index + 1}`,
        text: sentenceSnippet(sentence),
        why_it_matters: "The example gives the recalled idea something specific to stand on."
      })),
    key_entities: keyNamesFromSource(source),
    relationships: relationSentences.map((sentence, index) => ({
      id: `relationship-${index + 1}`,
      from: "One source idea",
      to: "Another source idea",
      relationship: sentenceSnippet(sentence)
    })),
    contrasts: contrastSentences.map((sentence, index) => ({
      id: `contrast-${index + 1}`,
      side_a: "First side of the contrast",
      side_b: "Second side of the contrast",
      meaning: sentenceSnippet(sentence)
    })),
    qualifications: qualificationSentences.map((sentence, index) => ({
      id: `qualification-${index + 1}`,
      text: sentenceSnippet(sentence),
      why_it_matters: "This keeps the chapter's argument from becoming too broad or generic."
    })),
    recall_anchors: [
      {
        id: "claim-1",
        type: "claim",
        text: sentenceSnippet(strongest),
        why_it_matters: "The claim is the handle for explaining the chapter later."
      },
      ...entityAnchors,
      ...temporalAnchors,
      ...relationshipAnchors,
      ...evidenceAnchors
    ].slice(0, 12),
    common_misreadings: evaluation.gap ? [evaluation.gap] : [],
    why_it_matters: "This map gives Ember a stable understanding of the chapter before it evaluates what came back from memory."
  };
}

function evaluateResponse(source, response, sourceKind) {
  const sourceTerms = topTerms(source);
  const answerTerms = new Set(words(response));
  const matched = sourceTerms.filter(term => answerTerms.has(term));
  const missing = sourceTerms.filter(term => !answerTerms.has(term));
  const coverage = sourceTerms.length ? matched.length / sourceTerms.length : 0;
  const responseLength = wordCount(response);
  const thinSource = wordCount(source) < 45;

  let band = "Needs another pass";
  if (thinSource || responseLength < 4) band = "Not enough evidence";
  else if (coverage >= .5 && responseLength >= 35) band = "Strong";
  else if (coverage >= .25 && responseLength >= 18) band = "Developing";

  const strengthEvidence = findEvidence(source, sourceTerms, answerTerms, false);
  let gapEvidence = findEvidence(source, missing.length ? missing : sourceTerms, answerTerms, true);
  const relationSignals = ["because", "therefore", "depends", "leads", "requires", "means", "while", "but"];
  const hasRelations = relationSignals.some(signal => response.toLowerCase().includes(signal));

  let gapType = "Missed supporting evidence";
  let gap = `Your answer could make the role of “${missing.slice(0, 2).join("” and “") || "the supporting evidence"}” more explicit.`;
  let prompt = `Using the excerpt below, explain how it supports or changes the chapter's central claim.`;

  if (responseLength < 4) {
    gapType = "Insufficient response";
    gap = "There is not enough of your own account to compare responsibly.";
    prompt = "Start with one sentence: what did the author most want the reader to believe?";
  } else if (!hasRelations) {
    gapType = "Weak relationship between ideas";
    gap = "You name useful ideas, but the relationship between them remains implicit.";
    prompt = "How do the chapter's main ideas depend on or reinforce one another?";
  } else if (coverage < .25) {
    gapType = "Missed central claim";
    gap = "Your response touches the topic but does not yet reconstruct enough of the chapter's central argument.";
    prompt = "Restate the central claim, then name the strongest reason the author gives for it.";
  }

  if (band === "Strong") {
    gapType = "Study challenge";
    gap = "No consequential misconception is visible in this response. If you want to go further, test the boundary of the author's argument.";
    prompt = "Where might this chapter’s main idea break down?";
    const sourceSentences = sentences(source);
    gapEvidence = {
      sentence: sourceSentences.at(-1) || strengthEvidence.sentence,
      index: Math.max(0, sourceSentences.length - 1),
      score: 1
    };
  }

  if (!["full", "pdf"].includes(sourceKind) && band === "Strong") band = "Developing";
  const evaluation = {
    band,
    coverage,
    responseWordCount: responseLength,
    strength: matched.length
      ? `You recovered the chapter's emphasis on ${matched.slice(0, 3).join(", ")} and kept the account in your own words.`
      : "You made an original retrieval attempt instead of copying from the source.",
    gapType,
    gap,
    prompt,
    strengthEvidence,
    gapEvidence,
    sourceKind,
    uncertainty: ["full", "pdf"].includes(sourceKind) ? "" : `This is based on ${sourceKind}; it may not represent the full chapter.`
  };
  evaluation.readingMap = buildLocalReadingMap(source, evaluation);
  return evaluation;
}

function mergeStructuredEvaluation(localEvaluation, result = {}) {
  if (!result?.grading_result) return localEvaluation;
  const score = Number(result.grading_result.overall_score);
  const band = Number.isFinite(score)
    ? score >= 80 ? "Strong" : score >= 50 ? "Developing" : "Needs another pass"
    : localEvaluation.band;
  const missed = result.grading_result.feedback?.what_you_missed || [];
  const distorted = result.grading_result.feedback?.what_may_be_distorted || [];
  const reviewNext = result.grading_result.feedback?.what_to_review_next || [];
  const primaryDiagnosis = result.grading_result.recall_pattern_diagnosis?.[0];
  const nextPrompt = reviewNext[0] || localEvaluation.prompt;
  const normalizedPrompt = normalizeReviewPrompt(nextPrompt);
  return {
    ...localEvaluation,
    band,
    responseWordCount: localEvaluation.responseWordCount,
    gapType: primaryDiagnosis ? recallPatternLabel(primaryDiagnosis.pattern) : localEvaluation.gapType,
    gap: missed[0] || distorted[0] || localEvaluation.gap,
    prompt: normalizedPrompt,
    answerKey: result.answer_key || localEvaluation.answerKey,
    readingMap: result.reading_map || localEvaluation.readingMap,
    gradingResult: result.grading_result,
    gradeId: result.grade_id || null,
    readingMapId: result.reading_map_id || null,
    gradedAt: result.created_at || new Date().toISOString()
  };
}

async function gradeRecallWithSupabase(values, localEvaluation) {
  const client = getSupabaseClient();
  if (!client) return { evaluation: localEvaluation, mode: "local", reason: "Supabase is not configured." };
  const session = await refreshSupabaseSession(false);
  if (!session?.access_token) {
    return { evaluation: localEvaluation, mode: "local", reason: "No active Supabase session." };
  }
  const chapterId = state.currentId || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  state.currentId = chapterId;
  const { data, error } = await client.functions.invoke("grade-free-recall", {
    body: {
      chapter_id: chapterId,
      passage: values.sourceText,
      user_response: values.recall
    },
    headers: {
      Authorization: `Bearer ${session.access_token}`
    }
  });
  if (error) throw error;
  return {
    evaluation: mergeStructuredEvaluation(localEvaluation, data),
    mode: "supabase",
    data
  };
}

function withTimeout(promise, timeoutMs, message) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
}

async function regenerateNextTimeCoaching(limit = 50) {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase is not configured.");
  const session = await refreshSupabaseSession(false);
  if (!session?.access_token) throw new Error("Sign in before refreshing generated feedback.");
  const { data, error } = await client.functions.invoke("regenerate-next-time-coaching", {
    body: {
      limit,
      only_missing: false
    },
    headers: {
      Authorization: `Bearer ${session.access_token}`
    }
  });
  if (error) throw error;
  return data || { updated_count: 0, updated_grade_ids: [] };
}

window.regenerateNextTimeCoaching = regenerateNextTimeCoaching;

function syncGeneratedCoachingToLocalChapters(data = {}) {
  const updatedGrades = Array.isArray(data.updated_grades) ? data.updated_grades : [];
  if (!updatedGrades.length) return 0;
  const chapters = loadChapters();
  let changed = 0;
  updatedGrades.forEach(row => {
    const index = chapters.findIndex(chapter => chapter.id === row.chapter_client_id);
    if (index < 0 || !row.grading_result) return;
    chapters[index] = {
      ...chapters[index],
      evaluation: {
        ...(chapters[index].evaluation || {}),
        gradingResult: row.grading_result
      },
      updatedAt: new Date().toISOString()
    };
    changed += 1;
  });
  if (changed) {
    saveChapters(chapters);
    renderDashboard();
    if (state.view === "chapter" && state.currentId && chapters.some(chapter => chapter.id === state.currentId)) openChapter(state.currentId);
  }
  return changed;
}

function confidencePhrase(confidence = "") {
  return {
    "Not yet": "You thought the thread was not there yet.",
    "Partly": "You thought you had pieces of it.",
    "Mostly": "You thought the argument was mostly clear.",
    "Very well": "You thought you could explain it to someone else."
  }[confidence] || "You made an estimate before feedback.";
}

function localStructuredFeedback(evaluation = {}) {
  const remembered = evaluation.strength ? [evaluation.strength] : ["You made a real attempt to recall the chapter without copying from the source."];
  const missed = evaluation.band === "Strong" ? [] : [evaluation.gap].filter(Boolean);
  const distorted = evaluation.gapType === "Unsupported claim" || evaluation.gapType === "Distorted idea" ? [evaluation.gap] : [];
  const rubric = rubricScoresForEvaluation({ ...evaluation, gradingResult: null });
  return {
    overall_score: rubric.overall,
    rubric_scores: {
      central_claim: rubric.central_claim,
      supporting_ideas: rubric.supporting_ideas,
      relationship_between_ideas: rubric.relationship_between_ideas,
      source_fidelity: rubric.source_fidelity,
      transfer_application: rubric.transfer_application
    },
    feedback: {
      what_you_remembered: remembered,
      what_you_missed: missed,
      what_may_be_distorted: distorted,
      what_to_review_next: [evaluation.prompt || "Return to the source and explain the central claim in one plain sentence."]
    },
    recall_pattern_diagnosis: evaluation.gradingResult?.recall_pattern_diagnosis || []
  };
}

function progressionForEvaluation(evaluation = {}) {
  const structured = evaluation.gradingResult || localStructuredFeedback(evaluation);
  const raw = Number.isFinite(structured.overall_score) ? structured.overall_score : Math.round((evaluation.coverage || 0) * 100);
  const progress = Math.max(0, Math.min(100, raw));
  if (progress >= 80) {
    return {
      progress,
      title: "Strong recall",
      signal: "You recovered the central thread and enough support to move into a useful challenge."
    };
  }
  if (progress >= 50) {
    return {
      progress,
      title: "Developing recall",
      signal: "You brought back meaningful pieces. The next step is making the connection between them easier to explain."
    };
  }
  return {
    progress,
    title: "Needs another pass",
    signal: "A few pieces came back. Use the next step to rebuild the main idea in plain language."
  };
}

function cleanRememberedFeedback(items = []) {
  return items
    .filter(Boolean)
    .filter(item => !/retrieval attempt|recovered useful meaning|behavior this check is designed/i.test(item));
}

function looksLikeKeywordPile(text = "") {
  const clean = String(text)
    .replace(/^You recovered the chapter's emphasis on\s+/i, "")
    .replace(/^You (correctly )?(identified|captured|remembered|recovered)\s+/i, "")
    .replace(/\sand kept the account in your own words\.?$/i, "")
    .replace(/\.$/, "")
    .trim();
  if (!clean.includes(",")) return false;
  const parts = clean.split(",").map(part => part.trim()).filter(Boolean);
  return parts.length >= 2 && parts.every(part => part.split(/\s+/).length <= 3 && !/[.!?]/.test(part));
}

function conciseIdea(text = "") {
  return String(text)
    .replace(/^You recovered the chapter's emphasis on\s+/i, "")
    .replace(/\sand kept the account in your own words\.?$/i, "")
    .replace(/^You (correctly )?(identified|captured|remembered|recovered)\s+/i, "")
    .replace(/\.$/, "")
    .trim();
}

function cleanConceptItems(evaluation = {}, structured = {}) {
  const remembered = cleanRememberedFeedback(structured.feedback?.what_you_remembered || [])
    .filter(item => !looksLikeKeywordPile(item));
  if (remembered.length) return remembered;
  const ideas = evaluation.readingMap?.supporting_ideas || [];
  if (ideas.length) {
    return ideas
      .map(idea => idea.idea)
      .filter(Boolean)
      .slice(0, 3);
  }
  return [evaluation.strength || "You started from memory instead of copying from the source."];
}

function whatHeldIntro(evaluation = {}, structured = {}) {
  const items = cleanRememberedFeedback(structured.feedback?.what_you_remembered || []);
  const captured = conciseIdea(items[0] || evaluation.strength || "");
  const centralClaim = conciseIdea(evaluation.readingMap?.central_claim || evaluation.answerKey?.central_claim || "");
  const capturedIsKeywordPile = looksLikeKeywordPile(items[0] || evaluation.strength || "");
  if (centralClaim && !capturedIsKeywordPile) {
    return `${centralClaim}. That idea came through clearly in your response.`;
  }
  if (centralClaim) {
    return `${centralClaim}. Your response pointed toward this idea, though some of its supporting detail is still missing.`;
  }
  if (captured && !capturedIsKeywordPile) {
    return `You brought back a concrete part of the chapter. ${captured}. That gives you something real to build from in the challenge.`;
  }
  if (evaluation.band === "Strong") {
    return "The central claim came through clearly in your response.";
  }
  if (items.length) {
    return "You have something real to build from. A few important pieces came back clearly.";
  }
  return "You started from memory, which gives Ember something honest to work with.";
}

function feedbackCopy(text = "") {
  return String(text)
    .replace(/\s*—\s*/g, ". ")
    .replace(/\s+–\s+/g, ". ")
    .replace(/([A-Za-z0-9”\)])\s*:\s+/g, "$1. ")
    .replace(/\s*(?:…|\.{3,})\s*/g, ". ")
    .replace(/\.{2,}/g, ".")
    .replace(/\s{2,}/g, " ")
    .replace(/(^|[.!?]\s+)([“"'‘(\[]*)([a-z])/g, (_, boundary, opener, letter) =>
      `${boundary}${opener}${letter.toUpperCase()}`
    )
    .trim();
}

function escapeFeedback(value = "") {
  return escapeHtml(feedbackCopy(value));
}

function sourceEvidenceBlock(label, evidence, tone = "neutral") {
  if (!evidence?.sentence) return "";
  return `<div class="evidence-block compact ${tone === "revisit" ? "is-revisit" : ""}"><span>${escapeFeedback(label)}</span><blockquote>“${escapeHtml(evidence.sentence)}”</blockquote></div>`;
}

function feedbackConceptList(title, items = []) {
  const clean = items.filter(Boolean);
  if (!clean.length) return "";
  return `<div class="feedback-concepts"><span>${escapeFeedback(title)}</span><ul>${clean.map(item => `<li>${escapeFeedback(item)}</li>`).join("")}</ul></div>`;
}

function recallPatternLabel(pattern = "") {
  return {
    claim_loss: "Main point",
    entity_loss: "Names and people",
    temporal_loss: "Dates and timing",
    evidence_loss: "Concrete examples",
    relationship_loss: "How ideas connect",
    qualification_loss: "Limits and exceptions",
    distortion_or_unsupported_addition: "Source vs. inference"
  }[pattern] || "Recall pattern";
}

function formalRecallPatternFeedback(diagnosis = []) {
  const usable = diagnosis.filter(item => item?.pattern && item?.coaching);
  if (!usable.length) return null;
  return {
    title: usable.length === 1 ? "Pattern to watch" : "Patterns to watch",
    items: usable.map(item => `${recallPatternLabel(item.pattern)}. ${item.coaching}`)
  };
}

function generatedCoachingFeedback(structured = {}) {
  const coaching = structured.next_time_coaching;
  if (!coaching?.message) return null;
  const items = [
    coaching.pattern_to_watch,
    coaching.why_it_matters,
    coaching.next_reading_move
  ].filter(Boolean);
  return {
    title: coaching.title || "Where to go deeper next time",
    intro: coaching.message,
    items
  };
}

function strongRecallReminder(evaluation = {}) {
  const map = evaluation.readingMap || {};
  const contrast = map.contrasts?.[0];
  if (contrast?.meaning) {
    return {
      title: "Where to go deeper next time",
      intro: "You remembered the main thread. A useful next step is to notice the contrast the author used to sharpen the idea.",
      items: [`Look for what the author is setting against something else. In this chapter, the contrast to watch is ${contrast.meaning}.`]
    };
  }
  const relationship = map.relationships?.[0];
  if (relationship?.relationship) {
    return {
      title: "Where to go deeper next time",
      intro: "Your response is strongest on the central claim. Next time, notice the connection that holds the chapter together.",
      items: [`Ask how one idea changes, supports, or depends on another. The connection to watch here is ${relationship.relationship}.`]
    };
  }
  const qualification = map.qualifications?.[0];
  if (qualification?.text) {
    return {
      title: "Where to go deeper next time",
      intro: "You have the main idea in hand. The next layer is to notice where the author narrows, limits, or qualifies the claim.",
      items: [`Look for the condition that keeps the idea from becoming too broad. In this chapter, that condition appears in ${qualification.text}.`]
    };
  }
  const example = map.key_examples?.[0];
  if (example?.text) {
    return {
      title: "Where to go deeper next time",
      intro: "You remembered the chapter’s direction. To make it stick, attach the idea to the example that carries it.",
      items: [`After naming the claim, ask which example makes it easier to retell. The example to watch here is ${example.text}.`]
    };
  }
  const entity = map.key_entities?.[0];
  if (entity?.name) {
    return {
      title: "Where to go deeper next time",
      intro: "You remembered the shape of the idea. A good next move is to hold onto the named detail that gives the idea a handle.",
      items: [`Notice the person, place, or group the author uses to carry the point. Here, ${entity.name} is worth remembering.`]
    };
  }
  const variants = [
    {
      intro: "You remembered the main thread. Next time, choose the one detail you would use if someone asked you to explain why the claim matters.",
      item: "Before moving on, point to the sentence, example, or relationship that would make your explanation easier to repeat tomorrow."
    },
    {
      intro: "You have enough of the chapter in mind to move beyond recall. The next useful move is to notice what makes the idea travel.",
      item: "Ask what part of the chapter would help the idea survive a real conversation with someone who has not read it."
    },
    {
      intro: "The central idea came back. Now look for the piece that gives it shape, such as a reason, example, contrast, or limit.",
      item: "Try asking which detail would make the idea clearer if you had to explain it tomorrow."
    }
  ];
  const index = Math.floor(((evaluation.coverage || 0) * 100)) % variants.length;
  return {
    title: "Where to go deeper next time",
    intro: variants[index].intro,
    items: [variants[index].item]
  };
}

function recallGapReminderFeedback(evaluation = {}, structured = {}) {
  const missed = structured.feedback?.what_you_missed || [];
  const distorted = structured.feedback?.what_may_be_distorted || [];
  if (evaluation.band === "Strong") {
    return strongRecallReminder(evaluation);
  }
  if (evaluation.gapType === "Weak relationship between ideas") {
    return {
      title: "Reminder for next time",
      intro: "Explaining how two ideas relate shows you have a stronger grasp of both. The goal is not just to remember the parts, but to describe the connection that makes them matter together.",
      items: ["As you read, pause when the author explains why one idea leads to, depends on, contrasts with, or changes another."]
    };
  }
  if (evaluation.gapType === "Missed central claim") {
    return {
      title: "Reminder for next time",
      intro: "Finding the central claim shows you can separate the subject of a chapter from the point the author wants you to carry away. That is what makes the rest of the details easier to organize.",
      items: ["Before collecting details, write one sentence stating what the author wants you to believe."]
    };
  }
  if (evaluation.gapType === "Insufficient response") {
    return {
      title: "Reminder for next time",
      intro: "Starting with one clear claim shows you can turn a vague impression into something explainable. Once that sentence exists, the supporting details have somewhere to attach.",
      items: ["Write one plain sentence first. Then add one reason, example, or contrast from the chapter."]
    };
  }
  const fallbackItems = [...missed, ...distorted].filter(Boolean);
  return {
    title: "Reminder for next time",
    intro: "Noticing this kind of detail shows you can move from remembering isolated points to understanding how the chapter is built. That is what makes an idea easier to explain later.",
    items: fallbackItems.length ? fallbackItems.slice(0, 2) : [evaluation.gap || "Look for the specific support that makes the chapter’s claim easier to explain."]
  };
}

function readingStrategyFor(evaluation = {}) {
  if (evaluation.band === "Strong") return "You have the main idea in hand. The next useful move is to test where the argument might bend.";
  if (evaluation.gapType === "Weak relationship between ideas") return "Look for the word that connects the ideas. Because, but, therefore, depends on, or leads to can all help.";
  if (evaluation.gapType === "Missed central claim") return "Before adding details, write one sentence stating what the author wants you to believe.";
  if (evaluation.gapType === "Insufficient response") return "Start smaller. One plain sentence about the chapter is enough to begin rebuilding it.";
  return "Return to the evidence and attach one specific reason or example to the main idea.";
}

function challengeWhy(evaluation = {}) {
  if (evaluation.band === "Strong") return "This keeps the work from stopping at recall. A good reader can also test the edge of an argument.";
  return "This challenge is designed to strengthen the part of the chapter that did not fully come back yet.";
}

function challengeGuideFor(evaluation = {}) {
  if (evaluation.band === "Strong") {
    return {
      title: "Pressure-test the argument.",
      body: "You remembered the chapter well enough to ask a sharper question about when the author’s claim might not hold.",
      helper: "Name a boundary, assumption, or condition that would make the argument less convincing."
    };
  }
  if (evaluation.gapType === "Weak relationship between ideas") {
    return {
      title: "Make the connection visible.",
      body: "Your answer named useful ideas. Now explain how one idea supports, changes, or depends on the other.",
      helper: "Try using because, but, therefore, depends on, or leads to."
    };
  }
  if (evaluation.gapType === "Missed central claim") {
    return {
      title: "Rebuild the main point.",
      body: "Start with what the author wanted you to believe, then attach the strongest reason or example.",
      helper: "One clear sentence is better than a polished paragraph."
    };
  }
  return {
    title: "Use the evidence.",
    body: "Return to the excerpt and explain the job it does in the chapter’s argument.",
    helper: "Focus on meaning, not wording."
  };
}

function renderEvaluation(showResults = true) {
  const evaluation = state.evaluation;
  const values = getValues();
  const structured = evaluation.gradingResult || localStructuredFeedback(evaluation);
  const progression = progressionForEvaluation(evaluation);
  const rememberedItems = cleanConceptItems(evaluation, structured);
  const patternFeedback = generatedCoachingFeedback(structured)
    || formalRecallPatternFeedback(structured.recall_pattern_diagnosis || [])
    || recallGapReminderFeedback(evaluation, structured);
  const heldBody = `<p>${escapeFeedback(whatHeldIntro(evaluation, structured))}</p>
    ${feedbackConceptList("Key concepts", rememberedItems)}
    ${sourceEvidenceBlock("Evidence for what came through", evaluation.strengthEvidence)}`;
  const strengthenBody = patternFeedback
    ? `<p>${escapeFeedback(patternFeedback.intro || (evaluation.band === "Strong" ? "You can go deeper by noticing the detail that would make this idea easier to use later." : "This is the pattern most worth watching next time you read."))}</p>
      ${feedbackConceptList(patternFeedback.title, patternFeedback.items)}
      ${sourceEvidenceBlock("Text evidence to revisit", evaluation.gapEvidence, "revisit")}`
    : "";
  const strengthenStep = patternFeedback
    ? `<article class="path-step path-step-warm">
        <span class="path-marker">4</span>
        <div class="path-card feedback-card gap">
          <header><h3>${patternFeedback.title === "Reminder for next time" ? "Reminder for next time" : evaluation.band === "Strong" ? "Where to go deeper next time" : "What to look for next time"}</h3></header>
          ${strengthenBody}
        </div>
      </article>`
    : "";
  $("#evaluation").innerHTML = `
    <div class="evaluation-checkpoint ${evaluation.gradingResult ? "structured-evaluation" : ""}">
      <div class="learning-path">
        <article class="path-step path-step-quiet">
          <span class="path-marker">1</span>
          <div class="path-card path-card-compact">
            <span class="eyebrow">Before feedback</span>
            <h3>${escapeHtml(confidencePhrase(values.confidence))}</h3>
            <p>This is your read on your own understanding before Ember checks the response against the source.</p>
          </div>
        </article>
        <article class="path-step path-step-signal">
          <span class="path-marker">2</span>
          <div class="path-card checkpoint-hero">
            <div>
              <span class="eyebrow">Recall signal</span>
              <h2>${escapeFeedback(progression.title)}</h2>
              <div class="progression-meter-row"><div class="progression-meter" style="--progression:${progression.progress}%"><span></span></div><strong>${progression.progress}%</strong></div>
              <p>${escapeFeedback(progression.signal)}</p>
            </div>
          </div>
        </article>
        <article class="path-step">
          <span class="path-marker">3</span>
          <div class="path-card feedback-card">
            <header><h3>What you captured</h3></header>
            ${heldBody}
          </div>
        </article>
        ${strengthenStep}
        <article class="path-step path-step-final">
          <span class="path-marker">→</span>
          <div class="path-card feedback-card next-move">
            <header><h3>Next move</h3></header>
            <p>${escapeFeedback(readingStrategyFor(evaluation))}</p>
            <div class="next-challenge-pill"><span>${escapeFeedback(displayGapType(evaluation.gapType))}</span><strong>${escapeFeedback(normalizeReviewPrompt(evaluation.prompt))}</strong></div>
            <p class="path-card-note">${escapeFeedback(challengeWhy(evaluation))}</p>
          </div>
        </article>
      </div>
    </div>`;
  if (showResults && $("#feedback-results")) $("#feedback-results").hidden = false;
  if (showResults && $("#analysis-transition")) $("#analysis-transition").hidden = true;
  $("#repair-title").textContent = evaluation.band === "Strong" ? "Test the edge of the argument." : "Take on the idea that needs another pass.";
  $("#repair-prompt").textContent = evaluation.prompt;
  const guide = challengeGuideFor(evaluation);
  $("#repair-guide").innerHTML = `<strong>${escapeFeedback(guide.title)}</strong><p>${escapeFeedback(guide.body)}</p><small>${escapeFeedback(guide.helper)}</small>`;
  $("#repair-evidence").innerHTML = `<span>${evaluation.band === "Strong" ? "Detail to test" : "Detail to rebuild"}</span><blockquote>“${escapeHtml(evaluation.gapEvidence.sentence)}”</blockquote>`;
  $('[data-action="to-repair"]').innerHTML = evaluation.band === "Strong"
    ? 'Take the challenge <span>→</span>'
    : 'Take the challenge <span>→</span>';
}

function buildCompletion(skipped = false) {
  const values = getValues();
  const repairTerms = new Set(words(values.repair));
  const evidenceTerms = words(state.evaluation.gapEvidence.sentence);
  const hits = evidenceTerms.filter(term => repairTerms.has(term)).length;
  state.repairResolved = !skipped && wordCount(values.repair) >= 10 && hits >= 1;
  $("#completion-title").textContent = state.repairResolved ? "Challenge complete." : skipped ? "Saved without the challenge." : "You took the challenge on.";
  $("#completion-copy").textContent = state.repairResolved
    ? "Your revision now connects to the source evidence. The delayed review will show whether that connection lasts."
    : "The attempt is preserved. You can revisit the evidence when this chapter returns for review.";
  $("#completion-summary").innerHTML = `
    <div class="summary-cell"><span class="summary-label">Initial check <button class="stat-info-button" type="button" data-action="open-initial-check-info" aria-label="About initial check results">i</button></span><strong>${escapeHtml(displayBand(state.evaluation.band))}</strong></div>
    <div class="summary-cell"><span class="summary-label">Confidence <button class="stat-info-button" type="button" data-action="open-confidence-info" aria-label="About confidence">i</button></span><strong>${escapeHtml(values.confidence || "Not recorded")}</strong></div>
    <div class="summary-cell"><span>Challenge</span><strong>${state.repairResolved ? "Completed" : skipped ? "Skipped" : "Attempted"}</strong></div>`;
  const schedule = initialReviewSchedule(state.evaluation, values.confidence, state.repairResolved);
  const snapshot = scheduleReasonSnapshot(schedule, "initial", {
    evaluation: state.evaluation,
    confidence: values.confidence,
    inputs: initialScheduleInputs(state.evaluation, values.confidence, state.repairResolved)
  });
  $("#adaptive-review-when").textContent = `Returns ${reviewTimingCopy(schedule.days)}`;
  $("#adaptive-review-reason").textContent = `Because ${schedule.reason}.`;
  $("#adaptive-review-explanation").textContent = snapshot.plain;
  $("#adaptive-review-inputs").innerHTML = `
    <div><dt>Recall signal</dt><dd>${Math.round(snapshot.score || 0)}%</dd></div>
    <div><dt>Confidence</dt><dd>${escapeHtml(snapshot.confidence || "Not recorded")}</dd></div>
    <div><dt>Gap</dt><dd>${escapeHtml(snapshot.gapType ? displayGapType(snapshot.gapType) : "Review timing")}</dd></div>
    <div><dt>Rating</dt><dd>${escapeHtml(snapshot.rating ? `FSRS ${snapshot.rating}` : "FSRS pending")}</dd></div>`;
  $("#adaptive-review-note").textContent = snapshot.earlyReviewNote;
  $("#adaptive-review-copy").textContent = snapshot.earlyReviewNote;
  setStep(5);
  saveDraft();
}

function confidenceRank(confidence = "") {
  return {
    "Not yet": 0,
    "Partly": 1,
    "Mostly": 2,
    "Very well": 3
  }[confidence] ?? 1;
}

function addDays(date, days) {
  return new Date(date.getTime() + days * 86400000);
}

function reviewTimingCopy(days) {
  if (days <= 1) return "tomorrow";
  return `in ${days} days`;
}

const FSRS_PARAMETERS = {
  request_retention: 0.9,
  maximum_interval: 3650,
  enable_fuzz: false,
  enable_short_term: false
};
const SCHEDULING_POLICY_VERSION = "initial-rating-v5";

function fsrsApi() {
  return window.FSRS || null;
}

function fsrsScheduler() {
  const api = fsrsApi();
  return api?.fsrs ? api.fsrs(FSRS_PARAMETERS) : null;
}

function serializeFsrsCard(card) {
  if (!card) return null;
  return {
    due: new Date(card.due).toISOString(),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsed_days: card.elapsed_days,
    scheduled_days: card.scheduled_days,
    learning_steps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    last_review: card.last_review ? new Date(card.last_review).toISOString() : null
  };
}

function hydrateFsrsCard(card) {
  if (!card) return null;
  return {
    ...card,
    due: new Date(card.due),
    last_review: card.last_review ? new Date(card.last_review) : undefined
  };
}

function clampFsrsDays(days) {
  return Math.max(1, Math.round(Number(days) || 1));
}

function ratingLabel(rating) {
  const api = fsrsApi();
  return api?.Rating?.[rating] || String(rating);
}

function fallbackInitialReviewSchedule(evaluation, confidence, repairResolved) {
  const rubric = rubricScoresForEvaluation(evaluation || {});
  const bandRank = resultRank(evaluation?.band);
  const confidenceScore = confidenceRank(confidence);
  const score = rubric.overall;
  const responseLength = Number(evaluation?.responseWordCount) || 0;
  const substantialAnswer = responseLength >= 45;
  const comprehensiveAnswer = responseLength >= 80;
  const notEnoughEvidence = evaluation?.band === "Not enough evidence" || evaluation?.gapType === "Insufficient response";
  if (!notEnoughEvidence && rubric.total >= 9) {
    return { days: confidenceScore >= 3 || repairResolved ? 8 : 3, reason: "the rubric showed strong recall across the main reading traits" };
  }
  if (!notEnoughEvidence && rubric.total >= 7) {
    return { days: 3, reason: "the rubric showed solid recall with a few details to reinforce" };
  }
  if (!notEnoughEvidence && rubric.total >= 5) {
    return { days: 2, reason: "the rubric showed partial recall worth spacing beyond tomorrow" };
  }
  if (bandRank === 2 && confidenceScore >= 2) {
    return {
      days: repairResolved ? 7 : 5,
      reason: repairResolved
        ? "your recall and challenge response were both strong"
        : "your recall was strong, but the edge case still deserves one delayed pass"
    };
  }
  if (bandRank === 2) {
    return { days: 3, reason: "your answer was strong, but your confidence was still forming" };
  }
  if (bandRank === 1 && confidenceScore >= 2) {
    return {
      days: repairResolved && score >= 70 ? 3 : 2,
      reason: repairResolved && score >= 70
        ? "your recall was developing and the challenge strengthened the weak spot"
        : "the main shape was there, but one connection needs reinforcement"
    };
  }
  if (!notEnoughEvidence && score >= 40 && confidenceScore >= 2) {
    return { days: 2, reason: "your response had enough signal to wait a little longer than tomorrow" };
  }
  if (!notEnoughEvidence && comprehensiveAnswer) {
    return { days: 3, reason: "your answer was substantial, even though the scorer wanted a cleaner match to the source" };
  }
  if (!notEnoughEvidence && substantialAnswer) {
    return { days: 2, reason: "your answer had enough substance to avoid an immediate tomorrow retry" };
  }
  return { days: 1, reason: "the chapter still has a fragile spot" };
}

function initialFsrsRating(evaluation, confidence, repairResolved) {
  const api = fsrsApi();
  if (!api?.Rating) return null;
  const rubric = rubricScoresForEvaluation(evaluation || {});
  if (rubric.maxRating === "Again") return api.Rating.Again;
  if (rubric.maxRating === "Hard" && rubric.total >= 5) return api.Rating.Hard;
  const bandRank = resultRank(evaluation?.band);
  const confidenceScore = confidenceRank(confidence);
  const score = rubric.overall;
  const responseLength = Number(evaluation?.responseWordCount) || 0;
  const substantialAnswer = responseLength >= 45;
  const comprehensiveAnswer = responseLength >= 80;
  const notEnoughEvidence = evaluation?.band === "Not enough evidence" || evaluation?.gapType === "Insufficient response";
  if (!notEnoughEvidence && rubric.total >= 9) return confidenceScore >= 3 || repairResolved ? api.Rating.Easy : api.Rating.Good;
  if (!notEnoughEvidence && rubric.total >= 7) return api.Rating.Good;
  if (!notEnoughEvidence && rubric.total >= 5) return api.Rating.Hard;
  if (bandRank === 2 && confidenceScore === 3 && repairResolved && score >= 90) return api.Rating.Easy;
  if (bandRank === 2 && confidenceScore >= 2) return api.Rating.Good;
  if (bandRank === 2) return api.Rating.Hard;
  if (bandRank === 1) {
    if (repairResolved && confidenceScore >= 2 && score >= 70) return api.Rating.Good;
    return confidenceScore >= 2 ? api.Rating.Hard : api.Rating.Again;
  }
  if (!notEnoughEvidence && score >= 40 && confidenceScore >= 2) return api.Rating.Hard;
  if (!notEnoughEvidence && comprehensiveAnswer) return api.Rating.Good;
  if (!notEnoughEvidence && substantialAnswer) return api.Rating.Hard;
  return api.Rating.Again;
}

function initialScheduleInputs(evaluation, confidence, repairResolved) {
  const rubric = rubricScoresForEvaluation(evaluation || {});
  return {
    band: evaluation?.band || "",
    score: evaluationScore(evaluation || {}),
    rubric,
    confidence: confidence || "",
    responseWordCount: Number(evaluation?.responseWordCount) || 0,
    minimumDays: minimumInitialReviewDays(evaluation, confidence),
    challengeCompleted: Boolean(repairResolved),
    gapType: evaluation?.gapType || ""
  };
}

function scheduleReasonSnapshot(schedule, context, source = {}) {
  const inputs = source.inputs || {};
  const evaluation = source.evaluation || {};
  const due = schedule?.due ? new Date(schedule.due) : source.reviewDue ? new Date(source.reviewDue) : null;
  const scheduledAt = source.scheduledAt ? new Date(source.scheduledAt) : new Date();
  const days = Number(schedule?.days || source.days || dateDiffInDays(scheduledAt, due || addDays(scheduledAt, 1)));
  const score = Number(inputs.score ?? evaluationScore(evaluation || {}));
  const confidence = inputs.confidence || source.confidence || "";
  const gapType = inputs.gapType || evaluation?.gapType || source.gapType || "";
  const rating = schedule?.ratingLabel || source.rating || "";
  const reason = schedule?.reason || source.reason || fsrsReasonForRating(schedule?.rating, context);
  return {
    context,
    score,
    confidence,
    gapType,
    reason,
    rating,
    nextReviewLabel: reviewTimingCopy(days),
    plain: scheduleExplanationSentence({ reason, days, score, confidence, gapType, context, rating }),
    earlyReviewNote: days <= 1
      ? "New or fragile chapters often get an early first review. After Ember sees what lasts, future reviews spread out more naturally."
      : "Future spacing adapts after Ember sees what still comes back later.",
    createdAt: new Date().toISOString()
  };
}

function scheduleExplanationSentence({ reason = "", days = 1, score, confidence = "", gapType = "", context = "initial" } = {}) {
  const timing = reviewTimingCopy(days);
  const parts = [];
  const normalizedReason = reason.replace(/\.$/, "");
  if (normalizedReason) parts.push(normalizedReason);
  if (confidence) parts.push(`you marked your confidence as ${confidence}`);
  if (gapType) parts.push(`the main gap was ${displayGapType(gapType).toLowerCase()}`);
  if (Number.isFinite(score) && score > 0) parts.push(`the recall signal was ${Math.round(score)}%`);
  const basis = parts.length ? parts.join(", ") : context === "review" ? "the review response showed what still needs another pass" : "the first check showed what needs another pass";
  return `Scheduled ${timing} because ${basis}.`;
}

function scheduleInputsForChapter(chapter = {}) {
  return chapter.reviewSchedule?.inputs || initialScheduleInputs(chapter.evaluation || {}, chapter.confidence, chapter.repairResolved);
}

function scheduleReasonForChapter(chapter = {}) {
  const schedule = chapter.reviewSchedule || {};
  const inputs = scheduleInputsForChapter(chapter);
  const due = chapter.reviewDue ? new Date(chapter.reviewDue) : null;
  const scheduledAt = schedule.scheduledAt ? new Date(schedule.scheduledAt) : new Date(chapter.updatedAt || chapter.createdAt || Date.now());
  const days = Number(schedule.days || (due ? dateDiffInDays(scheduledAt, due) : 1));
  const score = Number(inputs.score ?? evaluationScore(chapter.evaluation || {}));
  const gapType = inputs.gapType || chapter.evaluation?.gapType || "";
  const confidence = inputs.confidence || chapter.confidence || "";
  const reason = schedule.reasonSnapshot?.reason || schedule.reason || displayGapType(gapType || "this idea needs another pass").toLowerCase();
  return {
    context: schedule.reasonSnapshot?.context || (chapter.delayedAttempts?.length ? "review" : "initial"),
    score,
    confidence,
    gapType,
    reason,
    rating: schedule.rating || "",
    days,
    nextReviewLabel: due ? reviewTimingCopy(days) : "later",
    plain: schedule.reasonSnapshot?.plain || scheduleExplanationSentence({ reason, days, score, confidence, gapType, context: chapter.delayedAttempts?.length ? "review" : "initial" }),
    earlyReviewNote: schedule.reasonSnapshot?.earlyReviewNote || (days <= 1
      ? "New or fragile chapters often get an early first review. After Ember sees what lasts, future reviews spread out more naturally."
      : "Future spacing adapts after Ember sees what still comes back later.")
  };
}

function formatReviewDate(value) {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not scheduled";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function renderScheduleWhy(chapter, { compact = false } = {}) {
  if (!chapter?.reviewDue) return "";
  const reason = scheduleReasonForChapter(chapter);
  const details = [
    ["Recall signal", Number.isFinite(reason.score) && reason.score > 0 ? `${Math.round(reason.score)}%` : "Not scored"],
    ["Confidence", reason.confidence || "Not recorded"],
    ["Gap", reason.gapType ? displayGapType(reason.gapType) : "Review timing"],
    ["Rating", reason.rating ? `FSRS ${reason.rating}` : "FSRS pending"]
  ];
  return `
    <details class="schedule-why${compact ? " compact" : ""}">
      <summary>Why this review?</summary>
      <p>${escapeHtml(reason.plain)}</p>
      <dl>${details.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl>
      <small>${escapeHtml(reason.earlyReviewNote)}</small>
    </details>`;
}

function renderScheduleHistory(chapter = {}) {
  const attempts = chapter.delayedAttempts || [];
  const latestAttempt = attempts.at(-1);
  const nextDate = chapter.reviewDue ? formatReviewDate(chapter.reviewDue) : "No review scheduled";
  const initialDate = formatReviewDate(chapter.createdAt);
  const firstReview = attempts[0]?.createdAt ? formatReviewDate(attempts[0].createdAt) : chapter.reviewDue ? `Scheduled ${nextDate}` : "Waiting for first review";
  const nextPreview = chapter.reviewDue
    ? attempts.length
      ? `Next review: ${nextDate} if recall is strong`
      : "Complete the first review to set the next interval"
    : "Next review: none scheduled";
  return `
    <article class="history-card schedule-history-card">
      <header><h2>Schedule history</h2><span class="status-tag">${escapeHtml(chapter.reviewSchedule?.manualRescheduled ? "Adjusted" : "Adaptive")}</span></header>
      <ol>
        <li><span>Initial check</span><strong>${escapeHtml(initialDate)}</strong></li>
        <li><span>First review</span><strong>${escapeHtml(firstReview)}</strong></li>
        ${latestAttempt ? `<li><span>Latest review</span><strong>${escapeHtml(formatReviewDate(latestAttempt.createdAt))}</strong></li>` : ""}
        <li><span>Next step</span><strong>${escapeHtml(nextPreview)}</strong></li>
      </ol>
      ${renderScheduleWhy(chapter)}
    </article>`;
}

function initialScheduleReason(evaluation, confidence, repairResolved, defaultReason) {
  const score = evaluationScore(evaluation || {});
  const responseLength = Number(evaluation?.responseWordCount) || 0;
  const confidenceScore = confidenceRank(confidence);
  const notEnoughEvidence = evaluation?.band === "Not enough evidence" || evaluation?.gapType === "Insufficient response";
  if (!notEnoughEvidence && responseLength >= 80 && score < 50) {
    return "your answer was substantial, but the scorer wanted a cleaner match to the source";
  }
  if (!notEnoughEvidence && responseLength >= 45 && score < 50) {
    return "your answer had enough substance to avoid an immediate tomorrow retry";
  }
  if (repairResolved && score >= 70 && confidenceScore >= 2) {
    return "your challenge response strengthened the weak spot";
  }
  return defaultReason;
}

function minimumInitialReviewDays(evaluation, confidence) {
  const score = evaluationScore(evaluation || {});
  const rubric = rubricScoresForEvaluation(evaluation || {});
  const responseLength = Number(evaluation?.responseWordCount) || 0;
  const confidenceScore = confidenceRank(confidence);
  const notEnoughEvidence = evaluation?.band === "Not enough evidence" || evaluation?.gapType === "Insufficient response";
  if (notEnoughEvidence || rubric.central_claim === 0 || responseLength < 25) return 1;
  if (responseLength >= 80) return 3;
  if (responseLength >= 45 || score >= 40 || confidenceScore >= 2) return 2;
  return 1;
}

function enforceInitialScheduleMinimum(schedule, evaluation, confidence, repairResolved, now) {
  if (!schedule) return schedule;
  const minimumDays = minimumInitialReviewDays(evaluation, confidence);
  if (schedule.days >= minimumDays) return schedule;
  const due = addDays(now, minimumDays);
  const card = schedule.card
    ? {
      ...schedule.card,
      due: due.toISOString(),
      scheduled_days: minimumDays
    }
    : schedule.card;
  return {
    ...schedule,
    days: minimumDays,
    due,
    card,
    intervalGuardApplied: true,
    reason: initialScheduleReason(evaluation, confidence, repairResolved, schedule.reason)
  };
}

function evaluationWithRecallLength(evaluation = {}, recall = "") {
  if (!evaluation) return evaluation;
  if (Number(evaluation.responseWordCount) > 0) return evaluation;
  return {
    ...evaluation,
    responseWordCount: wordCount(recall || "")
  };
}

function reviewFsrsRating(attempt) {
  const api = fsrsApi();
  if (!api?.Rating) return null;
  const weakerRank = Math.min(resultRank(attempt.gapBand), resultRank(attempt.band));
  const confidenceScore = confidenceRank(attempt.confidence);
  if (weakerRank === 2 && confidenceScore === 3) return api.Rating.Easy;
  if (weakerRank === 2) return api.Rating.Good;
  if (weakerRank === 1) return api.Rating.Hard;
  return api.Rating.Again;
}

function fsrsReasonForRating(rating, context = "initial") {
  const label = ratingLabel(rating);
  if (label === "Easy") return context === "initial"
    ? "your recall, confidence, and challenge response were all strong"
    : "both review prompts came back easily";
  if (label === "Good") return context === "initial"
    ? "your recall was strong enough for a normal FSRS interval"
    : "both review prompts came back";
  if (label === "Hard") return context === "initial"
    ? "the idea was present, but still needed effort"
    : "one answer came back only partially";
  return context === "initial"
    ? "the chapter still has a fragile spot"
    : "one of the ideas did not come back reliably";
}

function scheduleWithFsrs(card, rating, now, context) {
  const api = fsrsApi();
  const scheduler = fsrsScheduler();
  if (!api?.createEmptyCard || !scheduler || !rating) return null;
  const startingCard = hydrateFsrsCard(card) || api.createEmptyCard(now);
  const result = scheduler.next(startingCard, now, rating);
  const days = clampFsrsDays(result.card.scheduled_days || dateDiffInDays(now, result.card.due));
  return {
    complete: false,
    days,
    due: new Date(result.card.due),
    reason: fsrsReasonForRating(rating, context),
    rating,
    ratingLabel: ratingLabel(rating),
    card: serializeFsrsCard(result.card),
    log: result.log ? {
      ...result.log,
      due: new Date(result.log.due).toISOString(),
      review: new Date(result.log.review).toISOString()
    } : null
  };
}

function dateDiffInDays(start, end) {
  return Math.max(1, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000));
}

function initialReviewSchedule(evaluation, confidence, repairResolved, previousCard = null, now = new Date()) {
  const schedule = scheduleWithFsrs(previousCard, initialFsrsRating(evaluation, confidence, repairResolved), now, "initial");
  if (schedule) {
    const explained = { ...schedule, reason: initialScheduleReason(evaluation, confidence, repairResolved, schedule.reason) };
    return enforceInitialScheduleMinimum(explained, evaluation, confidence, repairResolved, now);
  }
  const fallback = fallbackInitialReviewSchedule(evaluation, confidence, repairResolved);
  return { ...fallback, due: addDays(now, fallback.days), ratingLabel: "Fallback", card: previousCard || null };
}

function nextReviewSchedule(attempt, previousAttempt, previousCard = null, now = new Date()) {
  const schedule = scheduleWithFsrs(previousCard, reviewFsrsRating(attempt), now, "review");
  if (schedule) return schedule;
  const weakerRank = Math.min(resultRank(attempt.gapBand), resultRank(attempt.band));
  const confidenceScore = confidenceRank(attempt.confidence);
  const days = weakerRank === 2 && confidenceScore >= 2 ? 14 : weakerRank === 2 ? 7 : weakerRank === 1 ? 3 : 1;
  return {
    complete: false,
    days,
    due: addDays(now, days),
    reason: weakerRank === 2 ? "both answers were strong" : weakerRank === 1 ? "one answer was partial" : "one of the ideas did not come back reliably",
    ratingLabel: "Fallback",
    card: previousCard || null
  };
}

function saveCurrent(goHome = true) {
  const values = getValues();
  const chapters = loadChapters();
  const now = new Date();
  const id = state.currentId || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const previous = chapters.find(chapter => chapter.id === id);
  const previousInitialCard = previous?.status === "Draft" ? null : previous?.fsrsCard || null;
  const schedule = initialReviewSchedule(state.evaluation, values.confidence, state.repairResolved, previousInitialCard);
  const reviewDue = new Date(schedule.due || addDays(now, schedule.days)).toISOString();
  const scheduleInputs = initialScheduleInputs(state.evaluation, values.confidence, state.repairResolved);
  const reasonSnapshot = scheduleReasonSnapshot(schedule, "initial", {
    evaluation: state.evaluation,
    confidence: values.confidence,
    inputs: scheduleInputs
  });
  const chapter = {
    ...previous,
    id,
    ...values,
    evaluation: state.evaluation,
    repairResolved: state.repairResolved,
    status: "Review scheduled",
    reviewDue,
    reviewCanceled: false,
    fsrsCard: schedule.card || previous?.fsrsCard || null,
    reviewSchedule: {
      model: "ts-fsrs",
      package: "ts-fsrs",
      packageVersion: "5.4.1",
      policyVersion: SCHEDULING_POLICY_VERSION,
      days: schedule.days,
      reason: schedule.reason,
      reasonSnapshot,
      rating: schedule.ratingLabel,
      inputs: scheduleInputs,
      intervalGuardApplied: Boolean(schedule.intervalGuardApplied),
      log: schedule.log || null,
      scheduledAt: now.toISOString()
    },
    updatedAt: now.toISOString(),
    createdAt: previous?.createdAt || now.toISOString(),
    delayedAttempts: previous?.delayedAttempts || []
  };
  const index = chapters.findIndex(item => item.id === id);
  if (index >= 0) chapters[index] = chapter; else chapters.push(chapter);
  saveChapters(chapters);
  saveBookMetadata(values);
  state.currentId = id;
  localStorage.removeItem(DRAFT_KEY);
  renderDashboard();
  toast(`Saved. FSRS scheduled this ${reviewTimingCopy(schedule.days)} because ${schedule.reason}.`);
  if (goHome) setView("home");
}

function reviewIsDue(chapter) {
  return chapter.reviewDue && new Date(chapter.reviewDue).getTime() <= Date.now() && chapter.status !== "Complete";
}

function reviewIsScheduled(chapter) {
  return Boolean(chapter.reviewDue && chapter.status !== "Draft");
}

function hasReviewSourceData(chapter) {
  return Boolean(chapter?.evaluation || chapter?.recall || chapter?.repair || (chapter?.delayedAttempts || []).length);
}

function reviewEligibilityReason(chapter) {
  if (!chapter) return "missing chapter data";
  if (chapter.status === "Draft") return "draft";
  if (chapter.reviewCanceled) return "canceled";
  if (!hasReviewSourceData(chapter)) return "no saved response data";
  if (chapter.fsrsCard && chapter.reviewSchedule?.model === "ts-fsrs") return "already scored";
  return "eligible";
}

function shouldMigrateReviewToFsrs(chapter) {
  if (!chapter || chapter.status === "Draft" || chapter.reviewCanceled) return false;
  if (chapter.fsrsCard && chapter.reviewSchedule?.model === "ts-fsrs") return false;
  return hasReviewSourceData(chapter);
}

function shouldRebalanceInitialReviewSchedule(chapter) {
  if (!chapter || chapter.status === "Draft" || chapter.reviewCanceled) return false;
  if (!hasReviewSourceData(chapter)) return false;
  if (chapter.reviewSchedule?.model !== "ts-fsrs") return false;
  if (chapter.reviewSchedule?.manualRescheduled) return false;
  if (chapter.reviewSchedule?.policyVersion === SCHEDULING_POLICY_VERSION) return false;
  if ((chapter.delayedAttempts || []).length) return false;
  return Boolean(chapter.reviewDue);
}

function migrateReviewsToFsrs(chapters) {
  let changed = false;
  const updated = chapters.map(chapter => {
    if (!shouldMigrateReviewToFsrs(chapter) && !shouldRebalanceInitialReviewSchedule(chapter)) return chapter;
    const anchor = new Date(chapter.reviewSchedule?.scheduledAt || chapter.updatedAt || chapter.createdAt || Date.now());
    const scheduleAnchor = Number.isNaN(anchor.getTime()) ? new Date() : anchor;
    const scheduleEvaluation = evaluationWithRecallLength(chapter.evaluation, chapter.recall);
    const schedule = initialReviewSchedule(
      scheduleEvaluation,
      chapter.confidence,
      chapter.repairResolved,
      shouldRebalanceInitialReviewSchedule(chapter) ? null : chapter.fsrsCard || null,
      scheduleAnchor
    );
    const scheduleInputs = initialScheduleInputs(scheduleEvaluation, chapter.confidence, chapter.repairResolved);
    changed = true;
    return {
      ...chapter,
      evaluation: scheduleEvaluation,
      status: "Review scheduled",
      reviewDue: new Date(schedule.due || addDays(scheduleAnchor, schedule.days)).toISOString(),
      reviewCanceled: false,
      fsrsCard: schedule.card || chapter.fsrsCard || null,
      reviewBackfilled: !chapter.reviewDue,
      reviewMigratedToFsrs: true,
      reviewSchedule: {
        model: "ts-fsrs",
        package: "ts-fsrs",
        packageVersion: "5.4.1",
        policyVersion: SCHEDULING_POLICY_VERSION,
        days: schedule.days,
        reason: schedule.reason,
        rating: schedule.ratingLabel,
        inputs: scheduleInputs,
        reasonSnapshot: scheduleReasonSnapshot(schedule, "initial", {
          evaluation: scheduleEvaluation,
          confidence: chapter.confidence,
          inputs: scheduleInputs,
          scheduledAt: scheduleAnchor.toISOString()
        }),
        intervalGuardApplied: Boolean(schedule.intervalGuardApplied),
        log: schedule.log || null,
        scheduledAt: new Date().toISOString(),
        backfilled: !chapter.reviewDue,
        migrated: true
      }
    };
  });
  if (changed) saveChapters(updated);
  return updated;
}

function reviewDate(chapter) {
  if (!chapter.reviewDue) return null;
  const date = new Date(chapter.reviewDue);
  return { month: date.toLocaleDateString(undefined, { month: "short" }), day: date.getDate(), label: reviewIsDue(chapter) ? "Due now" : date.toLocaleDateString(undefined, { month: "short", day: "numeric" }) };
}

function reviewScheduleDetail(chapter) {
  const schedule = chapter.reviewSchedule || {};
  const rating = schedule.rating ? `FSRS ${schedule.rating}` : "FSRS pending";
  const reason = schedule.reasonSnapshot?.reason || schedule.reason || displayGapType(chapter.evaluation?.gapType || "Chapter review");
  return `${rating} · ${reason}`;
}

function reviewIconTitle(chapter) {
  const dueLabel = reviewIsDue(chapter)
    ? "Due now"
    : `Scheduled for ${new Date(chapter.reviewDue).toLocaleDateString()}`;
  return `${dueLabel} · ${reviewScheduleDetail(chapter)}`;
}

function reviewQueueSummary(due, scheduled) {
  if (!scheduled.length) return "No reviews scheduled";
  return due.length
    ? `${due.length} due now · ${scheduled.length} scheduled`
    : `${scheduled.length} scheduled`;
}

function renderReviewItem(chapter, manage = false) {
  const date = reviewDate(chapter);
  return `
    <article class="review-item">
      <div class="date-tile"><span>${escapeHtml(date?.month || "No")}</span><strong>${date?.day || "date"}</strong></div>
      <div class="item-copy">
        <strong>${escapeHtml(chapter.chapterTitle)}</strong>
        <small>${escapeHtml(chapter.bookTitle)} · ${escapeHtml(reviewScheduleDetail(chapter))}</small>
        ${renderScheduleWhy(chapter, { compact: true })}
      </div>
      ${manage ? `
        <div class="review-actions">
          <button class="item-action" type="button" data-review-id="${chapter.id}">${reviewIsDue(chapter) ? "Review now →" : "Start early →"}</button>
          <details class="review-manage">
            <summary>More</summary>
            <div class="reschedule-panel">
              <span>Bring this chapter back:</span>
              <div class="reschedule-options">
                <button type="button" data-action="reschedule-managed-review" data-manage-review-id="${chapter.id}" data-delay="1">Tomorrow</button>
                <button type="button" data-action="reschedule-managed-review" data-manage-review-id="${chapter.id}" data-delay="3">In 3 days</button>
                <button type="button" data-action="reschedule-managed-review" data-manage-review-id="${chapter.id}" data-delay="7">In 7 days</button>
                <button class="cancel-review" type="button" data-action="cancel-review" data-manage-review-id="${chapter.id}">Cancel</button>
              </div>
            </div>
          </details>
        </div>` : `
        <button class="item-action" type="button" data-review-id="${chapter.id}">${reviewIsDue(chapter) ? "Review now →" : escapeHtml(date?.label || "Scheduled")}</button>`}
    </article>`;
}

function daysUntilReview(chapter) {
  if (!chapter.reviewDue) return Infinity;
  return Math.ceil((new Date(chapter.reviewDue).getTime() - Date.now()) / 86400000);
}

function reviewPriorityScore(chapter) {
  const rating = chapter.reviewSchedule?.rating || "";
  const ratingWeight = { Again: 0, Hard: 1, Good: 2, Easy: 3 }[rating] ?? 2;
  const score = evaluationScore(chapter.evaluation || {});
  return ratingWeight * 100 + score;
}

function sortReviewPriority(chapters = []) {
  return [...chapters].sort((a, b) => {
    const dueDelta = new Date(a.reviewDue).getTime() - new Date(b.reviewDue).getTime();
    if (reviewIsDue(a) && reviewIsDue(b)) return reviewPriorityScore(a) - reviewPriorityScore(b) || dueDelta;
    return dueDelta;
  });
}

function reviewBuckets(scheduled = []) {
  const due = sortReviewPriority(scheduled.filter(reviewIsDue));
  return {
    dueNow: due.slice(0, 3),
    moreDue: due.slice(3),
    soon: scheduled.filter(chapter => !reviewIsDue(chapter) && daysUntilReview(chapter) <= 7),
    later: scheduled.filter(chapter => !reviewIsDue(chapter) && daysUntilReview(chapter) > 7)
  };
}

function renderReviewSection(title, description, chapters = [], options = {}) {
  if (!chapters.length) return "";
  const limit = options.limit || chapters.length;
  const visible = chapters.slice(0, limit);
  const remaining = chapters.length - visible.length;
  return `
    <section class="review-chunk ${options.tone ? `is-${options.tone}` : ""}">
      <header>
        <div><span>${escapeHtml(title)}</span><p>${escapeHtml(description)}</p></div>
        <strong>${chapters.length}</strong>
      </header>
      ${options.session ? `<button class="primary review-session-start" type="button" data-action="start-review-session" data-review-session-ids="${escapeHtml(chapters.map(chapter => chapter.id).join(","))}">Start review session <span>→</span></button>` : ""}
      <div class="review-chunk-list">${visible.map(chapter => renderReviewItem(chapter, true)).join("")}</div>
      ${remaining ? `<p class="review-chunk-more">${remaining} more scheduled later in this group.</p>` : ""}
    </section>`;
}

function renderReviewQueue(scheduled = []) {
  if (!scheduled.length) {
    return '<div class="empty-state"><strong>Your review queue is clear</strong>New checks return here when FSRS schedules them.</div>';
  }
  const buckets = reviewBuckets(scheduled);
  return [
    renderReviewSection("Do now", "Work through a short set of up to 3. These are the highest-leverage reviews for this visit.", buckets.dueNow, { tone: "due", session: true }),
    renderReviewSection("More due today", "Still worth doing today, but not part of the first set.", buckets.moreDue, { tone: "due" }),
    renderReviewSection("Soon", "Keep these in view. They are coming back this week.", buckets.soon, { tone: "soon" }),
    renderReviewSection("Later", "No action needed yet. FSRS is spacing these out.", buckets.later, { tone: "later", limit: 6 })
  ].join("");
}

function renderRecentItem(chapter) {
  const isDraft = chapter.status === "Draft";
  return `
    <article class="recent-item${isDraft ? " is-draft" : ""}">
      <span class="status-dot ${reviewIsDue(chapter) ? "due" : ""}" aria-hidden="true"></span>
      <div class="item-copy"><strong>${escapeHtml(chapter.chapterTitle)}</strong><small>${escapeHtml(chapter.bookTitle)} · ${isDraft ? "Draft" : new Date(chapter.updatedAt).toLocaleDateString()}</small></div>
      <button class="item-action" type="button" data-chapter-id="${chapter.id}">${isDraft ? "Resume →" : "Open →"}</button>
    </article>`;
}

function renderLibrary(chapters) {
  const container = $("#library-list");
  const completedCount = chapters.filter(chapter => chapter.status !== "Draft").length;
  const draftCount = chapters.filter(chapter => chapter.status === "Draft").length;
  $("#library-count").textContent = `${completedCount} ${completedCount === 1 ? "chapter" : "chapters"}${draftCount ? ` · ${draftCount} ${draftCount === 1 ? "draft" : "drafts"}` : ""}`;
  if (!chapters.length) {
    container.innerHTML = '<div class="empty-library"><span aria-hidden="true">⌁</span><p>Your completed chapter checks will live here.</p></div>';
    return;
  }
  const groups = new Map();
  let collapsedBooks = [];
  try { collapsedBooks = JSON.parse(localStorage.getItem(COLLAPSED_BOOKS_KEY)) || []; } catch { collapsedBooks = []; }
  const collapsedBookKeys = new Set(collapsedBooks);
  const metadata = new Map(loadBookMetadata().map(book => [book.key || bookKey(book.title, book.author), book]));
  chapters.forEach(chapter => {
    const key = bookKey(chapter.bookTitle, chapter.authorName || "");
    if (!groups.has(key)) groups.set(key, {
      key,
      title: chapter.bookTitle,
      author: chapter.authorName || "",
      createdAt: metadata.get(key)?.createdAt || chapter.createdAt || chapter.updatedAt,
      chapters: []
    });
    groups.get(key).chapters.push(chapter);
    if (!metadata.get(key)?.createdAt) {
      const chapterCreatedAt = chapter.createdAt || chapter.updatedAt;
      if (new Date(chapterCreatedAt) < new Date(groups.get(key).createdAt)) groups.get(key).createdAt = chapterCreatedAt;
    }
  });
  let savedBookOrder = [];
  try { savedBookOrder = JSON.parse(localStorage.getItem(BOOK_ORDER_KEY)) || []; } catch { savedBookOrder = []; }
  const savedBookPositions = new Map(savedBookOrder.map((key, index) => [key, index]));
  const orderedGroups = [...groups.values()].sort((a, b) => {
    const aPosition = savedBookPositions.get(a.key);
    const bPosition = savedBookPositions.get(b.key);
    if (aPosition !== undefined && bPosition !== undefined) return aPosition - bPosition;
    if (aPosition !== undefined) return 1;
    if (bPosition !== undefined) return -1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  orderedGroups.forEach(group => {
    group.chapters.sort((a, b) => new Date(a.createdAt || a.updatedAt) - new Date(b.createdAt || b.updatedAt));
  });
  container.innerHTML = orderedGroups.map(group => `
    ${(() => {
      const completed = group.chapters.filter(chapter => chapter.status !== "Draft").length;
      const total = metadata.get(group.key)?.totalChapters;
      return `
    <details class="book-group" data-book-key="${escapeHtml(group.key)}"${collapsedBookKeys.has(group.key) ? "" : " open"}>
      <summary draggable="true" data-book-drag-key="${escapeHtml(group.key)}" title="Drag to reorder or click to collapse">
        <svg class="book-drag-handle" viewBox="0 0 12 18" aria-hidden="true"><circle cx="3" cy="4" r="1"></circle><circle cx="9" cy="4" r="1"></circle><circle cx="3" cy="9" r="1"></circle><circle cx="9" cy="9" r="1"></circle><circle cx="3" cy="14" r="1"></circle><circle cx="9" cy="14" r="1"></circle></svg>
        <strong>${escapeHtml(group.title)}</strong>
        <span class="book-summary-meta">
          <span class="book-summary-count">${completed}${total ? ` / ${total}` : ""}</span>
          <svg class="book-chevron" viewBox="0 0 20 20" aria-hidden="true"><path d="m7 5 5 5-5 5"></path></svg>
        </span>
      </summary>
      ${total ? `
        <div class="book-progress">
          <div class="book-progress-track" style="--book-progress:${Math.min(100, Math.round(completed / total * 100))}%"><span></span></div>
          <small>${completed} of ${total}</small>
        </div>` : ""}
      ${completed ? `<button class="book-insights-link" type="button" data-book-insights="${escapeHtml(group.key)}">What’s sticking? <span>→</span></button>` : ""}
      ${group.chapters.map(chapter => {
        const stateIndicator = chapter.status === "Draft"
          ? "<small>Unfinished</small>"
          : reviewIsScheduled(chapter)
            ? `<span class="review-scheduled-icon${reviewIsDue(chapter) ? " is-due" : ""}" role="img" aria-label="${reviewIsDue(chapter) ? "Review due" : "Review scheduled"}" title="${escapeHtml(reviewIconTitle(chapter))}">
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"></circle><path d="M12 7.5v5l3.5 2"></path></svg>
              </span>`
            : "";
        return `<button class="chapter-link${chapter.status === "Draft" ? " is-draft" : ""}" type="button" data-chapter-id="${chapter.id}"><strong>${escapeHtml(chapter.chapterTitle)}</strong>${stateIndicator}</button>`;
      }).join("")}
    </details>`;
    })()}`).join("");
}

function uniqueStrings(items = [], limit = 5) {
  const seen = new Set();
  return items
    .map(item => feedbackCopy(item || ""))
    .filter(Boolean)
    .filter(item => {
      const key = item.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);
}

function normalizeTraitScore(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return Math.max(0, Math.min(2, Math.round(numeric)));
}

function fourPointToTrait(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  if (numeric >= 3) return 2;
  if (numeric >= 1) return 1;
  return 0;
}

function relationshipTraitFromEvaluation(evaluation = {}, rubricScores = {}) {
  const direct = normalizeTraitScore(rubricScores.relationship_between_ideas);
  if (direct !== null) return direct;
  const diagnosis = evaluation.gradingResult?.recall_pattern_diagnosis || [];
  const relationshipGap = diagnosis.find(item => item.pattern === "relationship_loss" || item.pattern === "qualification_loss");
  if (relationshipGap) return relationshipGap.severity >= .75 ? 0 : 1;
  if (evaluation.gapType === "Weak relationship between ideas") return evaluation.band === "Needs another pass" ? 0 : 1;
  if (evaluation.band === "Strong") return 2;
  return fourPointToTrait(evaluation.gradingResult?.supporting_ideas_score) ?? (Number(evaluation.coverage) >= .25 ? 1 : 0);
}

function transferTraitFromEvaluation(evaluation = {}, rubricScores = {}) {
  const direct = normalizeTraitScore(rubricScores.transfer_application);
  if (direct !== null) return direct;
  const diagnosis = evaluation.gradingResult?.recall_pattern_diagnosis || [];
  const qualificationGap = diagnosis.find(item => item.pattern === "qualification_loss");
  if (qualificationGap) return qualificationGap.severity >= .75 ? 0 : 1;
  if (evaluation.gapType === "Study challenge") return evaluation.band === "Strong" ? 2 : 1;
  return evaluation.band === "Strong" ? 2 : evaluation.band === "Developing" ? 1 : 0;
}

function rubricScoresForEvaluation(evaluation = {}) {
  const structured = evaluation.gradingResult || {};
  const rubric = structured.rubric_scores || {};
  const centralClaim = normalizeTraitScore(rubric.central_claim)
    ?? fourPointToTrait(structured.central_claim_score)
    ?? resultRank(evaluation.band);
  const supportingIdeas = normalizeTraitScore(rubric.supporting_ideas)
    ?? fourPointToTrait(structured.supporting_ideas_score)
    ?? (Number(evaluation.coverage) >= .5 ? 2 : Number(evaluation.coverage) >= .25 ? 1 : 0);
  const sourceFidelity = normalizeTraitScore(rubric.source_fidelity)
    ?? normalizeTraitScore(structured.accuracy_score)
    ?? (evaluation.gapType === "Unsupported claim" || evaluation.gapType === "Distorted idea" ? 0 : 2);
  const relationship = relationshipTraitFromEvaluation(evaluation, rubric);
  const transfer = transferTraitFromEvaluation(evaluation, rubric);
  const traits = {
    central_claim: centralClaim,
    supporting_ideas: supportingIdeas,
    relationship_between_ideas: relationship,
    source_fidelity: sourceFidelity,
    transfer_application: transfer
  };
  const total = Object.values(traits).reduce((sum, value) => sum + value, 0);
  return {
    ...traits,
    total,
    overall: total * 10,
    maxRating: centralClaim === 0 ? "Again" : sourceFidelity === 0 ? "Hard" : null
  };
}

function evaluationScore(evaluation = {}) {
  const structured = evaluation.gradingResult || {};
  const rubric = rubricScoresForEvaluation(evaluation);
  const raw = Number.isFinite(rubric?.overall)
    ? rubric.overall
    : Number.isFinite(structured.overall_score)
    ? structured.overall_score
    : Number.isFinite(evaluation.coverage)
      ? Math.round(evaluation.coverage * 100)
      : 0;
  return Math.max(0, Math.min(100, raw));
}

function recallScoreTone(score = 0) {
  if (score >= 80) return "strong";
  if (score >= 50) return "developing";
  return "needs-pass";
}

function bookReportIntelligence(chapters = [], reviews = []) {
  const maps = chapters.map(chapter => chapter.evaluation?.readingMap).filter(Boolean);
  const gradingResults = chapters.map(chapter => chapter.evaluation?.gradingResult).filter(Boolean);
  const captured = uniqueStrings(chapters.flatMap(chapter => {
    const structured = chapter.evaluation?.gradingResult || localStructuredFeedback(chapter.evaluation || {});
    return cleanConceptItems(chapter.evaluation || {}, structured);
  }), 4);
  const centralClaims = uniqueStrings(maps.map(map => map.central_claim), 4);
  const supportingIdeas = uniqueStrings(maps.flatMap(map => (map.supporting_ideas || []).map(idea => idea.idea)), 5);
  const relationships = uniqueStrings(maps.flatMap(map => (map.relationships || []).map(item => item.relationship)), 4);
  const examples = uniqueStrings(maps.flatMap(map => (map.key_examples || []).map(item => item.text)), 3);
  const diagnosisCounts = gradingResults
    .flatMap(result => result.recall_pattern_diagnosis || [])
    .reduce((counts, item) => {
      if (!item?.pattern) return counts;
      const existing = counts.get(item.pattern) || { pattern: item.pattern, count: 0, severity: 0, coaching: item.coaching || "" };
      existing.count += 1;
      existing.severity = Math.max(existing.severity, Number(item.severity) || 0);
      if (!existing.coaching && item.coaching) existing.coaching = item.coaching;
      counts.set(item.pattern, existing);
      return counts;
    }, new Map());
  const diagnoses = [...diagnosisCounts.values()]
    .sort((a, b) => (b.count - a.count) || (b.severity - a.severity))
    .slice(0, 4);
  const avgScore = chapters.length
    ? Math.round(chapters.reduce((total, chapter) => total + evaluationScore(chapter.evaluation || {}), 0) / chapters.length)
    : 0;
  const strongCount = chapters.filter(chapter => evaluationScore(chapter.evaluation || {}) >= 80).length;
  const reviewedCount = reviews.length;
  const nextMove = diagnoses[0]
    ? `Next time you read, watch for ${recallPatternLabel(diagnoses[0].pattern).toLowerCase()}. ${diagnoses[0].coaching || "Pause and name the specific detail before moving on."}`
    : strongCount
      ? "Your main ideas are starting to hold. The next useful move is to keep attaching each claim to the evidence or relationship that makes it easier to retell."
      : "Keep using chapter checks to separate the main claim from interesting details. The pattern will get sharper as more chapters come in.";
  return {
    captured,
    centralClaims,
    supportingIdeas,
    relationships,
    examples,
    diagnoses,
    avgScore,
    strongCount,
    reviewedCount,
    nextMove
  };
}

function reportList(items = [], empty = "More checks will make this signal clearer.") {
  const clean = uniqueStrings(items, 5);
  if (!clean.length) return `<p class="report-empty">${escapeFeedback(empty)}</p>`;
  return `<ul class="report-list">${clean.map(item => `<li>${escapeFeedback(item)}</li>`).join("")}</ul>`;
}

function renderPatternCards(diagnoses = [], fallbackGap = "") {
  if (!diagnoses.length && !fallbackGap) {
    return '<p class="report-empty">No repeated recall pattern is strong enough to name yet.</p>';
  }
  const items = diagnoses.length
    ? diagnoses
    : [{ label: displayGapType(fallbackGap), count: 1, severity: 0, coaching: "Keep checking whether this shows up again in future chapters." }];
  return `<div class="report-pattern-list">${items.map(item => `
    <article>
      <span>${escapeFeedback(item.label || recallPatternLabel(item.pattern) || item.pattern)}</span>
      <strong>${escapeHtml(item.count)} ${item.count === 1 ? "chapter" : "chapters"}</strong>
      <p>${escapeFeedback(item.coaching || "This is worth watching in the next chapter check.")}</p>
    </article>
  `).join("")}</div>`;
}

function renderReportInsightCards(intelligence = {}, chapters = [], progressText = "", bookComplete = false) {
  const primaryPattern = intelligence.diagnoses?.[0];
  const patternLabel = primaryPattern ? recallPatternLabel(primaryPattern.pattern) : "";
  const forming = intelligence.centralClaims?.[0]
    || intelligence.captured?.[0]
    || "The book’s main thread is beginning to take shape across your chapter checks.";
  const pattern = primaryPattern
    ? `${patternLabel} is the pattern most worth watching next. ${primaryPattern.coaching || "Pause and name the specific detail before moving on."}`
    : "No repeated recall pattern is strong enough to name yet. A few more chapter checks will make the signal easier to trust.";
  const next = bookComplete
    ? "Carry this pattern into your next book. Start by watching whether the same recall habit shows up when the author, subject, and examples change."
    : intelligence.nextMove || "Use the next chapter check to name the central claim, then attach it to one concrete reason or example.";
  return `
    <section class="report-insight-strip" aria-label="Reading insights">
      <article class="report-insight-card tone-ink">
        <span>What’s forming</span>
        <h2>${escapeFeedback(forming)}</h2>
        <p>${escapeFeedback(progressText)}</p>
      </article>
      <article class="report-insight-card tone-amber">
        <span>Pattern to watch</span>
        <h2>${escapeFeedback(patternLabel || "Still emerging")}</h2>
        <p>${escapeFeedback(pattern)}</p>
      </article>
      <article class="report-insight-card tone-paper">
        <span>Next useful move</span>
        <h2>${bookComplete ? "Use the next book to test the pattern." : "Use the next chapter to sharpen the signal."}</h2>
        <p>${escapeFeedback(next)}</p>
      </article>
    </section>`;
}

function renderBookInsights(key) {
  const entries = loadChapters()
    .filter(chapter => bookKey(chapter.bookTitle, chapter.authorName || "") === key)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const chapters = entries.filter(chapter => chapter.status !== "Draft");
  if (!chapters.length) return toast("Complete a chapter check to see what’s sticking.");

  const book = loadBookMetadata().find(item => (item.key || bookKey(item.title, item.author)) === key);
  const reviews = chapters.flatMap(chapter => chapter.delayedAttempts || []);
  const strongChecks = chapters.filter(chapter => chapter.evaluation?.band === "Strong").length;
  const strongReviews = reviews.filter(review => review.band === "Strong").length;
  const gapCounts = chapters.reduce((counts, chapter) => {
    const gap = chapter.evaluation?.gapType;
    if (gap && gap !== "Optional challenge" && gap !== "Study challenge") counts.set(gap, (counts.get(gap) || 0) + 1);
    return counts;
  }, new Map());
  const gaps = [...gapCounts.entries()].sort((a, b) => b[1] - a[1]);
  const topGap = gaps[0]?.[0];
  const intelligence = bookReportIntelligence(chapters, reviews);
  const title = chapters[0].bookTitle;
  const author = chapters[0].authorName || book?.author || "";
  const totalChapters = Number.parseInt(book?.totalChapters || chapters[0].bookTotalChapters || "", 10);
  const hasTotal = Number.isFinite(totalChapters) && totalChapters > 0;
  const progressPercent = hasTotal ? Math.min(100, Math.round(chapters.length / totalChapters * 100)) : null;
  const bookComplete = hasTotal && chapters.length >= totalChapters;
  const progress = book?.totalChapters
    ? `${chapters.length} of ${book.totalChapters} chapters checked`
    : `${chapters.length} ${chapters.length === 1 ? "chapter" : "chapters"} checked`;
  const progressLead = hasTotal
    ? `You’ve checked ${chapters.length} of ${totalChapters} chapters.`
    : `You’ve checked ${chapters.length} ${chapters.length === 1 ? "chapter" : "chapters"}.`;
  const patternLabel = intelligence.diagnoses[0] ? recallPatternLabel(intelligence.diagnoses[0].pattern).toLowerCase() : "";
  const synthesis = patternLabel
    ? `${progressLead} The next useful layer is ${patternLabel}, because that is where your recall can become easier to explain across chapters.`
    : `${progressLead} The report will get more precise as more checks and reviews create a stronger pattern.`;

  $("#book-insights").innerHTML = `
    <article class="learning-report">
      <header class="insights-hero report-hero">
        <span class="eyebrow">What’s sticking?</span>
        <h1>${escapeHtml(title)}</h1>
        <p class="insights-byline">${author ? `by ${escapeHtml(author)} · ` : ""}${escapeHtml(progress)}</p>
        ${hasTotal ? `<div class="report-progress" aria-label="Book progress"><span><i style="width:${progressPercent}%"></i></span><strong>${progressPercent}%</strong></div>` : ""}
        <p class="insights-synthesis">${escapeFeedback(synthesis)}</p>
      </header>
      ${renderReportInsightCards(intelligence, chapters, progressLead, bookComplete)}
      <section class="insights-stats report-snapshot" aria-label="Book learning summary">
        <article><span>Book progress</span><strong>${chapters.length}${hasTotal ? ` / ${totalChapters}` : ""}</strong></article>
        <article><span>Recall signal</span><strong>${intelligence.avgScore}%</strong></article>
        <article><span>Reviews completed</span><strong>${reviews.length}</strong></article>
        <article><span>Pattern to watch</span><strong class="insights-text-stat">${escapeFeedback(intelligence.diagnoses[0] ? recallPatternLabel(intelligence.diagnoses[0].pattern) : topGap || "Still emerging")}</strong></article>
      </section>
      <div class="report-grid">
        <section class="insights-panel report-panel">
          <header><span class="eyebrow">What you captured</span><h2>The ideas coming back from memory</h2></header>
          ${reportList(intelligence.captured, "Your completed checks will reveal what is coming back from memory.")}
        </section>
        <section class="insights-panel report-panel">
          <header><span class="eyebrow">Reading map</span><h2>What the source seems to be building</h2></header>
          <div class="report-map-grid">
            <div><span>Central claims</span>${reportList(intelligence.centralClaims, "Add source material to build a stronger map.")}</div>
            <div><span>Supporting ideas</span>${reportList(intelligence.supportingIdeas, "Supporting ideas will appear as more chapters are checked.")}</div>
            <div><span>Connections</span>${reportList(intelligence.relationships, "Connections will sharpen when the Reading Map has relationships to compare.")}</div>
          </div>
        </section>
        <section class="insights-panel report-panel">
          <header><span class="eyebrow">Recall pattern diagnosis</span><h2>Where the work can get sharper</h2></header>
          ${renderPatternCards(intelligence.diagnoses, topGap)}
        </section>
        <section class="insights-panel report-panel report-next">
          <header><span class="eyebrow">Next move</span><h2>${bookComplete ? "What to carry into the next book" : "What to do in the next chapter"}</h2></header>
          <p>${escapeFeedback(bookComplete ? "Use the next book to test whether this same recall pattern follows you into new material. If it does, it is probably a durable reading habit worth practicing." : intelligence.nextMove)}</p>
          ${intelligence.examples.length ? `<div class="report-evidence"><span>Useful evidence style</span>${reportList(intelligence.examples, "Evidence will appear after more source-backed checks.")}</div>` : ""}
        </section>
      </div>
    </article>
    <section class="chapter-signals report-chapter-signals">
      <header><span class="eyebrow">Chapter signals</span><h2>How your understanding is changing</h2></header>
      <div>${chapters.map(chapter => {
        const latestReview = chapter.delayedAttempts?.at(-1);
        const score = evaluationScore(chapter.evaluation || {});
        const scoreTone = recallScoreTone(score);
        const pattern = chapter.evaluation?.gradingResult?.recall_pattern_diagnosis?.[0]?.pattern;
        return `<button type="button" data-chapter-id="${chapter.id}">
          <span><strong>${escapeHtml(chapter.chapterTitle)}</strong><small>${latestReview ? `Reviewed ${new Date(latestReview.createdAt).toLocaleDateString()}` : "Awaiting delayed review"}</small></span>
          <span class="signal-bands"><em class="recall-score-tag is-${scoreTone}">${score}% recall</em><em>${escapeFeedback(pattern ? recallPatternLabel(pattern) : displayBand(latestReview?.band || "Not reviewed"))}</em></span>
          <span aria-hidden="true">→</span>
        </button>`;
      }).join("")}</div>
    </section>`;
  state.currentBookKey = key;
  setView("book-insights");
}

function renderDashboard() {
  $$("[data-local-greeting]").forEach(element => {
    element.textContent = localGreeting();
  });
  const entries = migrateReviewsToFsrs(loadChapters()).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const chapters = entries.filter(chapter => chapter.status !== "Draft");
  const drafts = entries.filter(chapter => chapter.status === "Draft");
  const scheduled = chapters.filter(reviewIsScheduled).sort((a, b) => new Date(a.reviewDue) - new Date(b.reviewDue));
  const due = scheduled.filter(reviewIsDue);
  const reviewSummary = reviewQueueSummary(due, scheduled);
  const hasChapters = isLoggedIn() && entries.length > 0;
  $("#onboarding-home").hidden = hasChapters;
  $("#returning-home").hidden = !hasChapters;
  $("#review-count").textContent = scheduled.length;
  $("#review-count").classList.toggle("is-due", due.length > 0);
  $("#review-count").classList.toggle("has-scheduled", scheduled.length > 0 && !due.length);
  $("#review-count").title = reviewSummary;
  const reviewsNav = $('[data-nav="reviews"]');
  if (reviewsNav) {
    reviewsNav.title = `Reviews · ${reviewSummary}`;
    reviewsNav.setAttribute("aria-label", `Reviews. ${reviewSummary}`);
  }
  renderLibrary(entries);

  if (hasChapters) {
    const completedReviews = chapters.reduce((total, chapter) => total + (chapter.delayedAttempts?.length || 0), 0);
    const repairs = chapters.filter(chapter => chapter.repairResolved).length;
    const gapCounts = chapters.reduce((counts, chapter) => {
      const gap = chapter.evaluation?.gapType;
      if (gap && gap !== "Optional challenge" && gap !== "Study challenge") counts.set(gap, (counts.get(gap) || 0) + 1);
      return counts;
    }, new Map());
    const commonGap = [...gapCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "No pattern yet";
    const practiceReason = commonGap === "Missed central claim"
      ? "Finding the central claim has surfaced as a recurring opportunity in your chapter checks."
      : commonGap === "Insufficient response"
        ? "Practice building a complete claim before adding reasons and examples."
        : commonGap === "No pattern yet"
          ? "Start with a foundational skill: separating what a passage discusses from what it actually argues."
          : `Finding the central claim gives you a stronger foundation for working on ${commonGap.toLowerCase()}.`;
    $("#practice-reason").textContent = practiceReason;
    const practiceState = currentPracticeSkillState();
    $("#practice-home-promo").hidden = false;
    $("#practice-home-promo").classList.toggle("is-ready", !practiceState.completedToday);
    $("#practice-home-promo").classList.toggle("is-complete", practiceState.completedToday);
    $("#practice-home-state").textContent = practiceState.completedToday ? "Practice complete today" : "Skill focus";
    $("#practice-home-title").textContent = practiceState.skill.title;
    $("#practice-home-reason").textContent = practiceState.completedToday
      ? "Nice. Today’s practice is logged. You can revisit the lesson, or come back tomorrow for a new question."
      : practiceReason;
    $("#practice-home-progress-label").textContent = `${practiceState.successfulDays} of 3 successful days`;
    $("#practice-home-progress-fill").style.width = `${practiceState.progressPercent}%`;
    $(".home-practice-progress [role='progressbar']")?.setAttribute("aria-valuenow", String(practiceState.successfulDays));
    $("#practice-home-action").innerHTML = practiceState.completedToday
      ? "View practice <span>→</span>"
      : "Try 3-minute practice <span>→</span>";
    const currentReading = chooseCurrentReadingState(entries);
    const latest = currentReading?.chapter || entries[0];
    const latestBookKey = currentReading?.book?.key || bookKey(latest.bookTitle, latest.authorName || "");
    const latestCompleted = currentReading?.completed || 0;
    const latestTotal = currentReading?.book?.total || null;
    const bookIsComplete = currentReading?.kind === "complete";
    const bookIsDraft = currentReading?.kind === "draft";
    const progressPercent = latestTotal ? Math.min(100, Math.round(latestCompleted / latestTotal * 100)) : 0;
    const focusOptions = focusBookOptions(entries);
    const manualFocusKey = localStorage.getItem(FOCUS_BOOK_KEY) || "";

    if ($("#dashboard-message")) {
      $("#dashboard-message").textContent = due.length
        ? `${due.length === 1 ? "One review is" : `${due.length} reviews are`} ready when you are. You’ve checked ${chapters.length} ${chapters.length === 1 ? "chapter" : "chapters"} so far.`
        : `Nothing needs your attention right now. You’ve checked ${chapters.length} ${chapters.length === 1 ? "chapter" : "chapters"}${drafts.length ? ` and have ${drafts.length === 1 ? "a draft" : `${drafts.length} drafts`} waiting` : ""}.`;
    }
    $("#stat-chapters").textContent = chapters.length;
    $("#stat-reviews").textContent = completedReviews;
    $("#stat-repairs").textContent = repairs;
    $("#stat-gap").textContent = commonGap;
    $("#stat-gap").title = commonGap;
    $("#continue-state").textContent = bookIsDraft
      ? "Draft in progress"
      : bookIsComplete
        ? "Book complete"
        : "Continue reading";
    $("#continue-marker").textContent = bookIsDraft
      ? "✎"
      : bookIsComplete
        ? "✓"
        : "↗";
    $("#continue-book").textContent = currentReading?.book?.title || latest.bookTitle;
    $("#continue-meta").textContent = bookIsDraft
      ? `Draft saved for ${latest.chapterTitle} · ${latestCompleted}${latestTotal ? ` of ${latestTotal}` : ""} completed`
      : bookIsComplete
        ? `${latestCompleted} of ${latestTotal} chapters checked · Final review still ahead`
        : latestTotal
        ? `${latestCompleted} of ${latestTotal} chapters checked · Last: ${latest.chapterTitle}`
        : `${latestCompleted} ${latestCompleted === 1 ? "chapter" : "chapters"} completed · Last: ${latest.chapterTitle}`;
    $("#continue-progress").hidden = !latestTotal || bookIsDraft;
    $("#continue-progress-fill").style.width = `${progressPercent}%`;
    $("#continue-progress-label").textContent = `${progressPercent}%`;
    $("#continue-progress").setAttribute("aria-valuenow", String(progressPercent));
    $("#focus-book-select").innerHTML = '<option value="">Automatic focus</option>' +
      focusOptions.map(book => `<option value="${escapeHtml(book.key)}">${escapeHtml(book.title)}${book.author ? ` by ${escapeHtml(book.author)}` : ""}</option>`).join("");
    $("#focus-book-select").value = manualFocusKey && focusOptions.some(book => book.key === manualFocusKey) ? manualFocusKey : "";
    $("#open-book-insights").textContent = bookIsComplete ? "Review what stuck" : "What’s sticking?";
    $("#open-latest").textContent = bookIsDraft ? "Resume draft" : "Open last check";
    $("#check-next").textContent = bookIsComplete ? "Start another book" : "Check next chapter";
    $("#open-book-insights").dataset.bookKey = latestBookKey;
    $("#open-latest").dataset.chapterId = latest.id;
    $("#check-next").dataset.mode = bookIsComplete ? "new-book" : "next-chapter";
    $("#check-next").dataset.bookTitle = currentReading?.book?.title || latest.bookTitle;
    $("#check-next").dataset.authorName = currentReading?.book?.author || latest.authorName || "";

    let nextAction = {
      label: "Recommended next",
      marker: "↗",
      title: bookIsComplete ? "Start another book." : "Check the next chapter.",
      copy: bookIsComplete
        ? "This book is checked. Keep the habit moving with a fresh book."
        : `Continue ${currentReading?.book?.title || latest.bookTitle} while the thread is still warm.`,
      text: bookIsComplete ? "Start another book" : "Check next chapter",
      action: () => startNew({
        ...(bookIsComplete
          ? { bookPath: "new" }
          : {
            bookPath: "existing",
            bookTitle: currentReading?.book?.title || latest.bookTitle,
            authorName: currentReading?.book?.author || latest.authorName || ""
          })
      })
    };
    if (!practiceState.completedToday) {
      nextAction = {
        label: "Recommended next",
        marker: "3m",
        title: "Do today’s 3-minute question.",
        copy: "It is the smallest useful move available right now. The skill focus and your progress are below.",
        text: "Start daily question",
        action: () => setView("practice")
      };
    } else if (due.length) {
      const review = due[0];
      nextAction = {
        label: due.length === 1 ? "Review due" : `${due.length} reviews due`,
        marker: "◉",
        title: `Review ${review.chapterTitle}.`,
        copy: `${review.bookTitle} is ready for delayed recall. Re-enter with the context card, then answer from memory.`,
        text: "Start review",
        action: () => openReview(review.id)
      };
    } else if (bookIsDraft) {
      nextAction = {
        label: "Draft waiting",
        marker: "✎",
        title: `Resume ${latest.chapterTitle}.`,
        copy: "You already started this chapter check. Finish it before starting a new thread.",
        text: "Resume draft",
        action: () => openChapter(latest.id)
      };
    }
    $("#next-action-label").textContent = nextAction.label;
    $("#next-action-marker").textContent = nextAction.marker;
    $("#next-action-title").textContent = nextAction.title;
    $("#next-action-copy").textContent = nextAction.copy;
    $("#next-action-button").innerHTML = `${escapeHtml(nextAction.text)} <span>→</span>`;
    $("#next-action-button").onclick = nextAction.action;
  }

  $("#home-reviews").innerHTML = scheduled.length
    ? scheduled.slice(0, 3).map(chapter => renderReviewItem(chapter)).join("")
    : '<div class="empty-state"><strong>No reviews scheduled</strong>Complete a chapter check and FSRS will bring it back.</div>';
  $("#all-reviews").innerHTML = scheduled.length
    ? renderReviewQueue(scheduled)
    : '<div class="empty-state"><strong>Your review queue is clear</strong>New checks return here when FSRS schedules them.</div>';
  $("#recent-checks").innerHTML = entries.length
    ? entries.slice(0, 4).map(renderRecentItem).join("")
    : '<div class="empty-state"><strong>No checks yet</strong>Your first chapter takes about six minutes.</div>';
  renderPracticeProgress();
}

const reviewPrompts = {
  "Insufficient response": [
    "What did the author most want the reader to believe?",
    "Explain the chapter’s main point in one or two sentences.",
    "If you could preserve only one idea from this chapter, what would it be and why?"
  ],
  "Missed central claim": [
    "State the chapter’s central claim and the strongest reason the author gives for it.",
    "What is the author arguing, not merely describing?",
    "State what the author wants the reader to understand."
  ],
  "Weak relationship between ideas": [
    "How do the chapter’s two main ideas depend on or reinforce one another?",
    "Why does one of these ideas lead to the other?",
    "What connection between these ideas is essential to the author’s argument?"
  ],
  "Missed supporting evidence": [
    "What example or reason best supports the chapter’s central claim?",
    "Why does the author believe this claim is true?",
    "What evidence would you use to explain this idea to someone skeptical?"
  ],
  "Study challenge": [
    "Where might this chapter’s main idea break down?",
    "What real situation would test this idea?",
    "What assumption does the argument depend on?"
  ]
};

const centralClaimPrompts = [
  chapter => `What is the central claim of “${chapter.chapterTitle}”?`,
  () => "State what the author wants the reader to understand.",
  () => "If you could preserve only one argument from this chapter, what would it be?"
];

function reviewResult(band) {
  if (band === "Strong") return "Recovered";
  if (band === "Developing") return "Partly retained";
  return "Still missing";
}

function resultRank(band) {
  if (band === "Strong") return 2;
  if (band === "Developing") return 1;
  return 0;
}

function chooseReviewPrompt(chapter) {
  const attempts = chapter.delayedAttempts || [];
  const latest = attempts.at(-1);
  const rawGapType = chapter.evaluation?.gapType || "";
  const gapType = isStudyChallengeGap(rawGapType) ? "Study challenge" : displayGapType(rawGapType);
  const prompts = reviewPrompts[gapType] || reviewPrompts["Missed supporting evidence"];
  const preferred = latest ? resultRank(latest.gapBand) : 0;
  const previous = Number.isInteger(latest?.promptVariant) ? latest.promptVariant : -1;
  const promptVariant = preferred === previous ? (preferred + 1) % prompts.length : preferred;
  const previousCentral = Number.isInteger(latest?.centralPromptVariant) ? latest.centralPromptVariant : -1;
  const centralPromptVariant = (previousCentral + 1) % centralClaimPrompts.length;
  return {
    gapType: gapType || "Missed supporting evidence",
    promptVariant,
    prompt: normalizeReviewPrompt(prompts[promptVariant]),
    centralPromptVariant
  };
}

function needsReviewScaffolding(chapter) {
  const attempts = (chapter.delayedAttempts || []).filter(attempt => attempt.gapBand);
  return attempts.length >= 2 && attempts.slice(-2).every(attempt => resultRank(attempt.gapBand) === 0);
}

function openReview(id, options = {}) {
  const chapter = loadChapters().find(item => item.id === id);
  if (!chapter) return;
  if (options.sessionIds?.length) {
    state.reviewSession = {
      ids: options.sessionIds,
      index: Math.max(0, options.sessionIds.indexOf(id))
    };
  } else if (options.keepSession && state.reviewSession?.ids?.includes(id)) {
    state.reviewSession.index = state.reviewSession.ids.indexOf(id);
  } else {
    state.reviewSession = null;
  }
  state.reviewId = id;
  state.reviewStep = 0;
  state.reviewDraft = chooseReviewPrompt(chapter);
  renderReviewStep(chapter);
  setView("review-session");
}

function startReviewSession(ids = []) {
  const sessionIds = ids.filter(Boolean).slice(0, 3);
  if (!sessionIds.length) return;
  openReview(sessionIds[0], { sessionIds });
}

function sourceKindLabel(kind = "full") {
  return {
    full: "Chapter text",
    notes: "Notes",
    highlights: "Highlights",
    pdf: "PDF text"
  }[kind] || "Source material";
}

function synopsisFromText(text = "", maxSentences = 2, maxLength = 260) {
  const clean = sentenceSnippet(text);
  if (!clean) return "";
  const selected = sentences(clean).slice(0, maxSentences).join(" ") || clean;
  return selected.length > maxLength ? `${selected.slice(0, maxLength).replace(/\s+\S*$/, "")}...` : selected;
}

function reviewSourceSynopsis(chapter) {
  const mapClaim = chapter.evaluation?.readingMap?.central_claim;
  const sourceSynopsis = synopsisFromText(chapter.sourceText, 2, 280);
  if (mapClaim && sourceSynopsis && !sourceSynopsis.toLowerCase().includes(mapClaim.toLowerCase().slice(0, 40))) {
    return `${mapClaim} ${sourceSynopsis}`;
  }
  return mapClaim || sourceSynopsis || "No source synopsis is available for this chapter.";
}

function reviewAnswerSynopsis(chapter) {
  const recall = synopsisFromText(chapter.recall, 2, 260);
  if (!recall) return "No prior response was saved.";
  return recall;
}

function renderReviewContext(chapter, isGapStep) {
  const checkedDate = chapter.createdAt
    ? new Date(chapter.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : "Earlier check";
  const gapLabel = displayGapType(chapter.evaluation?.gapType || "Idea to revisit");
  $("#review-context-title").textContent = isGapStep ? "Re-enter the weak spot." : "Zoom back out.";
  $("#review-context-copy").textContent = isGapStep
    ? "Use the synopsis to find your footing, then rebuild the missing idea without opening the full source or prior answer."
    : "Use the synopsis to orient yourself, then recover the chapter’s main argument in your own words.";
  $("#review-context-details").innerHTML = `
    <dl class="review-context-facts">
      <div><dt>Book</dt><dd>${escapeHtml(chapter.bookTitle || "Untitled book")}</dd></div>
      <div><dt>Chapter</dt><dd>${escapeHtml(chapter.chapterTitle || "Untitled chapter")}</dd></div>
      <div><dt>First checked</dt><dd>${escapeHtml(`${checkedDate}${chapter.confidence ? ` · ${chapter.confidence}` : ""}`)}</dd></div>
      <div><dt>This step</dt><dd>${escapeHtml(isGapStep ? gapLabel : "Central claim")}</dd></div>
    </dl>
    <div class="review-synopsis-grid">
      <article>
        <span>Source synopsis</span>
        <p>${escapeHtml(reviewSourceSynopsis(chapter))}</p>
      </article>
      <article>
        <span>Your prior answer</span>
        <p>${escapeHtml(reviewAnswerSynopsis(chapter))}</p>
      </article>
    </div>
    <p class="review-context-note">${escapeHtml(sourceKindLabel(chapter.sourceKind))} and your full prior response stay closed. This is just enough context to wayfind.</p>
  `;
}

function renderReviewStep(chapter) {
  $("#delayed-recall").value = "";
  $$('[name="delayedConfidence"]').forEach(input => { input.checked = false; });
  const isGapStep = state.reviewStep === 0;
  const useScaffolding = isGapStep && needsReviewScaffolding(chapter);
  const isStudyChallenge = isStudyChallengeGap(chapter.evaluation?.gapType || "");
  renderReviewContext(chapter, isGapStep);
  if (state.reviewSession?.ids?.length) {
    const totalSteps = state.reviewSession.ids.length * 2;
    const currentStep = state.reviewSession.index * 2 + (isGapStep ? 1 : 2);
    const reviewProgress = Math.round(currentStep / totalSteps * 100);
    $("#review-part-label").textContent = `${state.reviewSession.index + 1} of ${state.reviewSession.ids.length} chapters · ${isGapStep ? "Previous gap" : "Central claim"}`;
    $("#review-progress-fill").style.width = `${reviewProgress}%`;
    $(".review-progress [role='progressbar']")?.setAttribute("aria-valuenow", String(reviewProgress));
  } else {
    $("#review-part-label").textContent = isGapStep ? "1 of 2 · Previous gap" : "2 of 2 · Central claim";
    $("#review-progress-fill").style.width = isGapStep ? "50%" : "100%";
    $(".review-progress [role='progressbar']")?.setAttribute("aria-valuenow", isGapStep ? "50" : "100");
  }
  $("#review-step-eyebrow").textContent = isGapStep ? "Revisit the gap" : "Test the main idea";
  $("#review-session-title").textContent = isGapStep
    ? normalizeReviewPrompt(state.reviewDraft?.prompt || chapter.evaluation?.prompt)
    : centralClaimPrompts[state.reviewDraft?.centralPromptVariant || 0](chapter);
  $("#review-session-meta").textContent = isGapStep
    ? isStudyChallenge
      ? "Name one situation where the idea would need a caveat, exception, or adjustment."
      : `Earlier signal was ${displayGapType(chapter.evaluation?.gapType || "an idea needed another pass")}. Answer without looking back.`
    : "In one or two sentences, reconstruct the chapter’s main argument in your own words.";
  $("#delayed-recall").placeholder = isGapStep
    ? isStudyChallenge
      ? "Describe the situation where the idea would not fully apply."
      : "Explain the missing idea or connection."
    : "State the central claim and its most important support.";
  $("#review-continue").innerHTML = isGapStep ? "Next question <span>→</span>" : "See what lasted <span>→</span>";
  $("#review-scaffold").hidden = !useScaffolding;
  $("#review-scaffold-source").textContent = useScaffolding ? chapter.evaluation?.gapEvidence?.sentence || "" : "";
  $("#review-source-state").textContent = useScaffolding ? "One focused excerpt is available" : "Source and prior answer hidden";
  $("#review-source-note").textContent = useScaffolding ? "You have tried this idea twice, so a small support is included." : "This is a check of what lasted.";
}

function completeReview() {
  const delayed = $("#delayed-recall").value.trim();
  const confidence = $('[name="delayedConfidence"]:checked')?.value;
  if (wordCount(delayed) < 4 || !confidence) {
    toast("Add what you remember and choose a confidence level.");
    return;
  }
  const chapters = loadChapters();
  const index = chapters.findIndex(item => item.id === state.reviewId);
  if (index < 0) return;
  const chapter = chapters[index];
  if (state.reviewStep === 0) {
    const gapSource = chapter.evaluation?.gapEvidence?.sentence || chapter.sourceText;
    const gapResult = evaluateResponse(gapSource, delayed, "full");
    state.reviewDraft = {
      ...(state.reviewDraft || {}),
      gapResponse: delayed,
      gapConfidence: confidence,
      gapBand: gapResult.band,
      gapResult: reviewResult(gapResult.band)
    };
    state.reviewStep = 1;
    renderReviewStep(chapter);
    setTimeout(() => $("#delayed-recall").focus(), 100);
    return;
  }
  const result = evaluateResponse(chapter.sourceText, delayed, chapter.sourceKind);
  const previousAttempt = chapter.delayedAttempts?.at(-1);
  const attempt = {
    ...(state.reviewDraft || {}),
    response: delayed,
    confidence,
    band: result.band,
    centralClaimResult: displayBand(result.band),
    createdAt: new Date().toISOString()
  };
  chapter.delayedAttempts = [...(chapter.delayedAttempts || []), attempt];
  const schedule = nextReviewSchedule(attempt, previousAttempt, chapter.fsrsCard || null);
  const reviewScheduleInputs = {
    gapBand: attempt.gapBand,
    centralBand: attempt.band,
    confidence: attempt.confidence,
    responseWordCount: wordCount(attempt.response || ""),
    gapResponseWordCount: wordCount(attempt.gapResponse || ""),
    score: evaluationScore(result),
    gapType: chapter.evaluation?.gapType || ""
  };
  chapter.status = "Review scheduled";
  chapter.reviewDue = new Date(schedule.due || addDays(new Date(), schedule.days)).toISOString();
  chapter.fsrsCard = schedule.card || chapter.fsrsCard || null;
  chapter.reviewSchedule = {
    model: "ts-fsrs",
    package: "ts-fsrs",
    packageVersion: "5.4.1",
    policyVersion: SCHEDULING_POLICY_VERSION,
    days: schedule.days,
    reason: schedule.reason,
    rating: schedule.ratingLabel,
    inputs: reviewScheduleInputs,
    reasonSnapshot: scheduleReasonSnapshot(schedule, "review", {
      evaluation: result,
      confidence: attempt.confidence,
      inputs: reviewScheduleInputs,
      gapType: chapter.evaluation?.gapType || ""
    }),
    log: schedule.log || null,
    scheduledAt: new Date().toISOString()
  };
  chapter.updatedAt = new Date().toISOString();
  chapters[index] = chapter;
  saveChapters(chapters);
  renderDashboard();
  const nextSessionId = state.reviewSession?.ids?.[state.reviewSession.index + 1];
  state.reviewDraft = null;
  if (nextSessionId) {
    toast(`Review saved. Next chapter in this set is ready.`);
    openReview(nextSessionId, { keepSession: true });
    return;
  }
  if (state.reviewSession?.ids?.length) {
    const completedCount = state.reviewSession.ids.length;
    state.reviewSession = null;
    toast(`${completedCount} review${completedCount === 1 ? "" : "s"} complete. Take a break or keep going from the queue.`);
    setView("reviews");
    return;
  }
  toast(`Review complete. FSRS scheduled the next review ${reviewTimingCopy(schedule.days)} because ${schedule.reason}.`);
  openChapter(chapter.id);
}

function renderSavedChapterFeedback(chapter) {
  const evaluation = chapter.evaluation || evaluateResponse(chapter.sourceText || "", chapter.recall || "", chapter.sourceKind || "full");
  const structured = evaluation.gradingResult || localStructuredFeedback(evaluation);
  const progression = progressionForEvaluation(evaluation);
  const rememberedItems = cleanConceptItems(evaluation, structured);
  const patternFeedback = generatedCoachingFeedback(structured)
    || formalRecallPatternFeedback(structured.recall_pattern_diagnosis || [])
    || recallGapReminderFeedback(evaluation, structured);
  const strengthenBody = patternFeedback
    ? `<p>${escapeFeedback(patternFeedback.intro || (evaluation.band === "Strong" ? "You can go deeper by noticing the detail that would make this idea easier to use later." : "This is the pattern most worth watching next time you read."))}</p>
      ${feedbackConceptList(patternFeedback.title, patternFeedback.items)}
      ${sourceEvidenceBlock("Text evidence to revisit", evaluation.gapEvidence, "revisit")}`
    : "";
  const reviewState = chapter.reviewDue
    ? `Review scheduled for ${new Date(chapter.reviewDue).toLocaleDateString()}.`
    : "No review is scheduled right now.";
  return `
    <div class="chapter-feedback-shell learning-report chapter-learning-report">
      <div class="learning-path">
        <article class="path-step path-step-signal">
          <span class="path-marker">1</span>
          <div class="path-card checkpoint-hero">
            <div>
              <span class="eyebrow">Feedback snapshot</span>
              <h2>${escapeFeedback(progression.title)}</h2>
              <div class="progression-meter-row"><div class="progression-meter" style="--progression:${progression.progress}%"><span></span></div><strong>${progression.progress}%</strong></div>
              <p>${escapeFeedback(progression.signal)}</p>
            </div>
          </div>
        </article>
        <article class="path-step">
          <span class="path-marker">2</span>
          <div class="path-card feedback-card">
            <header><h3>What you captured</h3></header>
            <p>${escapeFeedback(whatHeldIntro(evaluation, structured))}</p>
            ${feedbackConceptList("Key concepts", rememberedItems)}
            ${sourceEvidenceBlock("Evidence for what came through", evaluation.strengthEvidence)}
          </div>
        </article>
        ${patternFeedback ? `<article class="path-step path-step-warm">
          <span class="path-marker">3</span>
          <div class="path-card feedback-card gap">
            <header><h3>${patternFeedback.title === "Reminder for next time" ? "Reminder for next time" : evaluation.band === "Strong" ? "Where to go deeper next time" : "What to look for next time"}</h3></header>
            ${strengthenBody}
          </div>
        </article>` : ""}
        <article class="path-step path-step-final">
          <span class="path-marker">→</span>
          <div class="path-card feedback-card next-move">
            <header><h3>Next move</h3></header>
            <p>${escapeFeedback(readingStrategyFor(evaluation))}</p>
            <div class="next-challenge-pill"><span>${escapeFeedback(displayGapType(evaluation.gapType || "Study challenge"))}</span><strong>${escapeFeedback(normalizeReviewPrompt(evaluation.prompt || "Return to the chapter’s central claim and name the support that makes it work."))}</strong></div>
            <p class="path-card-note">${escapeFeedback(reviewState)}</p>
          </div>
        </article>
      </div>
    </div>`;
}

function renderSavedChapterEntry(chapter) {
  const latest = chapter.delayedAttempts?.at(-1);
  const sourceUrl = safeHttpUrl(chapter.sourceUrl);
  return `
    <div class="history chapter-entry-history">
      <article class="history-card">
        <header><h2>Reading source</h2><span class="status-tag">${escapeHtml(readingTypeLabel(chapter.readingType))}</span></header>
        <p class="response-quote">${sourceUrl ? `<a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(sourceUrl)}</a>` : "No source URL saved."}</p>
      </article>
      <article class="history-card">
        <header><h2>Your recall</h2><time>${new Date(chapter.createdAt).toLocaleDateString()}</time></header>
        <p class="response-quote">${escapeHtml(chapter.recall || "No recall response saved.")}</p>
      </article>
      <article class="history-card">
        <header><h2>Confidence</h2><span class="status-tag">${escapeHtml(chapter.confidence || "Not recorded")}</span></header>
        <p class="response-quote">${escapeHtml(confidencePhrase(chapter.confidence))}</p>
      </article>
      <article class="history-card">
        <header><h2>Challenge response</h2><span class="status-tag ${chapter.repairResolved ? "" : "repair"}">${chapter.repairResolved ? "Completed" : "Attempted"}</span></header>
        <p class="response-quote">${escapeHtml(chapter.repair || "Challenge skipped.")}</p>
      </article>
      ${latest ? `<article class="history-card delayed-review-card">
        <header><h2>Delayed review</h2><time>${new Date(latest.createdAt).toLocaleDateString()}</time></header>
        ${latest.gapResponse ? `<div class="review-result-row"><div><span>Previous gap</span><strong>${escapeHtml(latest.gapResult || reviewResult(latest.gapBand))}</strong></div><p class="response-quote">${escapeHtml(latest.gapResponse)}</p></div>` : ""}
        <div class="review-result-row"><div><span>Central claim</span><strong>${escapeHtml(latest.centralClaimResult || displayBand(latest.band))}</strong></div><p class="response-quote">${escapeHtml(latest.response)}</p></div>
        <p class="review-schedule-note">${chapter.reviewDue ? `Next review ${formatReviewDate(chapter.reviewDue)} · scheduled from the weaker result.` : "Both signals are holding up. No further review is scheduled."}</p>
      </article>` : ""}
      ${renderScheduleHistory(chapter)}
    </div>`;
}

function openChapter(id) {
  const chapter = loadChapters().find(item => item.id === id);
  if (!chapter) return;
  if (chapter.status === "Draft") {
    state.currentId = chapter.id;
    state.evaluation = chapter.evaluation || null;
    state.repairResolved = Boolean(chapter.repairResolved);
    renderBookOptions(chapter.bookTitle, chapter.authorName);
    setValues({ ...chapter, bookPath: "existing" });
    const resumeStep = Math.max(0, Math.min(4, chapter.draftStep || 0));
    setStep(chapter.sourceText ? resumeStep : 0);
    setView("flow");
    if (state.evaluation && resumeStep >= 3) renderEvaluation(true);
    toast("Draft reopened. Pick up where you left off.");
    return;
  }
  $("#chapter-detail").innerHTML = `
    <header class="chapter-hero">
      <div class="chapter-kicker">
        <span class="eyebrow">${escapeHtml(chapter.bookTitle)}</span>
        <time>${new Date(chapter.createdAt).toLocaleDateString()}</time>
      </div>
      <h1>${escapeHtml(chapter.chapterTitle)}</h1>
      <p>${escapeHtml(chapter.authorName || "Author not added")} · ${escapeHtml(chapter.status)}</p>
    </header>
    <div class="chapter-tabs" role="tablist" aria-label="Chapter detail">
      <button class="is-active" id="chapter-tab-feedback" type="button" role="tab" aria-selected="true" aria-controls="chapter-panel-feedback" data-chapter-tab="feedback">Feedback</button>
      <button id="chapter-tab-entry" type="button" role="tab" aria-selected="false" aria-controls="chapter-panel-entry" data-chapter-tab="entry">My entry</button>
    </div>
    <section class="chapter-tab-panel is-active" id="chapter-panel-feedback" data-chapter-tab-panel="feedback" role="tabpanel" aria-labelledby="chapter-tab-feedback">
      ${renderSavedChapterFeedback(chapter)}
    </section>
    <section class="chapter-tab-panel" id="chapter-panel-entry" data-chapter-tab-panel="entry" role="tabpanel" aria-labelledby="chapter-tab-entry" hidden>
      ${renderSavedChapterEntry(chapter)}
    </section>
    <div class="detail-actions">
      <button class="secondary" type="button" data-action="edit-chapter" data-edit-chapter-id="${chapter.id}">Edit response</button>
      <button class="secondary" type="button" data-action="view-chapter-source" data-chapter-id="${chapter.id}">View source</button>
      ${chapter.reviewDue ? `<button class="secondary" type="button" data-action="adjust-review" data-manage-review-id="${chapter.id}" data-delay="${Math.max(1, daysUntilReview(chapter) - 1)}">Review sooner</button>
      <button class="secondary" type="button" data-action="adjust-review" data-manage-review-id="${chapter.id}" data-delay="${Math.max(2, daysUntilReview(chapter) + 3)}">Review later</button>` : ""}
      ${chapter.reviewDue ? `<button class="primary" type="button" data-review-id="${chapter.id}">Start review <span>→</span></button>` : ""}
    </div>`;
  setView("chapter");
}

function editChapter(id) {
  const chapter = loadChapters().find(item => item.id === id);
  if (!chapter || chapter.status === "Draft") return;
  $("#chapter-detail").innerHTML = `
    <header class="chapter-hero edit-chapter-hero">
      <span class="eyebrow">${escapeHtml(chapter.bookTitle)}</span>
      <h1>Edit chapter response</h1>
      <p>Update what you submitted without losing scheduled or completed reviews.</p>
    </header>
    <form class="chapter-edit-form" data-editing-chapter-id="${chapter.id}">
      <label class="field">
        <span>Chapter title</span>
        <input id="edit-chapter-title" type="text" value="${escapeHtml(chapter.chapterTitle)}" required>
      </label>
      <div class="field-grid reading-context-grid">
        <label class="field">
          <span>Reading format</span>
          <select id="edit-reading-type">
            ${["book", "article", "essay", "paper", "newsletter", "webpage", "other"].map(type => `<option value="${type}"${(chapter.readingType || "book") === type ? " selected" : ""}>${escapeHtml(readingTypeLabel(type))}</option>`).join("")}
          </select>
        </label>
        <label class="field">
          <span>Source URL</span>
          <input id="edit-source-url" type="url" value="${escapeHtml(chapter.sourceUrl || "")}" placeholder="https://example.com/article" autocomplete="url">
        </label>
      </div>
      <label class="field">
        <span>Initial recall</span>
        <textarea id="edit-chapter-recall" rows="12" required>${escapeHtml(chapter.recall)}</textarea>
        <small>Saving recalculates the immediate feedback using your revised recall.</small>
      </label>
      <label class="field">
        <span>Challenge response</span>
        <textarea id="edit-chapter-challenge" rows="7" placeholder="No challenge response saved.">${escapeHtml(chapter.repair || "")}</textarea>
      </label>
      ${(chapter.delayedAttempts || []).map((attempt, index) => `
        <fieldset class="edit-response-group">
          <legend>Delayed review · ${new Date(attempt.createdAt).toLocaleDateString()}</legend>
          ${attempt.gapResponse ? `<label class="field">
            <span>Previous gap response</span>
            <textarea class="edit-review-response" data-review-index="${index}" data-response-field="gapResponse" rows="6">${escapeHtml(attempt.gapResponse)}</textarea>
          </label>` : ""}
          <label class="field">
            <span>Central claim response</span>
            <textarea class="edit-review-response" data-review-index="${index}" data-response-field="response" rows="6">${escapeHtml(attempt.response || "")}</textarea>
          </label>
        </fieldset>`).join("")}
      <div class="detail-actions">
        <button class="secondary" type="button" data-action="cancel-chapter-edit" data-edit-chapter-id="${chapter.id}">Cancel</button>
        <button class="primary" type="button" data-action="save-chapter-edit" data-edit-chapter-id="${chapter.id}">Save changes <span>→</span></button>
      </div>
    </form>`;
  setTimeout(() => $("#edit-chapter-title").focus(), 100);
}

function saveChapterEdit(id) {
  const title = $("#edit-chapter-title")?.value.trim();
  const recall = $("#edit-chapter-recall")?.value.trim();
  const sourceUrl = $("#edit-source-url")?.value.trim() || "";
  if (!title || !recall) {
    toast("Add both a chapter title and your response.");
    return;
  }
  $("#edit-source-url")?.removeAttribute("aria-invalid");
  if (sourceUrl && !safeHttpUrl(sourceUrl)) {
    $("#edit-source-url").setAttribute("aria-invalid", "true");
    $("#edit-source-url").focus();
    toast("Add a valid source URL beginning with http or https, or leave it blank.");
    return;
  }
  const chapters = loadChapters();
  const index = chapters.findIndex(chapter => chapter.id === id);
  if (index < 0) return;
  const chapter = chapters[index];
  chapter.chapterTitle = title;
  chapter.readingType = $("#edit-reading-type")?.value || "book";
  chapter.sourceUrl = sourceUrl;
  chapter.recall = recall;
  chapter.evaluation = evaluateResponse(chapter.sourceText, recall, chapter.sourceKind);
  chapter.repair = $("#edit-chapter-challenge")?.value.trim() || "";
  const challengeTerms = new Set(words(chapter.repair));
  const challengeEvidenceTerms = words(chapter.evaluation?.gapEvidence?.sentence || "");
  chapter.repairResolved = wordCount(chapter.repair) >= 10 && challengeEvidenceTerms.some(term => challengeTerms.has(term));
  $$(".edit-review-response").forEach(input => {
    const reviewIndex = Number(input.dataset.reviewIndex);
    const field = input.dataset.responseField;
    const attempt = chapter.delayedAttempts?.[reviewIndex];
    if (!attempt) return;
    attempt[field] = input.value.trim();
    if (field === "gapResponse") {
      const gapSource = chapter.evaluation?.gapEvidence?.sentence || chapter.sourceText;
      attempt.gapBand = evaluateResponse(gapSource, attempt[field], "full").band;
      attempt.gapResult = reviewResult(attempt.gapBand);
    } else {
      attempt.band = evaluateResponse(chapter.sourceText, attempt[field], chapter.sourceKind).band;
      attempt.centralClaimResult = displayBand(attempt.band);
    }
  });
  chapter.updatedAt = new Date().toISOString();
  chapters[index] = chapter;
  saveChapters(chapters);
  renderDashboard();
  openChapter(id);
  toast("Chapter title and responses updated.");
}

function showSource(source, title = "Chapter source") {
  $("#dialog-title").textContent = title;
  $("#dialog-source").textContent = source;
  $("#source-dialog").showModal();
}

function rescheduleManagedReview(id, delay) {
  const chapters = loadChapters();
  const index = chapters.findIndex(chapter => chapter.id === id);
  if (index < 0) return;
  const due = new Date();
  due.setDate(due.getDate() + Number(delay));
  const existingSchedule = chapters[index].reviewSchedule || {};
  const manualReason = Number(delay) <= 1
    ? "you chose to bring this review back sooner"
    : "you chose to give this review more space";
  chapters[index].reviewDue = due.toISOString();
  chapters[index].status = "Review scheduled";
  chapters[index].reviewCanceled = false;
  chapters[index].reviewSchedule = {
    ...existingSchedule,
    policyVersion: SCHEDULING_POLICY_VERSION,
    days: Number(delay),
    reason: manualReason,
    reasonSnapshot: scheduleReasonSnapshot({ days: Number(delay), due, reason: manualReason, ratingLabel: existingSchedule.rating }, "manual", {
      evaluation: chapters[index].evaluation,
      confidence: chapters[index].confidence,
      inputs: scheduleInputsForChapter(chapters[index])
    }),
    manualRescheduled: true,
    manualDelay: Number(delay),
    scheduledAt: new Date().toISOString()
  };
  chapters[index].updatedAt = new Date().toISOString();
  saveChapters(chapters);
  renderDashboard();
  toast(`Review rescheduled for ${delay === "1" ? "tomorrow" : `in ${delay} days`}.`);
}

function cancelManagedReview(id) {
  const chapters = loadChapters();
  const index = chapters.findIndex(chapter => chapter.id === id);
  if (index < 0) return;
  chapters[index].reviewDue = null;
  chapters[index].status = "Immediate complete";
  chapters[index].reviewCanceled = true;
  chapters[index].updatedAt = new Date().toISOString();
  saveChapters(chapters);
  renderDashboard();
  toast("Review canceled. The chapter remains in your library.");
}

const practiceSequence = [
  { id: "central-claim", title: "Find the central claim", description: "Separate the topic from the author’s argument." },
  { id: "connect-ideas", title: "Connect two ideas", description: "Explain how one idea leads to or depends on another." },
  { id: "match-evidence", title: "Match claims with evidence", description: "Choose the reason or example that actually supports a claim." },
  { id: "build-explanation", title: "Build a complete explanation", description: "Move from claim to reason to concrete example." }
];

function loadPracticeRecords() {
  try { return JSON.parse(localStorage.getItem(PRACTICE_KEY)) || []; } catch { return []; }
}

const practiceQuestionBanks = {
  "central-claim": [
    {
      lessonTitle: "Topic is not the same as claim",
      lessonCopy: "A topic names what a passage is about. A central claim tells you what the author wants you to believe about that topic.",
      exampleOne: "<strong>Topic:</strong> Public transportation",
      exampleTwo: "<strong>Claim:</strong> Cities should prioritize reliable bus service before investing in more expensive transit projects.",
      question: "What is this passage arguing?",
      passage: "Many workplaces treat fast replies as evidence of commitment. Yet constant responsiveness fragments attention and pushes demanding work into evenings. Teams should establish shared response windows so employees can protect focused time without leaving colleagues uncertain.",
      placeholder: "State the author’s central claim in your own words.",
      signals: [["teams", "workplaces", "companies"], ["windows", "boundaries", "times", "expectations"], ["focus", "focused", "attention", "concentration"]],
      success: "You identified the recommendation to set shared response boundaries and connected it to the purpose of protecting focused work."
    },
    {
      lessonTitle: "Look for the author’s recommendation",
      lessonCopy: "A central claim often contains a judgment about what should change, matter, or happen next.",
      exampleOne: "<strong>Topic:</strong> School start times",
      exampleTwo: "<strong>Claim:</strong> Secondary schools should begin later because adolescent sleep patterns make early mornings harmful to learning.",
      question: "What change does this author argue for?",
      passage: "Neighborhood parks are often designed around large lawns that are expensive to maintain and offer little shelter in hot weather. Trees and native plants cool surrounding streets while supporting local wildlife. Cities should replace portions of ornamental lawn with shaded native gardens.",
      placeholder: "Name the recommendation and the reason behind it.",
      signals: [["cities", "parks"], ["replace", "native", "gardens", "trees"], ["cool", "shade", "wildlife", "maintain"]], 
      success: "You found the recommendation to replace ornamental lawn and connected it to the practical benefits of native planting."
    }
  ],
  "connect-ideas": [{
    lessonTitle: "Name the relationship",
    lessonCopy: "Remembering two ideas is not enough; explain whether one causes, supports, limits, or contrasts with the other.",
    exampleOne: "<strong>Ideas:</strong> Sleep and memory",
    exampleTwo: "<strong>Connection:</strong> Sleep supports memory because it helps stabilize newly learned information.",
    question: "How do the two main ideas connect?",
    passage: "Frequent task switching creates a residue of attention on the previous task. Because part of the mind remains occupied, the next task receives less complete concentration. Reducing unnecessary switching therefore improves the quality of demanding work.",
    placeholder: "Explain how task switching affects demanding work.",
    signals: [["switching", "tasks"], ["residue", "attention", "mind"], ["focus", "concentration", "quality", "work"]],
    success: "You explained the causal chain from task switching to attention residue to lower-quality focused work."
  }],
  "match-evidence": [{
    lessonTitle: "Evidence must do a job",
    lessonCopy: "Strong evidence directly supports the claim; it is not merely another fact about the same topic.",
    exampleOne: "<strong>Claim:</strong> Street trees reduce dangerous summer heat.",
    exampleTwo: "<strong>Evidence:</strong> Shaded blocks measured substantially cooler than nearby unshaded blocks.",
    question: "Which evidence best supports the author’s claim, and why?",
    passage: "The author argues that brief outdoor breaks improve sustained attention. In one workplace trial, employees who took a ten-minute walk outside made fewer errors during the final hour of a long task than employees who remained at their desks.",
    placeholder: "Identify the evidence and explain how it supports the claim.",
    signals: [["walk", "outside", "outdoor"], ["errors", "fewer"], ["attention", "task", "focus"]],
    success: "You selected the workplace trial and explained how fewer errors support the claim about sustained attention."
  }],
  "build-explanation": [{
    lessonTitle: "Build from claim to reason to example",
    lessonCopy: "A complete explanation states the idea, explains why it holds, and grounds it in something concrete.",
    exampleOne: "<strong>Claim:</strong> Shared quiet hours improve team output.",
    exampleTwo: "<strong>Reason + example:</strong> They reduce interruption; for example, teams can reserve mornings for focused production.",
    question: "Build a complete explanation from this passage.",
    passage: "People are more likely to maintain a new habit when the desired action is easy to begin. Preparing materials in advance removes a moment of friction. Someone who places a book on their pillow, for example, is more likely to read before bed.",
    placeholder: "State the claim, explain the reason, and include the example.",
    signals: [["habit", "action"], ["easy", "friction", "prepare"], ["book", "pillow", "read"]],
    success: "You included the claim, the friction-reducing mechanism, and the concrete reading example."
  }]
};

function localDateKey(value = new Date()) {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function successfulPracticeDays(skill) {
  return new Set(loadPracticeRecords()
    .filter(record => record.result === "Completed" && (record.skillId === skill.id || record.skill === skill.title))
    .map(record => record.practiceDate || localDateKey(record.createdAt))).size;
}

function hasPracticeCompletionToday() {
  return loadPracticeRecords().some(record =>
    record.result === "Completed"
    && (record.practiceDate || localDateKey(record.createdAt)) === localDateKey()
  );
}

function currentPracticeSkillState() {
  const daysBySkill = new Map(practiceSequence.map(skill => [skill.id, successfulPracticeDays(skill)]));
  const nextIndex = practiceSequence.findIndex(skill => (daysBySkill.get(skill.id) || 0) < 3);
  const activeIndex = nextIndex < 0 ? practiceSequence.length - 1 : nextIndex;
  const skill = practiceSequence[activeIndex] || practiceSequence[0];
  const successfulDays = Math.min(3, daysBySkill.get(skill.id) || 0);
  return {
    skill,
    successfulDays,
    completedToday: hasPracticeCompletionToday(),
    progressPercent: Math.min(100, Math.round(successfulDays / 3 * 100))
  };
}

function showDailyQuestionState() {
  $("#daily-practice-complete").hidden = true;
  $("#practice-lesson").hidden = false;
  $("#practice-activity").hidden = false;
}

function showDailyCompleteState() {
  $("#practice-lesson").hidden = true;
  $("#practice-activity").hidden = true;
  $("#daily-practice-complete").hidden = false;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  $("#next-practice-date").textContent = `Next question available ${tomorrow.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}.`;
}

function currentPracticeQuestion(skillId) {
  const bank = practiceQuestionBanks[skillId] || practiceQuestionBanks["central-claim"];
  const today = new Date();
  const dayNumber = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000);
  return bank[dayNumber % bank.length];
}

const practiceCoaching = {
  "central-claim": {
    parts: ["the topic", "the author’s recommendation", "the reason it matters"],
    move: "Next time, write one sentence with this shape: “The author argues that [who] should [do what] because [why].”",
    diagnostic: "A central claim needs more than the topic. It should include the author’s position and the reason behind it.",
    template: "The author argues that ___ should ___ because ___."
  },
  "connect-ideas": {
    parts: ["the first idea", "the linking mechanism", "the result for the second idea"],
    move: "Next time, name the relationship with a connector like because, therefore, leads to, limits, or depends on.",
    diagnostic: "A connection answer should show how one idea changes, causes, supports, or limits the other.",
    template: "___ leads to ___ because ___."
  },
  "match-evidence": {
    parts: ["the claim", "the specific evidence", "how the evidence proves the claim"],
    move: "Next time, do not stop at naming evidence. Add one phrase that explains the job it does for the claim.",
    diagnostic: "Evidence is useful only when you explain why it supports the claim rather than merely sharing the same topic.",
    template: "The best evidence is ___ because it shows ___."
  },
  "build-explanation": {
    parts: ["the claim", "the reason or mechanism", "a concrete example"],
    move: "Next time, use a three-part answer: claim first, reason second, example last.",
    diagnostic: "A complete explanation should move from the idea to why it works, then ground it in a concrete case.",
    template: "The claim is ___. This works because ___. For example, ___."
  }
};

function practiceFeedbackFor(skill, matchedGroups, matchedSignals) {
  const coaching = practiceCoaching[skill.id] || practiceCoaching["central-claim"];
  const missing = coaching.parts
    .map((part, index) => ({ part, index }))
    .filter(item => !matchedGroups.has(item.index))
    .map(item => item.part);
  const missingText = missing.length
    ? `Add ${missing.length === 1 ? missing[0] : `${missing.slice(0, -1).join(", ")} and ${missing.at(-1)}`}.`
    : "Make the relationship between the parts more explicit.";
  return {
    title: matchedSignals >= 2 ? "One specific piece is missing." : "Rebuild the answer around the skill.",
    body: matchedSignals >= 2
      ? `${missingText} ${coaching.move}`
      : `${coaching.diagnostic} ${coaching.move}`,
    template: coaching.template
  };
}

function renderDailyPractice(skillId, reviewing = false) {
  const skill = practiceSequence.find(item => item.id === skillId) || practiceSequence[0];
  const question = currentPracticeQuestion(skill.id);
  showDailyQuestionState();
  state.activePracticeSkill = skill.id;
  $("#practice-focus-label").textContent = reviewing ? "Review a completed skill" : "Today’s skill";
  $("#practice-focus-title").textContent = skill.title;
  $("#practice-reason").textContent = reviewing
    ? "Practice this skill again without changing your saved proficiency."
    : `${skill.description} Show it successfully on three separate days to unlock the next skill.`;
  const successfulDays = successfulPracticeDays(skill);
  $("#skill-proficiency-label").textContent = `${Math.min(3, successfulDays)} of 3 successful days`;
  $("#skill-proficiency-fill").style.width = `${Math.min(100, successfulDays / 3 * 100)}%`;
  $(".skill-proficiency [role='progressbar']")?.setAttribute("aria-valuenow", String(Math.min(3, successfulDays)));
  $("#daily-lesson-title").textContent = question.lessonTitle;
  $("#daily-lesson-copy").textContent = question.lessonCopy;
  $("#daily-example-one").innerHTML = question.exampleOne;
  $("#daily-example-two").innerHTML = question.exampleTwo;
  $("#daily-question-title").textContent = question.question;
  $("#daily-practice-passage").textContent = question.passage;
  $("#practice-answer").placeholder = question.placeholder;
  resetPractice(false);
  const completedToday = loadPracticeRecords().some(record =>
    record.result === "Completed"
    && (record.skillId === skill.id || record.skill === skill.title)
    && (record.practiceDate || localDateKey(record.createdAt)) === localDateKey()
  );
  if (completedToday || hasPracticeCompletionToday()) showDailyCompleteState();
}

function renderPracticeProgress(preserveActivity = false) {
  const daysBySkill = new Map(practiceSequence.map(skill => [skill.id, successfulPracticeDays(skill)]));
  const masteredIds = new Set(practiceSequence.filter(skill => daysBySkill.get(skill.id) >= 3).map(skill => skill.id));
  const nextIndex = practiceSequence.findIndex(skill => !masteredIds.has(skill.id));
  const activeIndex = nextIndex < 0 ? practiceSequence.length - 1 : nextIndex;
  const activeSkill = practiceSequence[activeIndex];
  $("#practice-path-list").innerHTML = practiceSequence.map((skill, index) => {
    const days = daysBySkill.get(skill.id);
    const done = masteredIds.has(skill.id);
    const focus = index === activeIndex && !done;
    const locked = index > activeIndex;
    return `<article class="practice-path-item${done ? " is-done" : focus ? " is-focus" : locked ? " is-locked" : ""}">
      <span class="practice-path-number">${done ? "✓" : index + 1}</span>
      <div class="practice-path-copy"><strong>${escapeHtml(skill.title)}</strong><small>${escapeHtml(skill.description)}</small></div>
      <span class="practice-state">${done ? "Proficient" : focus ? `${days}/3 days` : "Locked"}</span>
    </article>`;
  }).join("");

  const masteredSkills = practiceSequence.filter(skill => masteredIds.has(skill.id));
  $("#completed-practice").hidden = !masteredSkills.length;
  $("#completed-practice-list").innerHTML = masteredSkills.map(skill => `<article class="completed-practice-card">
    <div><strong>${escapeHtml(skill.title)}</strong><small>Proficient across 3 days · available anytime</small></div>
    <button class="text-button" type="button" data-action="revisit-practice" data-practice-skill="${skill.id}">Revisit →</button>
  </article>`).join("");
  if (preserveActivity) {
    const shownSkill = practiceSequence.find(skill => skill.id === state.activePracticeSkill) || activeSkill;
    const shownDays = successfulPracticeDays(shownSkill);
    $("#skill-proficiency-label").textContent = `${Math.min(3, shownDays)} of 3 successful days`;
    $("#skill-proficiency-fill").style.width = `${Math.min(100, shownDays / 3 * 100)}%`;
    $(".skill-proficiency [role='progressbar']")?.setAttribute("aria-valuenow", String(Math.min(3, shownDays)));
  } else {
    renderDailyPractice(activeSkill.id);
  }
}

function checkPracticeAnswer() {
  const answer = $("#practice-answer").value.trim();
  if (wordCount(answer) < 5) {
    toast("Give the question a complete response before checking it.");
    return;
  }
  const skill = practiceSequence.find(item => item.id === state.activePracticeSkill) || practiceSequence[0];
  const question = currentPracticeQuestion(skill.id);
  const answerWords = new Set(words(answer));
  const matchedGroups = new Set();
  question.signals.forEach((group, index) => {
    if (group.some(term => answerWords.has(term))) matchedGroups.add(index);
  });
  const matchedSignals = matchedGroups.size;
  const feedback = $("#practice-feedback");
  const checkButton = $("#practice-check");
  feedback.hidden = false;
  feedback.className = "practice-feedback";
  const coaching = practiceCoaching[skill.id] || practiceCoaching["central-claim"];
  if (matchedSignals === 3) {
    feedback.classList.add("is-correct");
    feedback.innerHTML = `
      <span class="practice-feedback-icon" aria-hidden="true">✓</span>
      <div>
        <strong>You got it</strong>
        <h3>Today’s skill held up.</h3>
        <p>${escapeHtml(question.success)} This successful day now counts toward proficiency.</p>
        <div class="practice-next-move"><span>Use this next time</span><code>${escapeHtml(coaching.template)}</code></div>
      </div>`;
    checkButton.disabled = true;
    checkButton.innerHTML = "Practice complete <span>✓</span>";
    const records = loadPracticeRecords();
    const alreadyCompletedToday = records.some(record =>
      record.result === "Completed"
      && (record.skillId === skill.id || record.skill === skill.title)
      && (record.practiceDate || localDateKey(record.createdAt)) === localDateKey()
    );
    if (!alreadyCompletedToday) records.push({ skillId: skill.id, skill: skill.title, result: "Completed", practiceDate: localDateKey(), createdAt: new Date().toISOString() });
    localStorage.setItem(PRACTICE_KEY, JSON.stringify(records));
    renderPracticeProgress(true);
    showDailyCompleteState();
    toast("Daily practice complete. One successful day added.");
  } else if (matchedSignals >= 2) {
    const coaching = practiceFeedbackFor(skill, matchedGroups, matchedSignals);
    feedback.classList.add("is-close");
    feedback.innerHTML = `
      <span class="practice-feedback-icon" aria-hidden="true">↗</span>
      <div>
        <strong>Almost there</strong>
        <h3>${escapeHtml(coaching.title)}</h3>
        <p>${escapeHtml(coaching.body)}</p>
        <div class="practice-next-move"><span>Try this frame</span><code>${escapeHtml(coaching.template)}</code></div>
      </div>`;
  } else {
    const coaching = practiceFeedbackFor(skill, matchedGroups, matchedSignals);
    feedback.classList.add("needs-retry");
    feedback.innerHTML = `
      <span class="practice-feedback-icon" aria-hidden="true">→</span>
      <div>
        <strong>Try once more</strong>
        <h3>${escapeHtml(coaching.title)}</h3>
        <p>${escapeHtml(coaching.body)}</p>
        <div class="practice-next-move"><span>Use this sentence frame</span><code>${escapeHtml(coaching.template)}</code></div>
      </div>`;
  }
}

function resetPractice(focus = true) {
  $("#practice-answer").value = "";
  $("#practice-feedback").hidden = true;
  $("#practice-feedback").className = "practice-feedback";
  $("#practice-feedback").innerHTML = "";
  $("#practice-check").disabled = false;
  $("#practice-check").innerHTML = "Check my answer <span>→</span>";
  if (focus) $("#practice-answer").focus();
}

function revisitPractice(skillId) {
  if (hasPracticeCompletionToday()) {
    showDailyCompleteState();
    toast("Today’s question is complete. A new one will be ready tomorrow.");
    return;
  }
  renderDailyPractice(skillId || "central-claim", true);
  $("#practice-answer").scrollIntoView({ behavior: "smooth", block: "center" });
  toast("Skill reopened. Your proficiency remains saved.");
}

document.addEventListener("click", async event => {
  const nav = event.target.closest("[data-nav]");
  if (nav) {
    event.preventDefault();
    setView(nav.dataset.nav);
  }

  const bookInsights = event.target.closest("[data-book-insights]");
  if (bookInsights) renderBookInsights(bookInsights.dataset.bookInsights);

  const review = event.target.closest("[data-review-id]");
  if (review) openReview(review.dataset.reviewId);

  const chapter = event.target.closest("[data-chapter-id]");
  if (chapter && !chapter.dataset.reviewId) openChapter(chapter.dataset.chapterId);

  const chapterTab = event.target.closest("[data-chapter-tab]");
  if (chapterTab) {
    const tab = chapterTab.dataset.chapterTab;
    $$("[data-chapter-tab]").forEach(button => {
      const active = button.dataset.chapterTab === tab;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });
    $$("[data-chapter-tab-panel]").forEach(panel => {
      const active = panel.dataset.chapterTabPanel === tab;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
  }

  const action = event.target.closest("[data-action]")?.dataset.action;
  if (!action) return;
  if (action === "next-intake") {
    if (!validateIntakeStep()) return;
    setIntakeStep(state.intakeStep + 1);
    saveDraft();
  }
  if (action === "previous-intake") {
    setIntakeStep(state.intakeStep - 1);
    saveDraft();
  }
  if (action === "begin-recall" && validateSource()) {
    setStep(1);
    setTimeout(() => $("#recall").focus(), 100);
  }
  if (action === "back-source") {
    setStep(0);
    setIntakeStep(2, { focus: false });
  }
  if (action === "start-landing-check") startNew();
  if (action === "remove-pdf") removePdf();
  if (action === "reveal-source") {
    showSource(getValues().sourceText, getValues().chapterTitle);
    toast("Source revealed. Your attempt is still saved.");
  }
  if (action === "to-confidence") {
    $("#recall").removeAttribute("aria-invalid");
    if (!$("#recall").value.trim()) {
      $("#recall").setAttribute("aria-invalid", "true");
      $("#recall").focus();
      toast("Write what you remember. Even “I don’t remember” is useful.");
    } else setStep(2);
  }
  if (action === "back-recall") setStep(1);
  if (action === "back-confidence") setStep(2);
  if (action === "evaluate") {
    const values = getValues();
    if (!values.confidence) { toast("Choose the confidence level that feels closest."); return; }
    setStep(3);
    const localEvaluation = evaluateResponse(values.sourceText, values.recall, values.sourceKind);
    state.evaluation = localEvaluation;
    saveDraft();
    runAnalysisTransition(localEvaluation, async () => {
      try {
        const result = await withTimeout(
          gradeRecallWithSupabase(values, localEvaluation),
          12000,
          "Feedback took longer than expected."
        );
        state.evaluation = result.evaluation;
        saveDraft();
        if (result.mode !== "supabase") {
          console.info("[Ember admin] Local feedback was used.", {
            reason: result.reason || "Supabase grading was unavailable.",
            chapterId: state.currentId
          });
        }
      } catch (error) {
        console.warn("[Ember admin] Supabase grading failed. Local feedback was shown.", {
          error,
          chapterId: state.currentId
        });
        state.evaluation = localEvaluation;
      }
      renderEvaluation(false);
    });
  }
  if (action === "inspect-source") showSource(getValues().sourceText, getValues().chapterTitle);
  if (action === "to-repair") setStep(4);
  if (action === "skip-repair") buildCompletion(true);
  if (action === "submit-repair") {
    if (wordCount($("#repair").value) < 5) { toast("Give the challenge a little more detail, or skip it for now."); return; }
    buildCompletion(false);
  }
  if (action === "save-chapter") saveCurrent(true);
  if (action === "new-after-save") { saveCurrent(false); startNew(); }
  if (action === "disagree") toast("Disagreement recorded. Your interpretation remains part of the chapter history.");
  if (action === "unsupported") toast("Evidence report recorded. This feedback is flagged for review.");
  if (action === "close-dialog") $("#source-dialog").close();
  if (action === "close-auth") $("#auth-dialog").close();
  if (action === "open-gap-info") $("#gap-info-dialog").showModal();
  if (action === "close-gap-info") $("#gap-info-dialog").close();
  if (action === "open-initial-check-info") $("#initial-check-info-dialog").showModal();
  if (action === "close-initial-check-info") $("#initial-check-info-dialog").close();
  if (action === "open-confidence-info") $("#confidence-info-dialog").showModal();
  if (action === "close-confidence-info") $("#confidence-info-dialog").close();
  if (action === "check-practice") checkPracticeAnswer();
  if (action === "reset-practice") resetPractice();
  if (action === "revisit-practice") revisitPractice(event.target.closest("[data-practice-skill]")?.dataset.practiceSkill);
  if (action === "complete-review") completeReview();
  if (action === "start-review-session") {
    const ids = (event.target.closest("[data-review-session-ids]")?.dataset.reviewSessionIds || "").split(",").filter(Boolean);
    startReviewSession(ids);
  }
  if (action === "reschedule-review") { toast("No problem. This review remains in your queue."); setView("reviews"); }
  if (action === "view-chapter-source") {
    const saved = loadChapters().find(item => item.id === event.target.closest("[data-chapter-id]").dataset.chapterId);
    if (saved) showSource(saved.sourceText, saved.chapterTitle);
  }
  if (action === "edit-chapter") editChapter(event.target.closest("[data-edit-chapter-id]").dataset.editChapterId);
  if (action === "cancel-chapter-edit") openChapter(event.target.closest("[data-edit-chapter-id]").dataset.editChapterId);
  if (action === "save-chapter-edit") saveChapterEdit(event.target.closest("[data-edit-chapter-id]").dataset.editChapterId);
  if (action === "reschedule-managed-review") {
    const button = event.target.closest("[data-manage-review-id]");
    rescheduleManagedReview(button.dataset.manageReviewId, button.dataset.delay);
  }
  if (action === "adjust-review") {
    const button = event.target.closest("[data-manage-review-id]");
    rescheduleManagedReview(button.dataset.manageReviewId, button.dataset.delay);
    openChapter(button.dataset.manageReviewId);
  }
  if (action === "cancel-review") {
    const button = event.target.closest("[data-manage-review-id]");
    cancelManagedReview(button.dataset.manageReviewId);
  }
});

document.addEventListener("toggle", event => {
  const book = event.target.closest?.(".book-group[data-book-key]");
  if (!book) return;
  let collapsed = [];
  try { collapsed = JSON.parse(localStorage.getItem(COLLAPSED_BOOKS_KEY)) || []; } catch { collapsed = []; }
  const collapsedKeys = new Set(collapsed);
  if (book.open) collapsedKeys.delete(book.dataset.bookKey);
  else collapsedKeys.add(book.dataset.bookKey);
  localStorage.setItem(COLLAPSED_BOOKS_KEY, JSON.stringify([...collapsedKeys]));
}, true);

document.addEventListener("dragstart", event => {
  const summary = event.target.closest?.("[data-book-drag-key]");
  if (!summary) return;
  state.draggedBookKey = summary.dataset.bookDragKey;
  summary.closest(".book-group")?.classList.add("is-dragging");
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", state.draggedBookKey);
  }
});

document.addEventListener("dragover", event => {
  const target = event.target.closest?.(".book-group[data-book-key]");
  if (!target || !state.draggedBookKey || target.dataset.bookKey === state.draggedBookKey) return;
  event.preventDefault();
  $$(".book-group").forEach(book => book.classList.remove("drop-before", "drop-after"));
  const placeAfter = event.clientY > target.getBoundingClientRect().top + target.getBoundingClientRect().height / 2;
  target.classList.add(placeAfter ? "drop-after" : "drop-before");
});

document.addEventListener("drop", event => {
  const target = event.target.closest?.(".book-group[data-book-key]");
  const source = $$(".book-group[data-book-key]").find(book => book.dataset.bookKey === state.draggedBookKey);
  if (!target || !source || source === target) return;
  event.preventDefault();
  if (target.classList.contains("drop-after")) target.after(source);
  else target.before(source);
  const order = $$(".book-group[data-book-key]").map(book => book.dataset.bookKey);
  localStorage.setItem(BOOK_ORDER_KEY, JSON.stringify(order));
  $$(".book-group").forEach(book => book.classList.remove("is-dragging", "drop-before", "drop-after"));
  state.draggedBookKey = null;
});

document.addEventListener("dragend", () => {
  $$(".book-group").forEach(book => book.classList.remove("is-dragging", "drop-before", "drop-after"));
  state.draggedBookKey = null;
});

$("#hero-start").addEventListener("click", () => startNew());
$("#dashboard-start")?.addEventListener("click", () => startNew());
$("#open-book-insights").addEventListener("click", event => renderBookInsights(event.currentTarget.dataset.bookKey));
$("#open-latest").addEventListener("click", event => openChapter(event.currentTarget.dataset.chapterId));
$("#check-next").addEventListener("click", event => startNew({
  ...(event.currentTarget.dataset.mode === "new-book"
    ? {}
    : {
      bookPath: "existing",
      bookTitle: event.currentTarget.dataset.bookTitle,
      authorName: event.currentTarget.dataset.authorName
    })
}));
$("#focus-edit-button")?.addEventListener("click", () => {
  const panel = $("#focus-book-panel");
  const button = $("#focus-edit-button");
  const nextHidden = !panel.hidden;
  panel.hidden = nextHidden;
  button.setAttribute("aria-expanded", String(!nextHidden));
  if (!nextHidden) $("#focus-book-select")?.focus();
});
$("#focus-book-select")?.addEventListener("change", event => {
  const key = event.currentTarget.value;
  if (key) localStorage.setItem(FOCUS_BOOK_KEY, key);
  else localStorage.removeItem(FOCUS_BOOK_KEY);
  $("#focus-book-panel").hidden = true;
  $("#focus-edit-button").setAttribute("aria-expanded", "false");
  renderDashboard();
});
$("#new-check").addEventListener("click", () => startNew());
$("#mobile-new-check")?.addEventListener("click", () => startNew());
$("#profile-button").addEventListener("click", event => {
  event.stopPropagation();
  const menu = $("#profile-menu");
  menu.hidden = !menu.hidden;
  $("#profile-button").setAttribute("aria-expanded", String(!menu.hidden));
});
$("#profile-menu").addEventListener("click", event => {
  event.stopPropagation();
  const nav = event.target.closest("[data-nav]");
  if (nav) {
    closeProfileMenu();
    setView(nav.dataset.nav);
  }
});
$("#logout-button").addEventListener("click", () => logOut());
$("#login-button").addEventListener("click", () => openAuthDialog("login"));
$("#signed-out-login")?.addEventListener("click", () => openAuthDialog("login"));
$("#signup-button").addEventListener("click", () => openAuthDialog("signup"));
$("#email-auth-form")?.addEventListener("submit", handleMagicLinkSignIn);
$("#password-auth-form")?.addEventListener("submit", handlePasswordSignIn);
$("#show-password-auth")?.addEventListener("click", () => {
  $("#magic-auth-options").hidden = true;
  $("#email-auth-form").hidden = true;
  $("#password-auth-form").hidden = false;
  $("#password-auth-email").focus();
});
$("#show-magic-auth")?.addEventListener("click", () => {
  $("#magic-auth-options").hidden = false;
  $("#email-auth-form").hidden = false;
  $("#password-auth-form").hidden = true;
  $("#auth-email").focus();
});
$("#forgot-password")?.addEventListener("click", async () => {
  const client = getSupabaseClient();
  const email = $("#password-auth-email").value.trim() || $("#auth-email").value.trim();
  if (!client) { setAuthStatus("Supabase is not connected yet. Check supabase-config.js."); return; }
  if (!email) { toast("Enter your email first."); return; }
  const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: authRedirectUrl() });
  toast(error ? error.message : "Password reset email sent.");
});
$("#google-auth-button")?.addEventListener("click", async () => {
  const client = getSupabaseClient();
  if (!client) { setAuthStatus("Supabase is not connected yet. Check supabase-config.js."); return; }
  const { error } = await client.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: authRedirectUrl() }
  });
  if (error) toast(error.message);
});
$("#account-name-form")?.addEventListener("submit", handleAccountNameSubmit);
$("#account-reading-context-form")?.addEventListener("submit", handleReadingContextSubmit);
$("#color-theme-options")?.addEventListener("change", handleColorThemeChange);
$("#color-mode-options")?.addEventListener("change", handleColorModeChange);
$("#account-email-form")?.addEventListener("submit", handleAccountEmailSubmit);
$("#account-password-form")?.addEventListener("submit", handleAccountPasswordSubmit);
$("#account-recovery-form")?.addEventListener("submit", handleRecoveryEmailSubmit);
$("#export-library-data")?.addEventListener("click", exportLibraryData);
$("#import-library-data")?.addEventListener("change", async event => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const payload = JSON.parse(await file.text());
    const result = importLibraryData(payload);
    setAccountStatus(
      "#account-transfer-status",
      `Imported ${result.chapters} new chapters, ${result.books} new books, and ${result.practice} practice records.`,
      "success"
    );
  } catch (error) {
    setAccountStatus("#account-transfer-status", error.message || "Unable to import that file.", "error");
  } finally {
    event.target.value = "";
  }
});
$("#logout-all-devices")?.addEventListener("click", async () => {
  const client = getSupabaseClient();
  if (client) await client.auth.signOut({ scope: "global" });
  state.supabaseSession = null;
  setLoggedIn(false);
});
$("#refresh-generated-feedback")?.addEventListener("click", async () => {
  const button = $("#refresh-generated-feedback");
  if (button) button.disabled = true;
  setAccountStatus("#account-feedback-refresh-status", "Refreshing saved feedback notes.", "");
  try {
    const data = await regenerateNextTimeCoaching(50);
    const count = Number(data?.updated_count || 0);
    const localCount = syncGeneratedCoachingToLocalChapters(data);
    setAccountStatus(
      "#account-feedback-refresh-status",
      count
        ? `${count} saved feedback ${count === 1 ? "note was" : "notes were"} refreshed. ${localCount} local ${localCount === 1 ? "chapter was" : "chapters were"} updated.`
        : "No saved feedback needed a refresh.",
      "success"
    );
  } catch (error) {
    setAccountStatus("#account-feedback-refresh-status", error.message || "Unable to refresh generated feedback.", "error");
  } finally {
    if (button) button.disabled = false;
  }
});
$("#save-entry-draft")?.addEventListener("click", saveEntryDraft);
document.addEventListener("click", () => {
  closeProfileMenu();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeProfileMenu({ returnFocus: true });
  }
});
$("#flow-exit").addEventListener("click", () => {
  saveDraft();
  setView("home");
  toast("Draft saved.");
});
$("#load-sample")?.addEventListener("click", () => {
  setValues(sample);
  toast("Sample loaded. Begin when you are ready.");
});
$("#check-form").addEventListener("input", event => {
  event.target?.removeAttribute?.("aria-invalid");
  updateCounts();
  saveDraft();
});
$("#check-form").addEventListener("change", event => {
  event.target?.removeAttribute?.("aria-invalid");
  saveDraft();
});
$("#reading-type")?.addEventListener("change", () => {
  syncReadingType();
  saveDraft();
});
$$('[name="bookPath"]').forEach(input => input.addEventListener("change", () => {
  if (input.value === "new" && input.checked) {
    $("#book-title").value = "";
    $("#author-name").value = "";
    $("#book-total-chapters").value = "";
  }
  syncBookPath();
  saveDraft();
}));
$$('[name="sourceKind"]').forEach(input => input.addEventListener("change", () => {
  syncSourceKind();
  saveDraft();
}));
$("#pdf-file").addEventListener("change", event => handlePdfUpload(event.target.files?.[0]));
$("#existing-book").addEventListener("change", () => {
  syncBookPath();
  saveDraft();
});
$("#check-form").addEventListener("submit", event => event.preventDefault());
$("#toggle-sidebar").addEventListener("click", () => {
  if (!isLoggedIn()) return;
  setSidebarCollapsed(!document.body.classList.contains("sidebar-collapsed"));
});
$("#mobile-menu").addEventListener("click", () => document.body.classList.toggle("mobile-nav-open"));
$("#source-dialog").addEventListener("click", event => {
  if (event.target === $("#source-dialog")) $("#source-dialog").close();
});
$("#gap-info-dialog").addEventListener("click", event => {
  if (event.target === $("#gap-info-dialog")) $("#gap-info-dialog").close();
});
$("#initial-check-info-dialog").addEventListener("click", event => {
  if (event.target === $("#initial-check-info-dialog")) $("#initial-check-info-dialog").close();
});
$("#confidence-info-dialog").addEventListener("click", event => {
  if (event.target === $("#confidence-info-dialog")) $("#confidence-info-dialog").close();
});

window.matchMedia?.("(prefers-color-scheme: dark)")?.addEventListener?.("change", handleSystemColorSchemeChange);

async function bootApp() {
  const startupRoute = initialRouteState();
  const startupPath = startupRoute.path;
  const startupView = viewForPath(startupPath);
  if (startupRoute.replace) {
    window.history.replaceState({ view: startupView }, "", routeForView(startupView));
  }
  renderAuthState();
  const bootSupabaseClient = getSupabaseClient();
  if (bootSupabaseClient) {
    bootSupabaseClient.auth.onAuthStateChange((_event, session) => {
      state.supabaseSession = session || null;
      if (session) localStorage.setItem(AUTH_KEY, "true");
      renderAuthState();
      if (session) restoreSavedDraft();
    });
    await refreshSupabaseSession(true);
  }
  restoreSavedDraft();
  if (MARKETING_ROUTES[startupView] || startupView === "home") {
    setView(startupView, { updateUrl: false });
  }
}

window.addEventListener("popstate", () => {
  setView(viewForPath(), { updateUrl: false });
});

bootApp();
