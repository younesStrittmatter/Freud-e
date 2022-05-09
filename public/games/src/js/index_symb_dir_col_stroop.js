import {initJsPsych, data} from 'jspsych'
import {htmlKeyboardResponse} from '@jspsych/plugin-html-keyboard-response';
import {fullscreen} from '@jspsych/plugin-fullscreen'
import {writeId, writeData, readHighscore, writeHighscore} from "../../../src/js/io";
import {randomId} from "../../../src/js/util"

/*** INIT ***/
let id = randomId();
let id_exp = 'symb_dir_col_stroop';
writeId(id);
let highscore_start;
readHighscore(id_exp).then(x => {
    highscore_start = x;
});

let layouts = [];

let color_style_blue = {color: '#eef', textShadow: '0 0 1vw #66f9, 0 0 2vw #00f9'};
let color_style_red = {color: '#fee', textShadow: '0 0 1vw #f669, 0 0 2vw #f009'};

let pos_top = {bottom: '13vw', left: '3vw'};
let pos_bottom = {bottom: '3vw', left: '10vw'};

/** Create layouts **/

let button_combinations = [
    {x: {color: 'red', position: 'top'}},
    {x: {color: 'red', position: 'bottom'}},
    {x: {color: 'blue', position: 'top'}},
    {x: {color: 'red', position: 'bottom'}}
];

let button_combination_index = Math.floor(Math.random() * button_combinations.length);
let layout = button_combinations[button_combination_index];

let buttons_position = 'left';

if (Math.random() < .5) {
    buttons_position = 'right';
}

let left_bottom = {};
let left_top = {};

if (layout.x.position === 'bottom') {
    left_bottom.key = 'x';
    left_bottom.css = 'x-button';
    left_top.key = 'o';
    left_top.css = 'o-button';
} else {
    left_bottom.key = 'o';
    left_bottom.css = 'o-button';
    left_top.key = 'x';
    left_top.css = 'x-button';
}
if (layout.x.color === 'red') {
    left_bottom.style = {};
    left_top.style = {};
    if (layout.x.position === 'bottom') {
        left_bottom.style.color = color_style_red.color;
        left_bottom.style.textShadow = color_style_red.textShadow;
        left_top.style.color = color_style_blue.color;
        left_top.style.textShadow = color_style_blue.textShadow;
    } else {
        left_bottom.style.color = color_style_blue.color;
        left_bottom.style.textShadow = color_style_blue.textShadow;
        left_top.style.color = color_style_red.color;
        left_top.style.textShadow = color_style_red.textShadow;
    }
} else {
    left_bottom.style = {};
    left_top.style = {};
    if (layout.x.position === 'bottom') {
        left_bottom.style.color = color_style_blue.color;
        left_bottom.style.textShadow = color_style_blue.textShadow;
        left_top.style.color = color_style_red.color;
        left_top.style.textShadow = color_style_red.textShadow;
    } else {
        left_bottom.style.color = color_style_red.color;
        left_bottom.style.textShadow = color_style_red.textShadow;
        left_top.style.color = color_style_blue.color;
        left_top.style.textShadow = color_style_blue.textShadow;
    }
}
left_bottom.style.bottom = pos_bottom.bottom;
if (buttons_position === 'left') {
    left_bottom.style.left = pos_bottom.left;
    left_top.style.left = pos_top.left;
} else {
    left_bottom.style.right = pos_bottom.left;
    left_top.style.right = pos_top.left;
}

left_top.style.bottom = pos_top.bottom;


if (buttons_position === 'left') {
    layouts.push({
        right: {key: {up: 'u', down: 'd'}, is_swipe: true},
        left_bottom,
        left_top,
        right_top: {key: 'e', css: 'exit-button'}
    });
} else {
    layouts.push({
        left: {key: {up: 'u', down: 'd'}, is_swipe: true},
        left_bottom,
        left_top,
        right_top: {key: 'e', css: 'exit-button'}
    });
}

let blue_key = 'x';
let red_key = 'o';

if (layout.x.color === 'red') {
    blue_key = 'o';
    red_key = 'x';
}
/** Parameters for experiment **/

let fixation_duration = 1500;
let trial_duration = 2000;
let feedback_duration = 1500;

let score = 0;
let current_best = 0;

let animation_direction_list = ['alternate', 'alternate-reverse', 'normal', 'reverse'];

let task_list = ['symbol', 'direction', 'color'];
let symbol_list = ['x', 'o'];
let direction_list = ['up', 'down'];
let color_list = ['blue', 'red'];

let trial_list = [];

