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

    console.log(this.canFlipVertically(rowIndex, columnIndex));

    this.grid[rowIndex][columnIndex] = this.getCurrentPlayerColor();
    this.isCurrentPlayerBlack = !this.isCurrentPlayerBlack;
  };

  private updateaPossibleSquares = () => {};

  private isLegalMove = (rowIndex: number, columnIndex: number): boolean => {
    return this.canFlipVertically(rowIndex, columnIndex);
    // return true;
  };

  private canFlipHorizontally = (
    rowIndex: number,
    columnIndex: number
  ): boolean => {
    const row = this.grid[rowIndex];
    const attemptedMove = row[columnIndex];
    if (attemptedMove !== SquareEnum.empty) return false;

    let opponentPlayerColor = this.getOpponentPlayerColor();
    let currentPlayerColor = this.getCurrentPlayerColor();

    if (row[columnIndex - 1] === opponentPlayerColor) {
      for (let i = columnIndex - 1; i >= 0; i--) {
        if (row[i] === SquareEnum.empty) break;
        if (row[i] === currentPlayerColor) return true;
      }
    }

    if (row[columnIndex + 1] === opponentPlayerColor) {
      for (let i = columnIndex + 1; i < row.length; i++) {
        console.log(currentPlayerColor);
        if (row[i] === SquareEnum.empty) break;
        if (row[i] === currentPlayerColor) return true;
      }
    }

    return false;
  };

  private canFlipVertically = (
    rowIndex: number,
    columnIndex: number
  ): boolean => {
    const attemptedMove = this.grid[rowIndex][columnIndex];
    if (attemptedMove !== SquareEnum.empty) return false;

    let opponentPlayerColor = this.getOpponentPlayerColor();
    let currentPlayerColor = this.getCurrentPlayerColor();

    if (this.grid[rowIndex - 1]?.[columnIndex] === opponentPlayerColor) {
      for (let i = rowIndex - 1; i >= 0; i--) {
        if (this.grid[i][columnIndex] === SquareEnum.empty) break;
        if (this.grid[i][columnIndex] === currentPlayerColor) return true;
      }
    }

    if (this.grid[rowIndex + 1]?.[columnIndex] === opponentPlayerColor) {
      for (let i = rowIndex + 1; i < this.grid.length; i++) {
        if (this.grid[i][columnIndex] === SquareEnum.empty) break;
        if (this.grid[i][columnIndex] === currentPlayerColor) return true;
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
