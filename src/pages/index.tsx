import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';

import Board from '../components/Board';

import Game from '../models/Game';
import GameState from '../models/GameState';
import Position from '../models/Position';

import Michelle from '../AI/Michelle';
import Player from '../models/Player';

const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;

const GameInfo = styled.p`
  text-align: center;
  margin-top: 0px;
  font-size: large;
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
  const [game, setGame] = useState<Game>(
    Game.create(8, Michelle.create(Player.White))
  );

  const [gameState, setGameState] = useState<GameState>(
    game.currentGameState()
  );

  useEffect(() => {
    setGameState(game.currentGameState());
  }, [game]);

  useEffect(() => {
    if (gameState.isGameOver) {
      alert('Game over');
    }
  }, [gameState]);

  const gameStatusString = (): string => {
    if (gameState.isGameOver) {
      return winnerString();
    } else {
      return `This is ${gameState.player.toString()} player's turn`;
    }
  };

  const winnerString = (): string => {
    if (gameState.numberOfBlackDisc - gameState.numberOfWhiteDisc > 0) {
      return `Black is the winner`;
    } else if (gameState.numberOfBlackDisc - gameState.numberOfWhiteDisc < 0) {
      return `White is the winner`;
    } else {
      return `It's a draw`;
    }
  };

  const gameScore = (): string => {
    return `black: ${gameState.numberOfBlackDisc}   white: ${gameState.numberOfWhiteDisc}`;
  };

  const placeDisc = (position: Position) => {
    let gameState = game.placeDisc(position);

    if (gameState !== undefined) {
      setGameState({ ...gameState });
    }

    const newGameState = game.nextTurn();

    if (newGameState !== undefined) {
      setGameState(newGameState);
    }
  };

  const retract = () => {
    const lastGameState = game.retract();

    if (lastGameState !== undefined) {
      setGameState(lastGameState);
    }
  };

  return (
    <Container>
      <GameInfo>{gameStatusString()}</GameInfo>
      <GameInfo>{gameScore()}</GameInfo>
      <Board gameState={gameState} placeDisc={placeDisc} />
      <UtilityButtonContainer>
        <UtilityButton
          onClick={() => setGame(Game.create(8, Michelle.create(Player.White)))}
        >
          New Game
        </UtilityButton>
        <UtilityButton onClick={() => retract()}>Retract</UtilityButton>
      </UtilityButtonContainer>
    </Container>
  );
};

export default Home;
