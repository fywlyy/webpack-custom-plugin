import './style/index.css' // 1. 导入css文件

function component() {
    var element = document.createElement('div');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('color_red') // 2. 添加类名
    return element;
}

document.body.appendChild(component());