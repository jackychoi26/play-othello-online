import PossibleMove from './PossibleMove';
import SquareState from './SquareState';

export default class GameState {
  player: 'BLACK' | 'WHITE';

  constructor(
    isCurrentPlayer: boolean,
    public possibleMoves: PossibleMove[],
    public grid: SquareState[][]
  ) {
    this.player = isCurrentPlayer ? 'BLACK' : 'WHITE';
    this.grid = grid.slice();
  }
}
