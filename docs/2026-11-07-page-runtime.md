# 2026-11-07 完整頁面程式整合測試

小目標：除了單一數學函式測試，還要確認實際 3d.html 能載入本地模組並串起操作流程。

新增 test-page-runtime.mjs。讀取實際頁面的 module script，匯入真實本地模組與匯出項目，再於 Node VM 中執行頁面主程式。以替代 DOM、Three.js 與可手動推進的 requestAnimationFrame 驗證事件及狀態。HTML 中不存在的 ID 會使測試失敗。

已執行：node test-page-runtime.mjs，退出碼 0。

驗收涵蓋：初始生命與三個食物、模組匯出存在、更新迴圈呼叫 renderer、方向鍵讓角色移動、型態切換、起飛、升降按鈕、手動降落、鏡頭拖曳、多指分別操控搖桿／鏡頭後切背景清除輸入、人類近距離動作計分，以及重開清除分數／冷卻並恢復生命與食物。

執行步驟：從 docs/game-foundation 分支下載完整程式，在專案目錄執行 node test-page-runtime.mjs，需 Node.js 支援 ESM，不需額外測試套件。

邊界：測試替代了 Three.js 及瀏覽器 DOM，只執行遊戲主程式與實際本地模組，並沒有真的建立 GPU/WebGL 畫面；『renderer 被呼叫』不等於『畫面正確』。沒有真機觸控、畫面布局、碰撞手感、FPS、登入或部署驗證。此測試補整合缺口，不能拿來宣稱符合寫實遊戲需求。

本次僅新增測試與紀錄，沿用 PR #1；未合併也未部署。下一步仍需在有 WebGL 的瀏覽器中完成視覺與手感驗收。
