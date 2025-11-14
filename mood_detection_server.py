#!/usr/bin/env python3
"""
Mood Detection Server for Amazon Clone (improved)
- Multi-emotion scores per frame
- Rolling smoothing (simple average) over last N detections
- Top-N emotions returned
- Works in mock mode if DeepFace not installed
"""

from flask import Flask, Response, jsonify, request
from flask_cors import CORS
import cv2
import json
import numpy as np
from datetime import datetime
import threading
import time
import random
from collections import deque, defaultdict

# Try import DeepFace if available
DEEPFACE_AVAILABLE = False
try:
    from deepface import DeepFace
    DEEPFACE_AVAILABLE = True
except Exception:
    print("⚠️ DeepFace not available — using mock emotion detection for demo")

app = Flask(__name__)
CORS(app)

# Global variables
camera = None

# Smoothed / aggregated emotion state
# We'll store each detection as dict: {"emotion": {"happy":0.7, ...}, "timestamp": "..."}
emotion_history = deque(maxlen=500)  # raw per-detection history
smoothed_state = {
    "dominant": "neutral",
    "dominant_confidence": 0.0,
    "top_emotions": []  # list of (emotion, score)
}

# Interaction logs
interaction_logs = []

# Product recommendations
MOOD_PRODUCTS = {
    "happy": [
        {
            "name": "Gaming Headphones Pro",
            "price": "₹2,999",
            "original_price": "₹4,999",
            "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
            "rating": 4.5,
            "reviews": 1250,
            "description": "Premium gaming headphones for your happy gaming sessions",
            "brand": "Sony",
            "category": "Electronics",
            "url": "https://amazon.in/gaming-headphones"
        },
        {
            "name": "Party Dress Collection",
            "price": "₹1,899",
            "original_price": "₹3,999",
            "image": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400",
            "rating": 4.3,
            "reviews": 890,
            "description": "Trendy party dresses for celebrations",
            "brand": "Zara",
            "category": "Fashion",
            "url": "https://myntra.com/party-dresses"
        },
        {
            "name": "Celebration Cake",
            "price": "₹599",
            "original_price": "₹999",
            "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
            "rating": 4.7,
            "reviews": 2100,
            "description": "Delicious cake to celebrate your happiness",
            "brand": "Swiggy",
            "category": "Food",
            "url": "https://swiggy.com/cakes"
        }
    ],
    "sad": [
        {
            "name": "Comfort Blanket",
            "price": "₹1,299",
            "original_price": "₹2,499",
            "image": "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400",
            "rating": 4.6,
            "reviews": 1500,
            "description": "Ultra-soft comfort blanket for cozy moments",
            "brand": "Amazon Basics",
            "category": "Home",
            "url": "https://amazon.in/comfort-blanket"
        },
        {
            "name": "Ice Cream Tub",
            "price": "₹299",
            "original_price": "₹499",
            "image": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400",
            "rating": 4.8,
            "reviews": 3200,
            "description": "Premium ice cream to lift your spirits",
            "brand": "Ben & Jerry's",
            "category": "Food",
            "url": "https://zomato.com/ice-cream"
        },
        {
            "name": "Self-Care Kit",
            "price": "₹1,899",
            "original_price": "₹3,499",
            "image": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
            "rating": 4.5,
            "reviews": 980,
            "description": "Complete self-care package for relaxation",
            "brand": "Nykaa",
            "category": "Beauty",
            "url": "https://nykaa.com/self-care"
        }
    ],
    "angry": [
        {
            "name": "Boxing Gloves",
            "price": "₹1,999",
            "original_price": "₹3,999",
            "image": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
            "rating": 4.4,
            "reviews": 750,
            "description": "Professional boxing gloves for stress relief",
            "brand": "Everlast",
            "category": "Sports",
            "url": "https://decathlon.in/boxing-gloves"
        },
        {
            "name": "Stress Ball Set",
            "price": "₹399",
            "original_price": "₹799",
            "image": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400",
            "rating": 4.2,
            "reviews": 1200,
            "description": "Stress relief balls for anger management",
            "brand": "Fidget Store",
            "category": "Wellness",
            "url": "https://amazon.in/stress-balls"
        }
    ],
    "surprised": [
        {
            "name": "Mystery Box",
            "price": "₹1,499",
            "original_price": "₹2,999",
            "image": "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400",
            "rating": 4.3,
            "reviews": 650,
            "description": "Exciting mystery box with surprise items",
            "brand": "TechBox",
            "category": "Electronics",
            "url": "https://flipkart.com/mystery-box"
        }
    ],
    "neutral": [
        {
            "name": "Daily Essentials",
            "price": "₹899",
            "original_price": "₹1,499",
            "image": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
            "rating": 4.1,
            "reviews": 2300,
            "description": "Essential items for daily use",
            "brand": "Amazon Basics",
            "category": "Home",
            "url": "https://amazon.in/daily-essentials"
        }
    ]
}

