import { Dispatch, SetStateAction } from "react";
import { Board } from "../input-word-board.type";

const COLS = 5;

interface HandleLetterParams {
  letter: string;
  currentRow: number;
  currentCol: number;
  setBoard: Dispatch<SetStateAction<Board>>;
  setCurrentCol: Dispatch<SetStateAction<number>>;
  setMessage: Dispatch<SetStateAction<string>>;
}

export const handleLetter = ({
  letter,
  currentRow,
  currentCol,
  setBoard,
  setCurrentCol,
  setMessage,
}: HandleLetterParams) => {
  if (currentCol >= COLS) {
    return;
  }

  setBoard((previousBoard) => {
    const newBoard = previousBoard.map((row) =>
      row.map((tile) => ({ ...tile }))
    );

    newBoard[currentRow][currentCol] = {
      letter: letter.toLowerCase(),
      status: "empty",
    };

    return newBoard;
  });

  setCurrentCol((previousCol) => previousCol + 1);

  setMessage("");
};