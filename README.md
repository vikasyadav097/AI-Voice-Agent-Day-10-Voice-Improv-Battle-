
---

# 🎭 𝐀𝐈 𝐕𝐨𝐢𝐜𝐞 𝐀𝐠𝐞𝐧𝐭 𝐂𝐡𝐚𝐥𝐥𝐞𝐧𝐠𝐞 | 𝐃𝐚𝐲 𝟏𝟎: 𝐕𝐨𝐢𝐜𝐞 𝐈𝐦𝐩𝐫𝐨𝐯e 𝐁𝐚𝐭𝐭𝐥𝐞 

A **voice-first improv comedy game show** where you perform hilarious scenarios and get **real-time reactions** from an energetic AI host!

---

## 🌟 Highlights

### 🎙️ Voice Improv Game Show

* **High-energy AI Host**: A witty, expressive, and dramatic game show host to guide you
* **8 Hilarious Scenarios**: From time-travel mishaps to cursed objects and yoga-doing dinosaurs
* **Real-Time Reactions**: Host gives honest, surprising, sometimes savage feedback
* **3-Round Gameplay**: Intro → 3 improv rounds → final summary
* **Live Transcript Panel**: Sliding UI panel showing the full conversation
* **Message History with Timestamps**: Every line stored for review

---

## 🎮 Game Flow

1. **Welcome** — Enter your stage name
2. **Introduction** — Host sets the mood and explains the rules
3. **Round 1–3**

   * Host gives a scenario
   * You perform in character
   * Say **“end scene”** to finish
   * Host reacts + gives feedback
4. **Final Summary** — Host reviews your highlights & improv style

### 🧠 Host Personality

* Energetic, comedic, sarcastic
* Mix of supportive + critical reactions
* Occasionally unimpressed for humor
* Light teasing but always respectful
* Great comedic timing

---

## 🛠️ Tech Stack

* **Frontend**: Next.js 15, React, TypeScript, Framer Motion
* **Backend**: Python, LiveKit Agents SDK
* **Voice**: Deepgram STT, Google Gemini 2.0 Flash, **Murf Falcon TTS**
* **Real-time**: LiveKit WebRTC

---

## 🎭 Sample Improv Scenarios

1. A time-travel tour guide explaining smartphones to someone from 1800s
2. A waiter calmly informing a customer their food has *escaped*
3. A customer returning a cursed item to a skeptical shop owner
4. A barista revealing that the latte is actually a portal
5. A tech support agent helping an alien operate a toaster
6. A museum guide explaining why the dinosaur exhibit is doing yoga
7. A pizza delivery person who delivered to the wrong century
8. A librarian explaining to a dragon why they need a library card

---

## 🚀 Quick Start

### Prerequisites

* Python 3.10+
* Node.js 18+
* pnpm
* LiveKit Cloud account (or local server)
* API Keys (Deepgram, Google AI, Murf)

---

## 💻 Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/vikasyadav097/AI-Voice-Agent-Day-10-Voice-Improve-Battle- 
```

### 2️⃣ Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
source .venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
cp .env.example .env.local
# Add API keys to .env.local
```

### 3️⃣ Frontend Setup

```bash
cd frontend
pnpm install
cp .env.example .env.local
# Add LiveKit credentials
```

### 4️⃣ Start LiveKit Server

```bash
.\livekit-server.exe --dev    # Windows
./livekit-server --dev        # Mac/Linux
```

### 5️⃣ Run Backend Agent

```bash
cd backend
.venv\Scripts\python.exe src/agent.py dev
```

### 6️⃣ Run Frontend

```bash
cd frontend
pnpm dev
```

### 7️⃣ Open Browser

👉 Visit: **[http://localhost:3000](http://localhost:3000)**

---

## 🎮 How to Play

1. Enter your **stage name**
2. Press **START IMPROV BATTLE!**
3. Listen to the AI host
4. Perform the scenario in character
5. Say **“end scene”** when done
6. Hear the host’s reaction
7. Open the **Transcript Panel** to see the full chat
8. Complete all 3 rounds
9. Hear your final performance summary

---

## 💡 Tips for Better Improv

* Commit to the character
* Add fun, weird, or unexpected details
* Show emotions
* Don’t overthink — flow with it
* Have fun — bold choices impress the host!

---

## 📝 Real-Time Transcript System

### 📌 Features

* Auto-updating message list
* Speaker labels (🎭 HOST / 🎤 YOU)
* Timestamps on every message
* Slide-in panel from the right
* Auto-scroll to latest line
* Stored in session memory

### 🎨 UI Style

* Purple host bubbles (left)
* Pink user bubbles (right)
* Dark stage-style theme
* Smooth framer motion animations

---

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── agent.py               # Game host logic + scenarios
│   │   └── murf_tts.py            # Murf Falcon integration
│   └── .env.local
├── frontend/
│   ├── app/
│   │   ├── page.tsx               # Main improv game
│   │   └── api/
│   │       └── connection-details/route.ts
│   ├── components/app/
│   │   ├── improv-welcome.tsx     # Welcome screen
│   │   └── improv-session.tsx     # Game session + transcript
│   └── .env.local
└── livekit-server.exe
```

---

## 🔧 Environment Variables

### Backend

```env
LIVEKIT_URL=ws://localhost:7880
LIVEKIT_API_KEY=your_key
LIVEKIT_API_SECRET=your_secret
DEEPGRAM_API_KEY=your_key
GOOGLE_API_KEY=your_key
MURF_API_KEY=your_key
```

### Frontend

```env
NEXT_PUBLIC_LIVEKIT_URL=ws://localhost:7880
LIVEKIT_API_KEY=your_key
LIVEKIT_API_SECRET=your_secret
```

---

## 🎯 Core Features Implemented

✔️ Single-player improv game show
✔️ AI host with personality + humor
✔️ 8 creative scenarios
✔️ 3 structured rounds
✔️ Real-time voice agent
✔️ Honest, varied reactions
✔️ Session transcript with timestamps
✔️ Murf Falcon TTS integration
✔️ Smooth, stage-themed UI
✔️ Fully animated transcript panel
✔️ Clean game state management

---

## 🐛 Troubleshooting

### 🤖 Host Not Responding?

* Check backend logs
* Ensure API keys are correct
* Verify LiveKit server is running

### 🔗 Connection Issues?

* All 3 servers must run (LiveKit, Backend, Frontend)
* Ports **3000** and **7880** must be free
* Check `.env.local` configs

### 🎤 Host Won’t React?

* Always say **“end scene”** or **“done”**
* Check microphone settings
* Check backend console

---

## 📜 License

MIT — see `LICENSE`.

---



---

## 🙏 Acknowledgments

* LiveKit — real-time infrastructure
* Murf Falcon — ultra-fast TTS
* Google Gemini — creative reasoning
* Deepgram — accurate STT

---

# 🎭 Built for Day 10 of the 10 Days of Voice Agents Challenge

**Powered by Murf Falcon TTS ⚡**

---

| Day      | Status         |
| -------- | -------------- |
| Day 1    | ✅ Completed    |
| Day 2    | ✅ Completed    |
| Day 3    | ✅ Completed    |
| Day 4    | ✅ Completed    |
| Day 5    | ✅ Completed    |
| Day 6    | ✅ Completed    |
| Day 7    | ✅ Completed    |
| Day 8    | ✅ Completed    |
| Day 9    | ✅ Completed    |
| Day 10   | ✅ Completed    |

