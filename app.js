"use strict";

const state = {
  totalCorrect: 0,
  gamesPlayed: 0,
  memorySequence: [],
  memoryUserInput: [],
  memoryLocked: true,
  memoryRoundNumber: 0,
  memoryTimer: null,
  puzzleIndex: 0,
  puzzleAnswered: false,
  highContrast: false,
  fontScale: 100,
};

const shapes = [
  "Kreis",
  "Dreieck",
  "Quadrat",
  "Raute",
  "Stern",
  "Welle",
  "Kreuz",
  "Bogen",
];

const puzzles = [
  {
    question: "Ein Vortrag beginnt um 14:30 Uhr und dauert 75 Minuten. Wann endet er?",
    options: ["15:15 Uhr", "15:30 Uhr", "15:45 Uhr", "16:00 Uhr"],
    answer: "15:45 Uhr",
    explanation: "Nach 60 Minuten ist es 15:30 Uhr. Weitere 15 Minuten ergeben 15:45 Uhr.",
  },
  {
    question: "Welches Wort bedeutet ungefähr dasselbe wie „besonnen“?",
    options: ["überlegt", "eilig", "laut", "unsicher"],
    answer: "überlegt",
    explanation: "Wer besonnen handelt, handelt ruhig und überlegt.",
  },
  {
    question: "Das Sprichwort lautet: „Viele Köche verderben …“",
    options: ["den Abend", "den Brei", "die Suppe nicht", "das Rezeptbuch"],
    answer: "den Brei",
    explanation: "Das bekannte Sprichwort lautet: „Viele Köche verderben den Brei.“",
  },
  {
    question: "Welche Stadt liegt am Rhein?",
    options: ["Dresden", "Köln", "Leipzig", "Rostock"],
    answer: "Köln",
    explanation: "Der Rhein fließt unter anderem durch Köln.",
  },
  {
    question: "Ein Zug fährt um 10:48 Uhr ab. Die Fahrt dauert 1 Stunde und 27 Minuten. Wann kommt er an?",
    options: ["12:05 Uhr", "12:15 Uhr", "12:25 Uhr", "12:35 Uhr"],
    answer: "12:15 Uhr",
    explanation: "Eine Stunde nach 10:48 Uhr ist es 11:48 Uhr. Weitere 27 Minuten ergeben 12:15 Uhr.",
  },
  {
    question: "Alle Lesungen sind Veranstaltungen. Einige Veranstaltungen finden am Abend statt. Was lässt sich daraus sicher schließen?",
    options: [
      "Alle Lesungen finden am Abend statt.",
      "Keine Lesung findet am Abend statt.",
      "Es lässt sich nicht sicher sagen, ob Lesungen am Abend stattfinden.",
      "Alle Abendveranstaltungen sind Lesungen.",
    ],
    answer: "Es lässt sich nicht sicher sagen, ob Lesungen am Abend stattfinden.",
    explanation: "Die Angaben sagen nicht, ob die Abendveranstaltungen auch Lesungen sind.",
  },
  {
    question: "Welches Wort passt nicht in die Reihe?",
    options: ["Roman", "Gedicht", "Biografie", "Notenständer"],
    answer: "Notenständer",
    explanation: "Roman, Gedicht und Biografie sind Literaturformen. Ein Notenständer ist ein Gegenstand.",
  },
  {
    question: "Eine Flasche enthält 1,5 Liter Wasser. Drei Gläser mit je 0,25 Liter werden gefüllt. Wie viel Wasser bleibt übrig?",
    options: ["0,5 Liter", "0,75 Liter", "1 Liter", "1,25 Liter"],
    answer: "0,75 Liter",
    explanation: "Drei Gläser enthalten zusammen 0,75 Liter. Von 1,5 Litern bleiben 0,75 Liter übrig.",
  },
  {
    question: "Eine Besprechung dauert von 9:20 Uhr bis 10:05 Uhr. Wie lange dauert sie?",
    options: ["35 Minuten", "40 Minuten", "45 Minuten", "50 Minuten"],
    answer: "45 Minuten",
    explanation: "Von 9:20 Uhr bis 10:00 Uhr sind es 40 Minuten, danach noch 5 Minuten.",
  },
  {
    question: "Welches Wort ergänzt die Reihe sinnvoll? Januar, März, Mai, …",
    options: ["Juni", "Juli", "August", "September"],
    answer: "Juli",
    explanation: "Die Reihe besteht aus jedem zweiten Monat: Januar, März, Mai, Juli.",
  },
  {
    question: "In einer Ausstellung sind 24 Bilder zu sehen. Ein Viertel davon sind Landschaftsbilder. Wie viele Landschaftsbilder sind es?",
    options: ["4", "6", "8", "12"],
    answer: "6",
    explanation: "Ein Viertel von 24 ist 24 geteilt durch 4, also 6.",
  },
  {
    question: "Welche Redewendung bedeutet, eine Angelegenheit besonders sorgfältig zu prüfen?",
    options: [
      "Etwas unter die Lupe nehmen",
      "Etwas auf die lange Bank schieben",
      "Etwas aus dem Ärmel schütteln",
      "Etwas an die große Glocke hängen",
    ],
    answer: "Etwas unter die Lupe nehmen",
    explanation: "Wer etwas unter die Lupe nimmt, betrachtet und prüft es sehr genau.",
  },
];

