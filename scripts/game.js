const displayElement = document.querySelector("#game-container");

let characterElement = document.createElement("div");
characterElement.setAttribute("id", "character");
displayElement.appendChild(characterElement);

let currently_jumping = false;
let tracker_id = 0;
let score = 0;
let scoreElement = document.querySelector("#score");

const calculateJump = () => {
  const LITTLE_G = 10;
  const INITIAL_VELOCITY = 65;
  const flight_time = (2 * INITIAL_VELOCITY) / LITTLE_G;

  const heights_array = Array(flight_time + 1).fill(0);

  heights_array.forEach(
    (value, index, array) =>
      (array[index] = `${Math.floor(
        INITIAL_VELOCITY * index - (LITTLE_G * index * index) / 2
      )}px`)
  );
  return heights_array;
};

function jumpAnimationTracker(jumpArray) {
  let step_counter = 0;

  const execute = setInterval(() => {
    if (step_counter >= jumpArray.length) {
      currently_jumping = false;
      clearInterval(execute);
      return;
    }

    characterElement.style.bottom = jumpArray[step_counter];
    step_counter++;
  }, 40);

  // Return a function to clear the interval
  const clear_jump = () => clearInterval(execute);
 
}

const handleKey = (e) => {
  e.preventDefault();

  if (e.code === "Space") {
    if (currently_jumping === false) {
      currently_jumping = true;
      tracker_id = jumpAnimationTracker(calculateJump());
    }
  }
};

document.addEventListener("keydown", handleKey);

let obstacleInterval;
let collisionInterval;
let lastObstacleTime = 0;
let minGap = 1500;
let reduceGapCounter = 0; // To track the number of times the gap has been reduced

// Initial values
const maxReductions = 3; // Number of times the gap can be reduced
const reductionAmount = 300; // Amount to reduce the gap each time


function generateObstacle() {
  obstacleInterval = setInterval(function () {
    let currentTime = Date.now();

    if (currentTime - lastObstacleTime >= minGap) {
      let obstacleElement = document.createElement("div");
      obstacleElement.classList.add("obstacle");
      displayElement.appendChild(obstacleElement);

      minGap = Math.max(800,minGap);
      // minGap = minGap + Math.random()*500;

      obstacleElement.style.animation = "moveObstacle 3s linear forwards";

      obstacleElement.addEventListener("animationend", function () {
        obstacleElement.remove();
        scoreElement.textContent = `Score: ${score}`;
        updateScore();
      });

      lastObstacleTime = currentTime;
    }
  }, 500);

  collisionInterval = setInterval(checkCollision, 100);
}
function updateScore() {
    score++;
    console.log("Score:", score);
  
    // Check if the score is a multiple of 10 and the gap reduction hasn't happened more than 3 times
    if (score % 10 === 0 && reduceGapCounter < maxReductions) {
      minGap = Math.max(800, minGap - reductionAmount); // Reduce the gap, but don't let it go below 800ms
      reduceGapCounter++;
      console.log("Gap reduced to:", minGap);
    }
  }

function startObstacle() {
  setInterval(generateObstacle, 3000);
}

startObstacle();

function checkCollision() {
  const characterRect = characterElement.getBoundingClientRect();
  const obstacles = document.querySelectorAll(".obstacle");
  obstacles.forEach((obstacle) => {
    const obstacleRect = obstacle.getBoundingClientRect();
    if (
      obstacleRect.right > characterRect.left &&
      obstacleRect.left < characterRect.right &&
      obstacleRect.bottom > characterRect.top &&
      obstacleRect.top < characterRect.bottom
    ) {
      endGame();
    }
  });
}

function endGame() {
  currently_jumping = false;
  alert(`Game Over! Your final score is: ${score}`);

  clearInterval(obstacleInterval);
  clearInterval(collisionInterval);

  resetGame();
}

function resetGame() {
  document
    .querySelectorAll(".obstacle")
    .forEach((obstacle) => obstacle.remove());
  characterElement.style.bottom = "0px";
  score = 0;
  scoreElement.textContent = `Score: ${score}`;
}
