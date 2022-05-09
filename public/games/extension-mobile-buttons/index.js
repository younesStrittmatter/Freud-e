var jsPsychMobileButtonsExtension = (function (jspsych) {
        "use strict";

        /**
         * **MOBILE-BUTTONS**
         *
         * Create an overlay of touch buttons to use jsPsych on mobile devices.
         *
         * @author Younes Strittmatter
         * @see {@link https://DOCUMENTATION_URL DOCUMENTATION LINK TEXT}
         */
        class jsPsychMobileButtonsExtension {
            constructor(jsPsych) {
                this.jsPsych = jsPsych;
            }

            initialize(params) {
                return new Promise((resolve, reject) => {
                    this.layouts = [];
                    for (let i = 0; i < params.length; i++) {
                        let middle, left, right, left_bottom, left_top, right_bottom, right_top,
                            forced_orientation = null;
                        let param = params[i];
                        if (param.middle) {
                            if (param.middle.is_swipe) {
                                middle = new SwipeButton('middle', param.middle, this.jsPsych);
                            } else {
                                middle = new Button('middle', param.middle, this.jsPsych);
                            }
                        }
                        if (param.left_bottom) {
                            if (param.left_bottom.is_swipe) {
                                left_bottom = new SwipeButton('left_bottom', param.left_bottom, this.jsPsych)
                            } else {
                                left_bottom = new Button('left_bottom', param.left_bottom, this.jsPsych);
                            }
                        }
                        if (param.left_top) {
                            if (param.left_top.is_swipe) {
                                left_top = new SwipeButton('left_top', param.left_top, this.jsPsych)
                            } else {
                                left_top = new Button('left_top', param.left_top, this.jsPsych);
                            }
                        }
                        if (param.right_bottom) {
                            if (param.right_bottom.is_swipe) {
                                right_bottom = new SwipeButton('right_bottom', param.right_bottom, this.jsPsych)
                            } else {
                                right_bottom = new Button('right_bottom', param.right_bottom, this.jsPsych);
                            }
                        }
                        if (param.right_top) {
                            if (param.right_top.is_swipe) {
                                right_top = new SwipeButton('right_top', param.right_top, this.jsPsych)
                            } else {
                                right_top = new Button('right_top', param.right_top, this.jsPsych);
                            }
                        }
                        if (param.left) {
                            if (param.left.is_swipe) {
                                left = new SwipeButton('left', param.left, this.jsPsych)
                            } else {
                                left = new Button('left', param.left, this.jsPsych);
                            }
                        }
                        if (param.right) {
                            if (param.right.is_swipe) {
                                right = new SwipeButton('right', param.right, this.jsPsych)
                            } else {
                                right = new Button('right', param.right, this.jsPsych);
                            }
                        }
                        if (param.forced_orientation) {
                            forced_orientation = {
                                orientation: null || param.forced_orientation.orientation,
                                prompt: null || param.forced_orientation.prompt
                            }
                        }
                        let buttons = {
                            middle,
                            left_bottom,
                            left_top,
                            right_bottom,
                            right_top,
                            left,
                            right,
                            forced_orientation
                        };
                        this.layouts.push(buttons);
                        this.orientation_change = false;

                    }

                    resolve();
                });
            }

            method_orientation_change() {
                this.orientation_change = true;
            }

            on_start(params) {
                this.orientation_change = false;
                window.addEventListener('orientationchange', this.method_orientation_change.bind(this), false)

            }

            on_load(params) {
                let display_element = this.jsPsych.getDisplayElement();
                let index = (params && params.layout) || 0;
                let buttons = this.layouts[index];
                if (buttons.forced_orientation) {
                    let forced = document.createElement('div');
                    display_element.appendChild(forced);
                    if (buttons.forced_orientation.orientation === 'landscape') {
                        forced.classList.add('forced_landscape');
                        let text = buttons.forced_orientation.prompt || "Please use the device in landscape mode";
                        forced.innerHTML = text;
                    } else if (buttons.forced_orientation.orientation === 'portrait') {
                        forced.classList.add('forced_portrait');
                        let text = buttons.forced_orientation.prompt || "Please use the device in portrait mode";
                        forced.innerHTML = text;
                    }
                }
                if (buttons.middle) {
                    buttons.middle.div.addEventListener('touchstart', buttons.middle.start_listener.bind(buttons.middle), false);
                    buttons.middle.div.addEventListener('touchend', buttons.middle.end_listener.bind(buttons.middle), false);
                    if (buttons.middle.is_swipe) {
                        buttons.middle.div.addEventListener('touchmove', buttons.middle.move_listener.bind(buttons.middle), false);
                        display_element.appendChild(buttons.middle.div_out);
                        buttons.middle.div_out.appendChild(buttons.middle.div);
                    } else {
                        display_element.appendChild(buttons.middle.div);
                    }
                }
                if (buttons.left_bottom) {
                    buttons.left_bottom.div.addEventListener('touchstart', buttons.left_bottom.start_listener.bind(buttons.left_bottom), false);
                    buttons.left_bottom.div.addEventListener('touchend', buttons.left_bottom.end_listener.bind(buttons.left_bottom), false);
                    display_element.appendChild(buttons.left_bottom.div);
                    if (buttons.left_bottom.is_swipe) {
                        buttons.left_bottom.div.addEventListener('touchmove', buttons.left_bottom.move_listener.bind(buttons.left_bottom), false);
                        display_element.appendChild(buttons.left_bottom.div_out);
                        buttons.left_bottom.div_out.appendChild(buttons.left_bottom.div);
                    } else {
                        display_element.appendChild(buttons.left_bottom.div);
                    }
                }
                if (buttons.left_top) {
                    buttons.left_top.div.addEventListener('touchstart', buttons.left_top.start_listener.bind(buttons.left_top), false);
                    buttons.left_top.div.addEventListener('touchend', buttons.left_top.end_listener.bind(buttons.left_top), false);
                    if (buttons.left_top.is_swipe) {
                        buttons.left_top.div.addEventListener('touchmove', buttons.left_top.move_listener.bind(buttons.left_top), false);
                        display_element.appendChild(buttons.left_top.div_out);
                        buttons.left_top.div_out.appendChild(buttons.left_top.div);
                    } else {
                        display_element.appendChild(buttons.left_top.div);
                    }
                }
                if (buttons.right_bottom) {
                    buttons.right_bottom.div.addEventListener('touchstart', buttons.right_bottom.start_listener.bind(buttons.right_bottom), false);
                    buttons.right_bottom.div.addEventListener('touchend', buttons.right_bottom.end_listener.bind(buttons.right_bottom), false);
                    if (buttons.right_bottom.is_swipe) {
                        buttons.right_bottom.div.addEventListener('touchmove', buttons.right_bottom.move_listener.bind(buttons.right_bottom), false);
                        display_element.appendChild(buttons.right_bottom.div_out);
                        buttons.right_bottom.div_out.appendChild(buttons.right_bottom.div);
                    } else {
                        display_element.appendChild(buttons.right_bottom.div);
                    }
                }
                if (buttons.right_top) {
                    buttons.right_top.div.addEventListener('touchstart', buttons.right_top.start_listener.bind(buttons.right_top), false);
                    buttons.right_top.div.addEventListener('touchend', buttons.right_top.end_listener.bind(buttons.right_top), false);
                    if (buttons.right_top.is_swipe) {
                        buttons.right_top.div.addEventListener('touchmove', buttons.right_top.move_listener.bind(buttons.right_top), false);
                        display_element.appendChild(buttons.right_top.div_out);
                        buttons.right_top.div_out.appendChild(buttons.right_top.div);
                    } else {
                        display_element.appendChild(buttons.right_top.div);
                    }
                }

                if (buttons.right) {
                    buttons.right.div.addEventListener('touchstart', buttons.right.start_listener.bind(buttons.right), false);
                    buttons.right.div.addEventListener('touchend', buttons.right.end_listener.bind(buttons.right), false);
                    if (buttons.right.is_swipe) {
                        buttons.right.div.addEventListener('touchmove', buttons.right.move_listener.bind(buttons.right), false);
                        display_element.appendChild(buttons.right.div_out);
                        buttons.right.div_out.appendChild(buttons.right.div);
                    } else {
                        display_element.appendChild(buttons.right.div);
                    }
                }
                if (buttons.left) {
                    buttons.left.div.addEventListener('touchstart', buttons.left.start_listener.bind(buttons.left), false);
                    buttons.left.div.addEventListener('touchend', buttons.left.end_listener.bind(buttons.left), false);
                    if (buttons.left.is_swipe) {
                        buttons.left.div.addEventListener('touchmove', buttons.left.move_listener.bind(buttons.left), false);
                        display_element.appendChild(buttons.left.div_out);
                        buttons.left.div_out.appendChild(buttons.left.div);
                    } else {
                        display_element.appendChild(buttons.left.div);
                    }
                }
            }


            on_finish(params) {

                for (let i = 0; i < this.layouts.length; i++) {
                    let buttons = this.layouts[i];
                    if (buttons.middle) {
                        buttons.middle.div.ontouchstart = null;
                    }
                    if (buttons.left_bottom) {
                        buttons.left_bottom.div.ontouchstart = null;
                    }
                    if (buttons.left_top) {
                        buttons.left_top.div.ontouchstart = null;
                    }
                    if (buttons.right_bottom) {
                        buttons.right_bottom.div.ontouchstart = null;
                    }
                    if (buttons.right_top) {
                        buttons.right_top.div.ontouchstart = null;
                    }
                    if (buttons.left) {
                        buttons.left.div.ontouchstart = null;
                    }
                    if (buttons.right) {
                        buttons.right.div.ontouchstart = null;
                    }
                }

                let index = (params && params.layout) || 0;
                let buttons = this.layouts[index];
                let is_portrait = window.matchMedia("(orientation: portrait)").matches;
                let is_landscape = window.matchMedia("(orientation: landscape)").matches;
                let orientated_correct = true;
                let forced_orientation = null;
                let forced_orientation_prompt = null;
                let mobile_orientation = is_portrait ? 'portrait' : 'landscape';
                if (buttons.forced_orientation) {
                    if (buttons.forced_orientation.orientation) {
                        if (buttons.forced_orientation.orientation === 'portrait') {
                            orientated_correct = is_portrait;
                            forced_orientation = 'portrait';
                            forced_orientation_prompt: buttons.forced_orientation.prompt || "Please use the device in portrait mode";
                        } else {
                            orientated_correct = is_landscape;
                            forced_orientation = 'landscape';
                            forced_orientation_prompt: buttons.forced_orientation.prompt || "Please use the device in landscape mode";
                        }
                    }
                }
                return {
                    mobile_forced_orientation: forced_orientation,
                    mobile_forced_orientation_prompt: forced_orientation_prompt,
                    mobile_is_orientated_correct: orientated_correct,
                    mobile_orientation_changed: this.orientation_change,
                    mobile_orientation: mobile_orientation
                };
            }
        }

        jsPsychMobileButtonsExtension.info = {
            name: "mobile-buttons",
        };

        return jsPsychMobileButtonsExtension;
    }
)
(jsPsychModule);

