import * as React from 'react';
import styled from 'styled-components';

type DiskProps = {
  steps: string;
};

const Container = styled.div`
  width: 50px;
  height: 50px;
  background-color: yellow;
`;

const Disk = (boardProps: DiskProps) => {
  return <Container></Container>;
};

export default Disk;
