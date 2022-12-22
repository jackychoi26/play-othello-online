import Voidable from '../common/Voidable';
import Direction from './Direction';
import DiscsSum from './DiscsSum';
import FlipDirection from './FlipDirection';
import Player from './Player';
import Position from './Position';
import PossibleMove from './PossibleMove';
import SquareState from './SquareState';

export default class Grid {
  private size: number;
  private possibleMoves: PossibleMove[];
  private currentPlayer: Player = Player.Black;

  static create = (size: number = 8): Grid => {
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

    return new Grid(column);
  };

  private constructor(private grid: SquareState[][]) {
    this.grid = grid;
    this.size = grid.length;
    this.possibleMoves = this._getPossibleMoves(this.currentPlayer);
  }

  clone = (): Grid => {
    return new Grid(this.grid.map(row => row.slice()));
  };

  getGrid = (): SquareState[][] => this.grid;

  boardSize = (): number => this.size;

  getCurrentPlayer = (): Player => this.currentPlayer;

  isGameOver = (): boolean => {
    const blackMobility = this._getPossibleMoves(Player.Black);
    const whiteMobility = this._getPossibleMoves(Player.White);
    return blackMobility.length === 0 && whiteMobility.length === 0;
  };

  placeDisc = (position: Position): boolean => {
    const possibleMove = this.possibleMoves.find(possibleMove =>
      possibleMove.position.isEqualTo(position)
    );

    if (!possibleMove) return false;

    this.flip(possibleMove, this.currentPlayer);

    return true;
  };

  numberOfDiscs = (): DiscsSum => {
    let numberOfBlackDisc = 0;
    let numberOfWhiteDisc = 0;

    for (let row of this.grid) {
      for (let square of row) {
        if (square === SquareState.black) {
          numberOfBlackDisc++;
        } else if (square === SquareState.white) {
          numberOfWhiteDisc++;
        }
      }
    }

    return new DiscsSum(numberOfBlackDisc, numberOfWhiteDisc);
  };

  getPossibleMoves = (): PossibleMove[] => this.possibleMoves;

  private _getPossibleMoves = (player: Player): PossibleMove[] => {
    const possibleMoves: PossibleMove[] = [];
    const emptySquaresAdjacentToDisc = this.getAllEmptySquaresAdjacentToDisc();

    emptySquaresAdjacentToDisc.forEach(square => {
      const flipDirections = this.getFlipDirections(square, player);

      if (flipDirections.length > 0) {
        possibleMoves.push(new PossibleMove(square, flipDirections));
      }
    });

    return possibleMoves;
  };

  isPositionEmpty = (position: Position): boolean => {
    return (
      this.grid[position.rowIndex]?.[position.columnIndex] === SquareState.empty
    );
  };

  isPositionEmptyByIndex = (rowIndex: number, columnIndex: number): boolean => {
    return this.grid[rowIndex]?.[columnIndex] === SquareState.empty;
  };

  getSquareByPosition = (position: Position): Voidable<SquareState> => {
    return this.getSquareByIndex(position.rowIndex, position.columnIndex);
  };

  getSquareByIndex = (
    rowIndex: number,
    columnIndex: number
  ): Voidable<SquareState> => {
    return this.grid[rowIndex]?.[columnIndex];
  };

  private getFlipDirections = (
    position: Position,
    player: Player
  ): FlipDirection[] => {
    const flipDirectionArray = this.diagonalFlipDirections(position, player)
      .concat(this.horizontalFlipDirections(position, player))
      .concat(this.verticalFlipDirections(position, player));

    return Array.from(new Set(flipDirectionArray));
  };

