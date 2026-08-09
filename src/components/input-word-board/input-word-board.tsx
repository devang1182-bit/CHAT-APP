"use client";

import { useCallback, useEffect, useState } from "react";

import { useAppDispatch } from "@/hooks/dispatch";
import { useAppSelector } from "@/hooks/selector";

import { VerifyWordAction } from "@/features/verify-word/verify-word.action";

import { createEmptyBoard } from "./components/create-empty-board";
import { checkGuess } from "./components/check-guess";
import { handleKeyboard } from "./components/handle-keyboard";
import { handleBackspace } from "./components/handle-backspace";
import { handleLetter } from "./components/handle-letter";

import { Board } from "./input-word-board.type";

const ROWS = 6;
const COLS = 5;

export default function InputWordBoard() {
  const dispatch = useAppDispatch();

  const targetWord = useAppSelector(
    (state) => state.targetWord.word
  );
  console.log("targetWord:", targetWord);
console.log("type:", typeof targetWord);

  const [board, setBoard] = useState<Board>(
    createEmptyBoard
  );

  const [currentRow, setCurrentRow] = useState(0);

  const [currentCol, setCurrentCol] = useState(0);

  const [message, setMessage] = useState("");

  const [isChecking, setIsChecking] = useState(false);

 const handleSubmit = useCallback(async () => {
  if (isChecking) {
    return;
  }

  if (currentRow >= ROWS) {
    return;
  }

  if (!targetWord) {
    setMessage("Target word is not available");
    return;
  }

  const currentRowData = board[currentRow];

  const isRowComplete = currentRowData.every(
    (tile) => tile.letter !== ""
  );

  if (!isRowComplete) {
    setMessage("Enter 5 letters");
    return;
  }

  const guess = currentRowData
    .map((tile) => tile.letter)
    .join("")
    .toLowerCase();

  setIsChecking(true);
  setMessage("");

  try {
    const isValidWord = await dispatch(
      VerifyWordAction(guess)
    ).unwrap();

    if (!isValidWord) {
      setMessage("Not a valid word");
      setIsChecking(false);
      return;
    }

    console.log("Target inside submit:", targetWord);
    console.log(
      "Target type inside submit:",
      typeof targetWord
    );

    const normalizedTarget =
      String(targetWord).toLowerCase();

    console.log(
      "Normalized target:",
      normalizedTarget
    );

    const result = checkGuess(
      guess,
      normalizedTarget
    );

    setBoard((previousBoard) => {
      const newBoard = previousBoard.map((row) =>
        row.map((tile) => ({ ...tile }))
      );

      for (let i = 0; i < COLS; i++) {
        newBoard[currentRow][i].status = result[i];
      }

      return newBoard;
    });

    if (guess === normalizedTarget) {
      setMessage("You won! 🎉");
      setIsChecking(false);
      return;
    }

    if (currentRow === ROWS - 1) {
      setMessage(
        `Game Over! Word was ${normalizedTarget}`
      );

      setIsChecking(false);
      return;
    }

    setCurrentRow(
      (previousRow) => previousRow + 1
    );

    setCurrentCol(0);
    setIsChecking(false);

  } catch (error) {
    console.error("Submit error:", error);

    setMessage(
      "Something went wrong. Please try again."
    );

    setIsChecking(false);
  }
}, [
  board,
  currentRow,
  targetWord,
  isChecking,
  dispatch,
]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      handleKeyboard({
        event,
        isChecking,

        handleSubmit,

        handleBackspace: () => {
          handleBackspace({
            currentRow,
            currentCol,
            setBoard,
            setCurrentCol,
            setMessage,
          });
        },

        handleLetter: (letter: string) => {
          handleLetter({
            letter,
            currentRow,
            currentCol,
            setBoard,
            setCurrentCol,
            setMessage,
          });
        },
      });
    };

    window.addEventListener(
      "keydown",
      onKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        onKeyDown
      );
    };
  }, [
    currentRow,
    currentCol,
    isChecking,
    handleSubmit,
  ]);

  return (
    <div>
      <div className="board">
        {board.map((row, rowIndex) => (
          <div
            className="row"
            key={rowIndex}
          >
            {row.map((tile, colIndex) => (
              <div
                className={`tile ${tile.status}`}
                key={colIndex}
              >
                {tile.letter.toUpperCase()}
              </div>
            ))}
          </div>
        ))}
      </div>

      {message && (
        <p className="message">
          {message}
        </p>
      )}

      {isChecking && (
        <p className="checking">
          Checking...
        </p>
      )}
    </div>
  );
}