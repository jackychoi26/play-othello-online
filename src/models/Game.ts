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

    console.log(this.canFlipHorizontally(this.grid[rowIndex], columnIndex));

    this.grid[rowIndex][columnIndex] = this.getCurrentPlayerColor();
    this.isCurrentPlayerBlack = !this.isCurrentPlayerBlack;
  };

  private updateaPossibleSquares = () => {};

  private isLegalMove = (rowIndex: number, columnIndex: number): boolean => {
    return true;
  };

  private canFlipHorizontally = (row: SquareEnum[], index: number): boolean => {
    const player = row[index];
    if (player !== SquareEnum.empty) return false;

    let opponentPlayerColor = this.getOpponentPlayerColor();
    let currentPlayerColor = this.getCurrentPlayerColor();

    if (row[index - 1] === opponentPlayerColor) {
      for (let i = index - 1; i >= 0; i--) {
        if (row[i] === SquareEnum.empty) break;
        if (row[i] === currentPlayerColor) return true;
      }
    }

    if (row[index + 1] === opponentPlayerColor) {
      for (let i = index + 1; i < row.length; i++) {
        console.log(currentPlayerColor);
        if (row[i] === SquareEnum.empty) break;
        if (row[i] === currentPlayerColor) return true;
      }
    }

    return false;
  };

  private getCurrentPlayerColor = (): SquareEnum => {
    return this.isCurrentPlayerBlack ? SquareEnum.black : SquareEnum.white;
  };

  private getOpponentPlayerColor = (): SquareEnum => {
    return this.isCurrentPlayerBlack ? SquareEnum.white : SquareEnum.black;
  };
}
