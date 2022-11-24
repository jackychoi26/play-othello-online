import FlipDirection from './FlipDirection';
import GameState from './GameState';
import Position from './Position';
import PossibleMove from './PossibleMove';
import SquareState from './SquareState';

export default class Game {
  private gameStateHistory: GameState[] = [];

  constructor(private gameState: GameState) {
    this.updateaPossibleMoves();
  }

  static create = (size: number): Game => {
    const row: SquareState[] = [];
    let column: SquareState[][] = [];

    for (let _ = 0; _ < size; _++) {
      row.push(SquareState.empty);
    }

    for (let _ = 0; _ < size; _++) {
      column.push(row.slice());
    }

    column[3][3] = SquareState.white;
    column[4][4] = SquareState.white;

    column[4][3] = SquareState.black;
    column[3][4] = SquareState.black;

    const game = new Game(new GameState(true, [], column));
    return game;
  };

  currentGameState = (): GameState => {
    return { ...this.gameState };
  };

  placeDisc = (position: Position): GameState | undefined => {
    // Replace with customized function of find first
    const possibleMove = this.gameState.possibleMoves.find(element =>
      element.position.isEqualTo(position)
    );

    if (possibleMove === undefined) return;

    const rowIndex = position.rowIndex;
    const columnIndex = position.columnIndex;
    const grid = this.gameState.grid;
    const square = grid[rowIndex][columnIndex];
    if (square !== SquareState.empty) return;

    this.gameStateHistory.push(this.copyGameState(this.gameState));

    grid[rowIndex][columnIndex] = this.getCurrentPlayerColor();
    this.flip(position, possibleMove.flipDirections);
    this.updateGameState();
    return { ...this.gameState };
  };

  isCurrentPlayerBlack = (): boolean => this.gameState.isCurrentPlayerBlack;

  retract = (): GameState | undefined => {
    const lastGameState = this.gameStateHistory.pop();

    if (lastGameState !== undefined) {
      this.gameState = lastGameState
      return lastGameState
    }
  };

  private gameOver = () => {
    alert('Game over');
  };

  private copyGameState = (gameState: GameState): GameState => {
    return new GameState(
      gameState.isCurrentPlayerBlack,
      gameState.possibleMoves.slice(),
      gameState.grid.map(row => row.slice())
    )
  }

  private updateGameState = () => {
    this.changeCurrentPlayer();
    this.updateaPossibleMoves();

    if (this.gameState.possibleMoves.length === 0) {
      this.changeCurrentPlayer();
      this.updateaPossibleMoves();
      if (this.gameState.possibleMoves.length === 0) {
        this.gameOver();
      }
    }
  };

  private changeCurrentPlayer = () => {
    this.gameState.isCurrentPlayerBlack = !this.gameState.isCurrentPlayerBlack;
  };

  private updateaPossibleMoves = () => {
    this.gameState.possibleMoves = [];
    const emptySquaresAdjacentToDisc = this.getAllEmptySquaresAdjacentToDisc();

    emptySquaresAdjacentToDisc.forEach(square => {
      const flipDirections = this.getFlipDirections(square);

      if (flipDirections.length > 0) {
        this.gameState.possibleMoves.push(
          new PossibleMove(square, flipDirections)
        );
      }
    });
  };

