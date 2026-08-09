import { TileStatus } from "../input-word-board.type";

const COLS = 5;

export const checkGuess = (
  guess: string,
  target: string
): TileStatus[] => {
  const result: TileStatus[] = Array(COLS).fill("absent");

  const remainingLetters: Record<string, number> = {};
  for (const letter of target) {
    remainingLetters[letter] =
      (remainingLetters[letter] || 0) + 1;
  }

  for (let i = 0; i < COLS; i++) {
    if (guess[i] === target[i]) {
      result[i] = "correct";

      remainingLetters[guess[i]]--;
    }
  }


  for (let i = 0; i < COLS; i++) {
    if (result[i] === "correct") {
      continue;
    }

    const letter = guess[i];

    if (remainingLetters[letter] > 0) {
      result[i] = "present";

      remainingLetters[letter]--;
    }
  }

  return result;
};