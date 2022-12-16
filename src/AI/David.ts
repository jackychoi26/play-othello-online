import moment from 'moment';
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
  private TIME_LIMIT = 10;

  constructor(
    private player: Player,
    private evaluation: (gameState: GameState) => number
  ) {}

  think(gameState: GameState): Voidable<Position> {
    if (!gameState.player.isEqualTo(this.player)) return;
    const startTime = moment();
    const results: MinimaxResult[] = [];

    // No need to think for the first move
    if (gameState.remainingEmptySquare > 58) {
      return gameState.possibleMoves[
        Math.floor(Math.random() * gameState.possibleMoves.length)
      ].position;
    }

    // Iterative deepening
    for (let i = 1; i < 60; i++) {
      if (this.isTimeout(startTime, this.TIME_LIMIT)) break;

      for (let move of gameState.possibleMoves) {
        const value = this.minimax(
          gameState,
          i,
          this.player.isEqualTo(gameState.player),
          this.evaluation,
          0,
          0,
          15,
          () => this.isTimeout(startTime, this.TIME_LIMIT)
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

  private isTimeout = (
    startTime: moment.Moment,
    timeLimit: number
  ): boolean => {
    return moment.duration(moment().diff(startTime)).asSeconds() > timeLimit;
  };

  private depthLimitedSearch = () => {};

  private minimax = (
    gameState: GameState,
    depth: number,
    isMaximizingPlayer: boolean,
    evaluation: (gameState: GameState) => number,
    alpha: number,
    beta: number,
    bruteForceCutOff: number = -this.INFINITY,
    isTimeout: () => boolean
  ): number => {
    const shouldBruteForce = bruteForceCutOff >= gameState.remainingEmptySquare;

    if (!shouldBruteForce || isTimeout()) {
      if (depth < 1 || judge.isGameOver(gameState) || isTimeout()) {
        return evaluation(gameState);
      }
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
            shouldBruteForce ? this.coinParity : evaluation,
            maxValue,
            beta,
            bruteForceCutOff,
            isTimeout
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
            shouldBruteForce ? this.coinParity : evaluation,
            alpha,
            minValue,
            bruteForceCutOff,
            isTimeout
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

  // Code smell
  private coinParity = (gameState: GameState): number => {
    const discDifference =
      gameState.numberOfBlackDisc - gameState.numberOfWhiteDisc;

    if (this.player === Player.Black) {
      return discDifference;
    } else {
      return -discDifference;
    }
  };
}
