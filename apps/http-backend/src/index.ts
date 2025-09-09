import express from "express";
import { middleware } from "./middleware";
import {CreateRoomSchema, CreateUserSchema, SigninSchema} from "@repo/common/types"

const app = express();

app.post("/signup", (req, res) => {
  const data = CreateUserSchema.safeParse(req.body);
  if(!data.success){
    return res.json({
      message: "Incorrect inputs"
    })
  }
})

app.post("/signin", (req, res) => {
  const data = SigninSchema.safeParse(req.body);
  if(!data.success){
    return res.json({
      message: "Incorrect inputs"
    })
  }
})

app.post("/room", middleware, (req, res) => {
  const data = CreateRoomSchema.safeParse(req.body);
  if(!data.success){
    return res.json({
      message: "Incorrect inputs"
    })
  }
})

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
