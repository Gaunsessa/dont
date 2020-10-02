let game = new Game();

var current_tile;

document.body.addEventListener("keydown", e => {
    if (e.which === Number(90)) {
        let click_event = document.createEvent('MouseEvents');
        click_event.initEvent("mousedown", true, true);
        current_tile.dispatchEvent(click_event);
    }
});

document.addEventListener('contextmenu', e => { e.preventDefault(); }, false);
document.body.addEventListener('mousemove', e => { current_tile = e.target; });

document.getElementById('highScore').innerHTML = game.high_score;

game.reset();