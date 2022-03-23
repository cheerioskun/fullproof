import React from 'react'
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
`;
const Button = styled.div`
  background-color: #f24438;
  height: 70px;
  display: grid;
  color: white;
  align-content: center;
  justify-content: center;
  font-weight: bold;
  width: 200px;
  transition: 0.5s;
  :hover {
    cursor: pointer;
    background-color: #f55247;
  }
`;

const Center = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Input = styled.input`
  border: none;
  color: #dbd3d3;
  font-size: 3em;
  width: 300px;
  height: 100px;

  :focus {
    outline: none;
  }
`;
const VerifyComponent = () => {
  return (
    <Container>
      <Center>
        <Input type='text' placeholder='enter hash' />
        <Button>Verify</Button>
        <p>Success/Failure Feedback</p>
      </Center>
    </Container>
  )
}

export default VerifyComponent