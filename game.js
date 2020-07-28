// Necessary sleep function for delaying code execution
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Set default values
let buttonColours = ['green', 'red', 'yellow', 'blue'];
let userClickedPattern = [];
let gamePattern = [];
let started = false;
let playerTurn = false;
let level = 0;

// Button click event listener
$('.btn').click(function () {
  if (playerTurn) {
    let userChosenColour = this.id;
    userClickedPattern.push(userChosenColour);
    checkAnswer(userClickedPattern.length - 1);
    playSound(userChosenColour);
    animatePress($(this));
  }
});

// Trigger click event on keypress 1, 2, 3, 4
$(document).keyup(function (event) {
  if (started) {
    switch (event.key) {
      case '1':
        $('#green').trigger('click');
        break;
      case '2':
        $('#red').trigger('click');
        break;
      case '3':
        $('#yellow').trigger('click');
        break;
      case '4':
        $('#blue').trigger('click');
        break;
    }
  } else {
    started = true;
    nextSequence();
  }
});

// Add new sequence to the pattern
async function nextSequence() {
  playerTurn = false;
  userClickedPattern = [];
  $('#level-title').text(`Level ${level}`);
  await sleep(1000);
  if (gamePattern.length != 0) {
    for (let i = 0; i < gamePattern.length; i++) {
      animatePress($(`#${gamePattern[i]}`));
      playSound(gamePattern[i]);
      await sleep(500);
    }
  }
  let randomNumber = Math.floor(Math.random() * 4);
  let randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);
  animatePress($(`#${randomChosenColour}`));
  playSound(randomChosenColour);
  await sleep(500);
  playerTurn = true;
}

// Play corresponding sound
function playSound(colour) {
  let audio = new Audio(`sounds/${colour}.mp3`);
  audio.play();
}

// Animate pressed button
function animatePress(button) {
  button.addClass('pressed');
  setTimeout(function () {
    button.removeClass('pressed');
  }, 100);
  button.fadeIn(100).fadeOut(100).fadeIn(100);
}

// Check player answer
function checkAnswer(index) {
  if (userClickedPattern[index] === gamePattern[index]) {
    if (userClickedPattern.length === gamePattern.length) {
      level++;
      nextSequence();
    }
  } else {
    gameOver();
  }
}

function gameOver() {
  let audio = new Audio('sounds/wrong.mp3');
  audio.play();
  $('body').addClass('game-over');
  setTimeout(function () {
    $('body').removeClass('game-over');
  }, 200);
  $('#level-title').text('Game Over, Press Any Key to Restart');
  startOver();
}

function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
  playerTurn = false;
}
