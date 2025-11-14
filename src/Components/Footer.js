import React from "react";
import "./footer.css";
// Using custom MoodMart branding

function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #232f3e 0%, #1a252f 100%)',
      color: 'white',
      marginTop: '60px'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #ff9500 0%, #ff6b35 100%)',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 15px 0' }}>🛍️ MoodMart</h2>
        <p style={{ fontSize: '18px', margin: '0', opacity: 0.9 }}>
          AI-powered e-commerce platform that personalizes shopping based on your emotions. Feel. Find. Shop.
        </p>
      </div>

      <div style={{
        padding: '50px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>
          <div>
            <h4 style={{ color: '#ff9500', marginBottom: '20px', fontSize: '18px' }}>About MoodMart</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '10px', opacity: 0.8 }}>AI Mood Detection</li>
              <li style={{ marginBottom: '10px', opacity: 0.8 }}>Personalized Shopping</li>
              <li style={{ marginBottom: '10px', opacity: 0.8 }}>How It Works</li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ color: '#ff9500', marginBottom: '20px', fontSize: '18px' }}>Shop with Us</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '10px', opacity: 0.8 }}>Mood-Based Products</li>
              <li style={{ marginBottom: '10px', opacity: 0.8 }}>Smart Recommendations</li>
              <li style={{ marginBottom: '10px', opacity: 0.8 }}>Real-time Updates</li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ color: '#ff9500', marginBottom: '20px', fontSize: '18px' }}>Connect with Us</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '10px', opacity: 0.8 }}>Customer Support</li>
              <li style={{ marginBottom: '10px', opacity: 0.8 }}>Privacy Policy</li>
              <li style={{ marginBottom: '10px', opacity: 0.8 }}>Terms of Service</li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ color: '#ff9500', marginBottom: '20px', fontSize: '18px' }}>MoodMart Cares</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '10px', opacity: 0.8 }}>Emotional Wellness</li>
              <li style={{ marginBottom: '10px', opacity: 0.8 }}>User Experience</li>
              <li style={{ marginBottom: '10px', opacity: 0.8 }}>Feedback & Reviews</li>
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255, 149, 0, 0.3)',
          paddingTop: '30px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '25px'
          }}>
            <a href="https://t.me/moodmart" target="_blank" rel="noopener noreferrer" className="footer-social-link">
              <i className="fab fa-telegram-plane" style={{ fontSize: '24px', color: '#0088cc' }}></i>
            </a>
            <a href="https://github.com/abhishekgiri04" target="_blank" rel="noopener noreferrer" className="footer-social-link">
              <i className="fab fa-github" style={{ fontSize: '24px', color: '#ffffff' }}></i>
            </a>
            <a href="https://www.linkedin.com/in/abhishek-giri04/" target="_blank" rel="noopener noreferrer" className="footer-social-link">
              <i className="fab fa-linkedin" style={{ fontSize: '24px', color: '#0077b5' }}></i>
            </a>
          </div>
          
          <p style={{ fontSize: '16px', margin: '10px 0', fontWeight: '500' }}>© 2025 MoodMart | Feel. Find. Shop.</p>
          <p style={{ fontSize: '14px', opacity: 0.7, margin: '5px 0' }}>AI-Powered E-Commerce Platform</p>
          <p style={{ fontSize: '12px', opacity: 0.5, marginTop: '15px' }}>Developed by Abhishek Giri</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
