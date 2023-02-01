import { restartGame, startGame } from "./Board.js"



const startGameButton = document.getElementById('start_game_button')
startGameButton.addEventListener('click', startGame)


const restartGameButton = document.getElementById("restart_game_button")
restartGameButton.addEventListener('click',restartGame)

