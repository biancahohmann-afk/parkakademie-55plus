"use strict";

(() => {
  const screen = document.getElementById("mahjongScreen");
  const startButton = document.getElementById("startMahjongBtn");
  const board = document.getElementById("mahjongBoard");
  if (!screen || !startButton || !board) return;

  const tileFaces = [
    { symbol: "🌸", label: "Blüte" },
    { symbol: "🍃", label: "Blatt" },
    { symbol: "☀️", label: "Sonne" },
    { symbol: "🌙", label: "Mond" },
    { symbol: "🦋", label: "Schmetterling" },
    { symbol: "🐦", label: "Vogel" },
    { symbol: "🍎", label: "Apfel" },
    { symbol: "🍋", label: "Zitrone" },
    { symbol: "🌷", label: "Tulpe" },
    { symbol: "🍇", label: "Trauben" },
    { symbol: "🐞", label: "Marienkäfer" },
    { symbol: "⭐", label: "Stern" },
    { symbol: "🍐", label: "Birne" },
    { symbol: "🌻", label: "Sonnenblume" },
    { symbol: "🐢", label: "Schildkröte" },
    { symbol: "🍒", label: "Kirschen" },
  ];
  const levels = [
    { name: "Leicht", pairs: 6, description: "6 Paare · zum Ankommen" },
    { name: "Mittel", pairs: 8, description: "8 Paare · etwas mehr Merkspaß" },
    { name: "Anspruchsvoll", pairs: 12, description: "12 Paare · für geübte Spieler" },
  ];

  const pairsOutput = document.getElementById("mahjongPairs");
  const movesOutput = document.getElementById("mahjongMoves");
  const status = document.getElementById("mahjongStatus");
  const hintButton = document.getElementById("mahjongHintBtn");
  const restartButton = document.getElementById("mahjongRestartBtn");
  const result = document.getElementById("mahjongResult");
  const resultText = document.getElementById("mahjongResultText");
  const playAgainButton = document.getElementById("mahjongPlayAgainBtn");

  let levelIndex = 0;
  let cards = [];
  let firstCard = null;
  let secondCard = null;
  let locked = false;
  let matchedPairs = 0;
  let moves = 0;
  let mismatchTimer = null;
  let hintTimer = null;
  let hintUsed = false;

  const picker = document.createElement("div");
  picker.className = "mahjong-level-picker";
  picker.setAttribute("role", "group");
  picker.setAttribute("aria-label", "Schwierigkeitsgrad auswählen");
  levels.forEach((level, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "mahjong-level-button";
    button.setAttribute("aria-pressed", String(index === levelIndex));
    button.innerHTML = `${level.name}<span>${level.description}</span>`;
    button.addEventListener("click", () => {
      levelIndex = index;
      picker.querySelectorAll("button").forEach((choice, choiceIndex) => {
        choice.setAttribute("aria-pressed", String(choiceIndex === levelIndex));
      });
      startGame();
    });
    picker.appendChild(button);
  });
  const instructions = screen.querySelector(".mahjong-instructions");
  instructions?.insertAdjacentElement("afterend", picker);

  function shuffle(items) {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function updateScore() {
    pairsOutput.textContent = `${matchedPairs} von ${levels[levelIndex].pairs}`;
    movesOutput.textContent = String(moves);
  }

  function makeCard(face, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "mahjong-tile is-hidden-face";
    button.dataset.cardIndex = String(index);
    button.dataset.face = face.label;
    button.setAttribute("aria-label", `Verdeckter Spielstein ${index + 1}`);
    button.setAttribute("aria-pressed", "false");
    button.innerHTML = '<span class="tile-symbol" aria-hidden="true">✦</span><span class="tile-label">Spielstein</span>';
    button.addEventListener("click", () => revealCard(button));
    return button;
  }

  function reveal(card) {
    const face = tileFaces.find((item) => item.label === card.dataset.face);
    card.classList.remove("is-hidden-face");
    card.querySelector(".tile-symbol").textContent = face.symbol;
    card.querySelector(".tile-label").textContent = face.label;
    card.setAttribute("aria-label", face.label);
    card.setAttribute("aria-pressed", "true");
  }

  function conceal(card) {
    card.classList.add("is-hidden-face");
    card.classList.remove("is-hinted");
    card.querySelector(".tile-symbol").textContent = "✦";
    card.querySelector(".tile-label").textContent = "Spielstein";
    card.setAttribute("aria-label", `Verdeckter Spielstein ${Number(card.dataset.cardIndex) + 1}`);
    card.setAttribute("aria-pressed", "false");
  }

  function revealCard(card) {
    if (locked || card.disabled || card === firstCard || !card.classList.contains("is-hidden-face")) return;
    reveal(card);

    if (!firstCard) {
      firstCard = card;
      status.textContent = "Gut. Wähle jetzt den zweiten Spielstein.";
      return;
    }

    secondCard = card;
    moves += 1;
    updateScore();
    if (firstCard.dataset.face === secondCard.dataset.face) {
      firstCard.classList.add("is-matched");
      secondCard.classList.add("is-matched");
      firstCard.disabled = true;
      secondCard.disabled = true;
      matchedPairs += 1;
      firstCard = null;
      secondCard = null;
      updateScore();
      if (matchedPairs === levels[levelIndex].pairs) finishGame();
      else status.textContent = "Ein Paar gefunden – prima! Suche in Ruhe das nächste.";
      return;
    }

    locked = true;
    status.textContent = "Diese beiden passen nicht zusammen. Schau sie dir noch einmal an.";
    mismatchTimer = window.setTimeout(() => {
      conceal(firstCard);
      conceal(secondCard);
      firstCard = null;
      secondCard = null;
      locked = false;
      status.textContent = "Wähle zwei gleiche Spielsteine aus.";
    }, 1100);
  }

  function clearTimers() {
    window.clearTimeout(mismatchTimer);
    window.clearTimeout(hintTimer);
    mismatchTimer = null;
    hintTimer = null;
  }

  function startGame() {
    clearTimers();
    firstCard = null;
    secondCard = null;
    locked = false;
    matchedPairs = 0;
    moves = 0;
    hintUsed = false;
    result.hidden = true;
    const selectedFaces = shuffle(tileFaces).slice(0, levels[levelIndex].pairs);
    const deck = shuffle(selectedFaces.flatMap((face) => [face, face]));
    cards = deck.map(makeCard);
    board.replaceChildren(...cards);
    board.setAttribute("aria-label", `${levels[levelIndex].name}: ${levels[levelIndex].pairs * 2} verdeckte Spielsteine`);
    status.textContent = `${levels[levelIndex].name}: Finde ${levels[levelIndex].pairs} Paare. Es gibt keinen Zeitdruck.`;
    updateScore();
  }

  function giveHint() {
    if (locked || matchedPairs === levels[levelIndex].pairs) return;
    const available = cards.filter((card) => !card.disabled);
    const unmatched = available.filter((card) => card.classList.contains("is-hidden-face"));
    if (unmatched.length < 2) return;
    const face = unmatched[0].dataset.face;
    const pair = unmatched.filter((card) => card.dataset.face === face).slice(0, 2);
    pair.forEach((card) => {
      reveal(card);
      card.classList.add("is-hinted");
    });
    hintUsed = true;
    locked = true;
    status.textContent = "Tipp: Diese beiden Spielsteine gehören zusammen. Sie werden gleich wieder verdeckt.";
    hintTimer = window.setTimeout(() => {
      pair.forEach((card) => {
        if (!card.disabled) conceal(card);
      });
      locked = false;
      status.textContent = "Jetzt bist du dran. Wähle zwei gleiche Spielsteine.";
    }, 1800);
  }

  function finishGame() {
    locked = true;
    status.textContent = "Alle Paare sind gefunden. Herzlichen Glückwunsch!";
    resultText.textContent = `Du hast Level „${levels[levelIndex].name}“ mit ${moves} Zügen abgeschlossen${hintUsed ? " und einen Tipp genutzt" : ""}.`;
    result.hidden = false;
    hintButton.disabled = true;
  }

  function showScreen(name) {
    ["homeScreen", "memoryScreen", "puzzleScreen", "mahjongScreen"].forEach((id) => {
      const section = document.getElementById(id);
      if (section) section.hidden = id !== name;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  startButton.addEventListener("click", () => {
    startGame();
    showScreen("mahjongScreen");
  });
  hintButton.addEventListener("click", giveHint);
  restartButton.addEventListener("click", startGame);
  playAgainButton.addEventListener("click", startGame);
  document.querySelectorAll('[data-nav="home"]').forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      clearTimers();
      showScreen("homeScreen");
    });
  });

  // Keep the hint available on a fresh game after a previous win.
  const scoreObserver = new MutationObserver(() => {
    hintButton.disabled = matchedPairs === levels[levelIndex].pairs;
  });
  scoreObserver.observe(pairsOutput, { childList: true, characterData: true, subtree: true });
})();
