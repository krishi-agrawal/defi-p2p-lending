import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Lending from "../../../artifacts/contracts/Lending.sol/Lending.json";

const Verify = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [proposalID, setProposalID] = useState("");
  const [proposal, setProposal] = useState(null);

  const address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  useEffect(() => {
    loadWeb3();
    loadProposalID();
  }, []);

  useEffect(() => {
    if (contract && proposalID) {
      fetchProposal();
    }
  }, [contract, proposalID]);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      const contractInstance = new ethers.Contract(
        address,
        Lending.abi,
        signer
      );
      setContract(contractInstance);
    } else {
      alert("Please connect to MetaMask!");
    }
  };

  const loadProposalID = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const param = searchParams.get("proposalId");
    setProposalID(param || "");
  };

  const fetchProposal = async () => {
    try {
        const proposals = await contract.getAllProposals()
        for (const proposalData of proposals ){
            if(proposalData.proposalId == proposalID){
                setProposal({
                    proposalId: proposalData.proposalId.toString(),
                    borrower: proposalData.borrower,
                    amount: proposalData.amount.toString(),
                    time: new Date(proposalData.time.toNumber() * 1000).toLocaleString(),
                    mortgage: proposalData.mortgage,
                    state: proposalData.state,
                    sendMoney: proposalData.sendMoney,
                  });
            }
        }
      
    } catch (error) {
      console.error("Error fetching proposal:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Verify Proposal</h2>
        {account && (
          <p className="text-green-600 text-center mb-4">
            Wallet Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </p>
        )}
        {proposal ? (
          <div className="space-y-4">
            <p><strong>Proposal ID:</strong> {proposal.proposalId}</p>
            <p><strong>Borrower:</strong> {proposal.borrower}</p>
            <p><strong>Amount Requested:</strong> {proposal.amount} ETH</p>
            <p><strong>Time Created:</strong> {proposal.time}</p>
            <p>
              <strong>Mortgage File:</strong>{" "}
              <a
                href={`https://ipfs.io/ipfs/${proposal.mortgage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View File
              </a>
            </p>
            <p><strong>State:</strong> {proposal.state}</p>
            <p><strong>Send Money:</strong> {proposal.sendMoney ? "Yes" : "No"}</p>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading proposal details...</p>
        )}
      </div>
    </div>
  );
};

export default Verify;
