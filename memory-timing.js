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
})();
