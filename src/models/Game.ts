import Voidable from '../common/Voidable';
import judge from '../utility/judge';
import FlipDirection from './FlipDirection';
import GameState from './GameState';
import Player from './Player';
import Position from './Position';
import PossibleMove from './PossibleMove';
import SquareState from './SquareState';

export default class Game {
  private gameStateHistory: GameState[] = [];

  constructor(private gameState: GameState) {
    this.gameState.possibleMoves = judge.getPossibleMoves(
      this.gameState.grid,
      Player.black
    );

    this.countDisc();
  }

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

    const game = new Game(new GameState(true, [], column, 2, 2));
    return game;
  };

  currentGameState = (): GameState => ({ ...this.gameState });

  placeDisc = (position: Position): Voidable<GameState> => {
    // Replace with customized function of find first
    const possibleMove = this.gameState.possibleMoves.find(element =>
      element.position.isEqualTo(position)
    );

    if (possibleMove === undefined) return;

    const rowIndex = position.rowIndex;
    const columnIndex = position.columnIndex;
    const grid = this.gameState.grid;
    const square = grid[rowIndex][columnIndex];
    if (square !== SquareState.empty) return;

    this.gameStateHistory.push(judge.copyGameState(this.gameState));

    grid[rowIndex][columnIndex] = this.getCurrentDiscColor();
    this.flip(position, possibleMove.flipDirections);
    this.nextTurn();
    return { ...this.gameState };
  };

  retract = (): Voidable<GameState> => {
    const lastGameState = this.gameStateHistory.pop();

    if (lastGameState !== undefined) {
      this.gameState = lastGameState;
      return lastGameState;
    }
  };

  private updatePossibleMoves = () => {
    this.gameState.possibleMoves = judge.getPossibleMoves(
      this.gameState.grid,
      this.getCurrentPlayer()
    );
  };

  private gameOver = () => {};

  private nextTurn = () => {
    this.countDisc();
    this.changeCurrentPlayer();
    this.updatePossibleMoves();

    if (this.gameState.possibleMoves.length === 0) {
      this.changeCurrentPlayer();
      this.updatePossibleMoves();

      if (this.gameState.possibleMoves.length === 0) {
        this.gameOver();
      }
    }
  };

  private changeCurrentPlayer = () => {
    this.gameState.isCurrentPlayerBlack = !this.gameState.isCurrentPlayerBlack;
  };

  // Warning: potential performance issue when scale up to more than 8x8
  private countDisc = () => {
    this.gameState.numberOfBlackDisc = 0;
    this.gameState.numberOfWhiteDisc = 0;
    for (let row of this.gameState.grid) {
      for (let square of row) {
        if (square === SquareState.black) {
          this.gameState.numberOfBlackDisc++;
        } else if (square === SquareState.white) {
          this.gameState.numberOfWhiteDisc++;
        }
      }
    }
  };

  private flip = (position: Position, flipDirection: FlipDirection[]) => {
    for (let direction of flipDirection) {
      const positionsToFlip = judge.positionsForDirection(
        this.gameState.grid,
        position,
        direction
      );

      for (let positionToFlip of positionsToFlip) {
        if (
          this.gameState.grid[positionToFlip.rowIndex][
            positionToFlip.columnIndex
          ] !== this.getOpponentDiscColor()
        ) {
          break;
        }

        this.gameState.grid[positionToFlip.rowIndex][
          positionToFlip.columnIndex
        ] = this.getCurrentDiscColor();
      }
    }
  };

  private getCurrentDiscColor = (): SquareState => {
    return this.gameState.isCurrentPlayerBlack
      ? SquareState.black
      : SquareState.white;
  };

  private getOpponentDiscColor = (): SquareState => {
    return this.gameState.isCurrentPlayerBlack
      ? SquareState.white
      : SquareState.black;
  };

  private getCurrentPlayer = (): Player =>
    this.gameState.isCurrentPlayerBlack ? Player.black : Player.white;
}
