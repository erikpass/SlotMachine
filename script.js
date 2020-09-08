var button = document.getElementById('runStopButton');
var reel = [
document.getElementById('reel1'),
document.getElementById('reel2'),
document.getElementById('reel3')
]

var lineMarker = [
  document.getElementById('top-line'),
  document.getElementById('center-line'),
  document.getElementById('bottom-line')
]

var modeSelector = document.getElementById('modeSelector')
var reelSelectionSymbol = [
  document.getElementById('reel1symbol'),
  document.getElementById('reel2symbol'),
  document.getElementById('reel3symbol')
]
var reelSelectionPosition = [
  document.getElementById('reel1position'),
  document.getElementById('reel2position'),
  document.getElementById('reel3position')
]
var forms = [
  document.getElementById('reel1form'),
  document.getElementById('reel2form'),
  document.getElementById('reel3form')
]
var payTable = [
  document.getElementsByClassName('cherryTop'),
  document.getElementsByClassName('cherryMiddle'),
  document.getElementsByClassName('cherryBottom'),
  document.getElementsByClassName('any7'),
  document.getElementsByClassName('cherryAnd7'),
  document.getElementsByClassName('3BAR'),
  document.getElementsByClassName('2BAR'),
  document.getElementsByClassName('BAR'),
  document.getElementsByClassName('anyBARS'),
]


var balanceDisplay = document.getElementById('balanceDisplay')
balanceDisplay.addEventListener('change', (event) => limitBalanceInput())

var buttonLock = false;

var mode = 0 // 0 - random, 1 - fixed

var symbolInput = [0, 0, 0]
var posInput = [0, 0, 0]
var summedInput = ['', '', '']

var selectedReels = [0, 0, 0]


//don't show symbol selection forms if mode selection is random
modeSelector.addEventListener('change', (event) => formVisibility())
function formVisibility() {
  if (modeSelector.value === 'Random') {
    mode = 0;
    forms.forEach(form => {
      form.style.display = 'none'
    });
  }else {
    mode = 1;
    getFixedInputs()
    forms.forEach(form => {
      form.style.display = ''
    })
  }
}
formVisibility()
//
reelSelectionSymbol[0].addEventListener('change', (event) => getFixedInputs())
reelSelectionSymbol[1].addEventListener('change', (event) => getFixedInputs())
reelSelectionSymbol[2].addEventListener('change', (event) => getFixedInputs())
reelSelectionPosition[0].addEventListener('change', (event) => getFixedInputs())
reelSelectionPosition[1].addEventListener('change', (event) => getFixedInputs())
reelSelectionPosition[2].addEventListener('change', (event) => getFixedInputs())


//
function limitBalanceInput() {
  if (balanceDisplay.value > 5000)
  balanceDisplay.value = 5000;
}

//symbol selection for fixed mode
function reelSelector(index) {
  switch (reelSelectionSymbol[index].value) {
    case 'BAR': symbolInput[index] = 0; break;
    case '2xBAR': symbolInput[index] = 1; break;
    case '3xBAR': symbolInput[index] = 2; break;
    case '7': symbolInput[index] = 3; break;
    case 'Cherry': symbolInput[index] = 4; break;
    default: break;
  }
  switch (reelSelectionPosition[index].value) {
    case 'Top': posInput[index] = 0; break;
    case 'Middle': posInput[index] = 1; break;
    case 'Bottom': posInput[index] = 2; break;
    default: break;
  }

}


function AssignSelectedReelValue(index) {
  switch (summedInput[index]) {
    case '00': selectedReels[index] = 2; break;
    case '10': selectedReels[index] = 4; break;
    case '20': selectedReels[index] = 0; break;
    case '30': selectedReels[index] = 6; break;
    case '40': selectedReels[index] = 8; break;

    case '01': selectedReels[index] = 1; break;
    case '11': selectedReels[index] = 3; break;
    case '21': selectedReels[index] = 9; break;
    case '31': selectedReels[index] = 5; break;
    case '41': selectedReels[index] = 7; break;

    case '02': selectedReels[index] = 0; break;
    case '12': selectedReels[index] = 2; break;
    case '22': selectedReels[index] = 8; break;
    case '32': selectedReels[index] = 4; break;
    case '42': selectedReels[index] = 6; break;

    default: break;
  }
}


