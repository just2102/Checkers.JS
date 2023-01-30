import { startGame } from "./Board.js"
import {  player1 } from "./player.js"



const startGameButton = document.getElementById('start_game_button')
startGameButton.addEventListener('click', startGame)


