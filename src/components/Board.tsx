import * as React from 'react';
import styled from 'styled-components';
import Constants from '../constants';
import Square from './Square';

const GameBoard = styled.div`
  width: 640px;
  height: 640px;
  border-radius: 4px;
  background-color: ${Constants.colors.boardColor};
`;

const boardSize = 8;

type BoardProps = {};

const Board = (props: BoardProps) => {
  const getBoard = () => {
    let squares = [];

    for (let i = 0; i < 64; i++) {
      squares.push(<Square onPress={onSquarePress} />);
    }

    return squares;
  };

  const onSquarePress = () => {
    console.log('HASIDOSJA');
    return false;
  };

  return <GameBoard>{getBoard()}</GameBoard>;
};

export default Board;
