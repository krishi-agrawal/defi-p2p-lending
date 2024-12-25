import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import Lending from "../../../artifacts/contracts/Lending.sol/Lending.json";

const LoanStates = {
  0: "REPAID",
  1: "ACCEPTED",
  2: "WAITING",
  3: "PAID",
  4: "FAILED",
};

const App = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [loans, setLoans] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    date: "",
    mortgage: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(ethersProvider);
    } else {
      alert("Please install MetaMask!");
    }
  }, []);

  const connectWallet = async () => {
    if (provider) {
      try {
        const accounts = await provider.send("eth_requestAccounts", []);
        const ethersSigner = provider.getSigner();
        setSigner(ethersSigner);
        setAccount(accounts[0]);

        const contractInstance = new ethers.Contract(
          "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
          Lending.abi,
          ethersSigner
        );
        setContract(contractInstance);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    }
  };

  useEffect(() => {
    const fetchLoans = async () => {
      if (contract) {
        try {
          const allLoans = await contract.getAllPotentialLenders();
          console.log("potential lender:", allLoans)
          setLoans(allLoans);
        } catch (error) {
          console.error("Error fetching loans:", error);
        }
      }
    };

    fetchLoans();
  }, [contract]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadToPinata = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload!");
      return null;
    }

    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    const apiKey = "89e6667c96265f5989a1";
    const apiSecret = "9c0a0aee0a7507daad27afee003f4fd5411c4bbcd9dc28f4608aa5a592393029";

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(url, formData, {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: apiKey,
          pinata_secret_api_key: apiSecret,
        },
      });

      const ipfsHash = response.data.IpfsHash;
      alert("File uploaded successfully to IPFS!");
      return ipfsHash;
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      alert("Error uploading file to IPFS.");
      return null;
    }
  };

  const createProposal = async (e) => {
    e.preventDefault();

    if (contract) {
      const { amount, date } = form;
      const dueDate = Math.floor(new Date(date).getTime() / 1000);

      const mortgageIpfsHash = await uploadToPinata();
      if (!mortgageIpfsHash) return;

      try {
        const tx = await contract.createProposal(amount, dueDate, mortgageIpfsHash);
        await tx.wait();
        setForm({ amount: "", date: "", mortgage: "" });
        setSelectedFile(null);
      } catch (error) {
        console.error("Error creating proposal:", error);
      }
    }
  };


  const acceptLoan = async (loan) => {
    if (contract) {
      try {
        const tx = await contract.acceptLender(loan.loanId, loan.proposalId);
        await tx.wait();
        alert("Loan accepted successfully!");
      } catch (error) {
        console.error("Error accepting loan:", error);
      }
    }
  };

  const repayLoan = async (loan) => {
    if (contract) {
      try {
          const lender = loan.lender;
          const loanAmount = loan.loanAmount.toString();

          console.log("Lender:", lender);
          console.log("Sender:", account);
          console.log("Amount:", loanAmount.toString());

          const transaction = await provider.getSigner().sendTransaction({
            to: lender,
            value: loanAmount,
          });

          await transaction.wait();
          alert("Loan amount sent successfully!");
      } catch (error) {
        console.error("Error repaying loan:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 shadow-md rounded-md mb-8">
        {!account ? (
          <button
            onClick={connectWallet}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mb-4"
          >
            Connect to MetaMask
          </button>
        ) : (
          <p className="text-green-600 text-center mb-4">
            Wallet Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </p>
        )}

        <h3 className="text-2xl font-bold mb-4 text-center text-blue-600">Submit Loan Proposal</h3>
        <form onSubmit={createProposal} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Loan Amount</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter amount"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Due Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Upload Mortgage Document</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Submit Proposal
          </button>
        </form>
      </div>

      <div className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-md">
        <h3 className="text-2xl font-bold mb-4 text-center text-blue-600">Loan Offers</h3>
        <div className="space-y-4">
          {loans.map((loan, index) => (
            <div
              key={index}
              className="border p-4 rounded-md bg-gray-50 flex justify-between items-center"
            >
              <div>
                <p><strong>Lender:</strong> {loan.lender}</p>
                <p><strong>Amount:</strong> {ethers.utils.formatEther(loan.loanAmount)} ETH</p>
                <p><strong>Interest:</strong> {loan.interestRate.toString()}%</p>
                <p><strong>State:</strong> {LoanStates[loan.state]}</p>
              </div>
              <div className="space-x-2">
                {loan.state === 2 && (
                  <button
                    onClick={() => acceptLoan(loan)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Accept Loan
                  </button>
                )}
                {loan.state === 3 && (
                  <button
                    onClick={() => repayLoan(loan)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Repay Loan
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
