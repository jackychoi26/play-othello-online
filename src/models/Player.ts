import SquareState from './SquareState';

class Player {
  static BLACK_STRING = 'black';
  static WHITE_STRING = 'white';

  static Black = new Player(this.BLACK_STRING);
  static White = new Player(this.WHITE_STRING);

  private constructor(private player: string) {}

  self = (): Player =>
    this.player === Player.BLACK_STRING ? Player.Black : Player.White;

  opponent = (): Player =>
    this === Player.Black ? Player.White : Player.Black;

  selfDisc = (): SquareState =>
    this.self() === Player.Black ? SquareState.black : SquareState.white;

  opponentDisc = (): SquareState =>
    this.self() === Player.Black ? SquareState.white : SquareState.black;

  toString = (): string =>
    this.self() === Player.Black ? Player.BLACK_STRING : Player.WHITE_STRING;

  isEqualTo = (player: Player): boolean =>
    this.self().toString() === player.self().toString();
}

export default Player;
