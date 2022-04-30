import React from 'react'
import { useConnect, useAccount, Connector } from "wagmi";
import styled from 'styled-components'
type Props = {}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  padding: 1%;
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
<Container>
  <div style={{width: "80%"}}></div>
  <button className="neon-button" onClick={accountData? disconnectWallet: connectWallet}>
      {accountData? getAddress(): 'Connect'}
  </button>
</Container>
  )
}

export default Connect