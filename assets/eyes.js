/* 視光學實驗（三）— 眼睛繪圖模組（純 SVG 字串，無外部相依）
   EYES.front(svg, st)：受檢者正面（檢查者看過去）。用於瞳孔、Hirschberg、EOM、遮蓋測試、稜鏡棒。
   EYES.top(svg, st)  ：由上往下看的兩眼與視軸。用於 NPC、Kappa、斜位幾何。
   座標約定（正面圖）：
     · 受檢者的右眼 OD 畫在畫面左邊，左眼 OS 畫在畫面右邊（檢查者面對受檢者）。
     · h（度）＞0：眼睛轉向「畫面右方」＝受檢者的左方。v（度）＞0：向上。
     · EYES.out(eye) 回傳「顳側（外轉）」在畫面上的正負號：OD → −1、OS → +1。 */
(function () {
  "use strict";
  const R_PUP = 10, R_CC = 5.7;           // 旋轉中心到瞳孔面、到角膜曲率中心的距離（mm）→ 1 mm 反光偏移 ≈ 22Δ
  const out = (eye) => (eye === "od" ? -1 : 1);
  const nas = (eye) => -out(eye);
  const sin = (d) => Math.sin(d * Math.PI / 180);
  const f = (n) => Math.round(n * 10) / 10;

  function front(svg, st) {
    const s = Object.assign({ scale: 7, pd: 64, W: null, H: null, light: false, cover: null, see: false, epi: 0, pinch: false, labels: true,
      od: {}, os: {}, kappa: { od: 0, os: 0 }, prism: [], marks: false, face: true, gaze: null, lidcol: null }, st);
    const k = s.scale, W = s.W || Math.round((s.pd + 36) * k), H = s.H || Math.round(31 * k), cy = H / 2 + 4;
    const C = { od: W / 2 - s.pd / 2 * k, os: W / 2 + s.pd / 2 * k };
    let g = "", defs = "";
    if (s.face) {
      g += `<rect x="${f(C.od - 17.5 * k)}" y="${f(cy - 14 * k)}" width="${f(C.os - C.od + 35 * k)}" height="${f(28 * k)}" rx="${f(10 * k)}" fill="var(--skin)"/>`;
      g += `<path d="M${W / 2 - 3.2 * k} ${cy - 3 * k} C ${W / 2 - 3.6 * k} ${cy + 4 * k}, ${W / 2 - 4.2 * k} ${cy + 8 * k}, ${W / 2 - 4.8 * k} ${cy + 12 * k} M${W / 2 + 3.2 * k} ${cy - 3 * k} C ${W / 2 + 3.6 * k} ${cy + 4 * k}, ${W / 2 + 4.2 * k} ${cy + 8 * k}, ${W / 2 + 4.8 * k} ${cy + 12 * k}" fill="none" stroke="var(--skin-line)" stroke-width="1.2" opacity=".35"/>`;
    }
    ["od", "os"].forEach((eye) => {
      const e = Object.assign({ h: 0, v: 0, pupil: 4, lid: 0 }, s[eye]);
      const cx = C[eye], hw = 14.5 * k, up = 5.6 * k, dn = 4.6 * k, nx = nas(eye);
      const inner = cx + nx * hw, outer = cx - nx * hw;
      const lidDrop = e.lid * 6 * k;
      const fiss = `M${f(inner)} ${f(cy + 0.6 * k)} Q ${f(cx)} ${f(cy - 2 * up + lidDrop)} ${f(outer)} ${f(cy - 0.8 * k)} Q ${f(cx)} ${f(cy + 2 * dn)} ${f(inner)} ${f(cy + 0.6 * k)} Z`;
      const id = "fis-" + eye + "-" + (svg.id || "x");
      defs += `<clipPath id="${id}"><path d="${fiss}"/></clipPath>`;
      const px = cx + R_PUP * sin(e.h) * k, py = cy - R_PUP * sin(e.v) * k;
      const iris = 5.9 * k, pr = Math.max(0.6, e.pupil / 2) * k;
      let inside = `<rect x="${f(cx - 16 * k)}" y="${f(cy - 9 * k)}" width="${f(32 * k)}" height="${f(18 * k)}" fill="var(--sclera)"/>`;
      inside += `<circle cx="${f(px)}" cy="${f(py)}" r="${f(iris)}" fill="url(#irg-${svg.id || "x"})" stroke="var(--iris-edge)" stroke-width="${f(0.35 * k)}"/>`;
      inside += `<circle cx="${f(px)}" cy="${f(py)}" r="${f(pr)}" fill="#0b0d0e"/>`;
      if (s.light) {
        const kap = (s.kappa[eye] || 0) * nx;
        const rx = cx + (R_CC * sin(e.h) + kap) * k, ry = cy - R_CC * sin(e.v) * k;
        inside += `<circle cx="${f(rx)}" cy="${f(ry)}" r="${f(0.75 * k)}" fill="#fff" opacity=".35"/><circle cx="${f(rx)}" cy="${f(ry)}" r="${f(0.42 * k)}" fill="#fff"/>`;
      }
      if (s.marks) inside += `<path d="M${f(px - iris)} ${f(py)} H${f(px + iris)} M${f(px)} ${f(py - iris)} V${f(py + iris)}" stroke="#7fd3ee" stroke-width="1.2" stroke-dasharray="3 3" opacity=".95"/>`;
      g += `<g clip-path="url(#${id})">${inside}</g>`;
      g += `<path d="${fiss}" fill="none" stroke="var(--skin-line)" stroke-width="${f(0.45 * k)}"/>`;
      g += `<path d="M${f(inner - nx * 0.5 * k)} ${f(cy - 2.4 * k)} Q ${f(cx)} ${f(cy - 2 * up - 3 * k + lidDrop * 0.6)} ${f(outer + nx * 1.5 * k)} ${f(cy - 3.4 * k)}" fill="none" stroke="var(--skin-line)" stroke-width="1.2" opacity=".55"/>`;
      if (s.epi > 0 && !s.pinch) {
        const ew = s.epi * 4.2 * k, xi = inner;
        const p0 = [xi - nx * 0.6 * k, cy - 4.3 * k], c1 = [xi - nx * (ew + 1.2 * k), cy - 1.2 * k], p2 = [xi - nx * 0.2 * k, cy + 3.4 * k];
        g += `<path d="M${f(p0[0])} ${f(p0[1])} Q ${f(c1[0])} ${f(c1[1])} ${f(p2[0])} ${f(p2[1])} L${f(xi + nx * 2.5 * k)} ${f(cy + 4.6 * k)} L${f(xi + nx * 2.5 * k)} ${f(cy - 5 * k)} Z" fill="var(--skin)"/>`;
        g += `<path d="M${f(p0[0])} ${f(p0[1])} Q ${f(c1[0])} ${f(c1[1])} ${f(p2[0])} ${f(p2[1])}" fill="none" stroke="var(--skin-line)" stroke-width="${f(0.4 * k)}" stroke-linecap="round"/>`;
      }
      if (s.labels) g += `<text x="${f(cx)}" y="${f(cy + 13.5 * k)}" text-anchor="middle" font-size="12" fill="var(--muted)" font-family="var(--font-mono)">${eye === "od" ? "OD（右眼）" : "OS（左眼）"}</text>`;
      (s.prism || []).filter((p) => p.eye === eye).forEach((p) => {
        g += `<g opacity=".9"><rect x="${f(cx - 11 * k)}" y="${f(cy - 11 * k)}" width="${f(22 * k)}" height="${f(22 * k)}" rx="4" fill="var(--glass)" stroke="var(--glass-edge)" stroke-width="1.5"/>` +
          `<text x="${f(cx)}" y="${f(cy - 12.6 * k)}" text-anchor="middle" font-size="13" font-weight="700" fill="var(--glass-edge)" font-family="var(--font-mono)">${p.txt}</text></g>`;
      });
      if (s.cover === eye) {
        const op = s.see ? 0.38 : 0.94;
        g += `<g><rect x="${f(cx - 15 * k)}" y="${f(cy - 12 * k)}" width="${f(30 * k)}" height="${f(24 * k)}" rx="${f(5 * k)}" fill="var(--occ)" opacity="${op}" ${s.see ? 'stroke="var(--ink)" stroke-dasharray="5 4"' : ""}/>` +
          `<rect x="${f(cx - 2.2 * k)}" y="${f(cy + 12 * k)}" width="${f(4.4 * k)}" height="${f(14 * k)}" rx="3" fill="var(--occ)" opacity="${Math.min(1, op + 0.05)}"/></g>`;
      }
    });
    if (s.gaze) g += `<g><circle cx="${f(s.gaze[0])}" cy="${f(s.gaze[1])}" r="9" fill="#ffe58a" stroke="#c99a00" stroke-width="2"/><circle cx="${f(s.gaze[0])}" cy="${f(s.gaze[1])}" r="3.5" fill="#fff"/></g>`;
    const irg = `<radialGradient id="irg-${svg.id || "x"}"><stop offset="0" stop-color="var(--iris-in)"/><stop offset=".7" stop-color="var(--iris)"/><stop offset="1" stop-color="var(--iris-out)"/></radialGradient>`;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.innerHTML = `<defs>${irg}${defs}</defs>${g}`;
    return { C, cy, k };
  }

  /* 由上往下看：兩眼（圓）、視線、目標。st: { pd(mm), d(cm, 目標距離), od, os（度，+ 為內轉／向鼻側）；odAim/osAim：對準目標（畫面幾何），odDev/osDev：在對準之外再偏幾度, W, H, scale(px/mm 眼睛), dscale(px/cm 距離) } */
  function top(svg, st) {
    const s = Object.assign({ W: 520, H: 300, pd: 64, d: 40, od: 0, os: 0, eyeR: 12, k: 2.2, dk: 6, target: true, labels: true, lineLen: null, extra: "" }, st);
    const W = s.W, ey = s.H - 50, k = s.k;
    const xo = W / 2 - s.pd / 2 * k, xs = W / 2 + s.pd / 2 * k;
    const ty = ey - s.d * s.dk;
    let g = "";
    const L = s.lineLen || Math.max(60, (ey - ty) * 1.25);
    [["od", xs, -1], ["os", xo, 1]].forEach(([eye, x, inw]) => {   // 由上往下看、受檢者面朝畫面上方：右眼在畫面右邊
      const aim = Math.atan2(s.pd / 2 * k, ey - ty);   // 畫面上真正對準目標的角度
      const a = (s[eye + "Aim"] ? aim + (s[eye + "Dev"] || 0) * Math.PI / 180 : s[eye] * Math.PI / 180) * inw;      // 正值＝內轉（朝中線）
      const dx = Math.sin(a), dy = -Math.cos(a);
      g += `<line x1="${f(x)}" y1="${f(ey)}" x2="${f(x + dx * L)}" y2="${f(ey + dy * L)}" stroke="${eye === "od" ? "var(--ray)" : "var(--ray-2)"}" stroke-width="1.6" stroke-dasharray="${s.dash && s.dash[eye] ? "6 5" : "none"}"/>`;
      g += `<circle cx="${f(x)}" cy="${f(ey)}" r="${f(s.eyeR * k)}" fill="var(--sclera)" stroke="var(--line)" stroke-width="1.5"/>`;
      g += `<circle cx="${f(x + dx * s.eyeR * k * 0.92)}" cy="${f(ey + dy * s.eyeR * k * 0.92)}" r="${f(5 * k * 0.55)}" fill="var(--iris)"/>`;
      if (s.labels) g += `<text x="${f(x)}" y="${f(ey + s.eyeR * k + 16)}" text-anchor="middle" font-size="12" fill="var(--muted)" font-family="var(--font-mono)">${eye.toUpperCase()}</text>`;
    });
    if (s.target) g += `<g><circle cx="${W / 2}" cy="${f(ty)}" r="6" fill="var(--accent)"/><text x="${W / 2 + 12}" y="${f(ty + 4)}" font-size="12" fill="var(--accent)">${s.tlabel || "目標"}</text></g>`;
    svg.setAttribute("viewBox", `0 0 ${W} ${s.H}`);
    svg.innerHTML = g + s.extra;
    return { xo, xs, ey, ty, k };
  }

  /* 平滑動畫：tween(obj, to, ms, onFrame, done) — obj 的數值欄位逐格逼近 to */
  function tween(obj, to, ms, onFrame, done) {
    const from = {}; Object.keys(to).forEach((key) => from[key] = obj[key]);
    const t0 = performance.now();
    if (obj.__raf) cancelAnimationFrame(obj.__raf);
    const step = (t) => {
      const u = Math.min(1, (t - t0) / ms), e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
      Object.keys(to).forEach((key) => obj[key] = from[key] + (to[key] - from[key]) * e);
      onFrame && onFrame();
      if (u < 1) obj.__raf = requestAnimationFrame(step); else { obj.__raf = 0; done && done(); }
    };
    obj.__raf = requestAnimationFrame(step);
  }

  /* 稜鏡度 ↔ 角度 */
  const pd2deg = (p) => Math.atan(p / 100) * 180 / Math.PI;
  const deg2pd = (d) => 100 * Math.tan(d * Math.PI / 180);

  window.EYES = { front, top, tween, out, nas, pd2deg, deg2pd, R_PUP, R_CC };
})();
