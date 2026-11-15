"use strict";

const state = {
  totalCorrect: 0,
  gamesPlayed: 0,
  memorySequence: [],
  memoryUserInput: [],
  memoryLocked: true,
  memoryRoundNumber: 0,
  memoryTimer: null,
  puzzleLevelIndex: 0,
  puzzleQuestionIndex: 0,
  levelCorrect: 0,
  levelAnswered: 0,
  puzzleAnswered: false,
  highContrast: false,
  fontScale: 100,
};

const shapes = ["Kreis", "Dreieck", "Quadrat", "Raute", "Stern", "Welle", "Kreuz", "Bogen"];

const levels = [
  {
    title: "Level 1 – Alltag & Logik",
    questions: [
      { category: "Rechnen im Alltag", question: "Ein Kurs kostet 250 Euro. Für eine frühe Anmeldung gibt es 18 Prozent Ermäßigung. Wie viel kostet der Kurs danach?", options: ["195 Euro", "205 Euro", "215 Euro", "225 Euro"], answer: "205 Euro", explanation: "18 Prozent von 250 Euro sind 45 Euro. 250 minus 45 ergibt 205 Euro." },
      { category: "Zahlenfolge", question: "Welche Zahl ergänzt die Reihe sinnvoll? 4, 9, 19, 39, …", options: ["59", "69", "79", "89"], answer: "79", explanation: "Die Folge entsteht durch Verdoppeln und Plus 1: 4×2+1=9, 9×2+1=19, 19×2+1=39, 39×2+1=79." },
      { category: "Zeitplanung", question: "Drei Vorträge dauern jeweils 20 Minuten. Zwischen dem zweiten und dritten Vortrag gibt es eine Pause von 10 Minuten. Wie lange dauert das Programm insgesamt?", options: ["60 Minuten", "70 Minuten", "80 Minuten", "90 Minuten"], answer: "70 Minuten", explanation: "3×20 = 60 Minuten. Hinzu kommt eine 10-Minuten-Pause. Insgesamt sind es 70 Minuten." },
      { category: "Wortschatz", question: "Welches Wort trifft die Bedeutung von „präzise“ am besten?", options: ["genau", "vorsichtig", "ausführlich", "ungewöhnlich"], answer: "genau", explanation: "Präzise bedeutet genau, klar und sachlich bestimmt." },
      { category: "Bruchrechnung", question: "Für eine Veranstaltung stehen 90 Plätze zur Verfügung. Zwei Drittel sind bereits vergeben. Wie viele Plätze sind vergeben?", options: ["30", "45", "60", "75"], answer: "60", explanation: "Ein Drittel von 90 ist 30. Zwei Drittel sind 60." },
      { category: "Zeitrechnung", question: "Eine Besprechung beginnt um 9:15 Uhr und dauert 1 Stunde 40 Minuten. Wann endet sie?", options: ["10:35 Uhr", "10:45 Uhr", "10:55 Uhr", "11:05 Uhr"], answer: "10:55 Uhr", explanation: "Eine Stunde später ist 10:15 Uhr. Weitere 40 Minuten ergeben 10:55 Uhr." },
      { category: "Sprachverständnis", question: "Welches Wort ist das Gegenteil von „sicher“?", options: ["unsicher", "klar", "stabil", "fest"], answer: "unsicher", explanation: "Unsicher ist das Gegenteil von sicher. Es beschreibt Zweifel oder fehlende Gewissheit." },
      { category: "Mengenlehre", question: "Ein Raum hat 24 Plätze. Drei Viertel davon sind besetzt. Wie viele Plätze sind noch frei?", options: ["4", "6", "8", "12"], answer: "6", explanation: "Drei Viertel von 24 sind 18. Übrig bleiben 6 freie Plätze." },
      { category: "Alltagslogik", question: "Eine Fahrkarte kostet 18 Euro. Ein Rabatt von 10 Prozent wird gewährt. Wie viel kostet die Fahrkarte danach?", options: ["15,80 Euro", "16,20 Euro", "16,80 Euro", "17,20 Euro"], answer: "16,20 Euro", explanation: "10 Prozent von 18 Euro sind 1,80 Euro. 18 minus 1,80 ist 16,20 Euro." },
      { category: "Satzlogik", question: "Alle Museumsführungen dauern länger als eine Stunde. Die Führung durch die Sonderausstellung ist eine Museumsführung. Was folgt sicher?", options: ["Die Sonderausstellungsführung dauert länger als eine Stunde.", "Sie dauert genau eine Stunde.", "Alle Führungen dauern gleich lang.", "Die Sonderausstellung ist täglich geöffnet."], answer: "Die Sonderausstellungsführung dauert länger als eine Stunde.", explanation: "Die Führung durch die Sonderausstellung gehört zur Gruppe der Museumsführungen. Deshalb gilt für sie die genannte Dauerregel." },
    ],
  },
  {
    title: "Level 2 – Muster & Analyse",
    questions: [
      { category: "Prozentrechnung", question: "Ein Mantel kostet 240 Euro. Der Preis wird um 15 Prozent gesenkt. Wie hoch ist der neue Preis?", options: ["196 Euro", "204 Euro", "210 Euro", "216 Euro"], answer: "204 Euro", explanation: "15 Prozent von 240 Euro sind 36 Euro. 240 minus 36 = 204 Euro." },
      { category: "Zahlenfolge", question: "Welche Zahl folgt? 2, 6, 12, 20, 30, …", options: ["36", "40", "42", "44"], answer: "42", explanation: "Die Abstände wachsen: +4, +6, +8, +10, +12. Deshalb folgt 30 + 12 = 42." },
      { category: "Logisches Denken", question: "Alle Mitglieder eines Chors können Noten lesen. Einige Personen, die Noten lesen können, spielen außerdem ein Instrument. Was lässt sich sicher sagen?", options: ["Alle Chormitglieder spielen ein Instrument.", "Einige Chormitglieder spielen ein Instrument.", "Kein Chormitglied spielt ein Instrument.", "Es lässt sich nicht sicher sagen, ob Chormitglieder ein Instrument spielen."], answer: "Es lässt sich nicht sicher sagen, ob Chormitglieder ein Instrument spielen.", explanation: "Die Personen, die ein Instrument spielen, müssen nicht zum Chor gehören. Daher lässt sich keine sichere Aussage über das Instrumentenspiel der Chormitglieder treffen." },
      { category: "Planung", question: "Ein Buch hat 480 Seiten. Eine Person liest an jedem Tag 30 Seiten. Wie viele Lesetage braucht sie für das gesamte Buch?", options: ["14", "15", "16", "18"], answer: "16", explanation: "480 ÷ 30 = 16. Sie braucht also 16 Tage." },
      { category: "Zeitgefühl", question: "Eine Führung beginnt um 8:35 Uhr und endet um 11:10 Uhr. Wie lange dauert sie?", options: ["2 Stunden 25 Minuten", "2 Stunden 35 Minuten", "2 Stunden 45 Minuten", "3 Stunden 5 Minuten"], answer: "2 Stunden 35 Minuten", explanation: "Von 8:35 bis 10:35 sind 2 Stunden. Bis 11:10 sind es weitere 35 Minuten. Insgesamt 2 Stunden 35 Minuten." },
      { category: "Wortstamm", question: "Welches Wort passt am besten zu „verifizieren“?", options: ["prüfen", "lösen", "verschieben", "ausgeben"], answer: "prüfen", explanation: "Verifizieren bedeutet, etwas zu prüfen und die Richtigkeit zu bestätigen." },
      { category: "Mengen und Verhältnisse", question: "Ein Betrieb hat 120 Mitarbeiterinnen und Mitarbeiter. 25 Prozent sind im Vertrieb tätig. Wie viele sind das?", options: ["20", "25", "30", "35"], answer: "30", explanation: "25 Prozent entsprechen einem Viertel. Ein Viertel von 120 ist 30." },
      { category: "Logik", question: "Alle Museumsführer haben eine Schulung absolviert. Einige Mitarbeitende des Museums sind Museumsführer. Welche Aussage folgt sicher?", options: ["Alle Mitarbeitenden haben eine Schulung absolviert.", "Einige Mitarbeitende haben eine Schulung absolviert.", "Niemand außer Museumsführern hat eine Schulung absolviert.", "Alle Geschulten sind Museumsführer."], answer: "Einige Mitarbeitende haben eine Schulung absolviert.", explanation: "Die genannten Mitarbeitenden, die Museumsführer sind, gehören zu den Geschulten. Da es einige solche Mitarbeitende gibt, haben sicher einige Mitarbeitende die Schulung absolviert." },
      { category: "Zahlensystem", question: "Eine Bestellung kostet 84 Euro. Zwei Personen teilen die Kosten gleichmäßig. Wie viel zahlt jede Person?", options: ["40 Euro", "42 Euro", "44 Euro", "46 Euro"], answer: "42 Euro", explanation: "84 ÷ 2 = 42, also zahlt jede Person 42 Euro." },
      { category: "Textverständnis", question: "Welches Wort ist am besten synonym zu „vorausschauend“?", options: ["vorsorglich", "schnell", "laut", "unklar"], answer: "vorsorglich", explanation: "Vorausschauend bedeutet, mögliche Entwicklungen mitzudenken und entsprechend vorzusorgen." },
    ],
  },
  {
    title: "Level 3 – Anspruchsvoll & strategisch",
    questions: [
      { category: "Mehrstufiges Rechnen", question: "Ein Gerät kostet 250 Euro. Zuerst wird der Preis um 20 Prozent reduziert. Auf den reduzierten Preis fallen anschließend 10 Prozent Versandkosten an. Wie hoch ist der Gesamtpreis?", options: ["200 Euro", "215 Euro", "220 Euro", "225 Euro"], answer: "220 Euro", explanation: "20 Prozent Rabatt von 250 Euro sind 50 Euro. Der Preis sinkt auf 200 Euro. 10 Prozent davon sind 20 Euro; zusammen sind es 220 Euro." },
      { category: "Zahlenfolge", question: "Welche Zahl folgt? 3, 8, 18, 38, 78, …", options: ["118", "148", "156", "158"], answer: "158", explanation: "Jede Zahl wird verdoppelt und um 2 erhöht. Daher ist 78×2+2 = 158." },
      { category: "Logik und Mengen", question: "In einem Lesekreis lesen alle Mitglieder Romane. Einige Menschen, die Romane lesen, schreiben selbst. Was folgt daraus zwingend?", options: ["Alle Mitglieder des Lesekreises schreiben selbst.", "Einige Mitglieder des Lesekreises schreiben selbst.", "Kein Mitglied des Lesekreises schreibt selbst.", "Es lässt sich nicht feststellen, ob Mitglieder des Lesekreises selbst schreiben."], answer: "Es lässt sich nicht feststellen, ob Mitglieder des Lesekreises selbst schreiben.", explanation: "Die schreibenden Romanleserinnen und -leser müssen nicht zum Lesekreis gehören. Eine Überschneidung ist möglich, aber nicht zwingend." },
      { category: "Budgetplanung", question: "Für eine Veranstaltung stehen 900 Euro zur Verfügung. Ein Drittel wird für den Raum ausgegeben. Von dem verbleibenden Betrag werden 20 Prozent für Material verwendet. Wie viel Geld bleibt anschließend übrig?", options: ["420 Euro", "450 Euro", "480 Euro", "540 Euro"], answer: "480 Euro", explanation: "Ein Drittel von 900 Euro ist 300 Euro. Es bleiben 600 Euro. 20 Prozent davon sind 120 Euro. 600−120=480 Euro." },
      { category: "Schlussfolgerungen", question: "Alle Mitglieder des Vorstands wurden eingeladen. Frau Berger wurde eingeladen. Welche Folgerung ist logisch sicher?", options: ["Frau Berger ist Vorstandsmitglied.", "Frau Berger ist kein Vorstandsmitglied.", "Frau Berger könnte Vorstandsmitglied sein, muss es aber nicht.", "Nur Vorstandsmitglieder wurden eingeladen."], answer: "Frau Berger könnte Vorstandsmitglied sein, muss es aber nicht.", explanation: "Alle Vorstandsmitglieder wurden eingeladen, aber möglicherweise auch andere Personen. Deshalb kann Frau Berger dazugehören, es ist aber nicht sicher." },
      { category: "Verhältnisse", question: "Eine Fläche ist in drei gleich große Felder geteilt. Zwei dieser Felder sind jeweils zu 60 Prozent bepflanzt. Wie viel Prozent der Gesamtfläche sind bepflanzt?", options: ["20 Prozent", "40 Prozent", "60 Prozent", "80 Prozent"], answer: "40 Prozent", explanation: "Zwei Drittel der Fläche sind die beiden Felder. 60 Prozent von zwei Dritteln ergeben 0,6×2/3 = 0,4, also 40 Prozent der Gesamtfläche." },
      { category: "Zeit und Pausen", question: "Ein Seminar dauert einschließlich zweier Pausen von je 10 Minuten insgesamt 2 Stunden 15 Minuten. Wie lange dauert das Seminar ohne Pausen?", options: ["1 Stunde 45 Minuten", "1 Stunde 55 Minuten", "2 Stunden 5 Minuten", "2 Stunden 15 Minuten"], answer: "1 Stunde 55 Minuten", explanation: "2 Stunden 15 Minuten sind 135 Minuten. Die Pausen dauern zusammen 20 Minuten. 135−20 = 115 Minuten, also 1 Stunde 55 Minuten." },
      { category: "Wortbedeutung", question: "Welches Wort kommt „konsequent“ in der Bedeutung am nächsten?", options: ["beharrlich", "zwanghaft", "unklar", "zufällig"], answer: "beharrlich", explanation: "Konsequent bedeutet, einem Entschluss oder Ziel verlässlich zu folgen. Beharrlich kommt dieser Bedeutung am nächsten." },
      { category: "Verteilungslogik", question: "Ein Verein hat 160 Mitglieder. 35 Prozent davon sind aktiv in einer Arbeitsgruppe. Wie viele Mitglieder sind aktiv?", options: ["46", "50", "56", "60"], answer: "56", explanation: "35 Prozent von 160 sind 0,35×160 = 56 Mitglieder." },
      { category: "Textanalyse", question: "Welches Wort ist am passendsten als Gegenstück zu „reserviert“ im Sinne von zurückhaltend?", options: ["offen", "ruhig", "schweigsam", "vorsichtig"], answer: "offen", explanation: "Reserviert bedeutet zurückhaltend und eher distanziert. Offen steht dem in diesem Sinn am ehesten gegenüber." },
    ],
  },
];

