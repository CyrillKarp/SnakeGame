const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

const blockSize = 10;
const widthInBlocks = width / blockSize;
const heightInBlocks = height / blockSize;

let score = 0;

const drawBorder = function() {
    ctx.fillStyle = '#dfe6e9';
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(width - blockSize, 0, blockSize, height);
};

const drawScore = function() {
    ctx.font = '20px Roboto';
    ctx.fillStyle = '#0984e3';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Score: ' + score, blockSize, blockSize);
};

const gameOver = function() {
    playing = false;
    
    const btnPlayAgain = document.getElementById('btn-play-again');
    btnPlayAgain.style.display = 'block';
    btnPlayAgain.addEventListener('click', function() {
        window.location.reload();
    });
    
    ctx.font = '60px Roboto';
    ctx.fillStyle = '#0984e3';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game Over !', width / 2, height / 2);
};

const circle = function(x, y, radius, fillCircle) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);

    if (fillCircle) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
};

const Block = function(col, row) {
    this.col = col;
    this.row = row;
};

Block.prototype.drawSquare = function(color) {
    const x = this.col * blockSize;
    const y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
};

Block.prototype.drawCircle = function(color) {
    const centerX = this.col * blockSize + blockSize / 2;
    const centerY = this.row * blockSize + blockSize / 2;

    ctx.fillStyle = color;
    circle(centerX, centerY, blockSize / 2, true);
};

Block.prototype.equal = function(otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
};

const Snake = function() {
    this.segments = [new Block(26, 25), new Block(25, 25), new Block(24, 25)];
    this.direction = 'right';
    this.nextDirection = 'right';
};

Snake.prototype.draw = function() {
    for (let i = 0; i < this.segments.length; i++) {
        this.segments[i].drawSquare('#0984e3');
    }
};

Snake.prototype.move = function() {
    const head = this.segments[0];
    let newHead;

    this.direction = this.nextDirection;

    if (this.direction === 'right') {
        newHead = new Block(head.col + 1, head.row);
    } else if (this.direction === 'down') {
        newHead = new Block(head.col, head.row + 1);
    } else if (this.direction === 'left') {
        newHead = new Block(head.col - 1, head.row);
    } else if (this.direction === 'up') {
        newHead = new Block(head.col, head.row - 1);
    }
    if (this.checkCollision(newHead)) {
        gameOver();
        return;
    }
    this.segments.unshift(newHead);
    if (newHead.equal(apple.position)) {
        score++;
        animationTime -= 10;
        apple.move();
    } else {
        this.segments.pop();
    }
};

Snake.prototype.checkCollision = function(head) {
    const leftCollision = (head.col === 0);
    const topCollision = (head.row === 0);
    const rightCollision = (head.col === widthInBlocks - 1);
    const bottomCollision = (head.row === heightInBlocks - 1);
    const wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;
    let selfCollision = false;
    for (let i = 0; i < this.segments.length; i++) {
        if (head.equal(this.segments[i])) {
            selfCollision = true;
        }
    }
    return wallCollision || selfCollision;
};

Snake.prototype.setDirection = function(newDirection) {
    if (this.direction === 'up' && newDirection === 'down') {
        return;
    } else if (this.direction === 'right' && newDirection === 'left') {
        return;
    } else if (this.direction === 'down' && newDirection === 'up') {
        return;
    } else if (this.direction === 'left' && newDirection === 'right') {
        return;
    }
    this.nextDirection = newDirection;
};

const Apple = function() {
    this.position = new Block(10, 10);
};

Apple.prototype.draw = function() {
    this.position.drawCircle('#ff7675');
};

Apple.prototype.move = function() {
    const randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
    const randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
    this.position = new Block(randomCol, randomRow);
};

const snake = new Snake();
const apple = new Apple();

let playing = true;
let animationTime = 100;

const gameLoop = function() {
    ctx.clearRect(0, 0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();

    if (playing) {
        setTimeout(gameLoop, animationTime);
    }
};

gameLoop();

const directions = {
    37: 'left',
    65: 'left',
    38: 'up',
    87: 'up',
    39: 'right',
    68: 'right',
    40: 'down',
    83: 'down'
};

addEventListener('keydown', function(event) {
    const newDirection = directions[event.keyCode];
    if (newDirection !== undefined) {
        snake.setDirection(newDirection);
    }
});