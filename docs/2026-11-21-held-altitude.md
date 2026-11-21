# 2026-11-21：按住持續調整飛行高度

## 本次小目標
改善飛行升降必須反覆點擊的操作：手機按住升高／降低，電腦按住 Q／Z，持續調整目標高度。沿用尚未合併的 docs/game-foundation / PR #1，未另開 PR。

## 實作
- 每秒調整 1 個場景單位，範圍仍為 0.25–2.2；實際高度沿用平滑跟隨。
- 每個 pointerId 分開追蹤，升降與移動搖桿、鏡頭拖曳可並行。
- 同時升降互相抵銷；同向多個輸入不加倍。
- pointerup、pointercancel、lostpointercapture 停止對應操作；暫停、失焦、旋轉／resize、重開、背景切換與致命錯誤沿用 clearMovement 清空輸入；飛行到期清空升降觸控。
- 地面按住升降不預先排入下次飛行；指標結束後的 click 不額外跳高，保留鍵盤／輔助功能 click 的 0.25 單步操作。
- 飛行持續時間與冷卻沿用既有設計；本次沒有新增飛行碰撞或越障。

## 驗收步驟與標準
1. 開啟分支 3d.html，選蟑螂／飛行型，開始後按動作起飛。
2. 按住升高或 Q，應持續上升；按住降低或 Z，應持續下降，保持高度上下限。
3. 放手或取消觸控後，目標高度不再變化；角色仍會平滑移至該高度，並非立即停止垂直速度。
4. 同時操作移動搖桿、鏡頭拖曳、升降，三組輸入不搶 pointerId。
5. 暫停、失焦、重開或旋轉後，須重新按住才會升降。

## 實際測試
- node test-page-runtime.mjs：PASS；使用實際 HTML 模組與輸入處理器，但 DOM、Three.js 為替身，非 WebGL 渲染。
- 新案例涵蓋持續升降、Q/Z、上下限、相反輸入、輔助 click、放手／取消／遺失 capture、三指並行、暫停／失焦／resize／重開、飛行到期與地面拒絕輸入。
- 另 12 支測試通過：boot-watch、camera-collision、camera-orbit、chase-attack、flight-controls、interaction-range、logic、movement-controls、progression、safe-zone、spray-attack、visibility。
- test-input-reset.cjs、test-damage-cooldown.cjs：FAIL。兩支舊測試擷取已改變的程式片段；已用修改前的 3d.html 重跑，均同樣失敗。未把舊測試失敗當成通過。
- test.cjs：無法啟動，Playwright 預設 browser binary 缺失。另外指定系統 /usr/bin/chromium 嘗試啟動，也因 socket() Operation not permitted 及 ProcessSingleton fatal 中止，未產生真實渲染結果。
- iPhone Safari、Android Chrome 真機、多點觸控手感、WebGL 畫面與效能：未測試。

## 交付狀態與限制
變更提交既有 PR #1，不自動合併。本次未部署私人 Site，線上試玩入口仍是先前版本，不能用該網址驗收這次修改。3D 寫實模型、品種、完整飛行碰撞／家具落地、角色個性資料分離與手機相容性仍未達最終完成標準，繼續推進。
