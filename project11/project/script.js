const bingoCard = document.getElementById('bingo-card');
const newCardButton = document.getElementById('new-card');
const drawNumberButton = document.getElementById('draw-number');
const resetGameButton = document.getElementById('reset-game');
const currentNumberElement = document.getElementById('current-number');
const drawnNumbersElement = document.getElementById('drawn-numbers');
const winMessageElement = document.getElementById('win-message');

let drawnNumbers = [];
let hasWon = false;

function initGame() {
    generateBingoCard();
    resetDrawnNumbers();
    hasWon = false;
    winMessageElement.style.display = 'none';
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateBingoNumbers() {
    const numbers = {
        B: [],
        I: [],
        N: [],
        G: [],
        O: []
    };
    for (let i = 0; i < 5; i++) {
        let num;
        do {
            num = getRandomNumber(1, 15);
        } while (numbers.B.includes(num));
        numbers.B.push(num);

        do {
            num = getRandomNumber(16, 30);
        } while (numbers.I.includes(num));
        numbers.I.push(num);

        do {
            num = getRandomNumber(31, 45);
        } while (numbers.N.includes(num));
        numbers.N.push(num);

        do {
            num = getRandomNumber(46, 60);
        } while (numbers.G.includes(num));
        numbers.G.push(num);

        do {
            num = getRandomNumber(61, 75);
        } while (numbers.O.includes(num));
        numbers.O.push(num);
    }

    return numbers;
}

function generateBingoCard() {

    const cells = bingoCard.querySelectorAll('.cell');
    cells.forEach(cell => cell.remove());
    const numbers = generateBingoNumbers();
    const columns = ['B', 'I', 'N', 'G', 'O'];
    columns.forEach((column, colIndex) => {
        numbers[column].forEach((number, rowIndex) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            if (column === 'N' && rowIndex === 2) {
                cell.textContent = 'FREE';
                cell.classList.add('free', 'marked');
                cell.dataset.marked = 'true';
            } else {
                cell.textContent = number;
                cell.dataset.number = number;
                cell.dataset.marked = 'false';
            }

            cell.addEventListener('click', () => toggleCell(cell));

            bingoCard.appendChild(cell);
        });
    });
}

function toggleCell(cell) {
    if (cell.classList.contains('free')) return;
    const isMarked = cell.dataset.marked === 'true';
    if (isMarked) {
        cell.classList.remove('marked');
        cell.dataset.marked = 'false';
    } else {
        cell.classList.add('marked');
        cell.dataset.marked = 'true';
        checkForWin();
    }
}

function drawNumber() {
    if (drawnNumbers.length >= 75) {
        alert('All numbers have been drawn!');
        return;
    }

    let number;
    do {
        number = getRandomNumber(1, 75);
    } while (drawnNumbers.includes(number));

    drawnNumbers.push(number);
    currentNumberElement.textContent = getLetterForNumber(number) + number;
    const numberSpan = document.createElement('span');
    numberSpan.textContent = number;
    drawnNumbersElement.appendChild(numberSpan);

    autoMarkNumber(number);
}

function getLetterForNumber(number) {
    if (number <= 15) return 'B';
    if (number <= 30) return 'I';
    if (number <= 45) return 'N';
    if (number <= 60) return 'G';
    return 'O';
}

function autoMarkNumber(number) {
    const cells = bingoCard.querySelectorAll('.cell');
    cells.forEach(cell => {
        if (cell.dataset.number == number) {
            cell.classList.add('marked');
            cell.dataset.marked = 'true';
            checkForWin();
        }
    });
}

function resetDrawnNumbers() {
    drawnNumbers = [];
    currentNumberElement.textContent = '--';
    drawnNumbersElement.innerHTML = '';
}

function checkForWin() {

    if (hasWon) return;
    const cells = bingoCard.querySelectorAll('.cell');
    const cellArray = Array.from(cells);
    const rows = 5;
    const cols = 5;
    for (let row = 0; row < rows; row++) {
        let rowWin = true;
        for (let col = 0; col < cols; col++) {
            const index = row * cols + col;
            if (cellArray[index].dataset.marked !== 'true') {
                rowWin = false;
                break;
            }
        }
        if (rowWin) {
            declareWin();
            return;
        }
    }

    for (let col = 0; col < cols; col++) {
        let colWin = true;
        for (let row = 0; row < rows; row++) {
            const index = row * cols + col;
            if (cellArray[index].dataset.marked !== 'true') {
                colWin = false;
                break;
            }
        }
        if (colWin) {
            declareWin();
            return;
        }
    }

    let diag1Win = true;
    let diag2Win = true;
    for (let i = 0; i < rows; i++) {
        if (cellArray[i * cols + i].dataset.marked !== 'true') {
            diag1Win = false;
        }

        if (cellArray[i * cols + (cols - 1 - i)].dataset.marked !== 'true') {
            diag2Win = false;
        }
    }

    if (diag1Win || diag2Win) {
        declareWin();
    }
}

function declareWin() {
    hasWon = true;
    winMessageElement.style.display = 'block';
}

newCardButton.addEventListener('click', generateBingoCard);
drawNumberButton.addEventListener('click', drawNumber);
resetGameButton.addEventListener('click', initGame);

initGame();