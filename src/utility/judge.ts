import Voidable from '../common/Voidable';
import FlipDirection from '../models/FlipDirection';
import GameState from '../models/GameState';
import Player from '../models/Player';
import Position from '../models/Position';
import PossibleMove from '../models/PossibleMove';
import SquareState from '../models/SquareState';

const placeDisc = (
  gameState: GameState,
  position: Position
): Voidable<GameState> => {
  const clonedGameState = copyGameState(gameState);

  const possibleMove = clonedGameState.possibleMoves.find(element =>
    element.position.isEqualTo(position)
  );

  if (possibleMove === undefined) return;

  const rowIndex = position.rowIndex;
  const columnIndex = position.columnIndex;
  const grid = clonedGameState.grid;
  const square = grid[rowIndex][columnIndex];
  if (square !== SquareState.empty) return;

  grid[rowIndex][columnIndex] = clonedGameState.player.selfDisc();

  const newGameState = flip(
    clonedGameState,
    position,
    possibleMove.flipDirections
  );

  return nextTurn(newGameState);
};

const flip = (
  gameState: GameState,
  position: Position,
  flipDirections: FlipDirection[]
): GameState => {
  for (let direction of flipDirections) {
    const positionsToFlip = positionsForDirection(
      gameState.grid,
      position,
      direction
    );

    for (let positionToFlip of positionsToFlip) {
      if (
        gameState.grid[positionToFlip.rowIndex][positionToFlip.columnIndex] !==
        gameState.player.opponentDisc()
      ) {
        break;
      }

      gameState.grid[positionToFlip.rowIndex][positionToFlip.columnIndex] =
        gameState.player.selfDisc();
    }
  }

  return gameState;
};

const nextTurn = (gameState: GameState): Voidable<GameState> => {
  gameState.player = gameState.player.opponent();
  gameState.possibleMoves = getPossibleMoves(gameState.grid, gameState.player);
  countDisc(gameState);

  if (gameState.possibleMoves.length < 1) {
    gameState.player = gameState.player.opponent();
    gameState.possibleMoves = getPossibleMoves(
      gameState.grid,
      gameState.player
    );

    if (gameState.possibleMoves.length < 1) {
      gameState.isGameOver = true;
    }
  }

  return gameState;
};

const isGameOver = (gameState: GameState): boolean => {
  const blackMobility = getPossibleMoves(gameState.grid, Player.Black);
  const whiteMobility = getPossibleMoves(gameState.grid, Player.White);
  return blackMobility.length === 0 && whiteMobility.length === 0;
};

const getPossibleMoves = (
  grid: SquareState[][],
  player: Player
): PossibleMove[] => {
  const possibleMoves: PossibleMove[] = [];
  const emptySquaresAdjacentToDisc = getAllEmptySquaresAdjacentToDisc(grid);

  emptySquaresAdjacentToDisc.forEach(square => {
    const flipDirections = getFlipDirections(grid, square, player);

    if (flipDirections.length > 0) {
      possibleMoves.push(new PossibleMove(square, flipDirections));
    }
  });

  return possibleMoves;
};

const copyGameState = (gameState: GameState): GameState => {
  return new GameState(
    gameState.isGameOver,
    gameState.player,
    gameState.possibleMoves.slice(),
    gameState.grid.map(row => row.slice()),
    gameState.numberOfBlackDisc,
    gameState.numberOfWhiteDisc,
    gameState.remainingEmptySquare
  );
};

