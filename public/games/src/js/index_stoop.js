import {initJsPsych, data} from 'jspsych'
import {htmlKeyboardResponse} from '@jspsych/plugin-html-keyboard-response';
import {fullscreen} from '@jspsych/plugin-fullscreen'
import {writeId, writeData, readHighscore, writeHighscore} from "../../../src/js/io";
import {randomId} from "../../../src/js/util"

let id = randomId();
let id_exp = 'stroop';
writeId(id);
let highscore_start;
readHighscore(id_exp).then(x => {
    highscore_start = x;
    let div = document.getElementsByClassName('highScore')[0];
    div.innerHTML = `Highscore ${highscore_start}`

});
let start_time = 0;
let LIVES_START = 2;
let lives_current = LIVES_START;
let RUN_DURATION_START = 60000;
let run_duration_current = RUN_DURATION_START;
let TRIAL_DURATION_START = 4000;
let trial_duration_current = TRIAL_DURATION_START;
let TRIALS_PER_LEVEL = 20;
let trial_current = 0;
let level = 1;
let multiplier = 1;
let score = 0;
let high_score = 0;
let trial_params = {
    task: null,
    word: null,
    color: null,
    correct_key: null
};
let red_color = '#f00';
let blue_color = '#00f';
let font_color = '#223';

// COLORS
let BACKGROUND_COLOR = '#999';
let TRIAL_TIMER_COLOR = '#86b';
let TRIAL_TIMER_URGENT_COLOR = '#e58';

// LAYOUTS
let layout_trial = {
    left: {key: 'r', color: 'red'},
    right: {key: 'b', color: 'blue'}
};

let layout_instruction = {
    middle: {key: 'c', color: '#0007', innerText: 'Continue'},
};
let layout_game_over = {}

let layouts = [layout_trial, layout_instruction];


// JS_PSYCH INITIALISATION
let jsPsych = initJsPsych({
    extensions: [
        {
            type: jsPsychHudExtension, params: {
                html: function () {
                    return '<div class="lifeContainer">' +
                        '<div id="life_3" class="lifeSymbol on"></div>' +
                        '<div id="life_2" class="lifeSymbol on"></div>' +
                        '<div id="life_1" class="lifeSymbol on"></div>' +
                        '</div>' +
                        '<div id="trialTimerOuter" class="progressCircleOuter">' +
                        '<div id="trialTimerInner" class="progressCircleInner"></div></div>' +
                        '<div class="scoreBoard">' +
                        `<div class="boardPrompt highScore">Highscore ${highscore_start}</div>` +
                        `<div class="boardPrompt level">Level ${level}</div>` +
                        `<div class="boardPrompt score">${score}</div>` +
                        `<div class="boardPrompt multiplier">x${multiplier}</div>` +
                        '<div class="lvlProgressbarContainer"><div class="lvlProgressbarInnerContainer"><div class="lvlProgressbar"></div></div></div>' +
                        '</div>' +
                        '<div id="timeLeft">60</div>'
                }
            },

        },
        {
            type: jsPsychMobileButtonsExtension, params: layouts
        }
    ],
});

jsPsych.data.addProperties({subj_id: id});

// INTERVAL HANDLERS
let intervalID;
let trialTimerIntervalID;

let unloadId = window.addEventListener('beforeunload', () => {
    let data = jsPsych.data.get().json()
    writeData(id, data)
    readHighscore(id_exp).then(x => {
        if (x < highscore_start) {
            writeHighscore(id_exp, highscore_start, id)
        }
    })
}, false)

function exit() {
    if (confirm('Back to the main menu?')) {
        window.removeEventListener('beforeunload',unloadId);
        let data = jsPsych.data.get().json()
        try {
            writeData(id, data)
        } finally {
            try {
                readHighscore(id_exp).then(x => {
                    if (x < highscore_start) {
                        try {writeHighscore(id_exp, highscore_start, id)}
                        finally {
                            window.location.replace('../home.html')
                        }
                    }
                })
            } finally {
                window.location.replace('../home.html')
            }
        }

    }
}

