const grid  = document.getElementById('grid-container');
const level = document.getElementById('level');
const lives = document.getElementById('lives');
const score = document.getElementById('score');

let currentLevel = 1;
let livesCount = 3;
let scoreCount = 0;
let squares = [];
let highlightedSquares = [];
let clickedSquares = [];

function startGame() {
    /*********************
     * Initiates the game
     ********************/
    level.innerText = currentLevel;
    lives.innerText = livesCount;
    score.innerText = scoreCount;
    startButton = document.getElementById('startButton');
    startButton.style.display = 'none';
    createGrid(currentLevel);
}

function createGrid(currentLvl) {
    /**************************************************************************************************
     * Creates the grid, determines the size of the grid, then calles the highlightSquares function
     * ***********************************************************************************************/

    let size = currentLvl;

    // Clears the grid, resets the squares, resets the highlighted squares, and resets the clicked squares arrays
    grid.innerHTML = '';
    squares = [];
    highlightedSquares = [];
    clickedSquares = [];

    // Adjust the scaling factor to make the grid size increase more slowly
    if (size <= 3) {
        size = 3;
    } 
    else if (currentLvl >= 3) {
        const scalingFactor = 0.6; // Adjust this value as needed
        size = Math.floor(currentLvl * scalingFactor) + 1;
    }
    else if (currentLvl >= 6) {
        const scalingFactor = 0.25; // Adjust this value as needed
        size = Math.floor(currentLvl * scalingFactor) + 3;
    }

    for (i = 0; i < size * size; i++) {
        const square = document.createElement('button');
        square.classList.add('grid-item');
        square.addEventListener('click', () => onSelect(square));
        grid.appendChild(square);
        square.dataset.index = i;
        squares.push(square);
    }
    grid.style.gridTemplateColumns = '50px '.repeat(size);

    highlightSquares();
}

function highlightSquares() {
    /****************************************************************
     * Highlights squares for 1 second before removing the highlight
    ****************************************************************/
    const size = squares.length;   // The total amount of squares in the grid
    const totalHighlights = Math.round(size / 3);  // The total amount of squares that will be hilighted

    // Selectes squares and adds the class 'lit'
    for (i = 0; i < totalHighlights; i++) {
        let squareIndex = randomInt(size);
        const square = squares[squareIndex];
        if (square.classList.contains('lit') != true) {
            squares[squareIndex].classList.add('lit');
            highlightedSquares.push(squareIndex);
        }
        else {
            i -= 1;
        }
    }
    highlightedSquares.sort();

    // Removes the class 'lit' from all squares after a 1 second delay
    if (livesCount > 0) {
        setTimeout(function(){
            for (i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('lit')) {
                squares[i].classList.remove('lit');
            }   
        }}, 1000);
    }
    
} 

function randomInt(max) {
    /****************************************************************
     * Returns a random integer from 0 (inclusive) to max (exclusive)
     ****************************************************************/
    return Math.floor(Math.random() * max);
}

function returnIndex(element) {
    /******************************************
     * Returns the index of a given square
     *****************************************/
    return element.dataset.index;
}

function onSelect(element) {
    /*******************************************************************************
     * Gets the index of the button, checks if the index was highlighted, then 
     * increase the score or reduce the lives and reset the level accordingly.
     * Clicked buttons will be given the .clicked class.
     * This will also check if all highlighted buttons have been pressed so that 
     * the level can increase when all have been found.
     *******************************************************************************/

    const square = element
    const squareIndex = parseInt(returnIndex(square));
    square.classList.add('clicked');

    // Checks if the clicked square was highlighted
    if (highlightedSquares.includes(squareIndex)) {
        addScore();
        clickedSquares.push(squareIndex);
        clickedSquares.sort();
    }
    else if (!highlightedSquares.includes(squareIndex)) {
        loseLife();
    }

    // Checks if all squares have been clicked by comparing two sorted list
    if (clickedSquares.toString() == highlightedSquares.toString()){
        nextLevel();
    }
}

function nextLevel() {
    /**********************************************************
     * Increments the level and calls the createGrid function
     *********************************************************/
    currentLevel++;
    level.innerText = currentLevel;
    createGrid(currentLevel);
}

function loseLife() {
    /**********************************************************************************
     * Lowers the life count and also checks to see if the game needs to be reset.
     * This function then resets the grid upon lowering the life count.
     *********************************************************************************/
    livesCount -= 1;
    lives.innerText = livesCount;
    highlightedSquares = [];
    if (livesCount == 0) {
        resetGame();
    }
    else {
        createGrid(currentLevel);
    }
}

function addScore() {
    /**********************
     * Updates the score.
     *********************/
    scoreCount++;
    score.innerText = scoreCount;
}

function resetGame() {
    /******************************************
     * Resets the game by reloading the page
     *****************************************/
    location.reload();
}

function tl() {console.log('done');} // Puts 'done' to the console, used for testing/ debugging
