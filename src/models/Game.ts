import FixedLengthArray from '../common/FixedLengthArray';
import SquareEnum from './SquareEnum';

export default class Game {
  // If you want to show the options to UI, expose this property using readonly keyword
  readonly possibleSquares: FixedLengthArray<[SquareEnum, SquareEnum]>[] = [];

  private isCurrentPlayerBlack = true;

  // In SquareEnum
  // 0 = empty
  // 1 = black
  // 2 = white
  constructor(private grid: SquareEnum[][]) {}

  static create = (size: number): Game => {
    const row: SquareEnum[] = [];
    let column: SquareEnum[][] = [];

    for (let _ = 0; _ < size; _++) {
      row.push(SquareEnum.empty);
    }

    for (let _ = 0; _ < size; _++) {
      column.push(row.slice());
    }

    column[3][3] = SquareEnum.white;
    column[4][4] = SquareEnum.white;

    column[4][3] = SquareEnum.black;
    column[3][4] = SquareEnum.black;

    return new Game(column);
  };

  currentState = (): SquareEnum[][] => {
    return this.grid;
  };

  placeDisc = (rowIndex: number, columnIndex: number) => {
    const square = this.grid[rowIndex][columnIndex];
    if (square !== SquareEnum.empty) return;

    this.grid[rowIndex][columnIndex] = this.isCurrentPlayerBlack
      ? SquareEnum.black
      : SquareEnum.white;
    this.isCurrentPlayerBlack = !this.isCurrentPlayerBlack;
  };

  private updateaPossibleSquares = () => {};

  private isLegalMove = (rowIndex: number, columnIndex: number): boolean => {
    return true;
  };

  private canFlipHorizontally = (row: SquareEnum[], index: number): boolean => {
    const player = row[index];
    if (player !== SquareEnum.empty) return false;

    let discToFlip = this.isCurrentPlayerBlack
      ? SquareEnum.white
      : SquareEnum.black;

    if (row[index - 1] === discToFlip) {
    }
    if (row[index + 1] === discToFlip) {
    }

    return false;
  };
}
