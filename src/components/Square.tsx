import { SERVER_PROPS_ID } from 'next/dist/shared/lib/constants';
import * as React from 'react';
import styled from 'styled-components';

import Constants from '../constants';

const Container = styled.button`
  width: 60px;
  height: 60px;
  border: 1px solid black;
  /* background-color: ${Constants.colors.boardColor}; */
`;

const Disc = styled.div`
  width: 50px;
  height: 50px;
  margin: 5px;
  color: ${(props: SquareProps) => props.disc};
`;

type SquareProps = {
  onPress(): boolean;
  steps?: number;
  disc?: 'black' | 'white';
};

const Square = (props: SquareProps) => {
  return (
    <Container onClick={props.onPress}>
      <Disc />
    </Container>
  );
};

export default Square;
