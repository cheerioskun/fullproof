// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

/* 
 * @title CommitStore
 * @dev Implements hash committing for arbitrary files
*/

contract FileStore is ChainlinkClient{
    using Chainlink for Chainlink.Request;
    enum FileState {
            Committed,
            Revealed,
            Compromised
        }
    struct File {
        
        bool exists;
        // Name of the uploaded file (not used anywhere right now)
        string fileName;
        // Keccak256 hash of the uploaded file
        string fileHash;
        // Metadata as a string for now
        string metadata;
        // Address of the account that committed this file
        address committer;
        // State of the current file
        FileState state;
        // URI for the remote resource that contains the file
        string uri;
    }
    
    event FileCommit(string hash, string filename, address committer);
    event FileReveal(string hash, string filename, string uri, address revealer);
    event FileCompromise(string hash, string filename, string uri, address reporter);
    address public admin;
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    // Used to store the list of hashes a user has committed to the database
    mapping(address => string[]) public masterStore;
    mapping(string => File) public index;
    // Queue and functions to maintain oracle job positions
    struct VerificationRequest {
        string hashToCheck;
        address petitioner;
        string resourceURI;
    }
    mapping(uint256 => VerificationRequest) public queue;
    uint256 public first = 1;
    uint256 public last = 0;

    function enqueue(VerificationRequest memory data) internal {
        last += 1;
        queue[last] = data;
    }

    function dequeue() internal returns (VerificationRequest memory data) {
        require(last >= first);  // non-empty queue
        data = queue[first];
        delete queue[first];
        first += 1;
    }

    // Will add more things as they come
    modifier adminOnly {
        require(msg.sender == admin);
        _;
    }
    modifier notExists(string calldata hash) {
        require(index[hash].exists == false, "Hash already exists in database");
        _;
    }
    
    modifier exists(string calldata hash) {
        require(index[hash].exists == true, "Hash does not exist in database");
        _;
    }
    constructor() {
        setPublicChainlinkToken();
        oracle = 0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e;
        jobId = "29fa9aa13bf1468788b7cc4a500a45b8";
        fee = 0.1 * 10 ** 18; // 0.1 LINK

        admin = msg.sender;
    }

    // Used to commit a hash with associated metadata onto the chain
    function commit(string calldata hash, 
                    string calldata filename, 
                    string calldata metadata) notExists(hash) public {

        File memory file;
        file.fileHash = hash;
        file.fileName = filename;
        file.metadata = metadata;
        file.committer = msg.sender;
        file.state = FileState.Committed;
        file.exists = true;
        masterStore[msg.sender].push(hash);
        index[hash] = file;
        emit FileCommit(hash, filename, msg.sender);
    }
    // Used to reveal a file or report a verifiable file leak
    function reveal(string calldata hash, string calldata uri) exists(hash) public returns (bytes32 requestId) { 
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        string memory LAMBDA_URL = "https://nv9wf3zemh.execute-api.us-west-2.amazonaws.com/dev/?url=";
        string memory DELIMIT = "&hash=";
        string memory s = appendString(LAMBDA_URL, uri, DELIMIT, hash);
        req.add("get", s);
        req.add("path", "match");
        req.addInt("times", 1);
        enqueue(VerificationRequest(hash, msg.sender, uri));
        return sendChainlinkRequestTo(oracle, req, fee);
    }
    function appendString(string memory _a, string memory _b, string memory _c, string memory _d) internal pure returns (string memory)  {
        return string(abi.encodePacked(_a, _b, _c, _d));
    }   

    function fulfill(bytes32 requestId, uint256 result) public recordChainlinkFulfillment(requestId) {
        VerificationRequest memory vr = dequeue();
        string memory hash = vr.hashToCheck;
        if(result == 1){
            if(index[hash].state == FileState.Committed){
                if(index[hash].committer == vr.petitioner){
                    // Self Reveal
                    index[hash].uri = vr.resourceURI;
                    index[hash].state = FileState.Revealed;
                    File memory f = index[hash];
                    emit FileReveal(f.fileHash, f.fileName, f.uri, vr.petitioner);
                } else {
                    index[hash].uri = vr.resourceURI;
                    index[hash].state = FileState.Compromised;
                    File memory f = index[hash];
                    emit FileCompromise(f.fileHash, f.fileName, f.uri, vr.petitioner);
                }
            }
        }
    }
    // Withdraw link token from contract
    function withdrawLink() external {
        LinkTokenInterface linkToken = LinkTokenInterface(chainlinkTokenAddress());
        require(linkToken.transfer(msg.sender, linkToken.balanceOf(address(this))), "Unable to transfer");
    }


}

 