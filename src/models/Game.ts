import Voidable from '../common/Voidable';
import judge from '../utility/judge';
import GameState from './GameState';
import Player from './Player';
import Position from './Position';
import SquareState from './SquareState';
import CanThink from '../AI/AI';

export default class Game {
  private gameStateHistory: GameState[] = [];

  constructor(
    private gameState: GameState,
    private whiteAI: Voidable<CanThink>,
    private blackAI: Voidable<CanThink>
  ) {
    this.gameState.possibleMoves = judge.getPossibleMoves(
      gameState.grid,
      gameState.player
    );
  }

  static create = (
    size: number,
    whiteAI: Voidable<CanThink>,
    blackAI: Voidable<CanThink>
  ): Game => {
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
      new GameState(false, Player.Black, [], column, 2, 2, size * size - 4),
      whiteAI,
      blackAI
    );
    return game;
  };

  currentGameState = (): GameState => ({ ...this.gameState });

  placeDisc = (position: Position): Voidable<GameState> => {
    return this._placeDisc(position, true);
  };

  retract = (): Voidable<GameState> => {
    const lastGameState = this.gameStateHistory.pop();

    if (lastGameState !== undefined) {
      this.gameState = lastGameState;
      return lastGameState;
    }
  };

  nextTurn = (): GameState[] => {
    if (!this.isAIturn()) return [];

    const gameStates: GameState[] = [];
    const turn = this.gameState.player;
    let gameState = this._thinkIfAIPresent();

    if (gameState !== undefined) {
      gameStates.push(gameState);
      while (gameState?.player?.isEqualTo(turn)) {
        gameState = this._thinkIfAIPresent();

        if (gameState !== undefined) {
          gameStates.push(gameState);
        }
      }
    }

    return gameStates;
  };

  private _thinkIfAIPresent = (): Voidable<GameState> => {
    let position: Voidable<Position>;

    if (this.gameState.player === Player.White) {
      position = this.whiteAI?.think(this.gameState);
    } else if (this.gameState.player === Player.Black) {
      position = this.blackAI?.think(this.gameState);
    }

    if (position !== undefined) {
      return this._placeDisc(position, false);
    }
  };

  private _placeDisc = (
    position: Position,
    isPlayerInteraction: boolean
  ): Voidable<GameState> => {
    if (isPlayerInteraction && this.isAIturn()) return;
    const newGameState = judge.placeDisc(this.gameState, position);

    if (newGameState !== undefined) {
      newGameState.remainingEmptySquare -= 1;
      this.gameStateHistory.push(judge.copyGameState(this.gameState));
      this.gameState = newGameState;
      return this.gameState;
    }
  };

  private isAIturn = (): boolean => {
    if (this.gameState.player === Player.White && this.whiteAI) return true;
    if (this.gameState.player === Player.Black && this.blackAI) return true;
    return false;
  };
}
