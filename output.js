let 人物 = {}; // ⛳ 自動補上 人物 變數
let 空 = 0; // ⛳ 自動補上未宣告變數
const 輸入框 = document.getElementById("input");

document.getElementById("submit").addEventListener("click", () => {
if (輸入框.value === "") {
    alert("請先輸入內容");
} else {
    alert("留言已送出：" + 輸入框.value);
    alert("收到：" + 輸入框.value);
    let 水果們 = ArrayModule.建立清單();
        ArrayModule.加入項目(水果們, "蘋果");
        ArrayModule.加入項目(水果們, "香蕉");
        ArrayModule.加入項目(水果們, "芒果");
        ArrayModule.加入項目(水果們, "葡萄");
    alert("所有水果：" + ArrayModule.顯示全部(水果們));
    alert("最後一項：" + ArrayModule.顯示第幾項(水果們, 3));
    alert("我最愛吃的水果是：" + ArrayModule.顯示第幾項(水果們, 2));
        ArrayModule.移除最後(水果們);
    alert("移除最後後：" + ArrayModule.顯示全部(水果們));
    setTimeout(() => {
        alert("這是延遲訊息");
    }, 3000);
    setTimeout(() => {
        alert("你好");
    }, 3000);
    document.getElementById('name_display').innerText = "你的名字是：" + 輸入框.value;
    document.getElementById('結果區').innerText = "Blang 語法測試中";
        new Audio("ding.mp3").play();
        呼叫AI回覆("使用者.問題"); // 🔮 AI
    if (水果們.length >= 2) alert("你有很多水果！");
    if (水果們.length == 1) alert("剩下最後一個水果");
    let 數量 = 3;
if (數量 > 2) {
    alert("超過兩個！");
    for (let i = 0; i < 3; i++) {
        alert("你好");
        let 分數 = 85;
        let 年齡 = 17;
        let 密碼 = 12345;
        let 輸入密碼 = 12345;
        if (分數 >= 90) alert("優等生");
        if (分數 < 60) alert("需要加強");
        if (年齡 >= 18) alert("可以投票");
        if (密碼 === 輸入密碼) alert("密碼正確");
        if (密碼 !== 輸入密碼) alert("密碼錯誤");
        if (年齡 <= 12) alert("兒童票");
        if (分數 >= 80) alert("良好以上成績");
        if (密碼 == "12345") alert("密碼為預設值,請修改");
        if (年齡 < 20) alert("青春正盛！");
        document.getElementById('歡迎區').innerText = "歡迎你！";
        alert("隨機數：" + Math.floor(Math.random() * 10));
        alert("總分近似值：" + Math.round(分數));
        alert("平方值：" + Math.pow(年齡, 2));
                let 人物 = { 名字: "小傑", 年齡: 25 };
        let key = '名字';
        alert("他的名字是：" + 人物["名字"]);
        alert(人物[key]);
                alert("你好嗎?");
                document.querySelector("#結果區").style["backgroundColor"] = "red";
                document.querySelector("#歡迎區").style["fontSize"] = "24px";
        alert("水果數量：" + 水果們.length);
                水果們.length = 0;
    if (水果們.length === 0) {
        alert("清單是空的");
        let __toggleEl0 = document.querySelector("#結果區");
        __toggleEl0.style.color = __toggleEl0.style.color === "red" ? "blue" : "red";
                document.querySelector("#歡迎區").style.display = "none";
                document.querySelector(影片播放器).play();
                document.querySelector(音效播放器).pause();
        alert("現在時間是：" + new Date().toLocaleTimeString());
        alert(new Date().toLocaleString());
        let 原句 = '我喜歡貓';
        alert(原句.replace("貓", "狗"));
        window.location.href = "https://example.com";
                const img = document.createElement('img'); img.src = "圖.jpg"; document.querySelector("#區塊").appendChild(img);
                console.log("你好世界");
new Audio("ding.mp3").play();
document.querySelector("#警告區塊").style.display = "none";
document.querySelector("#表單").style.display = "block";
document.querySelector("#頁面").style.backgroundColor = "lightblue";
document.querySelector("#狀態文字").textContent = "處理中...";
alert("今天是星期" + "日一二三四五六"[new Date().getDay()]);
alert("現在是" + new Date().getHours() + "點" + new Date().getMinutes() + "分");
alert("你好世界");
if (1 > 0) { alert("大"); } else { alert("小"); }
alert("開始測試");
document.querySelector("#通知區").style.display = "none";
setTimeout(() => {
    alert("完成");
}, 2000);
// 未翻譯：顯示今天日期（無匹配的語法規則）
// 未翻譯：替換所有 "貓" 為 "狗" 在 原句（無匹配的語法規則）
切換顯示隱藏(#詳細);
// 未翻譯：增加透明度動畫到 #方塊（無匹配的語法規則）
// 未翻譯：顯示 數量 的絕對值（無匹配的語法規則）
// 未翻譯：遍歷 水果們 並顯示每項（無匹配的語法規則）
// 未翻譯：停止所有音效（無匹配的語法規則）
// 未翻譯：顯示目前瀏覽器語系（無匹配的語法規則）
// 未翻譯：顯示 JSON 格式化 使用者（無匹配的語法規則）
// 未翻譯：新增元素 div 到 #容器（無匹配的語法規則）
// 未翻譯：清空 #結果區 的內容（無匹配的語法規則）
// 未翻譯：設定文字於 #狀態 為 "完成"（無匹配的語法規則）
// 未翻譯：在控制台輸出 "測試中"（無匹配的語法規則）
// 未翻譯：設定 cookie token 為 "123"（無匹配的語法規則）
// 未翻譯：顯示 cookie token 的值（無匹配的語法規則）
// 未翻譯：顯示隨機整數至 10（無匹配的語法規則）
// 未翻譯：反轉 水果們（無匹配的語法規則）
// 未翻譯：顯示網址參數 id（無匹配的語法規則）
循環播放音樂("bg.mp3");
// 未翻譯：開新視窗到 "https://example.com"（無匹配的語法規則）
    }
    }
}
}
});