/* 視光學實驗（三）— 雙眼視功能模組：Morgan 期望值、判讀、三大準則、AC/A、ZCSBV 繪圖、十種雙眼視異常的模擬個案
   斜位符號：內斜位（eso）為正、外斜位（exo）為負，單位 Δ。 */
(function () {
  "use strict";
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const sgnD = (v) => (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(v).toFixed(2);

  /* ---------- 斜位字串 ---------- */
  function ph(v, style) {
    if (v == null || isNaN(v)) return "—";
    const a = Math.round(Math.abs(v) * 2) / 2;
    if (a < 0.5) return "Ortho";
    if (style === "word") return `${a}Δ ${v < 0 ? "exo" : "eso"}`;
    return `${a}Δ ${v < 0 ? "XP" : "EP"}`;
  }
  function trip(t) { return t.map((x) => (x == null ? "X" : Math.round(x))).join("/"); }

  /* ---------- Morgan 期望值（本課程標準）＋ Carlson & Kurtz 對照 ---------- */
  const NORMS = {
    dlp: { zh: "遠距水平斜位 DLP", dist: "6 m", mean: -1, sd: 2, show: "1Δ XP ±2", unit: "Δ" },
    nlp: { zh: "近距水平斜位 NLP", dist: "40 cm", mean: -3, sd: 3, show: "3Δ XP ±3（老花加 ADD 後約 8Δ XP）", unit: "Δ" },
    aca: { zh: "AC/A（梯度式）", dist: "—", mean: 4, sd: 2, show: "4:1 ±2", unit: "Δ/D" },
    biD: { zh: "遠距 BI（NFV）", dist: "6 m", trip: [null, 7, 4], sd: [null, 3, 2], show: "X / 7 / 4" },
    boD: { zh: "遠距 BO（PFV）", dist: "6 m", trip: [9, 19, 10], sd: [4, 8, 4], show: "9 / 19 / 10" },
    biN: { zh: "近距 BI（NFV）", dist: "40 cm", trip: [13, 21, 13], sd: [4, 4, 5], show: "13 / 21 / 13" },
    boN: { zh: "近距 BO（PFV）", dist: "40 cm", trip: [17, 21, 11], sd: [5, 6, 7], show: "17 / 21 / 11" },
    nra: { zh: "NRA 負相對調節", dist: "40 cm", mean: 2.0, sd: 0.5, show: "+2.00 ±0.50", unit: "D" },
    pra: { zh: "PRA 正相對調節", dist: "40 cm", mean: -2.37, sd: 1.0, show: "−2.37 ±1.00", unit: "D" },
    vf: { zh: "聚散靈活度（3BI/12BO）", dist: "40 cm", mean: 15, sd: 3, show: "15 cpm", unit: "cpm" },
    npc: { zh: "NPC 破裂／回復", dist: "—", show: "破裂 ≤ 5 cm／回復 ≤ 7 cm（臨床切點）", cut: [5, 7] },
    vert: { zh: "垂直斜位", dist: "6 m／40 cm", show: "Ortho；≥ 2Δ 具臨床意義" },
    vv: { zh: "垂直聚散 supra／infra", dist: "40 cm", show: "3–4 / 2（break / recovery）" },
    st: { zh: "立體視（Titmus Wirt rings）", dist: "40 cm", show: "≤ 40 秒角" },
  };
  const hofMin = (age) => 15 - 0.25 * age;

  /* 判讀：回傳 "lo" / "ok" / "hi"。斜位以「偏內／偏外」標 hi／lo（外斜位過大＝lo，內斜位過大＝hi） */
  function judge(key, v, extra) {
    const n = NORMS[key];
    if (v == null || isNaN(v)) return "na";
    if (key === "amp") return v < hofMin(extra) ? "lo" : "ok";
    if (key === "pra") { const m = Math.abs(v); return m < Math.abs(n.mean) - n.sd ? "lo" : m > Math.abs(n.mean) + n.sd ? "hi" : "ok"; }
    if (key === "vf") return v < n.mean - n.sd ? "lo" : "ok";
    if (n.mean != null) return v < n.mean - n.sd ? "lo" : v > n.mean + n.sd ? "hi" : "ok";
    return "na";
  }
  /* 聚散範圍三個數字逐一判讀（只判低於期望值；破裂 < 期望一半 → 明顯不足） */
  function judgeTrip(key, t) {
    const n = NORMS[key];
    return t.map((v, i) => {
      if (n.trip[i] == null) return v == null ? "ok" : "na";
      if (v == null) return "lo";
      if (i === 1 && v < n.trip[1] / 2) return "lo2";
      return v < n.trip[i] - n.sd[i] ? "lo" : "ok";
    });
  }

  /* ---------- AC/A 與三大準則 ---------- */
  const calcACA = (pdcm, hd, hn, d = 0.4) => pdcm + d * (hn - hd);
  const gradACA = (h0, h1, lens) => (h1 - h0) / lens;          // lens 以「加入的鏡片度數」帶入：加 −1.00 → lens = −1 時要取絕對值的方向，見說明
  /* Sheard：外斜位用 BO 模糊（正融像儲備），內斜位用 BI 模糊。回傳所需稜鏡（≤0 表示不需要） */
  const sheard = (phAbs, reserve) => (2 * phAbs - reserve) / 3;
  /* Percival：G 較大側、L 較小側（皆為模糊點，相對於需求點量起） */
  const percival = (a, b) => { const G = Math.max(a, b), L = Math.min(a, b); return G / 3 - 2 * L / 3; };
  /* 1:1：內斜位量與 BI 回復點 */
  const oneToOne = (eso, biRec) => (eso - biRec) / 2;

  /* ---------- ZCSBV 繪圖 ----------
     d: { pd(cm), dlp, nlp, biD:[b,br,r], boD, biN, boN, nra, pra, amp, near(D) }
     o: { demand, phoria, breaks, nrapra, percival, sheard, xmin, xmax, ymax, label } */
  function zplot(svg, d, o = {}) {
    const W = 600, H = 400, ml = 46, mr = 14, mt = 16, mb = 40;
    const near = d.near || 2.5, dN = d.pd * near;
    const xmin = o.xmin != null ? o.xmin : -20, xmax = o.xmax != null ? o.xmax : 45;
    const ymax = o.ymax || Math.min(14, Math.max(8, Math.ceil((d.amp || 8) + 1)));
    const X = (x) => ml + (x - xmin) / (xmax - xmin) * (W - ml - mr);
    const Y = (y) => H - mb - y / ymax * (H - mt - mb);
    let g = "";
    // 格線
    for (let x = Math.ceil(xmin / 5) * 5; x <= xmax; x += 5) g += `<line x1="${X(x)}" x2="${X(x)}" y1="${Y(0)}" y2="${Y(ymax)}" stroke="var(--grid)" stroke-width="${x === 0 ? 1.6 : 1}"/>${x % 10 === 0 ? `<text x="${X(x)}" y="${Y(0) + 16}" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="var(--font-mono)">${x}</text>` : ""}`;
    for (let y = 0; y <= ymax; y += 1) g += `<line x1="${X(xmin)}" x2="${X(xmax)}" y1="${Y(y)}" y2="${Y(y)}" stroke="var(--grid)"/><text x="${ml - 6}" y="${Y(y) + 4}" text-anchor="end" font-size="11" fill="var(--muted)" font-family="var(--font-mono)">${y}</text>`;
    g += `<text x="${(ml + W - mr) / 2}" y="${H - 6}" text-anchor="middle" font-size="12" fill="var(--muted)">聚散刺激（Δ）　← 開散（BI）　｜　內聚（BO）→</text>`;
    g += `<text x="12" y="${(mt + H - mb) / 2}" font-size="12" fill="var(--muted)" transform="rotate(-90 12 ${(mt + H - mb) / 2})" text-anchor="middle">調節刺激（D）</text>`;
    g += `<line x1="${X(xmin)}" x2="${X(xmax)}" y1="${Y(near)}" y2="${Y(near)}" stroke="var(--muted)" stroke-dasharray="2 4"/><text x="${X(xmax) - 4}" y="${Y(near) - 4}" text-anchor="end" font-size="11" fill="var(--muted)">40 cm（${near.toFixed(2)} D）</text>`;
    // 邊界：模糊點（沒有就用破裂點）
    const pick = (t) => (t[0] != null ? t[0] : t[1]);
    const L0 = -pick(d.biD), R0 = pick(d.boD), L1 = dN - pick(d.biN), R1 = dN + pick(d.boN);
    const at = (x0, x1, y) => x0 + (x1 - x0) * y / near;
    const top = d.amp || ymax;
    const poly = [[at(L0, L1, 0), 0], [at(L0, L1, top), top], [at(R0, R1, top), top], [at(R0, R1, 0), 0]];
    g += `<path d="M${poly.map((p) => X(p[0]) + " " + Y(p[1])).join(" L")} Z" fill="var(--accent)" fill-opacity=".12" stroke="var(--accent)" stroke-width="2.2"/>`;
    if (o.breaks !== false) {
      const bl0 = -d.biD[1], bl1 = dN - d.biN[1], br0 = d.boD[1], br1 = dN + d.boN[1];
      g += `<path d="M${X(at(bl0, bl1, 0))} ${Y(0)} L${X(at(bl0, bl1, top))} ${Y(top)} M${X(at(br0, br1, 0))} ${Y(0)} L${X(at(br0, br1, top))} ${Y(top)}" stroke="var(--accent)" stroke-dasharray="6 5" fill="none" opacity=".7"/>`;
    }
    g += `<line x1="${X(xmin)}" x2="${X(xmax)}" y1="${Y(top)}" y2="${Y(top)}" stroke="var(--warn)" stroke-width="2"/><text x="${X(xmin) + 4}" y="${Y(top) - 5}" font-size="11" fill="var(--warn)">調節幅度 ${top.toFixed(2)} D</text>`;
    // 需求線（Donders line）
    if (o.demand !== false) {
      const yt = Math.min(ymax, (xmax - 1) / d.pd);
      g += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(d.pd * yt)}" y2="${Y(yt)}" stroke="var(--ray)" stroke-width="2"/><text x="${X(d.pd * Math.min(yt, top + 0.6)) + 6}" y="${Y(Math.min(yt, top + 0.6))}" font-size="11" fill="var(--ray)">需求線</text>`;
      g += `<circle cx="${X(dN)}" cy="${Y(near)}" r="4" fill="var(--ray)"/>`;
    }
    // 斜位線
    if (o.phoria !== false && d.dlp != null && d.nlp != null) {
      const p0 = [d.dlp, 0], p1 = [dN + d.nlp, near], sl = (p1[0] - p0[0]) / near;
      const yt = Math.min(ymax, top);
      g += `<line x1="${X(p0[0])}" y1="${Y(0)}" x2="${X(p0[0] + sl * yt)}" y2="${Y(yt)}" stroke="var(--ray-3)" stroke-width="2" stroke-dasharray="8 4"/>`;
      g += `<circle cx="${X(p0[0])}" cy="${Y(0)}" r="5" fill="var(--surface)" stroke="var(--ray-3)" stroke-width="2.4"/><circle cx="${X(p1[0])}" cy="${Y(near)}" r="5" fill="var(--surface)" stroke="var(--ray-3)" stroke-width="2.4"/>`;
      g += `<text x="${X(p0[0] + sl * yt) + 6}" y="${Y(yt) + 12}" font-size="11" fill="var(--ray-3)">斜位線</text>`;
    }
    if (o.nrapra !== false && d.nra != null) {
      const yn = near - d.nra, yp = near + Math.abs(d.pra);
      [[yn, "NRA"], [yp, "PRA"]].forEach(([y, t]) => { if (y >= 0 && y <= ymax) g += `<path d="M${X(dN) - 6} ${Y(y)} L${X(dN) + 6} ${Y(y)} M${X(dN)} ${Y(y) - 6} L${X(dN)} ${Y(y) + 6}" stroke="var(--ray-2)" stroke-width="2.4"/><text x="${X(dN) + 9}" y="${Y(y) + 4}" font-size="11" fill="var(--ray-2)">${t}</text>`; });
    }
    if (o.percival) {
      const a = L1, b = R1, t1 = a + (b - a) / 3, t2 = a + 2 * (b - a) / 3;
      g += `<rect x="${X(t1)}" y="${Y(near) - 7}" width="${X(t2) - X(t1)}" height="14" fill="var(--ok)" opacity=".28"/><text x="${(X(t1) + X(t2)) / 2}" y="${Y(near) + 22}" text-anchor="middle" font-size="11" fill="var(--ok)">中間三分之一</text>`;
    }
    if (o.sheard && d.nlp != null) {
      const p = dN + d.nlp, exo = d.nlp < 0;
      const far = exo ? R1 : L1;
      g += `<path d="M${X(dN)} ${Y(near) + 12} H${X(p)}" stroke="var(--bad)" stroke-width="3"/><path d="M${X(p)} ${Y(near) - 12} H${X(far)}" stroke="var(--ok)" stroke-width="3"/>`;
      g += `<text x="${(X(dN) + X(p)) / 2}" y="${Y(near) + 26}" text-anchor="middle" font-size="11" fill="var(--bad)">需求（斜位）</text><text x="${(X(p) + X(far)) / 2}" y="${Y(near) - 18}" text-anchor="middle" font-size="11" fill="var(--ok)">儲備</text>`;
    }
    if (o.extra) g += o.extra(X, Y);
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.innerHTML = g;
    return { X, Y, dN, L1, R1, L0, R0 };
  }

  /* ---------- 十種雙眼視功能異常（Scheiman & Wick 分類，配合講義 W15 表格） ---------- */
  const DX = [
    { id: "nl", zh: "雙眼視功能正常", en: "Normal", grp: "—" },
    { id: "ci", zh: "聚合不足 CI", en: "Convergence insufficiency", grp: "聚散" },
    { id: "ce", zh: "聚合過度 CE", en: "Convergence excess", grp: "聚散" },
    { id: "di", zh: "開散不足 DI", en: "Divergence insufficiency", grp: "聚散" },
    { id: "de", zh: "開散過度 DE", en: "Divergence excess", grp: "聚散" },
    { id: "bx", zh: "基本型外斜位", en: "Basic exophoria", grp: "聚散" },
    { id: "be", zh: "基本型內斜位", en: "Basic esophoria", grp: "聚散" },
    { id: "fvd", zh: "融像聚散功能不良 FVD", en: "Fusional vergence dysfunction", grp: "聚散" },
    { id: "ai", zh: "調節不足 AI", en: "Accommodative insufficiency", grp: "調節" },
    { id: "ae", zh: "調節過度 AE", en: "Accommodative excess", grp: "調節" },
    { id: "if", zh: "調節靈活度不良", en: "Accommodative infacility", grp: "調節" },
  ];
  const KEY = {
    nl: "各項數值都落在期望值內，需求點位在區域中間。",
    ci: "近距高度外斜位、遠距正常 → AC/A 低；NPC 後退；近距 BO（PFV）低；NRA 低（間接 PFV）；翻轉鏡卡在 ＋ 側。",
    ce: "近距內斜位、遠距正常 → AC/A 高；近距 BI（NFV）低；PRA 低（間接 NFV）；翻轉鏡卡在 − 側。",
    di: "遠距內斜位大於近距 → AC/A 低；遠距 BI 低；遠距複視（開車、看電視）。",
    de: "遠距高度外斜位（常為間歇性外斜視）、近距接近正常 → AC/A 高；看遠瞇眼、遮一眼。",
    bx: "遠近外斜位量相近 → AC/A 正常；遠近 BO 都低；NRA 低。",
    be: "遠近內斜位量相近 → AC/A 正常；遠近 BI 都低；PRA 低。",
    fvd: "斜位與 AC/A 都正常，但 BI、BO 兩側範圍都窄；NRA、PRA 都偏低；聚散靈活度差。",
    ai: "調節幅度低於 Hofstetter 最小值；PRA 低；翻轉鏡 − 側困難；NPA 遠。",
    ae: "調節幅度正常；NRA 低；翻轉鏡 ＋ 側困難；近距工作後看遠模糊。",
    if: "調節幅度正常，但翻轉鏡兩側都慢（cpm 低）；NRA、PRA 可正常或偏低。",
  };
  const MGMT = {
    nl: "不需雙眼視處置；依屈光結果配鏡即可。",
    ci: "首選聚散視覺訓練（推進運動、Brock string、聚散卡）；近距 BI 稜鏡為輔。加入度（ADD）通常無效（AC/A 低）。",
    ce: "近用正球面加入度（AC/A 高，效果好）；可配合 NFV 訓練。",
    di: "遠距 BO 稜鏡；先排除神經性病因（新發生的遠距內斜要轉介）。",
    de: "視覺訓練、必要時負度過矯（AC/A 高）；間歇性外斜視需追蹤，轉介斜視評估。",
    bx: "視覺訓練（PFV）、BI 稜鏡；負度過矯可輔助。",
    be: "BO 稜鏡、NFV 訓練；先完整矯正遠視。",
    fvd: "聚散訓練（BI 與 BO 兩側都練，重點在靈活度）；稜鏡通常無效。",
    ai: "近用正球面加入度、調節訓練（翻轉鏡、Hart chart）；先排除全身／藥物因素。",
    ae: "調節放鬆訓練（＋ 側翻轉鏡）；近用加入度可輔助；排除調節痙攣與未矯正的遠視。",
    if: "調節靈活度訓練（± 翻轉鏡）。",
  };
  const CC = {
    nl: "想做例行的雙眼視功能檢查，沒有特別不舒服。",
    ci: "看電腦或讀書一小時左右就頭痛、眼睛很累，字有時會跑來跑去、疊在一起。",
    ce: "看書看久了會模糊，抬頭看遠要一下子才清楚，下午常常頭痛。",
    di: "晚上開車看遠方的車燈會變成兩個，看近反而沒事。",
    de: "家人說我發呆看遠的時候一隻眼睛會飄出去；在戶外陽光下常會閉一隻眼。",
    bx: "看遠看近都覺得眼睛累，看久了字會飄。",
    be: "看遠看近都容易累，偶爾覺得東西有點重影。",
    fvd: "看東西一久就累，說不上來哪裡不對，看遠看近都一樣。",
    ai: "看近的字要拿遠一點才清楚，看書很快就累、模糊。",
    ae: "上完一整天課，抬頭看黑板會模糊一陣子，眼睛酸。",
    if: "看黑板再低頭看筆記，字要過一下子才會清楚。",
  };

  /* 產生一個模擬個案。r：亂數（OBPractice.makeR 或 Math.random 包裝） */
  function genCase(id, R) {
    const rnd = R || Math.random;
    const u = (a, b) => a + (b - a) * rnd();
    const i = (a, b) => Math.round(u(a, b));
    const q4 = (v) => Math.round(v * 4) / 4;
    const age = i(19, 34), pd = Math.round(u(5.8, 6.6) * 10) / 10;
    const c = {
      dx: id, age, pd, dlp: -i(0, 2), nlp: -i(2, 5), aca: i(3, 5),
      biD: [null, i(6, 9), i(3, 5)], boD: [i(8, 12), i(17, 22), i(9, 12)],
      biN: [i(12, 16), i(19, 23), i(12, 15)], boN: [i(15, 20), i(20, 25), i(10, 14)],
      nra: q4(u(1.75, 2.5)), pra: -q4(u(2.0, 3.0)), amp: q4(hofMin(age) + u(2, 5)),
      npc: (() => { const b = i(2, 4); return [b, b + i(1, 3)]; })(), vf: i(13, 18), baf: "兩側都順", vert: 0, cc: CC[id],
    };
    switch (id) {
      case "ci": c.dlp = -i(0, 1); c.nlp = -i(10, 14); c.aca = rnd() < 0.5 ? 1 : 1.5; c.boN = [i(5, 8), i(9, 12), i(3, 6)]; c.nra = q4(u(0.75, 1.25)); { const b = i(9, 14); c.npc = [b, b + i(2, 4)]; } c.vf = i(6, 9); c.baf = "卡在 ＋2.00 側"; break;
      case "ce": c.dlp = -i(0, 1); c.nlp = i(5, 9); c.aca = i(7, 9); c.biN = [i(4, 7), i(8, 11), i(3, 6)]; c.pra = -q4(u(0.75, 1.25)); c.vf = i(6, 9); c.baf = "卡在 −2.00 側"; break;
      case "di": c.dlp = i(6, 9); c.nlp = -i(0, 1); c.aca = rnd() < 0.5 ? 1 : 1.5; c.biD = [null, i(1, 3), i(0, 1)]; break;
      case "de": c.dlp = -i(13, 18); c.nlp = -i(2, 4); c.aca = i(7, 8); c.boD = [i(3, 6), i(9, 12), i(3, 6)]; break;
      case "bx": c.dlp = -i(7, 9); c.nlp = -i(8, 10); c.aca = i(4, 5); c.boD = [i(3, 5), i(8, 10), i(3, 5)]; c.boN = [i(6, 9), i(11, 14), i(4, 7)]; c.nra = q4(u(1.0, 1.25)); c.baf = "卡在 ＋2.00 側"; break;
      case "be": c.dlp = i(5, 7); c.nlp = i(6, 8); c.aca = i(4, 5); c.biD = [null, i(1, 3), i(0, 2)]; c.biN = [i(4, 7), i(8, 11), i(3, 6)]; c.pra = -q4(u(0.75, 1.25)); c.baf = "卡在 −2.00 側"; break;
      case "fvd": c.biD = [null, i(3, 4), i(1, 2)]; c.boD = [i(4, 6), i(8, 11), i(4, 6)]; c.biN = [i(6, 9), i(10, 13), i(5, 8)]; c.boN = [i(7, 10), i(11, 14), i(5, 7)]; c.nra = q4(u(1.0, 1.25)); c.pra = -q4(u(1.0, 1.25)); c.vf = i(5, 8); c.baf = "兩側都慢"; break;
      case "ai": c.amp = q4(hofMin(age) - u(2, 4)); c.pra = -q4(u(0.5, 1.0)); c.nlp = -i(1, 3); c.baf = "卡在 −2.00 側"; c.maf = "−2.00 側很慢"; break;
      case "ae": c.nra = q4(u(0.75, 1.25)); c.nlp = -i(0, 2); c.baf = "卡在 ＋2.00 側"; c.maf = "＋2.00 側很慢"; break;
      case "if": c.baf = "兩側都慢"; c.maf = "兩側都慢"; break;
    }
    c.maf = c.maf || "兩側都順";
    ["dlp", "nlp"].forEach((k) => { if (Object.is(c[k], -0)) c[k] = 0; });
    return c;
  }

  /* 把一個個案整理成「檢查數據表」HTML（含高於／符合／低於期望值標記） */
  const MK = { ok: '<span class="mk ok">符合</span>', lo: '<span class="mk lo">低於</span>', lo2: '<span class="mk lo">低於一半</span>', hi: '<span class="mk hi">高於</span>', na: '<span class="mk na">—</span>' };
  function phJudge(key, v) {
    const n = NORMS[key];
    if (v < n.mean - n.sd) return '<span class="mk lo">外斜偏大</span>';
    if (v > n.mean + n.sd) return '<span class="mk hi">內斜偏大</span>';
    return MK.ok;
  }
  function tripMk(key, t) { const j = judgeTrip(key, t); return j.some((x) => x === "lo2") ? MK.lo2 : j.some((x) => x === "lo") ? MK.lo : MK.ok; }
  function table(c, o = {}) {
    const marks = o.marks !== false;
    const rows = [
      ["遠距斜位", ph(c.dlp), NORMS.dlp.show, marks ? phJudge("dlp", c.dlp) : ""],
      ["近距斜位", ph(c.nlp), NORMS.nlp.show.replace(/（.*）/, ""), marks ? phJudge("nlp", c.nlp) : ""],
      ["AC/A（梯度式）", c.aca + " : 1", NORMS.aca.show, marks ? MK[judge("aca", c.aca)] : ""],
      ["遠距 BI", trip(c.biD), NORMS.biD.show, marks ? tripMk("biD", c.biD) : ""],
      ["遠距 BO", trip(c.boD), NORMS.boD.show, marks ? tripMk("boD", c.boD) : ""],
      ["近距 BI", trip(c.biN), NORMS.biN.show, marks ? tripMk("biN", c.biN) : ""],
      ["近距 BO", trip(c.boN), NORMS.boN.show, marks ? tripMk("boN", c.boN) : ""],
      ["NRA", sgnD(c.nra), NORMS.nra.show, marks ? MK[judge("nra", c.nra)] : ""],
      ["PRA", sgnD(c.pra), NORMS.pra.show, marks ? MK[judge("pra", c.pra)] : ""],
      ["調節幅度", c.amp.toFixed(2) + " D", `Hofstetter 最小值 ${hofMin(c.age).toFixed(2)} D`, marks ? MK[judge("amp", c.amp, c.age)] : ""],
      ["NPC", `${c.npc[0]} / ${c.npc[1]} cm`, NORMS.npc.show.replace("（臨床切點）", ""), marks ? (c.npc[0] > 5 || c.npc[1] > 7 ? '<span class="mk lo">後退</span>' : MK.ok) : ""],
      ["聚散靈活度", c.vf + " cpm", "15 cpm", marks ? MK[judge("vf", c.vf)] : ""],
      ["雙眼調節靈活度（±2.00）", c.baf, "兩側都順", marks ? (c.baf === "兩側都順" ? MK.ok : '<span class="mk lo">異常</span>') : ""],
      ["單眼調節靈活度（±2.00）", c.maf, "兩側都順", marks ? (c.maf === "兩側都順" ? MK.ok : '<span class="mk lo">異常</span>') : ""],
    ];
    return `<div class="dt-wrap"><table class="dt"><tr><th>檢查</th><th>結果</th><th>期望值</th>${marks ? "<th>判讀</th>" : ""}</tr>${rows.map((r) => `<tr><td>${r[0]}</td><td class="v">${r[1]}</td><td class="n">${r[2]}</td>${marks ? `<td>${r[3]}</td>` : ""}</tr>`).join("")}</table></div>`;
  }

  window.BINO = { NORMS, hofMin, judge, judgeTrip, ph, trip, sgnD, f1, calcACA, gradACA, sheard, percival, oneToOne, zplot, DX, KEY, MGMT, CC, genCase, table };
})();
