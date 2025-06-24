## data

| Pattern | JavaScript | Description | Hints |
| ------- | ---------- | ----------- | ----- |
| 設定 cookie $名稱 為 $值 | document.cookie = 樣本1 + '=' + 樣本2; | set browser cookie |  |
| 顯示 cookie $名稱 的值 | alert(document.cookie.split('; ').find(c => c.startsWith(樣本1 + '='))?.split('=')[1]); | get cookie value |  |
| 顯示目前瀏覽器語系 | alert(navigator.language); | show browser language |  |
| 顯示網址參數 $鍵 | alert(new URLSearchParams(location.search).get(樣本1)); | show query parameter |  |
| 建立清單($名稱) | let 樣本1 = ArrayModule.建立清單(); | create list variable |  |
| 遍歷 $清單 並顯示每項 | 樣本1.forEach(item => alert(item)); | iterate list items |  |
| 加入 $項目 到 $清單 | ArrayModule.加入項目("樣本2", "樣本1"); | append item to list |  |
| 加入項目($清單, $項目) | ArrayModule.加入項目(樣本1, "樣本2"); | append item to list directly |  |
| 把 $項目 加進 $清單 | ArrayModule.加入項目("樣本2", "樣本1"); | append item to list |  |
| 反轉 $清單 | 樣本1.reverse(); | reverse list |  |
| 顯示 JSON 格式化 $物件 | alert(JSON.stringify(樣本1, null, 2)); | display object as JSON |  |

## general

| Pattern | JavaScript | Description | Hints |
| ------- | ---------- | ----------- | ----- |
| 設定 $變數 為 $值 | let 樣本1 = 樣本2; | 宣告或重新賦值變數 | 變數, 值 |
| 顯示 $內容 | alert(樣本1); | 彈出警示框顯示指定內容 | 內容 |
| 確認($訊息) | confirm(樣本1) |  |  |

## control

| Pattern | JavaScript | Description | Hints |
| ------- | ---------- | ----------- | ----- |
| 若 $條件 則 顯示 $當真 否則 顯示 $當假 | if (樣本1) { alert(樣本2); } else { alert(樣本3); } | 根據條件顯示不同內容 | 條件, 當真, 當假 |
| 若（$條件）則 顯示（$語句1） 否則 顯示（$語句2） | if (樣本1) {<br>  alert(樣本2);<br>} else {<br>  alert(樣本3);<br>} | 含括號的條件語句 | 條件, 語句1, 語句2 |
| 若($條件)則 顯示($語句1) 否則 顯示($語句2) | if (樣本1) {<br>  alert(樣本2);<br>} else {<br>  alert(樣本3);<br>} | 括號英文版的條件語句 | 條件, 語句1, 語句2 |
| 等待 $秒數 秒後 顯示 $訊息 | setTimeout(() => alert(樣本2), 樣本1 * 1000); | 延遲數秒後顯示訊息 | 秒數, 訊息（可選） |
| 等待 $毫秒 毫秒後 顯示 $訊息 | setTimeout(() => alert(樣本2), 樣本1); | delay message in ms |  |
| 開新視窗到 $網址 | window.open(樣本1, '_blank'); | open new window |  |
| 否則如果($條件)： | } else if (樣本1) { | else if statement |  |
| 當（$選擇器.被點擊）時： | document.querySelector("樣本1").addEventListener("click", () => { | add click event listener |  |
| 當($選擇器.被點擊)時： | document.querySelector("樣本1").addEventListener("click", () => { | add click event listener |  |
| 重複 $次數 次 $語句 | for (let i = 0; i < 樣本1; i++) { // 無法辨識語句，是否想輸入：呼叫?; } | repeat an action N times |  |

## time

| Pattern | JavaScript | Description | Hints |
| ------- | ---------- | ----------- | ----- |
| 顯示今天日期 | alert(new Date().toLocaleDateString()); | show current date |  |

## string

| Pattern | JavaScript | Description | Hints |
| ------- | ---------- | ----------- | ----- |
| 替換所有 $舊字 為 $新字 在 $字串 | alert(樣本3.replaceAll(樣本1, 樣本2)); | replace text and display |  |

## math

| Pattern | JavaScript | Description | Hints |
| ------- | ---------- | ----------- | ----- |
| 顯示 $數字 的絕對值 | alert(Math.abs(樣本1)); | show absolute value |  |
| 顯示隨機整數至 $最大值 | alert(Math.floor(Math.random() * 樣本1)); | random integer |  |

## log

| Pattern | JavaScript | Description | Hints |
| ------- | ---------- | ----------- | ----- |
| 在控制台輸出 $內容 | console.log(樣本1); | console output |  |
| 顯示內容($內容) | console.log(樣本1); | console output |  |

## function

| Pattern | JavaScript | Description | Hints |
| ------- | ---------- | ----------- | ----- |
| 定義 $函式名($參數)： | function 樣本1(樣本2) { | define a function |  |
| 呼叫 $函式名($參數) | 樣本1(樣本2); | call a function |  |
| $函式名($參數) | 樣本1(樣本2); | direct function call |  |

## array

| Pattern | JavaScript | Description | Hints |
| ------- | ---------- | ----------- | ----- |
| 顯示第幾項($清單, $位置) | alert(樣本1[樣本2 - 1]); | display nth item of list |  |
| 取得項目($清單, $位置) | 樣本1[樣本2 - 1] | get item from list |  |
| 清空清單($清單) | 樣本1.length = 0; | empty list |  |

## ui

| Pattern | JavaScript | Description | Hints |
| ------- | ---------- | ----------- | ----- |
| 隱藏 $元素 | document.querySelector("樣本1") && (document.querySelector("樣本1").style.display = "none"); | 隱藏指定元素 | 元素 |
| 顯示 $訊息 在 $選擇器 | document.querySelector('樣本2').textContent = 樣本1; | update DOM text content |  |
| 顯示圖片($路徑 在 $選擇器) | const img = document.createElement('img'); img.src = "樣本1"; document.querySelector("樣本2") && document.querySelector("樣本2").appendChild(img); | append image to selector |  |
| 切換顏色($參數) | let __toggleEl0 = document.querySelector("#id"); __toggleEl0.style.color = __toggleEl0.style.color === "red" ? "blue" : "red"; | toggle text color |  |
| 增加透明度動畫到 $選擇器 | document.querySelector("樣本1").style.transition = 'opacity 0.5s'; | fade animation |  |
| 新增元素 $標籤 到 $選擇器 | document.querySelector("樣本2").appendChild(document.createElement("樣本1")); | append new element |  |
| 清空 $選擇器 的內容 | document.querySelector('樣本1').innerHTML = ''; | clear element content |  |
| 設定文字於 $選擇器 為 $文字 | document.querySelector('樣本1').textContent = 樣本2; | set text content |  |
| 設定（$選擇器）為 $內容 | document.querySelector("樣本1") && (document.querySelector("樣本1").textContent = "樣本2"); |  |  |

## media

| Pattern | JavaScript | Description | Hints |
| ------- | ---------- | ----------- | ----- |
| 停止所有音效 | document.querySelectorAll('audio').forEach(a => a.pause()); | pause all audio |  |
| 暫停影片() | document.querySelector("#影片播放器")?.pause(); | pause default video player |  |
| 播放音效($路徑) | new Audio("樣本1").play(); | play audio file |  |

