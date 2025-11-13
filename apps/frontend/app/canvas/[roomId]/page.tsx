"use client";

import { useEffect, useRef } from "react";
import useCanvasDraw from "@/app/draw/useCanvasDraw";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useCanvasDraw(canvasRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        backgroundColor: "black",
        display: "block",
        width: "100vw",
        height: "100vh",
      }}
    ></canvas>
  );
}
