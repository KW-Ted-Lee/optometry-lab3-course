/* ★ 必會計算（共 12 項，全部一到兩步）＋各週的延伸計算。數字隨機，原創題。
   star：1–12 對應「★ 必會計算練功房」；0 為延伸練習（不列入精熟統計）。 */
(function () {
  const { define, F } = (typeof window !== "undefined" ? window : globalThis).OBPractice;
  const hof = (age) => 15 - 0.25 * age;
  const phx = (v) => (Math.abs(v) < 0.25 ? "Ortho" : `${Math.abs(v)}Δ ${v < 0 ? "XP" : "EP"}`);
  const ARC = 206265;

  /* ---------- W02 延伸：Amsler 方格張角、立體視差 ---------- */
  define("w02", [
    { id: "2-1", star: 0, title: "延伸：Amsler 方格涵蓋多少視野？", gen(r) {
      const d = r.pick([28, 30, 33, 35]), sq = 5, tot = 100;
      const a1 = 2 * Math.atan(sq / 2 / (d * 10)) * 180 / Math.PI, a2 = 2 * Math.atan(tot / 2 / (d * 10)) * 180 / Math.PI;
      return {
        q: `Amsler 方格總寬 10 cm、每格 5 mm。病人在 <b>${d} cm</b> 處觀看，<b>每一格</b>與<b>整張方格</b>各張開多少度？`,
        parts: [{ label: "每一格", type: "num", ans: a1, unit: "°", dp: 2, tol: 0.03 }, { label: "整張方格", type: "num", ans: a2, unit: "°", dp: 1, tol: 0.2 }],
        steps: [
          { c: "物體寬 s、距離 d 時，張角 θ ＝ 2 × atan(s ÷ 2d)。單位要一致（mm）。", e: `每格：2 × atan(5 ÷ ${2 * d * 10}) ＝ ${a1.toFixed(2)}°` },
          { c: "整張方格同理。在 30 cm 時約 19°，臨床上記成「中心約 20 度」、每格約 1 度。", e: `整張：2 × atan(100 ÷ ${2 * d * 10}) ＝ ${a2.toFixed(1)}°` },
        ],
      };
    } },
    { id: "2-2", star: 0, title: "延伸：深度差多少，才是 40 秒角？", gen(r) {
      const ipd = r.pick([58, 60, 62, 64, 66]), d = r.pick([33, 40, 50]), dd = r.pick([0.3, 0.5, 0.8, 1.0, 1.5, 2.0]);
      const eta = ARC * (ipd / 1000) * (dd / 1000) / Math.pow(d / 100, 2);
      return {
        q: `瞳距 <b>${ipd} mm</b> 的人在 <b>${d} cm</b> 看兩個點，兩點前後差 <b>${dd} mm</b>。兩眼視差（binocular disparity）是幾秒角？`,
        parts: [{ label: "視差 η", type: "num", ans: eta, unit: "″", dp: 0, tol: Math.max(1, eta * 0.02) }],
        steps: [
          { c: "小角度近似：η（弧度）＝ 瞳距 × 深度差 ÷ 距離²，三個量都換成公尺。", e: `η ＝ ${ipd / 1000} × ${dd / 1000} ÷ ${(d / 100).toFixed(2)}² ＝ ${(eta / ARC).toExponential(3)} rad` },
          { c: "1 弧度 ＝ 206265 秒角。", e: `${(eta / ARC).toExponential(3)} × 206265 ＝ ${eta.toFixed(0)}″` },
        ],
      };
    } },
  ]);

  /* ---------- W03 ★1 調節幅度、★2 Hofstetter、★3 聚合需求 ---------- */
  define("w03", [
    { id: "3-1", star: 1, title: "調節幅度 Amp ＝ 100 ÷ NPA（cm）", gen(r) {
      const npa = r.pick([5, 6, 7, 8, 9, 10, 12, 12.5, 15, 20, 25, 40]);
      const amp = 100 / npa;
      return {
        q: `推進法量到右眼調節近點 <b>${npa} cm</b>（受檢者已戴遠用完整矯正）。調節幅度是多少？`,
        parts: [{ label: "Amp", type: "num", ans: amp, unit: "D", dp: 2, tol: 0.02 }],
        steps: [
          { c: "戴完整遠用矯正時遠點在無限遠（0 D），調節幅度就等於近點的聚散度：100 ÷ 公分數。", e: `100 ÷ ${npa} ＝ ${amp.toFixed(2)} D` },
        ],
      };
    } },
    { id: "3-2", star: 2, title: "Hofstetter 最小值：15 − 0.25 × 年齡", gen(r) {
      const age = r.int(18, 55), npa = r.pick([8, 10, 12.5, 15, 20, 25, 33, 40, 50]);
      const mn = hof(age), amp = 100 / npa, low = amp < mn;
      return {
        q: `<b>${age} 歲</b>受檢者，推進法 NPA ＝ <b>${npa} cm</b>。依 Hofstetter 最小值，他的調節幅度是否低於年齡應有值？`,
        parts: [{ label: "Hofstetter 最小值", type: "num", ans: mn, unit: "D", dp: 2, tol: 0.02 }, { label: "實測 Amp", type: "num", ans: amp, unit: "D", dp: 2, tol: 0.02 }, { label: "判讀", type: "choice", opts: ["符合年齡", "低於最小值，懷疑調節不足"], ans: low ? 1 : 0 }],
        steps: [
          { c: "最小值公式（臨床判讀只用這一條）。", e: `15 − 0.25 × ${age} ＝ ${mn.toFixed(2)} D` },
          { c: "實測幅度 ＝ 100 ÷ NPA。", e: `100 ÷ ${npa} ＝ ${amp.toFixed(2)} D` },
          { c: low ? "實測低於最小值 → 懷疑調節不足，接著看 PRA、翻轉鏡 − 側。" : "實測不低於最小值 → 符合年齡。", e: `${amp.toFixed(2)} ${low ? "<" : "≥"} ${mn.toFixed(2)}` },
        ],
      };
    } },
    { id: "3-3", star: 3, title: "聚合需求 Δ ＝ PD（cm）÷ 距離（m）", gen(r) {
      const pd = r.pick([58, 60, 62, 64, 66, 68]), d = r.pick([40, 33, 25, 20, 10, 5]);
      const ma = 100 / d, dem = pd / 10 * ma;
      return {
        q: `PD <b>${pd} mm</b> 的受檢者注視正前方 <b>${d} cm</b> 的目標，兩眼總共需要多少稜鏡度的聚合？（相當於幾個 MA？）`,
        parts: [{ label: "MA（米角）", type: "num", ans: ma, dp: 2, tol: 0.02 }, { label: "聚合需求", type: "num", ans: dem, unit: "Δ", dp: 1, tol: 0.15 }],
        steps: [
          { c: "米角 MA ＝ 1 ÷ 距離（m），數值等於調節刺激的屈光度。", e: `1 ÷ ${d / 100} ＝ ${ma.toFixed(2)} MA` },
          { c: "每 1 MA 需要 PD（cm）個稜鏡度。", e: `${(pd / 10).toFixed(1)} × ${ma.toFixed(2)} ＝ ${dem.toFixed(1)}Δ` },
        ],
      };
    } },
  ]);

  /* ---------- W04 ★4 Hirschberg ---------- */
  define("w04", [
    { id: "4-1", star: 4, title: "Hirschberg：每 1 mm ≈ 22Δ", gen(r) {
      const mm = r.pick([0.5, 1, 1.5, 2, 2.5, 3]), eye = r.pick(["右眼", "左眼"]), dir = r.pick(["鼻側", "顳側"]);
      const pd = mm * 22, k = dir === "鼻側" ? 0 : 1;
      return {
        q: `筆燈在 50 cm 照向鼻樑，<b>${eye}</b>的角膜反光點落在瞳孔中心<b>${dir} ${mm} mm</b>，另一眼反光置中。以 1 mm ≈ 22Δ 估算，這是什麼眼位、約幾稜鏡度？`,
        parts: [{ label: "偏斜量", type: "num", ans: pd, unit: "Δ", dp: 0, tol: 0.6 }, { label: "型態", type: "choice", opts: ["外斜視 XT", "內斜視 ET"], ans: k }],
        steps: [
          { c: "反光點偏鼻側 → 眼睛轉向顳側（外斜）；偏顳側 → 內斜。", e: `反光${dir} → ${k ? "內斜視 ET" : "外斜視 XT"}` },
          { c: "量化：毫米數 × 22。紀錄要寫出所用換算。", e: `${mm} × 22 ＝ ${pd}Δ（以 15Δ/mm 換算則為 ${mm * 15}Δ）` },
        ],
      };
    } },
  ]);

  /* ---------- W07 ★5 稜鏡度定義、★6 Prentice ---------- */
  define("w07", [
    { id: "7-1", star: 5, title: "稜鏡度 ＝ 偏移（cm）÷ 距離（m）", gen(r) {
      const m = r.pick([0.4, 0.5, 1, 2, 3, 6]), cm = r.pick([1, 2, 3, 4, 5, 6, 8, 10, 12]);
      const p = cm / m;
      return {
        q: `光線通過一片稜鏡後，在 <b>${m} m</b> 遠的牆上偏移了 <b>${cm} cm</b>。這片稜鏡是幾稜鏡度？`,
        parts: [{ label: "稜鏡度", type: "num", ans: p, unit: "Δ", dp: 1, tol: 0.06 }],
        steps: [{ c: "1Δ 定義：在 1 m 處偏移 1 cm。", e: `${cm} ÷ ${m} ＝ ${p.toFixed(1)}Δ` }],
      };
    } },
    { id: "7-2", star: 6, title: "Prentice 法則 Δ ＝ c（cm）× F", gen(r) {
      const F = r.pick([-6, -4, -3, -2.5, 2, 3, 4, 5]) , mm = r.pick([2, 3, 4, 5, 6]), side = r.pick(["鼻側", "顳側"]);
      const p = mm / 10 * Math.abs(F);
      const plus = F > 0;
      // 光學中心在瞳孔的 side 側 → 視線穿過鏡片的另一側；正鏡基底朝光學中心、負鏡背離光學中心
      const baseNasal = plus ? side === "鼻側" : side === "顳側";
      return {
        q: `右眼鏡片 <b>${F > 0 ? "+" : "−"}${Math.abs(F).toFixed(2)} DS</b>，配好的眼鏡光學中心落在瞳孔<b>${side} ${mm} mm</b>。右眼產生多少稜鏡效應？基底朝哪裡？`,
        parts: [{ label: "稜鏡量", type: "num", ans: p, unit: "Δ", dp: 2, tol: 0.03 }, { label: "基底", type: "choice", opts: ["Base In", "Base Out"], ans: baseNasal ? 0 : 1 }],
        steps: [
          { c: "偏心距離換成公分，乘上鏡片度數（取絕對值）。", e: `${mm / 10} × ${Math.abs(F)} ＝ ${p.toFixed(2)}Δ` },
          { c: `正鏡片像兩個底對底的稜鏡，<b>基底朝光學中心</b>；負鏡片相反，<b>基底背離光學中心</b>。光學中心在${side}，${plus ? "正鏡" : "負鏡"} → 基底朝${baseNasal ? "鼻側" : "顳側"}。`, e: `${p.toFixed(2)}Δ ${baseNasal ? "BI" : "BO"}` },
        ],
      };
    } },
  ]);

  /* ---------- W12 延伸：von Graefe 取值規則 ---------- */
  define("w12", [
    { id: "12-1", star: 0, title: "延伸：von Graefe 兩次讀值怎麼記錄", gen(r) {
      const t = r.int(-10, 4), a = t + r.int(-2, 2), b = t + r.pick([-1, 0, 1, 2, 3, 4, -3, -4]);
      const diff = Math.abs(a - b), ok = diff <= 3, avg = (a + b) / 2;
      const s = (v) => (v === 0 ? "0Δ" : `${Math.abs(v)}Δ ${v < 0 ? "BI" : "BO"}`);
      return {
        q: `近距 von Graefe：第一次（由 BI 側減少到對齊）讀到 <b>${s(a)}</b>，越過後轉回再對齊讀到 <b>${s(b)}</b>。可以直接取平均嗎？取平均後記成什麼？`,
        parts: [{ label: "能否直接取平均", type: "choice", opts: ["可以（相差 ≤ 3Δ）", "不行，要重測（相差 > 3Δ）"], ans: ok ? 0 : 1 }, { label: "平均值（BI 寫負數，BO 寫正數）", type: "num", ans: avg, unit: "Δ", dp: 1, tol: 0.06 }],
        steps: [
          { c: "兩次相差 3Δ 以內才取平均；超過就加強說明後重測，取最接近的兩次。", e: `|${a} − (${b})| ＝ ${diff}Δ → ${ok ? "可取平均" : "重測"}` },
          { c: "BI 讀數代表外斜位、BO 代表內斜位。", e: `平均 ${avg.toFixed(1)}Δ → ${phx(avg)}` },
        ],
      };
    } },
  ]);

  /* ---------- W13 ★7 Sheard ---------- */
  define("w13", [
    { id: "13-1", star: 7, title: "Sheard：(2 × 斜位 − 儲備) ÷ 3", gen(r) {
      const x = r.int(4, 14), res = r.int(6, 24);
      const p = (2 * x - res) / 3, need = p > 0;
      return {
        q: `近距 <b>${x}Δ XP</b>，近距 BO <b>${res}/${res + r.int(3, 6)}/${Math.max(2, res - r.int(4, 8))}</b>。依 Sheard 準則是否符合？若不符合，需要多少稜鏡、基底朝哪？（不需要時稜鏡量填 0）`,
        parts: [{ label: "所需稜鏡", type: "num", ans: need ? p : 0, unit: "Δ", dp: 1, tol: 0.06 }, { label: "基底", type: "choice", opts: ["Base In", "Base Out", "不需要稜鏡"], ans: need ? 0 : 2 }],
        steps: [
          { c: "外斜位要靠正融像聚散（PFV）拉回來，所以儲備取 BO 的<b>模糊點</b>（沒有模糊點用破裂點）。", e: `需求 ＝ ${x}Δ，儲備 ＝ ${res}Δ` },
          { c: "Sheard：儲備至少要是需求的 2 倍。", e: `2 × ${x} ＝ ${2 * x}Δ ${res >= 2 * x ? "≤" : ">"} ${res}Δ → ${need ? "不符合" : "符合"}` },
          { c: "所需稜鏡 ＝ (2 × 需求 − 儲備) ÷ 3；外斜位用 BI。", e: `(${2 * x} − ${res}) ÷ 3 ＝ ${p.toFixed(1)}Δ${need ? " BI" : " → 不需要"}` },
        ],
      };
    } },
  ]);

  /* ---------- W14 ★8 計算式 AC/A、★9 梯度式 AC/A；延伸：NRA/PRA 座標 ---------- */
  define("w14", [
    { id: "14-1", star: 8, title: "計算式 AC/A ＝ PD（cm）＋ d（m）×（Hn − Hd）", gen(r) {
      const pd = r.pick([58, 60, 62, 64, 66]), hd = r.int(-6, 4), hn = r.int(-14, 10);
      const aca = pd / 10 + 0.4 * (hn - hd);
      return {
        q: `PD <b>${pd} mm</b>，遠距 <b>${phx(hd)}</b>，近距（40 cm）<b>${phx(hn)}</b>。計算式 AC/A 是多少？`,
        parts: [{ label: "AC/A", type: "num", ans: aca, unit: "Δ/D", dp: 1, tol: 0.06 }],
        steps: [
          { c: "內斜位寫正、外斜位寫負。", e: `Hd ＝ ${hd}，Hn ＝ ${hn}` },
          { c: "代入公式，PD 用公分、工作距離用公尺。", e: `${(pd / 10).toFixed(1)} + 0.4 × (${hn} − (${hd})) ＝ ${aca.toFixed(1)}` },
          { c: `${aca > 6 ? "高於 6 → 偏高（聚合過度、開散過度型）" : aca < 2 ? "低於 2 → 偏低（聚合不足、開散不足型）" : "落在 2–6 之間"}。計算式包含近感性聚合，常比梯度式高。` },
        ],
      };
    } },
    { id: "14-2", star: 9, title: "梯度式 AC/A ＝ 斜位變化 ÷ 鏡片度數", gen(r) {
      const h0 = r.int(-10, 4), aca = r.pick([1, 2, 3, 4, 5, 6, 7, 8]), L = r.pick([-1, 1]);
      const h1 = h0 + aca * (-L);
      return {
        q: `40 cm 近距斜位 <b>${phx(h0)}</b>；雙眼加上 <b>${L > 0 ? "+1.00" : "−1.00"} D</b> 後重測為 <b>${phx(h1)}</b>。梯度式 AC/A 是多少？`,
        parts: [{ label: "AC/A", type: "num", ans: aca, unit: "Δ/D", dp: 1, tol: 0.06 }],
        steps: [
          { c: `${L < 0 ? "加負鏡 → 調節增加 → 調節性聚合增加 → 往內斜方向移動" : "加正鏡 → 調節放鬆 → 調節性聚合減少 → 往外斜方向移動"}。內斜寫正、外斜寫負。`, e: `${h0} → ${h1}` },
          { c: "斜位變化量 ÷ 鏡片度數（取絕對值）。", e: `|${h1} − (${h0})| ÷ 1.00 ＝ ${aca}Δ/D` },
        ],
      };
    } },
    { id: "14-3", star: 0, title: "延伸：NRA／PRA 在圖上的位置", gen(r) {
      const nra = r.pick([1.25, 1.5, 1.75, 2, 2.25, 2.5]), pra = r.pick([-1, -1.5, -2, -2.5, -3]), pd = r.pick([60, 62, 64]);
      return {
        q: `PD ${pd} mm，近距 40 cm（2.50 D）測得 NRA <b>+${nra.toFixed(2)}</b>、PRA <b>${pra.toFixed(2)}</b>。在 ZCSBV 上，這兩點的「調節刺激」座標各是多少？橫座標是多少？`,
        parts: [{ label: "NRA 點的調節刺激", type: "num", ans: 2.5 - nra, unit: "D", dp: 2, tol: 0.02 }, { label: "PRA 點的調節刺激", type: "num", ans: 2.5 + Math.abs(pra), unit: "D", dp: 2, tol: 0.02 }, { label: "兩點的橫座標（聚散刺激）", type: "num", ans: pd / 10 * 2.5, unit: "Δ", dp: 1, tol: 0.06 }],
        steps: [
          { c: "加正鏡讓調節刺激減少、加負鏡讓它增加，而聚合需求不變（視標還在 40 cm）。", e: `NRA：2.50 − ${nra.toFixed(2)} ＝ ${(2.5 - nra).toFixed(2)} D；PRA：2.50 + ${Math.abs(pra).toFixed(2)} ＝ ${(2.5 + Math.abs(pra)).toFixed(2)} D` },
          { c: "橫座標就是 40 cm 的聚合需求。", e: `${(pd / 10).toFixed(1)} × 2.5 ＝ ${(pd / 10 * 2.5).toFixed(1)}Δ` },
        ],
      };
    } },
  ]);

  /* ---------- W15 ★10 Percival、★11 1:1 ---------- */
  define("w15", [
    { id: "15-1", star: 10, title: "Percival：G ÷ 3 − 2L ÷ 3", gen(r) {
      const bi = r.int(4, 18), bo = r.int(4, 24);
      const G = Math.max(bi, bo), L = Math.min(bi, bo), p = G / 3 - 2 * L / 3, need = p > 0;
      const base = !need ? 2 : (bo < bi ? 0 : 1);
      return {
        q: `近距 BI 模糊點 <b>${bi}Δ</b>、BO 模糊點 <b>${bo}Δ</b>。依 Percival 準則，需要稜鏡嗎？需要多少、基底朝哪？（不需要時填 0）`,
        parts: [{ label: "所需稜鏡", type: "num", ans: need ? p : 0, unit: "Δ", dp: 1, tol: 0.06 }, { label: "基底", type: "choice", opts: ["Base In", "Base Out", "不需要稜鏡"], ans: base }],
        steps: [
          { c: "G 取較大的一側、L 取較小的一側。", e: `G ＝ ${G}，L ＝ ${L}` },
          { c: "所需稜鏡 ＝ G ÷ 3 − 2 × L ÷ 3。≤ 0 代表需求點已在中間三分之一。", e: `${G} ÷ 3 − 2 × ${L} ÷ 3 ＝ ${p.toFixed(1)}Δ` },
          { c: need ? `較小的是 ${bo < bi ? "BO（內聚）" : "BI（開散）"} 側 → 要減少該側的負擔，基底朝${bo < bi ? "內（BI）" : "外（BO）"}。` : "不需要稜鏡。" },
        ],
      };
    } },
    { id: "15-2", star: 11, title: "1:1 法則：(內斜位 − BI 回復) ÷ 2", gen(r) {
      const e = r.int(3, 14), rec = r.int(0, 14), p = (e - rec) / 2, need = p > 0;
      return {
        q: `近距 <b>${e}Δ EP</b>，近距 BI <b>${rec + r.int(4, 8)}/${rec + r.int(8, 12)}/${rec}</b>。依 1:1 法則需要多少稜鏡？（不需要時填 0）`,
        parts: [{ label: "所需稜鏡", type: "num", ans: need ? p : 0, unit: "Δ", dp: 1, tol: 0.06 }, { label: "基底", type: "choice", opts: ["Base In", "Base Out", "不需要稜鏡"], ans: need ? 1 : 2 }],
        steps: [
          { c: "1:1 法則用於內斜位：BI 的<b>回復點</b>至少要等於內斜位量。", e: `內斜 ${e}Δ，BI 回復 ${rec}Δ` },
          { c: "所需稜鏡 ＝ (內斜位 − BI 回復) ÷ 2；內斜位用 BO。", e: `(${e} − ${rec}) ÷ 2 ＝ ${p.toFixed(1)}Δ${need ? " BO" : " → 不需要"}` },
        ],
      };
    } },
  ]);

  /* ---------- W16 ★12 有效度數 ---------- */
  define("w16", [
    { id: "16-1", star: 12, title: "有效度數 Fx ＝ F ÷ (1 − x·F)", gen(r) {
      const Fp = r.pick([-12, -10, -8, -6, 6, 8, 10, 12]), d1 = r.pick([14, 13, 12]), d2 = r.pick([0, 10, 12, 16]);
      if (d2 === d1) return this.gen(r);
      const x = (d1 - d2) / 1000, Fx = Fp / (1 - x * Fp);
      return {
        q: `試鏡架上 <b>${Fp > 0 ? "+" : "−"}${Math.abs(Fp).toFixed(2)} D</b> 放在頂點距離 <b>${d1} mm</b>。若最終${d2 === 0 ? "改配隱形眼鏡（頂點距離 0）" : `眼鏡的頂點距離是 ${d2} mm`}，要配多少度才有相同效果？`,
        parts: [{ label: "新位置的度數", type: "num", ans: Fx, unit: "D", dp: 2, tol: 0.03 }],
        steps: [
          { c: "x ＝ 鏡片往眼睛移動的距離（公尺）；往外移時 x 為負。", e: `x ＝ (${d1} − ${d2}) ÷ 1000 ＝ ${x.toFixed(3)} m` },
          { c: "代入 Fx ＝ F ÷ (1 − x·F)。", e: `${Fp} ÷ (1 − ${x.toFixed(3)} × ${Fp}) ＝ ${Fx.toFixed(2)} D` },
          { c: "規律：鏡片靠近眼睛，負鏡要配更多、正鏡要配更少；度數越高差越多，所以 ±4.00 D 以上要注意頂點距離。" },
        ],
      };
    } },
  ]);
})();
