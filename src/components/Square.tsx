import { SERVER_PROPS_ID } from 'next/dist/shared/lib/constants';
import * as React from 'react';
import styled from 'styled-components';

import Constants from '../constants';
import SquareEnum from '../models/SquareEnum';

const Container = styled.button`
  width: 60px;
  height: 60px;
  border: 1px solid black;
`;

const Disc = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: ${props => props.color};
`;

type SquareProps = {
  onPress(arg1: number, arg2: number): void;
  isPressable: boolean;
  steps?: number;
  disc: SquareEnum;
};

const Square = (props: SquareProps) => {
  const getColor = (state: SquareEnum): string | null => {
    if (state === SquareEnum.black) return 'black';
    if (state === SquareEnum.white) return 'white';
    return null;
  };

  return (
    <Container onClick={props.onPress}>
      <Disc color={getColor(props.disc)} />
    </Container>
  );
};

export default Square;