function byteToHex(num) {
    // Turns a number (0-255) into a 2-character hex number (00-ff)
    return ('0' + num.toString(16)).slice(-2);
}

function standardColor(color) {
    let cvs = document.createElement('canvas');
    cvs.height = 1;
    cvs.width = 1;
    let ctx = cvs.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    return ctx.getImageData(0, 0, 1, 1).data;
}


function stdColorToHex(color) {
    // Convert any CSS color to a hex representation
    // Examples:
    // colorToHex('red')            # '#ff0000'
    // colorToHex('rgb(255, 0, 0)') # '#ff0000'
    let hex;
    hex = [0, 1, 2].map(
        function (idx) {
            return byteToHex(color[idx]);
        }
    ).join('');
    return "#" + hex;
}

class SwipeButton {
    constructor(type, params, jsPsych) {
        this.type = type;
        this.is_swipe = true;
        this.jsPsych = jsPsych;
        this.div = document.createElement('div');
        this.div_out = document.createElement('div');
        this.key = (params && params.key);
        let c = 'jsSwipeButtonMiddle';
        if (type === 'left_bottom') {
            c = 'jsSwipeButtonLeftBottom';
        } else if (type === 'left_top') {
            c = 'jsSwipeButtonLeftTop';
        } else if (type === 'right_bottom') {
            c = 'jsSwipeButtonRightBottom';
        } else if (type === 'right_top') {
            c = 'jsSwipeButtonRightTop';
        } else if (type === 'left') {
            c = 'jsSwipeButtonLeft';
        } else if (type === 'right') {
            c = 'jsSwipeButtonRight';
        }


        let style = (params && params.css) || 'jsSwipeButton';
        if (style !== 'jsSwipeButton') {
            this.div.classList.add(style)
        } else {
            this.div_out.classList.add("jsSwipeButtonOut", c);
            this.div.classList.add(style);

        }
        let col = '#9999';
        if (params.color) {
            col = params.color;
            if (!col.startsWith('#')) {
                col = standardColor(col);
                col = stdColorToHex(col);
            }
            if (col.length === 4) {
                col += '9';
            } else if (col.length === 7) {
                col += '90';
            }
        }
        if (params.innerText) {
            this.div.innerText = params.innerText;
        }
        if (params.style) {
            for (let key in params.style) {
                this.div.style[key] = params.style[key];
            }
        }
        this.start_y = 0;
        this.start_x = 0;
        this.end_y = 0;
        this.end_x = 0;

    }

