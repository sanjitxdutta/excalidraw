let socket: WebSocket | null = null;

export function getSocket(roomId: string) {
    const base = process.env.NEXT_PUBLIC_API_WS_URL || "ws://localhost:8080";

    const token = localStorage.getItem("token") || "";

    const url = `${base}?token=${token}`;

    if (!socket || socket.readyState > 1) {
        socket = new WebSocket(url);

        socket.addEventListener("open", () => {
            console.log("WebSocket connected");
        });

        socket.addEventListener("close", (e) => {
            socket = null;
            console.log("WebSocket closed", e.code, e.reason);
        });

        socket.addEventListener("error", (e) => {
            console.log("WebSocket error", e);
        });
    }

    return socket;
}

