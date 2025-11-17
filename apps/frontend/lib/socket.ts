let socket: WebSocket | null = null;

export function getSocket(roomId: string) {
    const base = process.env.NEXT_PUBLIC_API_WS_URL || "ws://localhost:8080";

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmMWUzMzhlZS0wYjY5LTRkYTMtOGEyMi0zYTBmYmUzNDUwNDIiLCJpYXQiOjE3NjMzNTkxODB9.-Z2LlTb6n0YkQ67tOEw6MftbqsRGo4oTx_hzAc4Vc0w"

    const url = `${base}?token=${token}`;

    if (!socket || socket.readyState > 1) {
        socket = new WebSocket(url);

        console.log("🔌 Creating new WebSocket connection:", url);

        socket.addEventListener("open", () => {
            console.log("WebSocket connected");
        });

        socket.addEventListener("close", (e) => {
            console.log("WebSocket closed", e.code, e.reason);
        });

        socket.addEventListener("error", (e) => {
            console.log("WebSocket error", e);
        });
    }

    return socket;
}

