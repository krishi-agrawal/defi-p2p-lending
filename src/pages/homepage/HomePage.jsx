import { Link } from "react-router-dom";
import { TbZoomMoney } from "react-icons/tb";
import { GiReceiveMoney } from "react-icons/gi";


import "./HomePage.css";
const HomePage = () => {
  return (
    // <div className="flex flex-col md:flex-row min-h-screen">
    <section id="accueil" className="flex justify-center items-center">
      <div className="triangle_rose"></div>
      <div className="triangle_vert"></div>
      <div className="flex justify-center items-center ">
        <form className="w-full max-w-md text-center text-black">
        <h2 className=" font-extrabold mb-4 z-10 text-4xl">Defi P2P Lending</h2>
          <h4 className="text-xl font-semibold mb-4 z-10 ">We build trust.</h4>
          <h4 className="text-xl font-semibold mb-8 ">
            We ensure peer-to-peer lending with mortgage-security-based
            guarantee.
          </h4>

          <Link
            to="/borrow"
            className="block w-full bg-blue-500 text-white text-lg font-medium py-3 flex justify-center rounded-lg shadow hover:bg-blue-600 mb-4"
          >
           <TbZoomMoney size={30}/> <span>Need Money</span>
          </Link>

          <Link
            to="/lend"
            className="block w-full bg-green-500 text-white text-lg font-medium py-3 flex justify-center rounded-lg shadow hover:bg-green-600"
          >
            <GiReceiveMoney size={30}/> <span> Invest Money</span>
          </Link>
        </form>
      </div>
    </section>
    // </div>
  );
};

export default HomePage;