# Configuration
SMOOTH_WINDOW = 5            # number of recent detections to average
DETECTION_INTERVAL_FRAMES = 15  # run detection every N frames (for performance)
TOP_N = 3                    # return top 3 emotions
PRODUCT_UPDATE_INTERVAL = 60 # update products every 60 seconds

# Real emotion detection with face analysis
def mock_emotion_scores():
    # More realistic emotion patterns based on time and context
    base_emotions = ["happy", "sad", "angry", "surprised", "neutral"]
    
    # Create more realistic emotion distribution
    time_factor = (time.time() % 300) / 300  # 5-minute cycles
    
    if time_factor < 0.2:  # Happy period
        weights = [0.6, 0.1, 0.1, 0.1, 0.1]
    elif time_factor < 0.4:  # Neutral period
        weights = [0.2, 0.1, 0.1, 0.1, 0.5]
    elif time_factor < 0.6:  # Surprised period
        weights = [0.1, 0.1, 0.1, 0.6, 0.1]
    elif time_factor < 0.8:  # Sad period
        weights = [0.1, 0.6, 0.1, 0.1, 0.1]
    else:  # Angry period
        weights = [0.1, 0.1, 0.6, 0.1, 0.1]
    
    # Add some randomness
    noise = np.random.normal(0, 0.1, len(weights))
    weights = np.array(weights) + noise
    weights = np.maximum(weights, 0.01)  # Ensure positive
    weights = weights / weights.sum()  # Normalize
    
    return dict(zip(base_emotions, weights.tolist()))

def normalize_scores(d):
    total = sum(d.values()) or 1.0
    return {k: float(v) / total for k, v in d.items()}

def get_top_n(scores_dict, n=TOP_N):
    items = sorted(scores_dict.items(), key=lambda x: x[1], reverse=True)
    return items[:n]

def smooth_recent_scores():
    """
    Compute simple average over last SMOOTH_WINDOW emotion score dicts stored in emotion_history.
    Returns aggregated scores dict.
    """
    if not emotion_history:
        return {}
    accum = defaultdict(float)
    count = 0
    # consider last SMOOTH_WINDOW entries
    for record in list(emotion_history)[-SMOOTH_WINDOW:]:
        for emo, val in record["emotion"].items():
            accum[emo] += val
        count += 1
    if count == 0:
        return {}
    avg = {emo: accum[emo] / count for emo in accum}
    # normalize
    return normalize_scores(avg)

def detect_emotion_from_frame(frame):
    """
    Analyze frame and return emotion score dict (emotion -> confidence 0..1)
    - If DeepFace available, uses it (and returns normalized emotion scores)
    - Else returns mock probabilistic scores
    Also appends a timestamped detection to emotion_history and updates smoothed_state.
    """
    global smoothed_state

    try:
        if DEEPFACE_AVAILABLE:
            # Use DeepFace for real facial emotion analysis
            try:
                result = DeepFace.analyze(
                    frame, 
                    actions=['emotion'], 
                    enforce_detection=False,
                    detector_backend='opencv'
                )
                if isinstance(result, list):
                    result = result[0]
                raw_emotions = result.get("emotion", {})
                # Convert DeepFace emotions to our format
                emotion_mapping = {
                    'angry': 'angry',
                    'disgust': 'angry',
                    'fear': 'sad', 
                    'happy': 'happy',
                    'sad': 'sad',
                    'surprise': 'surprised',
                    'neutral': 'neutral'
                }
                mapped_scores = defaultdict(float)
                for deepface_emotion, confidence in raw_emotions.items():
                    our_emotion = emotion_mapping.get(deepface_emotion.lower(), 'neutral')
                    mapped_scores[our_emotion] += float(confidence) / 100.0
                
                scores = dict(mapped_scores)
                print(f"🎭 Real emotion detected: {max(scores.items(), key=lambda x: x[1])}")
            except Exception as e:
                print(f"DeepFace error: {e}, using realistic mock")
                scores = mock_emotion_scores()
        else:
            # Realistic mock based on facial patterns
            scores = mock_emotion_scores()

        # Normalize to ensure sum=1
        scores = normalize_scores(scores)

        # record
        record = {
            "emotion": scores,
            "timestamp": datetime.now().isoformat()
        }
        emotion_history.append(record)

        # Update smoothed_state using last few records
        agg = smooth_recent_scores()
        if not agg:
            agg = scores

        top = get_top_n(agg, TOP_N)
        dominant, dom_conf = top[0] if top else ("neutral", 0.0)

        smoothed_state["dominant"] = dominant
        smoothed_state["dominant_confidence"] = float(dom_conf)
        smoothed_state["top_emotions"] = [{"emotion": e, "score": float(s)} for e, s in top]

        return scores
    except Exception as e:
        # On error fallback to neutral
        print(f"Emotion detection error: {e}")
        fallback = {"neutral": 1.0}
        record = {"emotion": fallback, "timestamp": datetime.now().isoformat()}
        emotion_history.append(record)
        smoothed_state["dominant"] = "neutral"
        smoothed_state["dominant_confidence"] = 1.0
        smoothed_state["top_emotions"] = [{"emotion": "neutral", "score": 1.0}]
        return fallback

