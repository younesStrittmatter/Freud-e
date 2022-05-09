var jsPsychRti = (function (jspsych) {
    "use strict";

    const info = {
        name: "rci",
        parameters: {
            choices: {
                type: jspsych.ParameterType.KEY,
                pretty_name: "Possible keys",
                default: undefined,
            },
            top: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Top position',
                default: '50vh',
            },
            left: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Left position',
                default: '50vw',
            },
            columns: {
                type: jspsych.ParameterType.INT,
                pretty_name: 'number of columns',
                default: 10,
            },
            rows: {
                type: jspsych.ParameterType.INT,
                pretty_name: 'number of rows',
                default: 10,
            },
            cell_width: {
                type: jspsych.ParameterType.INT,
                pretty_name: 'width of a cell',
                default: 20,
            },
            cell_height: {
                type: jspsych.ParameterType.INT,
                pretty_name: 'height of a cell',
                default: 20,
            },
            coherent_orientation: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'coherent orientation (up or down)',
                default: 'up',
            },
            coherent_position: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'coherent position (up or down)',
                default: 'up',
            },
            orientation_coherence: {
                type: jspsych.ParameterType.FLOAT,
                pretty_name: 'portion of triangles in coherent orientation',
                default: .5
            },
            position_coherence: {
                type: jspsych.ParameterType.FLOAT,
                pretty_name: 'portion of triangles on coherent position',
                default: .5
            },
            trial_duration: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Trial duration",
                default: null
            },
            stimulus_duration: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Stimulus duration",
                default: null
            },
            response_ends_trial: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Response ends trial",
                default: true
            },
            color: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'color of the triangles',
                default: 'white'
            },
            horizont: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'if defined, color of horizont line',
                default: null
            },
            save_stim: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Save image",
                default: false
            }
        },
    };

    /**
     * **RTI**
     *
     * Random Triangles images:
     * This is a static version of a RDK.
     *
     * @author Younes Strittmatter
     * @see {@link https://DOCUMENTATION_URL DOCUMENTATION LINK TEXT}
     */
    class jsPsychRtiPlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }

        trial(display_element, trial) {

            let WIDTH = trial.columns * trial.cell_width;
            let HEIGHT = trial.rows * trial.cell_height;

            // create parent-element for canvas
            let container = document.createElement('div');
            container.classList.add('jsPsychRTIcontainer');
            display_element.appendChild(container);
            container.style.width = WIDTH + 20 + 'px';
            container.style.height = HEIGHT + 20 + 'px';
            container.style.position = "absolute";
            container.style.top = trial.top;
            container.style.left = trial.left;
            container.style.transform = 'translate(-50%, -50%)';
            // create a canvas and context
            let canvas = document.createElement('canvas');
            container.appendChild(canvas);
            canvas.width = WIDTH;
            canvas.height = HEIGHT;
            //Remove the margins and padding of the canvas
            canvas.style.margin = "0";
            //canvas.style.padding = "0";
            // use absolute positioning in top left corner to get rid of scroll bars
            canvas.style.position = "absolute";
            canvas.style.top = '50%';
            canvas.style.left = '50%';
            canvas.style.transform = 'translate(-50%, -50%)';

            let ctx = canvas.getContext('2d');

            let nr_triangles = Math.floor(trial.rows * trial.columns * .5);
            let feature_array_all = [];
            let nr_coherent_orientated = Math.floor(nr_triangles * trial.orientation_coherence);
            for (let i = 0; i < nr_coherent_orientated; i++) {
                feature_array_all.push({orientation: trial.coherent_orientation});
            }
            let orientation_opposite = trial.coherent_orientation === 'up' ? 'down' : 'up';
            for (let i = nr_coherent_orientated; i < nr_triangles; i++) {
                feature_array_all.push({orientation: orientation_opposite})
            }
            feature_array_all = shuffleArray(feature_array_all);

            nr_triangles = feature_array_all.length;
            let triangles_up = [];
            let triangles_down = [];
            let nr_coherent_position = Math.floor(nr_triangles * trial.position_coherence);

            if (trial.coherent_position === 'up') {
                for (let i = 0; i < nr_coherent_position; i++) {
                    triangles_up.push(feature_array_all[i])
                }
                for (let i = nr_coherent_position; i < nr_triangles; i++) {
                    triangles_down.push(feature_array_all[i])
                }
            } else {
                for (let i = 0; i < nr_coherent_position; i++) {
                    triangles_down.push(feature_array_all[i])
                }
                for (let i = nr_coherent_position; i < nr_triangles; i++) {
                    triangles_up.push(feature_array_all[i])
                }
            }

            let nr_side = Math.floor(trial.rows * trial.columns * .5);
            let start_up = triangles_up.length;
            let start_down = triangles_down.length;
            for (let i = start_up; i < nr_side; i++) {
                triangles_up.push(null)
            }
            for (let i = start_down; i < nr_side; i++) {
                triangles_down.push(null)
            }

            triangles_up = shuffleArray(triangles_up);
            triangles_down = shuffleArray(triangles_down);

            drawGrid(trial.columns, trial.rows, trial.cell_width, trial.cell_height, ctx)


            let i = 0;
            for (let c = 0; c < trial.columns; c++) {
                for (let r = 0; r < Math.floor(trial.rows / 2); r++) {
                    let t = triangles_up[i];
                    if (t && t !== null) {
                        drawTriangle(c, r, trial.cell_width, trial.cell_height, t.orientation, trial.color, ctx)
                    }
                    i++;
                }
            }
            i = 0;
            for (let c = 0; c < trial.columns; c++) {
                for (let r = Math.ceil(trial.rows / 2); r < trial.rows; r++) {
                    let t = triangles_down[i];
                    if (t && t !== null) {
                        drawTriangle(c, r, trial.cell_width, trial.cell_height, t.orientation, trial.color, ctx)
                    }
                    i++;
                }
            }
            //drawHorizont(trial.horizont, ctx, canvas);

            //drawBorder(trial.horizont,ctx,canvas);


            let response = {
                rt: null,
                key: null,
            };

            const end_trial = () => {
                this.jsPsych.pluginAPI.clearAllTimeouts();

                if (keyboardListener != null) {
                    this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
                }

                // save data
                let trialdata = {
                    choices: trial.choices,
                    columns: trial.columns,
                    rows: trial.rows,
                    top: trial.top,
                    left: trial.left,
                    rt: response.rt,
                    colors: trial.colors,
                    orientation_coherence: trial.orientation_coherence,
                    position_coherence: trial.position_coherence,
                    response: response.key,
                    horizont: trial.horizont
                };
                if (trial.save_stim) {
                    trialdata.img = {data: ctx.getImageData(0, 0, 1, 1).data, width: WIDTH, height: HEIGHT}
                }

                display_element.innerHTML = "";

                // next trial
                this.jsPsych.finishTrial(trialdata);
            };

            // function to handle responses by the subject
            function after_response(info) {

                // only record the first response
                if (response.key == null) {
                    response = info;
                }

                if (trial.response_ends_trial) {
                    end_trial();
                }
            }

            let keyboardListener = null;

            // start the response listener
            if (trial.choices !== "NO_KEYS") {
                keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
                    callback_function: after_response,
                    valid_responses: trial.choices,
                    rt_method: "performance",
                    persist: false,
                    allow_held_key: false,
                });
            }

            // hide stimulus if stimulus_duration is set
            if (trial.stimulus_duration !== null) {
                this.jsPsych.pluginAPI.setTimeout(function () {
                    canvas.style.visibility = 'hidden';
                }, trial.stimulus_duration);
            }

            // end trial if trial_duration is set
            if (trial.trial_duration !== null) {
                this.jsPsych.pluginAPI.setTimeout(end_trial, trial.trial_duration);
            }
        }
    }

    jsPsychRtiPlugin.info = info;

    return jsPsychRtiPlugin;
})
(jsPsychModule);

