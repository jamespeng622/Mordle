var tiles = [];
var keyboard = [];
var enter;
var backspace;

var shareOutput = [];
var shareIndex = 0;
var shareOutputDiv = document.getElementById("shareOutputDiv");
let shareString = "";

// for spell check
let guessedWord =  "";
var checkPassed = 0;

// game variables
var one = 0, two = 0, three = 0, four = 0, five = 0, six = 0;
var gamesPlayed = 0;
var gamesWon = 0;
var currentStreak = 0;
var maxStreak = 0;

// connectors for game variables
var gamesPlayedDisplay = document.getElementById("gamesPlayedDisplay");
var winPercentageDisplay = document.getElementById("winPercentageDisplay");
var currentStreakDisplay = document.getElementById("currentStreakDisplay");
var maxStreakDisplay = document.getElementById("maxStreakDisplay");


var i;

let index = 0;
let indexString = index.toString();

var currentIndex = 0;
var currentRow = 0;

var max = 110;
var words = ["LASER", "FOCUS", "CADET", "YOUTH", "CRIMP",
             "DRINK", "PRIDE", "RAMEN", "DRANK", "PRANK",
             "DANCE", "PAINT", "CREAM", "DREAM", "WEARY",
             "PRICK", "TRICK", "FLICK", "QUICK", "SITAR",
             "PRICE", "CRATE", "CRANE", "YEARN", "LEARN",
             "DIVER", "WITCH", "DITCH", "HITCH", "PITCH",
             "BRICK", "BRINK", "PRUNE", "CRUDE", "GRAND",
             "RAISE", "CRAZE", "CRAWL", "GLOAT", "BLOAT",
             "RHINO", "FEAST", "DROOL", "GREAT", "TREAT",
             "QUEER", "QUIET", "EERIE", "MOUNT", "COUNT",
             "PZAZZ", "JAZZY", "BUZZY", "FUZZY", "DIZZY",
             "PIZZA", "TIZZY", "JUMPY", "MUZAK", "JERKY",
             "JUICY", "JOKER", "HIPPO", "TIGER", "QUIRK",
             "XEROX", "BANJO", "BEZEL", "BEVEL", "BASIL",
             "BIJOU", "FJORD", "ANNEX", "JELLY", "BELLY",
             "LIVER", "PIQUE", "SQUIB", "SQUID", "VIGOR",
             "BOOZE", "COCKY", "EJECT", "EPOXY", "HAZEL",
             "KNACK", "KNICK", "KNOCK", "PRIZE", "QUERY",
             "TOPAZ", "VIXEN", "WHACK", "BLACK", "BLOCK",
             "BULKY", "CHIMP", "CHUNK", "COMFY", "DOZEN",
             "EXPEL", "FLOCK", "FLUFF", "INBOX", "SQUAD",
             "AZURE", "BOXER", "BUGGY", "CHALK", "CRUMB"];

// random number generator
function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}


for(i=0; i<30; i++){
    index = i;
    indexString = index.toString();
    tiles[i] = document.getElementById(indexString);
}

for(i=30; i<56; i++){
    index = i;
    indexString = index.toString();
    keyboard[i-30] = document.getElementById(indexString);
}

// mapping for keyboard
const keymap = new Map();
for(var k=0; k<26; k++){
    keymap.set(keyboard[k].innerHTML, k);
}
// end of mapping


// generate random word here
var currentWordIndex = 0;
currentWordIndex = getRandomNumber(0, max-1);
var currentWord = words[currentWordIndex];


var flag = 0;
var points = 0;
var currentGameEnd = 0;
var currentGameWon = 0;
var thisRoundScore = 0;

// keystatus will save the status of each key so as to update the keyboard accordingly
// 0 = unchanged, 1 = wrong, 2 = wrong placement, 3 = correct
// 3 overrides 2 if conflict
var keyStatus = [];
for(var p=0; p<26; p++){
    keyStatus[p] = 0;
}

// tilestatus will save the status of each key so as to update the tile board accordingly
// tilestatus updates each row
// 0 = unused, 1 = wrong, 2 = wrong placement, 3 = correct
var tileStatus = [];
for(var p=0; p<5; p++){
    tileStatus[p] = 0;
}

// remainingopportunities deals with duplicates
var remainingOpportunities = [];
for(var p=0; p<26; p++){
    remainingOpportunities[p] = 0;
}

for(var p=0; p<5; p++){
    remainingOpportunities[keymap.get(currentWord[p])]++;
}



enter = document.getElementById("enter");
backspace = document.getElementById("backspace");

for(i=0; i<26; i++){
    keyboard[i].addEventListener("click", function(){
        if(currentIndex < (currentRow+1)*5 && currentGameEnd!=1){
            tiles[currentIndex].innerHTML = this.innerHTML;
            tiles[currentIndex].classList.add("column-typed");
            tiles[currentIndex].classList.remove("column-blank");
            currentIndex++;
        }
    });
}