// TRIALS
let start = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<div>Start Survival Mode.</div>',
    choices: 'c',
    on_load: function () {
        let display_element = jsPsych.getDisplayElement();
        let close_div = document.createElement('div');
        display_element.appendChild(close_div);
        close_div.classList.add('exitButton');
        close_div.addEventListener('touchstart', exit, false)
    },
    on_start: function () {
        let timer_div = document.getElementById('trialTimerOuter');
        timer_div.style.display = 'none';
        setLife(lives_current);
        randomiseTrialParams();
        let progress_bar = document.getElementsByClassName('lvlProgressbar')[0];
        progress_bar.style.width = '2%';
        progress_bar.style.background = '#d9e269';
        trial_current = 1;


    },
    on_finish: function () {
        intervalID = window.setInterval(increaseTime, 50);
    },
    extensions: [
        {
            type: jsPsychMobileButtonsExtension, params: {layout: 1}
        }]

};

let restart = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
        if (trial_current >= TRIALS_PER_LEVEL && lives_current > 0 && start_time <= run_duration_current) {
            if (!(level % 2) && level > 1 && lives_current < 4) {
                if (lives_current > 3) {
                    lives_current = 3;
                }
                setLife(lives_current);
                if (score > highscore_start) {
                    highscore_start = score;
                    let high_score_div = document.getElementsByClassName('highScore')[0]
                    high_score_div.innerHTML = `Highscore ${highscore_start}`
                    return `<div class="continue_screen">Congratulations! You have set a new highscore!<br>Level UP!<br>You reached level ${level + 1}.<br>You get an extra live</div>`;
                } else {
                    return `<div class="continue_screen">Level UP!<br>You reached level ${level + 1}.<br>You get an extra live</div>`;
                }
            }
            if (score > highscore_start) {
                highscore_start = score;
                let high_score_div = document.getElementsByClassName('highScore')[0]
                high_score_div.innerHTML = `Highscore ${highscore_start}`
                return `<div class="continue_screen">Congratulations! You have set a new highscore!<br>Level UP!<br>You reached level ${level + 1}</div>`;
            } else {
                return `<div class="continue_screen">Level UP!<br>You reached level ${level + 1}.</div>`;
            }
            return `<div class="continue_screen">Level UP!<br>You reached level ${level + 1}.</div>`;
        } else {
            let lvlTmp = level;
            level = 1;
            if (score > high_score) {
                high_score = score;
            }
            if (score > highscore_start) {
                highscore_start = score;
                let high_score_div = document.getElementsByClassName('highScore')[0]
                high_score_div.innerHTML = `Highscore ${highscore_start}`
                return `<div class="continue_screen">Congratulations! You have set a new highscore!<br>GAME OVER!<br>You reached level ${level + 1}.</div>`;
            } else {
                return `<div class="continue_screen">GAME OVER!<br>You reached level ${lvlTmp} with a score of ${score} points.</div>`;
            }

        }
    },
    choices: 'c',
    on_load: function () {
        let display_element = jsPsych.getDisplayElement();
        let close_div = document.createElement('div');
        display_element.appendChild(close_div);
        close_div.classList.add('exitButton');
        close_div.addEventListener('touchstart', exit, false)

    },
    on_start: function () {
        let timer_div = document.getElementById('trialTimerOuter');
        timer_div.style.display = 'none';

        window.clearInterval(intervalID);
        if (trial_current >= TRIALS_PER_LEVEL && lives_current > 0 && start_time <= run_duration_current) {
            level += 1;
            if (!(level % 2) && level > 1) {
                lives_current += 1;

            }

        } else {
            level = 1;
            if (score > high_score) {
                high_score = score;
            }
        }
        let level_div = document.getElementsByClassName('level')[0];
        level_div.innerHTML = `Level ${level}`
    },
    on_finish() {
        if (trial_current >= TRIALS_PER_LEVEL && lives_current > 0 && start_time <= run_duration_current) { // WON
            if (level % 2) {
                trial_duration_current *= .95;
                trial_duration_current = Math.floor(trial_duration_current);

            } else {
                run_duration_current *= .95;
                run_duration_current = Math.floor(run_duration_current);
            }

        } else { // LOST
            score = 0;
            multiplier = 1;
            let score_div = document.getElementsByClassName('score')[0];
            score_div.innerText = `${score}`;
            let multiplier_div = document.getElementsByClassName('multiplier')[0];
            multiplier_div.innerText = `${multiplier}`;
            lives_current = LIVES_START;
            trial_duration_current = TRIAL_DURATION_START;
            run_duration_current = RUN_DURATION_START;
            setLife(lives_current);
        }
        start_time = 0;
        trial_current = 0;
        intervalID = window.setInterval(increaseTime, 50);
        let progress_bar = document.getElementsByClassName('lvlProgressbar')[0];
        progress_bar.style.width = '2%';
        progress_bar.style.background = '#d9e269';
    },
    extensions: [
        {
            type: jsPsychMobileButtonsExtension, params: {layout: 1}
        }]
};

