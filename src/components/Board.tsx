import * as React from 'react';
import styled from 'styled-components';
import Game from '../models/game';

type BoardProps = {};

const Container = styled.div`
  width: 80px;
  height: 80px;
`;

const boardSize = 8;

const Board = (boardProps: BoardProps) => {
  const getBoard = () => {};

  return (
    <Container>
      <h1>Helo</h1>
    </Container>
  );
};

export default Board;
