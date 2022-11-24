import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Constants from '../constants';
import Square from './Square';
import Game from '../models/Game';
import SquareState from '../models/SquareState';
import Position from '../models/Position';
import GameState from '../models/GameState';

const Container = styled.div`
  border-radius: 4px;
  background-color: ${Constants.colors.boardColor};
`;

const WhosTurn = styled.p`
  text-align: center;
`;

const Row = styled.div`
  flex-direction: row;
`;

const boardSize = 8;

type BoardProps = {
  game: Game;
};

const Board = (props: BoardProps) => {
  const [gameState, setGameState] = useState<GameState>(
    props.game.currentGameState()
  );

  useEffect(() => {
    setGameState(props.game.currentGameState());
  }, [props.game]);

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
      gameState.possibleMoves.findIndex(possibleMove =>
        possibleMove.position.isEqualTo(new Position(row, column))
      ) > -1
    );
  };

  const getSquare = (row: number, column: number): React.ReactElement => {
    const square = gameState.grid[row][column];

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
    const gameState = props.game.placeDisc(new Position(row, column));

    if (gameState !== undefined) {
      gameState.player;
      setGameState(props.game.currentGameState());
    }
  };

  const currentPlayerString = (player: 'BLACK' | 'WHITE'): string => {
    return `This is ${player} player's turn`;
  };

  return (
    <Container>
      <WhosTurn>{currentPlayerString(gameState.player)}</WhosTurn>
      {getBoard()}
    </Container>
  );
};

export default Board;
