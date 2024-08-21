const displayElement = document.querySelector("#game-container");

let characterElement = document.createElement("div");
// let obstecleElement = document.createElement("div");

characterElement.setAttribute("id", "character");

displayElement.appendChild(characterElement);

let currently_jumping = false;

const calculateJump = () => {
  const LITTLE_G = 10;
  const INITIAL_VELOCITY = 70;
  const flight_time = (2 * INITIAL_VELOCITY) / LITTLE_G;

  // let new_velocity = INITIAL_VELOCITY - LITTLE_G*timing_counter;
  const heights_array = Array(flight_time + 1).fill(0);

  heights_array.forEach(
    (value, index, array) =>
      (array[index] = `${
        INITIAL_VELOCITY * index - (LITTLE_G * index * index) / 2
      }px`)
  );
  return heights_array;
};

function jumpAnimationTracker(jumpArray) {
  let step_counter = 0;

  const execute = setInterval(() => {
    if (step_counter >= jumpArray.length) {
      currently_jumping = false;
      clearInterval(execute); // Stop the interval if the condition is met
      return;
    }

    characterElement.style.bottom = jumpArray[step_counter];
    step_counter++;
  }, 100);

  // Return a function to clear the interval
  return () => clearInterval(execute);
}

const handleKeyup = (e) => {
  e.preventDefault();

  if (e.code === "Space") {
    if (currently_jumping === false) {
      currently_jumping = true;
      jumpAnimationTracker(calculateJump());
    }
  }
};

document.addEventListener("keyup", handleKeyup);

function generateObstecle() {
  setInterval(function () {
    let obstecleElement = document.createElement("div");
    obstecleElement.classList.add("obstacle");
    displayElement.appendChild(obstecleElement);
  }, 3000);
  setInterval(checkCollision, 100);
}

generateObstecle();

// equation of motion ----
// height = v*t - g*t*t/2  g=9.8 v=10 t=(20*timing_counter)/1000

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
  alert("Game Over!");
  resetGame();
}

function resetGame() {
  document
    .querySelectorAll(".obstacle")
    .forEach((obstacle) => obstacle.remove());
  characterElement.style.bottom = "0px";
}
