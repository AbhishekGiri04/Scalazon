import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Home from "./Components/Home";
import Lists from "./Components/Lists";
import Signin from "./Components/Signin";
import Signup from "./Components/Signup";
import Load from "./imgs/spin.gif";
import { app } from "./Firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ProductPage from "./Components/ProductPage";
import CartSection from "./Components/CartSection";
import Payment from "./Components/Payment";
import Profile from "./Components/Profile";
import Orders from "./Components/Orders";
import Error from "./Components/Error";

const auth = getAuth(app);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  useEffect(() => {
    // Always start with signin page - no auto login
    setUser(null);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <>
        <div className="loading">
          <img src={Load} className="loading-img" />
        </div>
      </>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" /> : <Signin onLogin={handleLogin} />} />
        <Route path="/signin" element={user ? <Navigate to="/home" /> : <Signin onLogin={handleLogin} />} />
        <Route path="/signup" element={user ? <Navigate to="/home" /> : <Signup />} />
        <Route path="/home" element={user ? <Home user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/wishlists" element={user ? <Lists /> : <Navigate to="/" />} />
        <Route path="/cart" element={user ? <CartSection /> : <Navigate to="/" />} />
        <Route path="/payment" element={user ? <Payment /> : <Navigate to="/" />} />
        <Route path="/orders" element={user ? <Orders /> : <Navigate to="/" />} />
        <Route path="/account" element={user ? <Profile user={user} /> : <Navigate to="/" />} />
        <Route path="/product/:id" element={user ? <ProductPage /> : <Navigate to="/" />} />
        <Route path="*" element={<Error/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
