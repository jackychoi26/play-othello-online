import styled from 'styled-components';

import SquareState from '../models/SquareState';

const Container = styled.button`
  width: 60px;
  height: 60px;
  border: 1px solid black;
  padding: 0px 0px 0px 0px;
  flex: 1;
  background-color: ${(props: ColorProps) => props.color};
`;

const Disc = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-left: 4px;
  background-color: ${(props: ColorProps) => props.color};
`;

type ColorProps = {
  color: string;
};

type SquareProps = {
  onPress(): void;
  steps?: number;
  disc: SquareState;
  shouldHighLightSquare: boolean;
};

const Square = (props: SquareProps) => {
  const getColorForDisc = (state: SquareState): string | null => {
    if (state === SquareState.black) return 'black';
    if (state === SquareState.white) return 'white';
    return null;
  };

  const getColorForSquare = (shouldHighlightSquare: boolean): string => {
    return shouldHighlightSquare ? 'green' : '';
  };

  return (
    <Container
      color={getColorForSquare(props.shouldHighLightSquare)}
      onClick={() => props.onPress()}
    >
      <Disc color={getColorForDisc(props.disc) ?? ''} />
    </Container>
  );
};

export default Square;
