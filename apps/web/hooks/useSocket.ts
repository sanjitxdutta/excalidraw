import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket() {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyMmEzNTFmOC02MmU1LTRmMzgtYjU4ZC02ZDEzNjk4ZjUyYTMiLCJpYXQiOjE3NTc5NDkxODV9.c4grszRcM6ZUWstExh41cp3mMD8JDeuJxQXiD5UcLo4`);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        };
    }, []);

    return {
        socket,
        loading
    }
}