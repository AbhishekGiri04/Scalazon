import { React, useEffect, useState, useRef } from "react";
// Using custom Scalazon branding
import search from "../imgs/search.png";
import wishlist from "../imgs/wishlist.png";
import cart from "../imgs/cart.png";
import orders from "../imgs/orders.png";
import Default from "../imgs/default.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./navbar.css";
import { app } from "../Firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import swal from "sweetalert";

const auth = getAuth(app);

function Navbar() {
  const CartItems = useSelector((state) => state.CartItemsAdded.CartItems);
  const ListItems = useSelector((state) => state.ItemsAdded.ListItems);
  const OrderItems = useSelector((state) => state.OrderAdded.OrderItems);
  const [user, setUser] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [Products, setProducts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const navigate = useNavigate();

  const searchResultsRef = useRef(null);

  const totalLength = OrderItems.reduce((acc, item) => {
    // if the item is an array, add its length to the accumulator
    if (Array.isArray(item)) {
      return acc + item.length;
    }
    // otherwise, just add 1 to the accumulator
    return acc + 1;
  }, 0);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    const GetProducts = async () => {
      const data = await fetch("https://fakestoreapi.com/products");
      const new_data = await data.json();
      setProducts(new_data);
    };

    GetProducts();

    const handleClick = (event) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target) &&
        !event.target.closest('.search-bar') &&
        !event.target.closest('.search-bar2')
      ) {
        setSearchText("");
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const searchResults = Products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchText.toLowerCase()) ||
      product.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSearch = () => {
    if (searchText.trim()) {
      setIsSearching(true);
      console.log('Searching for:', searchText);
      setTimeout(() => setIsSearching(false), 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      setIsListening(true);
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchText(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      alert('Voice search not supported in this browser');
    }
  };

  const totalQuantity = CartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <>
      <div className="navbar">
        <div className="left-section">
          <div 
            onClick={() => {
              if (window.location.href.includes("/payment")) {
                swal({
                  title: "Are you sure?",
                  text: "Your transaction is still pending!",
                  icon: "warning",
                  buttons: ["Cancel", "Yes"],
                }).then((willNavigate) => {
                  if (willNavigate) {
                    navigate({ pathname: "/home" });
                  }
                });
              } else {
                navigate({ pathname: "/home" });
              }
            }}
            className="logo-container"
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '10px'
            }}
          >
            <img 
              src="https://t3.ftcdn.net/jpg/04/18/27/84/360_F_418278492_qD4wt38KiSik4tP0d8TyzQTObnDuC6nt.jpg" 
              alt="Scalazon Logo" 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                marginRight: '10px'
              }}
            />
            <div 
              className="logo-text"
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#ff9500',
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              Scalazon
            </div>
          </div>


          <div className="search-bar">
            <input
              type="text"
              className="search-box"
              placeholder="Search products..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="search-btn" onClick={handleSearch}>
              <img src={search} className="search-img" />
            </button>
            <button 
              className="voice-search-btn" 
              onClick={startVoiceSearch}
              title="Voice Search"
            >
              <i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'}`} 
                 style={{ color: isListening ? '#dc3545' : '#ff9500' }}></i>
            </button>
          </div>
        </div>
        <div className="right-section">
          <img
            onClick={() => {
              if (window.location.href.includes("/payment")) {
                swal({
                  title: "Are you sure?",
                  text: "Your transaction is still pending!",
                  icon: "warning",
                  buttons: ["Cancel", "Yes"],
                }).then((willNavigate) => {
                  if (willNavigate) {
                    navigate("/wishlists");
                  }
                });
              } else {
                navigate("/wishlists");
              }
            }}
            src={wishlist}
            className="wishlist"
          />
          <p
            style={
              ListItems && ListItems.length > 0
                ? { opacity: 1 }
                : { opacity: 0 }
            }
            className="list-count"
          >
            {ListItems.length}
          </p>

          <img
            onClick={() => {
              if (window.location.href.includes("/payment")) {
                swal({
                  title: "Are you sure?",
                  text: "Your transaction is still pending!",
                  icon: "warning",
                  buttons: ["Cancel", "Yes"],
                }).then((willNavigate) => {
                  if (willNavigate) {
                    navigate("/cart");
                  }
                });
              } else {
                navigate("/cart");
              }
            }}
            src={cart}
            className="cart"
          />

          <p
            style={
              CartItems && CartItems.length > 0
                ? { opacity: 1 }
                : { opacity: 0 }
            }
            className="cart-count"
          >
            {totalQuantity}
          </p>

          <img
            onClick={() => {
              if (window.location.href.includes("/payment")) {
                swal({
                  title: "Are you sure?",
                  text: "Your transaction is still pending!",
                  icon: "warning",
                  buttons: ["Cancel", "Yes"],
                }).then((willNavigate) => {
                  if (willNavigate) {
                    navigate("/orders");
                  }
                });
              } else {
                navigate("/orders");
              }
            }}
            src={orders}
            className="orders"
          />
          <p
            style={
              OrderItems && OrderItems.length > 0
                ? { opacity: 1 }
                : { opacity: 0 }
            }
            className="order-count"
          >
            {totalLength}
          </p>

          <img
            onClick={() => navigate("/account")}
            src={
              user && user.photoURL
                ? user.photoURL.replace(/^http:\/\//i, "https://")
                : Default
            }
            className="default"
            alt="Profile"
            onError={(e) => {
              e.target.src = Default;
            }}
          />

        </div>
        <div className="search-bar2">
          <input
            type="text"
            className="search-box"
            placeholder="Search products..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="search-btn" onClick={handleSearch}>
            <img src={search} className="search-img" />
          </button>
          <button 
            className="voice-search-btn" 
            onClick={startVoiceSearch}
            title="Voice Search"
          >
            <i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'}`} 
               style={{ color: isListening ? '#dc3545' : '#ff9500' }}></i>
          </button>
        </div>
      </div>

      {searchText !== "" && (
        <div
          ref={searchResultsRef}
          className={`search-results ${searchResults.length ? "show" : ""}`}
        >
          {searchResults.length > 0 &&
            searchResults.map((product) => (
              <div
                onClick={() => {
                  if (window.location.href.includes("/payment")) {
                    swal({
                      title: "Are you sure?",
                      text: "Your transaction is still pending!",
                      icon: "warning",
                      buttons: ["Cancel", "Yes"],
                    }).then((willNavigate) => {
                      if (willNavigate) {
                        navigate(`/product/${product.id}`);
                      }
                    });
                  } else {
                    navigate(`/product/${product.id}`);
                  }
                }}
                className="search-results2"
                key={product.id}
              >
                <div className="product-img">
                  <img src={product.image} className="product-image" />
                </div>
                <div className="product-data">
                  <p className="product-title">
                    {product.title.length > 50
                      ? product.title.slice(0, 50) + "..."
                      : product.title}
                  </p>
                  <p className="product-desc">
                    {product.description.length > 50
                      ? product.description.slice(0, 50) + "..."
                      : product.description}
                  </p>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
}

export default Navbar;
