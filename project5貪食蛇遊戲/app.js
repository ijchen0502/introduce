const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
//getContext()method會回傳一個canvas的drawing context
//用來在canvas內畫圖
const unit = 20;
const row = canvas.height / unit;
const column = canvas.width / unit;

let snake = []; //array中的每個element，都是object
//object的工作是，儲存身體的x,y座標
function createSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };

  snake[1] = {
    x: 60,
    y: 0,
  };

  snake[2] = {
    x: 40,
    y: 0,
  };

  snake[3] = {
    x: 20,
    y: 0,
  };
}

//果實
class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }
  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickALocation() {
    let overlapping;
    let new_x, new_y;

    do {
      overlapping = false;
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;

      for (let i = 0; i < snake.length; i++) {
        if (new_x === snake[i].x && new_y === snake[i].y) {
          overlapping = true;
          break;
        }
      }
    } while (overlapping);

    this.x = new_x;
    this.y = new_y;
  }
}

// 初始設定
createSnake();
let myFruit = new Fruit();

window.addEventListener("keydown", changeDirection);
let d = "Right";
function changeDirection(e) {
  if ((e.key == "ArrowLeft" || e.key === "a") && d != "Right") {
    d = "Left";
  } else if ((e.key == "ArrowUp" || e.key === "w") && d != "Down") {
    d = "Up";
  } else if ((e.key == "ArrowRight" || e.key === "d") && d != "Left") {
    d = "Right";
  } else if ((e.key == "ArrowDown" || e.key === "s") && d != "Up") {
    d = "Down";
  }

  window.removeEventListener("keydown", changeDirection);
}

let score = 0;
let highestScore;
loadHighestScore();
document.getElementById("myScore").innerHTML = "遊戲分數：" + score;
document.getElementById("myScore2").innerHTML = "歷史最高分數：" + highestScore;

function draw() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("遊戲結束");
      return;
    }
  }

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  myFruit.drawFruit();

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i == 0 ? "green" : "lightgreen";
    ctx.strokeStyle = "white";

    if (snake[i].x >= canvas.width) snake[i].x = 0;
    if (snake[i].x < 0) snake[i].x = canvas.width - unit;
    if (snake[i].y >= canvas.height) snake[i].y = 0;
    if (snake[i].y < 0) snake[i].y = canvas.height - unit;

    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (d == "Left") snakeX -= unit;
  if (d == "Right") snakeX += unit;
  if (d == "Up") snakeY -= unit;
  if (d == "Down") snakeY += unit;

  let newHead = { x: snakeX, y: snakeY };

  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    myFruit.pickALocation();
    score++;
    setHighestScore(score);
    document.getElementById("myScore").innerHTML = "遊戲分數：" + score;
    document.getElementById("myScore2").innerHTML =
      "歷史最高分數：" + highestScore;
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
  window.addEventListener("keydown", changeDirection);
}

let myGame = setInterval(draw, 100);

function loadHighestScore() {
  highestScore = localStorage.getItem("highestScore")
    ? Number(localStorage.getItem("highestScore"))
    : 0;
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}

// 新增：右下角按鈕和彈出視窗邏輯

// 選擇按鈕與彈出視窗元素
const infoButton = document.getElementById("infoButton");
const infoPopup = document.getElementById("infoPopup");
const closeBtn = document.querySelector(".popup .close");

// 點擊按鈕顯示彈出視窗
infoButton.addEventListener("click", () => {
  infoPopup.style.display = "block";
});

// 點擊關閉按鈕關閉彈出視窗
closeBtn.addEventListener("click", () => {
  infoPopup.style.display = "none";
});

// 點擊視窗外部也關閉彈出視窗
window.addEventListener("click", (e) => {
  if (e.target == infoPopup) {
    infoPopup.style.display = "none";
  }
});
