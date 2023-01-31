import { currentTurn, player1, player2, setPlayers } from "./player.js";
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

      cell.addEventListener("click", () => {
        if (cell.classList.contains("white") || cell.classList.contains("black")) {
          if (cell.classList.contains("white")) {
            calculateMoves(cell.id, 1);
          } else if (cell.classList.contains("black")) {
            calculateMoves(cell.id, 2);
          }
        }
      });
    }
  }
};

let selectedCell;
const calculateMoves = (cellId, playerNumber) => {
  selectedCell = cellId;
  let cellCoordinatesOnGameboard = cellId.split("-");
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
      // find current row 
      let row = gamefield[i];
      // find next row 
      let nextRow = gamefield[i + 1];
      // get next row cells' contents (0, 1 or 2)
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
    if (possibleMoves.left.join("-")!==`${x}-${y}` && possibleMoves.right.join("-")!==`${x}-${y}`) {
      highlightPossibleMoves(possibleMoves)
    }
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
    if (possibleMoves.left.join("-")!==`${x}-${y}` && possibleMoves.right.join("-")!==`${x}-${y}`) {
      highlightPossibleMoves(possibleMoves)
    }
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


let moveListeners = [];
const highlightPossibleMoves = (possibleMoves) => {
  for (let direction in possibleMoves) {
    let move = possibleMoves[direction];
    if (move.length) {
      let moveId = move.join("-");
      let moveCell = document.getElementById(moveId);
      moveCell.classList.add("possible-move");
      let listener = makeMoveHandler(moveId);
      moveListeners.push({id: moveId, listener: listener});
      moveCell.addEventListener("click", listener);
    }
  }
};

const makeMoveHandler = (moveId) => {
  return function() {
    let moveCell = document.getElementById(moveId);
    makeMove(moveId);
    moveListeners = moveListeners.filter(function (obj) {
      if (obj.id == moveId) {
        moveCell.removeEventListener("click", obj.listener);
        return false;
      }
      return true;
    });
  };
};

const makeMove = (moveId) => {
  // get row and column of selected and target cells
  let [selectedRow,selectedCol] = selectedCell.split("-").map(Number);
  let [targetRow, targetCol] = moveId.split("-").map(Number);
 
  // empty previous cell and fill target cell (in business logic)
  gamefield[targetRow][targetCol] = gamefield[selectedRow][selectedCol]
  gamefield[selectedRow][selectedCol] = 0;
  debugger

  // update styles
  let selectedCellElement = document.getElementById(selectedCell);

  let targetCellElement = document.getElementById(moveId)


  targetCellElement.classList.add(selectedCellElement.classList[1])
  selectedCellElement.classList.remove("white", "black")
  
  // remove .possible-move class from previously possible cells and remove event listener
  let allPossibleCells = document.querySelectorAll(".possible-move")
  for (let i = 0; i<allPossibleCells.length; i++) {
    allPossibleCells[i].classList.remove("possible-move")
  }

  // change turn
  if (currentTurn===player1.number) {
    setCurrentTurn(player2.number)
  } else if (currentTurn===player2.number) {
    setCurrentTurn(player1.number)
  }

  console.log(gamefield)

}


const whitePieces = document.getElementsByClassName("white");
const blackPieces = document.getElementsByClassName("black");
