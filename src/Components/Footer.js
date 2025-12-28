import React from "react";
import "./footer.css";

function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      color: 'white',
      marginTop: '80px'
    }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #ff6b35 0%, #ff9500 100%)',
        padding: '50px 20px',
        textAlign: 'center'
      }}>
        <h2 style={{ 
          fontSize: '36px', 
          fontWeight: '800', 
          margin: '0 0 15px 0'
        }}>Scalazon</h2>
        <p style={{ 
          fontSize: '18px', 
          margin: '0',
          opacity: 0.95,
          fontWeight: '500'
        }}>
          Your ultimate shopping destination with best deals and seamless experience.
        </p>
      </div>

      {/* Main Content */}
      <div style={{
        padding: '50px 20px 30px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          
          <div>
            <h4 style={{ color: '#ff9500', marginBottom: '20px', fontSize: '18px' }}>
              <i className="fas fa-store" style={{marginRight: '8px'}}></i>About
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px', opacity: 0.9 }}>Best Deals</li>
              <li style={{ marginBottom: '12px', opacity: 0.9 }}>Quality Products</li>
              <li style={{ marginBottom: '12px', opacity: 0.9 }}>Fast Delivery</li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ color: '#ff9500', marginBottom: '20px', fontSize: '18px' }}>
              <i className="fas fa-shopping-bag" style={{marginRight: '8px'}}></i>Categories
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px', opacity: 0.9 }}>Electronics</li>
              <li style={{ marginBottom: '12px', opacity: 0.9 }}>Fashion</li>
              <li style={{ marginBottom: '12px', opacity: 0.9 }}>Jewelry</li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ color: '#ff9500', marginBottom: '20px', fontSize: '18px' }}>
              <i className="fas fa-headset" style={{marginRight: '8px'}}></i>Support
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px', opacity: 0.9 }}>Help Center</li>
              <li style={{ marginBottom: '12px', opacity: 0.9 }}>Returns</li>
              <li style={{ marginBottom: '12px', opacity: 0.9 }}>Contact Us</li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ color: '#ff9500', marginBottom: '20px', fontSize: '18px' }}>
              <i className="fas fa-crown" style={{marginRight: '8px'}}></i>Plus
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px', opacity: 0.9 }}>Membership</li>
              <li style={{ marginBottom: '12px', opacity: 0.9 }}>Exclusive Deals</li>
              <li style={{ marginBottom: '12px', opacity: 0.9 }}>Free Shipping</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={{
          borderTop: '1px solid rgba(255, 149, 0, 0.2)',
          paddingTop: '30px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <a href="https://t.me/AbhishekGiri7" target="_blank" rel="noopener noreferrer" 
               style={{
                 background: '#0088cc',
                 padding: '10px',
                 borderRadius: '50%',
                 textDecoration: 'none'
               }}>
              <i className="fab fa-telegram-plane" style={{ fontSize: '18px', color: 'white' }}></i>
            </a>
            <a href="https://github.com/abhishekgiri04" target="_blank" rel="noopener noreferrer"
               style={{
                 background: '#333',
                 padding: '10px',
                 borderRadius: '50%',
                 textDecoration: 'none'
               }}>
              <i className="fab fa-github" style={{ fontSize: '18px', color: 'white' }}></i>
            </a>
            <a href="https://www.linkedin.com/in/abhishek-giri04/" target="_blank" rel="noopener noreferrer"
               style={{
                 background: '#0077b5',
                 padding: '10px',
                 borderRadius: '50%',
                 textDecoration: 'none'
               }}>
              <i className="fab fa-linkedin" style={{ fontSize: '18px', color: 'white' }}></i>
            </a>
          </div>
          
          <p style={{ fontSize: '16px', margin: '10px 0', fontWeight: '600', color: '#ff9500' }}>
            © 2025 Scalazon
          </p>
          <p style={{ fontSize: '14px', opacity: 0.7, margin: '5px 0' }}>
            Built by Abhishek Giri
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;