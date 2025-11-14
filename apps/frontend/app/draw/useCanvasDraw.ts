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

const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function useCanvasDraw(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  roomId: string
) {
  const [existingShapes, setExistingShapes] = useState<Shape[]>([]);

  useEffect(() => {
    const loadShapes = async () => {
      const res = await axios.get(`${baseUrl}/chats/${roomId}`);
      const messages = res.data.messages;

      const shapes = messages.map((x: { message: string }) =>
        JSON.parse(x.message)
      );

      setExistingShapes(shapes);
    };

    loadShapes();
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
