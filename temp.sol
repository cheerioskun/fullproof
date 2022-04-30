// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;


/* 
 * @title CommitStore
 * @dev Implements hash committing for arbitrary files
*/

contract FileStore {
    struct File {
        // Name of the uploaded file (not used anywhere right now)
        string fileName;
        // Keccak256 hash of the uploaded file
        string fileHash;
        // Metadata as a string for now
        string metadata;
        // Address of the account that uploaded this file
        address uploader;
    }

    event FileUpload(string hash, string filename, address uploader);
    address admin;
    mapping(address => File[]) masterStore;
    mapping(string => File) index;
    // Will add more things as they come
    modifier adminOnly {
        require(msg.sender == admin);
        _;
    }
    constructor() {
        admin = msg.sender;
    }
    function upload(string calldata hash, 
                    string calldata filename, 
                    string calldata metadata) public {

        File memory file;
        file.fileHash = hash;
        file.fileName = filename;
        file.metadata = metadata;
        file.uploader = msg.sender;
        masterStore[msg.sender].push(file);
        index[hash] = file;
        emit FileUpload(hash, filename, msg.sender);
    }
    
    // verify verifies whether a file exists and whether the hash and filename matches
    function verify(string calldata hash, string calldata filename) public view returns (bool){
        return keccak256(abi.encodePacked(index[hash].fileHash)) == keccak256(abi.encodePacked(hash)) && keccak256(abi.encodePacked(filename)) == keccak256(abi.encodePacked(index[hash].fileName)); 
    }

}

 