import { ethers } from 'ethers';
import React from 'react'
import styled from 'styled-components';
import { CONFIG } from '../app/config';
import FullProofAbi from '../app/fullproofAbi.json'

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
const VerifyComponent = () => {
  const [fileHash, setFileHash] = React.useState('');
  const [fileName, setFileName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isVerified, setIsVerified] = React.useState('');

  async function handleVerify() {
    setLoading(true);
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const contract = new ethers.Contract(CONFIG.full_proof_address, FullProofAbi, provider);
    const a = await provider.getCode(CONFIG.full_proof_address);
    console.log(a)
    const isVerified = await contract.verify(fileHash, fileName);
    console.log(isVerified)
    setIsVerified(isVerified? 'Verification Passed': 'Verification Failed');
    setLoading(false);
  }
  return (
    <Container>
      <Center>
        <div></div>
        <Input type='text' placeholder='enter file name' onChange={(e) => setFileName(e.target.value)} />
        <div>
          <Input type='text' placeholder='enter hash' onChange={(e) => setFileHash(e.target.value)} />
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <button
            onClick={handleVerify}
          >{loading? 'Verifying...': 'Verify'}</button>
        </div>
        {isVerified && <p>{isVerified}</p>}
      </Center>
    </Container>
  )
}

export default VerifyComponent