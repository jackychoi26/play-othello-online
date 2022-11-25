import Player from './Player';
import PossibleMove from './PossibleMove';
import SquareState from './SquareState';

export default class GameState {
  constructor(
    public player: Player,
    public possibleMoves: PossibleMove[],
    public grid: SquareState[][],
    public numberOfBlackDisc: number,
    public numberOfWhiteDisc: number
  ) {}
}
