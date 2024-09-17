// Get canvas id and context
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext("2d");

// Game

// === Variables - START === 

// Interval variable
let interval = 0;

// Ball variables
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
const ballRadius = 10;

// Paddle variables
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

// Bricks variables
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// Initialize bricks array
const bricks = [];
for(let c = 0; c < brickColumnCount; c++){
  bricks[c] = [];

  for(let r = 0; r < brickRowCount; r++){
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// Score variable
let score = 0;

// Player lives variable
let lives = 3;

// === Variables - END === 

// === Functions - START === 

// Draw ball
function drawBall(){
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Draw Paddle
function drawPaddle(){
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Draw bricks
function drawBricks(){
  for(let c = 0; c < brickColumnCount; c++){
    for(let r = 0; r < brickRowCount; r++){
      if(bricks[c][r].status){
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;

        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Common draw function
function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  // Collision detection for top/bottom limits
  if(y + dy < ballRadius){
    dy = -dy;
  }else if(y + dy > canvas.height - ballRadius){
    if(x > paddleX && x < paddleX + paddleWidth){
      dy = -dy;
    }else{
      lives--;
      if(!lives){
        alert('GAME OVER!!');
        document.location.reload();
      }else{
        // reset paddle for user to play next life
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  // Collision detection for left/right limits
  if(x + dx < ballRadius || x + dx > canvas.width - ballRadius){
    dx = -dx;
  }

  x += dx;
  y += dy;

  // Paddle moving logic
  if(rightPressed){
    paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
  }else if(leftPressed){
    paddleX = Math.max(paddleX - 7, 0);
  }
  requestAnimationFrame(draw);
};

// function to listen to key presses
function keyDownHandler(e){
  if(e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if(e.key === 'Left' || e.key === 'ArrowLeft'){
    leftPressed = true;
  }
}

function keyUpHandler(e){
  if(e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if(e.key === 'Left' || e.key === 'ArrowLeft'){
    leftPressed = false;
  }
}

// function to listen to mouse movements

// In this function we first work out a relativeX value, which is equal to the horizontal mouse position 
// in the viewport (e.clientX) minus the distance between the left edge of the canvas and left edge of the 
// viewport (canvas.offsetLeft) — effectively this is equal to the distance between the canvas left edge and 
// the mouse pointer. If the relative X pointer position is greater than zero and lower than the Canvas width, 
// the pointer is within the Canvas boundaries, and the paddleX position (anchored on the left edge of the paddle) 
// is set to the relativeX value minus half the width of the paddle, so that the movement will actually be relative 
// to the middle of the paddle.

function mouseMoveHandler(e){
  const relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width){
    paddleX = relativeX - paddleWidth / 2;
  }
}

// Collision detection for bricks and ball
function collisionDetection(){
  for(let c = 0; c < brickColumnCount; c++){
    for(let r = 0; r < brickRowCount; r++){
      const b = bricks[c][r];

      // calculations
      // Collision has happened if all below four statements are true:
      // The x position of the ball is greater than the x position of the brick.
      // The x position of the ball is less than the x position of the brick plus its width.
      // The y position of the ball is greater than the y position of the brick.
      // The y position of the ball is less than the y position of the brick plus its height.

      if(b.status){
        if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight){
          dy = -dy;
          b.status = 0; // Disappear brick from screen
          score++; // increment the score
          // Show winner message on detroying all bricks
          if(score === brickColumnCount * brickRowCount){
            alert('WINNER!! Congratulations!');
            document.location.reload();
          }
        }
      }
    }
  }
}

// Score display
function drawScore(){
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText(`Score: ${score}`, 8, 20);
}

// Player Lives display
function drawLives(){
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

// function to initiate game
function startGame(){
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);
  draw();
}

// === Functions - END === 

// Start game btn
document.getElementById("runButton").addEventListener("click", function(){
  startGame();
  this.disabled = true;
});
