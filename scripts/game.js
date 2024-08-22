const displayElement = document.querySelector("#game-container");

let characterElement = document.createElement("div");
// let obstecleElement = document.createElement("div");

characterElement.setAttribute("id", "character");

displayElement.appendChild(characterElement);

let currently_jumping = false;
let tracker_id = 0;

const calculateJump = () => {
  const LITTLE_G = 10;
  const INITIAL_VELOCITY = 65;
  const flight_time = (2 * INITIAL_VELOCITY) / LITTLE_G;

  // let new_velocity = INITIAL_VELOCITY - LITTLE_G*timing_counter;
  const heights_array = Array(flight_time + 1).fill(0);

  heights_array.forEach(
    (value, index, array) =>
      ( array[index] = `${
        Math.floor(INITIAL_VELOCITY * index - (LITTLE_G * index * index) / 2)
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
  }, 33);

  // Return a function to clear the interval
  const clear_jump = () => clearInterval(execute);
  
}

const handleKeyup = (e) => {
  e.preventDefault();

  if (e.code === "Space") {
    if (currently_jumping === false) {
      currently_jumping = true;
      tracker_id = jumpAnimationTracker(calculateJump());
    }
  }
};

document.addEventListener("keyup", handleKeyup);

let obstacleInterval;
let collisionInterval;
let lastObstacleTime = 0;
//used to have more control in spaces between obstacles
let minGap = 1500

function generateObstecle() {
    obstacleInterval = setInterval(function () {
        let currentTime = Date.now();
    
        // Ensure a minimum gap between obstacles
        if (currentTime - lastObstacleTime >= minGap) {
          let obstacleElement = document.createElement("div");
          obstacleElement.classList.add("obstacle");
          displayElement.appendChild(obstacleElement);
    
          // Randomize the gap for more dynamic gameplay
          minGap = 1200 + Math.random() * 1000;
    
          // Move the obstacle across the screen with CSS
          obstacleElement.style.animation = "moveObstacle 3s linear forwards";
    
          // Remove obstacle when animation ends
          obstacleElement.addEventListener("animationend", function () {
            obstacleElement.remove();
          });
    
          // Update the time the last obstacle was generated
          lastObstacleTime = currentTime;
        }
      }, 500); // 
   
   
    collisionInterval = setInterval(checkCollision, 100);

}
function strartObstacle (){
    setInterval(generateObstecle , 3000)
}
strartObstacle()

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

  clearInterval(obstacleInterval);
  clearInterval(collisionInterval);

  resetGame();
}

function resetGame() {
  document
    .querySelectorAll(".obstacle")
    .forEach((obstacle) => obstacle.remove());
  characterElement.style.bottom = "0px";
}
