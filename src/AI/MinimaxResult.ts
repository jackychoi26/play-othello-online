import Position from '../models/Position';

export default class MinimaxResult {
  constructor(public position: Position, public value: number) {}
}
