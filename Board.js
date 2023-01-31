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
// hard code diagonal cells (possible moves)
const possibleMoves = [
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],

  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],

  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
]
const isPossible = (cellId) => {
  const cellCoordinates = cellId.split("/").map(Number);
  return possibleMoves[cellCoordinates[0]][cellCoordinates[1]] === 1
}


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
      cell.setAttribute('id',`${i}/${j}`)
      if (isPossible(cell.id)) {
        cell.classList.add("green")
      }
      grid.appendChild(cell);

      let piece = document.createElement("div")
      piece.setAttribute("class","piece")
      cell.appendChild(piece)
      
      piece.setAttribute("id", `${i}-${j}`);
      if (gamefield[i][j] === 1) {
        piece.classList.add("white");
      } else if (gamefield[i][j] === 2) {
        piece.classList.add("black");
      }

      piece.addEventListener("click", () => {
        if (
          piece.classList.contains("white") ||
          piece.classList.contains("black")
        ) {
          if (piece.classList.contains("white") && currentTurn===1) {
            calculateMoves(piece.id, 1);
          } else if (piece.classList.contains("black") && currentTurn===2) {
            calculateMoves(piece.id, 2);
          }
        }
      });
    }
  }
};




let selectedpiece;
const calculateMoves = (pieceId, playerNumber) => {
  selectedpiece = pieceId;
  let pieceCoordinatesOnGameboard = pieceId.split("-");
  let x = Number(pieceCoordinatesOnGameboard[0]);
  let y = Number(pieceCoordinatesOnGameboard[1]);
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
      // get next row pieces' contents (0, 1 or 2)
      let nextRowpieceMinusOne = nextRow[y - 1];
      let nextRowpiecePlusOne = nextRow[y + 1];
      // use helper function to determine availability
      let possibleMoves = {
        left: [],
        right: [],
      };
      let leftAvailable = checkAvailability(nextRowpieceMinusOne, 1);
      let rightAvailable = checkAvailability(nextRowpiecePlusOne, 1);
      if (leftAvailable) {
        possibleMoves.left.push(x + 1);
        possibleMoves.left.push(y - 1);
      }
      if (rightAvailable) {
        possibleMoves.right.push(x + 1);
        possibleMoves.right.push(y + 1);
      }
      //   highlightPossibleMoves(possibleMoves)
      if (
        possibleMoves.left.join("-") !== `${x}-${y}` &&
        possibleMoves.right.join("-") !== `${x}-${y}`
      ) {
        highlightPossibleMoves(possibleMoves);
      }
    }
  }
};
const getValidMovesBlack = (x, y) => {
  for (let i = 0; i < gamefield.length; i++) {
    if (i === x) {
      // find current row and piece
      let row = gamefield[i];
      let piece = row[y];
      // find next row and piece
      let nextRow = gamefield[i - 1];
      let nextRowpiece = nextRow[y];
      // get next row pieces (potentially available according to the checkers' rules)
      let nextRowpieceMinusOne = nextRow[y - 1];
      let nextRowpiecePlusOne = nextRow[y + 1];
      // use helper function to determine availability
      let possibleMoves = {
        left: [],
        right: [],
      };
      let leftAvailable = checkAvailability(nextRowpieceMinusOne, 2);
      let rightAvailable = checkAvailability(nextRowpiecePlusOne, 2);
      if (leftAvailable) {
        possibleMoves.left.push(x - 1);
        possibleMoves.left.push(y - 1);
      }
      if (rightAvailable) {
        possibleMoves.right.push(x - 1);
        possibleMoves.right.push(y + 1);
      }
      if (
        possibleMoves.left.join("-") !== `${x}-${y}` &&
        possibleMoves.right.join("-") !== `${x}-${y}`
      ) {
        highlightPossibleMoves(possibleMoves);
      }
    }
  }
};
// helper function to determine if piece is empty or has an enemy piece on it
const checkAvailability = (y, playerNumber) => {
  if (playerNumber === 1) {
    if (y === 0 || y === 2) {
      return true;
    } else return false;
  }
  if (playerNumber === 2) {
    if (y === 0 || y === 1) {
      return true;
    } else return false;
  }
};

let moveListeners = [];
const highlightPossibleMoves = (possibleMoves) => {
  for (let direction in possibleMoves) {
    let move = possibleMoves[direction];
    if (move.length) {
      let moveId = move.join("-");
      let movepiece = document.getElementById(moveId);
      movepiece.classList.add("possible-move");
      let listener = makeMoveHandler(moveId);
      moveListeners.push({ id: moveId, listener: listener });
      movepiece.addEventListener("click", listener);
    }
  }
};

const makeMoveHandler = (moveId) => {
  return function () {
    let movepiece = document.getElementById(moveId);
    makeMove(moveId);
    // remove event listener for all move pieces
    moveListeners.forEach(function(obj) {
      document.getElementById(obj.id).removeEventListener("click", obj.listener);
    });
    moveListeners = [];
  };
};

const makeMove = (moveId) => {
  // get row and column of selected and target pieces
  let [selectedRow, selectedCol] = selectedpiece.split("-").map(Number);
  let [targetRow, targetCol] = moveId.split("-").map(Number);

  // empty previous piece and fill target piece (in business logic)
  gamefield[targetRow][targetCol] = gamefield[selectedRow][selectedCol];
  gamefield[selectedRow][selectedCol] = 0;

  // update styles
  let selectedpieceElement = document.getElementById(selectedpiece);

  let targetpieceElement = document.getElementById(moveId);
  // remove .possible-move class from previously possible pieces and remove event listener
  // also remove 'white' class if there was a white piece previously;
  // and remove 'black' class if there was a black piece previously
  let allPossiblepieces = document.querySelectorAll(".possible-move");
  for (let i = 0; i < allPossiblepieces.length; i++) {
    allPossiblepieces[i].classList.remove("possible-move");
    if (allPossiblepieces[i].classList.contains("white")) {
      allPossiblepieces[i].classList.remove("white")
    } else if (allPossiblepieces[i].classList.contains("black")) {
      allPossiblepieces[i].classList.remove("black")
    }
  }
  // change class of target piece to the class of selected piece
  targetpieceElement.classList.add(selectedpieceElement.classList[1]);
  selectedpieceElement.classList.remove("white", "black");
  // change turn
  if (currentTurn === player1.number) {
    setCurrentTurn(player2.number);
  } else if (currentTurn === player2.number) {
    setCurrentTurn(player1.number);
  }

  console.log(gamefield);
};

const whitePieces = document.getElementsByClassName("white");
const blackPieces = document.getElementsByClassName("black");
