import Grid from './Grid';
import Player from './Player';
import PossibleMove from './PossibleMove';

export default class GameState {
  constructor(
    public isGameOver: boolean,
    public player: Player,
    public possibleMoves: PossibleMove[],
    public grid: Grid,
    public numberOfBlackDisc: number,
    public numberOfWhiteDisc: number,
    public remainingEmptySquare: number
  ) {}
}