    start_listener(event) {
        this.start_y = event.touches[0].clientY;
        this.start_x = event.touches[0].clientX;
        this.end_y = event.touches[0].clientY;
        this.end_x = event.touches[0].clientX;
    }

    move_listener(event) {

        this.end_y = event.touches[0].clientY;
        this.end_x = event.touches[0].clientX;


        let d_y = (this.end_y - this.start_y) / this.div.clientHeight * 100;// this.div.clientHeight;// / window.innerWidth;
        let d_x = (this.end_x - this.start_x) / this.div.clientWidth * 100;// this.div.clientWidth;// / window.innerWidth;


        d_x -= 50;
        d_y -= 50


        if (d_y > -15) {
            d_y = -15;
        } else if (d_y < -85) {
            d_y = -85;
        }
        if (d_x > -15) {
            d_x = -15;
        } else if (d_x < -85) {
            d_x = -85;
        }

        this.div.style.transform = `translate(${d_x}%, ${d_y}%)`;

    }

    end_listener(event) {
        this.end_x = 0;
        this.end_y = 0;
        if (this.type == 0) {
            this.div.style.transform = `translate(-50%, 50%)`;
        } else {
            this.div.style.transform = null;
        }
        let d_y = event.changedTouches[0].clientY - this.start_y;
        this.start_y = 0;
        let d_x = event.changedTouches[0].clientX - this.start_x;
        this.start_x = 0;
        let horizontal = (this.key.left || this.key.right) || false;
        let vertical = (this.key.up || this.key.down) || false;
        let both = (horizontal && vertical);
        if (both) {
            if (Math.abs(d_x) > Math.abs(d_y)) {
                if (d_x > 0 && this.key.right) {
                    this.jsPsych.pluginAPI.keyDown(this.key.right);
                    this.jsPsych.pluginAPI.keyUp(this.key.right);
                } else if (d_x < 0 && this.key.left) {
                    this.jsPsych.pluginAPI.keyDown(this.key.left);
                    this.jsPsych.pluginAPI.keyUp(this.key.left);
                }
            } else {
                if (d_y > 0 && this.key.down) {
                    this.jsPsych.pluginAPI.keyDown(this.key.down);
                    this.jsPsych.pluginAPI.keyUp(this.key.down);
                } else if (d_y < 0 && this.key.up) {
                    this.jsPsych.pluginAPI.keyDown(this.key.up);
                    this.jsPsych.pluginAPI.keyUp(this.key.up);
                }
            }
        } else if (horizontal) {
            if (d_x > 0 && this.key.right) {
                this.jsPsych.pluginAPI.keyDown(this.key.right);
                this.jsPsych.pluginAPI.keyUp(this.key.right);
            } else if (d_x < 0 && this.key.left) {
                this.jsPsych.pluginAPI.keyDown(this.key.left);
                this.jsPsych.pluginAPI.keyUp(this.key.left);
            }
        } else if (vertical) {
            if (d_y > 0 && this.key.down) {
                this.jsPsych.pluginAPI.keyDown(this.key.down);
                this.jsPsych.pluginAPI.keyUp(this.key.down);
            } else if (d_y < 0 && this.key.up) {
                this.jsPsych.pluginAPI.keyDown(this.key.up);
                this.jsPsych.pluginAPI.keyUp(this.key.up);
            }
        }
    }
}


