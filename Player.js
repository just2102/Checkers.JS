export let player1;
export let player2;
export let currentTurn;

// store names from user input and create users based on these names
export let arrayOfNames = [];
export const setPlayerNames = () => {
  let player1Name = document.getElementById("player1_name").value;
  let player2Name = document.getElementById("player2_name").value;
  arrayOfNames.push(player1Name);
  arrayOfNames.push(player2Name);
};

export const playerFactory = (name, number) => {
  let defaultPieces = 12;
  return { 
    name, 
    number, 
    pieces: defaultPieces, 
    gotJumped: function() {
      this.pieces--
    }
  };
};

export const setPlayers = () => {
  player1 = playerFactory(arrayOfNames[0], 1);
  player2 = playerFactory(arrayOfNames[1], 2);
};

export const setCurrentTurn = (playerNumber) => {
  currentTurn = playerNumber;
  const currentTurnField = document.getElementById("whose_turn");
  if (currentTurn === 1) {
    markPlayerCheckers(1)
    currentTurnField.innerText = "Whites turn";
  } else if (currentTurn === 2) {
    markPlayerCheckers(2)
    currentTurnField.innerText = "Blacks turn";
  }
};


const markPlayerCheckers = (playerNumber) => {
  let allWhitePieces = document.getElementsByClassName("piece white")
  let allBlackPieces = document.getElementsByClassName("piece black")

  if (playerNumber===1) {
    for (let i = 0; i<allWhitePieces.length; i++) {
      allWhitePieces[i].classList.add("my")
    }
    for (let i = 0; i<allBlackPieces.length; i++) {
      allBlackPieces[i].classList.remove("my")
    }
  } else if (playerNumber===2) {
    for (let i = 0; i<allBlackPieces.length; i++) {
      allBlackPieces[i].classList.add("my")
    }
    for (let i = 0; i<allWhitePieces.length; i++) {
      allWhitePieces[i].classList.remove("my")
    }
  }
}

export const jump = (whoJumps) => {
  // whoJumps: 1 | 2
  // changes business state (reduces player.pieces)
  // updates innerText of div#score
  if (whoJumps===1) {
    player2.gotJumped()
    document.getElementById("score_black").innerText = `Browns: ${player2.pieces}`
  } else if (whoJumps===2) {
    player1.gotJumped()
    document.getElementById("score_white").innerText = `Whites: ${player1.pieces}`
  }
}