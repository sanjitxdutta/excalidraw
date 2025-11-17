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
        console.log("WS OPEN");
        ws.send(JSON.stringify({ type: "join_room", roomId }));
    };

    ws.addEventListener("open", handleOpen);

    setSocket(ws);

    return () => {
        ws.removeEventListener("open", handleOpen);
    };
}, [roomId]);


    if (!socket) {
        return <div>Connecting to server...</div>;
    }

    return <Canvas roomId={roomId} socket={socket} />;
}
