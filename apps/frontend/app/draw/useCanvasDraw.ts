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
    type: "ellipse";
    centerX: number;
    centerY: number;
    radiusX: number;
    radiusY: number;
  }
  | {
    type: "triangle";
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    x3: number;
    y3: number;
  }
  | {
    type: "arrow";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  }
  | {
    type: "pencil";
    points: { x: number; y: number }[];
  }
  | {
    type: "text";
    text: string;
    x: number;
    y: number;
  };

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function useCanvasDraw(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  roomId: number,
  socket: WebSocket,
  activeTool: string
) {
  const [existingShapes, setExistingShapes] = useState<Shape[]>([]);

  // WS LISTENER

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);

      if (message.type === "chat") {
        const parsedShape = JSON.parse(message.message);
        setExistingShapes((prev) => [...prev, parsedShape]);
      }

      if (message.type === "delete_shape") {
        const removed = JSON.parse(message.shape);
        setExistingShapes((prev) =>
          prev.filter((shape) => JSON.stringify(shape) !== JSON.stringify(removed))
        );
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket]);

  // LOAD DB SHAPES

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${baseUrl}/chats/${roomId}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      })
      .then((res) => {
        const shapes = res.data.messages.map((x: { message: string }) =>
          JSON.parse(x.message)
        );
        setExistingShapes(shapes);
      });
  }, [roomId]);

  // ARROW HEAD

  function drawArrowhead(
    ctx: CanvasRenderingContext2D,
    x0: number,
    y0: number,
    x1: number,
    y1: number
  ) {
    const angle = Math.atan2(y1 - y0, x1 - x0);
    const size = 12;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(
      x1 - size * Math.cos(angle - Math.PI / 6),
      y1 - size * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      x1 - size * Math.cos(angle + Math.PI / 6),
      y1 - size * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
  }

  // MATH: DISTANCE FROM POINT TO LINE (Fix for arrow eraser)

  function pointToLineDistance(
    px: number,
    py: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    const param = lenSq !== 0 ? dot / lenSq : -1;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    return Math.hypot(px - xx, py - yy);
  }

  // FULL DRAW LOGIC

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const redraw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "white";
      ctx.fillStyle = "white";

      existingShapes.forEach((shape) => {
        switch (shape.type) {
          case "rect":
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            break;

          case "ellipse":
            ctx.beginPath();
            ctx.ellipse(
              shape.centerX,
              shape.centerY,
              shape.radiusX,
              shape.radiusY,
              0,
              0,
              Math.PI * 2
            );
            ctx.stroke();
            break;

          case "triangle":
            ctx.beginPath();
            ctx.moveTo(shape.x1, shape.y1);
            ctx.lineTo(shape.x2, shape.y2);
            ctx.lineTo(shape.x3, shape.y3);
            ctx.closePath();
            ctx.stroke();
            break;

          case "arrow":
            ctx.beginPath();
            ctx.moveTo(shape.startX, shape.startY);
            ctx.lineTo(shape.endX, shape.endY);
            ctx.stroke();
            drawArrowhead(ctx, shape.startX, shape.startY, shape.endX, shape.endY);
            break;

          case "pencil":
            ctx.beginPath();
            shape.points.forEach((p, i) => {
              if (i === 0) ctx.moveTo(p.x, p.y);
              else ctx.lineTo(p.x, p.y);
            });
            ctx.stroke();
            break;

          case "text":
            ctx.font = "16px sans-serif";
            ctx.fillText(shape.text, shape.x, shape.y);
            break;
        }
      });
    };

    redraw();

    let drawing = false;
    let erasing = false;
    let startX = 0;
    let startY = 0;
    let pencilPoints: { x: number; y: number }[] = [];

    const sendShape = (shape: Shape) => {
      setExistingShapes((prev) => [...prev, shape]);

      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "chat",
            message: JSON.stringify(shape),
            roomId,
          })
        );
      }
    };

    // MULTI-SHAPE ERASER (NOW WITH ARROW FIX)

    const tryErase = (x: number, y: number) => {
      const threshold = 6;
      const shapesToDelete: Shape[] = [];

      existingShapes.forEach((shape) => {
        let hit = false;

        switch (shape.type) {
          case "rect": {
            const x1 = shape.x;
            const y1 = shape.y;
            const x2 = shape.x + shape.width;
            const y2 = shape.y + shape.height;

            hit =
              pointToLineDistance(x, y, x1, y1, x2, y1) < threshold ||
              pointToLineDistance(x, y, x2, y1, x2, y2) < threshold ||
              pointToLineDistance(x, y, x2, y2, x1, y2) < threshold ||
              pointToLineDistance(x, y, x1, y2, x1, y1) < threshold;
            break;
          }

          case "ellipse": {
            const eq =
              (x - shape.centerX) ** 2 / shape.radiusX ** 2 +
              (y - shape.centerY) ** 2 / shape.radiusY ** 2;

            hit = Math.abs(eq - 1) < 0.15;
            break;
          }

          case "triangle":
            hit =
              pointToLineDistance(x, y, shape.x1, shape.y1, shape.x2, shape.y2) <
              threshold ||
              pointToLineDistance(x, y, shape.x2, shape.y2, shape.x3, shape.y3) <
              threshold ||
              pointToLineDistance(x, y, shape.x3, shape.y3, shape.x1, shape.y1) <
              threshold;
            break;

          case "arrow":
            hit =
              pointToLineDistance(
                x,
                y,
                shape.startX,
                shape.startY,
                shape.endX,
                shape.endY
              ) < threshold ||
              Math.hypot(x - shape.endX, y - shape.endY) < threshold;
            break;

          case "pencil":
            hit = shape.points.some((p) => Math.hypot(x - p.x, y - p.y) < threshold);
            break;

          case "text":
            hit =
              Math.abs(y - shape.y) < threshold &&
              Math.abs(x - shape.x) < 40;
            break;
        }

        if (hit) shapesToDelete.push(shape);
      });

      if (shapesToDelete.length === 0) return;

      setExistingShapes((prev) =>
        prev.filter((shape) => !shapesToDelete.includes(shape))
      );

      shapesToDelete.forEach((shape) => {
        socket.send(
          JSON.stringify({
            type: "delete_shape",
            shape: JSON.stringify(shape),
            roomId,
          })
        );
      });
    };

    // MOUSE EVENTS

    const handleMouseDown = (e: MouseEvent) => {
      drawing = true;
      startX = e.clientX;
      startY = e.clientY;

      if (activeTool === "Eraser") {
        erasing = true;
        tryErase(startX, startY);
        return;
      }

      if (activeTool === "Pencil") {
        pencilPoints = [{ x: startX, y: startY }];
      }

      if (activeTool === "Text") {
        const text = prompt("Enter text:");
        if (!text) return;

        sendShape({ type: "text", text, x: startX, y: startY });
        redraw();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!drawing) return;

      const currX = e.clientX;
      const currY = e.clientY;

      if (activeTool === "Eraser" && erasing) {
        tryErase(currX, currY);
        return;
      }

      redraw();

      switch (activeTool) {
        case "Rectangle":
          ctx.strokeRect(startX, startY, currX - startX, currY - startY);
          break;

        case "Circle":
        case "Ellipse": {
          const rx = Math.abs(currX - startX) / 2;
          const ry = Math.abs(currY - startY) / 2;
          const cx = startX + (currX - startX) / 2;
          const cy = startY + (currY - startY) / 2;

          ctx.beginPath();
          ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
          ctx.stroke();
          break;
        }

        case "Triangle":
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(currX, currY);
          ctx.lineTo(startX - (currX - startX), currY);
          ctx.closePath();
          ctx.stroke();
          break;

        case "Arrow":
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(currX, currY);
          ctx.stroke();
          drawArrowhead(ctx, startX, startY, currX, currY);
          break;

        case "Pencil":
          pencilPoints.push({ x: currX, y: currY });
          ctx.beginPath();
          pencilPoints.forEach((p, i) => {
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          });
          ctx.stroke();
          break;
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      drawing = false;
      erasing = false;

      const currX = e.clientX;
      const currY = e.clientY;

      let shape: Shape | null = null;

      switch (activeTool) {
        case "Rectangle":
          shape = {
            type: "rect",
            x: startX,
            y: startY,
            width: currX - startX,
            height: currY - startY,
          };
          break;

        case "Circle":
        case "Ellipse": {
          const rx = Math.abs(currX - startX) / 2;
          const ry = Math.abs(currY - startY) / 2;
          shape = {
            type: "ellipse",
            centerX: startX + (currX - startX) / 2,
            centerY: startY + (currY - startY) / 2,
            radiusX: rx,
            radiusY: ry,
          };
          break;
        }

        case "Triangle":
          shape = {
            type: "triangle",
            x1: startX,
            y1: startY,
            x2: currX,
            y2: currY,
            x3: startX - (currX - startX),
            y3: currY,
          };
          break;

        case "Arrow":
          shape = {
            type: "arrow",
            startX,
            startY,
            endX: currX,
            endY: currY,
          };
          break;

        case "Pencil":
          shape = { type: "pencil", points: pencilPoints };
          break;

        case "Eraser":
          return;
      }

      if (shape) sendShape(shape);
    };

    function getTouchPos(t: Touch) {
      return { x: t.clientX, y: t.clientY };
    }

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const { x, y } = getTouchPos(e.touches[0]);
      handleMouseDown({ clientX: x, clientY: y } as MouseEvent);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const { x, y } = getTouchPos(e.touches[0]);
      handleMouseMove({ clientX: x, clientY: y } as MouseEvent);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      handleMouseUp({ clientX: 0, clientY: 0 } as MouseEvent);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);

      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [canvasRef, existingShapes, activeTool]);
}