const elements = {
  homeScreen: document.getElementById("homeScreen"),
  memoryScreen: document.getElementById("memoryScreen"),
  puzzleScreen: document.getElementById("puzzleScreen"),
  totalCorrect: document.getElementById("totalCorrect"),
  gamesPlayed: document.getElementById("gamesPlayed"),
  settingsPanel: document.getElementById("settingsPanel"),
  settingsToggle: document.getElementById("settingsToggle"),
  contrastToggle: document.getElementById("contrastToggle"),
  fontScale: document.getElementById("fontScale"),
  fontScaleValue: document.getElementById("fontScaleValue"),
  startMemoryBtn: document.getElementById("startMemoryBtn"),
  startPuzzleBtn: document.getElementById("startPuzzleBtn"),
  memoryInstruction: document.getElementById("memoryInstruction"),
  memorySequence: document.getElementById("memorySequence"),
  memoryBoard: document.getElementById("memoryBoard"),
  memoryStatus: document.getElementById("memoryStatus"),
  memoryStartBtn: document.getElementById("memoryStartBtn"),
  memoryNextBtn: document.getElementById("memoryNextBtn"),
  quizGame: document.getElementById("quizGame"),
  levelLabel: document.getElementById("levelLabel"),
  questionProgress: document.getElementById("questionProgress"),
  progressTrack: document.querySelector(".progress-track"),
  progressBar: document.getElementById("progressBar"),
  puzzleCategory: document.getElementById("puzzleCategory"),
  puzzleQuestion: document.getElementById("puzzleQuestion"),
  puzzleOptions: document.getElementById("puzzleOptions"),
  puzzleFeedback: document.getElementById("puzzleFeedback"),
  nextPuzzleBtn: document.getElementById("nextPuzzleBtn"),
  levelResult: document.getElementById("levelResult"),
  levelResultTitle: document.getElementById("levelResultTitle"),
  levelScore: document.getElementById("levelScore"),
  levelPercentage: document.getElementById("levelPercentage"),
  levelResultMessage: document.getElementById("levelResultMessage"),
  levelCorrectCount: document.getElementById("levelCorrectCount"),
  levelQuestionCount: document.getElementById("levelQuestionCount"),
  nextLevelBtn: document.getElementById("nextLevelBtn"),
  replayLevelBtn: document.getElementById("replayLevelBtn"),
  resultHomeBtn: document.getElementById("resultHomeBtn"),
};

