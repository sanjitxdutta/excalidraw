"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";
import { getSocket } from "@/lib/socket";

export function RoomCanvas({ slug }: { slug: string }) {
    const [roomId, setRoomId] = useState<number | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"

    useEffect(() => {
        let ws: WebSocket | null = null;

        async function fetchRoom() {
            const res = await fetch(`${base}/room/${slug}`);
            const data = await res.json();

            if (!data.room) {
                alert("Room not found");
                return;
            }

            setRoomId(data.room.id);

            ws = getSocket(slug);

            ws.addEventListener("open", () => {
                ws!.send(JSON.stringify({
                    type: "join_room",
                    roomId: data.room.id
                }));
            });

            setSocket(ws);
        }

        fetchRoom();

        return () => {
            if (ws) {
                console.log("Closing websocket on unmount");
                ws.close();
            }
        };
    }, [slug]);

    if (roomId === null || socket === null) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center bg-black text-white">
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