let trial = {
    type: jsPsychHtmlKeyboardResponse,
    trial_duration: function () {
        return trial_duration_current
    },
    stimulus: function () {
        return `<div class="target_stimulus ${trial_params.task}" style="color: ${trial_params.color}">${trial_params.word.toUpperCase()}</div>`
    },
    on_load: function () {
        let display_element = jsPsych.getDisplayElement();
        let close_div = document.createElement('div');
        display_element.appendChild(close_div);
        close_div.classList.add('exitButton');
        close_div.addEventListener('touchstart', exit, false)

    },
    on_start: function () {

        let timer_div = document.getElementById('trialTimerOuter');
        timer_div.style.display = 'block';
        let start_time_trial = 0;

        function timeTrial() {
            start_time_trial += 30;
            let degrees = getDegFromProgress(start_time_trial / (trial_duration_current / 100));
            let timeDiv = document.getElementById('trialTimerOuter');
            if (degrees < 270) {
                timeDiv.style.background = `linear-gradient(90deg, ${TRIAL_TIMER_COLOR} 50%, transparent 50%), linear-gradient(${degrees}deg, transparent 50%, ${TRIAL_TIMER_COLOR} 50%)`;
            } else {
                if (degrees < 360) {
                    timeDiv.style.background = `linear-gradient(90deg, transparent 50%, ${BACKGROUND_COLOR} 50%), linear-gradient(${degrees}deg, transparent 50%, ${TRIAL_TIMER_COLOR} 50%)`;
                } else {
                    timeDiv.style.background = `linear-gradient(90deg, transparent 50%, ${BACKGROUND_COLOR} 50%), linear-gradient(${degrees}deg, transparent 50%, ${TRIAL_TIMER_URGENT_COLOR} 50%)`;
                }
            }
        }

        trialTimerIntervalID = window.setInterval(timeTrial, 30);
    },
    on_finish: function (data) {
        data.correct_key = trial_params.correct_key;
        data.color = trial_params.color;
        data.word = trial_params.word;
        data.task = trial_params.task;
        randomiseTrialParams();
        window.clearInterval(trialTimerIntervalID);
        let progress_bar = document.getElementsByClassName('lvlProgressbar')[0];
        if (data.response === data.correct_key) {
            trial_current += 1;
            let multiplier_div = document.getElementsByClassName('multiplier')[0];
            let score_div = document.getElementsByClassName('score')[0];
            let time_inner_div = document.getElementById('trialTimerInner');
            if (data.rt < trial_duration_current * .25) {
                multiplier += 1;
                multiplier_div.classList.add('blinkScore');
                time_inner_div.classList.add('blinkTimer');
                window.setTimeout(() => {
                    let multiplier_div = document.getElementsByClassName('multiplier')[0];
                    let time_inner_div = document.getElementById('trialTimerInner');
                    multiplier_div.classList.remove('blinkScore');
                    time_inner_div.classList.remove('blinkTimer');
                }, 140);
            } else {
                multiplier = 1;
            }
            score += multiplier * level;
            multiplier_div.innerText = `x${multiplier}`;
            score_div.innerText = `${score}`;
            progress_bar.style.width = trial_current / TRIALS_PER_LEVEL * 100 + '%';
            progress_bar.style.background = '#0f0';
        } else {
            multiplier = 1;
            lives_current -= 1;
            blinkLive(lives_current + 1);
            window.setTimeout(() => {
                setLife(lives_current)
            }, 140);
            progress_bar.style.background = '#f00';
        }
        window.setTimeout(() => {
            let progress_bar = document.getElementsByClassName('lvlProgressbar')[0];
            progress_bar.style.background = '#d9e269';
        }, 140)


    },
    extensions: [
        {
            type: jsPsychMobileButtonsExtension
        }]
};

