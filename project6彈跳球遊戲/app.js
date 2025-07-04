const c = document.getElementById("myCanvas");
const myCanvasHeight = c.height;
const myCanvasWidth = c.width;
const ctx = c.getContext("2d");
let circle_x = 160;
let circle_y = 60;
let radius = 20;
let xSpeed = 20;
let ySpeed = 20;
let ground_x = 100;
let ground_y = 500;
let ground_height = 5;
let brickArray = [];
let count = 0;

function getRandomArbitrary(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    brickArray.push(this);
    this.visible = true;
  }
  drawBrick() {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  touchingBall(ballX, ballY) {
    return (
      ballX + radius >= this.x &&
      ballX - radius <= this.x + this.width &&
      ballY - radius <= this.y + this.height &&
      ballY + radius >= this.y
    );
  }
}

//製作所有Brick
for (let i = 0; i < 10; i++) {
  new Brick(getRandomArbitrary(0, 950), getRandomArbitrary(0, 300));
}

c.addEventListener("mousemove", (e) => {
  ground_x = e.clientX;
});

function drawCircle() {
  brickArray.forEach((brick, index) => {
    if (brick.visible && brick.touchingBall(circle_x, circle_y)) {
      count++;
      console.log(count);
      brick.visible = false;
      if (circle_y >= brick.y + brick.height || circle_y <= brick.y) {
        ySpeed = -ySpeed;
      } else if (circle_x <= brick.x || circle_x >= brick.x + brick.width) {
        xSpeed = -xSpeed;
      }
    }
  });

  //反彈
  reboundAndDie();

  //更動圓座標
  circle_x += xSpeed;
  circle_y += ySpeed;

  //畫出黑背景
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, myCanvasWidth, myCanvasHeight);

  //畫出所有Brick
  brickArray.forEach((brick) => {
    if (brick.visible) {
      brick.drawBrick();
    }
  });

  //畫出地板
  ctx.fillStyle = "lightgreen";
  ctx.fillRect(ground_x, ground_y, 200, ground_height);

  //畫出圓球
  //(x , y , radius , startAngle , endAngle)
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "aqua";
  ctx.fill();
  if (count == 10) {
    alert("遊戲結束");
    clearInterval(game);
  }
}

function reboundAndDie() {
  // 左右邊界
  if (circle_x + radius >= myCanvasWidth || circle_x - radius <= 0) {
    xSpeed = -xSpeed;
  }

  // 上邊界
  if (circle_y - radius <= 0) {
    ySpeed = -ySpeed;
  }

  // 地板碰撞檢測
  if (
    circle_x + radius >= ground_x &&
    circle_x - radius <= ground_x + 200 &&
    circle_y + radius >= ground_y &&
    circle_y - radius <= ground_y + 5
  ) {
    if (ySpeed > 0) {
      circle_y -= 40;
    } else {
      circle_y += 40;
    }
    ySpeed = -ySpeed;
  }

  // 下邊界 - 遊戲結束判定
  if (circle_y >= myCanvasHeight) {
    alert("Game Over");
    clearInterval(game); // 停止遊戲
  }
}

let game = setInterval(drawCircle, 25);
