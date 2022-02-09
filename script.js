const ROUND_DIGIT = 9;
const DIGIT_LIMIT = 11;
const body = document.querySelector('body');
const buttons = document.querySelectorAll('.btn');
const inputScr = document.querySelector('.input');
const equationScr = document.querySelector('.equation');
let inputText = '0';
let obtainCommand = {
    'period': '.',
    'zero': '0',
    'one': '1',
    'two': '2',
    'three': '3',
    'four': '4',
    'five': '5',
    'six': '6',
    'seven': '7',
    'eight': '8',
    'nine': '9',
    'backspace': 'BKSP',
    'sign': 'SIGN',
    'percent': 'PCNT',
    'clear': 'CLR',
    'multiply': '×',
    'divide': '÷',
    'add': '+',
    'subtract': '-',
    'equal': '=',
}
let equation = {
    operands: [],
    operator: '',
    process: function (number, newOperator) {
        let operands = this.operands;
        let oldOperator = this.operator;
        let a, b, ans;

        if (number) {
            if (number.endsWith('.'))
                number = number.slice(0, -1);
            operands.push(number);
        }

        if (operands.length === 2) {
            a = operands[0];
            b = operands[1];
            ans = operate(a, b, oldOperator);
            this.operands = [ans];

            if(ans.length > DIGIT_LIMIT) {
                clearAll();
                return;
            }
        }

        if (ans && newOperator === '=') {
            inputText = ans;
            display(equationScr, a + oldOperator + b + newOperator);
            this.operator = newOperator;
            this.operands = [];
            return true;
        }
        else if (newOperator !== '=') {
            display(equationScr, this.operands[0] + newOperator);
            this.operator = newOperator;
        }

        inputText = '';
        return false;
    },
    clear: function () {
        display(equationScr, '');
        this.operands = [];
        this.operator = '';
    },
}

init();

function init() {
    display(inputScr, inputText);
    buttons.forEach((btn) => {
        btn.addEventListener('click', onBtnClick);
    });
    body.addEventListener
}

function onBtnClick(event) {
    const id = event.currentTarget.id;
    processInput(obtainCommand[id]);
}

function processInput(str) {
    // is it just me who thinks 
    // that having break statement in default looks more organized?
    switch (str) {
        case '×':
        case '÷':
        case '-':
        case '+':
        case '=':
            if (equation.process(inputText, str))
                display(inputScr, inputText);
            break;
        case '.':
            if (!inputText.includes('.'))
                inputText += '.';
            display(inputScr, inputText);
            break;
        case 'BKSP':
            if (inputText !== '0')
                inputText = inputText.slice(0, -1);
            if (inputText === '-' || inputText === '')
                inputText = '0';
            display(inputScr, inputText);
            break;
        case 'SIGN':
            if (inputText.startsWith('-'))
                inputText = inputText.slice(1);
            else
                inputText = '-' + inputText;
            if(inputText === '-')
                inputText = '-0';
            display(inputScr, inputText);
            break;
        case 'PCNT':
            inputText = operate(inputText, '100', '÷');
            display(inputScr, inputText);
            break;
        case 'CLR':
            clearAll();
            break;
        default:
            if (inputText === '0') inputText = '';
            else if (inputText === '-0') inputText = '-';
            inputText += str;
            display(inputScr, inputText);
            break;
    }
    if(inputText.length > DIGIT_LIMIT) clearAll();
}

function display(screen, text) {
    screen.textContent = text;
}

function clearAll() {
    inputText = '0';
    display(inputScr, inputText);
    equation.clear();
}

function operate(a, b, operator) {
    let ans;
    a = Number(a);
    b = Number(b);
    switch (operator) {
        case '×': ans = a * b; break;
        case '÷': ans = a / b; break;
        case '+': ans = a + b; break;
        case '-': ans = a - b; break;
        default: throw 'unrecognizable operator';
    }
    ans = +ans.toFixed(ROUND_DIGIT);
    return ans.toString();
}