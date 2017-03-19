// 我需要一个事件监听器
var EventHandlerUtil ={
    addHandler:function(element,type,handler){
        if(element.addEventListener){
            //w3c
            element.addEventListener(type,handler,false);
        }else if(element.attachEvent){
            //ie
            element.attachEvent('on'+type,handler);
        }else{
            //dom0
            element['on'+type] = handler;
        }
    },
    removeHandler:function(element,type,handler){
        if(element.removeEventListener){
            //w3c
            element.removeEventListener(type,handler,false);
        }else if(element.detachEvent){
            //ie
            element.detachEvent('on'+type,handler);
        }else{
            //dom0
            element['on'+type] = null;
        }
    }
};


// 变量定义区域开始
// 保存临时计算变量
var n1 = null;
// 保存计算变量和结果变量
var n2 = null;
// 保存计算符号 
var op=null;
// 
// 保存临时输入的数值，用数组是为了方便退格记忆
var tempNumber = [];
// 保存小数点的按下状态，每次输入只能有一个小数点，默认为false
var haveDot = false;
// 保存正数状态，默认输入为正数
var isPositiveNum = true;
// 变量定义区域结束


// 获取点击的数字
var elementNums = document.getElementById('num');

EventHandlerUtil.addHandler(elementNums,'click',function(e){
    var target = e.target ? e.target : window.event.srcElement;
    if(target.tagName ==='LI'){
        var targetValue = target.innerHTML;
        if(targetValue ==='.' && !haveDot){
            // 用户输入小数点 ，此时没有输入过小数点
            tempNumber.push('.');
            haveDot = true;
        }else if(targetValue ==='.' && haveDot){
            // 用户输入小数点，此时已经输入过小数点
            return false;//每次一个小数点，什么也不做退出
        }else if(targetValue ==='+/-' && isPositiveNum){
            // 用户改变正负数，此时为正数
            tempNumber.unshift('-');
            isPositiveNum = false;
        }else if(targetValue ==='+/-' && !isPositiveNum){
            // 用户改变正负数，此时为负数
            tempNumber.shift();
            isPositiveNum = true;
        }else{
            //正常输入数字
            tempNumber.push(targetValue);
        }

        setN1(tempNumber);
    }
});

function setN1(arg) {
    // 用于将传入的数组转换为数字
    var temp = arg.join('');
    if(!isNaN(parseFloat(temp))){
        n1 = parseFloat(temp);
        show(tempNumber);
    }else{
        n1 = null;
        show(0);
    }
}
function show(arg){
    var elementScreen = document.getElementById('result');

    if(Array.isArray(arg)){
        elementScreen.innerHTML = parseFloat(arg.join(''));
    }else if(!isNaN(arg)){
        elementScreen.innerHTML = parseFloat(arg.toFixed(6));
    }else{
        elementScreen.innerHTML = arg;
    }
}



/*
普通运算功能，四则运算，带连续计算
 */
var elementControl = document.getElementById('control');

EventHandlerUtil.addHandler(elementControl,'click',function(e){
    var target = e.target? e.target : window.event.srcElement;
    if(target.tagName === 'LI'){
        var targetValue = target.innerHTML;

        if(targetValue === 'c'){
            // 输入退格的处理
            tempNumber.pop();
            setN1(tempNumber);
        }else if(targetValue === '√'){
            // 一元计算，开方
            if(n1 !== null){
                n2 = Math.sqrt(n1);
                show(n2);
                // 需要重置掉n1和tempnumber
                reset();
            }
        }else if(targetValue.match(/[\+\-×÷%]/)){
            // 普通四则运算符号
            // 考虑到连续运算的可能，每次点过计算符号之后先运算之前的操作符，再获取当前的运算符
            calculate();
            op = targetValue;
        }else{
            // 只剩下按=的情况
            calculate(); 
        }
    }
});
function reset(){
    n1 = null;
    tempNumber = [];
}
var calculate = function(){
    if(n2 === null){
        // 如果现在n2为null，说明此时没有输入第二个数字，需要做的操作是交换变量，清空暂存器
        n2 = n1;
        reset();
    }else{
        // 这种情况下可以肯定第一组数据完备，n1 n2都有值，如果还被按下运算符号说明用户是要连续计算了
        switch(op){
            case '+':
                n2 += n1;
                reset();
                show(n2);
                break;
            case '-':
                n2 -=n1;
                reset();
                show(n2);
                break;
            case '×':
                // +-的时候n1为null无所谓，并不会运算，但是乘除要注意
                if(n1 !== null){
                    n2 *=n1;
                    reset();
                    show(n2);
                }
                break;
            case '÷':
                if(n1 === 0){
                    show('除数不能为0');
                }else if(n1 !==null){
                    n2 /=n1;
                    reset();
                    show(n2);
                }
                break;
            case '%':
                if(n1 === 0){
                    show('除数不能为0');
                }else if(n1 !==null){
                    n2 %=n1;
                    reset();
                    show(n2);
                }
                break;
            default:
                console.log('不应该会看到这个，看到了说明有bug');
        }
    }
};




/*
高级计算器区域
 */
var elementPro = document.getElementById('pro');
EventHandlerUtil.addHandler(elementPro,'click',function(e){
   var target = e.target? e.target : window.event.srcElement;
   if(target.tagName ==='LI'){
    var targetValue = target.innerHTML;

    switch(targetValue){
        case 'AC':
            n1 = null;
            n2 = null;
            tempNumber=[];
            show(0);
            break;
        case 'sin':
            if(n1 !== null){
                n2 = parseFloat(Math.sin(n1 * 2 * Math.PI /360).toFixed(6));
                reset();
                show(n2);
            }
            break;
        case 'cos':
            if(n1 !== null){
                n2 = parseFloat(Math.cos(n1 * 2 * Math.PI /360).toFixed(6));
                reset();
                show(n2);
            }
            break;
        case 'tan':
            if(n1 !== null){
                n2 = parseFloat(Math.tan(n1 * 2 * Math.PI /360).toFixed(6));
                reset();
                show(n2);
            }
            break;
        default:
            console.log('能看见这个也是不对的');
    }
   }
});















