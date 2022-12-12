import GameState from '../models/GameState';
import Player from '../models/Player';
import David from './David';

export default class Michelle extends David {
  static description = 'Michelle: Disc parity';

  private constructor(
    player: Player,
    evaluation: (gameState: GameState) => number
  ) {
    super(player, evaluation);
  }

  static create = (player: Player): Michelle => {
    const greedyEvaluation = (gameState: GameState): number => {
      if (gameState.player === Player.Black) {
        return gameState.numberOfBlackDisc - gameState.numberOfWhiteDisc;
      } else {
        return gameState.numberOfWhiteDisc - gameState.numberOfBlackDisc;
      }
    };

    return new this(player, greedyEvaluation);
  };
}
