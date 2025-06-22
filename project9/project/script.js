

const gameArea = document.getElementById('gameArea');
const basket = document.getElementById('basket');
const scoreDisplay = document.getElementById('score');

let score = 0;
let basketSpeed = 10;
let presentSpeed = 3;
let gameInterval;
const presentCreationInterval = 1000;
const gameSpeed = 30;
let gameActive = true;

function moveBasket(direction) {
    if (!gameActive) return;
    const currentLeft = parseInt(basket.style.left) || 250;
    let newLeft = currentLeft + direction *basketSpeed;


    if (newLeft < 0) {
        newLeft = 0;
    } else if (newLeft > gameArea.offsetWidth - basket.offsetWidth) {
        newLeft = gameArea.offsetWidth - basket.offsetWidth;
    }
    basket.style.left = newLeft + 'px';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        moveBasket(-1);
    } else if (e.key === 'ArrowRight') {
        moveBasket(1);
    }
});

function createPresent() {
    if (!gameActive) return;
    const present = document.createElement('div');
    present.classList.add('present');
    const randomX = Math.random() * (gameArea.offsetWidth - 30);
    present.style.left = randomX + 'px';
    gameArea.appendChild(present);


    let presentTop = 0;
    const fallInterval = setInterval(() => {
        if (!gameActive) {
            clearInterval(fallInterval);
            return;
        }
        presentTop += presentSpeed;
        present.style.top = presentTop + 'px';


        if (
            presentTop + 30 > gameArea.offsetHeight - basket.offsetHeight &&
            presentTop < gameArea.offsetHeight &&
            parseInt(present.style.left) < parseInt(basket.style.left) + basket.offsetWidth &&
            parseInt(present.style.left) + 30 > parseInt(basket.style.left)
        ) {
            score++;
            scoreDisplay.textContent = 'Score: ' + score;
            present.remove();
            clearInterval(fallInterval);
        }


        if (presentTop > gameArea.offsetHeight) {
            present.remove();
            clearInterval(fallInterval);
            endGame();
        }
    }, gameSpeed);
}

function startGame() {
    score = 0;
    scoreDisplay.textContent = 'Score: 0';
    basket.style.left = '250px';
    gameActive = true;


    const presents = document.querySelectorAll('.present');
    presents.forEach(present => present.remove());


    clearInterval(gameInterval);
    gameInterval = setInterval(createPresent, presentCreationInterval);
}

function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    const gameOverMessage = document.createElement('div');
    gameOverMessage.style.position = 'absolute';
    gameOverMessage.style.top = '50%';
    gameOverMessage.style.left = '50%';
    gameOverMessage.style.transform = 'translate(-50%, -50%)';
    gameOverMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    gameOverMessage.style.color = '#fff';
    gameOverMessage.style.padding = '20px';
    gameOverMessage.style.borderRadius = '10px';
    gameOverMessage.style.fontSize = '20px';
    gameOverMessage.style.textAlign = 'center';
    gameOverMessage.innerHTML = `Game Over!<br>Your final score: ${score}<br>Press F5 or refresh to restart`;
    gameArea.appendChild(gameOverMessage);

    document.addEventListener('keydown', restartGameHandler);
}

function restartGameHandler() {
    const gameOverMessage = gameArea.querySelector('div');
    if (gameOverMessage) {
        gameOverMessage.remove();
    }
    document.removeEventListener('keydown', restartGameHandler);
    startGame();
}


startGame();