import Voidable from '../common/Voidable';
import GameState from '../models/GameState';
import Player from '../models/Player';
import Position from '../models/Position';
import SquareState from '../models/SquareState';
import judge from '../utility/judge';
import David from './David';

export default class Luv extends David {
  static description = 'Luv: Corner capture and mobility';

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
        const player = cornerOwner(gameState.grid, currentValue);

        if (player !== undefined) {
          const value = player === gameState.player ? 999 : -999;
          return accumulator + value;
        } else {
          return accumulator;
        }
      }, 0);

      const playerMobility = judge.getPossibleMoves(
        gameState.grid,
        player
      ).length;

      const opponentMobility = judge.getPossibleMoves(
        gameState.grid,
        player.opponent()
      ).length;

      const mobilityDifference = playerMobility - opponentMobility;
      const finalValue = cornersDifference + mobilityDifference;
      return player === Player.Black ? finalValue : -finalValue;
    };

    return new this(player, staticWeightsEvaluation);
  };
}
