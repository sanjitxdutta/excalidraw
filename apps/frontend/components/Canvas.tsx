import useCanvasDraw from "@/app/draw/useCanvasDraw";
import ShapeNavbar from "@/components/ShapeNavbar";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function Canvas({ roomId, socket }: { roomId: number; socket: WebSocket }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [showInstructions, setShowInstructions] = useState(true);

    const stored = typeof window !== "undefined"
        ? sessionStorage.getItem("currentRoom")
        : null;

    const roomInfo = stored ? JSON.parse(stored) : { slug: "", admin: "" };

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

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-black text-white">

            <div
                className="
                    absolute top-4 left-4 right-4
                    flex items-center justify-between
                    z-50
                    h-[52px]
                "
            >
                <div
                    className="
                        bg-white text-black
                        px-4
                        rounded-lg
                        border border-white
                        flex flex-col justify-center
                        h-full
                        w-[130px]
                    "
                >
                    <span className="text-[10px] text-gray-600 leading-none">Room</span>
                    <span className="text-sm font-semibold leading-tight">{roomInfo.slug}</span>
                    <span className="text-[10px] text-gray-600 leading-none">
                        Admin: {roomInfo.admin}
                    </span>
                </div>

                <div className="flex flex-col items-center justify-center h-full">
                    <div className="flex items-center h-full">
                        <ShapeNavbar onToolSelect={() => setShowInstructions(false)} />
                    </div>

                    <div className="w-[60%] h-[2px] bg-white/80 rounded-full mt-1"></div>
                </div>

                <button
                    onClick={() => {
                        if (socket) socket.close();
                        window.location.href = "/rooms";
                    }}
                    className="
                        bg-white text-black
                        border border-white
                        rounded-lg
                        px-4
                        flex items-center justify-center gap-2
                        h-full
                        shadow-sm
                        hover:bg-black hover:text-white
                        transition
                    "
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h5m4 0h5a1 1 0 001-1V10"
                        />
                    </svg>
                </button>
            </div>

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
    );
}
