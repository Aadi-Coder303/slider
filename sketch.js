// Created by Aadi Golecha on 29th Feb 2024
// Slider puzzle

let puzzle;
let tileSize = 100;
let numRows = 3;
let numCols = 3;
let winMessage = "You Win!";
let startTime;
let moveCount = 0;
let solved = false;

function setup() {
  let canvas = createCanvas(tileSize * numCols, tileSize * numRows);
  canvas.parent('canvas-container'); // Attach canvas to a container
  puzzle = new Puzzle(numRows, numCols);
  puzzle.shuffle();
  startTime = millis(); // Start the timer
}

function draw() {
  background(255);
  puzzle.show();

  if (solved) {
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text(winMessage, width / 2, height / 2);
    let timeInSeconds = Math.floor((millis() - startTime) / 1000); // Calculate time in seconds
    text(`Time: ${timeInSeconds} seconds`, width / 2, height / 2 + 40);
    text(`Moves: ${moveCount}`, width / 2, height / 2 + 80);
  }
}

function mousePressed() {
  if (!solved) {
    let clickedRow = floor(mouseY / tileSize);
    let clickedCol = floor(mouseX / tileSize);
    if (puzzle.isValidMove(clickedRow, clickedCol)) {
      puzzle.moveTile(clickedRow, clickedCol);
      moveCount++;
      if (puzzle.isSolved()) {
        solved = true;
        displayWinMessage();
      }
    }
  }
}

function displayWinMessage() {
  let winMsg = select('#winMessage');
  winMsg.html(`Win Message: ${winMessage}`);

  let timeMsg = select('#time');
  let timeInSeconds = Math.floor((millis() - startTime) / 1000); // Calculate time in seconds
  timeMsg.html(`Time: ${timeInSeconds} seconds`);

  let movesMsg = select('#moves');
  movesMsg.html(`Moves: ${moveCount}`);
}

function resetPuzzle() {
  numRows = parseInt(document.getElementById('rows').value);
  numCols = parseInt(document.getElementById('cols').value);
  tileSize = 400 / max(numRows, numCols);
  resizeCanvas(tileSize * numCols, tileSize * numRows);
  puzzle = new Puzzle(numRows, numCols);
  puzzle.shuffle();
  startTime = millis(); // Reset the timer
  moveCount = 0; // Reset the move count
  solved = false; // Reset solved status

  let winMsg = select('#winMessage');
  winMsg.html('');

  let timeMsg = select('#time');
  timeMsg.html('');

  let movesMsg = select('#moves');
  movesMsg.html('');
}

class Puzzle {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.tiles = [];
    this.emptyRow = rows - 1;
    this.emptyCol = cols - 1;
    this.initTiles();
  }

  initTiles() {
    for (let i = 0; i < this.rows * this.cols - 1; i++) {
      this.tiles.push(i + 1);
    }
  }

  shuffle() {
    let iterations = 1000; // Number of random moves
    while (iterations > 0) {
      let neighbors = this.getNeighbors(this.emptyRow, this.emptyCol);
      let randIndex = floor(random(neighbors.length));
      let [newRow, newCol] = neighbors[randIndex];
      this.swapTiles(this.emptyRow, this.emptyCol, newRow, newCol);
      this.emptyRow = newRow;
      this.emptyCol = newCol;
      iterations--;
    }
    if (!this.isSolvable()) {
      this.shuffle();
    }
  }

  isSolvable() {
    // Check if the puzzle is solvable
    // Count inversions
    let inversions = 0;
    for (let i = 0; i < this.tiles.length; i++) {
      for (let j = i + 1; j < this.tiles.length; j++) {
        if (this.tiles[i] > this.tiles[j]) {
          inversions++;
        }
      }
    }
    // If the grid width is odd, puzzle is solvable if inversions is even
    // If the grid width is even, puzzle is solvable if:
    //   - blank on an even row counting from the bottom and inversions is odd
    //   - blank on an odd row counting from the bottom and inversions is even
    if (this.cols % 2 === 1) {
      return inversions % 2 === 0;
    } else {
      let blankOnEvenRowFromBottom = (this.emptyRow % 2 === 0);
      return (blankOnEvenRowFromBottom && inversions % 2 === 1) || (!blankOnEvenRowFromBottom && inversions % 2 === 0);
    }
  }

  isSolved() {
    // Check if the puzzle is solved
    for (let i = 0; i < this.tiles.length; i++) {
      if (this.tiles[i] !== i + 1) {
        return false;
      }
    }
    return true;
  }

  getNeighbors(row, col) {
    let neighbors = [];
    if (row > 0) neighbors.push([row - 1, col]); // Up
    if (row < this.rows - 1) neighbors.push([row + 1, col]); // Down
    if (col > 0) neighbors.push([row, col - 1]); // Left
    if (col < this.cols - 1) neighbors.push([row, col + 1]); // Right
    return neighbors;
  }

  swapTiles(row1, col1, row2, col2) {
    let temp = this.tiles[row1 * this.cols + col1];
    this.tiles[row1 * this.cols + col1] = this.tiles[row2 * this.cols + col2];
    this.tiles[row2 * this.cols + col2] = temp;
  }

  moveTile(row, col) {
    this.swapTiles(this.emptyRow, this.emptyCol, row, col);
    this.emptyRow = row;
    this.emptyCol = col;
  }

  isValidMove(row, col) {
    // Check if the clicked tile is adjacent to the empty space
    return (abs(row - this.emptyRow) === 1 && col === this.emptyCol) ||
           (row === this.emptyRow && abs(col - this.emptyCol) === 1);
  }

  show() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        let value = this.tiles[row * this.cols + col];
        if (value !== undefined) {
          fill(200);
          rect(col * tileSize, row * tileSize, tileSize, tileSize);
          fill(0);
          textSize(32);
          textAlign(CENTER, CENTER);
          text(value, col * tileSize + tileSize / 2, row * tileSize + tileSize / 2);
        }
      }
    }
  }
}
