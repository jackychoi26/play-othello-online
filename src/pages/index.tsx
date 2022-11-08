import type { NextPage } from 'next';
import { useState } from 'react';
import styled from 'styled-components';
import Board from '../components/Board';
import Game from '../models/Game';

const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;

const NewGameButton = styled.button`
  padding: 10px;
  margin-top: 20px;
`;

const Home: NextPage = () => {
  const [game, setGame] = useState<Game>(Game.create(8));

  return (
    <Container>
      <Board game={game} />
      <NewGameButton onClick={() => setGame(Game.create(8))}>
        New Game
      </NewGameButton>
    </Container>
  );
};

export default Home;
