"use client";

import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { getSocket } from "@/lib/socket";
import { useRouter } from "next/navigation";

export function RoomCanvas({ slug }: { slug: string }) {
    const [roomId, setRoomId] = useState<number | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [roomExists, setRoomExists] = useState<boolean | null>(null);

    const router = useRouter();
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

    useEffect(() => {
        async function checkRoomExists() {
            try {
                const res = await fetch(`${base}/search/${slug}`);
                const data = await res.json();

                if (data.rooms.length === 0) {
                    setRoomExists(false);
                } else {
                    setRoomExists(true);
                }
            } catch (e) {
                setRoomExists(false);
            }
        }

        checkRoomExists();
    }, [slug]);

    useEffect(() => {
        if (roomExists === null) return;

        if (roomExists === false) return;

        const token = localStorage.getItem("token");

        if (!token) {
            router.replace(`/signin?redirect=/canvas/${slug}`);
            return;
        }

        async function loadRoom() {
            const res = await fetch(`${base}/room/${slug}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 403) {
                router.replace(`/signin?redirect=/canvas/${slug}`);
                return;
            }

            const data = await res.json();
            setRoomId(data.room.id);

            const ws = getSocket(slug);
            ws.addEventListener("open", () => {
                ws.send(JSON.stringify({
                    type: "join_room",
                    roomId: data.room.id
                }));
            });

            setSocket(ws);
        }

        loadRoom();
    }, [roomExists]);

    if (roomExists === false) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-black text-white px-4 text-center">

                <div className="mb-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-16 h-16 md:w-20 md:h-20 text-red-500 drop-shadow-lg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L4.34 17c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-wide">
                    Room Not Found
                </h1>

                <p className="text-red-400 text-base md:text-lg mb-6 opacity-80 max-w-xs md:max-w-md">
                    The room “{slug}” doesn’t exist or was deleted.
                </p>

                <button
                    onClick={() => router.push("/")}
                    className="px-5 py-3 md:px-6 md:py-3 rounded-lg bg-white text-black font-medium border border-transparent hover:bg-black hover:border-white hover:text-white transition-all shadow-lg"
                >
                    Go Back to Home
                </button>
            </div>
        );
    }

    if (roomId === null || socket === null) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 text-center">

                <div className="relative w-14 h-14 md:w-16 md:h-16 mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold tracking-wide">
                    Connecting to Server…
                </h2>

                <p className="text-white/60 mt-2 text-sm md:text-lg max-w-xs md:max-w-md">
                    Setting up your real-time workspace
                </p>
            </div>
        );
    }

    return <Canvas roomId={roomId} socket={socket} />;
}
