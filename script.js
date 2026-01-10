const board = document.querySelector("#board");
const cols = Math.floor(board.clientWidth / 50);
const rows = Math.floor(board.clientHeight / 50);

const scoreElement = document.querySelector("#score");
const levelElement = document.querySelector("#level");
const livesElement = document.querySelectorAll(".live");

let score = 0;
let level = 1;
let lives = 3;
let speed = 300;
levelElement.innerText = level;

const blocks = {};
let collisionBlocks = [];

/* ================== SNAKE (FIXED) ================== */
/* Head is at index 0 and moving RIGHT into empty space */
const snake = [
  { x: 2, y: 7 }, // head
  { x: 2, y: 6 },
  { x: 2, y: 5 },
];

let direction = "right";
let intervalId = null;

/* ================== FOOD ================== */
const foodItem = [
  { score: 10, img: "https://pnglove.com/data/img/720_mpvW.jpg" },
  {
    score: 20,
    img: "https://i.pinimg.com/736x/32/f0/1c/32f01cfcf9ba1dbe20a546f4dff08fd3.jpg",
  },
  {
    score: 30,
    img: "https://i.pinimg.com/736x/b3/a6/a4/b3a6a4d0e359e8ac9a1c22731baffedc.jpg",
  },
];

let foodItemIndex = Math.floor(Math.random() * foodItem.length);

const img = document.createElement("img");
img.classList.add("food-image");

/* ================== GRID ================== */
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    blocks[`${r}-${c}`] = block;
  }
}

/* ================== HELPERS ================== */
function generateFood() {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
  } while (
    snake.some((s) => s.x === pos.x && s.y === pos.y) ||
    collisionBlocks.some((w) => w.x === pos.x && w.y === pos.y)
  );
  return pos;
}

let foodPosition = generateFood();

function generateWalls() {
  collisionBlocks = [];

  if (level >= 2) {
    for (let i = 0; i < cols; i++) {
      collisionBlocks.push({ x: 0, y: i });
      collisionBlocks.push({ x: rows - 1, y: i });
    }
  }

  if (level >= 3) {
    for (let i = 0; i < rows; i++) {
      collisionBlocks.push({ x: i, y: 0 });
      collisionBlocks.push({ x: i, y: cols - 1 });
    }
  }

  if (level >= 4) {
    for (let i = 5; i < cols - 5; i++) {
      collisionBlocks.push({ x: Math.floor(rows / 2), y: i });
    }
  }

  // Safety: remove walls overlapping snake
  collisionBlocks = collisionBlocks.filter(
    (w) => !snake.some((s) => s.x === w.x && s.y === w.y)
  );
}

// reset snake position
function resetSnake() {
  snake.length = 0;
  snake.push({ x: 2, y: 7 }, { x: 2, y: 6 }, { x: 2, y: 5 });
  direction = "right";
}

/* ================== GAME LOOP ================== */
function render() {
  Object.values(blocks).forEach((b) =>
    b.classList.remove("fill", "collision-block")
  );

  let head = { ...snake[0] };

  let hit = false;

  if (direction === "left") head.y--;
  if (direction === "right") head.y++;
  if (direction === "up") head.x--;
  if (direction === "down") head.x++;

  /* -------- BOUNDARY -------- */
  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    hit = true;
  }

  /* -------- WALL -------- */
  for (let wall of collisionBlocks) {
    if (head.x === wall.x && head.y === wall.y) {
      hit = true;
      break;
    }
  }

  /* -------- SELF -------- */
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      hit = true;
      break;
    }
  }

  // Handle hit scenario
  if (hit) {
    lives--;
    if (livesElement[lives]) {
      livesElement[lives].classList.add("lives-end");
    }

    if (lives === 0) {
      gameOver();
      return;
    }

    resetSnake();
    return;
  }

  /* -------- FOOD -------- */
  let ateFood = false;
  if (head.x === foodPosition.x && head.y === foodPosition.y) {
    score += foodItem[foodItemIndex].score;
    foodItemIndex = Math.floor(Math.random() * foodItem.length);
    foodPosition = generateFood();
    ateFood = true;
  }

  snake.unshift(head);
  if (!ateFood) snake.pop();

  scoreElement.innerText = score;

  /* -------- LEVEL -------- */
  let prevLevel = level;

  if (score >= 200 && score < 400) {
    level = 2;
    speed = 250;
  } else if (score >= 400 && score < 600) {
    level = 3;
    speed = 200;
  } else if (score >= 600 && score < 800) {
    level = 4;
    speed = 150;
  } else if (score >= 800) {
    level = 5;
    speed = 100;
  }

  if (level !== prevLevel) {
    levelElement.innerText = level;
    generateWalls();
    startGameLoop();
  }

  /* -------- DRAW -------- */
  snake.forEach((s) => blocks[`${s.x}-${s.y}`].classList.add("fill"));

  collisionBlocks.forEach((w) =>
    blocks[`${w.x}-${w.y}`]?.classList.add("collision-block")
  );

  img.src = foodItem[foodItemIndex].img;
  blocks[`${foodPosition.x}-${foodPosition.y}`].appendChild(img);
}

function gameOver() {
  alert("Game Over: ");
  clearInterval(intervalId);
}

function startGameLoop() {
  clearInterval(intervalId);
  intervalId = setInterval(render, speed);
}

/* ================== START ================== */
generateWalls();
startGameLoop();

/* ================== CONTROLS ================== */
addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction !== "down") direction = "up";
  if (e.key === "ArrowDown" && direction !== "up") direction = "down";
  if (e.key === "ArrowLeft" && direction !== "right") direction = "left";
  if (e.key === "ArrowRight" && direction !== "left") direction = "right";
});
