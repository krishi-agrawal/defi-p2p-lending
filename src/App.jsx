import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from "./pages/homepage/HomePage"
import Borrow from "./pages/borrow/Borrow"
import Lender from './pages/lend/Lender'
import GiveLoan from './pages/giveloan/GiveLoan'
import Verify from './pages/verify/Verify'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />}/>
          <Route path="/borrow" element={<Borrow />} />
          <Route path="/lend" element={<Lender />} />
          <Route path="/giveLoan/" element={<GiveLoan />} />
          <Route path="/verify/" element={<Verify />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
