#!/usr/bin/env node
// Converts module slide .md files into professional HTML presentations.
const fs = require("fs");
const path = require("path");

const SLIDES_DIR = __dirname;

// Level badge mapping
const LEVEL_COLORS = {
  "🟢 Novice": { bg: "#e8f5e9", text: "#2e7d32", border: "#81c784" },
  "🔵 Beginner": { bg: "#e3f2fd", text: "#1565c0", border: "#64b5f6" },
  "🟡 Intermediate": { bg: "#fff8e1", text: "#f57f17", border: "#ffd54f" },
  "🟠 Advanced": { bg: "#fff3e0", text: "#e65100", border: "#ffb74d" },
  "🔴 Expert": { bg: "#fce4ec", text: "#c62828", border: "#ef9a9a" },
  "Introductory": { bg: "#f3e5f5", text: "#6a1b9a", border: "#ce93d8" },
};

function detectLevel(text) {
  for (const [key] of Object.entries(LEVEL_COLORS)) {
    if (text.includes(key)) return key;
  }
  return null;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function mdToHtml(md) {
  const lines = md.split("\n");
  let html = "";
  let i = 0;
  let inList = null; // 'ul' or 'ol'
  let inTable = false;
  let tableRows = [];

  function flushList() {
    if (inList) {
      html += `</${inList}>\n`;
      inList = null;
    }
  }

  function flushTable() {
    if (inTable && tableRows.length) {
      let t = '<table>\n';
      tableRows.forEach((row, idx) => {
        const cells = row.split("|").map(c => c.trim()).filter((c, ci, arr) => ci > 0 && ci < arr.length - 1);
        if (idx === 0) {
          t += '<thead><tr>' + cells.map(c => `<th>${inlineHtml(c)}</th>`).join('') + '</tr></thead>\n<tbody>\n';
        } else if (idx === 1 && cells.every(c => /^[-:]+$/.test(c))) {
          // separator row — skip
        } else {
          t += '<tr>' + cells.map(c => `<td>${inlineHtml(c)}</td>`).join('') + '</tr>\n';
        }
      });
      t += '</tbody></table>\n';
      html += t;
      tableRows = [];
      inTable = false;
    }
  }

  function inlineHtml(text) {
    return text
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/~~(.+?)~~/g, '<del>$1</del>');
  }

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith("```")) {
      flushList();
      flushTable();
      const lang = line.slice(3).trim();
      let code = "";
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        code += escapeHtml(lines[i]) + "\n";
        i++;
      }
      html += `<pre class="code-block"><code>${code.trimEnd()}</code></pre>\n`;
      i++;
      continue;
    }

    // Table row
    if (line.startsWith("|")) {
      flushList();
      inTable = true;
      tableRows.push(line);
      i++;
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Headings (skip ## SLIDE N lines)
    if (/^#{1,4} /.test(line)) {
      flushList();
      const level = line.match(/^(#+)/)[1].length;
      const text = line.replace(/^#+\s*/, '');
      // Skip "SLIDE N" headings
      if (/^SLIDE \d+/.test(text)) { i++; continue; }
      const tag = `h${level}`;
      html += `<${tag}>${inlineHtml(text)}</${tag}>\n`;
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      flushList();
      const text = line.replace(/^>\s*/, '');
      html += `<blockquote>${inlineHtml(text)}</blockquote>\n`;
      i++;
      continue;
    }

    // Checkbox list item
    if (/^- \[[ x]\]/.test(line)) {
      if (inList !== 'ul') { flushList(); html += '<ul class="checklist">\n'; inList = 'ul'; }
      const checked = line.includes('[x]') ? 'checked' : '';
      const text = line.replace(/^- \[[ x]\]\s*/, '');
      html += `<li><input type="checkbox" ${checked} disabled> ${inlineHtml(text)}</li>\n`;
      i++;
      continue;
    }

    // Unordered list
    if (/^[-*] /.test(line)) {
      if (inList !== 'ul') { flushList(); html += '<ul>\n'; inList = 'ul'; }
      const text = line.replace(/^[-*]\s+/, '');
      html += `<li>${inlineHtml(text)}</li>\n`;
      i++;
      continue;
    }

    // Ordered list
    if (/^\d+\. /.test(line)) {
      if (inList !== 'ol') { flushList(); html += '<ol>\n'; inList = 'ol'; }
      const text = line.replace(/^\d+\.\s+/, '');
      html += `<li>${inlineHtml(text)}</li>\n`;
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      flushList();
      flushTable();
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      flushList();
      flushTable();
      i++;
      continue;
    }

    // Paragraph
    flushList();
    flushTable();
    html += `<p>${inlineHtml(line.trim())}</p>\n`;
    i++;
  }

  flushList();
  flushTable();
  return html;
}

function parseSlidesFromMd(content) {
  // Split on horizontal rules that follow slide headers
  const rawSlides = [];

  // Split by lines and group into slides
  const lines = content.split("\n");
  let current = [];

  for (const line of lines) {
    if (/^---+$/.test(line.trim())) {
      if (current.length > 0) {
        rawSlides.push(current.join("\n").trim());
        current = [];
      }
    } else {
      current.push(line);
    }
  }
  if (current.length > 0) rawSlides.push(current.join("\n").trim());

  // Filter to only blocks that contain slides
  return rawSlides.filter(s => s.trim().length > 0 && !/^#\s+Module/.test(s.trim().split('\n')[0]) || /## SLIDE/.test(s));
}

function buildHtml(title, subtitle, level, moduleLabel, slides, isSpeakerNotes) {
  const lvl = LEVEL_COLORS[level] || { bg: "#f0f4f8", text: "#334e68", border: "#bcccdc" };

  const slidesHtml = slides.map((slideContent, idx) => {
    // Extract slide title from first # heading
    const lines = slideContent.split('\n');
    let slideTitle = '';
    let bodyLines = [];
    let pastSlideHeader = false;

    for (const line of lines) {
      if (/^## SLIDE/.test(line)) {
        pastSlideHeader = true;
        continue;
      }
      if (pastSlideHeader) {
        bodyLines.push(line);
      }
    }

    if (!pastSlideHeader) bodyLines = lines;

    // Extract h1 as slide title if present
    const h1Match = bodyLines.find(l => /^# /.test(l));
    if (h1Match) {
      slideTitle = h1Match.replace(/^# /, '').trim();
    }

    const bodyContent = bodyLines.join('\n');
    const bodyHtml = mdToHtml(bodyContent);

    return `    <section class="slide" id="slide-${idx + 1}">
      <div class="slide-number">${idx + 1} / ${slides.length}</div>
      <div class="slide-body">${bodyHtml}</div>
    </section>`;
  }).join('\n\n');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)} | Tech Writer's Tribe</title>
  <style>
    :root {
      --bg: #f5f7fa;
      --panel: #ffffff;
      --ink: #1a2332;
      --muted: #5a6a7e;
      --accent: #1a56db;
      --accent-light: #ebf5ff;
      --accent-2: #0e9f6e;
      --line: #e2e8f0;
      --shadow: 0 4px 24px rgba(26, 35, 50, 0.10);
      --shadow-lg: 0 8px 40px rgba(26, 35, 50, 0.16);
      --level-bg: ${lvl.bg};
      --level-text: ${lvl.text};
      --level-border: ${lvl.border};
      --code-bg: #1e293b;
      --code-text: #e2e8f0;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: "Inter", "Segoe UI", -apple-system, sans-serif;
      color: var(--ink);
      background: linear-gradient(135deg, #f0f4ff 0%, #f5f7fa 50%, #eef7f4 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* ── Header bar ── */
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1.5rem;
      background: var(--panel);
      border-bottom: 1px solid var(--line);
      flex-shrink: 0;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .brand {
      font-weight: 800;
      font-size: 0.95rem;
      color: var(--accent);
      letter-spacing: -0.01em;
    }

    .header-title {
      font-size: 0.9rem;
      color: var(--muted);
      font-weight: 500;
    }

    .level-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.22rem 0.65rem;
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 600;
      background: var(--level-bg);
      color: var(--level-text);
      border: 1px solid var(--level-border);
    }

    /* ── Slide stage ── */
    .stage {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem 1.5rem;
      overflow: hidden;
    }

    .slide {
      width: min(1100px, 96vw);
      height: min(660px, calc(100vh - 130px));
      background: var(--panel);
      border-radius: 20px;
      border: 1px solid var(--line);
      box-shadow: var(--shadow-lg);
      padding: 2rem 2.5rem 1.5rem;
      display: none;
      flex-direction: column;
      gap: 0.5rem;
      position: relative;
      overflow: hidden;
    }

    .slide.active { display: flex; }

    /* Decorative accent circle */
    .slide::before {
      content: "";
      position: absolute;
      width: 400px;
      height: 400px;
      right: -180px;
      top: -180px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(26,86,219,0.07) 0%, transparent 70%);
      pointer-events: none;
    }

    .slide-number {
      position: absolute;
      top: 1rem;
      right: 1.5rem;
      font-size: 0.78rem;
      color: var(--muted);
      font-weight: 500;
    }

    /* ── Slide body typography ── */
    .slide-body {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .slide-body::-webkit-scrollbar { width: 4px; }
    .slide-body::-webkit-scrollbar-thumb { background: var(--line); border-radius: 2px; }

    .slide-body h1 {
      font-size: clamp(1.6rem, 3.2vw, 2.6rem);
      line-height: 1.15;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--ink);
      margin-bottom: 0.1rem;
    }

    .slide-body h2 {
      font-size: clamp(1.1rem, 2vw, 1.6rem);
      font-weight: 600;
      color: var(--accent);
      margin-top: 0.5rem;
    }

    .slide-body h3 {
      font-size: clamp(0.95rem, 1.5vw, 1.2rem);
      font-weight: 600;
      color: var(--muted);
      margin-top: 0.3rem;
    }

    .slide-body h4 {
      font-size: clamp(0.85rem, 1.3vw, 1.05rem);
      font-weight: 600;
      color: var(--ink);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-top: 0.5rem;
    }

    .slide-body p {
      font-size: clamp(0.95rem, 1.4vw, 1.1rem);
      line-height: 1.6;
      color: var(--ink);
    }

    .slide-body strong { color: var(--ink); }

    .slide-body blockquote {
      border-left: 4px solid var(--accent);
      padding: 0.7rem 1rem;
      background: var(--accent-light);
      border-radius: 0 10px 10px 0;
      font-size: clamp(1rem, 1.6vw, 1.25rem);
      font-style: italic;
      color: var(--ink);
      margin: 0.3rem 0;
    }

    .slide-body ul,
    .slide-body ol {
      padding-left: 1.4rem;
      font-size: clamp(0.92rem, 1.35vw, 1.08rem);
      line-height: 1.5;
    }

    .slide-body li { margin: 0.3rem 0; }

    .slide-body ul.checklist { list-style: none; padding-left: 0.2rem; }
    .slide-body ul.checklist li { display: flex; align-items: flex-start; gap: 0.5rem; }
    .slide-body ul.checklist input { margin-top: 0.2rem; accent-color: var(--accent-2); }

    .slide-body table {
      width: 100%;
      border-collapse: collapse;
      font-size: clamp(0.8rem, 1.15vw, 0.96rem);
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid var(--line);
    }

    .slide-body th {
      background: var(--accent-light);
      color: var(--accent);
      font-weight: 700;
      padding: 0.5rem 0.7rem;
      text-align: left;
      border-bottom: 1px solid var(--line);
    }

    .slide-body td {
      padding: 0.45rem 0.7rem;
      border-bottom: 1px solid var(--line);
      vertical-align: top;
    }

    .slide-body tr:last-child td { border-bottom: none; }
    .slide-body tr:nth-child(even) td { background: #f8fafc; }

    .slide-body code {
      background: #f1f5f9;
      padding: 0.1em 0.35em;
      border-radius: 4px;
      font-family: "JetBrains Mono", "Fira Code", Menlo, monospace;
      font-size: 0.9em;
      color: #c7254e;
      border: 1px solid #e2e8f0;
    }

    .slide-body pre.code-block {
      background: var(--code-bg);
      color: var(--code-text);
      border-radius: 12px;
      padding: 1rem 1.2rem;
      font-family: "JetBrains Mono", "Fira Code", Menlo, monospace;
      font-size: clamp(0.75rem, 1.05vw, 0.9rem);
      line-height: 1.55;
      overflow-x: auto;
      margin: 0.3rem 0;
      flex-shrink: 0;
    }

    .slide-body pre.code-block code {
      background: none;
      border: none;
      color: inherit;
      padding: 0;
      font-size: inherit;
    }

    /* ── Controls ── */
    .controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 0.75rem 1.5rem;
      background: var(--panel);
      border-top: 1px solid var(--line);
      flex-shrink: 0;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.5rem 1.1rem;
      border-radius: 8px;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid var(--line);
      background: var(--panel);
      color: var(--ink);
      transition: background 0.15s, border-color 0.15s;
    }

    .btn:hover { background: var(--accent-light); border-color: var(--accent); color: var(--accent); }
    .btn:disabled { opacity: 0.35; cursor: not-allowed; }

    .btn-primary {
      background: var(--accent);
      color: #fff;
      border-color: var(--accent);
    }

    .btn-primary:hover { background: #1447b5; border-color: #1447b5; color: #fff; }

    .progress-wrap {
      flex: 1;
      max-width: 400px;
      background: var(--line);
      border-radius: 999px;
      height: 4px;
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--accent), var(--accent-2));
      border-radius: 999px;
      transition: width 0.25s ease;
    }

    .slide-counter {
      font-size: 0.82rem;
      color: var(--muted);
      font-weight: 500;
      min-width: 60px;
      text-align: center;
    }

    /* ── Keyboard hint ── */
    .kbd-hint {
      font-size: 0.73rem;
      color: var(--muted);
      opacity: 0.7;
    }

    kbd {
      display: inline-block;
      padding: 0.05em 0.35em;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      font-family: inherit;
      font-size: 0.85em;
    }

    /* ── Speaker notes overlay ── */
    .notes-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.55);
      z-index: 100;
      align-items: flex-end;
      padding: 2rem;
    }

    .notes-overlay.visible { display: flex; }

    .notes-panel {
      width: 100%;
      max-width: 900px;
      margin: 0 auto;
      background: var(--panel);
      border-radius: 16px;
      padding: 1.5rem;
      max-height: 50vh;
      overflow-y: auto;
      box-shadow: var(--shadow-lg);
    }

    .notes-panel h4 { color: var(--accent); margin-bottom: 0.5rem; }
    .notes-panel p { font-size: 0.92rem; line-height: 1.55; }

    /* ── Responsive ── */
    @media (max-width: 640px) {
      .slide { padding: 1.2rem 1.1rem; border-radius: 14px; }
      .slide-body h1 { font-size: 1.4rem; }
      .header-title { display: none; }
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="header-left">
      <span class="brand">TWT</span>
      <span class="header-title">${escapeHtml(title)}</span>
    </div>
    <div class="level-badge">${escapeHtml(level || moduleLabel)}</div>
  </header>

  <main class="stage" id="stage">
${slidesHtml}
  </main>

  <footer class="controls">
    <button class="btn" id="btn-prev" onclick="prevSlide()" disabled>&#8592; Prev</button>
    <div class="progress-wrap">
      <div class="progress-bar" id="progress-bar" style="width: ${slides.length > 0 ? (1/slides.length*100).toFixed(1) : 100}%"></div>
    </div>
    <span class="slide-counter" id="counter">1 / ${slides.length}</span>
    <button class="btn btn-primary" id="btn-next" onclick="nextSlide()">Next &#8594;</button>
    <span class="kbd-hint"><kbd>←</kbd><kbd>→</kbd> navigate</span>
  </footer>

  <script>
    let current = 0;
    const total = ${slides.length};
    const slides = document.querySelectorAll('.slide');

    function show(n) {
      slides.forEach(s => s.classList.remove('active'));
      slides[n].classList.add('active');
      current = n;
      document.getElementById('counter').textContent = (n + 1) + ' / ' + total;
      document.getElementById('progress-bar').style.width = ((n + 1) / total * 100).toFixed(1) + '%';
      document.getElementById('btn-prev').disabled = n === 0;
      document.getElementById('btn-next').disabled = n === total - 1;
      document.getElementById('btn-next').textContent = n === total - 1 ? 'End ✓' : 'Next →';
    }

    function nextSlide() { if (current < total - 1) show(current + 1); }
    function prevSlide() { if (current > 0) show(current - 1); }

    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); nextSlide(); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prevSlide(); }
      if (e.key === 'Home') { e.preventDefault(); show(0); }
      if (e.key === 'End') { e.preventDefault(); show(total - 1); }
    });

    show(0);
  </script>
