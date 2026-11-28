# 2026-11-23：控制項與遊戲快捷鍵的焦點隔離

## 小目標
修正原生說明區與選角控制項的鍵盤操作會同時觸發遊戲輸入。此問題承接 11/22 的 details 說明區：原全域 Space 處理器會 preventDefault 並呼叫 act，造成說明展開與起飛快捷鍵衝突；選單方向鍵也會進入移動集合。

## 現況與依賴
已讀取最新 GAME_PLAN.md、3d.html、movement-controls.mjs、頁面測試、根目錄與 docs 目錄，以及未合併 PR。僅 PR #1 開啟，頭為 d03d88c951843a884a0070d696c90b54866df560，沿用 docs/game-foundation；根目錄與 docs 未列出 AGENTS.md。沒有新增重複 PR，不自動合併。

## 完成內容
- 全域 keydown 忽略 button、select、summary、連結、輸入框、文字區與可編輯內容，包含控制項內子元素；不取消這些元素的原生按鍵預設行為。
- 忽略 Ctrl／Command／Alt 組合及輸入法組字事件，避免瀏覽器快捷鍵被遊戲攔截。
- 控制項取得焦點時清除鍵盤集合，避免先按住移動再 Tab 到選單仍持續移動；keyup 仍無條件釋放對應鍵。
- 焦點變更只清除鍵盤，不清除觸控搖桿或飛行升降 pointer，保留手機多指操作。
- 3D Canvas 可聚焦；在可互動場景按下指標時使用 preventScroll 聚焦，讓玩家點回畫面後恢復遊戲快捷鍵。

## 驗收步驟與完成標準
1. 在分支開啟 3d.html，選飛行型後以 Tab 聚焦「操作與目標說明」；Space 應只切換說明，不起飛。
2. 聚焦角色／型態選單，方向鍵應只操作選項，不成為遊戲移動輸入。
3. 按住 W 後 Tab 到控制項，鍵盤移動應停止；放開 W 不留殘留。
4. 點回 3D 場景，Space 仍可起飛，WASD／Q／Z 維持功能。
5. 手機按住搖桿時，另一指點動作按鈕取得焦點，不應因 focusin 清掉搖桿。

## 實測
node test-page-runtime.mjs：PASS。新增案例檢查控制項及子元素、可編輯內容、修飾鍵／組字事件不進入遊戲輸入且不取消預設；聚焦清鍵、控制項上的 keyup 釋放、多指保留、Canvas 聚焦設定與遊戲 Space 仍能起飛。既有完整頁面邏輯回歸亦通過。

測試使用 DOM／Three.js 替身及模擬事件；closest、focus 為替身，無法驗證原生 details 展開、選單行為或實際焦點切換。因此上述真實瀏覽器互動、WebGL 畫面、iPhone Safari／Android Chrome 真機及效能未驗證。未重跑已知失效的 test-input-reset.cjs、test-damage-cooldown.cjs，不能宣稱整套測試全綠。

## 交付與剩餘工作
提交 PR #1，未發布 Site；現有私人試玩網址尚不含此修正。2D 不變。尚需真正瀏覽器與手機驗收、完整飛行碰撞與落地、寫實模型及人物動畫／個性等功能，整體未完成。
