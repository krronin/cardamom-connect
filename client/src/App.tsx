import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Auctions from "./pages/Auctions";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/auctions" element={<Auctions />} />
      <Route path="/auctions/:id" element={<Auctions />} />
    </Routes>
  );
}

export default App;
