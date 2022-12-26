const opList = ["", "+", "-", "*", "/", "^"];
var interval;

if(localStorage.getItem('secScore') == null){
    localStorage.setItem('secScore', '00');
}
if(localStorage.getItem('minScore') == null){
    localStorage.setItem('secScore', '00');
}

// =================================================================//
function allowDrop(ev) {
ev.preventDefault();
}

function drag(ev) {
ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev, destID) {
ev.preventDefault();
var data = ev.dataTransfer.getData("text");
ev.target.appendChild(document.getElementById(data));
dropDown(destID);
let dest = 'box' + destID;
document.getElementById(dest).removeEventListener("dragover", allowDrop);
}
// =================================================================//

function dragOverBorder(boxID) {
    let dest = 'box' + boxID;
    document.getElementById(dest).style.border = "2px dashed rgb(29, 234, 29)";
}

function dragLeaveBorder(boxID) {
    let dest = 'box' + boxID;
    document.getElementById(dest).style.border = "2px dashed rgb(192, 6, 6)";
}

function dropDown(boxID){
    let dest = 'box' + boxID;
    document.getElementById(dest).style.border = "none";
}

function enableDrop(boxID) {
    let dest = 'box' + boxID;
    document.getElementById(dest).addEventListener("dragover", allowDrop);
    document.getElementById(dest).style.border = "5px ridge #fff";
    // document.getAnimations(dest).style.backgroundColor = "white";
    // document.getElementById(dest).addEventListener("dragover", function(){
    //     dragOverBorder(boxID)
    // });
    // document.getElementById(dest).addEventListener("dragleave", function(){
    //     dragLeaveBorder(boxID)
    // });
}

function showNum(num, destID) {
    let dest = 'available' + destID;
    document.getElementById(dest).innerHTML = num;
}

function changeOp(destID) {
    let dest = 'box' + destID;
    let currentOp = document.getElementById(dest).innerHTML;
    let nextOp = 0;

    if(currentOp == '') nextOp = 1;
    else{
        for(var i = 1; i < 5; i++) {
            if(currentOp == opList[i]){
                nextOp = i + 1;
                break;
            }
        }
    }

    document.getElementById(dest).innerHTML = opList[nextOp];
}

function enableChangeOp(destID) {
    let dest = 'box' + destID;
    document.getElementById(dest).addEventListener("click", function() {
        changeOp(destID)
    });
    document.getElementById(dest).classList.add("opGrid");
}

function setUp(num1, num2, num3, num4, num5, op1, op2, op3, op4, result){
    let max = 0;
    let num = [num1, num2, num3, num4, num5];
    let op = [op1,op2,op3,op4];

    for(var i = 0; i < 5; i++) {
        if(num[i] != 0) max++;
    }

    let j = 0
    for(var i = 0; i < max; i++) {
        while(num[j] == 0) j++;
        showNum(num[j], i+1);
        j++;
    }

    let dest = 6-max;
    for(var i = 1; i <= max; i++) {
        enableDrop(dest);
        dest = dest + 2;
    }

    dest = 7-max;
    for(var i = 1; i <= max-1; i++) {
        enableChangeOp(dest);
        dest = dest + 2;
    }

    document.getElementById('hint').innerHTML = '';
    for(var i = 0; i < 4; i++){
        if(op[i] == 1) document.getElementById('hint').innerHTML += '+' + ' ';
        else if(op[i] == 2) document.getElementById('hint').innerHTML += '-' + ' ';
        else if(op[i] == 3) document.getElementById('hint').innerHTML += '*' + ' ';
        else if(op[i] == 4) document.getElementById('hint').innerHTML += '/' + ' ';
        else if(op[i] == 5) document.getElementById('hint').innerHTML += '^' + ' ';
    }

    document.getElementById('res').innerHTML = result;
}

