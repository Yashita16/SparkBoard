# IceBreaker Multiplayer Game

IceBreaker is a real-time multiplayer web application built using React and Firebase.
It is designed to make group interactions more engaging through team-based gameplay and interactive challenges.

---

## Features

* Players can join the game using a QR code or session code
* Real-time synchronization across all devices using Firebase
* Team-based gameplay with multiple participants
* Dice-based turn system controlled by team captains
* Different types of challenges such as move, talk, create, and wildcard
* Mobile-friendly interface for player participation
* Instant updates without page refresh

---

## Tech Stack

* Frontend: React, Tailwind CSS
* Backend / Realtime: Firebase Realtime Database
* Routing: React Router
* Additional: QR code generation

---

## Project Structure

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

## Setup Instructions

1. Install dependencies:

```
npm install
```

2. Run the development server:

```
npm run dev
```

---

## Firebase Setup

1. Create a project in Firebase
2. Enable Realtime Database
3. Add your Firebase configuration in `firebase.js`

Example:

```
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT",
};
```

---

## How to Use

1. The host creates a session
2. Players join using the QR code or session code
3. Players select their team
4. The captain rolls the dice to start the turn
5. Teams complete challenges and move forward
6. The first team to reach the final position wins

---

## Future Improvements

* Auto reconnect after page refresh
* Better handling of player disconnects
* Restrict certain actions to the host
* Improve UI transitions and animations

---

## Author

Yashita
Full Stack Developer

---

## Note

This project demonstrates real-time data synchronization, state management, and responsive design for multiplayer applications.
