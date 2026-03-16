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

const speedSelect = document.getElementById("speedSelect");
const runBtn = document.getElementById("run");
const resetBtn = document.getElementById("reset");

const lanes = document.getElementsByClassName("lane");
const cans = document.getElementsByClassName("jerrycan");
const progresses = document.getElementsByClassName("progress");
let laneWidth = Number((getWidth(lanes[0]) - getWidth(cans[0])).toFixed(2));
let SPEED = 1;

let racer = -1;

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
  ["696 million people lack basic access to clean and safe drinking water", true],
  ["Diseases from dirty water kill more people every year than all forms of violence, including war", true],
  ["charity: water was founded by a nightclub promoter", true],
  ["charity: water has brought clean water to over 20 million people", true],
  ["Operating costs for charity: water are paid for by individual supporters like you", false],
  ["Men are usually responsible for collecting their household's water", false],
  ["charity: water's main approach to the global water crisis is well-building", false],
  ["charity: water has brought clean water to over 70 million people", false]
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
    cans[racer].style.left = getPosition(cans[racer]) + laneWidth/256 + "px";
    progresses[racer].style.width = getWidth(progresses[racer]) + laneWidth/256 + "px";
  }
  else
  {
    score -= 5;
    scoreDisplay.innerHTML = score;
    cans[racer].style.left = getPosition(cans[racer]) - laneWidth/128 + "px";
    progresses[racer].style.width = getWidth(progresses[racer]) - laneWidth/128 + "px";
  }
  index = crypto.getRandomValues(randArray)[0] % facts.length;
  fact.innerHTML = facts[index][0];
}

let done = false;
let index = 0;
play(); 



function selectRacer(e)
{
  index = e.currentTarget.index;
  console.log(index);
  progresses[index].style.boxShadow = "0 0 10px";
  for (let i = 0; i < cans.length; ++i)
    if (i != index)
      progresses[i].style.boxShadow = "none";
  racer = index;
}

function play()
{
  for (let i = 0; i < cans.length; ++i)
  {
    clickable(cans[i], selectRacer);
    cans[i].index = i;
    console.log(cans[i].index)
  }
  runBtn.style.display = "initial";
  trivia.style.display = "none";
  booth.style.display = "flex";
  function run()
  {
    if (racer == -1)
    {

      return;
    }
      
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
}

function runFunc()
{
  speed = document.getElementById("speed").value;
  if (speed == "slow")
    SPEED = 0.5;
  else if (speed == "fast")
    SPEED = 2;
  speedSelect.style.display = "none";
  runBtn.style.display = "none";
  trivia.style.display = "";
  booth.style.display = "none";
  for (let i = 0; i < cans.length; ++i)
    unclickable(cans[i], selectRacer);
  for (let i = 0; i < cans.length; ++i)
  {
    if (getPosition(cans[i]) >= laneWidth && done == false)
      {
        sip.play();
        done = true;
        progresses[i].style.backgroundColor = "#8BD1CB";
        clickable(resetBtn, resetFunc);
        resetBtn.style.display = "initial";
        trivia.style.display = "none";
        if (i == racer)
        {
          score += Number(roundBet) * SPEED;
          scoreDisplay.innerHTML = score;
        }
        else
        {
          score = (score - Number(roundBet) > 0) ? (score - Number(roundBet)) : 0;
          scoreDisplay.innerHTML = score;
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
  let distance = crypto.getRandomValues(randArray)[0]/256 * SPEED;
  while (distance + getPosition(cans[index]) > laneWidth)
  {
    distance = crypto.getRandomValues(randArray)[0]/256 * SPEED;
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
  speedSelect.style.display = "";
  resetBtn.style.display = "none";
  play();
}
