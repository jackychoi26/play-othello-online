import Voidable from '../common/Voidable';
import judge from '../utility/judge';
import GameState from './GameState';
import Player from './Player';
import Position from './Position';
import SquareState from './SquareState';
import CanThink from '../AI/AI';

export default class Game {
  private gameStateHistory: GameState[] = [];

  constructor(private gameState: GameState, private ai: Voidable<CanThink>) {
    this.gameState.possibleMoves = judge.getPossibleMoves(
      gameState.grid,
      gameState.player
    );
  }

  static create = (size: number, ai: Voidable<CanThink>): Game => {
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

    const game = new Game(
      new GameState(false, Player.Black, [], column, 2, 2),
      ai
    );
    return game;
  };

  currentGameState = (): GameState => ({ ...this.gameState });

  placeDisc = (position: Position): Voidable<GameState> => {
    const newGameState = judge.placeDisc(this.gameState, position);

    if (newGameState !== undefined) {
      this.gameStateHistory.push(judge.copyGameState(this.gameState));
      this.gameState = newGameState;
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

  private gameOver = () => {};

  nextTurn = (): Voidable<GameState> => {
    const position = this.ai?.think(judge.copyGameState(this.gameState));

    if (position !== undefined) {
      return this.placeDisc(position);
    }
  };
}
