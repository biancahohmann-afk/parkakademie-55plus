const state = {
  totalCorrect: 0,
  gamesPlayed: 0,
  currentMode: 'home',
  memorySequence: [],
  memoryUserInput: [],
  memoryLocked: false,
  highContrast: false,
  fontScale: 100,
  puzzleIndex: 0,
};

const memorySymbols = ['☀️', '🌧️', '🌳', '⭐', '🍎', '🧩', '🌙', '🍉'];

const puzzles = [
  {
    question: 'Welche Zahl ist größer als 12 und kleiner als 14?',
    options: ['11', '13', '15', '10'],
    answer: '13',
    explanation: '13 liegt zwischen 12 und 14.'
  },
  {
    question: 'Welches Wort passt am besten zu „Lernen“?',
    options: ['Tanzen', 'Denken', 'Schlafen', 'Singen'],
    answer: 'Denken',
    explanation: 'Beim Lernen denken wir über neue Informationen nach.'
  },
  {
    question: 'Wenn Anna 3 Äpfel hat und 2 weitere bekommt, wie viele hat sie dann?',
    options: ['4', '5', '6', '3'],
    answer: '5',
    explanation: '3 + 2 = 5.'
  },
  {
    question: 'Welches Tier kann fliegen?',
    options: ['Hund', 'Fisch', 'Vogel', 'Kuh'],
    answer: 'Vogel',
    explanation: 'Vögel sind die klassischen Beispiele für fliegende Tiere.'
  },
  {
    question: 'Was kommt nach: 2, 4, 6, ?',
    options: ['7', '8', '9', '10'],
    answer: '8',
    explanation: 'Die Zahlen steigen um 2: 2, 4, 6, 8.'
  }
];

const refs = {
  homeScreen: document.getElementById('homeScreen'),
  memoryScreen: document.getElementById('memoryScreen'),
  puzzleScreen: document.getElementById('puzzleScreen'),
  totalCorrect: document.getElementById('totalCorrect'),
  gamesPlayed: document.getElementById('gamesPlayed'),
  settingsPanel: document.getElementById('settingsPanel'),
  settingsToggle: document.getElementById('settingsToggle'),
  contrastToggle: document.getElementById('contrastToggle'),
  fontScale: document.getElementById('fontScale'),
  memoryBoard: document.getElementById('memoryBoard'),
  memorySequence: document.getElementById('memorySequence'),
  memoryStatus: document.getElementById('memoryStatus'),
  memoryInstruction: document.getElementById('memoryInstruction'),
  puzzleQuestion: document.getElementById('puzzleQuestion'),
  puzzleOptions: document.getElementById('puzzleOptions'),
  puzzleFeedback: document.getElementById('puzzleFeedback'),
  startMemoryBtn: document.getElementById('startMemoryBtn'),
  startPuzzleBtn: document.getElementById('startPuzzleBtn'),
};

function showScreen(screenName) {
  state.currentMode = screenName;
  refs.homeScreen.classList.toggle('active', screenName === 'home');
  refs.memoryScreen.classList.toggle('active', screenName === 'memory');
  refs.puzzleScreen.classList.toggle('active', screenName === 'puzzle');
}

function updateScoreboard() {
  refs.totalCorrect.textContent = String(state.totalCorrect);
  refs.gamesPlayed.textContent = String(state.gamesPlayed);
}

function updateSettingsUI() {
  document.body.classList.toggle('high-contrast', state.highContrast);
  document.body.style.fontSize = `${state.fontScale}%`;
  refs.contrastToggle.textContent = state.highContrast
    ? 'Hoher Kontrast: An'
    : 'Hoher Kontrast: Aus';
  refs.contrastToggle.setAttribute('aria-pressed', String(state.highContrast));
}

function triggerMemoryRound() {
  const sequenceLength = 3 + Math.min(2, Math.floor(state.gamesPlayed / 2));
  const sequence = [];

  for (let i = 0; i < sequenceLength; i++) {
    sequence.push(memorySymbols[Math.floor(Math.random() * memorySymbols.length)]);
  }

  state.memorySequence = sequence;
  state.memoryUserInput = [];
  state.memoryLocked = false;
  refs.memoryStatus.textContent = 'Merke dir die Reihenfolge!';
  refs.memoryInstruction.textContent = `Merke dir ${sequence.length} Symbole in der richtigen Reihenfolge.`;
  refs.memorySequence.innerHTML = '';
  refs.memoryBoard.innerHTML = '';

  const boardSymbols = [...memorySymbols];
  boardSymbols.forEach((symbol) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'memory-card';
    btn.textContent = symbol;
    btn.dataset.symbol = symbol;
    btn.setAttribute('aria-label', `Symbol ${symbol}`);
    btn.addEventListener('click', () => handleMemorySelection(symbol, btn));
    refs.memoryBoard.appendChild(btn);
  });

  const chips = sequence.map((symbol, index) => {
    const chip = document.createElement('span');
    chip.className = 'memory-chip';
    chip.textContent = symbol;
    chip.setAttribute('aria-label', `Symbol ${index + 1}: ${symbol}`);
    return chip;
  });

  chips.forEach((chip) => refs.memorySequence.appendChild(chip));

  refs.memorySequence.classList.remove('hidden');
  refs.memoryBoard.querySelectorAll('.memory-card').forEach((card) => card.classList.remove('selected', 'correct', 'wrong'));

  setTimeout(() => {
    refs.memorySequence.innerHTML = '';
    refs.memoryStatus.textContent = 'Jetzt wiederholen!';
    refs.memoryInstruction.textContent = 'Klicke die Symbole in der gleichen Reihenfolge an.';
  }, 1800);
}

