"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/button";

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function RoomsPage() {
    const router = useRouter();

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

    const [rooms, setRooms] = useState([]);
    const [createSlug, setCreateSlug] = useState("");
    const [searchSlug, setSearchSlug] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (!token) return router.push("/signin");

        axios
            .get(`${base}/myrooms`, { headers: { Authorization: token } })
            .then((res) => setRooms(res.data.rooms || []))
            .catch((err) => console.error(err));
    }, [token]);

    // Create Room
    const createRoom = async () => {
        if (!createSlug) return alert("Enter a slug");

        const res = await axios.post(
            `${base}/room`,
            { slug: createSlug },
            { headers: { Authorization: token } }
        );

        const slug = res.data.room.slug;

        sessionStorage.setItem("currentRoom", JSON.stringify({
            slug,
            admin: "You"
        }));

        router.push(`/canvas/${slug}`);
    };

    // Search rooms
    const searchRoom = async (value: string) => {
        setSearchSlug(value);

        if (!value) {
            setSearchResults([]);
            return;
        }

        try {
            const res = await axios.get(`${base}/search/${value}`);
            setSearchResults(res.data.rooms || []);
        } catch (err) {
            console.error(err);
        }
    };

    // Join room
    const joinRoom = async (slug: string) => {
        const res = await axios.get(`${base}/room/${slug}`, {
            headers: {
                Authorization: token ? `Bearer ${token}` : ""
            }
        });

        if (!res.data.room) return alert("Room not found");

        router.push(`/canvas/${slug}`);
    };

    return (
        <div className="min-h-screen bg-black text-white flex">

            <aside className="w-80 min-h-screen bg-black border-r border-gray-800 flex flex-col gap-8 p-6">

                <div className="flex items-center justify-between">
                    <h1
                        className="text-3xl font-bold tracking-tight cursor-pointer transition"
                        onClick={() => router.push("/")}
                    >
                        DrawBoard
                    </h1>

                    <button
                        className="text-white hover:text-red-400 transition"
                        title="Logout"
                        onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("userId");
                            router.push("/");
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                            />
                        </svg>
                    </button>
                </div>

                <div className="bg-white text-black p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Create Room</h2>

                    <input
                        className="w-full p-3 border border-gray-300 rounded mb-3 text-black"
                        placeholder="Slug (ex: CAC101)"
                        value={createSlug}
                        onChange={(e) => setCreateSlug(e.target.value)}
                    />

                    <Button variant="dark" onClick={createRoom}>Create</Button>
                </div>

                <div className="bg-white text-black p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Join Room</h2>

                    <input
                        className="w-full p-3 border border-gray-300 rounded mb-3 text-black"
                        placeholder="Search slug..."
                        value={searchSlug}
                        onChange={(e) => searchRoom(e.target.value)}
                    />

                    <div className="max-h-52 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-2">
                        {searchResults.length === 0 && searchSlug && (
                            <p className="text-gray-500 text-sm p-2">No rooms found.</p>
                        )}

                        {searchResults.map((room: any) => (
                            <div
                                key={room.id}
                                className="flex justify-between items-center p-3 rounded-lg"
                            >
                                <div>
                                    <p className="font-semibold">{room.slug}</p>
                                    <p className="text-xs text-gray-600">
                                        Admin: {room.admin?.name || "Unknown"}
                                    </p>
                                </div>

                                <Button
                                    variant="dark"
                                    fullWidth={false}
                                    onClick={() => {
                                        const adminName = room.admin?.name || "Unknown";
                                        const adminId = room.admin?.id;

                                        const finalAdmin =
                                            adminId && userId && adminId.toString() === userId.toString()
                                                ? "You"
                                                : adminName;

                                        sessionStorage.setItem("currentRoom", JSON.stringify({
                                            slug: room.slug,
                                            admin: finalAdmin
                                        }));

                                        joinRoom(room.slug);
                                    }}
                                >
                                    Join
                                </Button>

                            </div>
                        ))}
                    </div>
                </div>
            </aside>

            <main className="flex-1 p-6 pr-10">
                <div className="bg-white text-black rounded-2xl shadow-xl w-full h-full p-8 border border-gray-200 flex flex-col">

                    <h1 className="text-4xl font-bold text-center mb-8">Your Rooms</h1>

                    <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-3 max-h-[400px]">

                        {rooms.length === 0 && (
                            <p className="text-gray-500 text-center p-4">
                                You haven't created any rooms yet.
                            </p>
                        )}

                        {rooms.map((room: any, index) => (
                            <div
                                key={room.id}
                                onClick={() => {
                                    sessionStorage.setItem("currentRoom", JSON.stringify({
                                        slug: room.slug,
                                        admin: "You"
                                    }));

                                    router.push(`/canvas/${room.slug}`);
                                }}
                                className="
                group
                flex items-center gap-4 
                bg-white text-black 
                border border-black
                p-5 rounded-xl w-full cursor-pointer
                transition-all duration-300 ease-in-out
                hover:bg-black hover:text-white hover:border-white"
                            >
                                <div
                                    className="
                    px-4 py-1 
                    bg-black text-white 
                    rounded-lg text-sm font-semibold shadow-sm
                    transition-all duration-300
                    group-hover:bg-white group-hover:text-black"
                                >
                                    {index + 1}
                                </div>

                                <div className="text-xl font-semibold">{room.slug}</div>
                            </div>
                        ))}

                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-300 text-center text-gray-500 text-xs select-none">
                        DrawBoard • v1.0.0 • sanjitxdutta © 2025
                    </div>

                </div>
            </main>

        </div>
    );
}
