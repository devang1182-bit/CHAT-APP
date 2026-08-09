import { Board } from "../input-word-board.type";

const ROWS = 6;
const COLS = 5;

export const createEmptyBoard = (): Board => {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      letter: "",
      status: "empty" as const,
    }))
  );
};