export interface IWord {
  word: string | null;
  playerVal: string|null;
  playerScore: number;
  compScore: number;
  error: string | undefined;
  isLoading: boolean;
}
