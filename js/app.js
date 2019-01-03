/*
//
// Global variables
//
*/

//list that holds all of the cards
const cardIcons = [
  'fa fa-diamond', 'fa fa-diamond',
  'fa fa-paper-plane-o', 'fa fa-paper-plane-o',
  'fa fa-anchor', 'fa fa-anchor',
  'fa fa-bolt', 'fa fa-bolt',
  'fa fa-cube', 'fa fa-cube',
  'fa fa-leaf', 'fa fa-leaf',
  'fa fa-bicycle', 'fa fa-bicycle',
  'fa fa-bomb', 'fa fa-bomb',
];

//selects the main board area
const board = document.querySelector('.deck');

//the arrays used to temporarily store cards
let openedCards = [];
let matchedCards = [];

//variables for the timer
let clockId;
let clockOff = true;
let minutesLabel = document.getElementById("minutes");
let secondsLabel = document.getElementById("seconds");
let totalSeconds = 0;

//star rating variables
const starsContainer = document.querySelector('.stars');
let starCount;

//selects the restart icon/button
const restart = document.querySelector(".restart");

//move counter variables
const movesContainer = document.querySelector(".moves");
let moves = 0;


/*
//
// Functions
//
*/

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
     }

     return array;
 }

//Functions for the timer//
function startClock() {
  clockId = setInterval(setTime, 1000);
}

function setTime() {
  ++totalSeconds;
  secondsLabel.innerHTML = pad(totalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
  let valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}

function setClockZero(){
  totalSeconds = 0;
  clearInterval(clockId);
  secondsLabel.innerHTML = pad(totalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
  clockOff = true;
}

//move counter function
function addMove() {
  moves++;
  movesContainer.innerHTML = moves;
  rating();
}

//star rating function
function rating() {
  if (moves > 12 && moves < 20) {
    starsContainer.innerHTML = `<li><i class="fa fa-star"></i></li>
    <li><i class="fa fa-star"></i></li>`;
    starCount = 2;
  } else if (moves >= 20) {
    starsContainer.innerHTML = `<li><i class="fa fa-star"></i></li>`;
    starCount = 1;
  } else {
    starsContainer.innerHTML = `<li><i class="fa fa-star"></i></li>
    <li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>`;
    starCount = 3;
  }
}

//start of game function
function gameInit() {
  shuffle(cardIcons);
  //loops over the 'cardIcons' array and creates HTML
  for (i = 0; i < cardIcons.length; i++) {
    //creates an <li> tag
    const card = document.createElement("li");
    //adds the classname "card" to the <li> tag
    card.classList.add("card");
    //adds the card icons inside of the card
    card.innerHTML = `<i class="${cardIcons[i]}"></i>`;
    //adds the iterated card html to the board area
    board.appendChild(card);
    //Event Listener for card click
    click(card);
  }
}

//card Event Listener function
function click(card) {
  card.addEventListener("click", function() {

    const currentCard = this;
    const previousCard = openedCards[0];

    if (clockOff) {
      startClock();
      clockOff = false;
    }

    if (openedCards.length === 1) {
      card.classList.add("open", "show", "disable");
      openedCards.push(this);
      //Compare the two opened cards
      compare(currentCard, previousCard);
    } else {
      card.classList.add("open", "show", "disable");
      openedCards.push(this);
    }
  });
}

//compare card function
function compare(currentCard, previousCard) {
  //compare opened cards. If they both are the same, it'll add the class name "match"
  if (currentCard.innerHTML === previousCard.innerHTML) {
    currentCard.classList.add("match");
    previousCard.classList.add("match");
    matchedCards.push(currentCard, previousCard);
    //reset the openedCards array so that I can't put more than 2 items in it
    openedCards = [];
    //opens the alert modal for "GAME OVER! with a delay of 400 miliseconds"
    setTimeout(function() {
      gameOver();
    }, 400);
  //if the cards aren't the same, it'll remove the "open" & "show" classes, and reset the array
  } else {
      setTimeout(function() {
        currentCard.classList.remove("open", "show", "disable");
        previousCard.classList.remove("open", "show", "disable");
      }, 400);
      //resets the openedCards array so that I can't put more than 2 items in it
      openedCards = [];
  }
  //adds the move function
  addMove();
}

//game over modal function
function gameOver() {
    if (matchedCards.length === cardIcons.length) {

        // launch modal
        const modal = document.getElementById('myModal');
        const span = document.getElementsByClassName("close")[0];
        const btn = document.getElementById("myBtn");
        modal.style.display = "block";

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
          modal.style.display = "none";
        }

        // When the user clicks on the button, it restarts the game
        btn.onclick = function() {
          resetGame();
          modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
          if (event.target == modal) {
            modal.style.display = "none";
          }
        }

        //update the html text to reflect the game-winning stats
        const resultsMessage = document.querySelector('.results');
        const seconds = document.getElementById("seconds").innerHTML;
        const minutes = document.getElementById("minutes").innerHTML;
        resultsMessage.textContent = "Congrats, you matched all of the cards, and did so with a star rating of " + starCount + ", and with a time of " + minutes + ":" + seconds + ".";

        //stop the timer
        clearInterval(clockId);
    }
}

//game restart function
function resetGame() {
    board.innerHTML = "";
    gameInit();
    openedCards = [];
    matchedCards = [];
    moves = 0;
    movesContainer.innerHTML = moves;
    starsContainer.innerHTML = `<li><i class="fa fa-star"></i></li>
    <li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>`;
    setClockZero();
  }


/*
//
// Start of game
//
*/

//begins the initial game
gameInit();

//game restart click event handler
  restart.addEventListener("click", function() {
    resetGame();
  });
