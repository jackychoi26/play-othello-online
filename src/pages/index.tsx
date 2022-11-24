import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';

import Board from '../components/Board';
import Game from '../models/Game';
import GameState from '../models/GameState';
import Position from '../models/Position';

const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;

const GameStatus = styled.p`
  text-align: center;
`;

const UtilityButtonContainer = styled.div`
  flex-direction: row;
`;

const UtilityButton = styled.button`
  padding: 10px;
  margin: 20px;
`;

const Home: NextPage = () => {
  // Don't need a state
  // TODO: remove it later
  const [game, setGame] = useState<Game>(Game.create(8));

  const [gameState, setGameState] = useState<GameState>(
    game.currentGameState()
  );

  useEffect(() => {
    setGameState(game.currentGameState());
  }, [game]);

  const gameStatusString = (): string => {
    const playerString = gameState.isCurrentPlayerBlack ? 'black' : 'white';
    return `This is ${playerString} player's turn`;
  };

  const placeDisc = (position: Position) => {
    const gameState = game.placeDisc(position);

    if (gameState !== undefined) {
      setGameState(gameState);
    }
  };

  return (
    <Container>
      <GameStatus>{gameStatusString()}</GameStatus>
      <Board gameState={gameState} placeDisc={placeDisc} />
      <UtilityButtonContainer>
        <UtilityButton onClick={() => setGame(Game.create(8))}>
          New Game
        </UtilityButton>
        <UtilityButton onClick={() => game.regret()}>Regret</UtilityButton>
      </UtilityButtonContainer>
    </Container>
  );
};

export default Home;
