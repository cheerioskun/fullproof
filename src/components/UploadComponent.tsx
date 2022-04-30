import { ethers } from 'ethers';
import React from 'react'
import styled from 'styled-components';
import { useNetwork, useProvider } from 'wagmi';
import FullProof from '../app/fullproofAbi.json'
import buffer from 'buffer/' 
import { CONFIG } from '../app/config';
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
  text-align: center;
`;

const Text = styled.p`
  color: #f24438;
`;

const Link = styled.a`
  text-decoration: none;
  color: #f24438;

  :hover {
    cursor: pointer;
  }
`;
const Input = styled.input`
  border: none;
  color: #dbd3d3;
  font-size: 3em;
  width: 400px;
  height: 100px;

  :focus {
    outline: none;
  }
`;

/**
 * Converts to base64 uri
 * @param file 
 * @returns {void}
 */
 const fileToDataUri = (file: any) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    if(event && event.target) {
      resolve(event.target.result)
    } 
  };
  reader.readAsDataURL(file);
  });


const UploadComponent = () => {
  // const provider = useProvider();
  const [file, setFile] = React.useState(null);
  const [hash, setHash] = React.useState('');
  const [txHash, setTxHash] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const fileRef = React.useRef<any>(null);

  async function onFileChange(e: any) {
    const file = e.target.files[0];
    console.log(file)
    setFile(file);
    const dataURI = await fileToDataUri(file)

    // get array buffer
    const res = await fetch(dataURI as string);
    const blob = await res.blob();
    const arrayBuffer = await blob.arrayBuffer();

    // get buffer string 
    const Buffer = buffer.Buffer; 
    const fileBuffer = Buffer.from(arrayBuffer);
    const fileBufferString = fileBuffer.toString()

    // build sha3 hash
    const messageBytes = ethers.utils.toUtf8Bytes(fileBufferString);
    const hash = ethers.utils.keccak256(messageBytes);  
    setHash(hash); // use this has to commit 

  }

  async function handleCommit() {

    try {
         const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        const contract = new ethers.Contract(CONFIG.full_proof_address ,FullProof, provider);
        const contractWithSigner = contract.connect(provider.getSigner())
        // dont do these any stunts plij typescript exists for a purpose 

        const args = [
          hash,
          (file as any).name,
          JSON.stringify({
            size: (file as any).size,
            lastModified: (file as any).lastModified
          })
        ]
        setLoading(true);
        const tx = await contractWithSigner.upload(...args);
        const receipt = await tx.wait();
        console.log(receipt)
        setTxHash(receipt.transactionHash);
        setLoading(false);

    } catch (error) {
        console.log(error)
    }
  }

  return (
    <Container>
      <Center>
        {file?<>
   
        {!txHash && 
        <>
        <i className="fa-solid fa-file-pdf file-icon"></i>
        <Button onClick={loading? ()=>{} : handleCommit}>{loading? 'Committing...': 'Commit'}</Button> 
        </>
        }
        {txHash && <>
        <i className="fa-solid fa-check file-icon"></i>
        <div>
        <Link href={`https://ropsten.etherscan.io/tx/${txHash}`}>View on blockexplorer</Link>
        </div>
        <Text>File Hash: {hash}</Text>
        </>}
        </>:
        <>
        <i onClick={()=> fileRef.current.click()} className="fa-solid fa-upload upload-icon"></i>
        <Input ref={fileRef} style={{ display: "none" }} type='file' accept="application/pdf" placeholder='enter hash' onChange={onFileChange} />
        </>
        }
      </Center>
    </Container>
  )
}

export default UploadComponent