import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Lending from "../../../artifacts/contracts/Lending.sol/Lending.json";


const GiveLoan = () => {
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [interest, setInterest] = useState("");
  const [contract, setContract] = useState(null);
  const [proposalID, setProposalID] = useState("");

  const address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"


  useEffect(() => {
    loadWeb3();
    loadAccount();
    loadContract();
    loadProposalID();
  }, []);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      const contractInstance = new ethers.Contract(address, Lending.abi, signer);
      setContract(contractInstance);
    } else {
      alert("Please connect to MetaMask!");
    }
  };

  const loadAccount = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
  };

  const loadContract = async () => {
    if (!window.ethereum) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(address, Lending.abi, signer);
    setContract(contractInstance);
  };

  const loadProposalID = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const param = searchParams.get("borrower");
    setProposalID(param || "");
  };

  const giveLoan = async () => {
    if (!contract) {
      alert("Contract not loaded!");
      return;
    }

    try {
      const tx = await contract.acceptProposal(
        ethers.utils.parseEther(amount),
        interest,
        proposalID,
        { from: account }
      );
      await tx.wait();
      alert("Loan successfully given!");
    } catch (err) {
      console.error("Error processing loan:", err);
      alert("Transaction failed!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    giveLoan();
  };

  return (
    <div className="container-fluid">
      <div className="d-md-flex justify-content-md-center">
        <div className="row">
          <div className="col-md-12 login-area">
            <form onSubmit={handleSubmit}>
              <h3>Hello Lender!</h3>
              <h4>Fill in the details of the loan you would like to lend</h4>
              <div className="form-group">
                <div className="form-group">
                  <p className="nav-item ml-auto">Account no.</p>
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon1">
                      <i className="fas fa-user"></i>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control acc"
                    value={account}
                    placeholder="Account No."
                    aria-label="Account No."
                    aria-describedby="basic-addon1"
                    disabled
                  />
                </div>
              </div>
              <div className="form-group">
                <p className="nav-item ml-auto">Loan Amount</p>
              </div>
              <div className="form-group">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon1">
                      <i className="fab fa-ethereum"></i>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    id="loanAmnt"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Loan Amount"
                    aria-label="Loan Amount"
                    aria-describedby="basic-addon1"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <p className="nav-item ml-auto">Interest</p>
              </div>
              <div className="form-group">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon1">
                      <i className="fas fa-percent"></i>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    id="intrst"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    placeholder="Interest"
                    aria-label="Interest"
                    aria-describedby="basic-addon1"
                    required
                  />
                </div>
              </div>

              <br />
              <div>
                <button type="submit" className="btn btn-success btn-lg btn-block">
                  <i className="fas fa-hand-holding-usd"></i> Give Loan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiveLoan;
