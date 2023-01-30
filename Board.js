import { player1, player2, setPlayers } from "./player.js";
import { setPlayerNames, setCurrentTurn } from "./player.js";

let gamefield = [
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],

  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],

  [2, 0, 2, 0, 2, 0, 2, 0],
  [0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0],
];

export const startGame = () => {
  setPlayerNames();
  setPlayers();
  console.log(player1);
  console.log(player2);
  hideInputs();
  makeField();
  setCurrentTurn(player1.number);
};

const hideInputs = () => {
  document.getElementById("inputs").setAttribute("class", "hidden");
};

const makeField = () => {
  let grid = document.getElementById("grid");
  for (let i = 0; i < gamefield.length; i++) {
    for (let j = 0; j < gamefield[i].length; j++) {
      let cell = document.createElement("div");
      cell.setAttribute("class", "cell");
      grid.appendChild(cell);
      cell.setAttribute("id", `${i}-${j}`);
      if (gamefield[i][j] === 1) {
        cell.classList.add("white");
      } else if (gamefield[i][j] === 2) {
        cell.classList.add("black");
      }
      cell.addEventListener("click", (event) => {
        if (cell.classList.contains("white") || cell.classList.contains("black")) {
          let selectedCell = cell.id;
          if (cell.classList.contains("white")) {
            console.log(calculateMoves(selectedCell, 1, gamefield));

          } else if (cell.classList.contains("black")) {
             console.log(calculateMoves(selectedCell, 2, gamefield));
          }
        }
      });
    }
  }
};

const calculateMoves = (selectedCell, playerNumber, gamefield) => {
  let cellCoordinatesOnGameboard = selectedCell.split("-");
  let x = Number(cellCoordinatesOnGameboard[0]);
  let y = Number(cellCoordinatesOnGameboard[1]);
  if (playerNumber === 1) {
    return getValidMovesWhite(x, y);
  } else if (playerNumber === 2) {
    return getValidMovesBlack(x, y);
  }
};
// separate get valid moves logic for white and black players (next row is either i+1 or i-1)
const getValidMovesWhite = (x, y) => {
  for (let i = 0; i < gamefield.length; i++) {
    if (i === x) {
      // find current row and cell
      let row = gamefield[i];
      let cell = row[y];
      // find next row and cell
      let nextRow = gamefield[i + 1];
      let nextRowCell = nextRow[y];
      // get next row cells (potentially available according to the checkers' rules)
      let nextRowCellMinusOne = nextRow[y - 1];
      let nextRowCellPlusOne = nextRow[y + 1];
      // use helper function to determine availability
      let possibleMoves = {
        left:[],
        right:[]
      }
      let leftAvailable = checkAvailability(nextRowCellMinusOne, 1);
      let rightAvailable = checkAvailability(nextRowCellPlusOne, 1);
      if (leftAvailable) {
        possibleMoves.left.push(x+1)
        possibleMoves.left.push(y-1)
      }
      if (rightAvailable) {
        possibleMoves.right.push(x+1)
        possibleMoves.right.push(y+1)
      }
    //   highlightPossibleMoves(possibleMoves)
    return possibleMoves
    }
  }
};
const getValidMovesBlack = (x, y) => {
  for (let i = 0; i < gamefield.length; i++) {
    if (i === x) {
      // find current row and cell
      let row = gamefield[i];
      let cell = row[y];
      // find next row and cell
      let nextRow = gamefield[i - 1];
      let nextRowCell = nextRow[y];
      // get next row cells (potentially available according to the checkers' rules)
      let nextRowCellMinusOne = nextRow[y - 1];
      let nextRowCellPlusOne = nextRow[y + 1];
      // use helper function to determine availability
      let possibleMoves = {
        left:[],
        right:[]
      }
      let leftAvailable = checkAvailability(nextRowCellMinusOne, 2);
      let rightAvailable = checkAvailability(nextRowCellPlusOne, 2);
      if (leftAvailable) {
        possibleMoves.left.push(x-1)
        possibleMoves.left.push(y-1)
      }
      if (rightAvailable) {
        possibleMoves.right.push(x-1)
        possibleMoves.right.push(y+1)
      }
    //   highlightPossibleMoves(possibleMoves)
    return possibleMoves
    }
  }
};
// helper function to determine if cell is empty or has an enemy piece on it
const checkAvailability = (y, playerNumber) => {
  if (playerNumber === 1) {
    if (y === 0 || y === 2) {
      return true;
    } else return false
  } 
  if (playerNumber === 2) {
    if ((y === 0) || y === 1) {
      return true;
    } else return false
  }
};

const highlightPossibleMoves = (possibleMoves) => {
    console.log(possibleMoves)
};

const whitePieces = document.getElementsByClassName("white");
const blackPieces = document.getElementsByClassName("black");
