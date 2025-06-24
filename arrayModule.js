module.exports = {
  加入項目: (list, item) => `ArrayModule.加入項目(${list}, ${item})`,

  顯示第幾項: (list, index) => `${list}[${index} - 1]`,

  取得項目: (list, index) => `${list}[${index} - 1]`,

  清單包含: (list, value) => `${list}.includes(${value})`,

  清空清單: (list) => `${list}.length = 0`
};
