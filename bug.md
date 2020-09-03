当出现mask遮罩后，点击了重新开始，再次GAMEOVER后，刷新页面后会出现点击重新开始的效果，就是没有开始界面，直接开始游戏。
<script>
    document.onkeydown = function (e) {//键盘按键控制
        e = e || window.event;
        if ((e.ctrlKey && e.keyCode == 82) || //ctrl+R
            e.keyCode == 116) {//F5刷新，禁止
            setTimeout(function () { alert('按下F5或者CTRL+R'); }, 100);//延时提醒，要不alert会导致return false被alert挂起从而浏览器执行了刷新
            return false
        }
    }
    document.write(new Date().getTime())
</script>
键盘操控刷新，监控按钮，重新刷新开始页面