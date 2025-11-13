import { useEffect, RefObject } from "react";

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
}

export default function useCanvasDraw(canvasRef: RefObject<HTMLCanvasElement | null>) {

    let existingShapes: Shape[] = [];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let clicked = false;
        let startX = 0;
        let startY = 0;

        const handleMouseDown = (e: MouseEvent) => {
            clicked = true;
            startX = e.clientX;
            startY = e.clientY;
        };

        const handleMouseUp = (e: MouseEvent) => {
            clicked = false;
            const width = e.clientX - startX;
            const height = e.clientY - startY;

            existingShapes.push({
                type: "rect",
                x: startX,
                y: startY,
                width,
                height,
            });
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!clicked) return;

            const width = e.clientX - startX;
            const height = e.clientY - startY;

            clearCanvas(existingShapes, canvas, ctx);

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
    }, [canvasRef]);
}

const clearCanvas = (existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    existingShapes.map((shape) => {
        if (shape.type === "rect") {
            ctx.strokeStyle = "white";
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
        }
    })
}