function showScreen(screenName) {
  const screens = { home: elements.homeScreen, memory: elements.memoryScreen, puzzle: elements.puzzleScreen };
  Object.entries(screens).forEach(([name, screen]) => { screen.hidden = name !== screenName; });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateScoreboard() {
  elements.totalCorrect.textContent = String(state.totalCorrect);
  elements.gamesPlayed.textContent = String(state.gamesPlayed);
}

function updateSettings() {
  document.body.classList.toggle("high-contrast", state.highContrast);
  document.body.style.fontSize = `${state.fontScale}%`;
  elements.fontScaleValue.textContent = `${state.fontScale} %`;
  elements.contrastToggle.textContent = state.highContrast ? "Hoher Kontrast: An" : "Hoher Kontrast: Aus";
  elements.contrastToggle.setAttribute("aria-pressed", String(state.highContrast));
}

function clearMemoryTimer() {
  if (state.memoryTimer !== null) {
    window.clearInterval(state.memoryTimer);
    state.memoryTimer = null;
  }
}

function resetMemoryScreen() {
  clearMemoryTimer();
  state.memoryRoundNumber = 0;
  state.memoryUserInput = [];
  state.memoryLocked = true;
  elements.memorySequence.replaceChildren();
  elements.memoryBoard.replaceChildren();
  elements.memoryInstruction.textContent = "Merke dir die Formen in der richtigen Reihenfolge.";
  elements.memoryStatus.textContent = "Bereit? Nimm dir Zeit.";
  elements.memoryStartBtn.hidden = false;
  elements.memoryNextBtn.hidden = true;
}

function buildMemoryBoard() {
  elements.memoryBoard.replaceChildren();
  shapes.forEach((shape) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "memory-choice";
    button.textContent = shape;
    button.dataset.shape = shape;
    button.disabled = true;
    button.setAttribute("aria-label", shape);
    button.addEventListener("click", () => handleMemoryChoice(shape, button));
    elements.memoryBoard.appendChild(button);
  });
}

function startMemoryRound() {
  clearMemoryTimer();
  state.memoryRoundNumber += 1;
  state.memoryUserInput = [];
  state.memoryLocked = true;

  const length = Math.min(2 + state.memoryRoundNumber, 6);
  state.memorySequence = Array.from({ length }, () => shapes[Math.floor(Math.random() * shapes.length)]);
  // Provide at least 15 seconds; add 5 seconds for each item in longer sequences.
  let secondsRemaining = Math.max(15, length * 5);

  elements.memoryInstruction.textContent = `Merke dir die ${length} Formen in der angezeigten Reihenfolge.`;
  elements.memoryStatus.textContent = `Schau dir die Reihenfolge in Ruhe an. Noch ${secondsRemaining} Sekunden.`;
  elements.memoryStartBtn.hidden = true;
  elements.memoryNextBtn.hidden = true;
  elements.memorySequence.replaceChildren();

  state.memorySequence.forEach((shape, index) => {
    const chip = document.createElement("span");
    chip.className = "memory-chip";
    chip.textContent = shape;
    chip.setAttribute("aria-label", `Form ${index + 1}: ${shape}`);
    elements.memorySequence.appendChild(chip);
  });

  buildMemoryBoard();
  state.memoryTimer = window.setInterval(() => {
    secondsRemaining -= 1;
    if (secondsRemaining > 0) {
      elements.memoryStatus.textContent = `Schau dir die Reihenfolge in Ruhe an. Noch ${secondsRemaining} Sekunden.`;
      return;
    }

    clearMemoryTimer();
    elements.memorySequence.replaceChildren();
    elements.memoryInstruction.textContent = "Wähle nun die Formen in derselben Reihenfolge aus.";
    elements.memoryStatus.textContent = "Du bist dran.";
    state.memoryLocked = false;
    elements.memoryBoard.querySelectorAll(".memory-choice").forEach((button) => { button.disabled = false; });
  }, 1000);
}

function finishMemoryRound(isCorrect) {
  state.memoryLocked = true;
  state.gamesPlayed += 1;
  if (isCorrect) {
    state.totalCorrect += 1;
    elements.memoryStatus.textContent = "Richtig! Du hast die Reihenfolge vollständig wiedergegeben.";
    elements.memoryInstruction.textContent = "Gut gemacht. Wenn du möchtest, kannst du eine neue Runde spielen.";
  } else {
    elements.memoryStatus.textContent = "Das war nicht ganz die richtige Reihenfolge. Eine neue Runde wartet auf dich.";
    elements.memoryInstruction.textContent = `Die richtige Reihenfolge war: ${state.memorySequence.join(", ")}.`;
  }
  elements.memoryBoard.querySelectorAll(".memory-choice").forEach((button) => { button.disabled = true; });
  elements.memoryNextBtn.hidden = false;
  updateScoreboard();
}

function handleMemoryChoice(shape, button) {
  if (state.memoryLocked || button.disabled) return;
  button.classList.add("selected");
  state.memoryUserInput.push(shape);
  const index = state.memoryUserInput.length - 1;
  if (shape !== state.memorySequence[index]) {
    button.classList.add("wrong");
    finishMemoryRound(false);
    return;
  }
  if (state.memoryUserInput.length === state.memorySequence.length) finishMemoryRound(true);
}

