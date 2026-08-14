"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks/dispatch";
import { useAppSelector } from "@/hooks/selector";
import { playGame, reset } from "@/features/word/number.slice";
import { ChooseNumberAction } from "@/features/word/choose-number/choose-number.action";

export default function Home() {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState<number>(0);
  const { number, userGuess, result, isLoading } = useAppSelector(
    (state) => state.number,
  );

  const handleClick = (playerVal: number) => {
    dispatch(playGame(playerVal));
  };

  const handleReset = () => {
    dispatch(reset());
  };

  const handleSubmit = () => {
    dispatch(playGame(value));
  };

  useEffect(() => {
    dispatch(ChooseNumberAction());
  }, []);

  return (
    <>
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <div>
          <input
            type="number"
            placeholder="Enter a number"
            value={value==0? " " : value}
            onChange={(event) => setValue(Number(event.target.value))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleClick(Number(value));
              }
            }}
          />

          <button onClick={handleSubmit}>Submit</button>

          <div className="content">
            <p>Your choice: {userGuess}</p>
            <p>Computers choice: {number}</p>
            <h2>Result: {result}</h2>
          </div>

          <button onClick={handleReset}>Reset</button>
        </div>
      )}
    </>
  );
}
