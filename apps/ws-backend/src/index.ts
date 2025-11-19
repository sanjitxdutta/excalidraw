import { WebSocketServer, WebSocket } from 'ws';
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from '@repo/backend-common/config';
import { prismaClient } from "@repo/db/client";

const PORT = process.env.PORT || 8080;

const wss = new WebSocketServer({ port: Number(PORT) });
console.log("WS server running on port", PORT);

interface User {
  ws: WebSocket,
  rooms: number[],
  userId: string
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch (error) {
    return null;
  }
}

wss.on('connection', function connection(ws, request) {
  ws.on('error', console.error);

  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";

  const userId = checkUser(token);

  if (userId == null) {
    ws.close();
    return null;
  }

  users.push({
    userId,
    rooms: [],
    ws
  })

  ws.on('message', async function message(data) {
    const parsedData = JSON.parse(data.toString());

    if (parsedData.type === "join_room") {
      const user = users.find(x => x.ws === ws);
      const roomId = Number(parsedData.roomId);
      if (user && !user.rooms.includes(roomId)) {
        user.rooms.push(roomId);
      }
    }

    if (parsedData.type === "leave_room") {
      const user = users.find(x => x.ws === ws);
      if (user) {
        const roomId = Number(parsedData.roomId);
        user.rooms = user.rooms.filter(x => x !== roomId);
      }
    }

    if (parsedData.type === "chat") {
      const roomId = Number(parsedData.roomId);
      const message = parsedData.message;

      await prismaClient.chat.create({
        data: {
          roomId,
          message,
          userId
        }
      });

      users.forEach(user => {
        if (user.rooms.includes(roomId) && user.userId !== userId) {
          user.ws.send(JSON.stringify({
            type: "chat",
            message,
            roomId
          }));
        }
      });
    }

    if (parsedData.type === "delete_shape") {
      const roomId = Number(parsedData.roomId);
      const shapeString = parsedData.shape;

      await prismaClient.chat.deleteMany({
        where: {
          roomId,
          message: shapeString
        }
      });

      users.forEach(user => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(JSON.stringify({
            type: "delete_shape",
            shape: shapeString,
            roomId
          }));
        }
      });
    }

  });

  ws.send(JSON.stringify({ type: "connected" }));
});