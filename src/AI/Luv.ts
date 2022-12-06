import Voidable from '../common/Voidable';
import GameState from '../models/GameState';
import Player from '../models/Player';
import Position from '../models/Position';
import SquareState from '../models/SquareState';
import David from './David';

export default class Luv extends David {
  private constructor(
    player: Player,
    evaluation: (gameState: GameState) => number
  ) {
    super(player, evaluation);
  }

  static create = (player: Player): Luv => {
    const staticWeightsEvaluation = (gameState: GameState): number => {
      const corners = [
        new Position(0, 0),
        new Position(0, 7),
        new Position(7, 0),
        new Position(7, 7),
      ];

      const cornerOwner = (
        grid: SquareState[][],
        position: Position
      ): Voidable<Player> => {
        const cornerSquare = grid[position.rowIndex][position.columnIndex];
        if (cornerSquare === SquareState.black) return Player.Black;
        if (cornerSquare === SquareState.white) return Player.White;
      };

      const cornersDifference = corners.reduce((accumulator, currentValue) => {
        const value =
          cornerOwner(gameState.grid, currentValue) === Player.Black
            ? 999
            : -999;

        return accumulator + value;
      }, 0);

      const discDifference =
        gameState.numberOfBlackDisc - gameState.numberOfWhiteDisc;

      const finalValue = cornersDifference + discDifference;
      return player === Player.Black ? finalValue : -finalValue;
    };

    return new this(player, staticWeightsEvaluation);
  };
}