for (let t = 0; t < task_list.length; t++) {
    for (let s = 0; s < symbol_list.length; s++) {
        for (let d = 0; d < direction_list.length; d++) {
            for (let c = 0; c < color_list.length; c++) {
                let tr = {
                    task: task_list[t],
                    symbol: symbol_list[s],
                    direction: direction_list[d],
                    color: color_list[c]
                };
                trial_list.push(tr);
            }
        }
    }
}

function makeTimelineVariable(task, symbol, direction, color) {
    let timeline_variable = {};
    timeline_variable.animation_delay = Math.random() * -2;
    let animation_direction_index = Math.floor(Math.random() * animation_direction_list.length);
    timeline_variable.animation_direction = animation_direction_list[animation_direction_index];
    timeline_variable.animation_duration = Math.random() * 2 + 1;
    timeline_variable.task = task;
    timeline_variable.symbol = symbol;
    timeline_variable.trial_text = symbol.toUpperCase();
    if (color === 'blue') {
        timeline_variable.trial_color_color = "#99f";
        timeline_variable.trial_color_glow = '0 0 1vw #00fe'

    } else {
        timeline_variable.trial_color_color = "#f99";
        timeline_variable.trial_color_glow = '0 0 1vw #f00e';
    }
    if (direction === 'up') {
        timeline_variable.trial_animation = 'down-to-up';
    } else if (direction === 'down') {
        timeline_variable.trial_animation = 'up-to-down';
    }
    if (task === 'symbol') {
        timeline_variable.fixation_prompt = 'Name the symbol';
        timeline_variable.correct_key = symbol;
    } else if (task === 'color') {
        timeline_variable.fixation_prompt = 'Name the color';
        if (color === 'blue') {
            timeline_variable.correct_key = blue_key;
        } else {
            timeline_variable.correct_key = red_key;
        }
    } else if (task === 'direction') {
        timeline_variable.fixation_prompt = 'Name the direction';
        if (direction === 'up') {
            timeline_variable.correct_key = 'u';
        } else {
            timeline_variable.correct_key = 'd';
        }
    }
    return timeline_variable;
}

let jsPsych = initJsPsych({
        extensions: [{
            type: jsPsychMobileButtonsExtension, params: layouts,
        }],
    }
);

jsPsych.data.addProperties(
    {
        subj_id: id,
        button_x_color: layout.x.color,
        button_x_position: layout.x.position,
        buttons_position: buttons_position,
    }
);

let unloadId = window.addEventListener('beforeunload', () => {
    let data = jsPsych.data.get().json();
    writeData(id, data);
    readHighscore(id_exp).then(x => {
        if (x < highscore_start) {
            writeHighscore(id_exp, highscore_start, id)
        }
    })
}, false);

