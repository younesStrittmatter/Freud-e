# jspsych-mobile-buttons extension

This extension displays touch buttons allows the subject to respond to stimuli via touchscreen on mobile devices. The touch button send key press events so that all jsPsych plugins that use keyboard input are compatible.
It also tracks data for the orientation of mobile devices and can prompt the user to use a specific orientation.

## Citation




## Parameters
### Layouts
In the initialisation stage of the extension you can initialize layouts of buttons. These can then be used in the trials. 

| Parameter  | Description          |
| ---------- | -------------------- |
| params     | An array of layouts  |

#### Example

```javascript
let jsPsych = initJsPsych({
        extensions: [{
            type: jsPsychMobileButtonsExtension, params: [
                {
                    middle: {key: 'm'}
                }, // layout 0
                {
                    left: {key: 'l'}, 
                    right: {key: 'r'}
                }, // layout 1
                {
                    left_bottom: {key: 'r'},
                    left_top: {key: 'g'},
                    right_bottom: {key: 'y'},
                    right_top: {key: 'b'}
                }, // layout 3
                {
                    left: {key: 'l'}, 
                    right: {key: 'r'},
                    forced_orientation: {orientation: 'landscape'} // layout 4 forces the user to use landscape mode
                }               
            ]
        }]
    });
```

Every layout can contain any combination of the following buttons: 

| Button                   |  Default position                         |
| ------------------------ |  ---------------------------------------- |
| middle                   | bottom center of the screen.              |
| left                     | bottom left of the screen.                |
| right                    | bottom right of the screen.                                                                                                        |
| left_bottom              | bottom left of the screen more to the vertical center. This should be used along left_top if 2 buttons should be presented on the left side |
| left_top| bottom left of the screen more to the horizontal center. This should be used along left_bottom if 2 buttons should be presented on the left side |
| right_bottom| bottom right of the screen more to vertical middle. This should be used along right_top if 2 buttons should be presented on the right side |
| right_top | top right of the screen more to the middle. This should be used along right_top if 2 buttons should be presented on the right side | changes to the VAS response), and the trial ends when `trial_duration` has elapsed. |

A layout can also contain a parameter called forced_orientation with the following options:

| Parameter | Description | Default |
| --------- | ----------- | ------- |
| orientation | the orientation (either 'portrait' or 'landscape') | no default value must be specified |
| prompt | a prompt that shows up if the device is not in the correct orientation | "Please use the device in portrait mode" or "Please use the device in landscape mode" |

If the parameter forced_layout is defined, the screen of the device will be darkened and the prompt will appear when the device is orientated differently during the trial.

### Buttons
The buttons can be initialised with the following parameters

| Parameter | Desription |
| --------- | ---------- |
| key | This is a mandatory parameter. The key press that is send when touching the button |
| color | Not mandatory. The color of the button |
| innerText | Not mandatory. Inner text of the button |
| css | Here a css class can be defined (overwrites the default class, WARNING: You also have to define the positions of the buttons in the css class if you use this.)  |
| style | Not mandatory. Here most css styles can be customized (including the position and size of the button |

#### Example
```javascript
let jsPsych = initJsPsych({
        extensions: [{
            type: jsPsychMobileButtonsExtension, params: [
                {
                    middle: {
                        key: 'm',
                        color: 'blue',
                        style: {top: '2vw', fontWeight: 'bold', boxShadow: "1vw 1vw 2vw 1vw #0009"},
                        innerText: 'press'
                    }
                }
            ]
        }]
    });
```

### Trial 
In the jsPsych trials you only have to choose from the specified layouts. ATTENTION: The choices and correct_choices parameter of the trial must match the keys specified in the extensions initialisation.

#### Example
```javascript
let trial = {
        type: jsPsychRok, // can be used with plugins that use keyboard as input
        response_ends_trial: true,
        choices: ['l', 'r'],
        correct_choice: ['r'],
        extensions: [
            {
                type: jsPsychMobileButtonsExtension, params: {layout: 1}
            }
        ]
    };
```

## Data generated
The following data will be generated by the extension:

| name | description |
| ---- | ----------- |
| mobile_forced_orientation | if forced_orientation is defined this is the forced orientation, null else |
| mobile_forced_orientation_changed | if forced_orientation is defined, this is the prompt that shows up if the device is orientated differently, null else |
| mobile_is_orientated_correct | if forced_orientation is defined, this is true if the orientation of the device matches the forced orientation at the end of the task |
| mobile_orientation_changed | if the orientation of the device changed during the trial, this is true |
| mobile_orientation | this is the orientation of the device at the end of a trial |