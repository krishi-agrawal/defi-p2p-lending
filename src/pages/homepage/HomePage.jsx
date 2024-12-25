import { Link } from "react-router-dom";
import "./HomePage.css"
const HomePage = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Section */}
      <div className="bg"></div>

<div className="star-field">
<div className="layer"></div>
<div className="layer"></div>
<div className="layer"></div></div>

      {/* Right Section */}
      <div className="md:w-1/3 bg-black flex flex-col justify-center items-center p-8">
        <form className="w-full max-w-md text-center">
          <h4 className="text-xl font-semibold mb-4 text-white">
            We build trust.
          </h4>
          <h4 className="text-xl font-semibold mb-8 text-white">
            We ensure peer-to-peer lending with mortgage-security-based
            guarantee.
          </h4>

          <Link
            to="/borrow"
            className="block w-full bg-blue-500 text-white text-lg font-medium py-3 rounded-lg shadow hover:bg-blue-600 mb-4"
          >
            <i className="fas fa-search-dollar mr-2"></i> Need Money
          </Link>

          <Link
            to="/lend"
            className="block w-full bg-green-500 text-white text-lg font-medium py-3 rounded-lg shadow hover:bg-green-600"
          >
            <i className="fas fa-hand-holding-usd mr-2"></i> Invest Money
          </Link>
        </form>
      </div>
    </div>
  );
};

export default HomePage
