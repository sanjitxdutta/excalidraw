import express from "express";
import cors from "cors";
import { middleware } from "./middleware";
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/types"
import { prismaClient } from "@repo/db/client";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://drawboardx.vercel.app"
  ],
  credentials: true
}));

app.post("/signup", async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({ message: "Incorrect inputs" });
  }

  try {
    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data.email,
        password: parsedData.data.password,
        name: parsedData.data.name,
      },
    });

    const token = jwt.sign({
      userId: user.id
    }, JWT_SECRET);

    res.json({ message: "User created", token });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
});


app.post("/signin", async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({ message: "Incorrect inputs" });
  }

  try {
    const user = await prismaClient.user.findUnique({
      where: { email: parsedData.data.email },
    });

    if (!user || user.password !== parsedData.data.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({
      userId: user.id
    }, JWT_SECRET);

    res.json({ message: "Signin successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error signing in", error });
  }
});


app.post("/room", middleware, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({ message: "Incorrect inputs" });
  }

  //@ts-ignore
  const userId = req.userId;

  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.slug,
        adminId: userId,
      },
    });

    res.json({ message: "Room created", room });
  } catch (error) {
    res.status(500).json({ message: "Error creating room", error });
  }
});

app.get("/chats/:roomId", middleware, async (req, res) => {
  const roomId = Number(req.params.roomId);

  try {
    const messages = await prismaClient.chat.findMany({
      where: { roomId }
    });

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

app.get("/room/:slug", middleware, async (req, res) => {
  const slug = req.params.slug;

  const room = await prismaClient.room.findFirst({
    where: { slug },
    include: {
      admin: {
        select: { id: true, name: true }
      }
    }
  });

  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  res.json({ room });
});

app.get("/myrooms", middleware, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;

  const rooms = await prismaClient.room.findMany({
    where: { adminId: userId }
  });

  res.json({ rooms });
});

app.get("/search/:query", async (req, res) => {
  const query = req.params.query;

  try {
    const rooms = await prismaClient.room.findMany({
      where: {
        slug: {
          contains: query,
          mode: "insensitive",
        },
      },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({ rooms });
  } catch (error) {
    res.status(500).json({ message: "Error searching rooms", error });
  }
});

app.listen(PORT, () => console.log("HTTP backend running on port " + PORT));
