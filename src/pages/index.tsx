import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import Select from 'react-select';

import Board from '../components/Board';

import Game from '../models/Game';
import GameState from '../models/GameState';
import Position from '../models/Position';

import Player from '../models/Player';
import Luv from '../AI/Luv';
import Michelle from '../AI/Michelle';
import Joi from '../AI/Joi';
import Rachael from '../AI/Rachael';
import AI from '../AI/AI';

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

interface AIOption {
  value: AI;
  label: string;
}

const Home: NextPage = () => {
  // Don't need a state
  // TODO: remove it later
  const aiOptions: AIOption[] = [
    { value: Luv.create(Player.White), label: Luv.name },
    { value: Michelle.create(Player.White), label: Michelle.name },
    { value: Joi.create(Player.White), label: Joi.name },
    { value: Rachael.create(Player.White), label: Rachael.name },
  ];

  const [currentAI, setCurrentAI] = useState<AI>(aiOptions[0].value);
  const [game, setGame] = useState<Game>(Game.create(8, currentAI));
  const [canPlaceDisc, setCanPlaceDisc] = useState(true);

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
      return `This is ${gameState.player.toString()} player's turn. ${
        gameState.remainingEmptySquare
      } squares left.`;
    }
  };

  const opponentInformation = (): string => {
    if (currentAI instanceof Joi) {
      return `${Joi.name}: ${Joi.description}`;
    } else if (currentAI instanceof Luv) {
      return `${Luv.name}: ${Luv.description}`;
    } else if (currentAI instanceof Rachael) {
      return `${Rachael.name}: ${Rachael.description}`;
    } else if (currentAI instanceof Michelle) {
      return `${Michelle.name}: ${Michelle.description}`;
    } else {
      return '';
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
    if (!canPlaceDisc) return;
    let newGameState = game.placeDisc(position);

    if (newGameState !== undefined) {
      setGameState({ ...newGameState });
      setCanPlaceDisc(false);

      // Without the slight timeout, the setGameState above will be stuck in event loop and causes very poor UX
      setTimeout(() => {
        const newGameStates = game.nextTurn();
        displayAIMoves(newGameStates, 0);
      }, 100);
    }
  };

  const displayAIMoves = (gameStates: GameState[], i: number) => {
    if (gameStates.length > i) {
      setTimeout(() => {
        setGameState(gameStates[i]);
        displayAIMoves(gameStates, i + 1);
      }, 1000);
    } else {
      setCanPlaceDisc(true);
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
      <meta name="viewport" content="width=1024" />
      <GameInfo>{opponentInformation()}</GameInfo>
      <GameInfo>{gameStatusString()}</GameInfo>
      <GameInfo>{gameScore()}</GameInfo>
      <Board gameState={gameState} placeDisc={placeDisc} />
      <UtilityButtonContainer>
        <UtilityButton onClick={() => setGame(Game.create(8, currentAI))}>
          New Game
        </UtilityButton>
        <UtilityButton onClick={() => retract()}>Retract</UtilityButton>
        <Select
          className="basic-single"
          classNamePrefix="select"
          defaultValue={aiOptions[0]}
          isDisabled={false}
          isLoading={false}
          isClearable={false}
          onChange={option => {
            setCurrentAI(option?.value ?? aiOptions[0].value);
            setGame(Game.create(8, option?.value ?? currentAI));
          }}
          isSearchable={false}
          name="color"
          options={aiOptions}
        />
      </UtilityButtonContainer>
    </Container>
  );
};

export default Home;
