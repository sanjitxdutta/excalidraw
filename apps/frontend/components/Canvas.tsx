import useCanvasDraw from "@/app/draw/useCanvasDraw";
import ShapeNavbar from "@/components/ShapeNavbar";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function Canvas({ roomId, socket }: { roomId: string, socket: WebSocket }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [showInstructions, setShowInstructions] = useState(true);

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

    useCanvasDraw(canvasRef, roomId, socket);

    return <div className="relative w-screen h-screen overflow-hidden bg-black text-white">

        <ShapeNavbar onToolSelect={() => setShowInstructions(false)} />

        <canvas
            ref={canvasRef}
            className="block w-screen h-screen"
            style={{ backgroundColor: "black", cursor: "crosshair" }}
        />

        <AnimatePresence>
            {showInstructions && (
                <motion.div
                    initial={false}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/70 backdrop-blur-sm z-40"
                >
                    <h1 className="text-3xl font-bold mb-4">Welcome to DrawBoard 🎨</h1>
                    <p className="text-gray-300 max-w-md leading-relaxed text-sm">
                        Use the toolbar above to select shapes or tools like pencil, text, or eraser.<br />
                        Click and drag anywhere on the canvas to start drawing.<br />
                        Your creativity starts here — click a tool to begin!
                    </p>
                </motion.div>
            )}
        </AnimatePresence>

        <div className="absolute bottom-2 w-full text-center text-gray-400 text-xs select-none pointer-events-none z-50">
            DrawBoard • v1.0.0 • sanjitxdutta © 2025
        </div>
    </div>
}