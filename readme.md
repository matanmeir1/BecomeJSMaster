# 🧠 BecomeJSMaster — Real-Time Collaborative JS Practice

A real-time coding environment built for students and mentors to collaborate, practice challenges, and share progress — all powered by websockets and clean UI.

---

## 🚀 Tech Stack

**Frontend**
- React (Vite)
- React Router
- CodeMirror (JavaScript mode)
- Socket.IO client
- Inline styling with reusable style tokens

**Backend**
- Node.js + Express
- MongoDB Atlas
- Socket.IO server
- dotenv for environment config

---

## 📁 Project Structure
BecomeJSMaster/
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   └── codeblocks.js
│   │   ├── components/
│   │   │   ├── HintPanel.jsx
│   │   │   └── PresencePanel.jsx
│   │   ├── hooks/
│   │   │   └── useSocket.js
│   │   ├── pages/
│   │   │   ├── CodeBlock.jsx
│   │   │   ├── Lobby.jsx
│   │   │   ├── Login.jsx
│   │   │   └── localCodeBlocks.js
│   │   ├── styles/
│   │   │   └── common.js
│   │   ├── utils/
│   │   │   └── motivations.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── eslint.config.js
│
├── server/
│   ├── db/
│   │   ├── connection.js
│   │   ├── models.js
│   │   └── seed.js
│   ├── models/
│   │   └── CodeBlock.js
│   ├── routes/
│   │   └── codeBlocksRoutes.js
│   ├── socket/
│   │   └── roomHandler.js
│   ├── index.js
│   └── package.json
│
├── .gitignore
└── moveo ex.txt

---

## 🎯 Features

- Real-time code collaboration via Socket.IO
- Dynamic room roles (mentor / student)
- Hint request and approval system
- Code validation with solution matching
- Live presence panel and UI feedback

---

## ⚙️ Possible Improvements

**Functionality**
- Add authentication (email/password)
- Role management and room permissions
- Better error handling (socket retries, connection drops)
- Add basic security layers: authentication, authorization, and input sanitization

**Code/Architecture**
- Move socket events to constants
- Improve modularity of room state logic
- Add test coverage (especially for backend)

---

## 🌟 Feature Ideas

- Code history and diff viewer
- Challenge filtering by tags/difficulty
- Auto-evaluation with test cases
- Mentor dashboard and analytics
- AI-powered smart hints or feedback
- Room chat

---

## 📝 Notes

- Assumed a single room per challenge (1 mentor, many students)
- Styling uses shared design tokens with inline styles (no global CSS files)
- Used simple localStorage-based identity for simplicity
- Solution checking is text-based (whitespace ignored)

---

## 🌐 Deployment

-Frontend: https://become-js-master.vercel.app
-Backend API: https://becomejsmaster-api.onrender.com



----



## 📄 License

This project was created as part of a Moveo technical assignment.
