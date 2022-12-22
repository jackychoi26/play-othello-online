import Direction from './Direction';
import Position from './Position';

export default class FlipDirection {
  constructor(public direction: Direction, public positions: Position[]) {}
}
