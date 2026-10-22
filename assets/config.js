/* 網站設定：開發者名單、版權宣告、相關課程與工具都集中在這裡修改，所有頁面會自動帶入 */
window.OB_CONFIG = {
  siteName: "視光學實驗（三）（無邊界教室）",
  course: "視光學實驗（三）（二專在職專班）",
  copyright: {
    year: 2026,
    holder: "Kuan-Wei Lee（李冠緯）",
    note: "版權所有。本教材供教學使用，未經授權請勿轉載或作商業用途。",
  },
  developers: [
    { name: "Kuan-Wei Lee（李冠緯）", role: "教材設計與開發", affiliation: "馬偕醫護管理專科學校 視光學科" },
  ],
  /* 相關課程的線上平台（同一個 GitHub Pages 網域，用相對路徑，結尾要有 /）。
     留空時，各週「前後串連」裡指向該課程的卡片會變成灰色、不能點。 */
  courses: {
    opt1: { name: "視光學（一）", base: "../optometry1-course/" },
    lab1: { name: "視光學實驗（一）", base: "" },
  },
  /* 其他實驗台的工具；留空就不顯示 */
  tools: {
    phoropter: "../general.optometry-lab/phoropter.html",
    zcsbv: "",
  },
};
