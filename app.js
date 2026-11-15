:root {
  --bg: #f4f1ea;
  --panel: #fffdf8;
  --card: #f0e9dc;
  --primary: #1f5f8b;
  --primary-strong: #123d5b;
  --accent: #d98d46;
  --text: #1d1d1d;
  --muted: #4d4d4d;
  --success: #2f7d4b;
  --danger: #b13a32;
  --shadow: rgba(20, 20, 20, 0.12);
}

body.high-contrast {
  --bg: #111111;
  --panel: #1d1d1d;
  --card: #2a2a2a;
  --primary: #9cd3ff;
  --primary-strong: #d8eeff;
  --accent: #ffd166;
  --text: #f7f7f7;
  --muted: #d4d4d4;
  --success: #7fe8a2;
  --danger: #ff9c90;
  --shadow: rgba(0, 0, 0, 0.3);
}

* {
  box-sizing: border-box;
}

html {
  font-size: 100%;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.5;
  transition: background 0.2s ease, color 0.2s ease;
}

button,
input {
  font: inherit;
}

button {
  cursor: pointer;
}

.app-shell {
  max-width: 980px;
  margin: 0 auto;
  padding: 1.25rem;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.eyebrow {
  margin: 0;
  color: var(--muted);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.8rem;
}

h1,
h2,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 0;
  font-size: clamp(2rem, 4vw, 3rem);
}

h2 {
  font-size: clamp(1.6rem, 2vw, 2.2rem);
}

.panel,
.settings-panel {
  background: var(--panel);
  border-radius: 18px;
  padding: 1.25rem;
  box-shadow: 0 8px 24px var(--shadow);
}

.settings-panel {
  margin-bottom: 1rem;
}

.hidden {
  display: none;
}

.panel {
  display: none;
}

.panel.active {
  display: block;
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(140px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.quick-stats > div {
  background: var(--card);
  border-radius: 16px;
  padding: 1rem;
  text-align: center;
}

.quick-stats span {
  display: block;
  color: var(--muted);
  margin-bottom: 0.5rem;
}

.quick-stats strong {
  font-size: 2rem;
}

.button-row,
.settings-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.primary-btn,
.secondary-btn,
.option-btn,
.memory-card {
  border: none;
  border-radius: 14px;
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.primary-btn,
.secondary-btn {
  min-height: 52px;
  padding: 0.8rem 1.1rem;
  font-weight: 700;
}

.primary-btn {
  background: var(--primary);
  color: #fff;
}

.secondary-btn {
  background: var(--card);
  color: var(--text);
}

.primary-btn:hover,
.secondary-btn:hover,
.option-btn:hover,
.memory-card:hover {
  transform: translateY(-1px);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.instruction,
.question,
.feedback,
.status-box {
  font-size: 1.1rem;
}

.memory-sequence {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  min-height: 56px;
  margin: 1rem 0;
}

.memory-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--primary);
  color: #fff;
  font-size: 1.8rem;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.8rem;
  margin-top: 1rem;
}

.memory-card {
  min-height: 86px;
  font-size: 2rem;
  background: var(--card);
  color: var(--text);
  border: 3px solid transparent;
}

.memory-card.selected {
  border-color: var(--accent);
  background: #e9f1fa;
}

.memory-card.correct {
  background: rgba(47, 125, 75, 0.18);
  border-color: var(--success);
}

.memory-card.wrong {
  background: rgba(177, 58, 50, 0.14);
  border-color: var(--danger);
}

.status-box {
  margin-top: 1rem;
  padding: 0.9rem 1rem;
  background: var(--card);
  border-radius: 12px;
}

.puzzle-card {
  padding: 0.5rem 0;
}

.option-list {
  display: grid;
  gap: 0.75rem;
  margin-top: 1rem;
}

.option-btn {
  width: 100%;
  text-align: left;
  padding: 0.9rem 1rem;
  background: var(--card);
  color: var(--text);
  min-height: 54px;
  font-size: 1.05rem;
}

.feedback {
  min-height: 1.8em;
  margin-top: 1rem;
  font-weight: 700;
}

.success {
  color: var(--success);
}

.error {
  color: var(--danger);
}

@media (max-width: 600px) {
  .app-shell {
    padding: 0.9rem;
  }

  .topbar,
  .panel-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .button-row {
    flex-direction: column;
  }

  .primary-btn,
  .secondary-btn {
    width: 100%;
  }
}
