import GameState from '../models/GameState';
import Position from '../models/Position';
import Voidable from '../common/Voidable';
import Player from '../models/Player';
import judge from '../utility/judge';
import CanThink from './CanThink';
import MinimaxResult from './MiniMaxResult';

export default class Michelle implements CanThink {
  constructor(private player: Player) {}

  private INFINITY = 9999;

  think(gameState: GameState): Voidable<Position> {
    if (!gameState.player.isEqualTo(this.player)) return;
    const results: MinimaxResult[] = [];

    for (let move of gameState.possibleMoves) {
      const newGameState = judge.placeDisc(gameState, move.position);

      if (newGameState !== undefined) {
        const value = this.minimax(newGameState, 5, false);
        results.push(new MinimaxResult(move.position, value));
      }
    }

    const resultWithHighestValue = results.reduce((prev, current) => {
      if (prev.value === current.value) {
        return Math.random() > 0.5 ? prev : current;
      }

      return prev.value > current.value ? prev : current;
    });

    console.log('Returning something...');

    return resultWithHighestValue.position;
  }

  private minimax = (
    gameState: GameState,
    depth: number,
    isMaximizingPlayer: boolean
  ): number => {
    if (depth === 0 || judge.isGameOver(gameState)) {
      return this.greedyEvaluation(gameState);
    }

    if (isMaximizingPlayer) {
      let maxValue = -this.INFINITY;

      for (let move of judge.getPossibleMoves(
        gameState.grid,
        gameState.player
      )) {
        const newGameState = judge.placeDisc(gameState, move.position);

        if (newGameState !== undefined) {
          const childrenValue = this.minimax(
            newGameState,
            depth - 1,
            !isMaximizingPlayer
          );
          maxValue = Math.max(childrenValue, maxValue);
        } else {
          console.error('❌ Unexpected Error in Michelle.ts');
        }
      }

      return maxValue;
    } else {
      let minValue = this.INFINITY;

      for (let move of judge.getPossibleMoves(
        gameState.grid,
        gameState.player
      )) {
        const newGameState = judge.placeDisc(gameState, move.position);

        if (newGameState !== undefined) {
          const childrenValue = this.minimax(
            newGameState,
            depth - 1,
            !isMaximizingPlayer
          );
          minValue = Math.min(childrenValue, minValue);
        } else {
          console.error('❌ Unexpected Error in Michelle.ts');
        }
      }

      return minValue;
    }
  };

  // Higher the better
  private greedyEvaluation = (gameState: GameState): number => {
    if (this.player.self() === Player.Black) {
      return gameState.numberOfBlackDisc - gameState.numberOfWhiteDisc;
    } else {
      return gameState.numberOfWhiteDisc - gameState.numberOfBlackDisc;
    }
  };
}