function check() {
    let answer = [];
    answer[0] = document.getElementById('box1').innerText;
    answer[1] = document.getElementById('box2').innerText;
    answer[2] = document.getElementById('box3').innerText;
    answer[3] = document.getElementById('box4').innerText;
    answer[4] = document.getElementById('box5').innerText;
    answer[5] = document.getElementById('box6').innerText;
    answer[6] = document.getElementById('box7').innerText;
    answer[7] = document.getElementById('box8').innerText;
    answer[8] = document.getElementById('box9').innerText;

    let number = [0,0,0,0,0];
    let operator = [0,0,0,0];
    let numCount = 0;
    let opCount = 0;

    for(var i = 0; i <= 8; i++) {
        let cond = 0;
        for(var j = 1; j <= 5; j++) {
            if(answer[i] == opList[j]){
                operator[opCount] = j;
                opCount++;
                cond = 1;
                break;
            }
        }
        if(cond == 0 && answer[i] != ''){
            number[numCount] = answer[i];
            numCount++;
        }
    }
    
    let total = calculate(number[0], number[1], number[2], number[3], number[4], operator[0], operator[1], operator[2], operator[3]);
    let wanted = document.getElementById('res').innerText;
    let condition = localStorage.getItem("lvlindex");
    if(condition != 0){
        if(total == wanted) response(1);
        else response(2);
    }
    else if(condition == 0){
        if(total == wanted){
            response(0);
        }
    }
}

function response(condition){
    if (condition == 0){
        clearInterval(interval);
        let currMin = document.getElementById('minute').innerHTML;
        let currSec = document.getElementById('sec').innerHTML;
        let highMin = document.getElementById('highmin').innerHTML;
        let highSec = document.getElementById('highsec').innerHTML;

        if(currMin < highMin){
            highMin = currMin;
            highSec = currSec;
            localStorage.setItem("minScore", highMin);
            localStorage.setItem("secScore", highSec);

            document.getElementById('msg1').innerHTML = 'New HighScore!!';
            document.getElementById('msg2').innerHTML = 'Super Excellent';
        }
        else if(currMin == highMin){
            if(highSec == 00||currSec < highSec){
                highSec = currSec;
                localStorage.setItem("secScore", highSec);

                document.getElementById('msg1').innerHTML = 'New HighScore!!';
                document.getElementById('msg2').innerHTML = 'Super Excellent';
            }
        }
        
        openPopup();
    }
    else if (condition == 1){
        openPopup();
    }
    else if (condition == 2){
        document.getElementById('msg1').innerHTML = 'Wrong Answer';
        document.getElementById('msg2').innerHTML = 'Better Luck Next Time';
        document.getElementById('restartbtn').innerText = 'TRY AGAIN';
        openPopup();
    }
}

function calculate(num1, num2, num3, num4, num5, op1, op2, op3, op4){
    let num = [num1, num2, num3, num4, num5];
    let op = [op1, op2, op3, op4];
    let total = 0;

    for(var scan = 1; scan <= 3; scan++) {
        if(scan == 1){
            for(var i = 0; i < 4; i++){
                if(op[i] == 5) {
                    let nextNum = i + 1;
                    while(num[nextNum] == 0){
                        nextNum++;
                    }
                    total = Math.pow(num[i] , num[nextNum]);
                    num[nextNum] = total;
                    num[i] = 0;
                }
            }
        }
        else if(scan == 2){
            for(var i = 0; i < 4; i++){
                if(op[i] == 3){
                    let nextNum = i + 1;
                    while(num[nextNum] == 0){
                        nextNum++;
                    }
                    total = Number(num[i]) * Number(num[nextNum]);
                    num[nextNum] = total;
                    num[i] = 0;
                }
                else if(op[i] == 4) {
                    let nextNum = i + 1;
                    while(num[nextNum] == 0){
                        nextNum++;
                    }
                    total = Math.floor(Number(num[i]) / Number(num[nextNum]));
                    num[nextNum] = total;
                    num[i] = 0;
                }
            }
        }
        else if(scan == 3){
            for(var i = 0; i < 4; i++){
                if(op[i] == 1){
                    let nextNum = i + 1;
                    while(num[nextNum] == 0){
                        nextNum++;
                    }
                    total = Number(num[i]) + Number(num[nextNum]);
                    num[nextNum] = total;
                    num[i] = 0;
                }
                else if(op[i] == 2) {
                    let nextNum = i + 1;
                    while(num[nextNum] == 0){
                        nextNum++;
                    }
                    total = Number(num[i]) - Number(num[nextNum]);
                    num[nextNum] = total;
                    num[i] = 0;
                }
            }
        }
    }
    return total;
}