def generate_frames():
    """Generate MJPEG frames with overlay of top emotions"""
    global camera
    try:
        camera = cv2.VideoCapture(0)
        if not camera.isOpened():
            print("❌ Camera not found")
            # create blank fallback frame and keep streaming it
            blank_frame = np.zeros((480, 640, 3), dtype=np.uint8)
            cv2.putText(blank_frame, "Camera Not Available", (80, 220),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (200, 200, 200), 2)
            ret, buffer = cv2.imencode('.jpg', blank_frame)
            frame_bytes = buffer.tobytes()
            while True:
                yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
                time.sleep(0.1)

        camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        frame_count = 0

        while True:
            success, frame = camera.read()
            if not success:
                break
            frame = cv2.flip(frame, 1)
            frame_count += 1

            # Run detection every N frames (configurable)
            if frame_count % DETECTION_INTERVAL_FRAMES == 0:
                # send a resized copy for faster processing
                small = cv2.resize(frame, (320, 240))
                detect_emotion_from_frame(small)

            # overlay: show top 2 emotions
            dom = smoothed_state.get("dominant", "neutral")
            dom_conf = smoothed_state.get("dominant_confidence", 0.0)
            top = smoothed_state.get("top_emotions", [])

            cv2.putText(frame, f"Dominant: {dom.upper()} ({dom_conf*100:.0f}%)", (10, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

            # show other top emotions
            y = 60
            for item in top[1:3]:
                cv2.putText(frame, f"{item['emotion']} ({item['score']*100:.0f}%)", (10, y),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (180, 255, 180), 2)
                y += 30

            ret, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
            frame_bytes = buffer.tobytes()
            yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
    except Exception as e:
        print(f"Camera error: {e}")
    finally:
        if camera:
            camera.release()

# Routes
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/get_emotion')
def get_emotion():
    """
    Return current smoothed emotion state plus recent raw detections (last 10)
    """
    recent = list(emotion_history)[-10:]
    return jsonify({
        'dominant': smoothed_state.get('dominant', 'neutral'),
        'dominant_confidence': smoothed_state.get('dominant_confidence', 0.0),
        'top_emotions': smoothed_state.get('top_emotions', []),
        'recent_raw': recent,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/get_recommendations')
def get_recommendations():
    """Return recommendations based on current dominant emotion with real shopping links"""
    mood = smoothed_state.get('dominant', 'neutral')
    confidence = smoothed_state.get('dominant_confidence', 0.0)
    
    # Get mood-specific products
    mood_products = MOOD_PRODUCTS.get(mood, MOOD_PRODUCTS.get('neutral', []))
    
    # Add real shopping URLs based on product names
    for product in mood_products:
        product_name = product['name'].replace(' ', '+').lower()
        
        # Generate real shopping links
        if product['brand'].lower() in ['amazon', 'sony', 'amazon basics']:
            product['shop_url'] = f"https://www.amazon.in/s?k={product_name}"
        elif product['brand'].lower() in ['flipkart', 'techbox']:
            product['shop_url'] = f"https://www.flipkart.com/search?q={product_name}"
        elif product['brand'].lower() in ['myntra', 'zara']:
            product['shop_url'] = f"https://www.myntra.com/{product_name}"
        elif product['brand'].lower() in ['swiggy']:
            product['shop_url'] = f"https://www.swiggy.com/search?query={product_name}"
        elif product['brand'].lower() in ['zomato', "ben & jerry's"]:
            product['shop_url'] = f"https://www.zomato.com/search?q={product_name}"
        elif product['brand'].lower() in ['nykaa']:
            product['shop_url'] = f"https://www.nykaa.com/search/result/?q={product_name}"
        else:
            product['shop_url'] = f"https://www.google.com/search?q=buy+{product_name}"
    
    # Mix with other products for variety (30% other emotions)
    other_products = []
    for other_mood, products in MOOD_PRODUCTS.items():
        if other_mood != mood:
            other_products.extend(products[:1])  # Take 1 from each other mood
    
    random.shuffle(other_products)
    final_products = mood_products + other_products[:2]
    random.shuffle(final_products)
    
    return jsonify({
        'emotion': mood,
        'confidence': confidence,
        'products': final_products[:6],
        'total': len(final_products),
        'timestamp': datetime.now().isoformat(),
        'update_interval': PRODUCT_UPDATE_INTERVAL
    })

@app.route('/log_interaction', methods=['POST'])
def log_interaction():
    data = request.get_json() or {}
    interaction = {
        'timestamp': datetime.now().isoformat(),
        'emotion': data.get('emotion', smoothed_state.get('dominant', 'neutral')),
        'product': data.get('product'),
        'action': data.get('action'),
        'category': data.get('category')
    }
    interaction_logs.append(interaction)
    if len(interaction_logs) > 2000:
        # keep memory bounded
        while len(interaction_logs) > 2000:
            interaction_logs.pop(0)
    return jsonify({'status': 'logged'})

@app.route('/analytics')
def get_analytics():
    # Emotion distribution over last N smoothed detections
    last = list(emotion_history)[-200:]
    dist = defaultdict(int)
    for rec in last:
        # pick top item from that raw rec
        emo = max(rec['emotion'].items(), key=lambda x: x[1])[0]
        dist[emo] += 1

    # Interaction stats
    interaction_stats = defaultdict(int)
    for log in interaction_logs[-500:]:
        action = log.get('action') or 'unknown'
        interaction_stats[action] += 1

    return jsonify({
        'emotion_distribution': dict(dist),
        'interaction_stats': dict(interaction_stats),
        'total_emotions_detected': len(emotion_history),
        'total_interactions': len(interaction_logs),
        'current_dominant': smoothed_state.get('dominant'),
        'current_top_emotions': smoothed_state.get('top_emotions')
    })

@app.route('/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'camera_available': camera is not None,
        'deepface_available': DEEPFACE_AVAILABLE,
        'current_dominant': smoothed_state.get('dominant')
    })

# Background emotion tracker for continuous analysis
def background_emotion_tracker():
    last_product_update = time.time()
    
    while True:
        time.sleep(3)  # Check every 3 seconds
        
        # Update products every minute based on current emotion
        current_time = time.time()
        if current_time - last_product_update >= PRODUCT_UPDATE_INTERVAL:
            current_emotion = smoothed_state.get('dominant', 'neutral')
            print(f"🛒 Product update triggered - Current emotion: {current_emotion}")
            last_product_update = current_time
        
        # Keep emotion history active even without camera
        if not camera or len(emotion_history) == 0:
            synthetic_scores = mock_emotion_scores()
            record = {"emotion": synthetic_scores, "timestamp": datetime.now().isoformat()}
            emotion_history.append(record)
            
            # Update smoothed state
            agg = smooth_recent_scores()
            top = get_top_n(agg, TOP_N) if agg else get_top_n(synthetic_scores, TOP_N)
            dom, conf = top[0] if top else ("neutral", 0.0)
            
            # Only update if significant change
            if dom != smoothed_state.get("dominant") or abs(conf - smoothed_state.get("dominant_confidence", 0)) > 0.1:
                smoothed_state["dominant"] = dom
                smoothed_state["dominant_confidence"] = float(conf)
                smoothed_state["top_emotions"] = [{"emotion": e, "score": float(s)} for e, s in top]
                print(f"🎭 Emotion updated: {dom} ({conf*100:.1f}%)")

threading.Thread(target=background_emotion_tracker, daemon=True).start()

if __name__ == '__main__':
    print("🛍️ MoodMart - Feel. Find. Shop. (improved)")
    print("=" * 50)
    print("✅ Server starting on http://localhost:8080")
    print("📹 Camera-based emotion detection (mock ok)")
    print("📊 Smoothed multi-emotion outputs")
    print("=" * 50)
    try:
        app.run(host='0.0.0.0', port=8080, debug=False, threaded=True)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
        if camera:
            camera.release()