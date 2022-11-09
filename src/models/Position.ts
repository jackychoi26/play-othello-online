export default class Position {
  constructor(public rowIndex: number, public columnIndex: number) {}

  isEqualTo = (position: Position): boolean => {
    return (
      this.rowIndex === position.rowIndex &&
      this.columnIndex === position.columnIndex
    );
  };
}