const el = {
  home: document.getElementById("homeScreen"),
  memory: document.getElementById("memoryScreen"),
  puzzle: document.getElementById("puzzleScreen"),

  totalCorrect: document.getElementById("totalCorrect"),
  gamesPlayed: document.getElementById("gamesPlayed"),

  settingsPanel: document.getElementById("settingsPanel"),
  settingsToggle: document.getElementById("settingsToggle"),
  contrastToggle: document.getElementById("contrastToggle"),
  fontScale: document.getElementById("fontScale"),
  fontScaleValue: document.getElementById("fontScaleValue"),

  startMemory: document.getElementById("startMemoryBtn"),
  startPuzzle: document.getElementById("startPuzzleBtn"),

  memoryInstruction: document.getElementById("memoryInstruction"),
  memorySequence: document.getElementById("memorySequence"),
  memoryBoard: document.getElementById("memoryBoard"),
  memoryStatus: document.getElementById("memoryStatus"),
  memoryStart: document.getElementById("memoryStartBtn"),
  memoryNext: document.getElementById("memoryNextBtn"),

  puzzleQuestion: document.getElementById("puzzleQuestion"),
  puzzleOptions: document.getElementById("puzzleOptions"),
  puzzleFeedback: document.getElementById("puzzleFeedback"),
  nextPuzzle: document.getElementById("nextPuzzleBtn"),
};

