import * as React from 'react';
import styled from 'styled-components';
import Constants from '../constants';
import Square from './Square';
import Game from '../models/Game';
import SquareEnum from '../models/SquareEnum';

const Container = styled.div`
  border-radius: 4px;
  background-color: ${Constants.colors.boardColor};
`;

const Row = styled.div`
  flex-direction: row;
`;

const boardSize = 8;

type BoardProps = {
  game: Game;
};

const Board = (props: BoardProps) => {
  const [gameState, setGameState] = React.useState<SquareEnum[][]>(
    props.game.currentState().slice()
  );

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

  const getSquare = (row: number, column: number): React.ReactElement => {
    const square = gameState[row][column];

    return (
      <Square
        key={`${row}::${column}`}
        disc={square}
        onPress={() => onSquarePress(row, column)}
        isPressable={square == SquareEnum.empty}
      />
    );
  };

  const onSquarePress = (row: number, column: number): void => {
    props.game.placeDisc(row, column);
    setGameState(props.game.currentState().slice());
  };

  return <Container>{getBoard()}</Container>;
};

export default Board;