let loop_node_trial = {
    timeline: [trial],
    loop_function: function (data) {
        return start_time < run_duration_current && lives_current > 0 && trial_current < TRIALS_PER_LEVEL;
    },
};

let loop_experiment = {
    timeline: [loop_node_trial, restart],
    loop_function: function (data) {
        return true
    }
};

let enter_fullscreen = {
    type: jsPsychFullscreen,
    message: '<div class="fullscreen" ">The game starts.<br>You will enter fullscreen mode now.</div>',
    fullscreen_mode: true
};


jsPsych.run([enter_fullscreen, start, loop_experiment]);

function blinkLive(live) {
    let life_div_1 = document.getElementById('life_1');
    let life_div_2 = document.getElementById('life_2');
    let life_div_3 = document.getElementById('life_3');
    if (live === 1) {
        life_div_1.classList = null;
        life_div_1.classList.add('lifeSymbol', 'blink');
    }
    if (live === 2) {
        life_div_2.classList = null;
        life_div_2.classList.add('lifeSymbol', 'blink');
    }
    if (live === 3) {
        life_div_3.classList = null;
        life_div_3.classList.add('lifeSymbol', 'blink');
    }
}


function setLife(lives) {
    let life_div_1 = document.getElementById('life_1');
    let life_div_2 = document.getElementById('life_2');
    let life_div_3 = document.getElementById('life_3');
    if (lives > 0) {
        life_div_1.classList = null;
        life_div_1.classList.add('lifeSymbol', 'on');
    } else {
        life_div_1.classList = null;
        life_div_1.classList.add('lifeSymbol', 'off');
    }
    if (lives > 1) {
        life_div_2.classList = null;
        life_div_2.classList.add('lifeSymbol', 'on');
    } else {
        life_div_2.classList = null;
        life_div_2.classList.add('lifeSymbol', 'off');
    }
    if (lives > 2) {
        life_div_3.classList = null;
        life_div_3.classList.add('lifeSymbol', 'on');
    } else {
        life_div_3.classList = null;
        life_div_3.classList.add('lifeSymbol', 'off');
    }
}


function increaseTime() {
    let time_progress_div = document.getElementById("timeLeft");
    let time_left = (run_duration_current - start_time);
    if (time_progress_div) {
        if (time_left < 0) {
            time_left = 0
        }
        if (time_left < 5) {
            time_progress_div.color = red_color;
        } else {
            time_progress_div.color = font_color;
        }
        time_progress_div.innerHTML = Math.round(time_left / 1000).toString();
        start_time += 50;
    }
}

function getDegFromProgress(x) {
    let y = 90 + (360) * x / 100;
    if (y > 450) {
        y = 450;
    }
    if (y < 90) {
        y = 90;
    }
    return y
}

function randomiseTrialParams() {
    trial_params.task = Math.random() < .5 ? 'word' : 'color';
    trial_params.word = Math.random() < .5 ? 'red' : 'blue';
    trial_params.color = Math.random() < .5 ? red_color : blue_color;
    if (trial_params.task === 'word') {
        trial_params.correct_key = trial_params.word === 'red' ? 'r' : 'b';
    } else {
        trial_params.correct_key = trial_params.color === red_color ? 'r' : 'b';
    }
}
