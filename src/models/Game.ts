import SquareEnum from './SquareEnum';

export default class Game {
  private isBlack = true;

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

  makeMove = (row: number, column: number) => {
    const square = this.grid[row][column];
    if (square !== SquareEnum.empty) return;

    this.grid[row][column] = this.isBlack ? SquareEnum.black : SquareEnum.white;
    this.isBlack = !this.isBlack;
  };
}
