//assign each panel to variables topLeft, topRight, bottomLeft, bottomRight
const topLeft = document.querySelector('.top-left-panel'); //grab top left element
const topRight = document.querySelector('.top-right-panel'); //grab top right element
const bottomLeft = document.querySelector('.bottom-left-panel'); //grab bottom left element
const bottomRight = document.querySelector('.bottom-right-panel'); //grab bottom right element

//define a function that will choose a random panel from the four listed above
const getRandomPanel = () => {
    const panels = [topLeft, topRight, bottomLeft, bottomRight]; //put panels into an array
    return panels[Math.round((Math.random() * panels.length))]; //choose random panel from array
};

//initialize the first one step sequence
const sequence = [getRandomPanel()];

//clone the sequence to a new variable so we can build on the original sequence and shorten this one
let sequenceToGuess = [...sequence];

//define a function that uses the two functions above to create a flashing effect
const flash = (panel, type, result) => {
    if (type === 'sequence'){
        [flashDel, resDel, color] = [1000, 250, ' white'];
    } else if (type === 'click') {
        [flashDel, resDel] = [150, 0];
        if (result === 'wrong') {
            color = ' gray';
        } else {
            color = ' white';
        }
    }
    return new Promise((resolve, reject) => {
        panel.className += color; //color panel white
        setTimeout(() => { //keep panel white for 1sec
            panel.className = panel.className.replace(color, ''); //change panel back
            setTimeout(() => {
                resolve(); //resume after 0.25sec
            }, resDel)
        }, flashDel)
    });
};

//define a function that will read the panel chosen and choose whether or not to continue based on the choice
let canClick = false; //don't let user click panels while flashing
const panelClicked = panelClicked => {
    if (!canClick) return; //don't let uer click panels if still flashing
    const expectedPanel = sequenceToGuess.shift(); //remove first panel from beginning of remaining sequence
    if (expectedPanel === panelClicked) { //continue to next step if correct panel is clicked
        (async () => {
            flash(panelClicked, 'click', 'correct');
        })();
        if (sequenceToGuess.length === 0) { //if the entire remaining sequence is now empty, start new sequence
            setTimeout(() => {
                sequence.push(getRandomPanel()); //add new panel to existing sequence
                sequenceToGuess = [...sequence]; //copy new sequence to sequence that will be shortened
                flashSequence()}, 500) //wait 0.5sec, then flash new sequence
        }
    } else { //exit game if incorrect panel is clicked
        (async () => {
            await flash(panelClicked, 'click', 'wrong');
            alert('game over'); //print 'game over' to browser
        })();
    }
};

//define a function that will flash the sequence to the user
const flashSequence = async () => {
    canClick = false; //don't allow user to click while sequence is flashing
    for (const panel of sequence) {
        await flash(panel, 'sequence', 'sequence'); //use aysnchrony to ensure sequence flashes in order
    }
    canClick = true; //now that sequence has flashed, allow user to begin clicking
};

//begin flashing the sequence to the user
flashSequence();