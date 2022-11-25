import Voidable from '../common/Voidable';
import judge from '../utility/judge';
import FlipDirection from './FlipDirection';
import GameState from './GameState';
import Player from './Player';
import Position from './Position';
import SquareState from './SquareState';

export default class Game {
  private gameStateHistory: GameState[] = [];

  constructor(private gameState: GameState) {
    this.gameState.possibleMoves = judge.getPossibleMoves(
      gameState.grid,
      gameState.player
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

    const game = new Game(new GameState(Player.Black, [], column, 2, 2));
    return game;
  };

  currentGameState = (): GameState => ({ ...this.gameState });

  placeDisc = (position: Position): Voidable<GameState> => {
    const newGameState = judge.placeDisc(this.gameState, position);

    if (newGameState !== undefined) {
      this.gameStateHistory.push(judge.copyGameState(this.gameState));
      this.gameState = newGameState;
      this.nextTurn();
      return this.gameState;
    }
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
      this.gameState.player.self()
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
    this.gameState.player = this.gameState.player.opponent();
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
}
