var $ = function (id) {
    return document.getElementById(id);
}

var paused = false;
var continued = false;
var game_over = false;

var speed = 1;
var score = 0;

var canvas, ctx, deadline;
var scoreEl;

var W = document.documentElement.clientWidth;
var H = document.documentElement.clientHeight;
var game_W = 0, game_H = 0;

var user_color = 'one';

var COLOR = {
    one : '#f00',
    two : '#00f'
}

var rects = [];

var delta = 0,
    time = 0,
    old_time = 0,
    timer = 0;

var rect_size = {
    x: 80,
    y: 80
}

function init() {
    scoreEl = $('score');
    canvas = $('canvas');
    deadline = $('deadline');

    ctx = canvas.getContext('2d');

    canvas.width = game_W = W;
    canvas.height = game_H = Math.ceil((H / 100) * 75);
    deadline.style.background = COLOR.one;
    $('one').style.background = COLOR.one;
    $('two').style.background = COLOR.two;
}

function new_game() {
    scoreEl.textContent = score;
    paused = false;
    rects = [];
    engine();
    hide_menu();
}

function continue_game() {
    paused = false;
    continued = true;
    engine();
    hide_menu();
}

function pause() {
    paused = true;
    show_menu();
}

function stop_game() {
    speed = 1;
    score = 0;
    game_over = true;
    pause();
}

function Rect() {
    this.size = [rect_size.x, rect_size.y];
    this.color = rand(0, 1) ? 'one' : 'two';
    this.position = [rand(0, W - rect_size.x), - rect_size.y];
}

Rect.prototype = {
    draw: function () {
        ctx.fillStyle = COLOR[this.color];
        ctx.fillRect(this.position[0], this.position[1], this.size[0], this.size[1]);
    }
}

function engine() {
    if (paused) {
        return;
    }
    // delta time
    if (continued) {
        old_time = new Date().getTime();
        continued = false;
    }

    time = new Date().getTime();
    delta = time - old_time;
    old_time = time;

    // update
    ctx.clearRect(0, 0, game_W, game_H);
    for (var index = rects.length - 1; index >= 0; index--) {
        var r = rects[index];

        if (r.position[1] + r.size[1] > game_H) {
            if (r.color != user_color) {
                stop_game();
                break;
            }

            score += 1;
            scoreEl.textContent = score;
            rects.splice(index, 1);

            continue;
        }
        speed += delta / 20000;
        r.position[1] += 0.1 * delta * speed;
        r.draw();
    }

    // create
    timer += delta;
    if (timer > 2500 / speed) {
        rects.push(new Rect());
        timer = 0;
    }

    // restart
    requestAnimationFrame(engine);
}

function hide_menu() {
    $('menu').classList.add("hidden");
}

function show_menu() {
    if(game_over) {
        $('continue').classList.add("hidden");
    }
    else {
         $('continue').classList.remove("hidden");
    }
    game_over = false;
    $('menu').classList.remove("hidden");
}

function set(color) {
    user_color = color;
    deadline.style.background = COLOR[color];
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}