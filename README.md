# Day 9: E-commerce Voice Shopping Agent 🛍️

A fully functional voice-powered shopping assistant built with LiveKit Agents, Next.js, and Murf TTS.

## 🌟 Features

### Voice Shopping Assistant
- **Natural Conversations**: Friendly AI assistant (Alex) helps customers browse and buy products
- **Product Discovery**: Ask about products and get detailed descriptions with features and pricing
- **Smart Cart Management**: Add items via voice commands with real-time cart updates
- **Voice Checkout**: Complete purchases through natural conversation

### Real-time Shopping Cart
- **Live Updates**: Cart syncs automatically between voice and UI
- **File-based Persistence**: Cart state persists across sessions
- **Visual Feedback**: Cyberpunk-themed UI with smooth animations
- **Item Management**: Add, remove, and view cart items easily

### Order Management
- **Order Creation**: Generates unique order IDs for each purchase
- **Order History**: All orders saved as JSON files
- **Order Details**: Complete order information with line items and totals
- **Success Animation**: Beautiful checkout confirmation with order summary

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Python, LiveKit Agents SDK
- **Voice**: Deepgram STT, Google Gemini 2.0 Flash, Murf TTS
- **Real-time**: LiveKit WebRTC
- **Data**: File-based JSON storage

## 📦 Product Catalog

### Mugs
- Cyberpunk Coffee Mug (₹899)
- Hacker's Energy Mug (₹1299)

### T-Shirts (S, M, L, XL)
- Neural Network T-Shirt (₹799)
- AI Developer Tee (₹699)

### Hoodies (M, L, XL)
- Cyberpunk Hoodie (₹1999)
- Code Warrior Hoodie (₹2299)

### Accessories
- Tech Geek Cap (₹499)
- Developer Backpack (₹2499)
- RGB Gaming Mouse (₹1499)
- Mechanical Keyboard (₹3999)

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- pnpm
- LiveKit Cloud account (or local server)
- API Keys: Deepgram, Google AI, Murf

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/GhanshyamJha05/Ninth_Task_murf_ai.git
cd Ninth_Task_murf_ai
```

2. **Backend Setup**
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
cp .env.example .env.local
# Add your API keys to .env.local
```

3. **Frontend Setup**
```bash
cd frontend
pnpm install
cp .env.example .env.local
# Add your LiveKit credentials to .env.local
```

4. **Start LiveKit Server** (in project root)
```bash
.\livekit-server.exe --dev  # Windows
./livekit-server --dev      # Mac/Linux
```

5. **Start Backend Agent**
```bash
cd backend
.venv\Scripts\python.exe src/agent.py dev
```

6. **Start Frontend**
```bash
cd frontend
pnpm dev
```

7. **Open Browser**
Navigate to `http://localhost:3001`

## 💬 Voice Commands

### Browsing Products
- "What products do you have?"
- "Tell me about the gaming mouse"
- "Show me hoodies"
- "What's the price of the keyboard?"

### Adding to Cart
- "I want a mouse"
- "Add the keyboard to my cart"
- "I'll take the hoodie in size large"

### Cart Management
- "What's in my cart?"
- "Show me my cart"
- "Remove the mouse"

### Checkout
- "I'm ready to checkout"
- "Complete my order"
- "Checkout please"

## 🎨 UI Features

### Product Catalog (Left Panel)
- Browse all available products
- View prices, descriptions, and stock
- Click "ADD TO CART" buttons
- Visual feedback with checkmarks

### Shopping Cart (Right Panel)
- Real-time cart updates
- Item quantities and totals
- Remove items with trash icon
- Checkout button with success animation

### Success Animation
- Green checkmark animation
- Order summary with all items
- Total price display
- Auto-dismisses after 5 seconds

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── agent.py          # Main voice agent
│   │   ├── commerce.py       # E-commerce logic
│   │   └── murf_tts.py       # Murf TTS integration
│   └── .env.local            # Backend config
├── frontend/
│   ├── app/
│   │   └── api/
│   │       ├── cart/         # Cart API endpoints
│   │       ├── checkout/     # Checkout endpoint
│   │       └── products/     # Products endpoint
│   ├── components/
│   │   └── app/
│   │       ├── product-catalog.tsx
│   │       ├── shop-cart.tsx
│   │       └── session-view.tsx
│   └── .env.local            # Frontend config
├── shared-data/
│   ├── catalog.json          # Product catalog
│   ├── cart.json             # Current cart state
│   └── orders/               # Order history
└── livekit-server.exe        # LiveKit server
```

## 🔧 Configuration

### Backend (.env.local)
```env
LIVEKIT_URL=ws://localhost:7880
LIVEKIT_API_KEY=your_key
LIVEKIT_API_SECRET=your_secret
DEEPGRAM_API_KEY=your_key
GOOGLE_API_KEY=your_key
MURF_API_KEY=your_key
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_LIVEKIT_URL=ws://localhost:7880
LIVEKIT_API_KEY=your_key
LIVEKIT_API_SECRET=your_secret
```

## 🎯 Key Features Implemented

✅ Voice-powered product browsing  
✅ Natural language cart management  
✅ Real-time cart synchronization  
✅ File-based cart persistence  
✅ Order creation and storage  
✅ Checkout success animation  
✅ Friendly AI personality  
✅ Cyberpunk-themed UI  
✅ Responsive design  
✅ Error handling  

## 🐛 Troubleshooting

### Cart not updating
- Wait 2 seconds for polling to refresh
- Check `shared-data/cart.json` exists
- Verify frontend is on port 3001

### Voice agent not responding
- Check backend logs for errors
- Verify all API keys are set
- Ensure LiveKit server is running

### Checkout not working
- Ensure cart has items
- Check `shared-data/orders/` directory exists
- Verify file permissions

## 📝 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

Ghanshyam Jha
- GitHub: [@GhanshyamJha05](https://github.com/GhanshyamJha05)

## 🙏 Acknowledgments

- LiveKit for the amazing real-time infrastructure
- Murf AI for ultra-fast TTS
- Google Gemini for intelligent conversations
- Deepgram for accurate speech recognition

---

**Built for the 10 Days of Voice Agents Challenge - Day 9** 🎉