function startQuiz() {
  state.puzzleLevelIndex = 0;
  state.puzzleQuestionIndex = 0;
  state.levelCorrect = 0;
  state.levelAnswered = 0;
  elements.quizGame.hidden = false;
  elements.levelResult.hidden = true;
  showScreen("puzzle");
  renderQuestion();
}

function renderQuestion() {
  const level = levels[state.puzzleLevelIndex];
  const question = level.questions[state.puzzleQuestionIndex];
  const totalQuestions = level.questions.length;
  const currentQuestionNumber = state.puzzleQuestionIndex + 1;
  state.puzzleAnswered = false;

  elements.levelLabel.textContent = level.title;
  elements.questionProgress.textContent = `Frage ${currentQuestionNumber} von ${totalQuestions}`;
  elements.progressBar.style.width = `${(state.levelAnswered / totalQuestions) * 100}%`;
  elements.progressTrack.setAttribute("aria-valuemax", String(totalQuestions));
  elements.progressTrack.setAttribute("aria-valuenow", String(state.levelAnswered));
  elements.puzzleCategory.textContent = question.category;
  elements.puzzleQuestion.textContent = question.question;
  elements.puzzleOptions.replaceChildren();
  elements.puzzleFeedback.textContent = "";
  elements.puzzleFeedback.className = "feedback";
  elements.nextPuzzleBtn.hidden = true;
  elements.nextPuzzleBtn.textContent = currentQuestionNumber === totalQuestions ? "Ergebnis anzeigen" : "Weiter";

  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-btn";
    button.textContent = option;
    button.addEventListener("click", () => answerQuestion(option, button, question));
    elements.puzzleOptions.appendChild(button);
  });
}

function answerQuestion(selectedOption, selectedButton, question) {
  if (state.puzzleAnswered) return;
  state.puzzleAnswered = true;
  state.levelAnswered += 1;
  state.gamesPlayed += 1;

  elements.puzzleOptions.querySelectorAll(".option-btn").forEach((button) => {
    button.disabled = true;
    if (button.textContent === question.answer) button.classList.add("correct");
  });

  if (selectedOption === question.answer) {
    state.levelCorrect += 1;
    state.totalCorrect += 1;
    elements.puzzleFeedback.textContent = `Richtig. ${question.explanation}`;
    elements.puzzleFeedback.classList.add("success");
  } else {
    selectedButton.classList.add("wrong");
    elements.puzzleFeedback.textContent = `Die richtige Antwort ist „${question.answer}“. ${question.explanation}`;
    elements.puzzleFeedback.classList.add("error");
  }

  const totalQuestions = levels[state.puzzleLevelIndex].questions.length;
  elements.progressBar.style.width = `${(state.levelAnswered / totalQuestions) * 100}%`;
  elements.progressTrack.setAttribute("aria-valuenow", String(state.levelAnswered));
  updateScoreboard();

  if (state.levelAnswered >= totalQuestions) {
    elements.nextPuzzleBtn.textContent = "Ergebnis jetzt anzeigen";
    elements.nextPuzzleBtn.hidden = false;
    // Leave the final explanation visible before showing the level result automatically.
    state.finalResultTimer = window.setTimeout(showLevelResult, 7000);
  } else {
    elements.nextPuzzleBtn.textContent = "Weiter";
    elements.nextPuzzleBtn.hidden = false;
  }
}

