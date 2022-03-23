import React from 'react'
import { useConnect, useAccount, Connector } from "wagmi";
import styled from 'styled-components'
type Props = {}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;
const Title = styled.h1`
    color: #f24438;
    font-weight: bold;
    font-size: 3em;
    margin-left: 0.2em;
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

  :hover {
    cursor: pointer;
    background-color: #f55247;
  }
`;
const Connect = (props: Props) => {
  const [{ data: connectData, loading: connectDataLoading, error }, connect] = useConnect();
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  });

  function connectWallet() {
    connect(connectData.connectors[0]);
  }

  function disconnectWallet() {
    disconnect();
  }
  
  function getAddress() {
    console.log(accountData)
    if(accountData?.ens) {
      return accountData.ens.name;
    } else {
      return accountData?.address.slice(0,5)+'...'+accountData?.address.slice(39);
    }
  }

  return ( // plij dont write code like this in your job you will be kicked off :3
//    connectDataLoading? <p>Loading</p> : accountData? <><p>{accountData.address}</p> <button onClick={disconnectWallet}>
//      disconnect
//    </button></>:<button 
//    onClick={connectWallet}
// 
//    Connect
//  </button>

<Container>
  <Title>
    FullProof
  </Title>
  <Button onClick={accountData? disconnectWallet: connectWallet}>
      {accountData? getAddress(): 'Connect'}
  </Button>
</Container>
  )
}

export default Connect