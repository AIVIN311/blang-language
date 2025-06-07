// 📦 array-loader.js - 前端用 ArrayModule 定義 (v0.9.1 安全強化版)

window.ArrayModule = {
  建立清單: function () {
    return [];
  },

  加入項目: function (清單, 項目) {
    if (Array.isArray(清單)) {
      清單.push(項目);
    }
    return 清單;
  },

  顯示第幾項: function (清單, 第幾) {
    const 索引 = parseInt(第幾) - 1;
    if (Array.isArray(清單) && !isNaN(索引) && 索引 >= 0 && 索引 < 清單.length) {
      return 清單[索引];
    }
    return '';
  },

  顯示全部: function (清單) {
    if (Array.isArray(清單)) {
      return 清單.join('、');
    }
    return '';
  },

  移除最後: function (清單) {
    if (Array.isArray(清單)) {
      清單.pop();
    }
    return 清單;
  }
};
