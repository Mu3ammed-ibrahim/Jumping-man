const game = () => {

  const displayElement = document.querySelector(".game-container");

  let currently_jumping = false;
  let tracker_id = 0;
  let score = 0;
  let scoreElement = document.querySelector("#score");
  let game_in_progress = false;
  let game_over = false;

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

  }

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

  function createObstacleManager() {
    let obstacleInterval;
    let collisionInterval;
    let isRunning = false;
    let lastObstacleTime = Date.now();
    let minGap = 1200; // Initial gap
    let score = 0;

    function start() {
      if (isRunning) return; // Prevent multiple intervals if already running
      isRunning = true;
      game_in_progress = true;
      obstacleInterval = setInterval(function () {
        let currentTime = Date.now();

        if (currentTime - lastObstacleTime >= minGap) {
          let obstacleElement = document.createElement("div");
          obstacleElement.classList.add("obstacle");
          displayElement.appendChild(obstacleElement);

          minGap = 1200 + Math.random() * 1000;

          obstacleElement.style.animation = "moveObstacle 3s linear forwards";

          obstacleElement.addEventListener("animationend", function () {
            obstacleElement.remove();
            score++;
            scoreElement.textContent = `Score: ${score}`;
          });

          lastObstacleTime = currentTime;
        }
      }, 500);

      collisionInterval = setInterval(checkCollision, 100);
    }

    function stop() {
      // if (!isRunning) return;
      let current_obstacles = document.querySelectorAll(".obstacle");
      current_obstacles.forEach(child => child.style.animationPlayState = 'paused');
      clearInterval(obstacleInterval);
      clearInterval(collisionInterval);
      isRunning = false;
      game_in_progress = false;
    }

    function resume() {
      if (isRunning) return; // Prevent multiple intervals if already running
      start();
    }

    function reset() {
      stop();
      lastObstacleTime = Date.now();
      minGap = 1200; // Reset gap to initial value
      score = 0;
      scoreElement.textContent = `Score: ${score}`;
      document
      .querySelectorAll(".obstacle")
      .forEach((obstacle) => obstacle.remove());
    }


    return {
      start: start,
      stop: stop,
      resume: resume,
      reset: reset,
      getScore: function () {
        return score;
      }
    };
  }

  obstacle_manager = createObstacleManager();

  function endGame() {
    currently_jumping = false;
    game_over = true;
    let finalScoreElement = document.querySelector(".final-score");
    let finalScoreContainerElement = document.querySelector(".final-score-container");
    finalScoreElement.textContent = `Your final score is: ${obstacle_manager.getScore()}`
    finalScoreContainerElement.classList.toggle('fade-in');
    obstacle_manager.stop();

    //resetGame();
  }

  function resetGame() {
    let finalScoreContainerElement = document.querySelector(".final-score-container");
    finalScoreContainerElement.classList.toggle('fade-in');
    characterElement.style.bottom = "0px";
    obstacle_manager.reset();
    obstacle_manager.start();
    scoreElement.textContent = `Score: ${obstacle_manager.getScore()}`;
  }

  let characterElement = document.createElement("div");
  characterElement.setAttribute("id", "character");

  let proceed_to_next = false;
  let narrator_segment_counter = 0;

  const animateLetterElement = document.querySelectorAll("header h1 p");
  const narratorElement = document.querySelector(".narrator-content-target");
  const welcomeContainer = document.querySelector("#welcome-container");
  const welcomeElement = document.querySelector(".welcome-dialog-box");
  animateLetterElement.forEach((child, index) => {
    child.style.left = `${4.6 * index}rem`;
    setTimeout(() => {
      child.classList.toggle('intro_animation');
      child.classList.toggle('fade-in');
    }, 100 * index)

    setTimeout(() => {
      child.classList.toggle('intro_animation')
    }, (100 * index) + 400)
  });


  const narrator_speach_elements =
    ["HI!",
      "Can you help us?",
      "Click the screen if you can see what I am telling you!",
      "This is Jilly",
      "JILLY NEEDS HELP!!",
      "Press the Spacebar to make Jilly jump",
      "Great!!",
      "Jump Jilly over the oncoming obstacles to score points !!",
      "Hit Enter to start or pause the game"
    ];

  const sequence_one = () => {

    narrator_segment_counter++;
    welcomeElement.focus();

    setTimeout(() => {
      welcomeElement.classList.add('open');

      setTimeout(() => {
        narratorElement.textContent = narrator_speach_elements[0];
        narratorElement.classList.toggle("animate-narrator-text");
      }, 1000);

      setTimeout(() => {
        narratorElement.classList.toggle("animate-narrator-text");
      }, 2500)

      setTimeout(() => {
        narratorElement.textContent = narrator_speach_elements[1];
        narratorElement.classList.toggle("animate-narrator-text");
      }, 3500)

      setTimeout(() => {
        narratorElement.classList.toggle("animate-narrator-text");
      }, 5000)

      setTimeout(() => {
        narratorElement.textContent = narrator_speach_elements[2];
        narratorElement.classList.toggle("animate-narrator-text");
        proceed_to_next = true;
      }, 6500)


    }, 2000)
  }

  const sequence_two = () => {

    narrator_segment_counter++
    narratorElement.classList.toggle("animate-narrator-text");
    narratorElement.textContent = "";

    setTimeout(() => {
      narratorElement.classList.toggle("animate-narrator-text");
      narratorElement.textContent = narrator_speach_elements[3];
    }, 1000);

    setTimeout(() => {
      narratorElement.classList.toggle("animate-narrator-text");
    }, 2500)


    setTimeout(() => {
      narratorElement.textContent = narrator_speach_elements[4];
      narratorElement.classList.toggle("animate-narrator-text");
      welcomeElement.appendChild(characterElement);
    }, 3500);

    setTimeout(() => {
      narratorElement.classList.toggle("animate-narrator-text");
    }, 5000)

    setTimeout(() => {
      narratorElement.textContent = narrator_speach_elements[5];
      narratorElement.classList.toggle("animate-narrator-text");
      proceed_to_next = true;
      welcomeElement.appendChild(characterElement);
    }, 6000);

  };

  const sequence_three = () => {

    narrator_segment_counter++
    narratorElement.classList.toggle("animate-narrator-text");
    narratorElement.textContent = "";

    setTimeout(() => {
      narratorElement.classList.toggle("animate-narrator-text");
      narratorElement.textContent = narrator_speach_elements[6];
    }, 1000);

    setTimeout(() => {
      narratorElement.classList.toggle("animate-narrator-text");
    }, 2500)


    setTimeout(() => {
      narratorElement.textContent = narrator_speach_elements[7];
      narratorElement.classList.toggle("animate-narrator-text");
      welcomeElement.appendChild(characterElement);
    }, 3500);

    setTimeout(() => {
      narratorElement.classList.toggle("animate-narrator-text");
    }, 5000)

    setTimeout(() => {
      narratorElement.textContent = narrator_speach_elements[8];
      narratorElement.classList.toggle("animate-narrator-text");
      proceed_to_next = true;
    }, 6000);

  };

  const sequence_four = () => {
    narrator_segment_counter++;
    game_in_progress = true;
    narratorElement.classList.toggle("animate-narrator-text");
    characterElement.remove();
    setTimeout(() => {
      welcomeElement.classList.toggle("open");
      welcomeContainer.classList.toggle("open");
    }, 400)

    setTimeout(() => {
      displayElement.appendChild(characterElement);
      // generateObstacle();
      obstacle_manager.start();
    }, 1500)
  }

  const handleKeydown = (e) => {

    if (e.code === "Space") {
      if (currently_jumping === false) {
        currently_jumping = true;
        tracker_id = jumpAnimationTracker(calculateJump());
      }
    }

    if (proceed_to_next === true) {
      if (narrator_segment_counter === 2) {
        if (e.code === "Space") {
          proceed_to_next = false;
          sequence_three();
        }
      };


      if (narrator_segment_counter === 3) {
        if ((e.code === "Enter") || (e.code === "NumpadEnter")) {
          proceed_to_next = false;
          sequence_four();
        }
      }
    }

    if (proceed_to_next === false) {
      if (narrator_segment_counter <=3) return;
      if ((e.code === "Enter") || (e.code === "NumpadEnter")) {
        let current_obstacles = document.querySelectorAll(".obstacle");
        if (game_in_progress === true) {
          game_in_progress = false;
          obstacle_manager.stop();
        } else if (game_in_progress === false) {
          game_in_progress = true;
          current_obstacles.forEach(child => child.style.animationPlayState = 'running')
          obstacle_manager.resume();
        }
      }
    }

    if (game_over === true){
      if ((e.code === "Enter") || (e.code === "NumpadEnter")){
        game_over=false;
        resetGame();
      }
    }
  }

  const handleClick = (e) => {

    if (narrator_segment_counter === 1)
      if (proceed_to_next === true) {
        proceed_to_next = false;
        sequence_two();
      }
  };

  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("click", handleClick);

  sequence_one();
}

game();