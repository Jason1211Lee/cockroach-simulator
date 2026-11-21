# 2026-10-31：3D 輸入重置

目標：重開、切換角色／型態／個性、背景切換與 resize 後不保留搖桿方向或 pointer 所有權。

修正：共用 clearMovement 清除鍵盤、axis 與 pointer；reset、visibilitychange、resize、blur 呼叫清除。原本 reset 和 visibilitychange 只清鍵盤，搖桿可能持續推動角色。

驗證：node test-input-reset.cjs 已執行通過。直接擷取實際 reset 與 clearMovement 函式，在 Node VM 使用場景替身執行，確認 keyboard／axis／pointer 歸零；另檢查事件與選角掛接。這不代表真實 DOM 事件、多指觸控或 WebGL 視覺已通過。

完成標準：程式層級輸入重置測試通過；真機放手、旋轉、切背景與角色切換仍待實測。本次只提交 PR，沒有更新已部署網站，避免把未經瀏覽器操作驗證的版本當成已驗收。

下一步：在可執行 WebGL 的瀏覽器環境檢查鏡頭與飛行，先補自由升降及動作回饋，再處理寫實資產。
