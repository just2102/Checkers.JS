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
export const forgetPlayers = () => {
  arrayOfNames = []
  player1 = null
  player2 = null
}

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
  window.player1 = player1
  player2 = playerFactory(arrayOfNames[1], 2);
};

export const setCurrentTurn = (playerNumber) => {
  //1 - white
  //2 - black
  //0 - game is over
  currentTurn = playerNumber;
  const currentTurnField = document.getElementById("whose_turn");
  if (currentTurn === 1) {
    markPlayerCheckers(1)
    currentTurnField.innerText = `${player1.name}'s turn`;
  } else if (currentTurn === 2) {
    markPlayerCheckers(2)
    currentTurnField.innerText = `${player2.name}'s turn`;
  } else if (currentTurn===0) {
    return
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
  // updates innerText of div#score (if game goes on and jumped user still has some pieces)
  // checks if user that got jumped has 0 pieces left (if he lost or not)
  if (whoJumps===1) {
    player2.gotJumped()
    // false  =>  game goes on
    // true   =>  jumped user lost
    if (checkLoser(player2.pieces)===false) {
      document.getElementById("score_black").innerText = `${player2.name}: ${player2.pieces} pieces`
    } else if (checkLoser(player2.pieces===true)) {
      //gameover expects the winner
      setCurrentTurn(0)
      gameOver(player1)
    }
  } else if (whoJumps===2) {
    player1.gotJumped()
    if (checkLoser(player1.pieces)===false) {
      document.getElementById("score_white").innerText = `${player1.name}: ${player1.pieces} pieces`
    } else if (checkLoser(player1.pieces)===true) {
      setCurrentTurn(0)
      gameOver(player2)
    }
  }
}

const checkLoser = (numberOfPiecesLeft) => {
  if (numberOfPiecesLeft===0) {
    return true
  } else if (numberOfPiecesLeft!==0) {
    return false
  }
}

const gameOver = (whoWon) => {
  document.getElementById("whose_turn").innerText = `${whoWon.name} won!`
  document.getElementById("score").classList.add("hidden")
  // display restart button
  document.getElementById("restart_game_button").classList.remove("hidden")
  confetti()
}