"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  return (
    <div className="container">
      <h1 className="title">Join a Chat Room</h1>
      <input
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        type="text"
        placeholder="Enter Room ID"
        className="input"
      />
      <button
        onClick={() => {
          if (roomId.trim()) {
            router.push(`/room/${roomId}`);
          }
        }}
        className="button"
      >
        Join Room
      </button>

      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          font-family: Arial, sans-serif;
        }
        .title {
          font-size: 2rem;
          font-weight: bold;
          color: white;
          margin-bottom: 20px;
        }
        .input {
          padding: 12px 16px;
          font-size: 1rem;
          border: none;
          border-radius: 8px;
          outline: none;
          width: 250px;
          margin-bottom: 15px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
        .input:focus {
          box-shadow: 0 0 0 3px rgba(0, 242, 254, 0.5);
        }
        .button {
          padding: 12px 20px;
          font-size: 1rem;
          font-weight: bold;
          color: #4facfe;
          background: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
        .button:hover {
          background: #e6f7ff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}
