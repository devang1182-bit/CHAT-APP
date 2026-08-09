"use client";

import { useEffect } from "react";

import InputWordBoard from "@/components/input-word-board/input-word-board";

import { useAppDispatch } from "@/hooks/dispatch";
import { useAppSelector } from "@/hooks/selector";

import { ChooseWordAction } from "@/features/choose-word/choose-word.action";

export default function Home() {
  const dispatch = useAppDispatch();

  const {
    word,
    isLoading,
    error,
  } = useAppSelector((state) => state.targetWord);

  useEffect(() => {
    if (!word && !isLoading) {
      dispatch(ChooseWordAction());
    }
  }, [dispatch, word, isLoading]);

  useEffect(() => {
    if (word) {
      console.log("Target word:", word);
    }
  }, [word]);

  if (isLoading) {
    return <div>Choosing word...</div>;
  }

  if (error) {
    return (
      <div>
        Failed to choose word: {error}
      </div>
    );
  }

  if (!word) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <InputWordBoard />
    </>
  );
}