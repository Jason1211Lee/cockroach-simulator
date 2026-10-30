# 3D 原型 2026-10-30

試玩：https://cockroach-midnight-kitchen.deardog.chatgpt.site/3d.html

原 2D 入口保留於首頁。3D 具房間、櫃子碰撞、程序蟑螂與人類模型、跟隨鏡頭、方向觸控鍵、角色選擇、三種蟑螂速度設定、受限飛行、人類反應設定、收集／處理目標與重開。

僅通過 node --check JavaScript 語法檢查，尚未執行 WebGL 瀏覽器、真機或完整流程測試。不是寫實美術完成版。三種型態目前只有速度與飛行差異，轉向差異待實作；噴藥目前共用接近傷害，尚無獨立毒霧動畫與資源系統。人類處理按鈕以近距離計分，尚非完整攻擊動畫。沒有保證真實品種對應。桌面方向鍵說明待修正，目前使用 WASD。觸控目前是方向按鈕而非類比搖桿。

GitHub 版固定引用 Three.js 0.160.1 CDN，部署版將同版本模組放在 vendor/three.mjs，不需外部 CDN。Three.js 為 MIT 授權：https://github.com/mrdoob/three.js/blob/r160/LICENSE 。程序模型由專案程式建立，未使用第三方人物資產。

下一步：真實瀏覽器執行與布局驗證、觸控鏡頭與類比搖桿、獨立噴藥行為、模型與動畫，以及型態平衡。
