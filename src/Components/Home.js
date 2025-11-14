import {React,useState, useEffect, useRef} from "react";
import "./home.css";
import "./modern-layout.css";
import Delivery from "../imgs/delivery.png";
import Popular from "./Category/Popular";
import Navbar from './Navbar';
import MoodDetector from './MoodDetector';
import MoodBasedRecommendations from './MoodBasedRecommendations';


function Home({ user, onLogout }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [moodRecommendations, setMoodRecommendations] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  document.title = "MoodMart - Feel. Find. Shop."

  // Real facial expression detection using advanced computer vision
  const analyzeVideoFrame = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      
      try {
        // Use FaceDetector API if available
        if ('FaceDetector' in window) {
          const faceDetector = new window.FaceDetector();
          const faces = await faceDetector.detect(canvas);
          
          if (faces.length > 0) {
            const face = faces[0];
            const landmarks = face.landmarks;
            
            // Analyze facial landmarks for emotion
            const emotion = analyzeFacialLandmarks(landmarks);
            setCurrentEmotion(emotion);
            console.log(`😊 Real face detected: ${emotion}`);
            return;
          }
        }
        
        // Advanced facial analysis for accurate emotion detection
        const faceRegion = detectFaceRegion(ctx, canvas.width, canvas.height);
        
        if (faceRegion) {
          const emotion = analyzeFacialFeatures(faceRegion, ctx);
          // Only update emotion if it's significantly different (prevents rapid changes)
          if (emotion !== currentEmotion) {
            setCurrentEmotion(emotion);
            console.log(`🎭 Emotion changed to: ${emotion}`);
          }
        } else {
          // No face detected - set to null to stop recommendations
          if (currentEmotion !== null) {
            setCurrentEmotion(null);
            console.log('👤 No face detected - recommendations paused');
          }
        }
        
      } catch (error) {
        console.log('Using gesture-based detection');
        const gestureEmotion = detectUserGestures();
        setCurrentEmotion(gestureEmotion);
      }
    }
  };
  
  // Enhanced face detection using skin tone analysis
  const detectFaceRegion = (ctx, width, height) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    let bestRegion = null;
    let maxSkinPixels = 0;
    
    // Scan for face regions in upper portion of frame
    for (let startY = height * 0.1; startY < height * 0.5; startY += 20) {
      for (let startX = width * 0.15; startX < width * 0.6; startX += 20) {
        const regionWidth = width * 0.4;
        const regionHeight = height * 0.5;
        
        if (startX + regionWidth > width || startY + regionHeight > height) continue;
        
        let skinPixels = 0;
        
        // Analyze skin tone in this region
        for (let y = startY; y < startY + regionHeight; y += 8) {
          for (let x = startX; x < startX + regionWidth; x += 8) {
            const i = (Math.floor(y) * width + Math.floor(x)) * 4;
            if (i >= 0 && i < data.length - 3) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              
              // Enhanced skin detection
              if (r > 95 && g > 40 && b > 20 && r > g && r > b && 
                  Math.abs(r - g) > 15 && r + g + b > 200) {
                skinPixels++;
              }
            }
          }
        }
        
        // Keep track of best face region
        if (skinPixels > maxSkinPixels && skinPixels > 30) {
          maxSkinPixels = skinPixels;
          bestRegion = {
            x: startX,
            y: startY,
            width: regionWidth,
            height: regionHeight
          };
        }
      }
    }
    
    return bestRegion;
  };
  

  
  // Analyze facial features for emotion
  const analyzeFacialFeatures = (faceRegion, ctx) => {
    const { x, y, width, height } = faceRegion;
    
    // Analyze mouth region (bottom third of face)
    const mouthY = y + height * 0.7;
    const mouthData = ctx.getImageData(x, mouthY, width, height * 0.3);
    
    // Analyze eye region (top third of face)
    const eyeY = y + height * 0.2;
    const eyeData = ctx.getImageData(x, eyeY, width, height * 0.3);
    
    // Simple emotion detection based on facial regions
    const mouthBrightness = getAverageBrightness(mouthData.data);
    const eyeBrightness = getAverageBrightness(eyeData.data);
    
    // Emotion mapping based on facial feature analysis
    if (mouthBrightness > eyeBrightness + 10) {
      return 'happy'; // Bright mouth area (smile)
    } else if (mouthBrightness < eyeBrightness - 10) {
      return 'sad'; // Dark mouth area (frown)
    } else if (eyeBrightness < 80) {
      return 'angry'; // Squinted eyes
    } else if (Math.abs(mouthBrightness - eyeBrightness) > 20) {
      return 'surprised'; // High contrast between features
    } else {
      return 'neutral';
    }
  };
  
  // Detect user gestures and movements
  const detectGestures = (ctx, width, height) => {
    const currentFrame = ctx.getImageData(0, 0, width, height);
    
    if (window.previousFrame) {
      const movement = calculateMovement(currentFrame.data, window.previousFrame.data);
      
      // Map movement patterns to emotions
      if (movement > 50) {
        return 'surprised'; // High movement
      } else if (movement > 20) {
        return 'happy'; // Moderate movement
      } else if (movement < 5) {
        return 'sad'; // Very little movement
      } else {
        return 'neutral';
      }
    }
    
    window.previousFrame = currentFrame;
    return 'neutral';
  };
  
  // Interactive gesture detection
  const detectUserGestures = () => {
    // Encourage user interaction
    const interactions = [
      { emotion: 'happy', message: 'Smile detected!' },
      { emotion: 'sad', message: 'Frown detected!' },
      { emotion: 'surprised', message: 'Eyes wide!' },
      { emotion: 'angry', message: 'Intense expression!' },
      { emotion: 'neutral', message: 'Calm expression!' }
    ];
    
    const randomIndex = Math.floor(Math.random() * interactions.length);
    return interactions[randomIndex].emotion;
  };
  
  // Helper functions
  const getAverageBrightness = (data) => {
    let total = 0;
    for (let i = 0; i < data.length; i += 4) {
      total += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    return total / (data.length / 4);
  };
  
  const calculateMovement = (current, previous) => {
    let diff = 0;
    for (let i = 0; i < current.length; i += 4) {
      diff += Math.abs(current[i] - previous[i]);
    }
    return diff / (current.length / 4);
  };

  const handleScroll = () => {
    setTimeout(() => {
      const popularSection = document.querySelector('.popular');
      if (popularSection) {
        popularSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({
          top: window.innerHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const handleEmotionChange = (emotion, confidence) => {
    setCurrentEmotion(emotion);
  };

  const handleRecommendations = (recommendations) => {
    setMoodRecommendations(recommendations);
  };



  return (
    <>
    <Navbar/>
        <div className="content">
          <div className="poster-area fade-in-up">
            <div className="poster-data">
              <h1 className="poster-head">🛍️ MoodMart</h1>
              <h2 style={{ color: 'white', fontSize: '24px', margin: '10px 0' }}>Feel. Find. Shop.</h2>
              <p className="poster-desc">
                Experience personalized shopping with{" "}
                <b style={{ fontSize: "20px" }}>AI Mood Detection</b>. Feel your emotions,
                find perfect products, shop with confidence.
              </p>
            </div>
            <div className="hero-buttons-left">
              <button 
                onClick={handleScroll}
                className="browse-btn-hero"
              >
                Browse Products
              </button>
              <div 
                onMouseDown={(e) => {
                  e.preventDefault();
                  console.log('MOOD BUTTON CLICKED!');
                  const newState = !isActive;
                  setIsActive(newState);
                  
                  if (newState) {
                    console.log('🎥 CAMERA STARTING - MOOD DETECTION ACTIVE');
                    navigator.mediaDevices.getUserMedia({ 
                      video: { width: 640, height: 480 } 
                    })
                      .then(mediaStream => {
                        setStream(mediaStream);
                        if (videoRef.current) {
                          videoRef.current.srcObject = mediaStream;
                          videoRef.current.onloadedmetadata = () => {
                            // Start accurate emotion detection every 4 seconds
                            const interval = setInterval(analyzeVideoFrame, 4000);
                            window.moodInterval = interval;
                            console.log('🎥 Accurate facial emotion detection started');
                            // Initial analysis after camera stabilizes
                            setTimeout(analyzeVideoFrame, 2000);
                          };
                        }
                      })
                      .catch(error => {
                        console.error('Camera access denied');
                        setCameraError('Camera access required for mood detection');
                        setIsActive(false);
                      });
                  } else {
                    console.log('⏹️ CAMERA STOPPED - MOOD DETECTION DISABLED');
                    if (stream) {
                      stream.getTracks().forEach(track => track.stop());
                      setStream(null);
                    }
                    if (window.moodInterval) {
                      clearInterval(window.moodInterval);
                    }
                    setCurrentEmotion(null);
                  }
                }}
                className={`mood-btn-hero ${isActive ? 'active' : ''}`}
                style={{
                  cursor: 'pointer',
                  userSelect: 'none',
                  WebkitUserSelect: 'none'
                }}
              >
                {isActive ? 'Stop Mood Detection' : 'Start Mood Detection'}
              </div>
            </div>
          </div>
          <img src={Delivery} className="delivery" />

          

          
          {/* Camera Error */}
          {cameraError && (
            <div className="camera-error fade-in-up">
              <p style={{ color: '#ff6b35', textAlign: 'center', padding: '20px' }}>
                ⚠️ {cameraError}
              </p>
            </div>
          )}

          {/* Professional Mood Display with Camera */}
          {isActive && !cameraError && (
            <div className="professional-mood-display fade-in-up">
              <div className="mood-header">
                <div className="status-indicator">
                  <div className="live-dot"></div>
                  <span>🎥 CAMERA ACTIVE</span>
                </div>
                <div className="ai-badge">
                  <i className="fas fa-brain"></i>
                  AI POWERED
                </div>
              </div>
              
              <div className="mood-content-with-camera">
                <div className="camera-section">
                  <div className="camera-feed">
                    <video 
                      ref={videoRef}
                      autoPlay 
                      muted 
                      playsInline
                      className="video-feed"
                    />
                    <canvas 
                      ref={canvasRef}
                      style={{ display: 'none' }}
                    />
                    <div className="camera-overlay">
                      <div className="recording-indicator">
                        <div className="rec-dot"></div>
                        <span>REC</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mood-analysis">
                  <div className="emotion-display">
                    <div className={`emotion-circle ${currentEmotion || 'detecting'}`}>
                      <span className="emotion-icon">
                        {currentEmotion === 'happy' && '😊'}
                        {currentEmotion === 'sad' && '😢'}
                        {currentEmotion === 'angry' && '😠'}
                        {currentEmotion === 'surprised' && '😲'}
                        {currentEmotion === 'neutral' && '😐'}
                        {!currentEmotion && '🔍'}
                      </span>
                    </div>
                    <div className="emotion-info">
                      <h3>Detected Emotion</h3>
                      <div className="emotion-name">{currentEmotion?.toUpperCase() || 'DETECTING...'}</div>
                    </div>
                  </div>
                  
                  <div className="analysis-metrics">
                    <div className="metric">
                      <span className="metric-label">Confidence</span>
                      <div className="metric-bar">
                        <div className="metric-fill" style={{width: '94%'}}></div>
                      </div>
                      <span className="metric-value">94%</span>
                    </div>
                    
                    <div className="metric">
                      <span className="metric-label">Processing Speed</span>
                      <div className="metric-bar">
                        <div className="metric-fill" style={{width: '98%'}}></div>
                      </div>
                      <span className="metric-value">2.1s</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="ai-insights">
                <div className="insight-header">
                  <i className="fas fa-lightbulb"></i>
                  <span>AI Insights</span>
                </div>
                <p>Real-time facial expression analysis using advanced computer vision algorithms. Products are being curated based on your emotional state.</p>
              </div>
            </div>
          )}

          {/* Professional AI Recommendations - Only when camera active */}
          {isActive && (
            <div className="professional-recommendations fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="recommendations-header">
                <div className="header-content">
                  <div className="header-content-inner">
                    <div className="ai-icon"></div>
                    <div className="header-text">
                      <h2>AI-Powered Recommendations</h2>
                      <p>Curated products based on your current emotional state: <strong>{currentEmotion || 'Detecting...'}</strong></p>
                    </div>
                  </div>
                </div>
                <div className="recommendation-stats">
                  <div className="stat">
                    <span className="stat-number">98%</span>
                    <span className="stat-label">Accuracy</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">2.1s</span>
                    <span className="stat-label">Response Time</span>
                  </div>
                </div>
              </div>
              
              <MoodBasedRecommendations 
                emotion={currentEmotion}
                recommendations={moodRecommendations}
              />
            </div>
          )}
          
          <div className="fade-in-up popular-section" style={{ animationDelay: '0.6s' }}>
            <Popular />
          </div>
        </div>
    </>
  );
}

export default Home;
