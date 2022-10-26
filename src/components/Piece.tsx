import * as React from 'react';
import styled from 'styled-components';

type PieceProps = {
  steps: string;
};

const Container = styled.div`
  width: 60px;
  height: 60px;
  background-color: yellow;
`;

const Piece = (boardProps: PieceProps) => {
  return <Container></Container>;
};

export default Piece;
