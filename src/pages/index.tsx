import type { NextPage } from 'next';
import styled from 'styled-components';
import Board from '../components/Board';

const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

const Home: NextPage = () => {
  return (
    <Container>
      <Board />
    </Container>
  );
};

export default Home;
