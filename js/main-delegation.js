import {
  getCellElementList,
  getCurrentTurnElement,
  getCellElementAtIdx,
  getGameStatusElement,
  getReplayButton,
  getCellListElement,
} from "./selectors.js";

import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import { checkGameStatus } from "./utils.js";

console.log(checkGameStatus(["X", "O", "O", "", "X", "", "", "O", "X"]));
/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let gameStatus = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill(""); //["","","","","","","","",""]

function toggleTurn() {
  currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;

  //update turn on DOM element
  const currentTurnElement = getCurrentTurnElement();
  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);

    currentTurnElement.classList.add(currentTurn);
  }
}
// func update game status
function updateGameStatus(newGameStatus) {
  gameStatus = newGameStatus;

  const gameStatusElement = getGameStatusElement();

  if (!gameStatusElement) return;

  gameStatusElement.textContent = newGameStatus;
}
// func show replay button
function showReplayBtn() {
  const replayButtonElement = getReplayButton();
  if (replayButtonElement) replayButtonElement.classList.add("show");
}

function hideReplayBtn() {
  const replayButtonElement = getReplayButton();
  if (replayButtonElement) replayButtonElement.classList.remove("show");
}

// func highline win cell
function highLineWinCell(winPositions) {
  if (!Array.isArray(winPositions) || winPositions.length !== 3) return;

  for (let winPosition of winPositions) {
    const cell = getCellElementAtIdx(winPosition);
    if (cell) cell.classList.add("win");
  }
}

function handleCellList(cellElement, index) {
  const isClicked =
    cellElement.classList.contains(TURN.CIRCLE) ||
    cellElement.classList.contains(TURN.CROSS);
  const isEndGame = gameStatus !== GAME_STATUS.PLAYING;
  if (isClicked || isEndGame) return;

  // set selected cell
  cellElement.classList.add(currentTurn);

  //update vào cellValues global variable
  cellValues[index] =
    currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;

  //toggle turn
  toggleTurn();

  // check Game Status
  const game = checkGameStatus(cellValues);

  switch (game.status) {
    case GAME_STATUS.ENDED: {
      //update game status
      updateGameStatus(game.status);
      //show replay button
      showReplayBtn();
      break;
    }

    case GAME_STATUS.X_WIN:
    case GAME_STATUS.O_WIN: {
      // update game status
      updateGameStatus(game.status);
      // show replay button
      showReplayBtn();
      // highline win cells
      highLineWinCell(game.winPositions);
      break;
    }

    default:
    // playing
  }
}

function initCellElementList() {
  // set index li Element
  const liElementList = getCellElementList();

  liElementList.forEach((cell, index) => {
    cell.dataset.idx = index;
  });

  // -------------- attach element click for ul element
  const cellListElement = getCellListElement();

  if (cellListElement) {
    cellListElement.addEventListener("click", (event) => {
      if (event.target.tagName != "LI") return;

      const index = Number.parseInt(event.target.dataset.idx);
      console.log(event.target, index);
      handleCellList(event.target, index);
    });
  }
}

function resetGame() {
  // reset temp global variable
  currentTurn = TURN.CROSS;
  gameStatus = GAME_STATUS.PLAYING;
  cellValues = cellValues.map((x) => "");
  // reset dom elements
  // reset game status

  updateGameStatus(GAME_STATUS.PLAYING);

  // reset current turn
  const currentTurnElement = getCurrentTurnElement();
  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
    currentTurnElement.classList.add(TURN.CROSS);
  }

  // reset game board
  const cellElementList = getCellElementList();
  for (const cellElement of cellElementList) {
    cellElement.className = "";
  }
  // hide button replay
  hideReplayBtn();
}

function initReplayButton() {
  const replayButtonElement = getReplayButton();
  if (replayButtonElement) {
    replayButtonElement.addEventListener("click", resetGame);
  }
}

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

(() => {
  // bind click event for all li elements
  initCellElementList();

  initReplayButton();
})();
