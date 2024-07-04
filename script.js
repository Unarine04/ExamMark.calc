class Calculator {
    constructor(screenElement, keysElement) {
        this.screenElement = screenElement;
        this.keysElement = keysElement;
        this.clear();
        this.setupEventListeners();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                computation = prev / current;
                break;
            default:
                return;
        }
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    updateDisplay() {
        this.screenElement.value = this.currentOperand;
    }

    convertUnits(conversionType) {
        if (this.currentOperand === '') return;
        let result;
        const value = parseFloat(this.currentOperand);
        if (isNaN(value)) return;
        if (conversionType === 'toInches') {
            result = value / 2.54;
        } else if (conversionType === 'toCm') {
            result = value * 2.54;
        }
        this.currentOperand = result;
        this.updateDisplay();
    }

    calculateBMI() {
        this.clear();
        this.screenElement.placeholder = "Enter height (m)";
        this.isBMIMode = true;
    }

    enterBMI(value) {
        if (!this.height) {
            this.height = parseFloat(value);
            if (!isNaN(this.height)) {
                this.screenElement.value = '';
                this.screenElement.placeholder = "Enter weight (kg)";
            } else {
                this.screenElement.placeholder = "Invalid height. Enter height (m)";
            }
        } else {
            const weight = parseFloat(value);
            if (!isNaN(weight)) {
                const bmi = weight / (this.height * this.height);
                this.currentOperand = `BMI: ${bmi.toFixed(2)}`;
                this.height = null;
                this.isBMIMode = false;
                this.screenElement.placeholder = "";
                this.updateDisplay();
            } else {
                this.screenElement.placeholder = "Invalid weight. Enter weight (kg)";
            }
        }
    }

    setupEventListeners() {
        this.keysElement.addEventListener('click', event => {
            const { target } = event;
            const { value } = target;
            if (!target.matches('button')) return;

            if (this.isBMIMode) {
                if (value === 'all-clear') {
                    this.clear();
                    this.isBMIMode = false;
                    this.screenElement.placeholder = "";
                } else {
                    this.enterBMI(value);
                }
            } else {
                switch (value) {
                    case '+':
                    case '-':
                    case '*':
                    case '/':
                        this.chooseOperation(value);
                        break;
                    case '=':
                        this.compute();
                        break;
                    case 'all-clear':
                        this.clear();
                        break;
                    case 'toInches':
                    case 'toCm':
                        this.convertUnits(value);
                        break;
                    case 'bmi':
                        this.calculateBMI();
                        break;
                    default:
                        this.appendNumber(value);
                }
            }
            this.updateDisplay();
        });
    }
}

const calculator = new Calculator(
    document.querySelector('.calculator-screen'),
    document.querySelector('.calculator-keys')
);
