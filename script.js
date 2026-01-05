const board = document.querySelector("#board");
const cols = Math.floor(board.clientWidth / 50);
const rows = Math.floor(board.clientHeight / 50);
const scoreElement = document.querySelector("#score");
const highScoreElemnt = document.querySelector("#high-score");
const levelElement = document.querySelector("#level");
const timeElement = document.querySelector("#time");

let score = 0;
let level = 1;
let speed = 300;
levelElement.innerText = level;

const blocks = [];
const snake = [
  {
    x: 2,
    y: 5,
  },
  {
    x: 2,
    y: 6,
  },
  {
    x: 2,
    y: 7,
  },
];

const collisionBlocks = [
  {
    x: 1,
    y: 1,
  },
  {
    x: 1,
    y: 2,
  },
  {
    x: 2,
    y: 2,
  },
];

let foodPosition = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};
snake.forEach((segment) => {
  if (segment.x === foodPosition.x && segment.y === foodPosition.y) {
    foodPosition = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
  }
});

let foodItem = [
  {
    foodItem: 1,
    foodName: "Apple",
    score: 10,
    img: "https://pnglove.com/data/img/720_mpvW.jpg",
  },
  {
    foodItem: 2,
    foodName: "Banana",
    score: 20,
    img: "https://i.pinimg.com/736x/32/f0/1c/32f01cfcf9ba1dbe20a546f4dff08fd3.jpg",
  },
  {
    foodItem: 3,
    foodName: "Cherry",
    score: 30,
    img: "https://i.pinimg.com/736x/b3/a6/a4/b3a6a4d0e359e8ac9a1c22731baffedc.jpg",
  },
];
let foodItemIndex = Math.floor(Math.random() * foodItem.length);

let direction = "right";
let intervalId = null;

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    // block.innerText = `${row},${col}`;
    blocks[`${row}-${col}`] = block;
  }
}

const img = document.createElement("img");
img.classList.add("food-image");


function render() {
  let head = snake[0];

  img.setAttribute("src", foodItem[foodItemIndex].img);
  blocks[`${foodPosition.x}-${foodPosition.y}`].appendChild(img);

  // direction logic
  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  }

  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });

  //   game over logic
  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    alert("game over");
    clearInterval(intervalId);
  }
  

  //   food consume logic
  if (head.x === foodPosition.x && head.y === foodPosition.y) {
    score += foodItem[foodItemIndex].score;
    foodItemIndex = Math.floor(Math.random() * foodItem.length);

    foodPosition = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    snake.push(head);
  }

  scoreElement.innerText = score;

  snake.unshift(head);
  snake.pop();

  snake.forEach((segment) => {
    if (segment.x === foodPosition.x && segment.y === foodPosition.y) {
      foodPosition = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols),
      };
    }
  });

  // speed increase logic
  let previousLevel = level;

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

  if (level !== previousLevel) {
    levelElement.innerText = level;
    startGameLoop();
  }

  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.add("fill");
  });

  collisionBlocks.forEach((block) => {
    blocks[`${block.x}-${block.y}`].classList.add("collision-block");
  });
}

function startGameLoop() {
  clearInterval(intervalId);

  intervalId = setInterval(() => {
    render();
  }, speed);
}

startGameLoop();

addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    direction = "up";
  } else if (e.key === "ArrowDown") {
    direction = "down";
  } else if (e.key === "ArrowLeft") {
    direction = "left";
  } else if (e.key === "ArrowRight") {
    direction = "right";
  }
});
