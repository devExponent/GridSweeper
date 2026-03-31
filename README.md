# 💣 GridSweep

A modern Minesweeper game built with React, TypeScript, and Tailwind CSS.

---

## Tech Stack

- React 18 + TypeScript
- Tailwind CSS
- Vite

---

## Getting Started

```bash
git clone https://github.com/devExponent/GridSweeper.git
cd GridSweeper
npm install
npm run dev
```

---

## How to Play

| Input | Action |
|---|---|
| Left-click / Tap | Reveal cell |
| Right-click | Flag / unflag a mine |
| Arrow keys | Navigate with keyboard |
| `Enter` / `Space` | Reveal focused cell |
| `F` | Flag focused cell |
| `R` | Restart game |

Reveal all safe cells without hitting a mine to win. First click is always safe.

---

## Features

- 10×10 grid with 10 mines
- Flood-fill reveal for empty regions
- Safe first-click guarantee
- Live timer and move counter
- Sound effects via Web Audio API
- Mouse, keyboard, and touch support
- Animated win/lose modal
