//用对象收编变量
//x = 0
//https://www.yuque.com/docs/share/7d7fe3e2-7773-4d3b-aaef-81d926b2b69a?# ;《js中的this指向为什么？》




var bird = {
    skyPosition: 0,
    skyStep: 2,
    birdTop: 235,
    startColor: 'blue',
    startFlag: false,
    birdStepY: 0,
    minTop: 0,
    maxTop: 570,
    pipeLength: 7,
    pipeArr: [],
    pipeLastIndex: 6,
    score: 0,
    scoreArr: [],
    // birdX :0,
    init: function () {
        this.initDate();
        this.animate();


        this.handleStart();
        this.handleClick();
        this.handleRestart();

        if (sessionStorage.getItem('play')) {
            this.start();
        }
    },

    initDate: function () {
        // 初始化数据
        this.el = document.getElementById('game');
        this.oBird = this.el.getElementsByClassName('bird')[0];
        this.oStart = this.el.getElementsByClassName('start')[0];
        this.oScore = this.el.getElementsByClassName('score')[0];
        this.oMask = this.el.getElementsByClassName('mask')[0];
        this.oEnd = this.el.getElementsByClassName('end')[0];
        this.oFinalScore = this.el.getElementsByClassName('final-score')[0];
        this.oRankList = this.el.getElementsByClassName('rank-list')[0];
        this.oRestart = this.el.getElementsByClassName('restart')[0];

        // 第一次玩缓存没有数据，会报错,所以需要return null
        this.scoreArr = this.getScore();


        // console.log(el);
    },
    getScore: function () {
        var scoreArr = getLocal('score');
        return scoreArr ? scoreArr : [];
    },
    animate: function () {
        var self = this;
        var count = 0;

        this.timer = setInterval(function () {
            self.skyMove();
            //每30毫秒加1
            if (self.startFlag) {
                self.birdDrop();
                self.pipeMove();
            }

            if (++count % 10 === 0) {
                //300毫秒执行一次
                if (!self.startFlag) {
                    self.startBound();
                    self.birdJump();
                };
                self.birdFly(count);
                // count值传入函数

            }

        }, 30)
        // this.skyMove();
    },

    skyMove: function () {
        // var self = this; //this= bird
        // setInterval(function () {
        // 30毫秒移动一次
        // 常规想法：1.找元素，拿x 2.x-num 3.赋值x
        // 尽可能少操作dom（定义x）
        this.skyPosition -= this.skyStep;
        this.el.style.backgroundPositionX = this.skyPosition + 'px';
        // 不能直接用this，无法运转,this为window
        // 可以用箭头函数 （删除function 在括号后加=>   es6 有作用域的父集，谁有作用域就指向谁）
        // self.skyPosition -= self.skyStep;
        // self.el.style.backgroundPositionX = self.skyPosition + 'px';
        // 有耦合的地方将其合并
        // }, 30)
    },

    birdJump: function () {
        //判断小鸟高度
        this.birdTop = this.birdTop === 220 ? 260 : 220;
        this.oBird.style.top = this.birdTop + 'px';
    },

    birdFly: function (count) {
        // this.birdX-=30;
        // this.oBird.style.backgroundPositionX = this.birdX + 'px' ;
        // 接收count值
        this.oBird.style.backgroundPositionX = count % 3 * 30 + 'px';
    },

    birdDrop: function () {
        this.birdTop += ++this.birdStepY;
        this.oBird.style.top = this.birdTop + 'px';

        // 碰撞检测
        this.judgeKnock();
        this.addScore();
    },

    addScore: function () {
        var index = this.score % this.pipeLength;
        var pipeX = this.pipeArr[index].up.offsetLeft;

        if (pipeX < 13) {
            // this.score ++;
            this.oScore.innerText = ++this.score;
        }
    },

    judgeKnock: function () {
        this.judgeBoundary();
        this.judgePipe();
    },

    judgeBoundary: function () {
        // 顶部距离
        if (this.birdTop <= this.minTop || this.birdTop >= this.maxTop) {
            this.failGame();
        }
    },

    judgePipe: function () {
        // 0 1 2 3 4 5 6 7 8 9
        // 通过分数判断第几条柱子
        var index = this.score % this.pipeLength;
        // 危险值 pipeX = left
        var pipeX = this.pipeArr[index].up.offsetLeft;
        // 数组中的y存放着安全距离（高度）
        var pipeY = this.pipeArr[index].y;
        var birdY = this.birdTop;
        
        if ((pipeX <= 95 && pipeX >= 13) && (birdY <= pipeY[0] || birdY >= pipeY[1])) {
            this.failGame();
        }
        // console.log(pipeX)
    },

    createPipe: function (x) {
        // 生成div到HTML网页中
        // 随机生成随机高度 50~150px
        //  上下距离相等 150px
        // （600-150）/2=225
        var upHeight = 50 + Math.floor(Math.random() * 175);
        var downHeight = 450 - upHeight;
        var oUpPipe = createEle('div', ['pipe', 'pipe-up'], {
            height: upHeight + 'px',
            left: x + 'px',
        });
        var oDownPipe = createEle('div', ['pipe', 'pipe-down'], {
            height: downHeight + 'px',
            left: x + 'px',
        });

        this.el.appendChild(oUpPipe);
        this.el.appendChild(oDownPipe);

        this.pipeArr.push({
            up: oUpPipe,
            down: oDownPipe,
            y: [upHeight, upHeight + 150 - 30],
        })
        // var oDiv = document.createElement('div');
        // oDiv.classList.add('pipe');
        // oDiv.classList.add('pipe-up');
        // this.el.appendChild(oDiv);
        // oDiv.style.height = upHeight + 'px';
        // oDiv.style.left = x + 'px';

        // var oDiv1 = document.createElement('div');
        // oDiv1.classList.add('pipe');
        // oDiv1.classList.add('pipe-down');
        // oDiv1.style.height = downHeight + 'px';
        // this.el.appendChild(oDiv1);
        // oDiv1.style.left = x + 'px';
        // 测试函数格式
        // this.createEle('p',['a','b','c'],{
        //     'color':'red',
        //     'height':'30px',
        //     'width':'50px',
        // });
    },

    // createEle: function (eleName, classArr, styleObj) {

    //     var dom = document.createElement(eleName);

    //     for (var i = 0; i < classArr.length; i++) {
    //         dom.classList.add(classArr[i]);
    //     }

    //     for (var key in styleObj) {
    //         dom.style[key] = styleObj[key];
    //     }

    //     return dom;
    //     // console.log(dom);
    // },
    pipeMove: function () {
        for (var i = 0; i < this.pipeLength; i++) {
            var oUpPipe = this.pipeArr[i].up;
            var oDownPipe = this.pipeArr[i].down;
            var x = oUpPipe.offsetLeft - this.skyStep;



            if (x < -52) {
                var lastPipeLeft = this.pipeArr[this.pipeLastIndex].up.offsetLeft;
                oUpPipe.style.left = lastPipeLeft + 300 + 'px';
                oDownPipe.style.left = lastPipeLeft + 300 + 'px';

                this.pipeLastIndex = i;
                // 不然下面管子的left重新赋值
                continue

            }


            oUpPipe.style.left = x + 'px';
            oDownPipe.style.left = x + 'px';

        }
    },

    startBound: function () {
        var prevColor = this.startColor;
        this.startColor = this.startColor === 'blue' ? 'white' : 'blue';
        this.oStart.classList.remove('start-' + prevColor);
        this.oStart.classList.add('start-' + this.startColor);
    },

    handleStart: function () {
        var self = this;
        // 加bind是为了更改函数内容的this
        this.oStart.onclick = this.start.bind(this);
        // this.oStart.onclick = function () {
        //     //this == this.oStart
        //     self.startFlag = true;
        //     self.oScore.style.display = 'block';
        //     self.skyStep = 5;
        //     self.oStart.style.display = 'none';
        //     self.oBird.style.left = 80 + 'px';
        //     self.oBird.style.transition = 'none';

        //     for (var i = 0; i < self.pipeLength; i++) {
        //         self.createPipe(300 * (i + 1));
        //     }

        // }
    },
    // 点击重新开始直接执行这个函数
    start: function () {
        var self = this;
        self.startFlag = true;
        self.oScore.style.display = 'block';
        self.skyStep = 5;
        self.oStart.style.display = 'none';
        self.oBird.style.left = '80px';
        self.oBird.style.transition = 'none';

        for (var i = 0; i < self.pipeLength; i++) {
            self.createPipe(300 * (i + 1));
        }
    },
    handleClick: function () {
        var self = this;
        this.el.onclick = function (e) {
            var dom = e.target;
            // dom.getAttribute('class') === 'start';
            var isStart = dom.classList.contains('start');

            // console.log(dom);
            if (!isStart) {
                self.birdStepY = -10;
            }
        }
    },
    handleRestart: function () {
        this.oRestart.onclick = function () {
            // 判断是否有重新玩
            // 如果有就直接进入重新开始的页面，不进入游戏开始的页面
            sessionStorage.setItem('play', true);
            window.location.reload();
        };
    },
    failGame: function () {
        console.log("gg");
        clearInterval(this.timer);
        this.setScore();
        this.oMask.style.display = 'block';
        this.oEnd.style.display = 'block';
        this.oBird.style.display = 'none';
        this.oScore.style.display = 'none';
        this.oFinalScore.innerText = this.score;
        // 排行榜
        this.renderRankList();
    },

    setScore: function () {
        this.scoreArr.push({
            score: this.score,
            time: this.getDate()
        })
        // 排序排名
        this.scoreArr.sort(function (a, b) {
            return b.score - a.score;
        })

        // this.scoreArr.length>8?8:this.scoreArr.length;
        var scoreLength = this.scoreArr.length;
        this.scoreArr.length = scoreLength > 8 ? 8 : scoreLength;

        setLocal('score', this.scoreArr);
    },
    getDate: function () {
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var hour = d.getHours();
        var minute = d.getMinutes();
        var second = d.getSeconds();

        return `${year}.${month}.${day} ${hour}.${minute}.${second}`
    },
    renderRankList: function () {
        var template = '';

        // 循环数组长度，不能填数字，没有索引值
        for (var i = 0; i < this.scoreArr.length; i++) {
            var degreeClass = '';
            switch (i) {
                case 0:
                    degreeClass = 'first';
                    break;
                case 1:
                    degreeClass = 'second';
                    break;
                case 2:
                    degreeClass = 'third';
                    break;
            }
            // 添加到html内
            template += `<li class="rank-item">
        <span class="rank-degree ${degreeClass}">${i + 1}</span>
        <span class="rank-score">${this.scoreArr[i].score}</span>
        <span class="rank-time">${this.scoreArr[i].time}</span>
    </li>`;


        }



        this.oRankList.innerHTML = template;
    },
};

bird.init();



var score = [
    {
        score: 1,
        time: '2000.5.33 25:24'
    }
];