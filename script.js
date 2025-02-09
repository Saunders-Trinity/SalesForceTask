//Add your global variables here
let pattern = [2, 2, 4, 3, 2, 1, 2, 4];
let progress = 0; 
let gamePlaying = false;
clueHoldTime = 1000;
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
guessCounter = 0;

// store the start and stop buttons
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");


// Add your functions here
function startGame() {
  console.log("Game started!");
  progress = 0;
  gamePlaying = true;

  // Ensure buttons exist before modifying classList
  if (startBtn) startBtn.classList.add("hidden");
  if (stopBtn) stopBtn.classList.remove("hidden");

  playClueSequence();
}

function stopGame(){
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("endBtn").classList.add("hidden");
}


function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}
function playClueSequence(){
  
  context.resume()
  let delay = nextClueWaitTime; //set delay to initial wait time
  guessCounter = 0;
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}
function guess(btn){
  console.log("user guessed: " + btn);

  if(!gamePlaying){
    return;
  }

  // Light up the button for user feedback
  lightButton(btn);
  setTimeout(() => clearButton(btn), 300); // Clear after a short delay
  
  if(pattern[guessCounter] == btn){
    // Guess was correct!
    if(guessCounter == progress){
      if(progress == pattern.length - 1){
        winGame();
      } else {
        progress++;
        playClueSequence();
      }
    } else {
      guessCounter++;
    }
  } else {
    loseGame();
  }
}

// Sound Synthesis Functions for Steps 6-8
// You do not need to edit the below code
const freqMap = {
    1: 261.6,
    2: 329.6,
    3: 392,
    4: 466.2
  }
  function playTone(btn,len){ 
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
    setTimeout(function(){
      stopTone()
    },len)
  }
  let tonePlaying = false; // Ensure this is declared at the top
  let volume = 0.5;

function startTone(btn) {
    if (!tonePlaying) {
        context.resume().then(() => {  // Ensure audio resumes after user interaction
            o.frequency.value = freqMap[btn];  // Set frequency based on button pressed
            g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025); // Gradual volume increase
            tonePlaying = true;
        }).catch(err => console.error("AudioContext error:", err)); // Handle audio context errors
    }
}

function stopTone() {
    if (tonePlaying) {
        g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025); // Gradual volume decrease
        tonePlaying = false;
    }
}
function winGame() {
  stopGame();  // Stop the game
  alert("Congratulations! You won! 🎉"); 
}


function loseGame() {
  stopGame();  // Stop the game
  alert("Game Over! You lost.");  
}
  
  // Page Initialization
  // Init Sound Synthesizer
  let AudioContext = window.AudioContext || window.webkitAudioContext 
  let context = new AudioContext()
  let o = context.createOscillator()
  let g = context.createGain()
  g.connect(context.destination)
  g.gain.setValueAtTime(0,context.currentTime)
  o.connect(g)
  o.start(0)
