# Blang Grammar Patterns

## general

| Pattern | Description |
| --- | --- |
| 顯示 $內容 | `alert($內容);` |
| 設定 $變數 為 $值 | `let $變數 = $值;` |

## control

| Pattern | Description |
| --- | --- |
| 若 $條件 則 顯示 $當真 否則 顯示 $當假 | `if ($條件) { alert($當真); } else { alert($當假); }` |
| 若（$條件）則 顯示（$語句1） 否則 顯示（$語句2） | `if ($條件) {
  alert($語句1);
} else {
  alert($語句2);
}` |
| 若($條件)則 顯示($語句1) 否則 顯示($語句2) | `if ($條件) {
  alert($語句1);
} else {
  alert($語句2);
}` |
| 等待 $秒數 秒後 顯示 $訊息 | `setTimeout(() => alert($訊息), $秒數 * 1000);` |

## ui

| Pattern | Description |
| --- | --- |
| 隱藏 $元素 | `document.querySelector($元素).style.display = "none";` |

