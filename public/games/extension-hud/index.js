var jsPsychHudExtension = (function (jspsych) {
    "use strict";

    /**
     * **EXTENSION-NAME**
     *
     * SHORT EXTENSION DESCRIPTION
     *
     * @author YOUR NAME
     * @see {@link https://DOCUMENTATION_URL DOCUMENTATION LINK TEXT}
     */
    class jsPsychHudExtension {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }

        initialize(params) {
            return new Promise((resolve, reject) => {
                //appendStyleSheet();
                this.html = params.html;
                this.hud = createHud();

                let display_element = document.getElementsByClassName("jspsych-content-wrapper")[0];
                let html = this.html;
                if (this.html instanceof Function) {
                    html = this.html()
                }
                this.hud.innerHTML = html;
                display_element.appendChild(this.hud);


                resolve();
            });
        }

        on_start(params) {
        }

        on_load(params) {


        }

        on_finish(params) {
            return {
                data_property: "data_value",
            };
        }
    }

    jsPsychHudExtension.info = {
        name: "extension-name",
    };

    return jsPsychHudExtension;
})(jsPsychModule);


function appendStyleSheet() {
    let header = document.getElementsByTagName('head')[0];
    let styleSheet = document.createElement('link');
    styleSheet.rel = 'stylesheet';
    styleSheet.type = 'text/css';
    styleSheet.href = 'extension-hud/css/extension-hud.css'; // name of your css file
    header.appendChild(styleSheet);
}

function createHud() {
    let hud = document.createElement('div');
    hud.style.position = 'absolute';
    hud.style.left = '0';
    hud.style.top = '0';
    hud.style.width = '100vw';
    hud.style.height = '100vh';
    hud.style.zIndex = '-1';
    return hud;
}