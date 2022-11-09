import FlipDirection from './FlipDirection';
import Position from './Position';

export default class PossibleMove {
  constructor(
    public position: Position,
    public flipDirections: FlipDirection[]
  ) {}
}
