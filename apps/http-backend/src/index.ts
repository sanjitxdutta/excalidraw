import express from "express";
import { middleware } from "./middleware";
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/types"
import { prismaClient } from "@repo/db/client";

const app = express();
app.use(express.json());

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

    res.json({ message: "User created", user });
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

    res.json({ message: "Signin successful", user });
  } catch (error) {
    res.status(500).json({ message: "Error signing in", error });
  }
});


app.post("/room", middleware, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({ message: "Incorrect inputs" });
  }


});

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
