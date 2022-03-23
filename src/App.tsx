import React from 'react';
import styled from 'styled-components';
import { Provider, chain, defaultChains } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { WalletLinkConnector } from "wagmi/connectors/walletLink";
import Connect from './components/Connect';
import UploadComponent from './components/UploadComponent';
import VerifyComponent from './components/VerifyComponent';

const Footer = styled.div<{commit: boolean}>`
  justify-content: ${props=> props.commit? 'flex-start': 'flex-end'};
  display: flex;
`;
export const Button = styled.div`
  background-color: #f24438;
  height: 100px;
  width: 200px;
  display: grid;
  align-content: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  flex-direction: row;
  :hover {
    cursor: pointer;
    background-color: #f55247;
  }
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
`;

const chains = defaultChains;

type Connector =
  | InjectedConnector
  | WalletConnectConnector
  | WalletLinkConnector;

const connectors = ({ chainId }: { chainId?: number }): Connector[] => {
  return [
    new InjectedConnector({ chains })
  ];
};

enum SCREEN {
  HOME ='HOME',
  COMMIT = 'COMMIT'
}

function App() {
  const [screen, setScreen] = React.useState(SCREEN.HOME);

  function moveCommit() {
    setScreen(SCREEN.COMMIT);
  }

  function moveBack() {
    setScreen(SCREEN.HOME);
  }

  function isCommit() {
    return screen === SCREEN.COMMIT;
  } 

  function renderComponent() {
    switch(screen) {
      case SCREEN.COMMIT: 
        return <UploadComponent />
      case SCREEN.HOME:
        return <VerifyComponent />
      default:
        return <VerifyComponent />
    }
  }

  return (
  <Provider autoConnect connectors={connectors}>
    <Container>
      <Connect />
      {/* <UploadFile /> */}
      {renderComponent()}
      <Footer commit={screen === SCREEN.COMMIT}>
        <Button onClick={isCommit()? moveBack:moveCommit}>
            {
              isCommit()? <p><i className="fa-solid fa-arrow-left fa-1x"></i> Back</p>:
              <p>Commit <i className="fa-solid fa-arrow-right fa-1x"></i></p>
            } 
        </Button>
      </Footer>
    </Container>
  </Provider>
  );
}

export default App;