let popup = document.getElementById('popupmsg');

function openPopup(){
    popup.classList.add("open-popup");
}

function closePopup(){
    popup.classList.remove("open-popup");
}

function unCover(){
    setTimeout(function(){
        document.getElementById('cover').classList.add("uncover");
    }, 1000);
}

function backtoMenu(){
    document.getElementById('popupmsg').classList.remove("open-popup");
    document.getElementById('lvlcover').classList.add("coverup");
    setTimeout(function(){
        location.replace('Numerize/main.html');
    },2000);
}

function gotolvl(index){
    closePopup();
    document.getElementById('cover').classList.add("coverup");
    setTimeout(function(){
        location.replace('Numerize/level.html');
        localStorage.setItem("lvlindex", index);
    },2000);
}

function showlvl(){
    setTimeout(function(){
        document.getElementById('lvlcover').classList.add("uncover");
    }, 1000);
    
    let index = localStorage.getItem("lvlindex");
    if(index == 0){
        document.querySelector('.comment').classList.add("display");
        document.getElementById('lvltitle').innerHTML = "<span id='minute'>00</span> &nbsp;:&nbsp; <span id='sec'>00</span>";
        stopwatch();

        // if(localStorage.getItem('minScore') > 0 || localStorage.getItem('secScore') > 0){
            document.getElementById('highmin').innerHTML = localStorage.getItem('minScore');
            document.getElementById('highsec').innerHTML = localStorage.getItem('secScore');
        // }
        // else{
        //     document.getElementById('highmin').innerHTML = '-';
        //     document.getElementById('highsec').innerHTML = '-';    
        // }

        let recNum = [0,0,0,0,0];
        let recOp = [0,0,0,0];
        let max = 0;

        recNum[0] = getRandomInt(10);
        recNum[1] = getRandomInt(10);
        for(var i = 2; i < 5; i++){
            recNum[i] = getRandomInt(10);
        }

        for(var i = 0; i < 5; i++) {
            if(recNum[i] != 0) max++;
        }

        for(var i = 0; i < max - 1; i++){
            recOp[i] = Number(getRandomInt(2)) + 1;
        }

        let wantedRes = calculate(recNum[0],recNum[1],recNum[2],recNum[3],recNum[4],recOp[0],recOp[1],recOp[2],recOp[3]);

        setUp(recNum[0], recNum[1], recNum[2], recNum[3], recNum[4], recOp[0], recOp[1], recOp[2], recOp[3], wantedRes);
    }
    else{
        document.querySelector('.tipsbtn').classList.add("display");
        document.getElementById('lvltitle').innerText = 'LEVEL ' + index;

        if(index == 1){
            setUp(3,4,0,0,0,3,0,0,0,12);
        }
        else if(index == 2){
            setUp(1,2,3,0,0,1,1,0,0,6);
        }
        else if(index == 3){
            setUp(2,3,7,0,0,2,5,0,0,15);
        }
        else if(index == 4){
            setUp(2,5,6,9,0,1,3,4,0,24);
        }
        else if(index == 5){
            setUp(2,2,3,8,5,2,3,5,0,182);
        }
    }

}

function stopwatch(){
    interval =  setInterval(function(){
                    let sec = document.getElementById('sec').innerHTML;
                    let min = document.getElementById('minute').innerHTML;
                    if(sec < 59){
                        sec = Number(sec) + 1;
                        if(sec < 10) sec = '0' + sec;
                    }
                    else{
                        min = Number(min) + 1;
                        if(min < 10) min = '0' + min;
                        sec = '00';
                    }
                    document.getElementById('sec').innerHTML = sec;
                    document.getElementById('minute').innerHTML = min;
                    
                }, 1000);
}

function restart(){
    document.getElementById('popupmsg').classList.remove("open-popup");
    document.getElementById('lvlcover').classList.add("coverup");
    setTimeout(function(){
        location.reload();
    },2000);
}

function getRandomInt(max){
    return (Number(Math.floor(Math.random() * max)));
}

function displayTips(){
    document.querySelector('.hint').classList.add("display");
}
