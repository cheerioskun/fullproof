import { ethers } from 'ethers';
import React from 'react'
import styled from 'styled-components';
import { CONFIG } from '../app/config';
import FullProof from '../app/fullproofAbi.json'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`;

const Center = styled.div`
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const Input = styled.input`
  border: none;
  color: #dbd3d3;
  font-size: 3em;
  text-align: center;
  width: 400px;
  height: 100px;
  background: transparent;
  border: 2px solid grey;
  border-radius: 0.5em;
  margin: 0.5em;
  :focus {
    outline: none;
  }
`;
const ReportComponent = () => {
  const [fileHash, setFileHash] = React.useState('');
  const [fileUri, setFileUri] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isReported, setIsReported] = React.useState('');

  async function handleReport() {
    setLoading(true);
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const contract = new ethers.Contract(CONFIG.full_proof_address, FullProof, provider);
    const contractWithSigner = contract.connect(provider.getSigner());
    const tx = await contractWithSigner.reveal(fileHash, fileUri);
    const receipt = await tx.wait();
    console.log(receipt);
    setIsReported(receipt? 'Report Txn Confirmed': 'Report Txn Failed');
    setLoading(false);
  }
  return (
    <Container>
      <Center>
        <div></div>
        <Input type='text' placeholder='enter uri' onChange={(e) => setFileUri(e.target.value)} />
        <div>
          <Input type='text' placeholder='enter hash' onChange={(e) => setFileHash(e.target.value)} />
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <button
            className="neon-button xtra-padding"
            onClick={handleReport}
          >{loading? 'Reporting..': 'Report/Reveal'}</button>
        </div>
        {isReported && <p>{isReported}</p>}
      </Center>
    </Container>
  )
}

export default ReportComponent