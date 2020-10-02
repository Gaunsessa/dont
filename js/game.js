class Game {
    constructor() {
        if (document.cookie === "") {
            this.cookie = {"highScore": 0};
        } else {
            this.cookie = JSON.parse(document.cookie);
        }

        document.cookie = JSON.stringify(this.cookie);

        this.timer_loop;
        this.high_score = this.cookie["highScore"];
        this.points     = 0;
        this.time       = 30;
        this.first      = false;
        this.combo      = 0;
        this.tiles      = [
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
        ];
    }

    set_tile(tile_id) {
        document.getElementsByClassName("tile")[tile_id].style.background = "#14181c";
        this.tiles[tile_id] = 1;
    }

    set_random_tile(last_tile) {
        let tile_id = Math.round(Math.random() * this.tiles.length);
        if (this.tiles[tile_id] === 0 && tile_id != last_tile) {
            return this.set_tile(tile_id);
        } else {
            return this.set_random_tile(last_tile);
        }
    }

    tile_click(ty, tile_id) {
        if (ty.which != 1) return;
        
        if (this.tiles[tile_id] === 0) {
            return this.fail(tile_id);
        } else {
            if (this.first) {
                this.first = false;

                this.start();
            }

            document.getElementById(`hitSound1`).cloneNode().play();
            document.getElementsByClassName("tile")[tile_id].style.transition = "none";

            if (this.combo === 5) {
                document.getElementsByClassName("tile")[tile_id].style.background = "#ceff38";

                this.points += 5;
                this.combo = 0;
            } else {
                document.getElementsByClassName("tile")[tile_id].style.background = "#0398fc";

                this.points += 1;
                this.combo  += 1;
            }

            document.getElementById('points').innerHTML = this.points;

            setTimeout(() => {
                if (this.tiles[tile_id] === 0) {
                    document.getElementsByClassName("tile")[tile_id].style.background = "#ffffff";
                } else {
                    document.getElementsByClassName("tile")[tile_id].style.background = "#14181c";
                }
                document.getElementsByClassName("tile")[tile_id].style.transition = "background 0.3s ease";
            }, 10);

            this.tiles[tile_id] = 0;
            this.set_random_tile(tile_id);
        }
    }

    fail(tile_id) {
        clearInterval(this.timer_loop);
        document.getElementById("clickStop").style.display = "block";
        setTimeout(() => { document.getElementById("clickStop").onclick = () => { game.reset(); } }, 500);

        document.getElementsByClassName("tile")[tile_id].style.transition = "background 0.1s ease";
        document.getElementsByClassName("tile")[tile_id].style.background = "#ff6363";
        setTimeout(() => { document.getElementsByClassName("tile")[tile_id].style.transition = "background 0.3s ease"; }, 10);

        if (this.points > this.high_score) {
            this.high_score = this.points;
            document.getElementById("highScore").innerHTML = this.high_score;
            
            this.cookie["highScore"] = this.high_score;
            document.cookie = JSON.stringify(this.cookie);
        }
    }

    reset() {
        for (let i = 0; i < 16; i++) {
            this.tiles[i] = 0;
            document.getElementsByClassName("tile")[i].style.background = "#ffffff";
        }
    
        this.combo  = 0;
        this.first  = true;
        this.time   = 30;
        this.points = 0;

        document.getElementById("timer").innerHTML  = this.time;
        document.getElementById("points").innerHTML = this.points;
        document.getElementById("clickStop").style.display = "none";
        document.getElementById("clickStop").onclick = () => {};
    
        this.set_random_tile();
        this.set_random_tile();
        this.set_random_tile();
    }

    start() {
        this.timer_loop = setInterval(() => {
            this.time -= 1;

            if (this.time === 0) {
                clearInterval(this.timer_loop);
                document.getElementById("clickStop").style.display = "block";
                setTimeout(() => { document.getElementById("clickStop").onclick = () => { game.reset(); } }, 500);

                for (let i = 0; i < 16; i++) {
                    document.getElementsByClassName("tile")[i].style.transition = "background 0.1s ease";
                    document.getElementsByClassName("tile")[i].style.background = "#ff6363";
                }

                setTimeout(() => { 
                    for (let i = 0; i < 16; i++) {
                        document.getElementsByClassName("tile")[i].style.transition = "background 0.3s ease";
                    }
                }, 10);

                if (this.points > this.high_score) {
                    this.high_score = this.points;
                    document.getElementById("highScore").innerHTML = this.high_score;
                    
                    this.cookie["highScore"] = this.high_score;
                    document.cookie = JSON.stringify(this.cookie);
                }
            }

            document.getElementById('timer').innerHTML = this.time;
        }, 1000);
    }
}