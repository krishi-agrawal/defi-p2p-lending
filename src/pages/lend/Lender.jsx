import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import Lending from "../../../artifacts/contracts/Lending.sol/Lending.json";

const ProposalState = {
  0: "ACCEPTED",
  1: "ACCEPTING",
  2: "WAITING",
};

const address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const Lender = () => {
  const [account, setAccount] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchData = async () => {
    try {
      const providerInstance = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(providerInstance);

      const accounts = await providerInstance.send("eth_requestAccounts", []);
      setAccount(accounts[0]);

      const signer = providerInstance.getSigner();
      const contractInstance = new ethers.Contract(address, Lending.abi, signer);
      setContract(contractInstance);

      const proposalsList = await contractInstance.getAllProposals();
      setProposals(proposalsList);
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProposals = proposals.filter((proposal) => {
    if (filter === "all") return true;
    return ProposalState[proposal.state] === filter;
  });

  const handleSendMoney = async (proposalId) => {
    console.log("hi")
    try {
      const loans = await contract.getAllLoans();
      console.log("loans:", loans)
      for (const loan of loans) {
        if (loan.proposalId.toString() === proposalId.toString()) {
          const borrower = await contract.proposalToBorrower(loan.proposalId);
          const loanAmount = ethers.utils.parseEther(loan.loanAmount.toString());

          console.log("Borrower:", borrower);
          console.log("Sender:", account);
          console.log("Amount:", loanAmount.toString());

          const transaction = await provider.getSigner().sendTransaction({
            to: borrower,
            value: loanAmount,
          });

          await transaction.wait();
          alert("Loan amount sent successfully!");
        }
      }
    } catch (error) {
      console.error("Error sending money:", error);
    }
  };

  const handleRevokeMortgage = async (proposalId) => {
    try {
      const transaction = await contract.revokeMortgage(proposalId);
      await transaction.wait();
      alert("Mortgage revoked successfully!");
    } catch (error) {
      console.error("Error revoking mortgage:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col items-center mb-6">
        <h3 className="text-4xl font-bold text-gray-800">Hello Lender!</h3>
        <h4 className="text-xl text-gray-600 mt-2">
          You can look for borrowers to lend loans to here!
        </h4>
      </div>
      <div className="mb-4">
        <button onClick={() => setFilter("all")} className="mr-2 p-2 bg-blue-500 text-white rounded">
          All
        </button>
        <button
          onClick={() => setFilter("ACCEPTED")}
          className="mr-2 p-2 bg-green-500 text-white rounded"
        >
          Accepted
        </button>
        <button
          onClick={() => setFilter("ACCEPTING")}
          className="mr-2 p-2 bg-yellow-500 text-white rounded"
        >
          Accepting
        </button>
        <button
          onClick={() => setFilter("WAITING")}
          className="mr-2 p-2 bg-red-500 text-white rounded"
        >
          Waiting
        </button>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 border border-gray-300">Borrower Address</th>
              <th className="px-4 py-2 border border-gray-300">Amount</th>
              <th className="px-4 py-2 border border-gray-300">Due Date</th>
              <th className="px-4 py-2 border border-gray-300">Actions</th>
              <th className="px-4 py-2 border border-gray-300">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredProposals.map((proposal, index) => {
              const date = new Date(proposal.time.toNumber() * 1000);
              const dueDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
              return (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  <td className="px-4 py-2 border border-gray-300">{proposal.borrower}</td>
                  <td className="px-4 py-2 border border-gray-300">
                    {ethers.utils.formatEther(proposal.amount)} ETH
                  </td>
                  <td className="px-4 py-2 border border-gray-300">{dueDate}</td>
                  {ProposalState[proposal.state] === "WAITING" && (
                      <Link
                        to={`/giveLoan?borrower=${proposal.proposalId}`}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Give Loan
                      </Link>
                    )}
                  <td className="px-4 py-2 border border-gray-300 space-x-2">
                    {ProposalState[proposal.state] === "ACCEPTED" && (
                        <button
                        onClick={() => handleSendMoney(proposal.proposalId)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Send Money
                      </button>
                    )}
                    {/* {ProposalState[proposal.state] === "ACCEPTING" && (
                      
                    )} */}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">{ProposalState[proposal.state]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Lender;


{/* <button
                        onClick={() => handleRevokeMortgage(proposal.proposalId.toString())}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                      >
                        Revoke Mortgage
                      </button> */}