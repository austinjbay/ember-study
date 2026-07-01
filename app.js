const STORAGE_KEY = "margin-chapters-v2";
const DRAFT_KEY = "margin-draft-v2";
const AUTH_KEY = "margin-auth-v1";
const BOOKS_KEY = "margin-books-v1";
const COLLAPSED_BOOKS_KEY = "margin-collapsed-books-v1";
const BOOK_ORDER_KEY = "margin-book-order-v1";
const PRACTICE_KEY = "margin-practice-v1";

const state = {
  view: "home",
  step: 0,
  currentId: null,
  evaluation: null,
  repairResolved: false,
  reviewId: null,
  reviewStep: 0,
  reviewDraft: null,
  currentBookKey: null,
  draggedBookKey: null,
  activePracticeSkill: "central-claim",
  availableBooks: []
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

function isLoggedIn() {
  return localStorage.getItem(AUTH_KEY) !== "false";
}

function renderAuthState() {
  const loggedIn = isLoggedIn();
  document.body.classList.toggle("logged-out", !loggedIn);
  if (loggedIn) {
    $("#onboarding-title").innerHTML = `<span data-local-greeting>${localGreeting()}</span><br><em>What stayed with you?</em>`;
    $("#onboarding-copy").textContent = "Turn the chapter you just finished into something you can explain, question, and use.";
    $("#hero-start-label").textContent = "Start a chapter check";
    $("#hero-reassurance").textContent = "No perfect summary required. Start with what you remember.";
  } else {
    $("#onboarding-title").innerHTML = "Remember what you read.<br><em>Use it when it matters.</em>";
    $("#onboarding-copy").textContent = "You already highlight, annotate, and save the good parts. Margin helps you find out what actually stuck, strengthen what didn’t, and turn nonfiction into knowledge you can explain and apply.";
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
    toast("You’re logged out. Your prototype reading data is still here.");
  } else {
    setView("home");
    toast("Welcome back. Your reading dashboard is restored.");
  }
  renderAuthState();
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function displayBand(band = "") {
  return band === "Needs repair" ? "Needs another pass" : band;
}

function displayGapType(gap = "") {
  return gap === "Optional challenge" ? "Study challenge" : gap;
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

function getValues() {
  return {
    bookPath: $('[name="bookPath"]:checked')?.value || "",
    bookTitle: $("#book-title").value.trim(),
    authorName: $("#author-name").value.trim(),
    bookTotalChapters: $("#book-total-chapters").value,
    chapterTitle: $("#chapter-title").value.trim(),
    sourceKind: $('[name="sourceKind"]:checked')?.value || "full",
    sourceText: $("#source-text").value.trim(),
    pdfName: $("#pdf-source").dataset.fileName || "",
    pdfSize: Number($("#pdf-source").dataset.fileSize) || 0,
    recall: $("#recall").value.trim(),
    confidence: $('[name="confidence"]:checked')?.value || "",
    repair: $("#repair").value.trim(),
    wantsApplication: $("#wants-application").checked
  };
}

function setValues(values = {}) {
  $("#book-title").value = values.bookTitle || "";
  $("#author-name").value = values.authorName || "";
  $("#book-total-chapters").value = values.bookTotalChapters || "";
  $("#chapter-title").value = values.chapterTitle || "";
  $("#source-text").value = values.sourceText || "";
  setPdfStatus(values.pdfName || "", values.pdfSize || 0, Boolean(values.pdfName));
  $("#recall").value = values.recall || "";
  $("#repair").value = values.repair || "";
  $("#wants-application").checked = Boolean(values.wantsApplication);
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
  $("#existing-book").innerHTML = '<option value="">Select from your library…</option>' +
    state.availableBooks.map((book, index) => `<option value="${index}">${escapeHtml(book.title)}${book.author ? ` — ${escapeHtml(book.author)}` : ""} · ${book.completedChapters}${book.totalChapters ? ` of ${book.totalChapters}` : ""} completed</option>`).join("");
  const existingRadio = $('[name="bookPath"][value="existing"]');
  existingRadio.disabled = state.availableBooks.length === 0;

  const preferredIndex = state.availableBooks.findIndex(book => book.title === preferredTitle && book.author === (preferredAuthor || ""));
  if (preferredIndex >= 0) {
    $("#existing-book").value = String(preferredIndex);
    existingRadio.checked = true;
  } else if (state.availableBooks.length) {
    existingRadio.checked = true;
    $("#existing-book").value = "0";
  } else {
    $('[name="bookPath"][value="new"]').checked = true;
  }
  syncBookPath();
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

function saveDraft() {
  if (state.step >= 5) return;
  localStorage.setItem(DRAFT_KEY, JSON.stringify(getValues()));
}

function saveEntryDraft() {
  const values = getValues();
  if (!values.bookTitle || !values.chapterTitle) {
    toast("Choose a book and add a chapter title before saving this draft.");
    (!values.bookTitle ? $("#book-title") : $("#chapter-title")).focus();
    return;
  }
  const chapters = loadChapters();
  const now = new Date().toISOString();
  const id = state.currentId || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const existingIndex = chapters.findIndex(chapter => chapter.id === id);
  const draft = {
    ...(existingIndex >= 0 ? chapters[existingIndex] : {}),
    id,
    ...values,
    status: "Draft",
    evaluation: null,
    repairResolved: false,
    reviewDue: null,
    delayedAttempts: [],
    draftStep: state.step,
    updatedAt: now,
    createdAt: existingIndex >= 0 ? chapters[existingIndex].createdAt : now
  };
  if (existingIndex >= 0) chapters[existingIndex] = draft; else chapters.push(draft);
  saveChapters(chapters);
  saveBookMetadata(values);
  state.currentId = id;
  localStorage.removeItem(DRAFT_KEY);
  renderDashboard();
  setView("home");
  toast("Draft saved. Resume it whenever you’re ready.");
}

function ensureMockDraft() {
  const chapters = loadChapters();
  const deepWork = chapters.find(chapter => chapter.bookTitle === "Deep Work");
  const alreadyExists = chapters.some(chapter => chapter.bookTitle === "Deep Work" && chapter.chapterTitle === "Deep Work Is Rare");
  if (!deepWork || alreadyExists) return;
  const now = new Date(Date.now() + 1000).toISOString();
  chapters.push({
    id: `mock-draft-${Date.now()}`,
    bookPath: "existing",
    bookTitle: "Deep Work",
    authorName: deepWork.authorName || "Cal Newport",
    bookTotalChapters: deepWork.bookTotalChapters || "15",
    chapterTitle: "Deep Work Is Rare",
    sourceKind: "notes",
    sourceText: "Deep work is becoming increasingly valuable, yet the ability to perform it is becoming increasingly rare. Modern workplaces reward visible busyness and constant responsiveness, even when those behaviors fragment attention.",
    recall: "Deep work is valuable partly because fewer people are able to concentrate without interruption.",
    confidence: "",
    repair: "",
    wantsApplication: false,
    status: "Draft",
    evaluation: null,
    repairResolved: false,
    reviewDue: null,
    delayedAttempts: [],
    draftStep: 1,
    createdAt: now,
    updatedAt: now
  });
  saveChapters(chapters);
}

function toast(message) {
  const element = $("#toast");
  element.textContent = message;
  element.classList.add("is-visible");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => element.classList.remove("is-visible"), 2800);
}

function setView(name) {
  state.view = name;
  $$(".view").forEach(view => view.classList.toggle("is-active", view.dataset.view === name));
  $$(".nav-item").forEach(item => item.classList.toggle("is-active", item.dataset.nav === name));
  document.body.classList.remove("mobile-nav-open");
  window.scrollTo({ top: 0, behavior: "smooth" });
  $("#app").focus({ preventScroll: true });
  if (name === "home" || name === "reviews") renderDashboard();
}

function setStep(step) {
  state.step = Math.max(0, Math.min(5, step));
  $$(".flow-step").forEach(panel => panel.classList.toggle("is-active", Number(panel.dataset.step) === state.step));
  $$("#progress li").forEach((item, index) => {
    const mapped = state.step === 2 ? 1 : state.step > 2 ? state.step - 1 : state.step;
    item.classList.toggle("is-active", index === mapped);
    item.classList.toggle("is-complete", index < mapped);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function startNew(prefill = null) {
  state.currentId = null;
  state.evaluation = null;
  state.repairResolved = false;
  $("#check-form").reset();
  renderBookOptions(prefill?.bookTitle, prefill?.authorName);
  setValues({ ...(prefill || {}), bookPath: prefill?.bookPath || (state.availableBooks.length ? "existing" : "new") });
  if (prefill?.bookTitle && state.availableBooks.some(book => book.title === prefill.bookTitle && book.author === (prefill.authorName || ""))) {
    renderBookOptions(prefill.bookTitle, prefill.authorName);
  }
  localStorage.removeItem(DRAFT_KEY);
  setStep(0);
  setView("flow");
  setTimeout(() => $("#book-title").focus(), 100);
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
    ? "Extracted PDF text will appear here. Review it or paste the relevant chapter text…"
    : "Paste the chapter, excerpt, or detailed notes here…";
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
  if (values.sourceKind === "pdf" && !values.pdfName) {
    toast("Attach a PDF before beginning recall.");
    $("#pdf-file").focus();
    return false;
  }
  if (!values.bookTitle || !values.chapterTitle || !values.sourceText) {
    toast("Add a book title, chapter, and source material first.");
    (!values.bookTitle ? $("#book-title") : !values.chapterTitle ? $("#chapter-title") : $("#source-text")).focus();
    return false;
  }
  if (wordCount(values.sourceText) < 25) {
    toast("Add a little more source material so the feedback has a reliable anchor.");
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
    prompt = "What assumption or boundary would make the chapter's argument less convincing?";
    const sourceSentences = sentences(source);
    gapEvidence = {
      sentence: sourceSentences.at(-1) || strengthEvidence.sentence,
      index: Math.max(0, sourceSentences.length - 1),
      score: 1
    };
  }

  if (!["full", "pdf"].includes(sourceKind) && band === "Strong") band = "Developing";
  return {
    band,
    coverage,
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
}

function renderEvaluation() {
  const evaluation = state.evaluation;
  const bandDescriptions = {
    "Strong": "Accurate and sufficiently complete for this prompt.",
    "Developing": "Broadly accurate, with one useful idea to strengthen.",
    "Needs another pass": "The central thread needs another pass.",
    "Not enough evidence": "A responsible judgment needs more material."
  };
  const icon = evaluation.band === "Strong" ? "✓" : evaluation.band === "Developing" ? "↗" : evaluation.band === "Needs another pass" ? "!" : "?";
  $("#feedback-title").textContent = evaluation.band === "Strong" ? "The central thread came through." : "Here is the most useful gap.";
  $("#feedback-intro").textContent = evaluation.uncertainty || "This diagnosis compares your language with the supplied source and points to exact evidence.";
  $("#evaluation").innerHTML = `
    <div class="evaluation-grid">
      <aside class="band-card">
        <span class="band-icon">${icon}</span>
        <strong>${escapeHtml(displayBand(evaluation.band))}</strong>
        <small>${escapeHtml(bandDescriptions[evaluation.band])}</small>
      </aside>
      <div class="feedback-stack">
        <article class="feedback-card">
          <header><span>✓</span><h3>What you understood</h3></header>
          <p>${escapeHtml(evaluation.strength)}</p>
          <div class="evidence-block"><span>Source evidence · passage ${evaluation.strengthEvidence.index + 1}</span><blockquote>“${escapeHtml(evaluation.strengthEvidence.sentence)}”</blockquote></div>
        </article>
        <article class="feedback-card gap">
          <header><span>↗</span><h3>${escapeHtml(displayGapType(evaluation.gapType))}</h3></header>
          <p>${escapeHtml(evaluation.gap)}</p>
          <div class="evidence-block"><span>Source evidence · passage ${evaluation.gapEvidence.index + 1}</span><blockquote>“${escapeHtml(evaluation.gapEvidence.sentence)}”</blockquote></div>
        </article>
      </div>
    </div>`;
  $("#repair-title").textContent = evaluation.band === "Strong" ? "Test the edge of the argument." : "Take on the idea that needs another pass.";
  $("#repair-prompt").textContent = evaluation.prompt;
  $("#repair-evidence").textContent = `“${evaluation.gapEvidence.sentence}”`;
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
  setStep(5);
}

function saveCurrent(goHome = true) {
  const values = getValues();
  const chapters = loadChapters();
  const now = new Date();
  const selectedDelay = $('[name="reviewDelay"]:checked')?.value || "3";
  const reviewDue = selectedDelay === "none" ? null : new Date(now.getTime() + Number(selectedDelay) * 86400000).toISOString();
  const id = state.currentId || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const previous = chapters.find(chapter => chapter.id === id);
  const chapter = {
    ...previous,
    id,
    ...values,
    evaluation: state.evaluation,
    repairResolved: state.repairResolved,
    status: reviewDue ? "Review scheduled" : "Immediate complete",
    reviewDue,
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
  toast(reviewDue ? "Saved. Your delayed review is scheduled." : "Saved to your library.");
  if (goHome) setView("home");
}

function reviewIsDue(chapter) {
  return chapter.reviewDue && new Date(chapter.reviewDue).getTime() <= Date.now() && chapter.status !== "Complete";
}

function reviewDate(chapter) {
  if (!chapter.reviewDue) return null;
  const date = new Date(chapter.reviewDue);
  return { month: date.toLocaleDateString(undefined, { month: "short" }), day: date.getDate(), label: reviewIsDue(chapter) ? "Due now" : date.toLocaleDateString(undefined, { month: "short", day: "numeric" }) };
}

function renderReviewItem(chapter, manage = false) {
  const date = reviewDate(chapter);
  return `
    <article class="review-item">
      <div class="date-tile"><span>${escapeHtml(date?.month || "—")}</span><strong>${date?.day || "—"}</strong></div>
      <div class="item-copy"><strong>${escapeHtml(chapter.chapterTitle)}</strong><small>${escapeHtml(chapter.bookTitle)} · ${escapeHtml(displayGapType(chapter.evaluation?.gapType || "Chapter review"))}</small></div>
      ${manage ? `
        <div class="review-actions">
          <button class="item-action" type="button" data-review-id="${chapter.id}">${reviewIsDue(chapter) ? "Review now →" : "Start early →"}</button>
          <button class="text-button" type="button" data-action="toggle-reschedule" data-manage-review-id="${chapter.id}">Reschedule</button>
          <button class="text-button cancel-review" type="button" data-action="cancel-review" data-manage-review-id="${chapter.id}">Cancel</button>
        </div>
        <div class="reschedule-panel" data-reschedule-panel="${chapter.id}" hidden>
          <span>Bring this chapter back:</span>
          <div class="reschedule-options">
            <button type="button" data-action="reschedule-managed-review" data-manage-review-id="${chapter.id}" data-delay="1">Tomorrow</button>
            <button type="button" data-action="reschedule-managed-review" data-manage-review-id="${chapter.id}" data-delay="3">In 3 days</button>
            <button type="button" data-action="reschedule-managed-review" data-manage-review-id="${chapter.id}" data-delay="7">In 7 days</button>
          </div>
        </div>` : `
        <button class="item-action" type="button" data-review-id="${chapter.id}">${reviewIsDue(chapter) ? "Review now →" : escapeHtml(date?.label || "Scheduled")}</button>`}
    </article>`;
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
          ${group.title.toLowerCase().includes("road to character") ? "" : `<span class="book-summary-count">${completed}${total ? ` / ${total}` : ""}</span>`}
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
          : chapter.reviewDue
            ? `<span class="review-scheduled-icon" role="img" aria-label="Review scheduled" title="Review scheduled">
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"></circle><path d="M12 7.5v5l3.5 2"></path></svg>
              </span>`
            : "";
        return `<button class="chapter-link${chapter.status === "Draft" ? " is-draft" : ""}" type="button" data-chapter-id="${chapter.id}"><strong>${escapeHtml(chapter.chapterTitle)}</strong>${stateIndicator}</button>`;
      }).join("")}
    </details>`;
    })()}`).join("");
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
  const title = chapters[0].bookTitle;
  const author = chapters[0].authorName || book?.author || "";
  const progress = book?.totalChapters
    ? `${chapters.length} of ${book.totalChapters} chapters checked`
    : `${chapters.length} ${chapters.length === 1 ? "chapter" : "chapters"} checked`;
  const synthesis = reviews.length
    ? `You have completed ${reviews.length} delayed ${reviews.length === 1 ? "review" : "reviews"}. ${strongReviews ? `${strongReviews} came back strongly.` : "Your next reviews will show which ideas last."}${topGap ? ` The most consistent opportunity is ${topGap.toLowerCase()}.` : ""}`
    : `Your immediate checks are beginning to reveal a pattern. ${strongChecks ? `${strongChecks} ${strongChecks === 1 ? "chapter has" : "chapters have"} a strong initial recall.` : "Delayed reviews will distinguish what felt clear from what truly lasted."}${topGap ? ` Watch for ${topGap.toLowerCase()} as you continue.` : ""}`;

  $("#book-insights").innerHTML = `
    <header class="insights-hero">
      <span class="eyebrow">What’s sticking?</span>
      <h1>${escapeHtml(title)}</h1>
      <p class="insights-byline">${author ? `by ${escapeHtml(author)} · ` : ""}${escapeHtml(progress)}</p>
      <p class="insights-synthesis">${escapeHtml(synthesis)}</p>
    </header>
    <section class="insights-stats" aria-label="Book learning summary">
      <article><span>Chapters checked</span><strong>${chapters.length}${book?.totalChapters ? ` / ${book.totalChapters}` : ""}</strong></article>
      <article><span>Delayed reviews</span><strong>${reviews.length}</strong></article>
      <article><span>Strong recalls</span><strong>${strongChecks + strongReviews}</strong></article>
      <article><span>Recurring gap</span><strong class="insights-text-stat">${escapeHtml(topGap || "Still emerging")}</strong></article>
    </section>
    <div class="insights-grid">
      <section class="insights-panel">
        <header><span class="eyebrow">Ideas retained</span><h2>The threads you’ve carried forward</h2></header>
        <div class="retained-list">
          ${chapters.slice(0, 4).map(chapter => {
            const idea = chapter.evaluation?.strength || sentences(chapter.recall || "")[0] || "A chapter check was completed.";
            return `<article><span aria-hidden="true">✓</span><div><strong>${escapeHtml(chapter.chapterTitle)}</strong><p>${escapeHtml(idea)}</p></div></article>`;
          }).join("")}
        </div>
      </section>
      <section class="insights-panel">
        <header><span class="eyebrow">Patterns to strengthen</span><h2>Where understanding slips</h2></header>
        ${gaps.length
          ? `<div class="gap-list">${gaps.slice(0, 4).map(([gap, count]) => `<div><span>${escapeHtml(gap)}</span><strong>${count} ${count === 1 ? "check" : "checks"}</strong></div>`).join("")}</div>`
          : '<div class="insights-empty"><strong>No recurring gap yet</strong><p>More chapter checks will make patterns easier to trust.</p></div>'}
      </section>
    </div>
    <section class="chapter-signals">
      <header><span class="eyebrow">Chapter signals</span><h2>How your understanding is changing</h2></header>
      <div>${chapters.map(chapter => {
        const latestReview = chapter.delayedAttempts?.at(-1);
        return `<button type="button" data-chapter-id="${chapter.id}">
          <span><strong>${escapeHtml(chapter.chapterTitle)}</strong><small>${latestReview ? `Reviewed ${new Date(latestReview.createdAt).toLocaleDateString()}` : "Awaiting delayed review"}</small></span>
          <span class="signal-bands"><em>${escapeHtml(displayBand(chapter.evaluation?.band || "Checked"))}</em><em>${escapeHtml(displayBand(latestReview?.band || "Not reviewed"))}</em></span>
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
  const entries = loadChapters().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const chapters = entries.filter(chapter => chapter.status !== "Draft");
  const drafts = entries.filter(chapter => chapter.status === "Draft");
  const scheduled = chapters.filter(chapter => chapter.reviewDue && chapter.status !== "Complete").sort((a, b) => new Date(a.reviewDue) - new Date(b.reviewDue));
  const due = scheduled.filter(reviewIsDue);
  const hasChapters = isLoggedIn() && entries.length > 0;
  $("#onboarding-home").hidden = hasChapters;
  $("#returning-home").hidden = !hasChapters;
  $("#review-count").textContent = scheduled.length;
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
    $("#practice-home-reason").textContent = practiceReason;
    $("#practice-home-promo").hidden = hasPracticeCompletionToday();
    const latest = entries[0];
    const latestBookKey = bookKey(latest.bookTitle, latest.authorName || "");
    const latestBook = loadBookMetadata().find(book => (book.key || bookKey(book.title, book.author)) === latestBookKey);
    const latestCompleted = chapters.filter(chapter => bookKey(chapter.bookTitle, chapter.authorName || "") === latestBookKey).length;

    $("#dashboard-message").textContent = due.length
      ? `${due.length === 1 ? "One review is" : `${due.length} reviews are`} ready when you are. You’ve checked ${chapters.length} ${chapters.length === 1 ? "chapter" : "chapters"} so far.`
      : `Nothing needs your attention right now. You’ve checked ${chapters.length} ${chapters.length === 1 ? "chapter" : "chapters"}${drafts.length ? ` and have ${drafts.length === 1 ? "a draft" : `${drafts.length} drafts`} waiting` : ""}.`;
    $("#stat-chapters").textContent = chapters.length;
    $("#stat-reviews").textContent = completedReviews;
    $("#stat-repairs").textContent = repairs;
    $("#stat-gap").textContent = commonGap;
    $("#stat-gap").title = commonGap;
    $("#continue-book").textContent = latest.bookTitle;
    $("#continue-meta").textContent = latest.status === "Draft"
      ? `Draft: ${latest.chapterTitle} · ${latestCompleted}${latestBook?.totalChapters ? ` of ${latestBook.totalChapters}` : ""} completed`
      : latestBook?.totalChapters
        ? `${latestCompleted} of ${latestBook.totalChapters} chapters · Last: ${latest.chapterTitle}`
        : `${latestCompleted} ${latestCompleted === 1 ? "chapter" : "chapters"} completed · Last: ${latest.chapterTitle}`;
    $("#open-book-insights").dataset.bookKey = latestBookKey;
    $("#open-latest").dataset.chapterId = latest.id;
    $("#check-next").dataset.bookTitle = latest.bookTitle;
    $("#check-next").dataset.authorName = latest.authorName || "";
  }

  $("#home-reviews").innerHTML = scheduled.length
    ? scheduled.slice(0, 3).map(chapter => renderReviewItem(chapter)).join("")
    : '<div class="empty-state"><strong>Nothing due yet</strong>Complete a chapter check and its review will return here.</div>';
  $("#all-reviews").innerHTML = scheduled.length
    ? scheduled.map(chapter => renderReviewItem(chapter, true)).join("")
    : '<div class="empty-state"><strong>Your review queue is clear</strong>New checks return here after the delay you choose.</div>';
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
    "What is the author arguing—not merely describing?",
    "Complete this thought in your own words: “The author wants the reader to see that…”"
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
    "Where might the chapter’s argument stop being useful or true?",
    "What real situation would test this idea?",
    "What assumption does the argument depend on?"
  ]
};

const centralClaimPrompts = [
  chapter => `What is the central claim of “${chapter.chapterTitle}”?`,
  () => "Complete this thought in your own words: “The author wants the reader to see that…”",
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
  const gapType = displayGapType(chapter.evaluation?.gapType);
  const prompts = reviewPrompts[gapType] || reviewPrompts["Missed supporting evidence"];
  const preferred = latest ? resultRank(latest.gapBand) : 0;
  const previous = Number.isInteger(latest?.promptVariant) ? latest.promptVariant : -1;
  const promptVariant = preferred === previous ? (preferred + 1) % prompts.length : preferred;
  const previousCentral = Number.isInteger(latest?.centralPromptVariant) ? latest.centralPromptVariant : -1;
  const centralPromptVariant = (previousCentral + 1) % centralClaimPrompts.length;
  return {
    gapType: gapType || "Missed supporting evidence",
    promptVariant,
    prompt: prompts[promptVariant],
    centralPromptVariant
  };
}

function needsReviewScaffolding(chapter) {
  const attempts = (chapter.delayedAttempts || []).filter(attempt => attempt.gapBand);
  return attempts.length >= 2 && attempts.slice(-2).every(attempt => resultRank(attempt.gapBand) === 0);
}

function openReview(id) {
  const chapter = loadChapters().find(item => item.id === id);
  if (!chapter) return;
  state.reviewId = id;
  state.reviewStep = 0;
  state.reviewDraft = chooseReviewPrompt(chapter);
  renderReviewStep(chapter);
  setView("review-session");
}

function renderReviewStep(chapter) {
  $("#delayed-recall").value = "";
  $$('[name="delayedConfidence"]').forEach(input => { input.checked = false; });
  const isGapStep = state.reviewStep === 0;
  const useScaffolding = isGapStep && needsReviewScaffolding(chapter);
  $("#review-part-label").textContent = isGapStep ? "1 of 2 · Previous gap" : "2 of 2 · Central claim";
  $("#review-progress-fill").style.width = isGapStep ? "50%" : "100%";
  $("#review-step-eyebrow").textContent = isGapStep ? "Revisit the gap" : "Test the main idea";
  $("#review-session-title").textContent = isGapStep
    ? state.reviewDraft?.prompt || chapter.evaluation?.prompt
    : centralClaimPrompts[state.reviewDraft?.centralPromptVariant || 0](chapter);
  $("#review-session-meta").textContent = isGapStep
    ? `Earlier signal: ${displayGapType(chapter.evaluation?.gapType || "an idea needed another pass")}. Answer without looking back.`
    : "In one or two sentences, reconstruct the chapter’s main argument in your own words.";
  $("#delayed-recall").placeholder = isGapStep
    ? "Explain the missing idea or connection…"
    : "State the central claim and its most important support…";
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
  const weakerRank = Math.min(resultRank(attempt.gapBand), resultRank(attempt.band));
  const repeatedStrong = weakerRank === 2
    && resultRank(previousAttempt?.gapBand) === 2
    && resultRank(previousAttempt?.band) === 2;
  const delay = weakerRank === 0 ? 3 : weakerRank === 1 ? 7 : 14;
  if (repeatedStrong) {
    chapter.status = "Complete";
    chapter.reviewDue = null;
  } else {
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + delay);
    chapter.status = "Review scheduled";
    chapter.reviewDue = nextReview.toISOString();
  }
  chapter.updatedAt = new Date().toISOString();
  chapters[index] = chapter;
  saveChapters(chapters);
  renderDashboard();
  toast(repeatedStrong
    ? "Both ideas are holding up. This review is complete for now."
    : `Review complete. The weaker result will return in ${delay} days.`);
  state.reviewDraft = null;
  openChapter(chapter.id);
}

function openChapter(id) {
  const chapter = loadChapters().find(item => item.id === id);
  if (!chapter) return;
  if (chapter.status === "Draft") {
    state.currentId = chapter.id;
    state.evaluation = null;
    state.repairResolved = false;
    renderBookOptions(chapter.bookTitle, chapter.authorName);
    setValues({ ...chapter, bookPath: "existing" });
    setStep(chapter.sourceText ? Math.min(chapter.draftStep || 0, 1) : 0);
    setView("flow");
    toast("Draft reopened. Pick up where you left off.");
    return;
  }
  const latest = chapter.delayedAttempts?.at(-1);
  $("#chapter-detail").innerHTML = `
    <header class="chapter-hero">
      <span class="eyebrow">${escapeHtml(chapter.bookTitle)}</span>
      <h1>${escapeHtml(chapter.chapterTitle)}</h1>
      <p>${escapeHtml(chapter.authorName || "Author not added")} · ${escapeHtml(chapter.status)}</p>
    </header>
    <div class="history">
      <article class="history-card">
        <header><h2>Immediate recall</h2><time>${new Date(chapter.createdAt).toLocaleDateString()}</time></header>
        <p class="response-quote">${escapeHtml(chapter.recall)}</p>
      </article>
      <article class="history-card">
        <header><h2>${escapeHtml(displayBand(chapter.evaluation?.band || "Evaluation"))}</h2><span class="status-tag">${escapeHtml(displayGapType(chapter.evaluation?.gapType || "Saved"))}</span></header>
        <p class="response-quote">${escapeHtml(chapter.evaluation?.gap || "No diagnostic available.")}</p>
      </article>
      <article class="history-card">
        <header><h2>Challenge</h2><span class="status-tag ${chapter.repairResolved ? "" : "repair"}">${chapter.repairResolved ? "Completed" : "Attempted"}</span></header>
        <p class="response-quote">${escapeHtml(chapter.repair || "Challenge skipped.")}</p>
      </article>
      ${latest ? `<article class="history-card delayed-review-card">
        <header><h2>Delayed review</h2><time>${new Date(latest.createdAt).toLocaleDateString()}</time></header>
        ${latest.gapResponse ? `<div class="review-result-row"><div><span>Previous gap</span><strong>${escapeHtml(latest.gapResult || reviewResult(latest.gapBand))}</strong></div><p class="response-quote">${escapeHtml(latest.gapResponse)}</p></div>` : ""}
        <div class="review-result-row"><div><span>Central claim</span><strong>${escapeHtml(latest.centralClaimResult || displayBand(latest.band))}</strong></div><p class="response-quote">${escapeHtml(latest.response)}</p></div>
        <p class="review-schedule-note">${chapter.reviewDue ? `Next review ${new Date(chapter.reviewDue).toLocaleDateString()} · scheduled from the weaker result.` : "Both signals are holding up. No further review is scheduled."}</p>
      </article>` : ""}
    </div>
    <div class="detail-actions">
      <button class="secondary" type="button" data-action="edit-chapter" data-edit-chapter-id="${chapter.id}">Edit response</button>
      <button class="secondary" type="button" data-action="view-chapter-source" data-chapter-id="${chapter.id}">View source</button>
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
  if (!title || !recall) {
    toast("Add both a chapter title and your response.");
    return;
  }
  const chapters = loadChapters();
  const index = chapters.findIndex(chapter => chapter.id === id);
  if (index < 0) return;
  const chapter = chapters[index];
  chapter.chapterTitle = title;
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
  chapters[index].reviewDue = due.toISOString();
  chapters[index].status = "Review scheduled";
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
      placeholder: "State the author’s central claim in your own words…",
      signals: [["teams", "workplaces", "companies"], ["windows", "boundaries", "times", "expectations"], ["focus", "focused", "attention", "concentration"]],
      success: "You identified both the recommendation—shared response boundaries—and its purpose: protecting focused work."
    },
    {
      lessonTitle: "Look for the author’s recommendation",
      lessonCopy: "A central claim often contains a judgment about what should change, matter, or happen next.",
      exampleOne: "<strong>Topic:</strong> School start times",
      exampleTwo: "<strong>Claim:</strong> Secondary schools should begin later because adolescent sleep patterns make early mornings harmful to learning.",
      question: "What change does this author argue for?",
      passage: "Neighborhood parks are often designed around large lawns that are expensive to maintain and offer little shelter in hot weather. Trees and native plants cool surrounding streets while supporting local wildlife. Cities should replace portions of ornamental lawn with shaded native gardens.",
      placeholder: "Name the recommendation and the reason behind it…",
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
    placeholder: "Explain how task switching affects demanding work…",
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
    placeholder: "Identify the evidence and explain how it supports the claim…",
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
    placeholder: "State the claim, explain the reason, and include the example…",
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
  const matchedSignals = question.signals.filter(group => group.some(term => answerWords.has(term))).length;
  const feedback = $("#practice-feedback");
  const checkButton = $("#practice-check");
  feedback.hidden = false;
  feedback.className = "practice-feedback";
  if (matchedSignals === 3) {
    feedback.classList.add("is-correct");
    feedback.innerHTML = `
      <span class="practice-feedback-icon" aria-hidden="true">✓</span>
      <div><strong>You got it</strong><h3>Today’s skill held up.</h3><p>${escapeHtml(question.success)} This successful day now counts toward proficiency.</p></div>`;
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
    feedback.classList.add("is-close");
    feedback.innerHTML = `<span class="practice-feedback-icon" aria-hidden="true">↗</span><div><strong>Almost there</strong><h3>Two parts are in place.</h3><p>Your response shows the right direction. Add the missing relationship, reason, or example to make the explanation complete.</p></div>`;
  } else {
    feedback.classList.add("needs-retry");
    feedback.innerHTML = `<span class="practice-feedback-icon" aria-hidden="true">→</span><div><strong>Try once more</strong><h3>You found a relevant idea.</h3><p>Return to the question and make the key claim, relationship, or evidence more explicit.</p></div>`;
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

document.addEventListener("click", event => {
  const nav = event.target.closest("[data-nav]");
  if (nav) setView(nav.dataset.nav);

  const bookInsights = event.target.closest("[data-book-insights]");
  if (bookInsights) renderBookInsights(bookInsights.dataset.bookInsights);

  const review = event.target.closest("[data-review-id]");
  if (review) openReview(review.dataset.reviewId);

  const chapter = event.target.closest("[data-chapter-id]");
  if (chapter && !chapter.dataset.reviewId) openChapter(chapter.dataset.chapterId);

  const action = event.target.closest("[data-action]")?.dataset.action;
  if (!action) return;
  if (action === "begin-recall" && validateSource()) {
    setStep(1);
    setTimeout(() => $("#recall").focus(), 100);
  }
  if (action === "start-landing-check") startNew();
  if (action === "remove-pdf") removePdf();
  if (action === "reveal-source") {
    showSource(getValues().sourceText, getValues().chapterTitle);
    toast("Source revealed. Your attempt is still saved.");
  }
  if (action === "to-confidence") {
    if (!$("#recall").value.trim()) toast("Write what you remember—even “I don’t remember” is useful.");
    else setStep(2);
  }
  if (action === "back-recall") setStep(1);
  if (action === "evaluate") {
    const values = getValues();
    if (!values.confidence) { toast("Choose the confidence level that feels closest."); return; }
    state.evaluation = evaluateResponse(values.sourceText, values.recall, values.sourceKind);
    renderEvaluation();
    setStep(3);
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
  if (action === "reschedule-review") { toast("No problem. This review remains in your queue."); setView("reviews"); }
  if (action === "view-chapter-source") {
    const saved = loadChapters().find(item => item.id === event.target.closest("[data-chapter-id]").dataset.chapterId);
    if (saved) showSource(saved.sourceText, saved.chapterTitle);
  }
  if (action === "edit-chapter") editChapter(event.target.closest("[data-edit-chapter-id]").dataset.editChapterId);
  if (action === "cancel-chapter-edit") openChapter(event.target.closest("[data-edit-chapter-id]").dataset.editChapterId);
  if (action === "save-chapter-edit") saveChapterEdit(event.target.closest("[data-edit-chapter-id]").dataset.editChapterId);
  if (action === "toggle-reschedule") {
    const id = event.target.closest("[data-manage-review-id]").dataset.manageReviewId;
    const panel = $(`[data-reschedule-panel="${id}"]`);
    if (panel) panel.hidden = !panel.hidden;
  }
  if (action === "reschedule-managed-review") {
    const button = event.target.closest("[data-manage-review-id]");
    rescheduleManagedReview(button.dataset.manageReviewId, button.dataset.delay);
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
$("#dashboard-start").addEventListener("click", () => startNew());
$("#open-book-insights").addEventListener("click", event => renderBookInsights(event.currentTarget.dataset.bookKey));
$("#open-latest").addEventListener("click", event => openChapter(event.currentTarget.dataset.chapterId));
$("#check-next").addEventListener("click", event => startNew({
  bookPath: "existing",
  bookTitle: event.currentTarget.dataset.bookTitle,
  authorName: event.currentTarget.dataset.authorName
}));
$("#new-check").addEventListener("click", () => startNew());
$("#profile-button").addEventListener("click", event => {
  event.stopPropagation();
  const menu = $("#profile-menu");
  menu.hidden = !menu.hidden;
  $("#profile-button").setAttribute("aria-expanded", String(!menu.hidden));
});
$("#profile-menu").addEventListener("click", event => event.stopPropagation());
$("#logout-button").addEventListener("click", () => setLoggedIn(false));
$("#login-button").addEventListener("click", () => setLoggedIn(true));
$("#signup-button").addEventListener("click", () => setLoggedIn(true));
$("#save-entry-draft").addEventListener("click", saveEntryDraft);
document.addEventListener("click", () => {
  $("#profile-menu").hidden = true;
  $("#profile-button").setAttribute("aria-expanded", "false");
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    $("#profile-menu").hidden = true;
    $("#profile-button").setAttribute("aria-expanded", "false");
  }
});
$("#flow-exit").addEventListener("click", () => {
  saveDraft();
  setView("home");
  toast("Draft saved.");
});
$("#load-sample").addEventListener("click", () => {
  setValues(sample);
  toast("Sample loaded. Begin when you are ready.");
});
$("#check-form").addEventListener("input", () => { updateCounts(); saveDraft(); });
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
  const collapsed = document.body.classList.toggle("sidebar-collapsed");
  $("#toggle-sidebar").setAttribute("aria-label", collapsed ? "Expand library" : "Collapse library");
  $("#toggle-sidebar").title = collapsed ? "Expand library" : "Collapse library";
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

ensureMockDraft();
renderAuthState();
try {
  const draft = JSON.parse(localStorage.getItem(DRAFT_KEY));
  if (draft && Object.values(draft).some(Boolean)) {
    renderBookOptions(draft.bookTitle, draft.authorName);
    setValues(draft);
    toast("Your earlier draft is ready when you are.");
  } else {
    renderBookOptions();
  }
} catch {
  localStorage.removeItem(DRAFT_KEY);
  renderBookOptions();
}
