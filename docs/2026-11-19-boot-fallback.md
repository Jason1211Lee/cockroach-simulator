# 2026-11-19：3D 啟動狀態與失敗備用入口

## 小目標與前置確認
已先讀最新分支根目錄（未見 AGENTS.md）、GAME_PLAN.md、3D／整合測試及未合併 PR。PR #1 是唯一開啟 PR，沿用 docs/game-foundation。補上啟動狀態與失敗處理，避免模組或繪圖初始化失敗時無說明。

## 執行步驟
1. 在 module script 之前加入不依賴 Three.js 的內嵌 watchdog 與可見載入面板，提供重新載入與 index.html 2D 備用連結。
2. 12 秒內尚未收到 ready 訊號就提示尚未載入，不冒稱已確認網路錯誤。較晚成功的首幀仍可收起面板。
3. 監聽程式 error 與 unhandledrejection，顯示固定繁體中文失敗提示；不把原始例外內容寫入 HTML。
4. 首次 renderer.render 呼叫返回後發出一次 ready。WebGL context 遺失事件會 preventDefault、暫停遊戲並顯示重新載入提示；不宣稱能自動恢復繪圖資源。

## 實際測試與完成標準
- node test-boot-watch.mjs：通過 ready 隱藏、error／Promise rejection 顯示、12 秒逾時、逾時後較晚 ready、重新載入呼叫與 2D 備用連結標記。使用 Node VM 與 DOM 替身。
- node test-page-runtime.mjs：通過首幀 ready 只呼叫一次、模擬 context 遺失後暫停並顯示失敗訊號；同檔既有計時、選角、飛行、鏡頭、搬運、成長、NPC、遮蔽、安全區、勝敗與重開整合案例通過。
- 分別抽取 module 與 watchdog，執行 node --check：通過。
- 本次嘗試 Playwright chromium.launch({headless:true,timeout:8000})，立即失敗：所需 chromium_headless_shell-1234 執行檔不存在於 /home/agent/.cache/ms-playwright。未啟動真實瀏覽器；不能把 VM renderer 呼叫視為 WebGL 畫面驗證。

## 手動驗收步驟
正常開啟 3d.html，載入中可見面板 → 首幀後面板收起 → 阻擋 Three.js 或本地模組載入，應出現失敗或逾時提示 → 按重新載入重試 → 按 2D 備用連結應開啟 index.html → 模擬繪圖 context 遺失應暫停並提示重載。

## 限制與交付
本次未完成實際 WebGL、瀏覽器版面、手機真機、多指操作或效能驗證，未部署 Site、未合併 PR。看門狗無法精確分類所有載入失敗；12 秒提示為逾時而非強制取消載入。一般執行錯誤會顯示面板，但未建立完整崩潰復原；context 遺失需重新載入，會失去本局進度。完整寫實資產、三維碰撞、動畫、搜索尋路、飛行升級與真機驗收仍未完成，不停止後續推進。
