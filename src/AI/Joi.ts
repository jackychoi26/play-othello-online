import GameState from '../models/GameState';
import Player from '../models/Player';
import SquareState from '../models/SquareState';
import David from './David';

export default class Joi extends David {
  static staticWeightsBoard = [
    [10, -3, 2, 2, 2, 2, -3, 10],
    [-3, -4, -1, -1, -1, -1, -4, -3],
    [2, -1, 1, 0, 0, 1, -1, 2],
    [2, -1, 0, 1, 1, 0, -1, 2],
    [2, -1, 0, 1, 1, 0, -1, 2],
    [2, -1, 1, 0, 0, 1, -1, 2],
    [-3, -4, -1, -1, -1, -1, -4, -3],
    [10, -3, 2, 2, 2, 2, -3, 10],
  ];

  private constructor(
    player: Player,
    evaluation: (gameState: GameState) => number
  ) {
    super(player, evaluation);
  }

  // Capture corner
  static create = (player: Player): Joi => {
    const staticWeightsEvaluation = (gameState: GameState): number => {
      let weightsDifference = 0;

      gameState.grid.forEach((row: SquareState[], rowIndex: number) => {
        row.forEach((square: SquareState, columnIndex: number) => {
          if (square === SquareState.black) {
            weightsDifference = this.staticWeightsBoard[rowIndex][columnIndex];
          } else if (square === SquareState.white) {
            weightsDifference = -this.staticWeightsBoard[rowIndex][columnIndex];
          }
        });
      });

      return player === Player.Black ? weightsDifference : -weightsDifference;
    };

    return new this(player, staticWeightsEvaluation);
  };
}
