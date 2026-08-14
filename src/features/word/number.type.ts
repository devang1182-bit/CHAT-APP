export interface INumber {
  number: number | null;
  userGuess : number | null;
  error: string | undefined;
  isLoading: boolean;
  result : string | null;
}
