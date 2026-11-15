"use strict";

// The quiz's fourth level is also available as a standalone activity card.
// This helper shares the existing quiz screen and result flow, but begins
// directly at the Park & Nature level instead of starting at level one.
(() => {
  const startButton = document.getElementById("startParkQuizBtn");
  if (!startButton) return;

  startButton.addEventListener("click", () => {
    const parkLevelIndex = levels.findIndex((level) => level.title.includes("Park & Natur"));
    if (parkLevelIndex < 0) return;

    state.puzzleLevelIndex = parkLevelIndex;
    state.puzzleQuestionIndex = 0;
    state.levelCorrect = 0;
    state.levelAnswered = 0;
    state.puzzleAnswered = false;

    const quizGame = document.getElementById("quizGame");
    const levelResult = document.getElementById("levelResult");
    if (quizGame) quizGame.hidden = false;
    if (levelResult) levelResult.hidden = true;

    showScreen("puzzle");
    renderQuestion();
  });
})();
