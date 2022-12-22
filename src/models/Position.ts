import Voidable from '../common/Voidable';

export default class Position {
  constructor(public rowIndex: number, public columnIndex: number) {}

  isEqualTo = (position: Position): boolean => {
    return (
      this.rowIndex === position.rowIndex &&
      this.columnIndex === position.columnIndex
    );
  };

  firstTopLeftPosition = (): Voidable<Position> => {
    if (this.rowIndex > 0 && this.columnIndex > 0) {
      return new Position(this.rowIndex - 1, this.columnIndex - 1);
    }
  };

  firstTopRightPosition = (): Voidable<Position> => {
    if (this.rowIndex > 0) {
      return new Position(this.rowIndex - 1, this.columnIndex + 1);
    }
  };

  firstBottomLeftPosition = (): Voidable<Position> => {
    if (this.columnIndex > 0) {
      return new Position(this.rowIndex + 1, this.columnIndex - 1);
    }
  };

  firstBottomRightPosition = (): Position => {
    return new Position(this.rowIndex + 1, this.columnIndex + 1);
  };

  firstTopPosition = (): Voidable<Position> => {
    if (this.rowIndex > 0) {
      return new Position(this.rowIndex - 1, this.columnIndex);
    }
  };

  firstBottomPosition = (): Position => {
    return new Position(this.rowIndex + 1, this.columnIndex);
  };

  firstLeftPosition = (): Voidable<Position> => {
    if (this.columnIndex > 0) {
      return new Position(this.rowIndex, this.columnIndex - 1);
    }
  };

  firstRightPosition = (): Position => {
    return new Position(this.rowIndex, this.columnIndex + 1);
  };
}
