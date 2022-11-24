import PossibleMove from './PossibleMove';
import SquareState from './SquareState';

export default class GameState {
  constructor(
    public isCurrentPlayerBlack: boolean,
    public possibleMoves: PossibleMove[],
    public grid: SquareState[][],
    public numberOfBlackDisc: number,
    public numberOfWhiteDisc: number,
  ) { }
}