function getFixedInputs() {
  for (let i = 0; i < 3; i++) {
    reelSelector(i)
    summedInput[i] = symbolInput[i].toString() + posInput[i].toString();
    AssignSelectedReelValue(i)
  }
}


//
var elementWidth = 141
var elementHeight = 121
var heightIncrement = elementHeight/2

//getting the reels y position
var reelHeight = [
  { start: 0, value: 0, position: 0 },
  { start: 0, value: 0, position: 0 },
  { start: 0, value: 0, position: 0 }
]
//bool to prevent any animation overlap
var reelStatus = [
  { busy: false },
  { busy: false },
  { busy: false }
]

const SPINTIME = 2000 //amount of time the first reel will spin
const SPINDELAY = 500 //delay between the next reel stopping after the previous one

/*position of the reelHeight correlates to a certain set being displayed to the user by the reel
order > 3xBAR, BAR, 2xBAR, 7, CHERRY

0 = { top = 3xBAR, bottom = BAR }
1 = { middle = BAR } //neighboring values partially visible
2 = { top = BAR, bottom = 2xBAR }
3 = { middle = 2xBAR }
4 = { top = 2xBAR, bottom = 7 }
5 = { middle = 7 }
6 = { top = 7, bottom = cherry }
7 = { middle = cherry }
8 = { top = cherry, bottom = 3xBAR }
9 = { middle = 3xBAR }
reset to 0
*/

