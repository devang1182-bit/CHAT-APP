export type TileStatus =
  | "empty"
  | "correct"
  | "present"
  | "absent";

export interface Tile {
  letter: string;
  status: TileStatus;
}

export type Board = Tile[][];

export interface InputWordBoardProps {
  targetWord: string;
}