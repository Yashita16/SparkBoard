# 🎲 IceBreaker Multiplayer Game

A real-time multiplayer web game built using **React + Firebase**, designed for team interaction, fun challenges, and engagement during events or hackathons.

---

##  Features

* 🔗 **QR Code Join System** – Players can join instantly via QR scan or session code
* 👥 **Real-time Multiplayer** – All players sync live using Firebase
* 🎯 **Team-based Gameplay** – Multiple teams compete on a shared board
* 🎲 **Dice Rolling Mechanism** – Captains control turns and game flow
* 💬 **Dynamic Prompts** – Different challenge types (Move, Talk, Create, Wildcard)
* 📱 **Mobile Friendly UI** – Optimized player view for phones
* ⚡ **Instant Updates** – Firebase Realtime Database ensures live sync

---

##  Tech Stack

* **Frontend:** React, Tailwind CSS
* **Backend / Realtime:** Firebase Realtime Database
* **Routing:** React Router
* **Other:** QR Code Generator

---

##  Project Structure

```
src/
 ├── pages/
 │    ├── LobbyPage.jsx
 │    ├── JoinPage.jsx
 │    ├── PlayerViewPage.jsx
 │
 ├── context/
 │    └── GameContext.jsx
 │
 ├── data/
 │    ├── board.js
 │    └── prompts.js
 │
 ├── firebase.js
 └── App.jsx
```

---

##  Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-link>
cd project-folder
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the project

```bash
npm run dev
```

---

##  Firebase Setup

1. Go to Firebase Console
2. Create a new project
3. Enable **Realtime Database**
4. Replace config in `firebase.js`

```js
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT",
};
```

---

##  Security Note

* Firebase config is safe to expose in frontend
* Make sure database rules are not fully open in production

---

##  How to Play

1. Host creates a session
2. Share QR code or session code
3. Players join and select a team
4. Captain rolls dice
5. Complete challenges and progress on board
6. First team to reach the end wins 🎉

---

##  Future Improvements

* Auto reconnect after refresh
* Player disconnect handling
* Host-only controls
* Better animations & UI transitions

---

##  Author

**Yashita**
Full Stack Developer

---

##  Note

This project was built as a **hackathon-ready real-time multiplayer app**, demonstrating Firebase integration, state management, and responsive UI design.
