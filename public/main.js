var Points = 0;
var Time = 30;
var HighScore = document.cookie;
if (HighScore === "") HighScore = 0;

var Colors = ["#ceff38", "#0398fc"];
var black = "black";
var white = "white";
var KeyNum = 90;

var CurrentTile;
var First = true;
var Combo = 0;
var Tiles = {};

for (var i = 0; i < 16; i++) {
    Tiles[i] = {"color": "white"};
}

function turnBlack(tileNum) {
    document.getElementsByClassName("tile")[tileNum].style.background = black;
    Tiles[tileNum]["color"] = "black";
}

function randomBlack(lastTile) {
    var picks = [];
    for (i in Tiles) {
        if (Tiles[i]["color"] === "white" && i != lastTile) {
            picks.push(i);
        }
    }

    if (picks.length === 0) {
        return;
    }

    var pick = picks[Math.round(Math.random() * Object.keys(picks).length)];
    if (pick === undefined) {
        randomBlack();
        return;
    }

    console.log(pick);
    turnBlack(pick);
}

function tileClick(e, tileNum) {
    if (e.which === 3) return;
    if (Tiles[tileNum]["color"] === "white") {
        clearInterval(timerLoop);
        setTimeout(() => {document.getElementById('clickStop').onclick = function(){reset()};}, 500);
        document.getElementById('clickStop').style.display = 'block';

        document.getElementsByClassName("tile")[tileNum].style.transition = "background 0.1s ease";
        document.getElementsByClassName("tile")[tileNum].style.background = "#ff6363";
        setTimeout(() => {
            document.getElementsByClassName("tile")[tileNum].style.transition = "background 0.3s ease";
        }, 10);

        if (Points > HighScore) HighScore = Points;
        document.getElementById('highScore').innerHTML = HighScore;
        document.cookie = HighScore;
    } else {
        if (First === true) {
            First = false;
            timerLoop = setInterval(() => {
                Time -= 1;

                if (Time === 0) {
                    clearInterval(timerLoop);
                    document.getElementById('clickStop').style.display = 'block';

                    for (var i = 0; i < 16; i++) {
                        document.getElementsByClassName("tile")[i].style.transition = "background 0.1s ease";
                        document.getElementsByClassName("tile")[i].style.background = "#ff6363";

                        setTimeout(() => {
                            document.getElementsByClassName("tile")[i].style.transition = "background 0.3s ease";
                        }, 10);
                    }

                    if (Points > HighScore) HighScore = Points;
                    document.getElementById('highScore').innerHTML = HighScore;
                    document.cookie = HighScore;

                    setTimeout(() => {document.getElementById('clickStop').onclick = function(){reset()};}, 500);
                }

                document.getElementById('timer').innerHTML = Time;
            }, 1000);
        }
        document.getElementById(`hitSound1`).cloneNode().play();

        document.getElementsByClassName("tile")[tileNum].style.transition = "none";
        if (Combo === 5) {
            document.getElementsByClassName("tile")[tileNum].style.background = Colors[0];
            Points += 5;
            Combo = 0;
        } else {
            document.getElementsByClassName("tile")[tileNum].style.background = Colors[1];
            Points += 1;
            Combo += 1;
        }
        document.getElementById('points').innerHTML = Points;

        setTimeout(() => {
            if (Tiles[tileNum]["color"] === "white") {
                document.getElementsByClassName("tile")[tileNum].style.background = white;
            } else {
                document.getElementsByClassName("tile")[tileNum].style.background = black;
            }
            document.getElementsByClassName("tile")[tileNum].style.transition = "background 0.3s ease";
        }, 10);

        Tiles[tileNum]["color"] = "white";
        randomBlack(tileNum);
    }
}

function reset() {
    for (var i = 0; i < 16; i++) {
        Tiles[i] = {"color": "white"};
        document.getElementsByClassName("tile")[i].style.background = white;
    }

    Combo = 0;
    First = true;
    Time = 30;
    Points = 0;
    document.getElementById('timer').innerHTML = Time;
    document.getElementById('points').innerHTML = Points;
    document.getElementById('clickStop').style.display = 'none';
    document.getElementById('clickStop').onclick = function(){};

    randomBlack();
    randomBlack();
    randomBlack();
}

window.onload = function() {
    document.body.addEventListener("keydown", e => {
        if (e.which === KeyNum) {
            var clickEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent("mousedown", true, true);
            CurrentTile.dispatchEvent(clickEvent);
        }
    });

    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    }, false);

    document.body.addEventListener('mousemove', e => {CurrentTile = e.target});

    document.getElementById('highScore').innerHTML = HighScore;
    randomBlack();
    randomBlack();
    randomBlack();
};

//ADD ANTI CHEAT LIKE IF CURRENTTILE === TILE YOU KNOW