  private getAllEmptySquaresAdjacentToDisc = (): Position[] => {
    const emptySquaresAdjacentToDisc = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (!this.isPositionEmptyByIndex(i, j)) {
          continue;
        }

        if (
          !this.isPositionEmptyByIndex(i + 1, j + 1) ||
          !this.isPositionEmptyByIndex(i + 1, j - 1) ||
          !this.isPositionEmptyByIndex(i - 1, j - 1) ||
          !this.isPositionEmptyByIndex(i - 1, j + 1) ||
          !this.isPositionEmptyByIndex(i + 1, j) ||
          !this.isPositionEmptyByIndex(i - 1, j) ||
          !this.isPositionEmptyByIndex(i, j + 1) ||
          !this.isPositionEmptyByIndex(i, j - 1)
        ) {
          emptySquaresAdjacentToDisc.push(new Position(i, j));
        }
      }
    }

    return emptySquaresAdjacentToDisc;
  };

  private updateSquare = (
    position: Position,
    squareState: SquareState
  ): void => {
    if (this.grid[position.rowIndex]?.[position.columnIndex]) {
      this.grid[position.rowIndex][position.columnIndex] = squareState;
    }
  };

  private flip = (possibleMove: PossibleMove, player: Player) => {
    this.updateSquare(possibleMove.position, player.selfDisc());

    for (let flipDirection of possibleMove.flipDirections) {
      flipDirection.positions.forEach(position => {
        this.updateSquare(position, player.selfDisc());
      });
    }
  };

  private horizontalFlipDirections = (
    position: Position,
    player: Player
  ): FlipDirection[] => {
    const flipDirections: FlipDirection[] = [];
    const leftFlippablePositions = this.traverseLeft(position, player);

    if (leftFlippablePositions.length > 0) {
      flipDirections.push(
        new FlipDirection(Direction.left, leftFlippablePositions)
      );
    }

    const rightFlippablePositions = this.traverseRight(position, player);

    if (rightFlippablePositions.length > 0) {
      flipDirections.push(
        new FlipDirection(Direction.right, rightFlippablePositions)
      );
    }

    return flipDirections;
  };

  private verticalFlipDirections = (
    position: Position,
    player: Player
  ): FlipDirection[] => {
    const flipDirections: FlipDirection[] = [];
    const topFlippablePositions = this.traverseTop(position, player);

    if (topFlippablePositions.length > 0) {
      flipDirections.push(
        new FlipDirection(Direction.top, topFlippablePositions)
      );
    }

    const bottomFlippablePositions = this.traverseBottom(position, player);

    if (bottomFlippablePositions.length > 0) {
      flipDirections.push(
        new FlipDirection(Direction.bottom, bottomFlippablePositions)
      );
    }

    return flipDirections;
  };

  private diagonalFlipDirections = (
    position: Position,
    player: Player
  ): FlipDirection[] => {
    const flipDirections: FlipDirection[] = [];
    const topLeftFlippablePositions = this.traverseTopLeft(position, player);

    if (topLeftFlippablePositions.length > 0) {
      flipDirections.push(
        new FlipDirection(Direction.topLeft, topLeftFlippablePositions)
      );
    }

    const topRightFlippablePositions = this.traverseTopRight(position, player);

    if (topRightFlippablePositions.length > 0) {
      flipDirections.push(
        new FlipDirection(Direction.topRight, topRightFlippablePositions)
      );
    }

    const bottomRightFlippablePositions = this.traverseBottomRight(
      position,
      player
    );

    if (topRightFlippablePositions.length > 0) {
      flipDirections.push(
        new FlipDirection(Direction.bottomRight, bottomRightFlippablePositions)
      );
    }

    const bottomLeftFlippablePositions = this.traverseBottomLeft(
      position,
      player
    );

    if (bottomLeftFlippablePositions.length > 0) {
      flipDirections.push(
        new FlipDirection(Direction.bottomLeft, bottomLeftFlippablePositions)
      );
    }

    return flipDirections;
  };

  private traverseLeft = (position: Position, player: Player): Position[] => {
    const leftPositions = [];
    const firstLeftPosition = position.firstLeftPosition();
    if (!firstLeftPosition) return [];

    for (let i = position.columnIndex - 1; i >= 0; i--) {
      const rowIndex = firstLeftPosition.rowIndex;

      if (this.isPositionEmptyByIndex(rowIndex, i)) return [];
      if (this.getSquareByIndex(rowIndex, i) === player.selfDisc()) break;
      leftPositions.push(new Position(rowIndex, i));
    }

    return leftPositions;
  };

  private traverseRight = (position: Position, player: Player): Position[] => {
    const rightPositions = [];
    const firstRightPosition = position.firstRightPosition();

    if (this.isOpponentDisc(firstRightPosition, player)) {
      const rowIndex = firstRightPosition.rowIndex;

      for (let i = firstRightPosition.columnIndex; i < this.size; i++) {
        if (this.isPositionEmptyByIndex(rowIndex, i)) return [];
        if (this.getSquareByIndex(rowIndex, i) === player.selfDisc()) break;
        rightPositions.push(new Position(rowIndex, i));
      }
    }

    return rightPositions;
  };

  private traverseBottom = (position: Position, player: Player): Position[] => {
    const bottomPositions = [];
    const firstBottomPosition = position.firstBottomPosition();

    if (this.isOpponentDisc(firstBottomPosition, player)) {
      const columnIndex = position.columnIndex;

      for (let i = firstBottomPosition.rowIndex; i < this.size; i++) {
        if (this.isPositionEmptyByIndex(i, columnIndex)) return [];
        if (this.getSquareByIndex(i, columnIndex) === player.selfDisc()) break;
        bottomPositions.push(new Position(i, columnIndex));
      }
    }

    return bottomPositions;
  };

  private traverseTop = (position: Position, player: Player): Position[] => {
    const topPositions = [];
    const firstTopPosition = position.firstTopPosition();
    if (!firstTopPosition) return [];

    if (this.isOpponentDisc(firstTopPosition, player)) {
      const columnIndex = position.columnIndex;

      for (let i = firstTopPosition.rowIndex; i >= 0; i--) {
        if (this.isPositionEmptyByIndex(i, columnIndex)) return [];
        if (this.getSquareByIndex(i, columnIndex) === player.selfDisc()) break;
        topPositions.push(new Position(i, columnIndex));
      }
    }

    return topPositions;
  };

  private traverseBottomLeft = (
    position: Position,
    player: Player
  ): Position[] => {
    const bottomLeftPositions = [];
    const firstBottomLeftPosition = position.firstBottomLeftPosition();
    if (!firstBottomLeftPosition) return [];

    if (this.isOpponentDisc(firstBottomLeftPosition, player)) {
      for (
        let i = firstBottomLeftPosition.rowIndex,
          j = firstBottomLeftPosition.columnIndex;
        i < this.size && j >= 0;
        i++, j--
      ) {
        if (this.isPositionEmptyByIndex(i, j)) return [];
        if (this.getSquareByIndex(i, j) === player.selfDisc()) break;
        bottomLeftPositions.push(new Position(i, j));
      }
    }

    return bottomLeftPositions;
  };

  private traverseBottomRight = (
    position: Position,
    player: Player
  ): Position[] => {
    const bottomRightPositions = [];
    const firstBottomRightPosition = position.firstBottomRightPosition();

    if (this.isOpponentDisc(firstBottomRightPosition, player)) {
      for (
        let i = firstBottomRightPosition.rowIndex,
          j = firstBottomRightPosition.columnIndex;
        i < this.size && j < this.size;
        i++, j++
      ) {
        if (this.isPositionEmptyByIndex(i, j)) return [];
        if (this.getSquareByIndex(i, j) === player.selfDisc()) break;
        bottomRightPositions.push(new Position(i, j));
      }
    }

    return bottomRightPositions;
  };

  private traverseTopRight = (
    position: Position,
    player: Player
  ): Position[] => {
    const topRightPositions = [];
    const firstTopRightPosition = position.firstTopRightPosition();
    if (!firstTopRightPosition) return [];

    if (this.isOpponentDisc(firstTopRightPosition, player)) {
      for (
        let i = firstTopRightPosition.rowIndex,
          j = firstTopRightPosition.columnIndex;
        i >= 0 && j < this.size;
        i--, j++
      ) {
        if (this.isPositionEmptyByIndex(i, j)) return [];
        if (this.getSquareByIndex(i, j) === player.selfDisc()) break;
        topRightPositions.push(new Position(i, j));
      }
    }

    return topRightPositions;
  };

  private traverseTopLeft = (
    position: Position,
    player: Player
  ): Position[] => {
    const topLeftPositions = [];
    const firstTopLeftPosition = position.firstTopLeftPosition();
    if (!firstTopLeftPosition) return [];

    if (this.isOpponentDisc(firstTopLeftPosition, player)) {
      for (
        let i = firstTopLeftPosition.rowIndex,
          j = firstTopLeftPosition.columnIndex;
        i >= 0 && j >= 0;
        i--, j--
      ) {
        if (this.isPositionEmptyByIndex(i, j)) return [];
        if (this.getSquareByIndex(i, j) === player.selfDisc()) break;
        topLeftPositions.push(new Position(i, j));
      }
    }

    return topLeftPositions;
  };

  private isOpponentDisc = (position: Position, player: Player): boolean => {
    return this.getSquareByPosition(position) === player.opponentDisc();
  };
}
