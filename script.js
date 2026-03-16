// Making Elements Clickable
function clickable(elem, func) { 
   elem.addEventListener("click", func); 
   elem.style.cursor =  "pointer";
}
function unclickable(elem, func) { 
   elem.removeEventListener("click", func); 
   elem.style.cursor =  "initial";
}

let score = 0;
let scoreDisplay = document.getElementById("score");

const runBtn = document.getElementById("run");
const resetBtn = document.getElementById("reset");

const lanes = document.getElementsByClassName("lane");
const cans = document.getElementsByClassName("jerrycan");
const progresses = document.getElementsByClassName("progress");
let laneWidth = Number((getWidth(lanes[0]) - getWidth(cans[0])).toFixed(2));

const booth = document.getElementById("bets");
const bet = document.getElementById("bet-amount");
const plus = document.getElementById("plus");
const minus = document.getElementById("minus");
let roundBet = 0;

const trivia = document.getElementById("trivia");
let fact = document.getElementById("fact");
const trueBtn = document.getElementById("trueBtn");
const falseBtn = document.getElementById("falseBtn");
const facts = [
  ["True Fact", true],
  ["False Fact", false]
]

// for crypto object randomization
const randArray= new Uint8Array(1);

const sip = new Audio("audio/celebration.mp3");

function getNumber(ID) { return Number(ID.innerHTML); }

function getWidth(ID) { return Number(getComputedStyle(ID).getPropertyValue("width").replace("px","")); }

function getPosition(ID) { return Number(getComputedStyle(ID).getPropertyValue("left").replace("px","")); }

clickable(plus, plusBet);
clickable(minus, minusBet);
function plusBet()
{ 
  if (bet.innerHTML < 1000)
    bet.innerHTML = getNumber(bet) + 100;
  roundBet = bet.innerHTML;
}
function minusBet()
{
  if (bet.innerHTML > 0)
    bet.innerHTML = getNumber(bet) - 100;
  roundBet = bet.innerHTML;
}

clickable(trueBtn, () => guessFunc(true));
clickable(falseBtn, () => guessFunc(false));
function guessFunc(bool) 
{
  if (facts[index][1] == bool)
  {
    score += 5;
    scoreDisplay.innerHTML = score;
    cans[3].style.left = getPosition(cans[3]) + laneWidth/256 + "px";
    progresses[3].style.width = getWidth(progresses[3]) + laneWidth/256 + "px";
  }
  else
  {
    score -= 5;
    scoreDisplay.innerHTML = score;
    cans[3].style.left = getPosition(cans[3]) - laneWidth/128 + "px";
    progresses[3].style.width = getWidth(progresses[3]) - laneWidth/128 + "px";
  }
  index = crypto.getRandomValues(randArray)[0] % 2;
  fact.innerHTML = facts[index][0];
}

let done = false;
let index = 0;
play(); 

function play()
{
  runBtn.style.display = "initial";
  trivia.style.display = "none";
  booth.style.display = "flex";
  function run()
  {
    unclickable(runBtn, run);
    if (done == false)
    {
      runFunc();
      setTimeout(run, 10);
    }
    else
      return;
  }

  clickable(runBtn, run);
  triviaPhase();
}

function runFunc()
{
  runBtn.style.display = "none";
  trivia.style.display = "";
  booth.style.display = "none";
  for (let i = 0; i < cans.length; ++i)
  {
    if (getPosition(cans[i]) >= laneWidth && done == false)
      {
        console.log("We have a winner!");
        sip.play();
        done = true;
        progresses[i].style.backgroundColor = "#8BD1CB";
        clickable(resetBtn, resetFunc);
        resetBtn.style.display = "initial";
        if (i == 3)
        {
          score += Number(roundBet);
          scoreDisplay.innerHTML = score;
        }
        else
        {
          score -= Number(roundBet);
          scoreDisplay.innerHTML = score > 0 ? score : 0;
        }
      }
    else if (getPosition(cans[i]) < laneWidth && done == false)
    {
      laneWidth = Number((getWidth(lanes[0]) - getWidth(cans[0])).toFixed(2));
      moveBot(i);
    }  
  }
}

function moveBot(index)
{
  function updateDistance()
  {
    cans[index].style.left = distance + getPosition(cans[index]) + "px";
    progresses[index].style.width = getPosition(cans[index]) + getWidth(cans[index]) + "px";
  }
  
  function pushFinish()
  {
    cans[index].style.left = laneWidth + "px";
    progresses[index].style.width = getPosition(cans[index]) + getWidth(cans[index]) + "px";
  }
  let distance = crypto.getRandomValues(randArray)[0]/256;
  while (distance + getPosition(cans[index]) > laneWidth)
  {
    distance = crypto.getRandomValues(randArray)[0]/256;
    if ((distance + getPosition(cans[index]) + laneWidth/100) >= laneWidth)
      { pushFinish(); return }

  }
  if ((distance + getPosition(cans[index]) + laneWidth/100) >= laneWidth)
    { pushFinish(); return }
  updateDistance();
}

function resetFunc()
{
  done = false;
  for (let i = 0; i < cans.length; ++i)
  {
    cans[i].style.left = "0px";
    progresses[i].style.width = "52.5px";
    progresses[i].style.backgroundColor = "#2E9DF7";
  }
  unclickable(resetBtn, resetFunc);
  resetBtn.style.display = "none";
  play();
}
