import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.keypad button');
    const clearButton = document.getElementById('clear');

    let currentValue = '';
    let operator = '';
    let previousValue = '';

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;

            if (value >= '0' && value <= '9' || value === '.') {
                currentValue += value;
                display.value = currentValue;
            } else if (['+', '-', '*', '/'].includes(value)) {
                if (currentValue !== '') {
                    if (previousValue !== '') {
                        calculate();
                    }
                    previousValue = currentValue;
                    currentValue = '';
                    operator = value;
                }
            } else if (value === '=') {
                calculate();
            }
        });
    });

    clearButton.addEventListener('click', () => {
        currentValue = '';
        operator = '';
        previousValue = '';
        display.value = '';
    });

    async function calculate() {
        if (previousValue !== '' && currentValue !== '' && operator !== '') {
            const num1 = parseFloat(previousValue);
            const num2 = parseFloat(currentValue);
            let result;

            try {
                switch (operator) {
                    case '+':
                        result = await backend.add(num1, num2);
                        break;
                    case '-':
                        result = await backend.subtract(num1, num2);
                        break;
                    case '*':
                        result = await backend.multiply(num1, num2);
                        break;
                    case '/':
                        result = await backend.divide(num1, num2);
                        break;
                }

                display.value = result.toString();
                previousValue = result.toString();
                currentValue = '';
                operator = '';
            } catch (error) {
                display.value = 'Error';
                console.error('Calculation error:', error);
            }
        }
    }
});
