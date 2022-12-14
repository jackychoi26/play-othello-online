import GameState from '../models/GameState';
import Player from '../models/Player';
import judge from '../utility/judge';
import David from './David';

export default class Rachael extends David {
  static description = 'Rachael: Evaluate on mobility';

  private constructor(
    player: Player,
    evaluation: (gameState: GameState) => number
  ) {
    super(player, evaluation);
  }

  static create = (player: Player): Rachael => {
    const mobilityEvaluation = (gameState: GameState): number => {
      const playerMobility = judge.getPossibleMoves(gameState.grid, player);

      const opponentMobility = judge.getPossibleMoves(
        gameState.grid,
        player.opponent()
      );

      return playerMobility.length - opponentMobility.length;
    };

    return new this(player, mobilityEvaluation);
  };
}
