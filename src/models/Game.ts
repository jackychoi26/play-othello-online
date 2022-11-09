import FixedLengthArray from '../common/FixedLengthArray';
import Position from './Position';
import PossibleMove from './PossibleMove';
import SquareState from './SquareState';

export default class Game {
  readonly possibleMoves: PossibleMove[] = [];

  private isCurrentPlayerBlack = true;

  // In SquareState
  // 0 = empty
  // 1 = black
  // 2 = white
  constructor(private grid: SquareState[][]) {}

  static create = (size: number): Game => {
    const row: SquareState[] = [];
    let column: SquareState[][] = [];

    for (let _ = 0; _ < size; _++) {
      row.push(SquareState.empty);
    }

    for (let _ = 0; _ < size; _++) {
      column.push(row.slice());
    }

    column[3][3] = SquareState.white;
    column[4][4] = SquareState.white;

    column[4][3] = SquareState.black;
    column[3][4] = SquareState.black;

    return new Game(column);
  };

  currentState = (): SquareState[][] => {
    return this.grid;
  };

  placeDisc = (position: Position) => {
    const rowIndex = position.rowIndex;
    const columnIndex = position.columnIndex;
    const square = this.grid[rowIndex][columnIndex];
    if (square !== SquareState.empty) return;

    console.log(this.canFlipDiagonally(position));

    this.grid[rowIndex][columnIndex] = this.getCurrentPlayerColor();
    this.isCurrentPlayerBlack = !this.isCurrentPlayerBlack;
  };

  private updateaPossibleMoves = () => {};

  private isLegalMove = (position: Position): boolean => {
    return this.canFlipVertically(position);
    // return true;
  };

  private canFlipHorizontally = (
    rowIndex: number,
    columnIndex: number
  ): boolean => {
    const row = this.grid[rowIndex];
    const attemptedMove = row[columnIndex];
    if (attemptedMove !== SquareState.empty) return false;

    let opponentPlayerColor = this.getOpponentPlayerColor();
    let currentPlayerColor = this.getCurrentPlayerColor();

    if (row[columnIndex - 1] === opponentPlayerColor) {
      for (let i = columnIndex - 1; i >= 0; i--) {
        if (row[i] === SquareState.empty) break;
        if (row[i] === currentPlayerColor) return true;
      }
    }

    if (row[columnIndex + 1] === opponentPlayerColor) {
      for (let i = columnIndex + 1; i < row.length; i++) {
        console.log(currentPlayerColor);
        if (row[i] === SquareState.empty) break;
        if (row[i] === currentPlayerColor) return true;
      }
    }

    return false;
  };

  private canFlipVertically = (position: Position): boolean => {
    const rowIndex = position.rowIndex;
    const columnIndex = position.columnIndex;
    const attemptedMove = this.grid[rowIndex][columnIndex];
    if (attemptedMove !== SquareState.empty) return false;

    let opponentPlayerColor = this.getOpponentPlayerColor();
    let currentPlayerColor = this.getCurrentPlayerColor();

    if (this.grid[rowIndex - 1]?.[columnIndex] === opponentPlayerColor) {
      for (let i = rowIndex - 1; i >= 0; i--) {
        if (this.grid[i]?.[columnIndex] === SquareState.empty) break;
        if (this.grid[i]?.[columnIndex] === currentPlayerColor) return true;
      }
    }

    if (this.grid[rowIndex + 1]?.[columnIndex] === opponentPlayerColor) {
      for (let i = rowIndex + 1; i < this.grid.length; i++) {
        if (this.grid[i]?.[columnIndex] === SquareState.empty) break;
        if (this.grid[i]?.[columnIndex] === currentPlayerColor) return true;
      }
    }

    return false;
  };

  private canFlipDiagonally = (position: Position) => {
    const rowIndex = position.rowIndex;
    const columnIndex = position.columnIndex;
    const attemptedMove = this.grid[rowIndex][columnIndex];
    if (attemptedMove !== SquareState.empty) return false;

    let opponentPlayerColor = this.getOpponentPlayerColor();
    let currentPlayerColor = this.getCurrentPlayerColor();

    if (this.grid[rowIndex - 1]?.[columnIndex - 1] === opponentPlayerColor) {
      for (
        let i = rowIndex - 1, j = columnIndex - 1;
        i >= 0 && j >= 0;
        i--, j--
      ) {
        if (this.grid[i]?.[j] === SquareState.empty) break;
        if (this.grid[i]?.[j] === currentPlayerColor) return true;
      }
    }

    if (this.grid[rowIndex - 1]?.[columnIndex + 1] === opponentPlayerColor) {
      for (
        let i = rowIndex - 1, j = columnIndex + 1;
        i >= 0 && j < this.grid.length;
        i--, j++
      ) {
        if (this.grid[i]?.[j] === SquareState.empty) break;
        if (this.grid[i]?.[j] === currentPlayerColor) return true;
      }
    }

    if (this.grid[rowIndex + 1]?.[columnIndex + 1] === opponentPlayerColor) {
      for (
        let i = rowIndex + 1, j = columnIndex + 1;
        i < this.grid[rowIndex].length && j < this.grid.length;
        i++, j++
      ) {
        if (this.grid[i]?.[j] === SquareState.empty) break;
        if (this.grid[i]?.[j] === currentPlayerColor) return true;
      }
    }

    if (this.grid[rowIndex + 1]?.[columnIndex - 1] === opponentPlayerColor) {
      for (
        let i = rowIndex + 1, j = columnIndex - 1;
        i < this.grid[rowIndex].length && j >= 0;
        i++, j--
      ) {
        if (this.grid[i]?.[j] === SquareState.empty) break;
        if (this.grid[i]?.[j] === currentPlayerColor) return true;
      }
    }

    return false;
  };

  private getCurrentPlayerColor = (): SquareState => {
    return this.isCurrentPlayerBlack ? SquareState.black : SquareState.white;
  };

  private getOpponentPlayerColor = (): SquareState => {
    return this.isCurrentPlayerBlack ? SquareState.white : SquareState.black;
  };

  private flip = () => {};
}
