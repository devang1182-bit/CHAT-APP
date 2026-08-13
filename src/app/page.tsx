"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/dispatch";
import { useAppSelector } from "@/hooks/selector";
import { ChooseWordAction } from "@/features/word/choose-word/choose-word.action";
import { playGame, reset } from "@/features/word/word.slice";

export default function Home() {
  const dispatch = useAppDispatch();
  const choices = ["ROCK", "PAPER", "SCISSORS"];

  const { word, isLoading, error, playerVal, playerScore, compScore } =
    useAppSelector((state) => state.word);

  const handleClick = (playerVal: string) => {
    dispatch(playGame(playerVal));
  };

  const handleReset = () => {
    dispatch(reset());
  }


  useEffect(() => {
      dispatch(ChooseWordAction());
  }, [playerVal]);

  return (
    <>
      {choices.map((item, index) => (
        <button key={index} onClick={() => handleClick(item)}>{item}</button>
      ))}

      <div className="content">
        <p>Your choice: {playerVal}</p>
        <p>Computers choice: {word}</p>
        <h2>Your Score:{playerScore}</h2>
        <h2>Computer Score: {compScore}</h2>
      </div>


      <button onClick={handleReset}>Reset</button>
    </>
  );
}