const getAllEmptySquaresAdjacentToDisc = (
  grid: SquareState[][]
): Position[] => {
  const boardSize = grid.length;
  const emptySquaresAdjacentToDisc = [];

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (grid[i]?.[j] !== SquareState.empty) {
        continue;
      }

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

const getFlipDirections = (
  grid: SquareState[][],
  position: Position,
  player: Player
): FlipDirection[] => {
  const flipDirectionArray = canFlipDiagonally(grid, position, player)
    .concat(canFlipHorizontally(grid, position, player))
    .concat(canFlipVertically(grid, position, player));

  return Array.from(new Set(flipDirectionArray));
};

const canFlipHorizontally = (
  grid: SquareState[][],
  position: Position,
  player: Player
): FlipDirection[] => {
  const rowIndex = position.rowIndex;
  const columnIndex = position.columnIndex;
  const row = grid[rowIndex];
  const attemptedMove = row[columnIndex];
  if (attemptedMove !== SquareState.empty) throw 'The move is illegal';

  const flipDirection: FlipDirection[] = [];

  let opponentDiscColor = player.opponentDisc();
  let currentDiscColor = player.selfDisc();

  if (row[columnIndex - 1] === opponentDiscColor) {
    const leftPositions = traverseLeft(new Position(rowIndex, columnIndex));

    for (let leftPosition of leftPositions) {
      const square = grid[leftPosition.rowIndex]?.[leftPosition.columnIndex];

      if (square === SquareState.empty) break;

      if (square === currentDiscColor) {
        flipDirection.push(FlipDirection.left);
        break;
      }
    }
  }

  if (row[columnIndex + 1] === opponentDiscColor) {
    const rightPositions = traverseRight(
      grid,
      new Position(rowIndex, columnIndex)
    );

    for (let rightPosition of rightPositions) {
      const square = grid[rightPosition.rowIndex]?.[rightPosition.columnIndex];

      if (square === SquareState.empty) break;

      if (square === currentDiscColor) {
        flipDirection.push(FlipDirection.right);
        break;
      }
    }
  }

  return flipDirection;
};

const canFlipVertically = (
  grid: SquareState[][],
  position: Position,
  player: Player
): FlipDirection[] => {
  const rowIndex = position.rowIndex;
  const columnIndex = position.columnIndex;
  const attemptedMove = grid[rowIndex][columnIndex];
  if (attemptedMove !== SquareState.empty) throw 'The move is illegal';

  const flipDirection: FlipDirection[] = [];

  let opponentDiscColor = player.opponentDisc();
  let currentDiscColor = player.selfDisc();

  if (grid[rowIndex - 1]?.[columnIndex] === opponentDiscColor) {
    const topPositions = traverseTop(new Position(rowIndex, columnIndex));

    for (let topPosition of topPositions) {
      const square = grid[topPosition.rowIndex]?.[topPosition.columnIndex];

      if (square === SquareState.empty) break;

      if (square === currentDiscColor) {
        flipDirection.push(FlipDirection.top);
        break;
      }
    }
  }

  if (grid[rowIndex + 1]?.[columnIndex] === opponentDiscColor) {
    const bottomPositions = traverseBottom(
      grid,
      new Position(rowIndex, columnIndex)
    );

    for (let bottomPosition of bottomPositions) {
      const square =
        grid[bottomPosition.rowIndex]?.[bottomPosition.columnIndex];

      if (square === SquareState.empty) break;

      if (square === currentDiscColor) {
        flipDirection.push(FlipDirection.bottom);
        break;
      }
    }
  }

  return flipDirection;
};

const canFlipDiagonally = (
  grid: SquareState[][],
  position: Position,
  player: Player
): FlipDirection[] => {
  const rowIndex = position.rowIndex;
  const columnIndex = position.columnIndex;
  const attemptedMove = grid[rowIndex][columnIndex];
  if (attemptedMove !== SquareState.empty) throw 'The move is illegal';

  const flipDirection: FlipDirection[] = [];

  let opponentDiscColor = player.opponentDisc();
  let currentDiscColor = player.selfDisc();

  // Top Left
  if (grid[rowIndex - 1]?.[columnIndex - 1] === opponentDiscColor) {
    const topLeftPositions = traverseTopLeft(
      new Position(rowIndex, columnIndex)
    );

    for (let topLeftPosition of topLeftPositions) {
      const square =
        grid[topLeftPosition.rowIndex]?.[topLeftPosition.columnIndex];

      if (square === SquareState.empty) break;

      if (square === currentDiscColor) {
        flipDirection.push(FlipDirection.topLeft);
        break;
      }
    }
  }

  // Top Right
  if (grid[rowIndex - 1]?.[columnIndex + 1] === opponentDiscColor) {
    const topRightPositions = traverseTopRight(
      grid,
      new Position(rowIndex, columnIndex)
    );

    for (let topRightPosition of topRightPositions) {
      const square =
        grid[topRightPosition.rowIndex]?.[topRightPosition.columnIndex];

      if (square === SquareState.empty) break;

      if (square === currentDiscColor) {
        flipDirection.push(FlipDirection.topRight);
        break;
      }
    }
  }

  // Bottom Right
  if (grid[rowIndex + 1]?.[columnIndex + 1] === opponentDiscColor) {
    const bottomRightPositions = traverseBottomRight(
      grid,
      new Position(rowIndex, columnIndex)
    );

    for (let bottomRightPosition of bottomRightPositions) {
      const square =
        grid[bottomRightPosition.rowIndex]?.[bottomRightPosition.columnIndex];

      if (square === SquareState.empty) break;

      if (square === currentDiscColor) {
        flipDirection.push(FlipDirection.bottomRight);
        break;
      }
    }
  }

  // Bottom Left
  if (grid[rowIndex + 1]?.[columnIndex - 1] === opponentDiscColor) {
    const bottomLeftPositions = traverseBottomLeft(
      grid,
      new Position(rowIndex, columnIndex)
    );

    for (let bottomLeftPosition of bottomLeftPositions) {
      const square =
        grid[bottomLeftPosition.rowIndex]?.[bottomLeftPosition.columnIndex];

      if (square === SquareState.empty) break;

      if (square === currentDiscColor) {
        flipDirection.push(FlipDirection.bottomLeft);
        break;
      }
    }
  }

  return flipDirection;
};

const positionsForDirection = (
  grid: SquareState[][],
  position: Position,
  direction: FlipDirection
): Position[] => {
  switch (direction) {
    case FlipDirection.topLeft:
      return traverseTopLeft(position);
    case FlipDirection.top:
      return traverseTop(position);
    case FlipDirection.topRight:
      return traverseTopRight(grid, position);
    case FlipDirection.right:
      return traverseRight(grid, position);
    case FlipDirection.bottomRight:
      return traverseBottomRight(grid, position);
    case FlipDirection.bottom:
      return traverseBottom(grid, position);
    case FlipDirection.bottomLeft:
      return traverseBottomLeft(grid, position);
    case FlipDirection.left:
      return traverseLeft(position);
  }
};

const traverseLeft = (position: Position): Position[] => {
  const leftPositions = [];

  for (let i = position.columnIndex - 1; i >= 0; i--) {
    leftPositions.push(new Position(position.rowIndex, i));
  }

  return leftPositions;
};

const traverseRight = (
  grid: SquareState[][],
  position: Position
): Position[] => {
  const rightPositions = [];

  for (
    let i = position.columnIndex + 1;
    i < grid[position.rowIndex]?.length;
    i++
  ) {
    rightPositions.push(new Position(position.rowIndex, i));
  }

  return rightPositions;
};

const traverseBottom = (
  grid: SquareState[][],
  position: Position
): Position[] => {
  const bottomPositions = [];

  for (let i = position.rowIndex + 1; i < grid.length; i++) {
    bottomPositions.push(new Position(i, position.columnIndex));
  }

  return bottomPositions;
};

const traverseTop = (position: Position): Position[] => {
  const topPositions = [];

  for (let i = position.rowIndex - 1; i >= 0; i--) {
    topPositions.push(new Position(i, position.columnIndex));
  }

  return topPositions;
};

const traverseBottomLeft = (
  grid: SquareState[][],
  position: Position
): Position[] => {
  const bottomLeftPositions = [];

  for (
    let i = position.rowIndex + 1, j = position.columnIndex - 1;
    i < grid[position.rowIndex]?.length && j >= 0;
    i++, j--
  ) {
    bottomLeftPositions.push(new Position(i, j));
  }

  return bottomLeftPositions;
};

const traverseBottomRight = (
  grid: SquareState[][],
  position: Position
): Position[] => {
  const bottomRightPositions = [];

  for (
    let i = position.rowIndex + 1, j = position.columnIndex + 1;
    i < grid[position.rowIndex].length && j < grid.length;
    i++, j++
  ) {
    bottomRightPositions.push(new Position(i, j));
  }

  return bottomRightPositions;
};

const traverseTopRight = (
  grid: SquareState[][],
  position: Position
): Position[] => {
  const topRightPositions = [];

  for (
    let i = position.rowIndex - 1, j = position.columnIndex + 1;
    i >= 0 && j < grid.length;
    i--, j++
  ) {
    topRightPositions.push(new Position(i, j));
  }

  return topRightPositions;
};

const traverseTopLeft = (position: Position): Position[] => {
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

// Warning: could cause performance issue when scaled up to more than 8x8
const countDisc = (gameState: GameState) => {
  gameState.numberOfBlackDisc = 0;
  gameState.numberOfWhiteDisc = 0;
  for (let row of gameState.grid) {
    for (let square of row) {
      if (square === SquareState.black) {
        gameState.numberOfBlackDisc++;
      } else if (square === SquareState.white) {
        gameState.numberOfWhiteDisc++;
      }
    }
  }
};

export default {
  getPossibleMoves,
  copyGameState,
  positionsForDirection,
  isGameOver,
  placeDisc,
};
