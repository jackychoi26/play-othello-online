import Voidable from '../common/Voidable';
import GameState from '../models/GameState';
import Player from '../models/Player';
import Position from '../models/Position';
import judge from '../utility/judge';
import AI from './AI';
import MinimaxResult from './MinimaxResult';

// David is a property of Weyland Corp.
export default class David implements AI {
  private INFINITY = 9999;

  constructor(
    private player: Player,
    private evaluation: (gameState: GameState) => number
  ) {}

  think(gameState: GameState): Voidable<Position> {
    if (!gameState.player.isEqualTo(this.player)) return;
    const results: MinimaxResult[] = [];

    for (let move of gameState.possibleMoves) {
      const newGameState = judge.placeDisc(gameState, move.position);

      if (newGameState !== undefined) {
        const value = this.minimax(
          newGameState,
          3,
          false,
          this.evaluation,
          0,
          0
        );

        results.push(new MinimaxResult(move.position, value));
      }
    }

    if (results.length < 1) return;

    const resultWithHighestValue = results.reduce((prev, current) => {
      if (prev.value === current.value) {
        return Math.random() > 0.5 ? prev : current;
      }

      return prev.value > current.value ? prev : current;
    });

    return resultWithHighestValue.position;
  }

  private minimax = (
    gameState: GameState,
    depth: number,
    isMaximizingPlayer: boolean,
    evaluation: (gameState: GameState) => number,
    alpha: number,
    beta: number
  ): number => {
    if (depth === 0 || judge.isGameOver(gameState)) {
      return evaluation(gameState);
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
            newGameState.player.isEqualTo(this.player),
            evaluation,
            maxValue,
            beta
          );

          maxValue = Math.max(childrenValue, maxValue);
          const alphaValue = Math.max(alpha, childrenValue);
          if (alphaValue >= beta) break;
        } else {
          console.error('❌ Unexpected Error in David.ts', gameState, move);
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
            !newGameState.player.isEqualTo(this.player),
            evaluation,
            alpha,
            minValue
          );

          minValue = Math.min(childrenValue, minValue);
          const betaValue = Math.min(beta, childrenValue);
          if (betaValue <= alpha) break;
        } else {
          console.error('❌ Unexpected Error in David.ts', gameState, move);
        }
      }

      return minValue;
    }
  };
}
