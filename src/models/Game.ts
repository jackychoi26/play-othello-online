import Voidable from '../common/Voidable';
import GameState from './GameState';
import Player from './Player';
import Position from './Position';
import CanThink from '../AI/AI';
import Grid from './Grid';
import PossibleMove from './PossibleMove';

export default class Game {
  static boardSize = 8;
  private gameStateHistory: GameState[] = [];

  constructor(
    private grid: Grid,
    private whiteAI: Voidable<CanThink>,
    private blackAI: Voidable<CanThink>
  ) {}

  static create = (
    whiteAI: Voidable<CanThink>,
    blackAI: Voidable<CanThink>
  ): Game => {
    const grid = Grid.create(8);
    const game = new Game(grid, whiteAI, blackAI);

    return game;
  };

  currentGameState = (): GameState => {
    const discsSum = this.grid.numberOfDiscs();

    // TODO: do we really need PossibleMoves instead of Positions?
    return new GameState(
      this.grid.isGameOver(),
      this.grid.getCurrentPlayer(),
      this.grid.getPossibleMoves(),
      this.grid.getGrid(),
      discsSum.black,
      discsSum.white,
      Math.pow(Game.boardSize, 2) - (discsSum.black + discsSum.white)
    );
  };

  placeDisc = (position: Position): Voidable<GameState> => {
    return this._placeDisc(position, true);
  };

  retract = (): Voidable<GameState> => {
    // const lastGameState = this.gameStateHistory.pop();
    // if (lastGameState !== undefined) {
    //   this.gameState = lastGameState;
    //   return lastGameState;
    // }
  };

  nextTurn = (): GameState[] => {
    if (!this.isAIturn()) return [];

    const gameStates: GameState[] = [];
    const turn = this.grid.getCurrentPlayer();
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

    if (this.grid.getCurrentPlayer() === Player.White) {
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
    const clonedGrid = this.gameState.placeDisc(position);

    // BUG FIX COULD SKIP TURN
    this.gameState = this.copyGameState(
      clonedGrid.isGameOver(),
      this.gameState.player.opponent(),
      clonedGrid.getPossibleMoves(player.opponent()),
      clonedGrid
    );

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

  private copyGameState = (gameState: GameState): GameState => {
    return new GameState(
      gameState.isGameOver,
      gameState.player,
      gameState.possibleMoves.slice(),
      gameState.grid.clone(),
      gameState.numberOfBlackDisc,
      gameState.numberOfWhiteDisc,
      gameState.remainingEmptySquare
    );
  };
}