enter.addEventListener("click", function(){
    // spell check here


    if(currentIndex == (currentRow+1)*5){
        // matching algorithm here
        points = 0;

        // refresh opportinuty counter
        for(var p=0; p<26; p++){
            remainingOpportunities[p] = 0;
        }
        for(var p=0; p<5; p++){
            remainingOpportunities[keymap.get(currentWord[p])]++;
        }

        // first update keyboard
        for(var p=0; p<5; p++){
            for(var w=0; w<5; w++){
                if(tiles[currentRow*5+p].innerHTML == currentWord[w] && p == w){
                    keyStatus[keymap.get(tiles[currentRow*5+p].innerHTML)] = 3;
                }else if(tiles[currentRow*5+p].innerHTML == currentWord[w]){
                    if(keyStatus[keymap.get(tiles[currentRow*5+p].innerHTML)] != 3){
                        keyStatus[keymap.get(tiles[currentRow*5+p].innerHTML)] = 2;
                    }
                }else if(keyStatus[keymap.get(tiles[currentRow*5+p].innerHTML)] == 0){
                    keyStatus[keymap.get(tiles[currentRow*5+p].innerHTML)] = 1;
                }
            }
        }

        for(var p=0; p<26; p++){
            switch(keyStatus[p]){
                case 0:
                    break;
                case 1:
                    keyboard[p].classList.add("key-wrong");
                    keyboard[p].classList.remove("key");
                    break;
                case 2:
                    keyboard[p].classList.add("key-B");
                    keyboard[p].classList.remove("key");
                    break;
                case 3:
                    keyboard[p].classList.add("key-A");
                    keyboard[p].classList.remove("key-B");
                    keyboard[p].classList.remove("key");
                    break;
            }
        }
        // end of updating keyboard


        // update tiles
        for(var p=0; p<5; p++){
            tileStatus[p] = 0;
            for(var w=0; w<5; w++){
                if(tiles[currentRow*5+p].innerHTML == currentWord[w] && p == w){
                    tileStatus[p] = 3;
                    remainingOpportunities[keymap.get(tiles[currentRow*5+p].innerHTML)]--;
                    points++;
                }else if(tiles[currentRow*5+p].innerHTML == currentWord[w]){
                    if(tileStatus[p] != 3){
                        tileStatus[p] = 2;
                    }
                }
            }
            if(tileStatus[p] == 0){
                tileStatus[p] = 1;
            }
        }

        for(var p=0; p<5; p++){
            if(tileStatus[p] == 2 && remainingOpportunities[keymap.get(tiles[currentRow*5+p].innerHTML)] <= 0){
                tileStatus[p] = 1;
            }else if(tileStatus[p] == 2){
                remainingOpportunities[keymap.get(tiles[currentRow*5+p].innerHTML)]--;
            }
        }

        for(var p=0; p<5; p++){
            switch(tileStatus[p]){
                case 0:
                    break;
                case 1:
                    shareOutput[shareIndex] = "⬛";
                    break;
                case 2:
                    shareOutput[shareIndex] = "🟨";
                    break;
                case 3:
                    shareOutput[shareIndex] = "🟩";
                    break;
            }
            shareIndex++;
        }
        shareOutput[shareIndex] = "\n";
        shareIndex++;
        shareString = "Mordle "+currentWordIndex.toString()+" "+(currentRow+1).toString()+"/6\n";
        for(var p=0; p<shareIndex; p++){
            shareString = shareString + shareOutput[p];
        }
        shareOutputDiv.innerHTML = shareString;


        for(var p=0; p<5; p++){
            switch(tileStatus[p]){
                case 0:
                    break;
                case 1:
                    tiles[currentRow*5+p].classList.add("column-wrong");
                    tiles[currentRow*5+p].classList.remove("column-typed");
                    break;
                case 2:
                    tiles[currentRow*5+p].classList.add("column-B");
                    tiles[currentRow*5+p].classList.remove("column-typed");
                    break;
                case 3:
                    tiles[currentRow*5+p].classList.add("column-A");
                    tiles[currentRow*5+p].classList.remove("column-typed");
                    break;
            }
        }



        if(currentRow == 5){
            currentGameEnd = 1;
        }

        if(points == 5){
            currentGameWon = 1;
            currentGameEnd = 1;
        }


        // after every game, count total games played and update stats
        if(currentGameEnd == 1){
            gamesPlayed++;
            if(currentGameWon == 0){
                currentStreak = 0;
                thisRoundScore = 0;
            }

            for(var p=0; p<5; p++){
                barColors[p] = "gray";
            }
            gamesPlayedDisplay.innerHTML = gamesPlayed;
            winPercentageDisplay.innerHTML = Math.round(gamesWon*100/gamesPlayed, 0);
            currentStreakDisplay.innerHTML = currentStreak;
            chart.update();
        }

        // if we win this game, see how many moves we did it in and update graph
        if(currentGameWon == 1){
            switch(currentRow){
                case 0:
                    thisRoundScore = 0;
                    one++;
                    break;
                case 1:
                    thisRoundScore = 1;
                    two++;
                    break;
                case 2:
                    thisRoundScore = 2;
                    three++;
                    break;
                case 3:
                    thisRoundScore = 3;
                    four++;
                    break;
                case 4:
                    thisRoundScore = 4;
                    five++;
                    break;
                case 5:
                    thisRoundScore = 5;
                    six++;
                    break;
            }
            for(var p=0; p<5; p++){
                barColors[p] = "gray";
            }
            barColors[thisRoundScore] = "#6aaa64";
            x = [one, two, three, four, five, six];
            chart.data.datasets[0].data = x;
            chart.update();
            gamesWon++;
            currentStreak++;
            if(currentStreak > maxStreak){
                maxStreak = currentStreak;
            }

            gamesPlayedDisplay.innerHTML = gamesPlayed;
            winPercentageDisplay.innerHTML = Math.round(gamesWon*100/gamesPlayed, 0);
            currentStreakDisplay.innerHTML = currentStreak;
            maxStreakDisplay.innerHTML = maxStreak;
        }

        if(currentGameEnd == 1 && currentGameWon == 0){
            window.alert("The word is: "+currentWord);
        }

        currentRow++;
    }
});

