import { useState } from "react";

const Join = ({ onJoin }) => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4">
      <div className="w-full max-w-md bg-[#1e293b] p-6 rounded-2xl">
        <h1 className="text-white text-2xl mb-5 text-center">
          Join Chat
        </h1>

        <input
          className="w-full p-3 mb-3 rounded bg-[#0f172a] text-white"
          placeholder="Name"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="w-full p-3 mb-4 rounded bg-[#0f172a] text-white"
          placeholder="Room Code"
          onChange={(e) => setRoom(e.target.value)}
        />

        <button
          onClick={() => onJoin({ username, room })}
          className="w-full bg-indigo-500 py-3 rounded"
        >
          Join
        </button>
      </div>
    </div>
  );
};

export default Join;