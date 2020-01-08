var Points = 0;
var Time = 30;
if (document.cookie === "") {
    var cookie = {"highScore": 0, "hitColor": "black", "blankColor": "white", "backColor": "black", "missColor": "#ff6363", "textColor": "white", "colors": ["#ceff38", "#0398fc"], "key": 90};
} else {
    var cookie = JSON.parse(document.cookie);
}
document.cookie = JSON.stringify(cookie);
var HighScore = cookie["highScore"];

var Colors = cookie["colors"];
var black = cookie["hitColor"];
var white = cookie["blankColor"];
var red = cookie["missColor"];
var BackgroundColor = cookie["backColor"];
var KeyNum = cookie["key"];
var TextColor = cookie["textColor"];

var CurrentTile;
var First = true;
var Combo = 0;
var Tiles = {};
var userData;

for (var i = 0; i < 16; i++) {
    Tiles[i] = {"color": "white"};
}

function login() {
    $.post("http://localhost:1273/api/login", {username: document.getElementById('usernameInput').value, password: document.getElementById('passwordInput').value}, data => {
        data = JSON.parse(data);
        if (data["status"] === "fail") return;
        document.getElementById('loginBtn').innerHTML = "Logged In";
        userData = data["userData"];
    });
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

    turnBlack(pick);
}

function tileClick(e, tileNum) {
    if (e.which === 3) return;
    if (tileNum != Number(String(CurrentTile.onmousedown).replace("function onmousedown(event) {\ntileClick(event, ", "").replace(")\n}", ""))) return console.log("Cheater");
    if (Tiles[tileNum]["color"] === "white") {
        clearInterval(timerLoop);
        setTimeout(() => {document.getElementById('clickStop').onclick = function(){reset()};}, 500);
        document.getElementById('clickStop').style.display = 'block';

        document.getElementsByClassName("tile")[tileNum].style.transition = "background 0.1s ease";
        document.getElementsByClassName("tile")[tileNum].style.background = red;
        setTimeout(() => {
            document.getElementsByClassName("tile")[tileNum].style.transition = "background 0.3s ease";
        }, 10);

        if (Points > HighScore) HighScore = Points;
        document.getElementById('highScore').innerHTML = HighScore;
        cookieUpdate();
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
                        document.getElementsByClassName("tile")[i].style.background = red;

                        setTimeout(() => {
                            document.getElementsByClassName("tile")[i].style.transition = "background 0.3s ease";
                        }, 10);
                    }

                    if (Points > HighScore) HighScore = Points;
                    document.getElementById('highScore').innerHTML = HighScore;
                    cookieUpdate();

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

function render() {
    for (var i = 0; i < 16; i++) {
        document.getElementsByClassName("tile")[i].style.background = white;
    }

    for (var i = 0; i < 3; i++) {
        document.getElementsByClassName('scoreText')[i].style.color = TextColor;
    }

    document.body.style.backgroundColor = BackgroundColor;

    reset();
}

function cookieUpdate() {
    cookie["colors"] = Colors;
    cookie["hitColor"] = black;
    cookie["blankColor"] = white;
    cookie["missColor"] = red;
    cookie["backColor"] = BackgroundColor;
    cookie["key"] = Number(KeyNum);
    cookie["highScore"] = HighScore;
    cookie["textColor"] = TextColor;

    document.cookie = JSON.stringify(cookie);
}

function configOpen() {
    document.getElementById('configCon').style.width = '500px'; 
    document.getElementById('clickStop').style.display = 'block'; 
    document.getElementById('clickStop').onclick = function(){document.getElementById("configCon").style.width = "0px"; document.getElementById("onlineCon").style.width = "0px"; setTimeout(() => {var sheet = window.document.styleSheets[0]; sheet.insertRule('#onlineCon * {display: none;}', sheet.cssRules.length);}, 200); document.getElementById("clickStop").onclick = ""; document.getElementById("clickStop").style.display = "none"; reset();};
}

function onlineOpen() {
    var sheet = window.document.styleSheets[0];
    sheet.insertRule('#onlineCon * {display: revert;}', sheet.cssRules.length);
    $.get("http://localhost:1273/api/leaderboard", result => {
        result = result.scores;
        document.getElementById('onlineCon').children[1].children[1].innerHTML = `<span style="color: gold">1:</span> ${result[0]["user"]}, ${result[0]["score"]}`;
        document.getElementById('onlineCon').children[1].children[2].innerHTML = `<span style="color: silver">2:</span> ${result[1]["user"]}, ${result[1]["score"]}`;
        document.getElementById('onlineCon').children[1].children[3].innerHTML = `<span style="color: #965b30">3:</span> ${result[2]["user"]}, ${result[2]["score"]}`;
        document.getElementById('onlineCon').children[1].children[4].innerHTML = `4: ${result[3]["user"]}, ${result[3]["score"]}`;
        document.getElementById('onlineCon').children[1].children[5].innerHTML = `5: ${result[4]["user"]}, ${result[4]["score"]}`;
    });
    //document.getElementById('onlineCon').children[1].children[1].innerHTML = 
    document.getElementById('onlineCon').style.width = '500px'; 
    document.getElementById('clickStop').style.display = 'block'; 
    document.getElementById('clickStop').onclick = function(){document.getElementById("configCon").style.width = "0px"; document.getElementById("onlineCon").style.width = "0px"; setTimeout(() => {var sheet = window.document.styleSheets[0]; sheet.insertRule('#onlineCon * {display: none;}', sheet.cssRules.length);}, 200); document.getElementById("clickStop").onclick = ""; document.getElementById("clickStop").style.display = "none"; reset();};
}

window.onload = function() {
    document.body.addEventListener("keydown", e => {
        if (e.which === Number(KeyNum)) {
            var clickEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent("mousedown", true, true);
            CurrentTile.dispatchEvent(clickEvent);
        }
    });

    document.getElementById('hitKey').value = KeyNum;
    document.getElementById('hitKey').addEventListener("change", () => {
        KeyNum = document.getElementById('hitKey').value;
        cookieUpdate();
        render();
    });
    
    document.getElementById('hitColor').value = black;
    document.getElementById('hitColor').addEventListener("change", () => {
        black = document.getElementById('hitColor').value;
        cookieUpdate();
        render();
    });

    document.getElementById('blankColor').value = white;
    document.getElementById('blankColor').addEventListener("change", () => {
        white = document.getElementById('blankColor').value;
        cookieUpdate();
        render();
    });

    document.getElementById('missColor').value = red;
    document.getElementById('missColor').addEventListener("change", () => {
        red = document.getElementById('missColor').value;
        cookieUpdate();
        render();
    });

    document.getElementById('backColor').value = BackgroundColor;
    document.getElementById('backColor').addEventListener("change", () => {
        BackgroundColor = document.getElementById('backColor').value;
        cookieUpdate();
        render();
    });

    document.getElementById('textColor').value = TextColor;
    document.getElementById('textColor').addEventListener("change", () => {
        TextColor = document.getElementById('textColor').value;
        cookieUpdate();
        render();
    });

    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    }, false);

    document.body.addEventListener('mousemove', e => {CurrentTile = e.target});

    document.getElementById('highScore').innerHTML = HighScore;
    render();
};