function showScreen(name) {
  const screens = {
    home: el.home,
    memory: el.memory,
    puzzle: el.puzzle,
  };

  Object.entries(screens).forEach(([screenName, screen]) => {
    screen.hidden = screenName !== name;
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateScore() {
  el.totalCorrect.textContent = String(state.totalCorrect);
  el.gamesPlayed.textContent = String(state.gamesPlayed);
}

function updateSettings() {
  document.body.classList.toggle("high-contrast", state.highContrast);
  document.body.style.fontSize = `${state.fontScale}%`;
  el.fontScaleValue.textContent = `${state.fontScale} %`;

  el.contrastToggle.textContent = state.highContrast
    ? "Hoher Kontrast: An"
    : "Hoher Kontrast: Aus";

  el.contrastToggle.setAttribute("aria-pressed", String(state.highContrast));
}

function resetMemoryScreen() {
  window.clearTimeout(state.memoryTimer);
  state.memoryLocked = true;
  state.memoryRoundNumber = 0;
  el.memorySequence.replaceChildren();
  el.memoryBoard.replaceChildren();
  el.memoryInstruction.textContent = "Starte eine Runde und merke dir die Formen.";
  el.memoryStatus.textContent = "Bereit? Nimm dir Zeit.";
  el.memoryStart.hidden = false;
  el.memoryNext.hidden = true;
}

function buildMemoryBoard() {
  el.memoryBoard.replaceChildren();

  shapes.forEach((shape) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "memory-choice";
    button.textContent = shape;
    button.dataset.shape = shape;
    button.disabled = true;
    button.addEventListener("click", () => selectShape(shape, button));
    el.memoryBoard.appendChild(button);
  });
}

function startMemoryRound() {
  window.clearTimeout(state.memoryTimer);
  state.memoryRoundNumber += 1;
  state.memoryUserInput = [];
  state.memoryLocked = true;

  const length = Math.min(2 + state.memoryRoundNumber, 6);
  state.memorySequence = Array.from({ length }, () => {
    return shapes[Math.floor(Math.random() * shapes.length)];
  });

  el.memoryInstruction.textContent = `Merke dir die ${length} Formen in dieser Reihenfolge.`;
  el.memoryStatus.textContent = "Schau dir die Reihenfolge in Ruhe an.";
  el.memoryStart.hidden = true;
  el.memoryNext.hidden = true;

  el.memorySequence.replaceChildren();
  state.memorySequence.forEach((shape, index) => {
    const chip = document.createElement("span");
    chip.className = "memory-chip";
    chip.textContent = shape;
    chip.setAttribute("aria-label", `Form ${index + 1}: ${shape}`);
    el.memorySequence.appendChild(chip);
  });

  buildMemoryBoard();

  const activeRound = state.memoryRoundNumber;
  state.memoryTimer = window.setTimeout(() => {
    if (activeRound !== state.memoryRoundNumber) return;

    el.memorySequence.replaceChildren();
    el.memoryInstruction.textContent = "Wähle nun die Formen in derselben Reihenfolge aus.";
    el.memoryStatus.textContent = "Du bist dran.";
    state.memoryLocked = false;

    el.memoryBoard.querySelectorAll(".memory-choice").forEach((button) => {
      button.disabled = false;
    });
  }, 2500);
}

function finishMemoryRound(correct) {
  state.memoryLocked = true;
  state.gamesPlayed += 1;

  if (correct) {
    state.totalCorrect += 1;
    el.memoryStatus.textContent = "Richtig! Du hast die Reihenfolge wiedergegeben.";
    el.memoryInstruction.textContent = "Gut gemacht. Du kannst eine neue Runde spielen.";
  } else {
    el.memoryStatus.textContent = "Das war nicht ganz richtig. Eine neue Runde wartet auf dich.";
    el.memoryInstruction.textContent =
      `Die richtige Reihenfolge war: ${state.memorySequence.join(", ")}.`;
  }

  el.memoryBoard.querySelectorAll(".memory-choice").forEach((button) => {
    button.disabled = true;
  });

  el.memoryNext.hidden = false;
  updateScore();
}

function selectShape(shape, button) {
  if (state.memoryLocked || button.disabled) return;

  button.classList.add("selected");
  state.memoryUserInput.push(shape);

  const index = state.memoryUserInput.length - 1;
  if (shape !== state.memorySequence[index]) {
    button.classList.add("wrong");
    finishMemoryRound(false);
    return;
  }

  if (state.memoryUserInput.length === state.memorySequence.length) {
    finishMemoryRound(true);
  }
}

function showPuzzle() {
  const puzzle = puzzles[state.puzzleIndex % puzzles.length];

  state.puzzleAnswered = false;
  el.puzzleQuestion.textContent = puzzle.question;
  el.puzzleOptions.replaceChildren();
  el.puzzleFeedback.textContent = "";
  el.puzzleFeedback.className = "feedback";
  el.nextPuzzle.hidden = true;

  puzzle.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-btn";
    button.textContent = option;
    button.addEventListener("click", () => answerPuzzle(option, button, puzzle));
    el.puzzleOptions.appendChild(button);
  });
}

function answerPuzzle(selected, selectedButton, puzzle) {
  if (state.puzzleAnswered) return;

  state.puzzleAnswered = true;
  state.gamesPlayed += 1;

  el.puzzleOptions.querySelectorAll(".option-btn").forEach((button) => {
    button.disabled = true;
    if (button.textContent === puzzle.answer) {
      button.classList.add("correct");
    }
  });

  if (selected === puzzle.answer) {
    state.totalCorrect += 1;
    el.puzzleFeedback.textContent = `Richtig. ${puzzle.explanation}`;
    el.puzzleFeedback.classList.add("success");
  } else {
    selectedButton.classList.add("wrong");
    el.puzzleFeedback.textContent = `Das ist leider nicht richtig. ${puzzle.explanation}`;
    el.puzzleFeedback.classList.add("error");
  }

  el.nextPuzzle.hidden = false;
  updateScore();
}

el.settingsToggle.addEventListener("click", () => {
  const opening = el.settingsPanel.hidden;
  el.settingsPanel.hidden = !opening;
  el.settingsToggle.setAttribute("aria-expanded", String(opening));
});

el.contrastToggle.addEventListener("click", () => {
  state.highContrast = !state.highContrast;
  updateSettings();
});

el.fontScale.addEventListener("input", (event) => {
  state.fontScale = Number(event.target.value);
  updateSettings();
});

el.startMemory.addEventListener("click", () => {
  resetMemoryScreen();
  showScreen("memory");
});

el.memoryStart.addEventListener("click", startMemoryRound);
el.memoryNext.addEventListener("click", startMemoryRound);

el.startPuzzle.addEventListener("click", () => {
  showScreen("puzzle");
  showPuzzle();
});

el.nextPuzzle.addEventListener("click", () => {
  state.puzzleIndex += 1;
  showPuzzle();
});

document.querySelectorAll('[data-nav="home"]').forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    window.clearTimeout(state.memoryTimer);
    state.memoryLocked = true;
    showScreen("home");
  });
});

updateScore();
updateSettings();
showScreen("home");