backspace.addEventListener("click", function(){
    if(currentIndex > currentRow*5){
        tiles[currentIndex-1].innerHTML = "";
        tiles[currentIndex-1].classList.add("column-blank");
        tiles[currentIndex-1].classList.remove("column-typed");
        currentIndex--;
    }
});

var again = document.getElementById("again");
var stats = document.getElementById("stats");
var newNum = 0;

again.addEventListener("mouseover", function(){
    this.style.color = "#6aaa64";
});

again.addEventListener("mouseleave", function(){
    this.style.color = "black";
});

again.addEventListener("click", function(){
    if(currentGameEnd == 1){
        for(var k=0; k<26; k++){
            keyboard[k].classList.add("key");
            keyboard[k].classList.remove("key-A");
            keyboard[k].classList.remove("key-B");
            keyboard[k].classList.remove("key-wrong");
        }
        for(var j=0; j<30; j++){
            tiles[j].innerHTML = "";
            tiles[j].classList.add("column-blank");
            tiles[j].classList.remove("column-A");
            tiles[j].classList.remove("column-B");
            tiles[j].classList.remove("column-wrong");
        }
        currentRow = 0;
        currentIndex = 0;
        currentGameEnd = 0;
        currentGameWon = 0;
        while(1){
            newNum = getRandomNumber(0, max-1);

            if(newNum != currentWordIndex){
                currentWordIndex = newNum;
                break;
            }
        }

        for(var p=0; p<26; p++){
            keyStatus[p] = 0;
        }
        for(var p=0; p<5; p++){
            tileStatus[p] = 0;
        }

        shareOutput = [];
        shareIndex = 0;

        currentWord = words[currentWordIndex];

        for(var p=0; p<26; p++){
            remainingOpportunities[p] = 0;
        }
        for(var p=0; p<5; p++){
            remainingOpportunities[keymap.get(currentWord[p])]++;
        }

    }else{
        window.alert("Please complete this one first!");
    }
});


stats.addEventListener("click", function(){
    overlay.style.display = "inherit";
    locker.style.display = "inherit";
});

stats.addEventListener("mouseover", function(){
    this.style.color = "#6aaa64";
});

stats.addEventListener("mouseleave", function(){
    this.style.color = "black";
});


// overlay
var close = document.getElementById("close");
var overlay = document.getElementById("overlay");
var locker = document.getElementById("locker");
var share = document.getElementById("share");

locker.addEventListener("click", function(){
    overlay.style.display = "none";
    locker.style.display = "none";
});

close.addEventListener("click", function(){
    overlay.style.display = "none";
    locker.style.display = "none";
});

close.addEventListener("mouseover", function(){
    this.style.color = "#6aaa64";
});

close.addEventListener("mouseleave", function(){
    this.style.color = "black";
});

share.addEventListener("click", function(){
    if(currentGameWon == 1){
        shareOutputDiv.style.display = "inherit";
        shareOutputDiv.focus();
        shareOutputDiv.select();
        document.execCommand('copy');
        shareOutputDiv.style.display = "none";
        window.alert("Results copied to clipboard!");
    }
});

share.addEventListener("mouseover", function(){
    this.style.backgroundColor = "rgba(106, 170, 64, 0.9)";
    this.style.borderColor = "rgba(106, 170, 64, 0.9)";
});

share.addEventListener("mouseleave", function(){
    this.style.backgroundColor = "#6aaa64";
    this.style.borderColor = "#6aaa64";
});

// chart.js
var y = ["1", "2", "3", "4", "5", "6"];
var x = [one, two, three, four, five, six];
var barColors = ["grey", "grey", "grey", "grey", "grey", "grey"];

var chart = new Chart("myChart", {
  type: "bar",
  data: {
    labels: y,
    datasets: [{
      backgroundColor: barColors,
      data: x
    }]
  },
  options: {
      scales: {
          x: {
              ticks: {
                  display: true
              }
          }
      },
      plugins: {
          legend: {
              display: false
          }
      },
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true
  }
});