class Button {
    constructor(type, params, jsPsych) {
        this.jsPsych = jsPsych;
        this.div = document.createElement('div');
        this.key = (params && params.key) || '';
        let c = 'jsTouchButtonMiddle';
        if (type === 'left_bottom') {
            c = 'jsTouchButtonLeftBottom';
        } else if (type === 'left_top') {
            c = 'jsTouchButtonLeftTop';
        } else if (type === 'right_bottom') {
            c = 'jsTouchButtonRightBottom';
        } else if (type === 'right_top') {
            c = 'jsTouchButtonRightTop';
        } else if (type === 'left') {
            c = 'jsTouchButtonLeft';
        } else if (type === 'right') {
            c = 'jsTouchButtonRight';
        }


        let style = (params && params.css) || 'jsTouchButton';
        if (style !== 'jsTouchButton') {
            this.div.classList.add(style)
        } else {
            this.div.classList.add(style, c);
        }
        let col = '#9999';
        if (params.color) {
            col = params.color;
            if (!col.startsWith('#')) {
                col = standardColor(col);
                col = stdColorToHex(col);
            }
            if (col.length === 4) {
                col += '9';
            } else if (col.length === 7) {
                col += '90';
            }
        }
        if (style === 'jsTouchButton') {
            this.div.style.boxShadow = "inset 0 0 0 .5vw " + col + ", 0 0 0 .5vw " + col;
        }
        if (params.innerText) {
            this.div.innerText = params.innerText;
        }
        if (params.style) {
            for (let key in params.style) {
                this.div.style[key] = params.style[key];
            }
        }

    }

    start_listener() {
        this.jsPsych.pluginAPI.keyDown(this.key);

    }

    end_listener() {
        this.jsPsych.pluginAPI.keyUp(this.key);
    }
}

