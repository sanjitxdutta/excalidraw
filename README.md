<h1 align="center">
  🎨 DrawBoard – Real-Time Collaborative Canvas
</h1>

<p align="center">
  <a href="https://drawboardx.vercel.app/" target="_blank">
    <img 
      width="1900"
      height="718"
      alt="DrawBoard Screenshot"
      src="https://github.com/user-attachments/assets/4dbcf7bd-9916-4eed-97d2-2c9155dd01d4"
    />
  </a>
</p>

A full-stack monorepo for real-time collaborative drawing, chat, and room management.  
Built using **Next.js**, **Express**, **WebSockets**, **Prisma**, **TypeScript**, and **PNPM Workspaces**.
A powerful, minimal, fast, and beautifully engineered drawing platform where users can:

- Create rooms  
- Collaborate on a shared canvas in real time  
- Draw shapes, rectangles, lines & text  
- Send messages  
- Delete shapes  
- See live updates instantly  

---

## 🚀 Tech Stack

### **Frontend**
- Next.js (App Router)
- React + TailwindCSS
- Client-side WebSocket hooks
- Room/Canvas/Chat UI components

### **Backends**
#### **HTTP Backend**
- Express.js  
- JWT Auth  
- Prisma ORM  
- REST API for rooms, chats, and authentication  

#### **WebSocket Backend**
- Native `ws` server  
- Custom message protocol for:
  - join room  
  - draw shape  
  - delete shape  
  - chat messages  

### **Packages**
- `@repo/ui` – shared UI components  
- `@repo/common` – shared Zod schemas & types  
- `@repo/db` – Prisma client wrapper  
- `@repo/backend-common` – shared backend config  

---

# 📦 Monorepo Structure

```bash
drawboard/
│
├── apps/
│   ├── frontend/        # Next.js client
│   ├── http-backend/    # Express HTTP API
│   └── ws-backend/      # WebSocket server
│
├── packages/
│   ├── db/              # Prisma client + schema
│   ├── ui/              # Shared UI components
│   ├── common/          # Shared types & Zod validations
│   └── backend-common/  # Shared backend config
│
├── pnpm-workspace.yaml
└── package.json
```

---

# 🌟 Features

### 🎨 Canvas
- Draw shapes (rectangle, line, text)
- Delete shapes
- Real-time syncing through WebSockets
- Persistent shapes in DB

### 💬 Chat
- Real-time chat in rooms
- Auto-scroll & clean UI
- Stores message history

### 🏠 Rooms
- Create rooms
- Search rooms
- Join by slug
- Fetch room details
- Delete rooms

### 🔐 Authentication
- JWT-based auth
- Protected routes
- Token validation on backend

### ⚡ Real-Time Collaboration
- Join room event  
- Broadcast drawing updates  
- Broadcast chat messages  
- Broadcast deletion events  

---

# 🔌 HTTP API Documentation

> Base URL: `http://localhost:4000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/signup` | Create a new user |
| **POST** | `/signin` | Login and receive JWT |
| **POST** | `/room` | Create room |
| **GET** | `/room/:slug` | Get room by slug |
| **DELETE** | `/room/:roomId` | Delete room |
| **GET** | `/myrooms` | Rooms created by logged-in user |
| **GET** | `/search/:query` | Search rooms |
| **GET** | `/chats/:roomId` | Get chats of a room |

---

# 🔗 WebSocket Protocol  
> WS URL: `ws://localhost:8080`

### Server Listens (`socket.on`)
| Event | Description |
|--------|-------------|
| `connection` | New connection |
| `message` | Handles custom event packets |
| `error` | Error events |

---

## Client Sends (`.emit` equivalent via JSON messages)

```json
{
  "type": "join",
  "roomId": 12,
  "userId": 52
}
```
---

## Supported Message Types

| type       | payload                        | Description        |
| ---------- | ------------------------------ | ------------------ |
| `"join"`   | `{ roomId, userId }`           | Join specific room |
| `"chat"`   | `{ roomId, userId, text }`     | Send chat message  |
| `"draw"`   | `{ roomId, shape }`            | Create shape       |
| `"delete"` | `{ roomId, shapeId }`          | Delete shape       |

---

# 🔧 Environment Variables

## Supported Message Types

### Frontend (apps/frontend/.env)

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=ws://localhost:8080
```

### HTTP Backend (apps/http-backend/.env)

```bash
DATABASE_URL="postgresql://..."
JWT_SECRET="supersecret"
PORT=4000
```

### WS Backend (apps/ws-backend/.env)

```bash
PORT=8080
JWT_SECRET="supersecret"
```

---

# 🛠 Local Development Setup

1. Install Dependencies
```bash
pnpm install
```

2. Generate Prisma
```bash
cd packages/db
pnpm prisma generate
```

3. Run All Services
```bash
pnpm dev
```

- Frontend → localhost:3000
- HTTP backend → localhost:4000
- WS backend → localhost:8080

---

# 🎥 Demo Video

https://github.com/user-attachments/assets/1cb9a2e3-d826-41d3-ab33-489adcbd8ee0

---

# 🖼 Screenshots

<img width="1892" height="720" alt="image" src="https://github.com/user-attachments/assets/9807c34f-5768-4bf4-bbf9-cd3759dd4bf5" />
<img width="1895" height="855" alt="image" src="https://github.com/user-attachments/assets/0283f5b9-e02f-4841-9e6a-0ab4bc22dcdf" />
<img width="1899" height="859" alt="image" src="https://github.com/user-attachments/assets/b80fc8c1-b306-4b4d-b211-3157707b8b0f" />
<img width="1919" height="861" alt="image" src="https://github.com/user-attachments/assets/66bb0fcc-4843-48d8-be77-06ded6514f0b" />
<img width="1414" height="773" alt="image" src="https://github.com/user-attachments/assets/f394b71e-123b-406b-ae85-df22cf99ba87" />

---

# 🔄 Architecture Diagram

<img width="1278" height="646" alt="image" src="https://github.com/user-attachments/assets/66ebfd39-f612-4df8-bcb8-a83e733bc293" />

---

# 📝 License

## MIT License © 2025

---
