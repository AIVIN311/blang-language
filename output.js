let 淡藍色 = 0; // ⛳ 自動補上未宣告變數
let 音效播放器 = 0; // ⛳ 自動補上未宣告變數
let 影片播放器 = 0; // ⛳ 自動補上未宣告變數
let 藍色 = 0; // ⛳ 自動補上未宣告變數
let 字型大小 = 0; // ⛳ 自動補上未宣告變數
let 紅色 = 0; // ⛳ 自動補上未宣告變數
let 背景色 = 0; // ⛳ 自動補上未宣告變數
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
    document.querySelector('#name_display').textContent = "你的名字是：" + 輸入框.內容;
    document.querySelector('#結果區').textContent = "Blang 語法測試中";
        new Audio("ding.mp3").play();
        呼叫AI回覆("使用者.問題"); // 🔮 AI
        呼叫AI回覆("你好"); // 🔮 AI
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
        document.querySelector('#歡迎區').textContent = "歡迎你！";
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
                let __toggleEl0 = document.querySelector("#結果區"); __toggleEl0.style.color = __toggleEl0.style.color === "red" ? "blue" : "red";
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
        alert(new Date().toLocaleDateString());
        alert(原句.replaceAll("貓", "狗"));
                const el = document.querySelector("#詳細"); el.style.display = el.style.display === 'none' ? 'block' : 'none';
        document.querySelector("#方塊").style.transition = 'opacity 0.5s';
        alert(Math.abs(數量));
        水果們.forEach(item => alert(item));
        document.querySelectorAll('audio').forEach(a => a.pause());
        alert(navigator.language);
        alert(JSON.stringify(使用者, null, 2));
        document.querySelector("#容器").appendChild(document.createElement("div"));
        document.querySelector('#結果區').innerHTML = '';
        document.querySelector('#狀態').textContent = "完成";
        console.log("測試中");
        document.cookie = token + '=' + "123";
        alert(document.cookie.split('; ').find(c => c.startsWith(token + '='))?.split('=')[1]);
        alert(Math.floor(Math.random() * 10));
        水果們.reverse();
        alert(new URLSearchParams(location.search).get(id));
                const a = new Audio("bg.mp3"); a.loop = true; a.play();
        window.open("https://example.com", '_blank');
        alert(abc.toUpperCase());
        alert(hello.includes(h));
        alert(人物[key]);
        alert(prompt(請輸入姓名));
                ObjectModule.建立物件("a", "b", "c", 1);
                document.querySelector("#輸出").textContent = "完成";
                console.log("log 測試");
    }
    }
}
}
});