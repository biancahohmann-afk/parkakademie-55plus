"use strict";

// The memory game decrements its own countdown once per interval tick. Adjust
// the tick duration using the number of visible items so each item gets about
// four seconds to memorize, without making short sequences feel too long.
(() => {
  const originalSetInterval = window.setInterval.bind(window);

  window.setInterval = (callback, delay, ...args) => {
    const itemCount = document.querySelectorAll("#memorySequence .memory-chip").length;
    const statusText = document.getElementById("memoryStatus")?.textContent || "";
    const countdownMatch = statusText.match(/Noch (\d+) Sekunden/);

    if (typeof callback !== "function" || delay !== 1000 || itemCount === 0 || !countdownMatch) {
      return originalSetInterval(callback, delay, ...args);
    }

    const countdownTicks = Number(countdownMatch[1]);
    const targetSeconds = Math.min(40, Math.max(10, itemCount * 4));
    const tickDuration = (targetSeconds * 1000) / countdownTicks;
    let ticksRemaining = countdownTicks;

    return originalSetInterval(() => {
      callback(...args);
      ticksRemaining -= 1;

      // The app updates the text in whole countdown ticks. Replace that display
      // with the estimated real seconds remaining after adjusting tick length.
      if (ticksRemaining > 0 && itemCount > 0) {
        const status = document.getElementById("memoryStatus");
        if (status && /Noch \d+ Sekunden/.test(status.textContent)) {
          const secondsRemaining = Math.ceil((ticksRemaining * tickDuration) / 1000);
          status.textContent = `Schau dir die Reihenfolge in Ruhe an. Noch ${secondsRemaining} Sekunden.`;
        }
      }
    }, tickDuration, ...args);
  };

  // Track ten memory tasks per visit to the exercise. A task counts whether it
  // was answered correctly or incorrectly; after task ten the exercise stops.
  const taskLimit = 10;
  let tasksCompleted = 0;
  let correctTasks = 0;
  let roundActive = false;

  function updateTaskNotice(notice) {
    const remaining = taskLimit - tasksCompleted;
    if (tasksCompleted >= taskLimit) {
      notice.textContent = `Ergebnis: ${correctTasks} von ${taskLimit} Aufgaben richtig, ${taskLimit - correctTasks} falsch. Die Runde ist beendet.`;
      return;
    }
    notice.textContent = tasksCompleted === 0
      ? `Noch ${remaining} von ${taskLimit} Aufgaben zu lösen.`
      : `Aufgabe ${tasksCompleted} von ${taskLimit} abgeschlossen – noch ${remaining} zu lösen.`;
  }

  function setupTaskLimit() {
    const status = document.getElementById("memoryStatus");
    const memoryScreen = document.getElementById("memoryScreen");
    if (!status || !memoryScreen) return;

    const notice = document.createElement("p");
    notice.className = "memory-task-notice";
    notice.setAttribute("role", "status");
    notice.setAttribute("aria-live", "polite");
    notice.style.margin = "0 0 16px";
    notice.style.fontSize = "0.9em";
    notice.style.fontWeight = "700";
    notice.style.color = "#4e4e4e";
    const feedbackBox = status.closest(".feedback-box");
    const actionRow = feedbackBox?.nextElementSibling;
    if (actionRow) memoryScreen.insertBefore(notice, actionRow);
    else memoryScreen.appendChild(notice);
    updateTaskNotice(notice);

    document.getElementById("startMemoryBtn")?.addEventListener("click", () => {
      tasksCompleted = 0;
      correctTasks = 0;
      roundActive = false;
      updateTaskNotice(notice);
    }, true);

    const observer = new MutationObserver(() => {
      const text = status.textContent || "";
      if (/Noch \d+ Sekunden/.test(text)) {
        roundActive = true;
        return;
      }

      if (!roundActive || tasksCompleted >= taskLimit) return;
      const isCorrect = text.startsWith("Richtig!");
      const isIncorrect = text.startsWith("Das war nicht ganz");
      if (!isCorrect && !isIncorrect) return;

      roundActive = false;
      tasksCompleted += 1;
      if (isCorrect) correctTasks += 1;
      updateTaskNotice(notice);

      if (tasksCompleted === taskLimit) {
        const nextButton = document.getElementById("memoryNextBtn");
        if (nextButton) {
          nextButton.hidden = true;
          nextButton.disabled = true;
        }
        status.textContent = "Die zehn Aufgaben sind geschafft. Sieh dir unten dein Ergebnis an.";
      }
    });
    observer.observe(status, { childList: true, characterData: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupTaskLimit, { once: true });
  } else {
    setupTaskLimit();
  }
})();
