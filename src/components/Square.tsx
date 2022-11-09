import styled from 'styled-components';

import SquareState from '../models/SquareState';

const Container = styled.button`
  width: 60px;
  height: 60px;
  border: 1px solid black;
  padding: 0px 0px 0px 0px;
  flex: 1;
`;

const Disc = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-left: 4px;
  background-color: ${(props: DiscProps) => props.color};
`;

type DiscProps = {
  color: string;
};

type SquareProps = {
  onPress(): void;
  isPressable: boolean;
  steps?: number;
  disc: SquareState;
};

const Square = (props: SquareProps) => {
  const getColor = (state: SquareState): string | null => {
    if (state === SquareState.black) return 'black';
    if (state === SquareState.white) return 'white';
    return null;
  };

  return (
    <Container onClick={() => props.onPress()}>
      <Disc color={getColor(props.disc) ?? ''} />
    </Container>
  );
};

export default Square;