function handleMemorySelection(symbol, button) {
  if (state.memoryLocked) {
    return;
  }

  if (!button) {
    return;
  }

  button.classList.add('selected');

  state.memoryUserInput.push(symbol);
  const expected = state.memorySequence[state.memoryUserInput.length - 1];

  if (symbol !== expected) {
    state.memoryLocked = true;
    state.gamesPlayed += 1;
    updateScoreboard();
    refs.memoryStatus.textContent = 'Leider nicht ganz richtig. Noch einmal versuchen!';
    refs.memoryInstruction.textContent = 'Die richtige Reihenfolge war: ' + state.memorySequence.join(' ');
    refs.memoryBoard.querySelectorAll('.memory-card').forEach((card) => {
      const isCorrect = state.memorySequence.includes(card.dataset.symbol);
      if (isCorrect) {
        card.classList.add('correct');
      }
    });
    setTimeout(() => {
      triggerMemoryRound();
    }, 1800);
    return;
  }

  if (state.memoryUserInput.length === state.memorySequence.length) {
    state.totalCorrect += 1;
    state.gamesPlayed += 1;
    updateScoreboard();
    state.memoryLocked = true;
    refs.memoryStatus.textContent = 'Super! Du hast die Reihenfolge richtig wiederholt.';
    refs.memoryInstruction.textContent = 'Gut gemacht!';
    refs.memoryBoard.querySelectorAll('.memory-card').forEach((card) => {
      if (state.memorySequence.includes(card.dataset.symbol)) {
        card.classList.add('correct');
      }
    });
    setTimeout(() => {
      triggerMemoryRound();
    }, 1600);
  }
}

function renderPuzzle() {
  const question = puzzles[state.puzzleIndex % puzzles.length];
  refs.puzzleQuestion.textContent = question.question;
  refs.puzzleOptions.innerHTML = '';
  refs.puzzleFeedback.textContent = '';
  refs.puzzleFeedback.className = 'feedback';

  question.options.forEach((option) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option-btn';
    btn.textContent = option;
    btn.addEventListener('click', () => checkPuzzleAnswer(option, btn, question));
    refs.puzzleOptions.appendChild(btn);
  });
}

function checkPuzzleAnswer(option, selectionBtn, question) {
  const allButtons = refs.puzzleOptions.querySelectorAll('.option-btn');
  allButtons.forEach((button) => {
    button.disabled = true;
    if (button.textContent === question.answer) {
      button.classList.add('correct');
    }
  });

  if (option === question.answer) {
    state.totalCorrect += 1;
    state.gamesPlayed += 1;
    refs.puzzleFeedback.textContent = `Richtig! ${question.explanation}`;
    refs.puzzleFeedback.classList.add('success');
    updateScoreboard();
  } else {
    state.gamesPlayed += 1;
    refs.puzzleFeedback.textContent = `Leider falsch. ${question.explanation}`;
    refs.puzzleFeedback.classList.add('error');
    updateScoreboard();
    selectionBtn.classList.add('wrong');
  }

  setTimeout(() => {
    state.puzzleIndex += 1;
    renderPuzzle();
  }, 1800);
}

function bindUI() {
  refs.settingsToggle.addEventListener('click', () => {
    const isHidden = refs.settingsPanel.classList.toggle('hidden');
    refs.settingsToggle.setAttribute('aria-expanded', String(!isHidden));
  });

  refs.contrastToggle.addEventListener('click', () => {
    state.highContrast = !state.highContrast;
    updateSettingsUI();
  });

  refs.fontScale.addEventListener('input', (event) => {
    state.fontScale = Number(event.target.value);
    updateSettingsUI();
  });

  refs.startMemoryBtn.addEventListener('click', () => {
    showScreen('memory');
    triggerMemoryRound();
  });

  refs.startPuzzleBtn.addEventListener('click', () => {
    showScreen('puzzle');
    renderPuzzle();
  });

  document.querySelectorAll('[data-nav="home"]').forEach((button) => {
    button.addEventListener('click', () => showScreen('home'));
  });
}

bindUI();
updateScoreboard();
updateSettingsUI();
showScreen('home');
