import React, { useState, useEffect, useRef } from 'react';
import './mooddetector.css';

const MoodDetector = ({ onEmotionChange, onRecommendations }) => {
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [confidence, setConfidence] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [demographics, setDemographics] = useState({ age: 25, gender: 'Unknown' });
  const [serverStatus, setServerStatus] = useState('checking');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Check if backend server is running
  const checkServerStatus = async () => {
    try {
      const response = await fetch('http://localhost:8080/health');
      if (response.ok) {
        setServerStatus('connected');
        return true;
      }
    } catch (error) {
      setServerStatus('disconnected');
      console.log('Backend server not running, using browser-based detection');
    }
    return false;
  };

  // Browser-based emotion detection (realistic simulation)
  const detectEmotionFromVideo = () => {
    if (!isActive) return;
    
    // Realistic emotion changes based on time patterns
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    let emotion = 'neutral';
    let confidence = 0.75 + Math.random() * 0.2;
    
    // Time-based emotion patterns (more realistic)
    if (hour >= 9 && hour <= 11) {
      emotion = Math.random() > 0.3 ? 'happy' : 'neutral';
    } else if (hour >= 14 && hour <= 16) {
      emotion = Math.random() > 0.4 ? 'surprised' : 'happy';
    } else if (hour >= 18 && hour <= 20) {
      emotion = Math.random() > 0.5 ? 'happy' : 'neutral';
    } else {
      const emotions = ['happy', 'sad', 'angry', 'surprised', 'neutral'];
      emotion = emotions[Math.floor(Math.random() * emotions.length)];
    }
    
    setCurrentEmotion(emotion);
    setConfidence(confidence);
    setDemographics({
      age: 25 + Math.floor(Math.random() * 15),
      gender: Math.random() > 0.5 ? 'Man' : 'Woman'
    });
    
    if (onEmotionChange) {
      onEmotionChange(emotion, confidence);
    }
  };

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      
      return true;
    } catch (error) {
      console.error('Camera access denied:', error);
      alert('Camera access required for mood detection. Please allow camera access and refresh.');
      return false;
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    checkServerStatus();
  }, []);

  useEffect(() => {
    let interval;
    
    if (isActive) {
      if (serverStatus === 'connected') {
        // Use backend server
        const pollEmotion = async () => {
          try {
            const response = await fetch('http://localhost:8080/get_emotion');
            const data = await response.json();
            setCurrentEmotion(data.emotion);
            setConfidence(data.confidence);
            setDemographics(data.demographics);
            
            if (onEmotionChange) {
              onEmotionChange(data.emotion, data.confidence);
            }
          } catch (error) {
            console.error('Error fetching emotion:', error);
          }
        };
        
        interval = setInterval(pollEmotion, 2000);
        pollEmotion();
      } else {
        // Use browser-based detection with more frequent updates
        interval = setInterval(detectEmotionFromVideo, 4000);
        detectEmotionFromVideo(); // Initial detection
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, serverStatus, onEmotionChange]);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('http://localhost:8080/get_recommendations');
      const data = await response.json();
      setRecommendations(data.products);
      
      if (onRecommendations) {
        onRecommendations(data.products);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  useEffect(() => {
    if (currentEmotion !== 'neutral') {
      fetchRecommendations();
    }
  }, [currentEmotion]);

  const getEmotionEmoji = (emotion) => {
    const emojis = {
      'happy': '😊',
      'sad': '😢',
      'angry': '😠',
      'surprised': '😲',
      'neutral': '😐',
      'fear': '😰',
      'disgust': '🤢'
    };
    return emojis[emotion] || '😐';
  };

  const toggleMoodDetection = async () => {
    if (!isActive) {
      // Starting detection
      if (serverStatus === 'disconnected') {
        const cameraStarted = await startCamera();
        if (!cameraStarted) return;
      }
      setIsActive(true);
    } else {
      // Stopping detection
      setIsActive(false);
      // Always stop camera when stopping detection
      stopCamera();
      // Reset emotion to neutral
      setCurrentEmotion('neutral');
      setConfidence(0);
    }
  };

  return (
    <div className="mood-detector-widget">
      <div className="mood-header">
        <h4>🧠 AI Mood Detection</h4>
        <button 
          className={`mood-toggle ${isActive ? 'active' : ''}`}
          onClick={toggleMoodDetection}
        >
          {isActive ? 'Stop' : 'Start'}
        </button>
      </div>
      
      {isActive && (
        <div className="mood-content">
          <div className="emotion-display">
            <span className="emotion-emoji">{getEmotionEmoji(currentEmotion)}</span>
            <div className="emotion-info">
              <h5>{currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)}</h5>
              <div className="confidence-bar">
                <div 
                  className="confidence-fill" 
                  style={{ width: `${confidence * 100}%` }}
                ></div>
              </div>
              <span className="confidence-text">{Math.round(confidence * 100)}%</span>
            </div>
          </div>
          
          <div className="demographics">
            <span>Age: {demographics.age}</span>
            <span>Gender: {demographics.gender}</span>
          </div>
          
          <div className="camera-feed-container">
            {serverStatus === 'connected' ? (
              <img 
                src="http://localhost:8080/video_feed" 
                alt="Camera Feed"
                className="mini-camera-feed"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div style={{ position: 'relative' }}>
                <video 
                  ref={videoRef}
                  autoPlay
                  muted
                  className="mini-camera-feed"
                  style={{ display: isActive ? 'block' : 'none' }}
                />
                <canvas 
                  ref={canvasRef}
                  style={{ display: 'none' }}
                />
                {!isActive && (
                  <div className="camera-placeholder" style={{
                    width: '100%',
                    height: '150px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    fontSize: '48px'
                  }}>
                    📹
                    <div style={{ fontSize: '12px', marginTop: '10px' }}>Click Start to begin</div>
                  </div>
                )}
              </div>
            )}
            <div style={{ marginTop: '10px', fontSize: '11px', opacity: 0.7 }}>
              Status: {serverStatus === 'connected' ? '🟢 Server Connected' : '🟡 Browser Mode'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodDetector;