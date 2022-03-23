import { ethers } from 'ethers';
import React from 'react'
import styled from 'styled-components';
import { useProvider } from 'wagmi';
import FullProof from '../app/fullproofAbi.json'

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
  const provider = useProvider();
  const [file, setFile] = React.useState(null);
  const fileRef = React.useRef<any>(null);

  function onFileChange(e: any) {
    const file = e.target.files[0];
    console.log(file)
    setFile(file);
    fileToDataUri(file)
    .then(dataUri => {
      console.log(dataUri);
      const messageBytes = ethers.utils.toUtf8Bytes(dataUri as string);
      const hash = ethers.utils.keccak256(messageBytes);  
      console.log(hash); // use this has to commit 
    })
  }

  async function handleCommit() {

    try {
        const contract = new ethers.Contract('0x5E16789609423DFf198c6b38547039d3d8932625',FullProof);
        const withProvider = contract.connect(provider);
        
       const a = await withProvider.verify('sds', 'dsd');
       console.log(a)
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <Container>
      <Center>
        {file?<>
        <i className="fa-solid fa-file-pdf file-icon"></i>
        <Button onClick={handleCommit}>Commit</Button>
        <p>Success/Failure Feedback</p>
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