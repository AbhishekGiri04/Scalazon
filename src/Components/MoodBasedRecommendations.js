import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './moodrecommendations.css';

const MoodBasedRecommendations = ({ emotion, recommendations }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load products based on current emotion
    if (emotion) {
      fetchEmotionBasedProducts(emotion);
    } else {
      fetchFallbackProducts();
    }
    
    // Auto-refresh products every 45 seconds based on emotion
    const refreshInterval = setInterval(() => {
      console.log(`🛒 Auto-refreshing products for ${emotion || 'neutral'} mood...`);
      if (emotion && emotion !== 'neutral') {
        fetchEmotionBasedProducts(emotion);
      } else if (emotion === 'neutral') {
        fetchEmotionBasedProducts('neutral');
      }
      // No products if no emotion detected
    }, 45000); // 45 seconds
    
    return () => clearInterval(refreshInterval);
  }, [emotion]);

  const fetchMoodProducts = async () => {
    // Try to get mood-based products from backend
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/get_recommendations');
      const data = await response.json();
      
      if (data.products && data.products.length > 0) {
        setProducts(data.products);
        console.log(`🎭 Backend products loaded for ${data.emotion} mood`);
      } else {
        fetchEmotionBasedProducts(emotion || 'neutral');
      }
    } catch (error) {
      console.error('Backend unavailable, using local emotion detection:', error);
      fetchEmotionBasedProducts(emotion || 'neutral');
    }
    setLoading(false);
  };
  
  const fetchEmotionBasedProducts = (currentEmotion) => {
    console.log(`🎭 Loading products for emotion: ${currentEmotion}`);
    
    const allProducts = {
      happy: [
        { id: 1, name: "Gaming Headphones Pro", price: "₹2,999", original_price: "₹4,999", image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.5", reviews: "1250", description: "Premium gaming headphones for happy gaming", brand: "Amazon" },
        { id: 2, name: "iPhone 15 Pro Max", price: "₹1,34,900", original_price: "₹1,59,900", image: "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.8", reviews: "5420", description: "Latest iPhone with titanium design", brand: "Amazon" },
        { id: 3, name: "Nike Air Jordan", price: "₹12,995", original_price: "₹16,995", image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.6", reviews: "3200", description: "Premium basketball sneakers", brand: "Myntra" },
        { id: 4, name: "MacBook Pro M3", price: "₹1,99,900", original_price: "₹2,39,900", image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.9", reviews: "2800", description: "Powerful laptop for creators", brand: "Flipkart" },
        { id: 5, name: "PlayStation 5", price: "₹54,990", original_price: "₹59,990", image: "https://images.pexels.com/photos/371924/pexels-photo-371924.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.7", reviews: "4100", description: "Next-gen gaming console", brand: "Amazon" },
        { id: 6, name: "Premium Pizza Combo", price: "₹899", original_price: "₹1,299", image: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.5", reviews: "1890", description: "Delicious pizza for celebrations", brand: "Zomato" },
        { id: 7, name: "Party Dress Collection", price: "₹1,899", original_price: "₹3,999", image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.3", reviews: "890", description: "Trendy party dresses for celebrations", brand: "Myntra" },
        { id: 8, name: "Celebration Cake", price: "₹599", original_price: "₹999", image: "https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.7", reviews: "2100", description: "Delicious cake to celebrate happiness", brand: "Swiggy" }
      ],
      sad: [
        { id: 21, name: "Comfort Blanket", price: "₹899", original_price: "₹1,499", image: "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.4", reviews: "1500", description: "Soft comfort blanket for cozy moments", brand: "Amazon" },
        { id: 22, name: "Ben & Jerry's Ice Cream", price: "₹299", original_price: "₹399", image: "https://images.pexels.com/photos/1352278/pexels-photo-1352278.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.6", reviews: "800", description: "Premium ice cream for comfort", brand: "Swiggy" },
        { id: 23, name: "Self-Care Spa Kit", price: "₹1,299", original_price: "₹2,199", image: "https://images.pexels.com/photos/3997993/pexels-photo-3997993.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.5", reviews: "1200", description: "Complete self-care and wellness kit", brand: "Nykaa" },
        { id: 24, name: "Kindle Paperwhite", price: "₹13,999", original_price: "₹16,999", image: "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.4", reviews: "2890", description: "E-reader for peaceful reading", brand: "Amazon" },
        { id: 25, name: "Aromatherapy Diffuser", price: "₹2,499", original_price: "₹3,999", image: "https://images.pexels.com/photos/6621496/pexels-photo-6621496.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.3", reviews: "1650", description: "Essential oil diffuser for relaxation", brand: "Myntra" },
        { id: 26, name: "Comfort Food Combo", price: "₹799", original_price: "₹1,199", image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.7", reviews: "1100", description: "Comfort food delivery box", brand: "Zomato" },
        { id: 27, name: "Weighted Blanket", price: "₹3,999", original_price: "₹5,999", image: "https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.6", reviews: "980", description: "Therapeutic weighted blanket", brand: "Amazon" },
        { id: 28, name: "Herbal Tea Collection", price: "₹599", original_price: "₹899", image: "https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.3", reviews: "650", description: "Relaxing herbal tea collection", brand: "Flipkart" }
      ],
      angry: [
        { id: 41, name: "Boxing Gloves", price: "₹1,999", original_price: "₹3,999", image: "https://images.pexels.com/photos/4761663/pexels-photo-4761663.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.4", reviews: "750", description: "Professional boxing gloves for stress relief", brand: "Amazon" },
        { id: 42, name: "Punching Bag", price: "₹4,999", original_price: "₹7,999", image: "https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.6", reviews: "450", description: "Heavy punching bag for workout", brand: "Amazon" },
        { id: 43, name: "Gym Membership", price: "₹2,999", original_price: "₹4,999", image: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.5", reviews: "320", description: "Monthly gym membership", brand: "Flipkart" },
        { id: 44, name: "Energy Drink Pack", price: "₹299", original_price: "₹499", image: "https://images.pexels.com/photos/2775860/pexels-photo-2775860.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.1", reviews: "2100", description: "Energy drinks for intense workouts", brand: "Swiggy" },
        { id: 45, name: "Spicy Food Combo", price: "₹699", original_price: "₹999", image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.3", reviews: "780", description: "Spicy food combo for anger relief", brand: "Zomato" },
        { id: 46, name: "Stress Ball Set", price: "₹399", original_price: "₹799", image: "https://images.pexels.com/photos/6975474/pexels-photo-6975474.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.2", reviews: "1200", description: "Stress relief balls for anger management", brand: "Flipkart" },
        { id: 47, name: "Dumbbells Set", price: "₹3,999", original_price: "₹5,999", image: "https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.5", reviews: "890", description: "Weight training equipment", brand: "Amazon" },
        { id: 48, name: "Protein Powder", price: "₹2,499", original_price: "₹3,499", image: "https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.3", reviews: "1560", description: "Muscle building supplement", brand: "Flipkart" }
      ],
      surprised: [
        { id: 61, name: "Mystery Box", price: "₹1,299", original_price: "₹2,499", image: "https://images.pexels.com/photos/4226769/pexels-photo-4226769.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.3", reviews: "950", description: "Surprise mystery box with random items", brand: "Amazon" },
        { id: 62, name: "Gadget Surprise", price: "₹2,999", original_price: "₹4,999", image: "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.4", reviews: "650", description: "Random tech gadget surprise", brand: "Flipkart" },
        { id: 63, name: "Fashion Mystery", price: "₹1,799", original_price: "₹2,999", image: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.2", reviews: "1200", description: "Surprise fashion items", brand: "Myntra" },
        { id: 64, name: "Food Adventure", price: "₹899", original_price: "₹1,299", image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.6", reviews: "890", description: "Surprise food adventure box", brand: "Swiggy" },
        { id: 65, name: "Random Restaurant", price: "₹799", original_price: "₹1,199", image: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.5", reviews: "1100", description: "Random restaurant discovery", brand: "Zomato" },
        { id: 66, name: "Surprise Electronics", price: "₹3,499", original_price: "₹5,999", image: "https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.3", reviews: "560", description: "Random electronics surprise", brand: "Amazon" },
        { id: 67, name: "Lucky Dip Voucher", price: "₹999", original_price: "₹1,999", image: "https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.1", reviews: "2340", description: "Random shopping voucher", brand: "Flipkart" },
        { id: 68, name: "Blind Box Collectible", price: "₹599", original_price: "₹899", image: "https://images.pexels.com/photos/4226769/pexels-photo-4226769.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.4", reviews: "1890", description: "Random collectible figure", brand: "Amazon" }
      ],
      neutral: [
        { id: 81, name: "Daily Essentials Kit", price: "₹899", original_price: "₹1,499", image: "https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.1", reviews: "2300", description: "Essential items for daily use", brand: "Amazon" },
        { id: 82, name: "Basic Cotton T-Shirt", price: "₹499", original_price: "₹799", image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.0", reviews: "1800", description: "Basic cotton t-shirt", brand: "Myntra" },
        { id: 83, name: "Grocery Essentials", price: "₹1,299", original_price: "₹1,799", image: "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.2", reviews: "3200", description: "Essential grocery items", brand: "Flipkart" },
        { id: 84, name: "Home Meal Combo", price: "₹299", original_price: "₹399", image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.3", reviews: "1500", description: "Regular home-style meal", brand: "Swiggy" },
        { id: 85, name: "Casual Dining", price: "₹599", original_price: "₹799", image: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.1", reviews: "890", description: "Casual dining experience", brand: "Zomato" },
        { id: 86, name: "Office Supplies Set", price: "₹799", original_price: "₹1,199", image: "https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.0", reviews: "1200", description: "Basic office supplies", brand: "Amazon" },
        { id: 87, name: "Wireless Mouse", price: "₹1,299", original_price: "₹1,999", image: "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.3", reviews: "1890", description: "Ergonomic wireless mouse", brand: "Flipkart" },
        { id: 88, name: "Coffee Beans", price: "₹699", original_price: "₹999", image: "https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.4", reviews: "2340", description: "Premium coffee beans", brand: "Amazon" }
      ]
    };
    
    // Get products for current emotion
    const emotionProducts = allProducts[currentEmotion] || allProducts.neutral;
    
    // Shuffle and select 8 random products
    const shuffled = emotionProducts.sort(() => 0.5 - Math.random());
    setProducts(shuffled.slice(0, 8));
    
    console.log(`🎭 Loaded ${shuffled.slice(0, 8).length} products for ${currentEmotion} emotion`);
  };

  const fetchFallbackProducts = async () => {
    const allProducts = {
      happy: [
        { id: 1, name: "Gaming Headphones Pro", price: "₹2,999", original_price: "₹4,999", image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.5", reviews: "1250", description: "Premium gaming headphones for happy gaming", brand: "Amazon" },
        { id: 2, name: "iPhone 15 Pro Max", price: "₹1,34,900", original_price: "₹1,59,900", image: "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.8", reviews: "5420", description: "Latest iPhone with titanium design", brand: "Amazon" },
        { id: 3, name: "Nike Air Jordan", price: "₹12,995", original_price: "₹16,995", image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.6", reviews: "3200", description: "Premium basketball sneakers", brand: "Myntra" },
        { id: 4, name: "MacBook Pro M3", price: "₹1,99,900", original_price: "₹2,39,900", image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.9", reviews: "2800", description: "Powerful laptop for creators", brand: "Flipkart" },
        { id: 5, name: "PlayStation 5", price: "₹54,990", original_price: "₹59,990", image: "https://images.pexels.com/photos/371924/pexels-photo-371924.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.7", reviews: "4100", description: "Next-gen gaming console", brand: "Amazon" },
        { id: 6, name: "Premium Pizza Combo", price: "₹899", original_price: "₹1,299", image: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.5", reviews: "1890", description: "Delicious pizza for celebrations", brand: "Zomato" },
        { id: 7, name: "Party Dress Collection", price: "₹1,899", original_price: "₹3,999", image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.3", reviews: "890", description: "Trendy party dresses for celebrations", brand: "Myntra" },
        { id: 8, name: "Celebration Cake", price: "₹599", original_price: "₹999", image: "https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.7", reviews: "2100", description: "Delicious cake to celebrate happiness", brand: "Swiggy" },
        { id: 9, name: "AirPods Pro 2", price: "₹24,900", original_price: "₹29,900", image: "https://images.pexels.com/photos/8534088/pexels-photo-8534088.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.6", reviews: "3890", description: "Wireless earbuds with noise cancellation", brand: "Amazon" },
        { id: 10, name: "Samsung Galaxy S24", price: "₹79,999", original_price: "₹99,999", image: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.5", reviews: "2340", description: "Latest Android flagship phone", brand: "Flipkart" },
        { id: 11, name: "Adidas Ultraboost", price: "₹15,999", original_price: "₹19,999", image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.4", reviews: "1890", description: "Premium running shoes", brand: "Myntra" },
        { id: 12, name: "iPad Pro M2", price: "₹81,900", original_price: "₹99,900", image: "https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.8", reviews: "1560", description: "Professional tablet for creativity", brand: "Amazon" },
        { id: 13, name: "Canon EOS R5", price: "₹3,39,995", original_price: "₹3,99,995", image: "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.9", reviews: "890", description: "Professional mirrorless camera", brand: "Flipkart" },
        { id: 14, name: "Nintendo Switch OLED", price: "₹34,999", original_price: "₹39,999", image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.6", reviews: "2340", description: "Portable gaming console", brand: "Amazon" },
        { id: 15, name: "Luxury Watch Collection", price: "₹25,999", original_price: "₹35,999", image: "https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.7", reviews: "1230", description: "Premium timepiece for celebrations", brand: "Myntra" },
        { id: 16, name: "Champagne Bottle", price: "₹4,999", original_price: "₹6,999", image: "https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.5", reviews: "890", description: "Premium champagne for celebrations", brand: "Zomato" },
        { id: 17, name: "Designer Sunglasses", price: "₹8,999", original_price: "₹12,999", image: "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.4", reviews: "1560", description: "Luxury eyewear for style", brand: "Myntra" },
        { id: 18, name: "Bluetooth Speaker", price: "₹4,999", original_price: "₹7,999", image: "https://images.pexels.com/photos/274131/pexels-photo-274131.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.3", reviews: "2890", description: "Portable speaker for parties", brand: "Amazon" },
        { id: 19, name: "Gourmet Burger Combo", price: "₹799", original_price: "₹1,199", image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.6", reviews: "3450", description: "Delicious gourmet burger meal", brand: "Swiggy" },
        { id: 20, name: "Perfume Gift Set", price: "₹3,999", original_price: "₹5,999", image: "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=center", rating: "4.5", reviews: "1890", description: "Luxury fragrance collection", brand: "Nykaa" }
      ],
      sad: [
        { id: 21, name: "Comfort Blanket", price: "₹899", original_price: "₹1,499", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop", rating: "4.4", reviews: "1500", description: "Soft comfort blanket for cozy moments", brand: "Amazon" },
        { id: 22, name: "Ben & Jerry's Ice Cream", price: "₹299", original_price: "₹399", image: "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400&h=400&fit=crop", rating: "4.6", reviews: "800", description: "Premium ice cream for comfort", brand: "Swiggy" },
        { id: 23, name: "Self-Care Spa Kit", price: "₹1,299", original_price: "₹2,199", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=400&fit=crop", rating: "4.5", reviews: "1200", description: "Complete self-care and wellness kit", brand: "Nykaa" },
        { id: 24, name: "Kindle Paperwhite", price: "₹13,999", original_price: "₹16,999", image: "https://images.unsplash.com/photo-1481277542470-605612bd2d61?w=400&h=400&fit=crop", rating: "4.4", reviews: "2890", description: "E-reader for peaceful reading", brand: "Amazon" },
        { id: 25, name: "Aromatherapy Diffuser", price: "₹2,499", original_price: "₹3,999", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop", rating: "4.3", reviews: "1650", description: "Essential oil diffuser for relaxation", brand: "Myntra" },
        { id: 26, name: "Comfort Food Combo", price: "₹799", original_price: "₹1,199", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop", rating: "4.7", reviews: "1100", description: "Comfort food delivery box", brand: "Zomato" },
        { id: 27, name: "Weighted Blanket", price: "₹3,999", original_price: "₹5,999", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop", rating: "4.6", reviews: "980", description: "Therapeutic weighted blanket", brand: "Amazon" },
        { id: 28, name: "Herbal Tea Collection", price: "₹599", original_price: "₹899", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop", rating: "4.3", reviews: "650", description: "Relaxing herbal tea collection", brand: "Flipkart" },
        { id: 29, name: "Cozy Pajama Set", price: "₹1,299", original_price: "₹1,999", image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop", rating: "4.2", reviews: "1890", description: "Soft cotton pajamas for comfort", brand: "Myntra" },
        { id: 30, name: "Hot Chocolate Kit", price: "₹499", original_price: "₹799", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop", rating: "4.5", reviews: "2340", description: "Warm hot chocolate for comfort", brand: "Swiggy" },
        { id: 31, name: "Meditation Cushion", price: "₹1,999", original_price: "₹2,999", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop", rating: "4.4", reviews: "890", description: "Comfortable meditation pillow", brand: "Amazon" },
        { id: 32, name: "Scented Candles Set", price: "₹899", original_price: "₹1,299", image: "https://images.unsplash.com/photo-1602874801006-22ad8b78aac8?w=400&h=400&fit=crop", rating: "4.3", reviews: "1560", description: "Relaxing aromatherapy candles", brand: "Nykaa" },
        { id: 33, name: "Soft Slippers", price: "₹799", original_price: "₹1,199", image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop", rating: "4.1", reviews: "2890", description: "Comfortable house slippers", brand: "Flipkart" },
        { id: 34, name: "Journal & Pen Set", price: "₹699", original_price: "₹999", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop", rating: "4.2", reviews: "1230", description: "Beautiful journal for thoughts", brand: "Amazon" },
        { id: 35, name: "Face Mask Collection", price: "₹999", original_price: "₹1,499", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop", rating: "4.4", reviews: "1890", description: "Skincare masks for self-care", brand: "Nykaa" },
        { id: 36, name: "Soup Combo Pack", price: "₹399", original_price: "₹599", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop", rating: "4.3", reviews: "3450", description: "Warm soup varieties for comfort", brand: "Zomato" },
        { id: 37, name: "Soft Throw Pillow", price: "₹599", original_price: "₹899", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop", rating: "4.0", reviews: "1560", description: "Decorative comfort pillow", brand: "Amazon" },
        { id: 38, name: "Calming Music Album", price: "₹199", original_price: "₹299", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop", rating: "4.5", reviews: "890", description: "Relaxing music for peace", brand: "Spotify" },
        { id: 39, name: "Comfort Robe", price: "₹1,599", original_price: "₹2,299", image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop", rating: "4.3", reviews: "1230", description: "Soft bathrobe for relaxation", brand: "Myntra" },
        { id: 40, name: "Chocolate Box", price: "₹799", original_price: "₹1,199", image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=400&fit=crop", rating: "4.6", reviews: "2340", description: "Premium chocolate collection", brand: "Swiggy" }
      ],
      angry: [
        { id: 41, name: "Boxing Gloves", price: "₹1,999", original_price: "₹3,999", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop", rating: "4.4", reviews: "750", description: "Professional boxing gloves for stress relief", brand: "Amazon" },
        { id: 42, name: "Punching Bag", price: "₹4,999", original_price: "₹7,999", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop", rating: "4.6", reviews: "450", description: "Heavy punching bag for workout", brand: "Amazon" },
        { id: 43, name: "Gym Membership", price: "₹2,999", original_price: "₹4,999", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop", rating: "4.5", reviews: "320", description: "Monthly gym membership", brand: "Flipkart" },
        { id: 44, name: "Energy Drink Pack", price: "₹299", original_price: "₹499", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop", rating: "4.1", reviews: "2100", description: "Energy drinks for intense workouts", brand: "Swiggy" },
        { id: 45, name: "Spicy Food Combo", price: "₹699", original_price: "₹999", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop", rating: "4.3", reviews: "780", description: "Spicy food combo for anger relief", brand: "Zomato" },
        { id: 46, name: "Stress Ball Set", price: "₹399", original_price: "₹799", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop", rating: "4.2", reviews: "1200", description: "Stress relief balls for anger management", brand: "Flipkart" },
        { id: 47, name: "Dumbbells Set", price: "₹3,999", original_price: "₹5,999", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop", rating: "4.5", reviews: "890", description: "Weight training equipment", brand: "Amazon" },
        { id: 48, name: "Protein Powder", price: "₹2,499", original_price: "₹3,499", image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop", rating: "4.3", reviews: "1560", description: "Muscle building supplement", brand: "Flipkart" },
        { id: 49, name: "Resistance Bands", price: "₹799", original_price: "₹1,299", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop", rating: "4.1", reviews: "2340", description: "Portable workout equipment", brand: "Amazon" },
        { id: 50, name: "Yoga Mat", price: "₹1,299", original_price: "₹1,999", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop", rating: "4.4", reviews: "1890", description: "Premium exercise mat", brand: "Myntra" },
        { id: 51, name: "Pre-Workout Drink", price: "₹599", original_price: "₹899", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop", rating: "4.0", reviews: "3450", description: "Energy boost for workouts", brand: "Swiggy" },
        { id: 52, name: "Kettlebell", price: "₹2,299", original_price: "₹3,299", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop", rating: "4.6", reviews: "1230", description: "Functional training weight", brand: "Amazon" },
        { id: 53, name: "Sports Shoes", price: "₹4,999", original_price: "₹7,999", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", rating: "4.5", reviews: "2890", description: "High-performance athletic shoes", brand: "Myntra" },
        { id: 54, name: "Workout Gloves", price: "₹899", original_price: "₹1,299", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop", rating: "4.2", reviews: "1560", description: "Grip-enhancing gym gloves", brand: "Flipkart" },
        { id: 55, name: "Jump Rope", price: "₹499", original_price: "₹799", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop", rating: "4.1", reviews: "890", description: "Cardio training rope", brand: "Amazon" },
        { id: 56, name: "Gym Bag", price: "₹1,599", original_price: "₹2,299", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop", rating: "4.3", reviews: "2340", description: "Spacious sports bag", brand: "Myntra" },
        { id: 57, name: "Water Bottle", price: "₹699", original_price: "₹999", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop", rating: "4.4", reviews: "1890", description: "Insulated sports bottle", brand: "Amazon" },
        { id: 58, name: "Fitness Tracker", price: "₹5,999", original_price: "₹8,999", image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop", rating: "4.5", reviews: "1230", description: "Activity monitoring device", brand: "Flipkart" },
        { id: 59, name: "Spicy Noodles", price: "₹399", original_price: "₹599", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop", rating: "4.2", reviews: "3450", description: "Extra spicy instant noodles", brand: "Zomato" },
        { id: 60, name: "Massage Gun", price: "₹7,999", original_price: "₹11,999", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop", rating: "4.6", reviews: "890", description: "Muscle recovery device", brand: "Amazon" }
      ],
      surprised: [
        { id: 61, name: "Mystery Box", price: "₹1,299", original_price: "₹2,499", image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop", rating: "4.3", reviews: "950", description: "Surprise mystery box with random items", brand: "Amazon" },
        { id: 62, name: "Gadget Surprise", price: "₹2,999", original_price: "₹4,999", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop", rating: "4.4", reviews: "650", description: "Random tech gadget surprise", brand: "Flipkart" },
        { id: 63, name: "Fashion Mystery", price: "₹1,799", original_price: "₹2,999", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop", rating: "4.2", reviews: "1200", description: "Surprise fashion items", brand: "Myntra" },
        { id: 64, name: "Food Adventure", price: "₹899", original_price: "₹1,299", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop", rating: "4.6", reviews: "890", description: "Surprise food adventure box", brand: "Swiggy" },
        { id: 65, name: "Random Restaurant", price: "₹799", original_price: "₹1,199", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop", rating: "4.5", reviews: "1100", description: "Random restaurant discovery", brand: "Zomato" },
        { id: 66, name: "Surprise Electronics", price: "₹3,499", original_price: "₹5,999", image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=400&fit=crop", rating: "4.3", reviews: "560", description: "Random electronics surprise", brand: "Amazon" },
        { id: 67, name: "Lucky Dip Voucher", price: "₹999", original_price: "₹1,999", image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=400&fit=crop", rating: "4.1", reviews: "2340", description: "Random shopping voucher", brand: "Flipkart" },
        { id: 68, name: "Blind Box Collectible", price: "₹599", original_price: "₹899", image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop", rating: "4.4", reviews: "1890", description: "Random collectible figure", brand: "Amazon" },
        { id: 69, name: "Surprise Book Bundle", price: "₹799", original_price: "₹1,299", image: "https://images.unsplash.com/photo-1481277542470-605612bd2d61?w=400&h=400&fit=crop", rating: "4.2", reviews: "1230", description: "Random book collection", brand: "Amazon" },
        { id: 70, name: "Mystery Snack Box", price: "₹499", original_price: "₹799", image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=400&fit=crop", rating: "4.5", reviews: "3450", description: "International snack surprise", brand: "Swiggy" },
        { id: 71, name: "Random Game Key", price: "₹1,499", original_price: "₹2,499", image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop", rating: "4.3", reviews: "890", description: "Surprise video game", brand: "Steam" },
        { id: 72, name: "Surprise Jewelry", price: "₹2,999", original_price: "₹4,999", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop", rating: "4.4", reviews: "1560", description: "Random jewelry piece", brand: "Myntra" },
        { id: 73, name: "Mystery Perfume", price: "₹1,299", original_price: "₹1,999", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop", rating: "4.2", reviews: "2340", description: "Random fragrance bottle", brand: "Nykaa" },
        { id: 74, name: "Surprise Artwork", price: "₹899", original_price: "₹1,499", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop", rating: "4.1", reviews: "890", description: "Random art piece", brand: "Etsy" },
        { id: 75, name: "Lucky Plant", price: "₹399", original_price: "₹699", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop", rating: "4.3", reviews: "1890", description: "Random houseplant", brand: "Amazon" },
        { id: 76, name: "Surprise Stationery", price: "₹599", original_price: "₹999", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop", rating: "4.0", reviews: "1230", description: "Random office supplies", brand: "Flipkart" },
        { id: 77, name: "Mystery Mug", price: "₹299", original_price: "₹499", image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop", rating: "4.2", reviews: "2890", description: "Random design mug", brand: "Amazon" },
        { id: 78, name: "Surprise Keychain", price: "₹199", original_price: "₹299", image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop", rating: "4.1", reviews: "3450", description: "Random keychain design", brand: "Myntra" },
        { id: 79, name: "Mystery Socks", price: "₹399", original_price: "₹599", image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop", rating: "4.0", reviews: "1560", description: "Random sock patterns", brand: "Flipkart" },
        { id: 80, name: "Surprise Phone Case", price: "₹699", original_price: "₹999", image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop", rating: "4.3", reviews: "1890", description: "Random phone cover design", brand: "Amazon" }
      ],
      neutral: [
        { id: 81, name: "Daily Essentials Kit", price: "₹899", original_price: "₹1,499", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop", rating: "4.1", reviews: "2300", description: "Essential items for daily use", brand: "Amazon" },
        { id: 82, name: "Basic Cotton T-Shirt", price: "₹499", original_price: "₹799", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop", rating: "4.0", reviews: "1800", description: "Basic cotton t-shirt", brand: "Myntra" },
        { id: 83, name: "Grocery Essentials", price: "₹1,299", original_price: "₹1,799", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop", rating: "4.2", reviews: "3200", description: "Essential grocery items", brand: "Flipkart" },
        { id: 84, name: "Home Meal Combo", price: "₹299", original_price: "₹399", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop", rating: "4.3", reviews: "1500", description: "Regular home-style meal", brand: "Swiggy" },
        { id: 85, name: "Casual Dining", price: "₹599", original_price: "₹799", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop", rating: "4.1", reviews: "890", description: "Casual dining experience", brand: "Zomato" },
        { id: 86, name: "Office Supplies Set", price: "₹799", original_price: "₹1,199", image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop", rating: "4.0", reviews: "1200", description: "Basic office supplies", brand: "Amazon" },
        { id: 87, name: "Wireless Mouse", price: "₹1,299", original_price: "₹1,999", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop", rating: "4.3", reviews: "1890", description: "Ergonomic wireless mouse", brand: "Flipkart" },
        { id: 88, name: "Coffee Beans", price: "₹699", original_price: "₹999", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop", rating: "4.4", reviews: "2340", description: "Premium coffee beans", brand: "Amazon" },
        { id: 89, name: "Notebook Collection", price: "₹399", original_price: "₹599", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop", rating: "4.1", reviews: "1560", description: "Quality notebooks", brand: "Myntra" },
        { id: 90, name: "Water Bottle", price: "₹599", original_price: "₹899", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop", rating: "4.2", reviews: "2890", description: "Stainless steel bottle", brand: "Flipkart" },
        { id: 91, name: "Basic Jeans", price: "₹1,499", original_price: "₹2,299", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop", rating: "4.0", reviews: "1230", description: "Classic denim jeans", brand: "Myntra" },
        { id: 92, name: "Phone Charger", price: "₹799", original_price: "₹1,199", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop", rating: "4.3", reviews: "3450", description: "Fast charging cable", brand: "Amazon" },
        { id: 93, name: "Hand Sanitizer", price: "₹199", original_price: "₹299", image: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=400&h=400&fit=crop", rating: "4.1", reviews: "5670", description: "Antibacterial hand gel", brand: "Flipkart" },
        { id: 94, name: "Face Mask Pack", price: "₹299", original_price: "₹499", image: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=400&h=400&fit=crop", rating: "4.0", reviews: "4560", description: "Protective face masks", brand: "Amazon" },
        { id: 95, name: "Pen Set", price: "₹399", original_price: "₹599", image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop", rating: "4.2", reviews: "1890", description: "Quality writing pens", brand: "Myntra" },
        { id: 96, name: "Lunch Box", price: "₹699", original_price: "₹999", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop", rating: "4.1", reviews: "2340", description: "Insulated food container", brand: "Flipkart" },
        { id: 97, name: "Umbrella", price: "₹599", original_price: "₹899", image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop", rating: "4.0", reviews: "1560", description: "Compact folding umbrella", brand: "Amazon" },
        { id: 98, name: "Socks Pack", price: "₹499", original_price: "₹799", image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop", rating: "3.9", reviews: "2890", description: "Cotton socks collection", brand: "Myntra" },
        { id: 99, name: "Basic Wallet", price: "₹899", original_price: "₹1,299", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop", rating: "4.2", reviews: "1230", description: "Leather wallet", brand: "Flipkart" },
        { id: 100, name: "Regular Coffee", price: "₹199", original_price: "₹299", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop", rating: "4.1", reviews: "3450", description: "Daily coffee blend", brand: "Zomato" }
      ]
    };
    
    // This function is now handled by fetchEmotionBasedProducts
    fetchEmotionBasedProducts(emotion || 'neutral');
  };

  const handleProductClick = (product) => {
    // Log interaction with mood detector
    fetch('http://localhost:8080/log_interaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emotion: emotion,
        product: product.name || product.title,
        action: 'clicked',
        category: product.category
      })
    }).catch(console.error);

    // Direct brand website URLs
    let brandUrl;
    const productName = (product.name || product.title).replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '+');
    
    switch(product.brand.toLowerCase()) {
      case 'amazon':
        brandUrl = `https://www.amazon.in/s?k=${productName}`;
        break;
      case 'flipkart':
        brandUrl = `https://www.flipkart.com/search?q=${productName}`;
        break;
      case 'myntra':
        brandUrl = `https://www.myntra.com/${productName}`;
        break;
      case 'swiggy':
        brandUrl = `https://www.swiggy.com/search?query=${productName}`;
        break;
      case 'zomato':
        brandUrl = `https://www.zomato.com/search?q=${productName}`;
        break;
      case 'nykaa':
        brandUrl = `https://www.nykaa.com/search/result/?q=${productName}`;
        break;
      case 'spotify':
        brandUrl = `https://open.spotify.com/search/${productName}`;
        break;
      case 'steam':
        brandUrl = `https://store.steampowered.com/search/?term=${productName}`;
        break;
      case 'etsy':
        brandUrl = `https://www.etsy.com/search?q=${productName}`;
        break;
      default:
        brandUrl = `https://www.amazon.in/s?k=${productName}`;
    }
    
    console.log(`🛍️ Opening ${product.brand}: ${product.name}`);
    window.open(brandUrl, '_blank');
  };

  const getMoodMessage = (emotion) => {
    const messages = {
      'happy': 'You look happy! Here are some products to celebrate!',
      'sad': 'Feeling down? These might cheer you up!',
      'angry': 'Need to release energy? Try these options!',
      'surprised': 'Wow! Check out these exciting finds!',
      'neutral': 'Here are some popular recommendations for you!'
    };
    return messages[emotion] || messages['neutral'];
  };
  
  const getMoodIcon = (emotion) => {
    const icons = {
      'happy': '😊',
      'sad': '😢', 
      'angry': '😠',
      'surprised': '😲',
      'neutral': '😐'
    };
    return icons[emotion] || icons['neutral'];
  };

  if (loading) {
    return (
      <div className="mood-recommendations">
        <div className="mood-header">
          <h3>AI-Powered Recommendations</h3>
          <p>Analyzing your mood...</p>
        </div>
        <div className="loading-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="product-skeleton"></div>
          ))}
        </div>
      </div>
    );
  }

  // Show message if no emotion detected
  if (!emotion) {
    return (
      <div className="mood-recommendations">
        <div className="mood-header">
          <h3>🎭 AI-Powered Recommendations</h3>
          <p className="mood-message">
            <span className="mood-icon">📷</span>
            Please enable camera and show your face for personalized recommendations!
          </p>
        </div>
      </div>
    );
  }
  
  if (!products.length) return null;

  return (
    <div className="mood-recommendations">
      <div className="mood-header">
        <h3>AI-Powered Recommendations</h3>
        <p className="mood-message">
          <span className="mood-icon">{getMoodIcon(emotion)}</span>
          {getMoodMessage(emotion)}
        </p>
      </div>
      
      <div className="mood-products-grid">
        {products.slice(0, 8).map((product, index) => (
          <div 
            key={index} 
            className="mood-product-card"
            onClick={() => handleProductClick(product)}
          >
            <div className="product-image-container">
              <img 
                src={product.image} 
                alt={product.name || product.title}
                className="product-image"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5📦</text></svg>';
                }}
              />
              {product.original_price && (
                <div className="discount-badge">
                  {Math.round(((parseFloat(product.original_price.replace('₹', '').replace(',', '')) - parseFloat(product.price.replace('₹', '').replace(',', ''))) / parseFloat(product.original_price.replace('₹', '').replace(',', ''))) * 100).toString().padStart(2, '0')}% OFF
                </div>
              )}
            </div>
            
            <div className="product-info">
              <h4 className="product-title">
                {(product.name || product.title).length > 50 
                  ? (product.name || product.title).substring(0, 50) + '...'
                  : (product.name || product.title)
                }
              </h4>
              
              <div className="product-meta">
                <div className="price-section">
                  <span className="current-price">{product.price || `$${product.price}`}</span>
                  {product.original_price && (
                    <span className="original-price">{product.original_price}</span>
                  )}
                </div>
                
                <div className="rating-section">
                  <span className="rating">
                    ⭐ {product.rating || '4.5'}
                  </span>
                  {product.reviews && (
                    <span className="reviews">({product.reviews})</span>
                  )}
                </div>
              </div>
              
              <p className="product-description">
                {product.description && product.description.length > 80
                  ? product.description.substring(0, 80) + '...'
                  : product.description || 'Perfect match for your current mood!'
                }
              </p>
              
              <div className="product-actions">
                <button className="shop-now-btn">
                  {product.url ? 'Shop Now' : 'View Details'}
                </button>
                {product.brand && (
                  <span className="brand-tag">{product.brand}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodBasedRecommendations;