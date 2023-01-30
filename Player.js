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
  return { name, number, pieces: defaultPieces };
};

export const setPlayers = () => {
  player1 = playerFactory(arrayOfNames[0], 1);
  player2 = playerFactory(arrayOfNames[1], 2);
};

export const setCurrentTurn = (playerNumber) => {
  currentTurn = playerNumber;
  const currentTurnField = document.getElementById("whose_turn");
  if (currentTurn === 1) {
    currentTurnField.innerText = "Whites turn";
  } else if (currentTurn === 2) {
    currentTurnField.innerText = "Blacks turn";
  }
};
