import GameState from '../models/GameState';
import Position from '../models/Position';
import Voidable from '../common/Voidable';

export default interface AI {
  think(game: GameState): Voidable<Position>;
}
