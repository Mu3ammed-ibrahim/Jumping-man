const game = () => {
  //Global scope constatnts
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

  //Initialise global scope variables
  let currently_jumping = false;
  let game_in_progress = false;
  let game_over = false;
  let proceed_to_next = false;
  let narrator_segment_counter = 0;

  //Gather nodes and nodelists for dynamic manipulation of screen elements
  const display_element = document.querySelector(".game-container");
  const character_element = document.createElement("div");
  const score_element = document.querySelector("#score");
  const animate_letter_element = document.querySelectorAll("header h1 p");
  const narrator_element = document.querySelector(".narrator-content-target");
  const welcome_container_element = document.querySelector("#welcome-container");
  const welcome_element = document.querySelector(".welcome-dialog-box");

  // set the id for the dynamically generated element so it utilises the predefined styles in base.css
  character_element.setAttribute("id", "character");

  //Define Functions section
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

      character_element.style.bottom = jumpArray[step_counter];
      step_counter++;
    }, 40);
  }

  function checkCollision() {
    const character_rect = character_element.getBoundingClientRect();
    const obstacles = document.querySelectorAll(".obstacle");
    obstacles.forEach((obstacle) => {
      const obstacleRect = obstacle.getBoundingClientRect();
      if (
        obstacleRect.right > character_rect.left &&
        obstacleRect.left < character_rect.right &&
        obstacleRect.bottom > character_rect.top &&
        obstacleRect.top < character_rect.bottom
      ) {
        endGame();
      }
    });
  }

  function createObstacleManager() {
    let obstacle_interval;
    let collision_interval;
    let is_running = false;
    let last_obstacle_time = Date.now();
    let min_gap = 1200; // Initial gap
    let score = 0;

    function start() {
      if (is_running) return; // Prevent multiple intervals if already running
      is_running = true;
      game_in_progress = true;
      obstacle_interval = setInterval(function () {
        let currentTime = Date.now();

        if (currentTime - last_obstacle_time >= min_gap) {
          let obstacle_element = document.createElement("div");
          obstacle_element.classList.add("obstacle");
          display_element.appendChild(obstacle_element);

          min_gap = 1200 + Math.random() * 1000;

          obstacle_element.style.animation = "moveObstacle 3s linear forwards";

          obstacle_element.addEventListener("animationend", function () {
            obstacle_element.remove();
            score++;
            score_element.textContent = `Score: ${score}`;
          });

          last_obstacle_time = currentTime;
        }
      }, 500);

      collision_interval = setInterval(checkCollision, 100);
    }

    function stop() {
      // if (!is_running) return;
      let current_obstacles = document.querySelectorAll(".obstacle");
      current_obstacles.forEach(child => child.style.animationPlayState = 'paused');
      clearInterval(obstacle_interval);
      clearInterval(collision_interval);
      is_running = false;
      game_in_progress = false;
    }

    function resume() {
      if (is_running) return; // Prevent multiple intervals if already running
      start();
    }

    function reset() {
      stop();
      last_obstacle_time = Date.now();
      min_gap = 1200; // Reset gap to initial value
      score = 0;
      score_element.textContent = `Score: ${score}`;
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

  function endGame() {
    currently_jumping = false;
    game_over = true;
    let final_score_element = document.querySelector(".final-score");
    let final_score_container_element = document.querySelector(".final-score-container");
    final_score_element.textContent = `Your final score is: ${obstacle_manager.getScore()}`
    final_score_container_element.classList.toggle('fade-in');
    obstacle_manager.stop();
  }

  function resetGame() {
    let final_score_container_element = document.querySelector(".final-score-container");
    final_score_container_element.classList.toggle('fade-in');
    character_element.style.bottom = "0px";
    obstacle_manager.reset();
    obstacle_manager.start();
    score_element.textContent = `Score: ${obstacle_manager.getScore()}`;
  }

  //Animations Section

  animate_letter_element.forEach((child, index) => {
    child.style.left = `${4.6 * index}rem`;
    setTimeout(() => {
      child.classList.toggle('intro_animation');
      child.classList.toggle('fade-in');
    }, 100 * index)

    setTimeout(() => {
      child.classList.toggle('intro_animation')
    }, (100 * index) + 400)
  });


  const sequenceOne = () => {

    narrator_segment_counter++;
    welcome_element.focus();

    setTimeout(() => {
      welcome_element.classList.add('open');

      setTimeout(() => {
        narrator_element.textContent = narrator_speach_elements[0];
        narrator_element.classList.toggle("animate-narrator-text");
      }, 1000);

      setTimeout(() => {
        narrator_element.classList.toggle("animate-narrator-text");
      }, 2500)

      setTimeout(() => {
        narrator_element.textContent = narrator_speach_elements[1];
        narrator_element.classList.toggle("animate-narrator-text");
      }, 3500)

      setTimeout(() => {
        narrator_element.classList.toggle("animate-narrator-text");
      }, 5000)

      setTimeout(() => {
        narrator_element.textContent = narrator_speach_elements[2];
        narrator_element.classList.toggle("animate-narrator-text");
        proceed_to_next = true;
      }, 6500)


    }, 2000)
  }

  const sequenceTwo = () => {

    narrator_segment_counter++
    narrator_element.classList.toggle("animate-narrator-text");
    narrator_element.textContent = "";

    setTimeout(() => {
      narrator_element.classList.toggle("animate-narrator-text");
      narrator_element.textContent = narrator_speach_elements[3];
    }, 1000);

    setTimeout(() => {
      narrator_element.classList.toggle("animate-narrator-text");
    }, 2500)


    setTimeout(() => {
      narrator_element.textContent = narrator_speach_elements[4];
      narrator_element.classList.toggle("animate-narrator-text");
      welcome_element.appendChild(character_element);
    }, 3500);

    setTimeout(() => {
      narrator_element.classList.toggle("animate-narrator-text");
    }, 5000)

    setTimeout(() => {
      narrator_element.textContent = narrator_speach_elements[5];
      narrator_element.classList.toggle("animate-narrator-text");
      proceed_to_next = true;
      welcome_element.appendChild(character_element);
    }, 6000);

  };

  const sequenceThree = () => {

    narrator_segment_counter++
    narrator_element.classList.toggle("animate-narrator-text");
    narrator_element.textContent = "";

    setTimeout(() => {
      narrator_element.classList.toggle("animate-narrator-text");
      narrator_element.textContent = narrator_speach_elements[6];
    }, 1000);

    setTimeout(() => {
      narrator_element.classList.toggle("animate-narrator-text");
    }, 2500)


    setTimeout(() => {
      narrator_element.textContent = narrator_speach_elements[7];
      narrator_element.classList.toggle("animate-narrator-text");
      welcome_element.appendChild(character_element);
    }, 3500);

    setTimeout(() => {
      narrator_element.classList.toggle("animate-narrator-text");
    }, 5000)

    setTimeout(() => {
      narrator_element.textContent = narrator_speach_elements[8];
      narrator_element.classList.toggle("animate-narrator-text");
      proceed_to_next = true;
    }, 6000);

  };

  const sequenceFour = () => {
    narrator_segment_counter++;
    game_in_progress = true;
    narrator_element.classList.toggle("animate-narrator-text");
    character_element.remove();
    setTimeout(() => {
      welcome_element.classList.toggle("open");
      welcome_container_element.classList.toggle("open");
    }, 400)

    setTimeout(() => {
      display_element.appendChild(character_element);
      // generateObstacle();
      obstacle_manager.start();
    }, 1500)
  }

  //End Animations section

  //Event Handlers and Listeners Section
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
          sequenceThree();
        }
      };


      if (narrator_segment_counter === 3) {
        if ((e.code === "Enter") || (e.code === "NumpadEnter")) {
          proceed_to_next = false;
          sequenceFour();
        }
      }
    }

    if (proceed_to_next === false) {
      if (narrator_segment_counter <= 3) return;
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

    if (game_over === true) {
      if ((e.code === "Enter") || (e.code === "NumpadEnter")) {
        game_over = false;
        resetGame();
      }
    }
  }

  const handleClick = (e) => {

    if (narrator_segment_counter === 1)
      if (proceed_to_next === true) {
        proceed_to_next = false;
        sequenceTwo();
      }
  };

  //End of Define Functions section

  //Assign Listeners
  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("click", handleClick);

  //End of Event Handlers and Listeners Section

  //Create an instance of createObstacleManager
  obstacle_manager = createObstacleManager();

  //Call the first sequence to start the intro and begin the game loop
  sequenceOne();
}

game();