</body>
</html>
`;
}

function processModuleFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // Extract title and subtitle from first two lines
  const title = (lines[0] || '').replace(/^#+\s*/, '').trim();
  const subtitle = (lines[1] || '').replace(/^#+\s*/, '').trim();

  const level = detectLevel(subtitle) || detectLevel(title) || "Module";

  // For speaker notes, convert differently
  const isSpeakerNotes = filePath.includes('speaker-notes');

  const slides = parseSlidesFromMd(content);

  // Filter to blocks that actually have slide content
  const slideBlocks = slides.filter(s => /## SLIDE/i.test(s) || (isSpeakerNotes && s.trim().length > 30));

  // For speaker notes with no SLIDE markers, treat each ## section as a "slide"
  let finalSlides = slideBlocks;
  if (isSpeakerNotes && slideBlocks.length === 0) {
    finalSlides = slides;
  }

  if (finalSlides.length === 0) {
    console.log(`  Skipping ${path.basename(filePath)} — no slides found`);
    return;
  }

  const moduleName = path.basename(filePath, '.md');
  const outPath = path.join(SLIDES_DIR, moduleName + '.html');

  const html = buildHtml(title, subtitle, level, subtitle, finalSlides, isSpeakerNotes);
  fs.writeFileSync(outPath, html, 'utf-8');
  console.log(`  ✓ ${path.basename(outPath)} (${finalSlides.length} slides)`);
}

// Find all .md files except already-existing conversions
const mdFiles = fs.readdirSync(SLIDES_DIR)
  .filter(f => f.endsWith('.md'))
  .map(f => path.join(SLIDES_DIR, f));

console.log(`Converting ${mdFiles.length} markdown files...\n`);
for (const f of mdFiles) {
  try {
    processModuleFile(f);
  } catch (e) {
    console.error(`  ✗ ${path.basename(f)}: ${e.message}`);
  }
}
console.log('\nDone.');
