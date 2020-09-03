// 工具函数存放位置
// 生成元素的时候，需考虑标签名是什么，span，div还是其他
// classArr 用于存放类名的数组,可能取任意个数的类名,只要把数据放到数组当中
// styleOBJ 用于存放生成的元素的设置的样式的对象

function createEle(eleName, classArr, styleObj) {
    var dom = document.createElement(eleName);

    for (var i = 0; i < classArr.length; i++) {
        dom.classList.add(classArr[i]);
    }

    for (var key in styleObj) {
        dom.style[key] = styleObj[key];
    }

    return dom;

}
// 存储score数组
function setLocal(key, value) {
    if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value);
    }

    localStorage.setItem(key, value);
}

// 接收key值，从缓存中拿到需要的数据
function getLocal(key) {
    // 获取需要的数据
    var value = localStorage.getItem(key);
    console.log(value);
    if (value === null) { return null };
    if (value[0] === '[' || value[0] === '{') {
        return JSON.parse(value);
    }
    return value;
}