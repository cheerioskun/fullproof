import { ethers, utils } from "ethers";
import React from "react";
import styled from "styled-components";
import { useNetwork, useProvider } from "wagmi";
import FullProof from "../app/fullproofAbi.json";
import buffer from "buffer/";
import { CONFIG } from "../app/config";
import toast, { Toaster } from "react-hot-toast";
const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
`;


const Center = styled.div`
  text-align: center;
`;

const Text = styled.p`
  color: #4cbadbc4;
`;

const Link = styled.a`
  text-decoration: none;
  color: #4cbadbc4;

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
const fileToDataUri = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event && event.target) {
        resolve(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  });

const CommitComponent = () => {
  // const provider = useProvider();
  const [file, setFile] = React.useState(null);
  const [hash, setHash] = React.useState("");
  const [txHash, setTxHash] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const fileRef = React.useRef<any>(null);

  async function onFileChange(e: any) {
    const file = e.target.files[0];
    console.log(file);
    setFile(file);
    const dataURI = await fileToDataUri(file);

    // get array buffer
    const res = await fetch(dataURI as string);
    const blob = await res.blob();
    const arrayBuffer = await blob.arrayBuffer();

    // get buffer string
    const Buffer = buffer.Buffer;
    const fileBuffer = Buffer.from(arrayBuffer);
    const fileBufferString = fileBuffer.toString();

    // build sha3 hash
    const messageBytes = ethers.utils.toUtf8Bytes(fileBufferString);
    const hash = ethers.utils.keccak256(messageBytes);
    setHash(hash); // use this hash to commit
  }

  async function handleCommit() {
    try {
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      const contract = new ethers.Contract(
        CONFIG.full_proof_address,
        FullProof,
        provider
      );
      const filter = {
        address: CONFIG.full_proof_address,
        topics: ["0x2ab43125e2cdef6ac6540057e6a588cdb841c5e6ad3b68e82fdbe9a348ce5d8a"],
      };
      provider.on(filter, (log, event) => {
        toast("File Committed!");
      });
      const contractWithSigner = contract.connect(provider.getSigner());
      const args = [
        hash,
        (file as any).name,
        JSON.stringify({
          size: (file as any).size,
          lastModified: (file as any).lastModified,
        }),
      ];
      setLoading(true);
      const tx = await contractWithSigner.commit(...args);
      const receipt = await tx.wait();
      console.log(receipt);
      setTxHash(receipt.transactionHash);
      
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container>
      <Center>
        {file ? (
          <>
            {!txHash && (
              <>
                <i className="fa-solid fa-file-pdf file-icon"></i>
                <button className="neon-button xtra-padding" onClick={loading ? () => {} : handleCommit}>
                  {loading ? "Committing..." : "Commit"}
                </button>
              </>
            )}
            {txHash && (
              <>
                <i className="fa-solid fa-check file-icon" onClick={()=>{toast.success("Hi")}}></i>
                <div>
                  <Link href={`https://kovan.etherscan.io/tx/${txHash}`}>
                    View on blockexplorer
                  </Link>
                </div>
                <Text>File Hash: {hash}</Text>
              </>
            )}
          </>
        ) : (
          <>
            <i
              onClick={() => fileRef.current.click()}
              className="fa-solid fa-upload upload-icon"
            ></i>
            <Input
              ref={fileRef}
              style={{ display: "none" }}
              type="file"
              accept="application/pdf"
              placeholder="enter hash"
              onChange={onFileChange}
            />
          </>
        )}
      </Center>
      <Toaster
        position="top-left"
        reverseOrder={false}
        gutter={16}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
    </Container>
  );
};

export default CommitComponent;
