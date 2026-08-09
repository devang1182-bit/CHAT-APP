import { Dispatch, SetStateAction } from "react";
import { Board } from "../input-word-board.type";

interface HandleBackspaceParams {
  currentRow: number;
  currentCol: number;
  setBoard: Dispatch<SetStateAction<Board>>;
  setCurrentCol: Dispatch<SetStateAction<number>>;
  setMessage: Dispatch<SetStateAction<string>>;
}

export const handleBackspace = ({
  currentRow,
  currentCol,
  setBoard,
  setCurrentCol,
  setMessage,
}: HandleBackspaceParams) => {
  if (currentCol === 0) {
    return;
  }

  setBoard((previousBoard) => {
    const newBoard = previousBoard.map((row) =>
      row.map((tile) => ({ ...tile }))
    );

    newBoard[currentRow][currentCol - 1] = {
      letter: "",
      status: "empty",
    };

    return newBoard;
  });

  setCurrentCol((previousCol) => previousCol - 1);

  setMessage("");
};