function exit() {
    if (confirm('Back to the main menu?')) {
        window.removeEventListener('beforeunload', unloadId);
        let data = jsPsych.data.get().json();
        try {
            writeData(id, data)
        } finally {
            try {
                readHighscore(id_exp).then(x => {
                    if (x < highscore_start) {
                        try {
                            writeHighscore(id_exp, highscore_start, id)
                        } finally {
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

/*** END INIT ***/

let fixation = {
    type: jsPsychHtmlKeyboardResponse,
    choices: ['e'],
    response_ends_trial: false,
    trial_duration: fixation_duration,
    stimulus: function () {
        return `<div class="screen">` +
            `<div class="score"><span class="score-text">SCORE</span>  ${score}<br>` +
            `<span class="score-text">YOUR BEST</span> ${current_best}</div>` +
            `<div class="high-score" style="left: 2vw"><span class="score-text">HIGHSCORE</span> ${highscore_start}</div>` +
            `<div class="fixation-prompt"  before-text="${jsPsych.timelineVariable('fixation_prompt')}" style="animation-delay: ${jsPsych.timelineVariable('animation_delay')}; animation-direction: ${jsPsych.timelineVariable('animation_direction')}; animation-duration: ${jsPsych.timelineVariable('animation_duration')}">${jsPsych.timelineVariable('fixation_prompt')}</div>` +
            `</div>`;
    },
    extensions: [{type: jsPsychMobileButtonsExtension}],
    on_finish: function (data) {
        if (data.response === 'e') {
            exit()
        }
    }

};

let trial = {
    type: jsPsychHtmlKeyboardResponse,
    choices: ['u', 'd', 'x', 'o', 'e'],
    response_ends_trial: true,
    trial_duration: trial_duration,
    stimulus: function () {
        return `<div class="screen">` +
            `<div class="score"><span class="score-text">SCORE</span>  ${score}<br>` +
            `<span class="score-text">YOUR BEST</span> ${current_best}</div>` +
            `<div class="high-score" style="left: 2vw"><span class="score-text">HIGHSCORE</span> ${highscore_start}</div>` +
            `<div class="trial" style="animation-name: ${jsPsych.timelineVariable('trial_animation')}; color: ${jsPsych.timelineVariable('trial_color_color')}; text-shadow: ${jsPsych.timelineVariable('trial_color_glow')}; border-color: ${jsPsych.timelineVariable('trial_color_color')}; box-shadow: ${jsPsych.timelineVariable('{trial_color_glow')}">${jsPsych.timelineVariable('trial_text')}</div>` +
            `</div>`;
    },
    on_finish: function (data) {
        data.trial_symbol = jsPsych.timelineVariable('symbol');
        data.trial_color = jsPsych.timelineVariable('color');
        data.trial_direction = jsPsych.timelineVariable('direction');
        data.trial_task = jsPsych.timelineVariable('task');
        data.correct_key = jsPsych.timelineVariable('correct_key');
        data.accuracy = data.correct_key === data.response;
        if (data.response === 'e') {
            exit()
        }
    },
    extensions: [{type: jsPsychMobileButtonsExtension}]
};

let feedback = {
    type: jsPsychHtmlKeyboardResponse,
    choices: ['e'],
    response_ends_trial: false,
    trial_duration: feedback_duration,
    stimulus: function () {
        let data = jsPsych.data.get().last().trials[0];
        let points = 0;
        if (data.rt !== null && data.response !== null) {
            points = 10 - Math.floor(data.rt / 200);
        }
        if (data.correct_key === data.response) {
            score += points;
            if (score > current_best) {
                current_best = score;
            }
            if (score > highscore_start) {
                highscore_start = score;
            }
        } else {
            points = 0;
        }
        return `<div class="screen">` +
            `<div class="score"><span class="score-text">SCORE</span>  ${score}<br>` +
            `<span class="score-text">YOUR BEST</span> ${current_best}</div>` +
            `<div class="high-score" style="left: 2vw"><span class="score-text">HIGHSCORE</span> ${highscore_start}</div>` +
            `<div class="feedback">+ ${points}</div>` +
            `</div>`;
    },
    extensions: [{type: jsPsychMobileButtonsExtension}],
    on_finish: function (data) {
        if (data.response === 'e') {
            exit()
        }
    }
};


trial_list = trial_list.concat(trial_list);
trial_list = shuffleArray(trial_list);

let timeline_variables_list = [];

for (let i = 0; i < trial_list.length; i++) {
    let tr = trial_list[i];
    let trial = makeTimelineVariable(tr.task, tr.symbol, tr.direction, tr.color);
    timeline_variables_list.push(trial);
}


let restart = {
    type: jsPsychHtmlKeyboardResponse,
    choices: ['x', 'o', 'e'],
    stimulus: function () {
        return `<div class="screen">` +
            `<div class="score"><span class="score-text">SCORE</span>  ${score}<br>` +
            `<span class="score-text">YOUR BEST</span> ${current_best}</div>` +
            `<div class="high-score" style="left: 2vw"><span class="score-text">HIGHSCORE</span> ${highscore_start}</div>` +
            `<div class="restart">PRESS X TO RESTART OR O TO FINISH.</div>` +
            `</div>`;
    },
    extensions: [{type: jsPsychMobileButtonsExtension}],
    on_finish: function (data) {
        trial_list = shuffleArray(trial_list);
        timeline_variables_list = [];
        for (let i = 0; i < trial_list.length; i++) {
            let tr = trial_list[i];
            let trial = makeTimelineVariable(tr.task, tr.symbol, tr.direction, tr.color)
            timeline_variables_list.push(trial);
        }
        if (data.response === 'e') {
            exit()
        }
        score = 0;
    }
};

let timeline = [{
    timeline: [fixation, trial, feedback],
    timeline_variables: timeline_variables_list
}];

var loop_node = {
    timeline: timeline.concat([restart]),
    loop_function: function (data) {
        if (jsPsych.data.get().last().trials[0].response === 'x') {
            return true;
        } else {
            return false;
        }
    }
};
let enter_fullscreen = {
    type: jsPsychFullscreen,
    message: '<div class="fullscreen" ">The game starts.<br>You will enter fullscreen mode now.</div>',
    fullscreen_mode: true
};



jsPsych.run([enter_fullscreen, loop_node]);

function shuffleArray(array) {
    let curId = array.length;
    // There remain elements to shuffle
    while (0 !== curId) {
        // Pick a remaining element
        let randId = Math.floor(Math.random() * curId);
        curId -= 1;
        // Swap it with the current element.
        let tmp = array[curId];
        array[curId] = array[randId];
        array[randId] = tmp;
    }
    return array;
}
