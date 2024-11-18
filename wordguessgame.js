const letters = document.querySelectorAll(".scoreboard-letter");
const loadingDiv = document.querySelector(".info-bar");
const ANSWER_LENGTH = 5;
const ROUNDS = 6;


// Making an async function with the typing logic
async function init() {
 let currentGuess = "";
 let currentRow = 0;
 let done = false;
 let isLoading = true;


 // Fetching the data over here
 const res = await fetch("https://words.dev-apis.com/word-of-the-day");
 const resObj = await res.json();
 const word = resObj.word.toUpperCase();
 const wordParts = word.split("");
 setLoading = false;
 isLoading = false;


 //Add Letter Function
 function addLetter(letter) {
   if (currentGuess.length < ANSWER_LENGTH) {
     // add letter to the end
     currentGuess += letter;
   } else {
     // replace the last letter
     currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
   }
   //making sure that we start our line from the first row
   letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter;
 }


 // Commit Function
 async function commit() {
   if (currentGuess.length != ANSWER_LENGTH) {
     // do nothing
     return;
   }


   //POST API HERE
   isLoading = true;
   setLoading(true);
   const res = await fetch ("https://words.dev-apis.com/validate-word",{
   method: "POST",
   body: JSON.stringify({word: currentGuess}),
   });
   
   const resObj = await res.json();
   const validWord = resObj.validWord;


   isLoading = false;
   setLoading(false);


   if (!validWord) {
     markInvalidWord();
     return;
   }
    // TODO validate the word


   // TODO do all the marking as "correct" "close" or "wrong"


   const guessParts = currentGuess.split("");
   const map = makeMap(wordParts);


   for (let i = 0; i < ANSWER_LENGTH; i++) {
     //mark as correct
     if (guessParts[i] === wordParts[i]) {
       letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
       map[guessParts[i]]--;
     }
   }
   for (let i = 0; i < ANSWER_LENGTH; i++) {
     if(guessParts[i] === wordParts[i]){
       //do nothing we already did it
     } else if (wordParts.includes(guessParts[i]) && map[guessParts[i] > 0]) {
       //mark as close
     letters[currentRow * ANSWER_LENGTH + i].classList.add("close")
     map[guessParts[i]]--;
     } else {
       letters[currentRow * ANSWER_LENGTH + i].classList.add("wrong");
     }
   }


   currentRow++;
   currentGuess = "";


  // Losing condition here
   if (currentGuess === word) {
     alert("you win!");
     done = true;
   } else if (currentRow === ROUNDS) {
     alert(`you lose, the word was ${word}`);
     done = true;
   }
}




 //Backspace function
 function backspace() {
   currentGuess = currentGuess.substring(0, currentGuess.length - 1);
   letters = [ANSWER_LENGTH * currentGuess + currentGuess.length].innerText = "";
 }


 //MarkInvalidWord Function
 function markInvalidWord () {
  for (i = 0; i < ANSWER_LENGTH; i++){
   letters[currentRow * ANSWER_LENGTH + i].classList.remove("invalid");
  
  
   setTimeout(function (){
   letters[currentRow * ANSWER_LENGTH + i].classList.add("invalid")
   }, 10);
  }
 }
 //Keyboard Interaction
 document.addEventListener("keydown", function handleKeyPress(event) {


   if(done || isLoading) {
     //do nothing
     return;
   }
   const action = event.key;


   console.log(action);


   if (action === "Enter") {
     commit();
   } else if (action === "Backspace") {
     backspace();
   } else if (isLetter(action)) {
     addLetter(action.toUpperCase());
   } else {
     //do nothing
   }
 });
}


//is Letter function
function isLetter(letter) {
 return /^[a-zA-Z]$/.test(letter);
}


function setLoading(isLoading) {
 loadingDiv.classList.toggle('show', isLoading);
}


//takes an array as an argument and returns an object where keys are elements from the array,
// and values are the frequency of each element in the array
function makeMap (array) {
 const obj = {};
 for (let i = 0; i < array.length; i++) {
   const letter = array[i]
   if (obj[letter]) {
     obj[letter]++;
   } else {
     obj[letter] = 1
   }
 }
 return obj;
}


init();