function standardColor(color) {
    let cvs = document.createElement('canvas');
    cvs.height = 1;
    cvs.width = 1;
    let ctx = cvs.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    return ctx.getImageData(0, 0, 1, 1).data;
}


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


function drawHorizont(color, ctx, canvas) {
    if (color) {
        ctx.beginPath()
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#0002';
        ctx.moveTo(0, canvas.height / 2) - 3;
        ctx.lineTo(canvas.width, canvas.height / 2 - 3);
        ctx.stroke();
        ctx.beginPath()
        ctx.strokeStyle = '#fff4';
        ctx.moveTo(canvas.width, canvas.height / 2) + 3;
        ctx.lineTo(0, canvas.height / 2 + 3);
        ctx.stroke();
    }

}

function drawGrid(columns, rows, cell_width, cell_height, context) {
    let LINE_WIDTH = 4;
    for (let i = 1; i < columns; i++) {
        context.beginPath();
        context.strokeStyle = '#ffff';
        context.moveTo(i * cell_width + LINE_WIDTH / 4, 0);
        context.lineTo(i * cell_width - LINE_WIDTH / 4, cell_height * (rows));
        context.stroke();
        context.beginPath();
        context.strokeStyle = '#0007';
        context.moveTo(i * cell_width - LINE_WIDTH / 4, 0);
        context.lineTo(i * cell_width - LINE_WIDTH / 4, cell_height * (rows));
        context.stroke()
    }
    for (let i = 1; i < rows; i++) {
        context.beginPath();
        context.strokeStyle = '#ffff';
        context.moveTo(0, i * cell_height + LINE_WIDTH / 4);
        context.lineTo(cell_width * columns, i * cell_height + LINE_WIDTH / 4);
        context.stroke();
        context.beginPath();
        context.strokeStyle = '#0007';
        context.moveTo(0, i * cell_height - LINE_WIDTH / 4);
        context.lineTo(cell_width * columns, i * cell_height - LINE_WIDTH / 4);
        context.stroke();
    }
}


