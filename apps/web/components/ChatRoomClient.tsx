"use client"

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket"

export function ChatRoomClient({
    messages,
    id
}: {
    messages: { message: string }[],
    id: string
}) {
    const { socket, loading } = useSocket();
    const [chat, setChat] = useState(messages);
    const [currentMessage, setCurrentMessage] = useState("");

    useEffect(() => {
        if (socket && !loading) {
            socket.send(JSON.stringify({
                type: "join_room",
                roomId: id
            }));

            socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
                if (parsedData.type === "chat") {
                    setChat(c => [...c, { message: parsedData.message }])
                }
            }
        }


    }, [socket, loading, id]);

    return <div>
        {chat.map((m, idx) => <div key={idx}>{m.message}</div>)}
        <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Type a message..."
        />
        <button onClick={() => {
            socket?.send(JSON.stringify({
                type: "chat",
                roomId: id,
                message: currentMessage
            }))

            setCurrentMessage("");
        }}>Send Message</button>
    </div>
}                                         