function GenerateRandom(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

button.onclick = () => {
  if (buttonLock === false) {
    if (CheckBalance() === true){
      buttonLock = true;
      if (mode === 0) {
        animateWheel(0, GenerateRandom(40, 80))
        animateWheel(1, GenerateRandom(40, 80))
        animateWheel(2, GenerateRandom(40, 80))
      } else {
        animateWheel(0, getPositionDifference(0, selectedReels[0]))
        animateWheel(1, getPositionDifference(1, selectedReels[1]))
        animateWheel(2, getPositionDifference(2, selectedReels[2]))
      }
    }
  }
}

//add extra images to the beginning of the reels for smooth looping
for (let i = 0; i < 3; i++) {
  let node1 = document.createElement('img')
  let node2 = document.createElement('img')
  let node3 = document.createElement('img')
  node1.src = 'reel/3xBAR.png'
  node2.src = 'reel/BAR.png'
  node3.src = 'reel/2xBAR.png'
  reel[i].appendChild(node1, reel[i].childNodes[0])
  reel[i].appendChild(node2, reel[i].childNodes[0])
  reel[i].appendChild(node3, reel[i].childNodes[0])
}

function animateWheel(index, steps) {
  if (reelStatus[index].busy){
    return false
  }
  reelStatus[index].busy = true



  let startValue = reelHeight[index].value
  let endValue = reelHeight[index].value - heightIncrement

  let currentValue = startValue
  let stepsCount = 0;
  let totalDistanceToIncrement = steps * heightIncrement; //the total amount of distance needed to move the wheel to reach the target
  let stepTime = 20;
  let stepsTotal = (SPINTIME + (SPINDELAY * index))/20;
  let stepValue = (totalDistanceToIncrement/(stepsTotal)); //the amount that each increment should be to reach the target in 2 seconds, 2,5 seconds or 3 seconds depending on the reel

  let loopLimit = heightIncrement * 10;


  var loop = ''
  loop = setInterval(() => {
    if (stepsCount < stepsTotal) {
      stepsCount++;
      increment(index, stepValue)
    }else {
      if(index === 2) {
        checkWinPatterns()
      }
      reelStatus[index].busy = false;
      clearInterval(loop)
    }
  }, 20);

  //increments the reel's progress and updates its values
  function increment(index, value) {
    let currentValue = reelHeight[index].value;

    let newValue = currentValue - value;
    let newPos = Math.abs(Math.floor(currentValue/heightIncrement));
    if(newValue < -(heightIncrement*10)) {
      newValue = (newValue + loopLimit);
      newPos = 0;
    }
    reelHeight[index].value = newValue;
    reelHeight[index].position = newPos;
    reel[index].style.top = `${newValue}px`
  }
  
}

//gets the amount of increments required to reach the targeted position from the current position
function getPositionDifference(index, targetPos) {
  let currentPos = reelHeight[index].position;
  if (currentPos < targetPos) {
    return targetPos - currentPos + 50;
  }
  else if (currentPos > targetPos) {
    let diff = (10 - currentPos) + targetPos + 50
    return diff
  }
  else if (currentPos === targetPos) {
    return 10 + 50
  }
}

//compare patterns to check for winnings after a roll is completed
function checkWinPatterns() {
  let reel0 = reelHeight[0].position;
  let reel1 = reelHeight[1].position;
  let reel2 = reelHeight[2].position;

  reel0 === 10 ? reel0 = 0 : reel0 = reel0 
  reel1 === 10 ? reel1 = 0 : reel1 = reel1 
  reel2 === 10 ? reel2 = 0 : reel2 = reel2 

  let rollNumbers = reel0.toString() + reel1.toString() + reel2.toString()
  let cash = balanceDisplay.value;

  switch (rollNumbers) {
    case '666': { 
      balanceDisplay.value = +cash + +150,
      balanceDisplay.value = +cash + +4000,
      flashPaytable(3)
      flashPaytable(2)
      flashLineMarker(0)
      flashLineMarker(2)
    }break;
    case '555': {
      balanceDisplay.value = +cash + +150,
      flashPaytable(3)
      flashLineMarker(1)
    }break;
    case '444': {
      balanceDisplay.value = +cash + +150,
      balanceDisplay.value = +cash + +20,
      flashPaytable(3)
      flashPaytable(6)
      flashLineMarker(0)
      flashLineMarker(2)
    }break;
    case '888': {
      balanceDisplay.value = +cash + +2000,
      balanceDisplay.value = +cash + +50,
      flashPaytable(0)
      flashPaytable(5)
      flashLineMarker(0)
      flashLineMarker(2)
    }break;
    case '777': {
      balanceDisplay.value = +cash + +1000,
      flashPaytable(1)
      flashLineMarker(1)
    }break;
    case '222': {
      balanceDisplay.value = +cash + +20,
      balanceDisplay.value = +cash + +10,
      flashPaytable(6)
      flashPaytable(7)
      flashLineMarker(0)
      flashLineMarker(2)
    }break;
    case '111': {
      balanceDisplay.value = +cash + +10,
      flashPaytable(7)
      flashLineMarker(1)
    }break;
    case '000': {
      balanceDisplay.value = +cash + +50,
      balanceDisplay.value = +cash + +10,
      flashPaytable(7),
      flashPaytable(5)
      flashLineMarker(0)
      flashLineMarker(2)
    }break;
    case '333': {
      balanceDisplay.value = +cash + +20,
      flashPaytable(6),
      flashLineMarker(1)
    }break;
    case '999': {
      balanceDisplay.value = +cash + +50,
      flashPaytable(5),
      flashLineMarker(1)
    }break;
    case '028': {
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(2)
    }break;
    case '228': {
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(2)
    }break;
    case '828': {
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(2)
    }break;
    case '808': {
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(2)
    }break;
    case '008': {
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(2)
    }break;
    case '208': {
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(2)
    }break;
    case '088': {
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(2)
    }break;
    case '002': {
      balanceDisplay.value = +cash + +5,
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(2)
      flashLineMarker(0)
    }break;
    case '020': {
      balanceDisplay.value = +cash + +5,
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(2)
      flashLineMarker(0)
    }break;
    case '200': {
      balanceDisplay.value = +cash + +5,
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(2)
      flashLineMarker(0)
    }break;
    case '022': {
      balanceDisplay.value = +cash + +5,
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(2)
      flashLineMarker(0)
    }break;
    case '202': {
      balanceDisplay.value = +cash + +5,
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(2)
      flashLineMarker(0)
    }break;
    case '220': {
      balanceDisplay.value = +cash + +5,
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(2)
      flashLineMarker(0)
    }break;
    case '800': {
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(2)
    }break;
    case '820': {
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(2)
    }break;
    case '282': {
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(2)
    }break;
    case '802': {
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(2)
    }break;
    case '113': {
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(1)
    }break;
    case '131': {
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(1)
    }break;
    case '133': {
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(1)
    }break;
    case '311': {
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(1)
    }break;
    case '331': {
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(1)
    }break;
    case '313': {
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(1)
    }break;
    case '933': {
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(1)
    }break;
    case '993': {
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(1)
    }break;
    case '939': {
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(1)
    }break;
    case '399': {
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(1)
    }break;
    case '393': {
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(1)
    }break;
    case '931': {
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(1)
    }break;
    case '913': {
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(1)
    }break;
    case '391': {
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(1)
    }break;
    case '319': {
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(1)
    }break;
    case '993': {
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(1)
    }break;
    case '911': {
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(1)
    }break;
    case '919': {
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(1)
    }break;
    case '991': {
      balanceDisplay.value = +cash + +5,
      flashPaytable(8),
      flashLineMarker(1)
    }break;
    case '686': {
      balanceDisplay.value = +cash + +75,
      flashPaytable(4),
      flashLineMarker(0)
    }break;
    case '668': {
      balanceDisplay.value = +cash + +75,
      flashPaytable(4),
      flashLineMarker(0)
    }break;
    case '868': {
      balanceDisplay.value = +cash + +75,
      flashPaytable(4),
      flashLineMarker(0)
    }break;
    case '686': {
      balanceDisplay.value = +cash + +75,
      flashPaytable(4),
      flashLineMarker(0)
    }break;
    case '886': {
      balanceDisplay.value = +cash + +75,
      flashPaytable(4),
      flashLineMarker(0)
    }break;
    case '688': {
      balanceDisplay.value = +cash + +75,
      flashPaytable(4),
      flashLineMarker(0)
    }break;
    case '557': {
      balanceDisplay.value = +cash + +75,
      flashPaytable(4),
      flashLineMarker(1)
    }break;
    case '575': {
      balanceDisplay.value = +cash + +75,
      flashPaytable(4),
      flashLineMarker(1)
    }break;
    case '755': {
      balanceDisplay.value = +cash + +75,
      flashPaytable(4),
      flashLineMarker(1)
    }break;
    case '775': {
      balanceDisplay.value = +cash + +75,
      flashPaytable(4),
      flashLineMarker(1)
    }break;
    case '577': {
      balanceDisplay.value = +cash + +75,
      flashPaytable(4),
      flashLineMarker(1)
    }break;
    case '757': {
      balanceDisplay.value = +cash + +75,
      flashPaytable(4),
      flashLineMarker(1)
    }break;
    case '446': {
      balanceDisplay.value = +cash + +75,
      flashPaytable(4),
      flashLineMarker(2)
    }break;
    case '464': {
      balanceDisplay.value = +cash + +75,
      flashPaytable(4),
      flashLineMarker(2)
    }break;
    case '644': {
      balanceDisplay.value = +cash + +75,
      flashPaytable(4),
      flashLineMarker(2)
    }break;
    case '466': {
      balanceDisplay.value = +cash + +75,
      flashPaytable(4),
      flashLineMarker(2)
    }break;
    case '646': {
      balanceDisplay.value = +cash + +75,
      flashPaytable(4),
      flashLineMarker(2)
    }break;
    case '664': {
      balanceDisplay.value = +cash + +75,
      flashPaytable(4),
      flashLineMarker(2)
    }break;



    default: break;
  }

  console.log(rollNumbers)

  buttonLock = false;

}


//flash the pay-table of the winning combination(s)
function flashPaytable(index) {
  //payTable[0]
  let duration = 3000

  payTable[index][0].classList.toggle('payTableOptionFlashing')
  setTimeout(() => {
    payTable[index][0].classList.toggle('payTableOptionFlashing') 
  }, duration);
  
}


function CheckBalance() {
  let balance = +balanceDisplay.value;
  if (balance < 1) {
    return false
  }else {
    balanceDisplay.value = (+balanceDisplay.value -1)
    return true
  }
}

function flashLineMarker(pos) {
  
  lineMarker[pos].classList.toggle('lineMarkerHide')
  setTimeout(() => {
    lineMarker[pos].classList.toggle('lineMarkerHide')
  }, 3000);

}