  private getAllEmptySquaresAdjacentToDisc = (): Position[] => {
    const grid = this.gameState.grid;
    const boardSize = grid.length;
    const emptySquaresAdjacentToDisc = [];

    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (grid[i]?.[j] !== SquareState.empty) continue;

        if (
          grid[i + 1]?.[j + 1] !== SquareState.empty ||
          grid[i + 1]?.[j - 1] !== SquareState.empty ||
          grid[i - 1]?.[j - 1] !== SquareState.empty ||
          grid[i - 1]?.[j + 1] !== SquareState.empty ||
          grid[i + 1]?.[j] !== SquareState.empty ||
          grid[i - 1]?.[j] !== SquareState.empty ||
          grid[i]?.[j + 1] !== SquareState.empty ||
          grid[i]?.[j - 1] !== SquareState.empty
        ) {
          emptySquaresAdjacentToDisc.push(new Position(i, j));
        }
      }
    }

    return emptySquaresAdjacentToDisc;
  };

  private getFlipDirections = (position: Position): FlipDirection[] => {
    const flipDirectionArray = this.canFlipDiagonally(position)
      .concat(this.canFlipHorizontally(position))
      .concat(this.canFlipVertically(position));

    return Array.from(new Set(flipDirectionArray));
  };

  private canFlipHorizontally = (position: Position): FlipDirection[] => {
    const grid = this.gameState.grid;
    const rowIndex = position.rowIndex;
    const columnIndex = position.columnIndex;
    const row = grid[rowIndex];
    const attemptedMove = row[columnIndex];
    if (attemptedMove !== SquareState.empty) throw 'The move is illegal';

    const flipDirection: FlipDirection[] = [];

    let opponentPlayerColor = this.getOpponentPlayerColor();
    let currentPlayerColor = this.getCurrentPlayerColor();

    if (row[columnIndex - 1] === opponentPlayerColor) {
      const leftPositions = this.traverseLeft(
        new Position(rowIndex, columnIndex)
      );

      for (let leftPosition of leftPositions) {
        const square = grid[leftPosition.rowIndex]?.[leftPosition.columnIndex];

        if (square === SquareState.empty) break;

        if (square === currentPlayerColor) {
          flipDirection.push(FlipDirection.left);
          break;
        }
      }
    }

    if (row[columnIndex + 1] === opponentPlayerColor) {
      const rightPositions = this.traverseRight(
        new Position(rowIndex, columnIndex)
      );

      for (let rightPosition of rightPositions) {
        const square =
          grid[rightPosition.rowIndex]?.[rightPosition.columnIndex];

        if (square === SquareState.empty) break;

        if (square === currentPlayerColor) {
          flipDirection.push(FlipDirection.right);
          break;
        }
      }
    }

    return flipDirection;
  };

  private canFlipVertically = (position: Position): FlipDirection[] => {
    const grid = this.gameState.grid;
    const rowIndex = position.rowIndex;
    const columnIndex = position.columnIndex;
    const attemptedMove = grid[rowIndex][columnIndex];
    if (attemptedMove !== SquareState.empty) throw 'The move is illegal';

    const flipDirection: FlipDirection[] = [];

    let opponentPlayerColor = this.getOpponentPlayerColor();
    let currentPlayerColor = this.getCurrentPlayerColor();

    if (grid[rowIndex - 1]?.[columnIndex] === opponentPlayerColor) {
      const topPositions = this.traverseTop(
        new Position(rowIndex, columnIndex)
      );

      for (let topPosition of topPositions) {
        const square = grid[topPosition.rowIndex]?.[topPosition.columnIndex];

        if (square === SquareState.empty) break;

        if (square === currentPlayerColor) {
          flipDirection.push(FlipDirection.top);
          break;
        }
      }
    }

    if (grid[rowIndex + 1]?.[columnIndex] === opponentPlayerColor) {
      const bottomPositions = this.traverseBottom(
        new Position(rowIndex, columnIndex)
      );

      for (let bottomPosition of bottomPositions) {
        const square =
          grid[bottomPosition.rowIndex]?.[bottomPosition.columnIndex];

        if (square === SquareState.empty) break;

        if (square === currentPlayerColor) {
          flipDirection.push(FlipDirection.bottom);
          break;
        }
      }
    }

    return flipDirection;
  };

  private canFlipDiagonally = (position: Position): FlipDirection[] => {
    const grid = this.gameState.grid;
    const rowIndex = position.rowIndex;
    const columnIndex = position.columnIndex;
    const attemptedMove = grid[rowIndex][columnIndex];
    if (attemptedMove !== SquareState.empty) throw 'The move is illegal';

    const flipDirection: FlipDirection[] = [];

    let opponentPlayerColor = this.getOpponentPlayerColor();
    let currentPlayerColor = this.getCurrentPlayerColor();

    // Top Left
    if (grid[rowIndex - 1]?.[columnIndex - 1] === opponentPlayerColor) {
      const topLeftPositions = this.traverseTopLeft(
        new Position(rowIndex, columnIndex)
      );

      for (let topLeftPosition of topLeftPositions) {
        const square =
          grid[topLeftPosition.rowIndex]?.[topLeftPosition.columnIndex];

        if (square === SquareState.empty) break;

        if (square === currentPlayerColor) {
          flipDirection.push(FlipDirection.topLeft);
          break;
        }
      }
    }

    // Top Right
    if (grid[rowIndex - 1]?.[columnIndex + 1] === opponentPlayerColor) {
      const topRightPositions = this.traverseTopRight(
        new Position(rowIndex, columnIndex)
      );

      for (let topRightPosition of topRightPositions) {
        const square =
          grid[topRightPosition.rowIndex]?.[topRightPosition.columnIndex];

        if (square === SquareState.empty) break;

        if (square === currentPlayerColor) {
          flipDirection.push(FlipDirection.topRight);
          break;
        }
      }
    }

    // Bottom Right
    if (grid[rowIndex + 1]?.[columnIndex + 1] === opponentPlayerColor) {
      const bottomRightPositions = this.traverseBottomRight(
        new Position(rowIndex, columnIndex)
      );

      for (let bottomRightPosition of bottomRightPositions) {
        const square =
          grid[bottomRightPosition.rowIndex]?.[bottomRightPosition.columnIndex];

        if (square === SquareState.empty) break;

        if (square === currentPlayerColor) {
          flipDirection.push(FlipDirection.bottomRight);
          break;
        }
      }
    }

    // Bottom Left
    if (grid[rowIndex + 1]?.[columnIndex - 1] === opponentPlayerColor) {
      const bottomLeftPositions = this.traverseBottomLeft(
        new Position(rowIndex, columnIndex)
      );

      for (let bottomLeftPosition of bottomLeftPositions) {
        const square =
          grid[bottomLeftPosition.rowIndex]?.[bottomLeftPosition.columnIndex];

        if (square === SquareState.empty) break;

        if (square === currentPlayerColor) {
          flipDirection.push(FlipDirection.bottomLeft);
          break;
        }
      }
    }

    return flipDirection;
  };

  private getCurrentPlayerColor = (): SquareState => {
    return this.gameState.isCurrentPlayerBlack
      ? SquareState.black
      : SquareState.white;
  };

  private getOpponentPlayerColor = (): SquareState => {
    return this.gameState.isCurrentPlayerBlack
      ? SquareState.white
      : SquareState.black;
  };

  private flip = (position: Position, flipDirection: FlipDirection[]) => {
    for (let direction of flipDirection) {
      const positionsToFlip = this.positionsForDirection(position, direction);

      for (let positionToFlip of positionsToFlip) {
        if (
          this.gameState.grid[positionToFlip.rowIndex][
          positionToFlip.columnIndex
          ] !== this.getOpponentPlayerColor()
        ) {
          break;
        }

        this.gameState.grid[positionToFlip.rowIndex][
          positionToFlip.columnIndex
        ] = this.getCurrentPlayerColor();
      }
    }
  };

  private positionsForDirection = (
    position: Position,
    direction: FlipDirection
  ): Position[] => {
    if (direction === FlipDirection.topLeft) {
      return this.traverseTopLeft(position);
    } else if (direction === FlipDirection.top) {
      return this.traverseTop(position);
    } else if (direction === FlipDirection.topRight) {
      return this.traverseTopRight(position);
    } else if (direction === FlipDirection.right) {
      return this.traverseRight(position);
    } else if (direction === FlipDirection.bottomRight) {
      return this.traverseBottomRight(position);
    } else if (direction === FlipDirection.bottom) {
      return this.traverseBottom(position);
    } else if (direction === FlipDirection.bottomLeft) {
      return this.traverseBottomLeft(position);
    } else if (direction === FlipDirection.left) {
      return this.traverseLeft(position);
    } else {
      return [];
    }
  };

  private traverseTopLeft = (position: Position): Position[] => {
    const topLeftPositions = [];

    for (
      let i = position.rowIndex - 1, j = position.columnIndex - 1;
      i >= 0 && j >= 0;
      i--, j--
    ) {
      topLeftPositions.push(new Position(i, j));
    }

    return topLeftPositions;
  };

  private traverseTopRight = (position: Position): Position[] => {
    const topRightPositions = [];

    for (
      let i = position.rowIndex - 1, j = position.columnIndex + 1;
      i >= 0 && j < this.gameState.grid.length;
      i--, j++
    ) {
      topRightPositions.push(new Position(i, j));
    }

    return topRightPositions;
  };

  private traverseBottomRight = (position: Position): Position[] => {
    const bottomRightPositions = [];

    for (
      let i = position.rowIndex + 1, j = position.columnIndex + 1;
      i < this.gameState.grid[position.rowIndex].length &&
      j < this.gameState.grid.length;
      i++, j++
    ) {
      bottomRightPositions.push(new Position(i, j));
    }

    return bottomRightPositions;
  };

  private traverseBottomLeft = (position: Position): Position[] => {
    const bottomLeftPositions = [];

    for (
      let i = position.rowIndex + 1, j = position.columnIndex - 1;
      i < this.gameState.grid[position.rowIndex].length && j >= 0;
      i++, j--
    ) {
      bottomLeftPositions.push(new Position(i, j));
    }

    return bottomLeftPositions;
  };

  private traverseTop = (position: Position): Position[] => {
    const topPositions = [];

    for (let i = position.rowIndex - 1; i >= 0; i--) {
      topPositions.push(new Position(i, position.columnIndex));
    }

    return topPositions;
  };

  private traverseBottom = (position: Position): Position[] => {
    const bottomPositions = [];

    for (let i = position.rowIndex + 1; i < this.gameState.grid.length; i++) {
      bottomPositions.push(new Position(i, position.columnIndex));
    }

    return bottomPositions;
  };

  private traverseRight = (position: Position): Position[] => {
    const rightPositions = [];

    for (
      let i = position.columnIndex + 1;
      i < this.gameState.grid[position.rowIndex].length;
      i++
    ) {
      rightPositions.push(new Position(position.rowIndex, i));
    }

    return rightPositions;
  };

  private traverseLeft = (position: Position): Position[] => {
    const leftPositions = [];

    for (let i = position.columnIndex - 1; i >= 0; i--) {
      leftPositions.push(new Position(position.rowIndex, i));
    }

    return leftPositions;
  };
}