function showLevelResult() {
  if (state.levelAnswered < levels[state.puzzleLevelIndex].questions.length) return;
  window.clearTimeout(state.finalResultTimer);
  const level = levels[state.puzzleLevelIndex];
  const total = level.questions.length;
  const percentage = Math.round((state.levelCorrect / total) * 100);

  elements.quizGame.hidden = true;
  elements.levelResult.hidden = false;
  elements.levelResultTitle.textContent = level.title;
  elements.levelScore.textContent = `${state.levelCorrect} von ${total}`;
  elements.levelPercentage.textContent = `${percentage} % richtig`;
  elements.levelCorrectCount.textContent = String(state.levelCorrect);
  elements.levelQuestionCount.textContent = String(total);

  if (percentage === 100) {
    elements.levelResultMessage.textContent = "Ausgezeichnet! Du hast dieses Level komplett fehlerfrei gelöst.";
  } else if (percentage >= 80) {
    elements.levelResultMessage.textContent = "Sehr gut! Du hast die meisten Aufgaben sicher gemeistert.";
  } else if (percentage >= 60) {
    elements.levelResultMessage.textContent = "Gut gemacht. Die Erklärungen helfen dir dabei, die Zusammenhänge noch klarer zu erkennen.";
  } else {
    elements.levelResultMessage.textContent = "Danke fürs Mitmachen. Nimm dir die Erklärungen in Ruhe vor und versuche es gern noch einmal.";
  }

  const isLastLevel = state.puzzleLevelIndex === levels.length - 1;
  elements.nextLevelBtn.hidden = isLastLevel;
  elements.nextLevelBtn.disabled = isLastLevel;
  elements.nextLevelBtn.textContent = isLastLevel ? "Alle Levels geschafft" : "Nächstes Level";
}

function continueQuiz() {
  if (state.levelAnswered >= levels[state.puzzleLevelIndex].questions.length) {
    showLevelResult();
    return;
  }
  state.puzzleQuestionIndex += 1;
  renderQuestion();
}

function replayCurrentLevel() {
  state.puzzleQuestionIndex = 0;
  state.levelCorrect = 0;
  state.levelAnswered = 0;
  elements.levelResult.hidden = true;
  elements.quizGame.hidden = false;
  renderQuestion();
}

function startNextLevel() {
  if (state.puzzleLevelIndex >= levels.length - 1) return;
  state.puzzleLevelIndex += 1;
  state.puzzleQuestionIndex = 0;
  state.levelCorrect = 0;
  state.levelAnswered = 0;
  elements.levelResult.hidden = true;
  elements.quizGame.hidden = false;
  renderQuestion();
}

function bindEvents() {
  elements.settingsToggle.addEventListener("click", () => {
    const opening = elements.settingsPanel.hidden;
    elements.settingsPanel.hidden = !opening;
    elements.settingsToggle.setAttribute("aria-expanded", String(opening));
  });
  elements.contrastToggle.addEventListener("click", () => { state.highContrast = !state.highContrast; updateSettings(); });
  elements.fontScale.addEventListener("input", (event) => { state.fontScale = Number(event.target.value); updateSettings(); });
  elements.startMemoryBtn.addEventListener("click", () => { resetMemoryScreen(); showScreen("memory"); });
  elements.memoryStartBtn.addEventListener("click", startMemoryRound);
  elements.memoryNextBtn.addEventListener("click", startMemoryRound);
  elements.startPuzzleBtn.addEventListener("click", startQuiz);
  elements.nextPuzzleBtn.addEventListener("click", continueQuiz);
  elements.nextLevelBtn.addEventListener("click", startNextLevel);
  elements.replayLevelBtn.addEventListener("click", replayCurrentLevel);
  elements.resultHomeBtn.addEventListener("click", () => showScreen("home"));

  document.querySelectorAll('[data-nav="home"]').forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      clearMemoryTimer();
      state.memoryLocked = true;
      window.clearTimeout(state.finalResultTimer);
      showScreen("home");
    });
  });
}

bindEvents();
updateSettings();
updateScoreboard();
showScreen("home");
