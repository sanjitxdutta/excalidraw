"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";
import { getSocket } from "@/lib/socket";

export function RoomCanvas({ roomId }: { roomId: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = getSocket(roomId);

        const handleOpen = () => {
            ws.send(JSON.stringify({ type: "join_room", roomId }));
        };

        ws.addEventListener("open", handleOpen);

        setSocket(ws);

        return () => {
            ws.removeEventListener("open", handleOpen);
        };
    }, [roomId]);

    if (!socket) {
        return (
            <div className="w-full h-[80vh] flex flex-col items-center justify-center bg-black text-white">
                <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
                </div>

                <h2 className="text-3xl font-bold tracking-wide">
                    Connecting to Server…
                </h2>

                <p className="text-white/60 mt-2 text-lg">
                    Setting up your real-time workspace
                </p>
            </div>
        );
    }


    return <Canvas roomId={roomId} socket={socket} />;
}
