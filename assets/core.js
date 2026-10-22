/* 視光學實驗（三）（無邊界教室）— 共用程式（架構沿用《視光學（一）》線上課程）
   提供：週次清單、前後串連、導覽列、主題切換、Stage（光學台畫布）、控制元件、預測題、測驗、學習進度、
         題庫註冊、名詞表、情境練習、排序題。
   純 JavaScript，無外部相依，可直接放在 GitHub Pages。 */
(function () {
  "use strict";

  /* 週次：依《視光學實驗（三）》16 週授課投影片
     axis：0 導論與基準能力、1 視功能與健康篩檢、2 眼位定性與定量、3 雙眼視綜合分析（講義的 A、B、C 三大主軸）
     kind：lec 實作週、rev 考前複習 */
  const WEEKS = [
    { id: "w01", wk: 1, axis: 0, kind: "lec", zh: "課程導論與前導複習", en: "Orientation & Baseline Review",
      labs: ["三個問題：看得到、看得正、看得久", "瞳孔擺動光源測試模擬", "紀錄五要素找錯", "一次標準檢查的流程排序"] },
    { id: "w02", wk: 2, axis: 1, kind: "lec", zh: "阿姆斯勒方格・色覺・立體視", en: "Amsler Grid, Colour Vision & Stereopsis",
      labs: ["阿姆斯勒方格：病人眼中的格線", "假同色板與色覺缺損模擬", "色覺遺傳：X 染色體機率", "Titmus 立體視：秒角與施測"] },
    { id: "w03", wk: 3, axis: 1, kind: "lec", zh: "聚合近點・調節近點・衛式四點", en: "NPC, NPA & Worth 4 Dot",
      labs: ["NPC 推進模擬：看眼睛，不是看目標", "NPA：推進法與拉遠法", "Worth 4 Dot：兩眼各看到什麼", "四點張角與中心抑制暗點"] },
    { id: "w04", wk: 4, axis: 1, kind: "lec", zh: "赫斯博格測試與 Kappa 角", en: "Hirschberg Test & Angle Kappa",
      labs: ["角膜反光判讀：偏多少、往哪偏", "Kappa 角：光軸與視軸", "假性內斜視：內眥贅皮", "Krimsky：用稜鏡把反光推回中央"] },
    { id: "w05", wk: 5, axis: 1, kind: "lec", zh: "對立視野檢測・眼外肌測試", en: "Confrontation Fields & EOM",
      labs: ["對立視野模擬病人", "視路病灶定位", "H 型眼外肌追視", "九方位與作用肌"] },
    { id: "w06", wk: 6, axis: 2, kind: "lec", zh: "遮蓋測試（一）：單眼遮蓋與交替遮蓋", en: "Cover Test I: Unilateral & Alternating",
      labs: ["遮蓋測試模擬病人", "遮眼器速度與融像恢復", "Maddox 聚散四成分", "眼位紀錄五向度"] },
    { id: "w07", wk: 7, axis: 2, kind: "lec", zh: "遮蓋測試（二）：稜鏡棒定量", en: "Cover Test II: Prism Bar Neutralization",
      labs: ["稜鏡的光學：光往基底、像往頂", "稜鏡棒交替遮蓋：找中和點", "基底方向判斷", "Prentice 法則：鏡片偏心的稜鏡效應"] },
    { id: "w08", wk: 8, axis: 2, kind: "rev", zh: "期中複習", en: "Midterm Review (W01–W07)",
      labs: ["期望值即時判讀", "紀錄格式找錯", "口頭判讀：下一步做什麼"] },
    { id: "w10", wk: 10, axis: 2, kind: "lec", zh: "托靈頓卡檢查", en: "Modified Thorington Technique",
      labs: ["馬篤氏鏡：點光源為什麼變成線", "托靈頓卡模擬", "紅線在左邊，為什麼是外斜？", "轉介門檻與期望值判讀"] },
    { id: "w11", wk: 11, axis: 2, kind: "lec", zh: "馬篤式鏡測試", en: "Maddox Rod",
      labs: ["馬篤氏鏡＋稜鏡中和", "雙馬篤氏鏡：旋轉性偏斜", "Parks 三步驟：哪一條肌肉？", "馬篤氏鏡判讀速查"] },
    { id: "w12", wk: 12, axis: 2, kind: "lec", zh: "von Graefe 眼位測量技術", en: "von Graefe Phoria Measurement",
      labs: ["旋轉稜鏡：兩片稜鏡的向量和", "von Graefe 水平斜位模擬", "von Graefe 垂直斜位模擬", "三種斜位測量法的重複性"] },
    { id: "w13", wk: 13, axis: 3, kind: "lec", zh: "聚散能力範圍", en: "Vergence Ranges",
      labs: ["聚散範圍模擬：模糊、破裂、回復", "需求與儲備：Sheard 準則", "聚散靈活度翻轉稜鏡", "數據快速判讀"] },
    { id: "w14", wk: 14, axis: 3, kind: "lec", zh: "ZCSBV 繪製", en: "Drawing the ZCSBV",
      labs: ["ZCSBV 繪圖台", "NRA／PRA 模擬", "AC/A：計算式與梯度式", "七組數據對號入座"] },
    { id: "w15", wk: 15, axis: 3, kind: "lec", zh: "ZCSBV 分析與個案判讀", en: "ZCSBV Analysis & Case Diagnosis",
      labs: ["三大準則畫在圖上", "十種雙眼視異常鑑別", "直接證據與間接證據", "處置方向與轉介"] },
    { id: "w16", wk: 16, axis: 3, kind: "lec", zh: "試鏡架操作・Bagolini 測試", en: "Trial Frame & Bagolini Striated Lens",
      labs: ["頂點距離與有效度數", "試鏡架調整模擬", "Bagolini 條紋鏡模擬", "解離程度光譜"] },
    { id: "w17", wk: 17, axis: 3, kind: "rev", zh: "期末複習：從單項操作走向臨床判斷", en: "Final Review (W10–W16)",
      labs: ["主訴腳本 → 檢查組合", "檢查順序通則", "紅旗辨識：繼續還是轉介？"] },
  ];
  const AXES = [
    { zh: "導論與基準能力", en: "ORIENTATION & BASELINE" },
    { zh: "視功能與健康篩檢", en: "VISUAL FUNCTION SCREENING" },
    { zh: "眼位定性與定量", en: "OCULAR ALIGNMENT" },
    { zh: "雙眼視綜合分析", en: "BINOCULAR VISION ANALYSIS" },
  ];
  const wkLabel = (w) => "W" + String(w.wk).padStart(2, "0");

  const GALLERY = {};

  /* ---------- 儲存（容錯） ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* 無痕模式等情況忽略 */ } },
  };

  /* ---------- 主題（與同網域其他實驗台共用設定） ---------- */
  const THEME_KEY = "vc-theme";
  function applyTheme(t) {
    const r = document.documentElement;
    if (t === "light" || t === "dark") r.setAttribute("data-theme", t); else r.removeAttribute("data-theme");
    document.dispatchEvent(new CustomEvent("ob-theme"));
  }
  applyTheme(store.get(THEME_KEY, "system"));
  try {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => document.dispatchEvent(new CustomEvent("ob-theme")));
  } catch (e) { /* 舊瀏覽器 */ }

  function colors() {
    const cs = getComputedStyle(document.documentElement);
    const g = (n) => cs.getPropertyValue(n).trim();
    return {
      bg: g("--canvas"), ink: g("--ink"), muted: g("--muted"), line: g("--line"), grid: g("--grid"),
      accent: g("--accent"), ray: g("--ray"), ray2: g("--ray-2"), ray3: g("--ray-3"), virtual: g("--virtual"),
      glass: g("--glass"), glassEdge: g("--glass-edge"), ok: g("--ok"), warn: g("--warn"), bad: g("--bad"),
      retina: g("--retina"), surface: g("--surface"), surface2: g("--surface-2"),
      mono: g("--font-mono"), body: g("--font-body"),
    };
  }

  /* ---------- 導覽 ---------- */
  const LOGO = '<svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true"><circle cx="15" cy="15" r="12" fill="var(--glass)" stroke="var(--glass-edge)" stroke-width="1.5"/><path d="M3.5 15 C7 11 11 9.5 15 9.5" fill="none" stroke="var(--ray)" stroke-width="1.6"/><circle cx="15" cy="15" r="4.5" fill="none" stroke="var(--accent)" stroke-width="1.8"/><circle cx="15" cy="15" r="1.8" fill="var(--ink)"/></svg>';
  function esc(s) { return String(s).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]); }

  function mountChrome(currentId) {
    const header = document.getElementById("topbar");
    if (header) {
      header.className = "topbar";
      const extra = [["progress", "課程進度地圖"], ["clinic", "模擬病人門診"], ["norms", "期望值速查與判讀"], ["calc", "★ 必會計算練功房"], ["exam", "綜合挑戰"], ["terms", "中英名詞總表"]];
      const opts = WEEKS.map((w) => `<option value="${w.id}" ${w.id === currentId ? "selected" : ""}>${wkLabel(w)}　${w.zh}</option>`).join("") +
        `<optgroup label="綜合練習">${extra.map(([v, t]) => `<option value="${v}" ${v === currentId ? "selected" : ""}>${t}</option>`).join("")}</optgroup>`;
      header.innerHTML = `<div class="topbar-inner">
        <a class="brand" href="index.html">${LOGO}<span>視光學實驗（三）<small>無邊界教室 · OPTOMETRY LAB III</small></span></a>
        <div class="spacer"></div>
        <select class="chapter-select" id="chapter-jump" aria-label="跳至週次"><option value="index">— 課程首頁 —</option>${opts}</select>
        <button class="theme-btn" id="theme-btn" type="button"></button>
      </div>`;
      header.querySelector("#chapter-jump").addEventListener("change", (e) => { location.href = e.target.value + ".html"; });
      const btn = header.querySelector("#theme-btn");
      const label = () => {
        const t = store.get(THEME_KEY, "system");
        btn.textContent = t === "dark" ? "深色" : t === "light" ? "淺色" : "跟隨系統";
        btn.setAttribute("aria-label", "切換配色，目前：" + btn.textContent);
      };
      label();
      btn.addEventListener("click", () => {
        const order = ["system", "light", "dark"];
        const t = order[(order.indexOf(store.get(THEME_KEY, "system")) + 1) % 3];
        store.set(THEME_KEY, t); applyTheme(t); label();
      });
    }
    const pager = document.getElementById("pager");
    if (pager && currentId) {
      const i = WEEKS.findIndex((c) => c.id === currentId);
      const prev = WEEKS[i - 1], next = WEEKS[i + 1];
      pager.className = "pager";
      const exam = (a, b) => (a && b && b.wk - a.wk > 1) ? "" : "";
      pager.innerHTML =
        (prev ? `<a class="prev" href="${prev.id}.html"><small>← 上一週</small>${wkLabel(prev)}　${prev.zh}</a>` : `<a class="prev" href="index.html"><small>← 回到</small>課程首頁</a>`) +
        (next ? `<a class="next" href="${next.id}.html"><small>下一週 →</small>${wkLabel(next)}　${next.zh}</a>` : `<a class="next" href="clinic.html"><small>學期最後一站 →</small>模擬病人門診</a>`);
    }
    const foot = document.getElementById("footer");
    if (foot) {
      foot.className = "site";
      const cfg = window.OB_CONFIG || {};
      const cp = cfg.copyright || {};
      const devs = (cfg.developers || []).map((d) => `${esc(d.name)}${d.role ? "（" + esc(d.role) + "）" : ""}`).join("、");
      foot.innerHTML = `<div class="wrap foot-grid">
        ${devs ? `<div><b>開發者</b>　${devs}</div>` : ""}
        ${cp.holder ? `<div class="copy">© ${esc(String(cp.year || new Date().getFullYear()))} ${esc(cp.holder)}${cp.note ? "　" + esc(cp.note) : ""}</div>` : ""}
        <div>教學用互動教材。內容依本科《視光學實驗（三）》自編講義與授課投影片編排（二專在職專班，16 週），期望值以 Morgan 為準，並以 Carlson &amp; Kurtz《視光臨床實務》第 4 版對照。互動模擬、題目與文字皆為原創；模擬病人的反應為教學用的簡化模型，臨床判讀仍以正式教科書與指導老師為準。</div>
        ${window.labConsent ? `<div><button type="button" class="linkish" id="ga-settings">${esc(window.labConsent.text())}</button></div>` : ""}
      </div>`;
      const gs = foot.querySelector("#ga-settings"); if (gs) gs.onclick = () => window.labConsent.show();
    }
  }

  /* ---------- ★◆○ 本週記號表：<div id="levels"></div>，OL.levels("levels", [["★","…"],["◆","…"]]) ---------- */
  function levels(elId, items) {
    const el = document.getElementById(elId); if (!el) return;
    const cls = { "★": "lv-s", "◆": "lv-d", "○": "lv-o" };
    const name = { "★": "必修・要會算", "◆": "重要・要看懂", "○": "延伸・知道即可" };
    el.className = "levels";
    el.innerHTML = items.map(([m, t, note]) => `<div class="lv ${cls[m]}"><span class="lv-m">${m}</span><span class="lv-t">${t}${note ? `<small>${note}</small>` : ""}</span><span class="lv-n">${name[m]}</span></div>`).join("");
  }
  const LV = (m) => `<span class="lvtag ${{ "★": "lv-s", "◆": "lv-d", "○": "lv-o" }[m]}">${m} ${{ "★": "要會算", "◆": "要看懂", "○": "知道即可" }[m]}</span>`;

  /* ---------- 題庫：每週一個檔案 assets/bank/wXX.js，OL.bank("w02", { quiz:[…], terms:[…] }) ---------- */
  const BANK = (window.OB_BANK = window.OB_BANK || {});
  function bank(id, data) { BANK[id] = data; }
  function terms(elId, id) {
    const el = document.getElementById(elId); const b = BANK[id]; if (!el || !b || !b.terms) return;
    el.innerHTML = `<div class="terms-wrap"><table class="terms"><tr><th>English</th><th>中文</th><th>一句話說明</th></tr>${b.terms.map((t) => `<tr><td>${t[0]}</td><td>${t[1]}</td><td>${t[2] || ""}</td></tr>`).join("")}</table></div>`;
  }

  /* ---------- 講義圖解與燈箱 ---------- */
  let lb = null;
  function lightbox(list, i) {
    if (!lb) {
      lb = document.createElement("div"); lb.className = "lightbox"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true");
      lb.innerHTML = '<button type="button" class="lb-x" aria-label="關閉">×</button><button type="button" class="lb-p" aria-label="上一張">‹</button><figure><img alt=""><figcaption></figcaption></figure><button type="button" class="lb-n" aria-label="下一張">›</button>';
      document.body.appendChild(lb);
      lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lb-x")) close(); });
      document.addEventListener("keydown", (e) => { if (lb.hidden) return; if (e.key === "Escape") close(); if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); });
      lb.querySelector(".lb-p").onclick = () => step(-1); lb.querySelector(".lb-n").onclick = () => step(1);
    }
    let cur = i;
    function show() { const [f, cap] = list[cur]; const im = lb.querySelector("img"); im.src = "assets/img/" + f + ".webp"; im.alt = cap; lb.querySelector("figcaption").textContent = `${cur + 1} / ${list.length}　${cap}`; }
    function step(d) { cur = (cur + d + list.length) % list.length; show(); }
    function close() { lb.hidden = true; document.body.style.overflow = ""; }
    lb._step = step; lb.hidden = false; document.body.style.overflow = "hidden"; show();
    lb.querySelector(".lb-p").onclick = () => step(-1); lb.querySelector(".lb-n").onclick = () => step(1);
    lb.querySelector(".lb-x").focus();
  }
  function gallery(elId, id) {
    const el = document.getElementById(elId); const list = GALLERY[id];
    if (!el) return;
    if (!list) { const sec = el.closest("section"); if (sec) sec.hidden = true; return; }
    el.className = "gallery";
    el.innerHTML = list.map(([f, cap], i) => `<button type="button" class="gal" data-i="${i}"><img src="assets/img/${f}.webp" alt="${esc(cap)}" loading="lazy" width="1400" height="788"><span>${esc(cap)}</span></button>`).join("");
    el.querySelectorAll(".gal").forEach((b) => b.addEventListener("click", () => lightbox(list, +b.dataset.i)));
  }

  /* ---------- Stage：光學台畫布 ---------- */
  class Stage {
    constructor(canvas, opt) {
      this.cv = typeof canvas === "string" ? document.getElementById(canvas) : canvas;
      this.ctx = this.cv.getContext("2d");
      this.opt = Object.assign({ xmin: -10, xmax: 10, ymin: -5, ymax: 5, aspect: 0.5, minH: 260, maxH: 460, equal: false }, opt);
      this.drawFn = this.opt.draw || (() => {});
      this.handles = [];
      this.dragging = null;
      this._raf = 0;
      const ro = new ResizeObserver(() => this.resize());
      ro.observe(this.cv.parentElement);
      document.addEventListener("ob-theme", () => this.render());
      this._bindPointer();
      this.resize();
    }
    setView(v) { Object.assign(this.opt, v); this._compute(); this.render(); }
    resize() {
      const w = Math.max(100, this.cv.parentElement.clientWidth);
      const h = Math.round(Math.min(this.opt.maxH, Math.max(this.opt.minH, w * this.opt.aspect)));
      const dpr = window.devicePixelRatio || 1;
      this.w = w; this.h = h; this.dpr = dpr;
      this.cv.style.height = h + "px";
      this.cv.width = Math.round(w * dpr); this.cv.height = Math.round(h * dpr);
      this._compute();
      this.render();
    }
    _compute() {
      const o = this.opt;
      this.sx = this.w / (o.xmax - o.xmin);
      this.sy = this.h / (o.ymax - o.ymin);
      this.ox = 0; this.oy = 0;
      if (o.equal) {
        const s = Math.min(this.sx, this.sy);
        this.ox = (this.w - s * (o.xmax - o.xmin)) / 2; this.oy = (this.h - s * (o.ymax - o.ymin)) / 2;
        this.sx = this.sy = s;
      }
    }
    X(x) { return this.ox + (x - this.opt.xmin) * this.sx; }
    Y(y) { return this.h - this.oy - (y - this.opt.ymin) * this.sy; }
    wx(px) { return (px - this.ox) / this.sx + this.opt.xmin; }
    wy(py) { return (this.h - this.oy - py) / this.sy + this.opt.ymin; }
    render() {
      cancelAnimationFrame(this._raf);
      this._raf = requestAnimationFrame(() => {
        const c = this.ctx;
        c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        c.clearRect(0, 0, this.w, this.h);
        this.c = colors();
        c.fillStyle = this.c.bg; c.fillRect(0, 0, this.w, this.h);
        c.lineCap = "round"; c.lineJoin = "round";
        this.drawFn(this, this.c);
        for (const hd of this.handles) if (hd.visible !== false && (!hd.show || hd.show())) this._drawHandle(hd);
      });
    }
    addHandle(h) { this.handles.push(h); return h; }
    _drawHandle(h) {
      const [x, y] = h.pos(); const c = this.ctx;
      c.save(); c.beginPath(); c.arc(this.X(x), this.Y(y), 7, 0, Math.PI * 2);
      c.fillStyle = this.c.surface; c.fill(); c.lineWidth = 2; c.strokeStyle = h.color || this.c.accent; c.stroke(); c.restore();
    }
    _bindPointer() {
      const pt = (e) => { const r = this.cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
      const find = (px, py) => this.handles.find((h) => {
        if (h.show && !h.show()) return false;
        const [x, y] = h.pos(); return Math.hypot(this.X(x) - px, this.Y(y) - py) < (h.r || 18);
      });
      this.cv.addEventListener("pointerdown", (e) => {
        const [px, py] = pt(e); const h = find(px, py);
        if (h) { this.dragging = h; this.cv.setPointerCapture(e.pointerId); e.preventDefault(); }
        else if (this.opt.click) { this.opt.click(this.wx(px), this.wy(py), px, py); this.render(); }
      });
      this.cv.addEventListener("pointermove", (e) => {
        const [px, py] = pt(e);
        if (this.dragging) { this.dragging.drag(this.wx(px), this.wy(py)); this.render(); }
        else this.cv.style.cursor = find(px, py) ? "grab" : (this.opt.click ? "pointer" : "default");
      });
      const up = () => { if (this.dragging && this.dragging.end) this.dragging.end(); this.dragging = null; };
      this.cv.addEventListener("pointerup", up); this.cv.addEventListener("pointercancel", up);
    }
    line(x1, y1, x2, y2, o = {}) {
      const c = this.ctx; c.save();
      c.strokeStyle = o.color || this.c.ink; c.lineWidth = o.w || 1.6; c.globalAlpha = o.alpha == null ? 1 : o.alpha;
      if (o.dash) c.setLineDash(o.dash === true ? [6, 5] : o.dash);
      c.beginPath(); c.moveTo(this.X(x1), this.Y(y1)); c.lineTo(this.X(x2), this.Y(y2)); c.stroke(); c.restore();
    }
    poly(pts, o = {}) {
      if (pts.length < 2) return;
      const c = this.ctx; c.save();
      c.strokeStyle = o.color || this.c.ink; c.lineWidth = o.w || 1.6; c.globalAlpha = o.alpha == null ? 1 : o.alpha;
      if (o.dash) c.setLineDash(o.dash === true ? [6, 5] : o.dash);
      c.beginPath(); c.moveTo(this.X(pts[0][0]), this.Y(pts[0][1]));
      for (let i = 1; i < pts.length; i++) c.lineTo(this.X(pts[i][0]), this.Y(pts[i][1]));
      if (o.close) c.closePath();
      if (o.fill) { c.fillStyle = o.fill; c.fill(); }
      if (o.w !== 0) c.stroke();
      c.restore();
    }
    ray(pts, o = {}) {
      this.poly(pts, o);
      if (o.arrows === false) return;
      for (let i = 0; i < pts.length - 1; i++) {
        const x1 = this.X(pts[i][0]), y1 = this.Y(pts[i][1]), x2 = this.X(pts[i + 1][0]), y2 = this.Y(pts[i + 1][1]);
        const L = Math.hypot(x2 - x1, y2 - y1); if (L < 30) continue;
        const t = o.at == null ? 0.5 : o.at;
        this.arrowHead(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, Math.atan2(y2 - y1, x2 - x1), o.color || this.c.ray, o.alpha);
      }
    }
    arrowHead(px, py, ang, color, alpha) {
      const c = this.ctx, s = 7; c.save(); c.globalAlpha = alpha == null ? 1 : alpha;
      c.translate(px, py); c.rotate(ang); c.fillStyle = color;
      c.beginPath(); c.moveTo(s, 0); c.lineTo(-s * 0.8, s * 0.6); c.lineTo(-s * 0.8, -s * 0.6); c.closePath(); c.fill(); c.restore();
    }
    text(s, x, y, o = {}) {
      const c = this.ctx; c.save();
      c.font = `${o.weight || 500} ${o.size || 12}px ${o.font || this.c.body}`;
      c.textAlign = o.align || "center"; c.textBaseline = o.base || "middle";
      let px = (o.px ? x : this.X(x)) + (o.dx || 0), py = (o.px ? y : this.Y(y)) + (o.dy || 0);
      if (o.bg) {
        const m = c.measureText(s), w = m.width + 8, hgt = (o.size || 12) + 6;
        let bx = px - (c.textAlign === "center" ? w / 2 : c.textAlign === "right" ? w - 4 : 4);
        c.fillStyle = o.bg; c.globalAlpha = 0.85; c.fillRect(bx, py - hgt / 2, w, hgt); c.globalAlpha = 1;
      }
      c.fillStyle = o.color || this.c.ink; c.fillText(s, px, py); c.restore();
    }
    axis(o = {}) {
      this.line(this.opt.xmin, 0, this.opt.xmax, 0, { color: this.c.muted, w: 1, dash: [10, 4, 2, 4], alpha: 0.8 });
      if (o.label !== false) this.text("光軸", this.opt.xmax, 0, { align: "right", dy: -10, dx: -6, size: 11, color: this.c.muted });
    }
    point(x, y, label, o = {}) {
      const c = this.ctx; c.save(); c.beginPath(); c.arc(this.X(x), this.Y(y), o.r || 3.5, 0, Math.PI * 2);
      c.fillStyle = o.color || this.c.ink; c.fill(); c.restore();
      if (label) this.text(label, x, y, { dy: o.dy == null ? 14 : o.dy, dx: o.dx || 0, color: o.color || this.c.ink, size: o.size || 12, weight: 700, font: o.font || this.c.mono, bg: o.bg });
    }
    lens(x, hh, power, o = {}) {
      const c = this.ctx, X = this.X(x), yc = o.y || 0, y1 = this.Y(yc + hh), y2 = this.Y(yc - hh);
      const bulge = Math.max(-12, Math.min(12, (o.bulge != null ? o.bulge : power * 0.9)));
      const half = 4;
      c.save(); c.beginPath();
      if (power >= 0) {
        c.moveTo(X, y1); c.quadraticCurveTo(X + half + bulge * 1.6, (y1 + y2) / 2, X, y2);
        c.quadraticCurveTo(X - half - bulge * 1.6, (y1 + y2) / 2, X, y1);
      } else {
        const b = -bulge, e = half + 6;
        c.moveTo(X - e, y1); c.lineTo(X + e, y1); c.quadraticCurveTo(X + e - b * 1.6, (y1 + y2) / 2, X + e, y2);
        c.lineTo(X - e, y2); c.quadraticCurveTo(X - e + b * 1.6, (y1 + y2) / 2, X - e, y1);
      }
      c.closePath(); c.fillStyle = o.fill || this.c.glass; c.fill(); c.strokeStyle = o.edge || this.c.glassEdge; c.lineWidth = 1.4; c.stroke(); c.restore();
      if (o.label) this.text(o.label, x, yc + hh, { dy: -12, color: o.labelColor || this.c.accent, weight: 700, size: 12 });
    }
  }

  /* ---------- 近軸光線追跡（座標單位：公尺）。折射：n2·s' = n1·s − y·F ---------- */
  function trace(ray, elems, xEnd) {
    let { x, y, s, n } = Object.assign({ n: 1 }, ray);
    const pts = [[x, y]];
    const seq = elems.slice().sort((a, b) => a.x - b.x);
    for (const e of seq) {
      if (e.x < x) continue;
      y = y + s * (e.x - x); x = e.x; pts.push([x, y]);
      const n2 = e.n2 == null ? n : e.n2;
      s = (n * s - y * e.F) / n2; n = n2;
    }
    if (xEnd != null) { y = y + s * (xEnd - x); x = xEnd; pts.push([x, y]); }
    return { pts, s, y, x, n };
  }

  /* ---------- 格式 ---------- */
  const fmt = {
    D(v, d = 2) { if (!isFinite(v)) return "∞"; if (Math.abs(v) < 0.005) return "0.00 D"; return (v > 0 ? "+" : "−") + Math.abs(v).toFixed(d) + " D"; },
    s(v, d = 2) { if (!isFinite(v)) return "∞"; if (Math.abs(v) < 0.5 * Math.pow(10, -d)) return (0).toFixed(d); return (v > 0 ? "+" : "−") + Math.abs(v).toFixed(d); },
    num(v, d = 2, unit = "") { if (!isFinite(v)) return "∞"; const s = (v < 0 ? "−" : v > 0 ? "+" : "") + Math.abs(v).toFixed(d); return s + (unit ? " " + unit : ""); },
    plain(v, d = 1, unit = "") { if (!isFinite(v)) return "∞"; return (v < 0 ? "−" : "") + Math.abs(v).toFixed(d) + (unit ? " " + unit : ""); },
    ax(a) { return String(Math.round(((a - 1 + 1800) % 180) + 1)).padStart(3, "0"); },
    rx(S, C, A) { return `${Math.abs(S) < 0.005 ? "pl" : fmt.s(S)} / ${fmt.s(C)} × ${fmt.ax(A)}`; },
  };

  /* ---------- 控制元件 ---------- */
  function range(id, format, onInput) {
    const el = document.getElementById(id);
    const out = document.getElementById(id + "-out");
    const upd = () => { if (out) out.textContent = format ? format(+el.value) : el.value; };
    el.addEventListener("input", () => { upd(); onInput && onInput(+el.value); });
    upd();
    return { get value() { return +el.value; }, set value(v) { el.value = v; upd(); }, el, refresh: upd };
  }
  function seg(id, onChange) {
    const box = document.getElementById(id);
    const btns = [...box.querySelectorAll("button")];
    let val = (btns.find((b) => b.getAttribute("aria-pressed") === "true") || btns[0]).dataset.v;
    const set = (v, silent) => {
      val = v; btns.forEach((b) => b.setAttribute("aria-pressed", b.dataset.v === v ? "true" : "false"));
      if (!silent && onChange) onChange(v);
    };
    btns.forEach((b) => { b.type = "button"; b.addEventListener("click", () => set(b.dataset.v)); });
    set(val, true);
    return { get value() { return val; }, set };
  }
  function check(id, onChange) {
    const el = document.getElementById(id);
    el.addEventListener("change", () => onChange && onChange(el.checked));
    return { get value() { return el.checked; }, set value(v) { el.checked = v; }, el };
  }

  /* ---------- 預測題 ---------- */
  function initPredicts() {
    document.querySelectorAll(".predict").forEach((p) => {
      const ans = +p.dataset.answer;
      const btns = [...p.querySelectorAll(".opts button")];
      const why = p.querySelector(".why");
      btns.forEach((b, i) => {
        b.type = "button";
        b.addEventListener("click", () => {
          btns.forEach((x, j) => { x.classList.toggle("right", j === ans); x.classList.toggle("wrong", j === i && i !== ans); });
          if (why) { why.hidden = false; why.innerHTML = (i === ans ? '<span class="pill ok">預測正確</span> ' : '<span class="pill warn">再想想</span> ') + why.dataset.text; }
        });
      });
      if (why) { why.dataset.text = why.innerHTML; why.innerHTML = ""; why.hidden = true; }
    });
  }

  /* ---------- 測驗 ---------- */
  const PROG_KEY = "opt3lab-progress";   // 與同網域其他課程分開記錄
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function quiz(elId, chapterId, items, opt = {}) {
    const root = document.getElementById(elId);
    root.classList.add("quiz");
    let answered = 0, correct = 0;
    const scoreEl = document.createElement("div");
    scoreEl.className = "quiz-score";
    const wrong = [];
    items.forEach((raw, qi) => {
      const order = shuffle(raw.opts.map((_, i) => i));
      const it = { q: raw.q, exp: raw.exp, opts: order.map((i) => raw.opts[i]), a: order.indexOf(raw.a) };
      const box = document.createElement("div"); box.className = "qitem";
      box.innerHTML = `<div class="qn">Q${qi + 1} / ${items.length}${raw.src ? `<span class="qsrc">${raw.src}</span>` : ""}</div><div class="qt">${it.q}</div><div class="qopts"></div><div class="qexp" hidden></div>`;
      const opts = box.querySelector(".qopts"), exp = box.querySelector(".qexp");
      it.opts.forEach((o, oi) => {
        const b = document.createElement("button"); b.type = "button";
        b.innerHTML = String.fromCharCode(65 + oi) + ". " + o;
        b.addEventListener("click", () => {
          [...opts.children].forEach((x, j) => { x.disabled = true; if (j === it.a) x.classList.add("right"); });
          if (oi !== it.a) { b.classList.add("wrong"); wrong.push(raw); } else correct++;
          answered++;
          exp.hidden = false;
          exp.innerHTML = (oi === it.a ? '<span class="pill ok">答對</span> ' : '<span class="pill bad">答錯</span> ') + it.exp;
          updateScore();
        });
        opts.appendChild(b);
      });
      root.appendChild(box);
    });
    root.appendChild(scoreEl);
    function updateScore() {
      scoreEl.innerHTML = `<span>已作答 ${answered} / ${items.length}　答對 ${correct}</span>`;
      if (answered === items.length) {
        if (!opt.noSave) {
          const p = store.get(PROG_KEY, {});
          const prev = p[chapterId];
          if (!prev || correct >= prev.correct) p[chapterId] = { correct, total: items.length, t: Date.now() };
          store.set(PROG_KEY, p);
        }
        if (window.labTrack) labTrack("quiz_complete", { chapter: chapterId, correct, total: items.length, score: Math.round(correct / items.length * 100) });
        const pct = correct / items.length;
        scoreEl.innerHTML += pct >= 0.8 ? ' <span class="pill ok">觀念掌握良好</span>' : ' <span class="pill warn">建議回到互動實驗再操作一次</span>';
        const again = document.createElement("button"); again.className = "btn ghost"; again.type = "button"; again.textContent = "重新作答";
        again.addEventListener("click", () => { root.innerHTML = ""; (opt.onAgain || (() => quiz(elId, chapterId, items, opt)))(); });
        scoreEl.appendChild(again);
        if (opt.onDone) opt.onDone(correct, items.length, wrong);
      }
    }
    updateScore();
  }
  function progress() { return store.get(PROG_KEY, {}); }

  /* ---------- 模糊字（圓盤取樣模擬幾何模糊；ex、ey 為橢圓模糊的水平與垂直直徑） ---------- */
  function blurText(ctx, text, x, y, font, color, ex, ey) {
    if (ey == null) ey = ex;
    ctx.save(); ctx.font = font; ctx.fillStyle = color; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    const R = Math.max(ex, ey) / 2;
    if (R < 0.6) { ctx.fillText(text, x, y); ctx.restore(); return; }
    const pts = [];
    const rings = Math.min(7, Math.ceil(R / 2));
    for (let i = 0; i <= rings; i++) {
      const rr = i / rings; const n = i === 0 ? 1 : Math.round(6 * i);
      for (let j = 0; j < n; j++) { const a = (j / n) * Math.PI * 2 + i * 0.4; pts.push([Math.cos(a) * rr * ex / 2, Math.sin(a) * rr * ey / 2]); }
    }
    ctx.globalAlpha = Math.min(1, 1.6 / pts.length + 0.02);
    for (const [dx, dy] of pts) ctx.fillText(text, x + dx, y + dy);
    ctx.restore();
  }
  /* 任意繪圖函式的模糊版本：drawFn(ctx, dx, dy) 會被多次呼叫；ex、ey 為模糊直徑（px），rot 為模糊橢圓的角度（弧度） */
  function blurDraw(ctx, drawFn, ex, ey, rot = 0) {
    if (ey == null) ey = ex;
    const R = Math.max(ex, ey) / 2;
    if (R < 0.6) { drawFn(ctx, 0, 0); return; }
    const pts = [], rings = Math.min(6, Math.ceil(R / 2)), cr = Math.cos(rot), sr = Math.sin(rot);
    for (let i = 0; i <= rings; i++) {
      const rr = i / rings, n = i === 0 ? 1 : Math.round(6 * i);
      for (let j = 0; j < n; j++) { const a = (j / n) * Math.PI * 2 + i * 0.4; const u = Math.cos(a) * rr * ex / 2, v = Math.sin(a) * rr * ey / 2; pts.push([u * cr - v * sr, u * sr + v * cr]); }
    }
    ctx.save(); ctx.globalAlpha = Math.min(1, 1.6 / pts.length + 0.02);
    for (const [dx, dy] of pts) drawFn(ctx, dx, dy);
    ctx.restore();
  }


  /* ---------- 情境練習卡：OL.drill("容器 id", ["選項",…], [{ q, a, why }], { unit: "情境" }) ---------- */
  function drill(elId, opts, cases, o = {}) {
    const root = document.getElementById(elId); if (!root) return;
    const unit = o.unit || "情境";
    root.innerHTML = `<div class="case"><div class="who"></div><div class="say"></div><div class="chips"></div><div class="fb" hidden></div><div class="row-btns"><button class="btn ghost nx" type="button" hidden>下一個 →</button></div></div><div class="score-line"></div>`;
    const $ = (s) => root.querySelector(s);
    let order = shuffle(cases.slice()), i = 0, ok = 0, n = 0;
    function show() {
      const c = order[i], op = c.opts || opts;
      $(".who").textContent = `${unit} ${i + 1} / ${order.length}`;
      $(".say").innerHTML = c.q; $(".fb").hidden = true; $(".nx").hidden = true;
      $(".chips").innerHTML = op.map((t, j) => `<button type="button" class="chip" data-j="${j}">${t}</button>`).join("");
      $(".chips").querySelectorAll("button").forEach((b) => b.onclick = () => {
        const j = +b.dataset.j; n++; if (j === c.a) ok++;
        $(".chips").querySelectorAll("button").forEach((x) => { x.disabled = true; if (+x.dataset.j === c.a) x.classList.add("ok"); });
        if (j !== c.a) b.classList.add("bad");
        $(".fb").hidden = false; $(".fb").innerHTML = (j === c.a ? '<span class="pill ok">正確</span> ' : '<span class="pill bad">再想想</span> ') + c.why;
        $(".nx").hidden = false; $(".nx").textContent = i + 1 < order.length ? "下一個 →" : "重新洗牌再練一次";
        root.querySelector(".score-line").textContent = `目前 ${ok} / ${n} 正確`;
      });
    }
    $(".nx").onclick = () => { i++; if (i >= order.length) { shuffle(order); i = 0; ok = 0; n = 0; root.querySelector(".score-line").textContent = ""; } show(); };
    show();
  }
  /* ---------- 排序題：OL.order("容器 id", ["正確順序 1", "2", …], { first: "最先", last: "最後" }) ---------- */
  function order(elId, right, o = {}) {
    const root = document.getElementById(elId); if (!root) return;
    let cur = shuffle(right.slice()); if (cur.every((t, k) => t === right[k])) cur.reverse();
    root.innerHTML = `<ol class="order-list"></ol><div class="row-btns" style="margin-top:8px"><button class="btn ghost ck" type="button">檢查順序</button><button class="btn ghost rs" type="button">重新打亂</button><span class="ov"></span></div>`;
    const ol = root.querySelector("ol");
    function draw(mark) {
      ol.innerHTML = cur.map((t, k) => `<li class="${mark ? (t === right[k] ? "ok" : "bad") : ""}"><span>${t}${k === 0 && o.first ? `　<small style="color:var(--muted)">（${o.first}）</small>` : ""}${k === cur.length - 1 && o.last ? `　<small style="color:var(--muted)">（${o.last}）</small>` : ""}</span><span class="mv"><button type="button" data-k="${k}" data-d="-1" aria-label="上移">↑</button><button type="button" data-k="${k}" data-d="1" aria-label="下移">↓</button></span></li>`).join("");
      ol.querySelectorAll("button").forEach((b) => b.onclick = () => { const k = +b.dataset.k, j = k + +b.dataset.d; if (j < 0 || j >= cur.length) return; [cur[k], cur[j]] = [cur[j], cur[k]]; root.querySelector(".ov").innerHTML = ""; draw(false); });
    }
    root.querySelector(".ck").onclick = () => { const good = cur.filter((t, k) => t === right[k]).length; draw(true); root.querySelector(".ov").innerHTML = good === right.length ? '<span class="pill ok">完全正確</span>' : `<span class="pill warn">對了 ${good} / ${right.length} 個位置</span>`; };
    root.querySelector(".rs").onclick = () => { cur = shuffle(right.slice()); root.querySelector(".ov").innerHTML = ""; draw(false); };
    draw(false);
  }


  /* ---------- 前後串連：<div id="connect"></div>，OL.connect("connect", [["W03", "w03", "NPC 的破裂點"], ["視光學（一）W07", "@opt1:w07", "…"]]) ---------- */
  function link(href) {
    if (!href) return "";
    const m = /^@(\w+):(.*)$/.exec(href); if (!m) return href.indexOf(".") > -1 || href.indexOf("#") > -1 ? href : href + ".html";
    const ext = ((window.OB_CONFIG || {}).courses || {})[m[1]]; if (!ext || !ext.base) return "";
    return ext.base + m[2] + (m[2].indexOf(".") > -1 ? "" : ".html");
  }
  function connect(elId, items) {
    const el = document.getElementById(elId); if (!el) return;
    el.className = "connect";
    el.innerHTML = items.map(([tag, href, note]) => { const u = link(href);
      return u ? `<a class="cn" href="${u}"><small>${esc(tag)}</small><span>${note}</span></a>` : `<div class="cn off"><small>${esc(tag)}</small><span>${note}</span></div>`; }).join("");
  }
  /* 外部工具：config.tools 有網址才顯示，<a data-tool="phoropter"> */
  function tools() {
    const t = (window.OB_CONFIG || {}).tools || {};
    document.querySelectorAll("[data-tool]").forEach((a) => { const u = t[a.dataset.tool]; if (u) a.href = u; else a.hidden = true; });
  }

  /* ---------- 工具 ---------- */
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const q4 = (v) => Math.round(v * 4 + (v < 0 ? -1e-9 : 1e-9)) / 4;


  /* ---------- 學習歷程（只存在本機瀏覽器，供「課程進度地圖」使用） ---------- */
  const K = { labs: "opt3lab-labs", star: "opt3lab-star", terms: "opt3lab-terms", exam: "opt3lab-exam", self: "opt3lab-self" };
  const SELF_LV = ["還不會", "有點懂", "說得出來", "能教別人"];
  const STAR_NEED = 3;   // ★ 某一項連續換數字全對 3 組，視為「精熟」
  const LAB_NEED = 3;    // 在一個實驗裡操作 3 次（拖曳、切換、按鈕），視為「已探索」
  const journal = {
    labs: () => store.get(K.labs, {}),            // { w02: { 0: t, 2: t } }
    star: () => store.get(K.star, {}),            // { 1: { tries, ok, t } }
    terms: () => store.get(K.terms, {}),          // { "cornea": t }
    exam: () => store.get(K.exam, []),            // [ { t, range, ok, tot } ]
    self: () => store.get(K.self, {}),            // { "w02-0": { b, bt, n, nt } }
    labDone(wid, i) {
      const L = journal.labs(); L[wid] = L[wid] || {};
      if (L[wid][i]) return false;
      L[wid][i] = Date.now(); store.set(K.labs, L);
      if (window.labTrack) labTrack("lab_explored", { chapter: wid, lab: i + 1 });
      return true;
    },
    starCheck(n, allRight) {
      if (!n) return;
      const S = journal.star(); const r = S[n] || { tries: 0, ok: 0 };
      r.tries++; if (allRight) r.ok++;
      if (r.ok >= STAR_NEED && !r.t) r.t = Date.now();
      S[n] = r; store.set(K.star, S);
    },
    term(en, known) {
      const T = journal.terms(); const k = String(en).toLowerCase();
      if (known) T[k] = T[k] || Date.now(); else delete T[k];
      store.set(K.terms, T);
    },
    examDone(range, ok, tot) {
      const E = journal.exam(); E.push({ t: Date.now(), range, ok, tot });
      store.set(K.exam, E.slice(-30));
    },
    rate(key, v) {
      const S = journal.self(); const r = S[key] || {};
      if (r.b == null) { r.b = v; r.bt = Date.now(); }
      r.n = v; r.nt = Date.now(); S[key] = r; store.set(K.self, S);
    },
    keys: K,
  };

  /* 互動實驗：操作達門檻自動記為「已探索」 */
  function trackLabs(wid) {
    const labs = [...document.querySelectorAll(".lab")];
    const done = journal.labs()[wid] || {};
    labs.forEach((lab, i) => { if (!lab.id) lab.id = "lab-" + (i + 1); });
    if (/^#lab-\d$/.test(location.hash)) { const t = document.querySelector(location.hash); if (t) setTimeout(() => t.scrollIntoView({ block: "start" }), 60); }
    labs.forEach((lab, i) => {
      const head = lab.querySelector(".lab-head");
      const tag = document.createElement("span"); tag.className = "explored"; tag.textContent = "✓ 已探索";
      const mark = () => { if (head && !head.contains(tag)) head.appendChild(tag); };
      if (done[i]) { mark(); return; }
      let n = 0, last = 0;
      const hit = () => {
        const now = Date.now(); if (now - last < 500) return; last = now;
        if (++n >= LAB_NEED) { journal.labDone(wid, i); mark(); ["pointerdown", "input", "change", "keydown"].forEach((e) => lab.removeEventListener(e, hit, true)); }
      };
      ["pointerdown", "input", "change", "keydown"].forEach((e) => lab.addEventListener(e, hit, true));
    });
  }

  /* 學習目標自評：第一次評的是「起點」，之後每次更新「現在」 */
  function selfRate(listEl, wid, hint = true) {
    if (!listEl) return;
    if (hint) listEl.insertAdjacentHTML("beforebegin", '<p class="note self-hint">每個目標下面可以替自己評一級。<b>第一次選的是起點</b>，學完再回來更新，進步會畫在<a href="progress.html">課程進度地圖</a>上。</p>');
    const S = journal.self();
    [...listEl.querySelectorAll(":scope > li")].forEach((li, i) => {
      const key = wid + "-" + i, r = S[key] || {};
      const box = document.createElement("div"); box.className = "self";
      const draw = (r) => {
        box.innerHTML = `<span class="self-q">我現在</span>` + SELF_LV.map((t, v) =>
          `<button type="button" data-v="${v + 1}" aria-pressed="${r.n === v + 1}">${t}</button>`).join("") +
          (r.b != null && r.n > r.b ? `<span class="self-up">↑ 比起點進步 ${r.n - r.b} 級</span>` : r.b != null ? `<span class="self-base">起點：${SELF_LV[r.b - 1]}</span>` : "");
        box.querySelectorAll("button").forEach((b) => b.onclick = () => { journal.rate(key, +b.dataset.v); draw(journal.self()[key]); });
      };
      draw(r); li.appendChild(box);
    });
  }

  window.OL = { WEEKS, AXES, wkLabel, connect, link, tools, GALLERY, store, colors, mountChrome, levels, LV, bank, BANK, terms, gallery, lightbox, Stage, trace, fmt, range, seg, check, initPredicts, quiz, shuffle, drill, order, progress, journal, selfRate, SELF_LV, STAR_NEED, clamp, lerp, q4, blurText, blurDraw, esc };

  document.addEventListener("DOMContentLoaded", () => {
    mountChrome(document.body.dataset.chapter || null);
    tools();
    initPredicts();
    const id = document.body.dataset.chapter;
    if (id && /^w\d\d$/.test(id)) {
      trackLabs(id);
      if (!document.body.dataset.noself) selfRate(document.querySelector("ul.goals"), id);
    }
    if (id && BANK[id]) {
      if (document.getElementById("quiz") && BANK[id].quiz) quiz("quiz", id, BANK[id].quiz);
      terms("terms", id);
    }
  });
})();
