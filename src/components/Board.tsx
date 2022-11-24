import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Constants from '../constants';
import Square from './Square';
import Position from '../models/Position';
import GameState from '../models/GameState';

const Container = styled.div`
  border-radius: 4px;
  background-color: ${Constants.colors.boardColor};
`;

const Row = styled.div`
  flex-direction: row;
`;

const boardSize = 8;

type BoardProps = {
  gameState: GameState;
  placeDisc(position: Position): void;
};

const Board = (props: BoardProps) => {
  const getBoard = () => {
    let squares = [];

    for (let i = 0; i < boardSize; i++) {
      squares.push(getRow(i));
    }

    return squares;
  };

  const getRow = (index: number): React.ReactElement => {
    const squares = [];

    for (let i = 0; i < boardSize; i++) {
      squares.push(getSquare(index, i));
    }

    return <Row key={index}>{squares}</Row>;
  };

  const shouldHighLightSquare = (row: number, column: number): boolean => {
    return (
      props.gameState.possibleMoves.findIndex(possibleMove =>
        possibleMove.position.isEqualTo(new Position(row, column))
      ) > -1
    );
  };

  const getSquare = (row: number, column: number): React.ReactElement => {
    const square = props.gameState.grid[row][column];

    return (
      <Square
        key={`${row}::${column}`}
        disc={square}
        onPress={() => onSquarePress(row, column)}
        shouldHighLightSquare={shouldHighLightSquare(row, column)}
      />
    );
  };

  const onSquarePress = (row: number, column: number): void => {
    props.placeDisc(new Position(row, column));
  };

  return <Container>{getBoard()}</Container>;
};

export default Board;
