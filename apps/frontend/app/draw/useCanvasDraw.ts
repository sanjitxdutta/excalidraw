import axios from "axios";
import { useEffect, RefObject, useState } from "react";

type Shape =
  | {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
  }
  | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
  };

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function useCanvasDraw(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  roomId: number,
  socket: WebSocket
) {
  const [existingShapes, setExistingShapes] = useState<Shape[]>([]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);

      if (message.type === "chat") {
        const parsedShape = JSON.parse(message.message);
        setExistingShapes(prev => [...prev, parsedShape]);
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);


  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get(`${baseUrl}/chats/${roomId}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : ""
      }
    })
      .then(res => {
        const shapes = res.data.messages.map((x: { message: string }) =>
          JSON.parse(x.message)
        );
        setExistingShapes(shapes);
      });
  }, [roomId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const redraw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      existingShapes.forEach(shape => {
        if (shape.type === "rect") {
          ctx.strokeStyle = "white";
          ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
      });
    };

    redraw();

    let clicked = false;
    let startX = 0;
    let startY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      clicked = true;
      startX = e.clientX;
      startY = e.clientY;
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!clicked) return;
      clicked = false;

      const width = e.clientX - startX;
      const height = e.clientY - startY;

      const newShape: Shape = {
        type: "rect",
        x: startX,
        y: startY,
        width,
        height,
      };

      setExistingShapes(prev => [...prev, newShape]);

      if (!socket || socket.readyState !== WebSocket.OPEN) {
        return;
      }

      socket.send(JSON.stringify({
        type: "chat",
        message: JSON.stringify(newShape),
        roomId
      }));

    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!clicked) return;

      const width = e.clientX - startX;
      const height = e.clientY - startY;

      redraw();

      ctx.strokeStyle = "white";
      ctx.strokeRect(startX, startY, width, height);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [canvasRef, existingShapes]);
}