function drawTriangle(column, row, cell_width, cell_height, orientation, color, context) {
    LINE_WIDTH = 3;
    PADDING = 5;

    let blue = '#16f';
    let green = '#1f3';
    let red = '#f24';
    let yellow = '#ff6';
    if (orientation === 'up') {

        let color = Math.random() < .5 ? (Math.random() < .5 ? blue : green) : Math.random() < .5 ? red : yellow;
        let start_x = column * cell_width;
        let start_y = (row + 1) * cell_height;

        context.fillStyle = color;
        context.beginPath();
        context.moveTo(start_x + PADDING, start_y - PADDING);
        context.lineTo(start_x + cell_width / 2, start_y - cell_height + PADDING);
        context.lineTo(start_x + cell_width - PADDING, start_y - PADDING);
        context.lineTo(start_x + PADDING, start_y - PADDING);
        context.fill()

        context.lineWidth = LINE_WIDTH;
        context.strokeStyle = '#fff7';
        context.beginPath();
        context.moveTo(start_x + PADDING, start_y - PADDING);
        context.lineTo(start_x + cell_width / 2, start_y - cell_height + PADDING);
        context.stroke();

        context.beginPath()
        context.strokeStyle = '#0003';
        context.moveTo(start_x + cell_width / 2, start_y - cell_height + PADDING);
        context.lineTo(start_x + cell_width - PADDING, start_y - PADDING);
        context.stroke();

        context.beginPath()
        context.strokeStyle = '#0004';
        context.moveTo(start_x + cell_width - PADDING, start_y - PADDING);
        context.lineTo(start_x + PADDING, start_y - PADDING);
        context.stroke();
    } else {
        let color = Math.random() < .5 ? (Math.random() < .5 ? blue : green) : Math.random() < .5 ? red : yellow;
        let start_x = column * cell_width;
        let start_y = row * cell_height;

        context.fillStyle = color;
        context.beginPath();
        context.moveTo(start_x + PADDING, start_y + PADDING);
        context.lineTo(start_x + cell_width - PADDING, start_y + PADDING);
        context.lineTo(start_x + cell_width / 2, start_y + cell_height - PADDING);
        context.lineTo(start_x + PADDING, start_y + PADDING);
        context.fill()

        context.beginPath();
        context.lineWidth = LINE_WIDTH;
        context.strokeStyle = '#fff6';
        context.moveTo(start_x + PADDING, start_y + PADDING);
        context.lineTo(start_x + cell_width - PADDING, start_y + PADDING);
        context.stroke()

        context.beginPath();
        context.strokeStyle = '#0005';
        context.moveTo(start_x + cell_width - PADDING, start_y + PADDING);
        context.lineTo(start_x + cell_width / 2, start_y + cell_height - PADDING);
        context.stroke();

        context.beginPath();
        context.strokeStyle = '#0001';
        context.moveTo(start_x + cell_width / 2, start_y + cell_height - PADDING);
        context.lineTo(start_x + PADDING, start_y + PADDING);
        context.stroke();
    }
}

function drawTriangle_(column, row, cell_width, cell_height, orientation, color, context) {
    if (orientation === 'up') {
        let start_x = column * cell_width;
        let start_y = (row + 1) * cell_height;
        context.beginPath();
        context.moveTo(start_x + 3, start_y - 3);
        context.lineTo(start_x + cell_width / 2, start_y - cell_height + 3);
        context.lineTo(start_x + cell_width - 3, start_y - 3);
        context.closePath();
    } else {
        let start_x = column * cell_width;
        let start_y = row * cell_height;
        context.beginPath();
        context.moveTo(start_x + 3, start_y + 3);
        context.lineTo(start_x + cell_width / 2, start_y + cell_height - 3);
        context.lineTo(start_x + cell_width - 3, start_y + 3);
        context.closePath();
    }
    context.fillStyle = color;
    context.fill()
}

