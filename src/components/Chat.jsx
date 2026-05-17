import { useEffect, useState, useRef } from "react";
import { socket } from "../socket/socket";
import MessageBubble from "./MessageBubble";
import EmojiPicker from "emoji-picker-react";

const Chat = ({ username, room }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // MOBILE SIDEBAR
  const [showSidebar, setShowSidebar] = useState(false);

  // AUDIO
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const messagesEndRef = useRef(null);

  // JOIN ROOM
  useEffect(() => {
    socket.emit("joinRoom", { username, room });
  }, [username, room]);

  // SOCKET EVENTS
  useEffect(() => {
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("users", (usersList) => {
      setUsers(usersList);
    });

    socket.on("typing", (user) => {
      setTypingUser(user);

      setTimeout(() => {
        setTypingUser("");
      }, 1500);
    });

    socket.on("readMessages", () => {
      setMessages((prev) =>
        prev.map((m) => ({
          ...m,
          read: true,
        }))
      );
    });

    return () => socket.off();
  }, []);

  // AUTO SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

    socket.emit("readMessages", room);
  }, [messages, room]);

  // SEND MESSAGE
  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("sendMessage", {
      text: message,
    });

    setMessage("");
  };

  // FILE SEND
  const handleFile = (file) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      socket.emit("sendMessage", {
        file: reader.result,
        fileName: file.name,
        fileType: file.type,
      });
    };

    reader.readAsDataURL(file);
  };

  // START RECORDING
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: "audio/webm",
      });

      chunksRef.current = [];

      const reader = new FileReader();

      reader.onloadend = () => {
        socket.emit("sendMessage", {
          audio: reader.result,
        });
      };

      reader.readAsDataURL(blob);
    };

    mediaRecorder.start();
    setRecording(true);
  };

  // STOP RECORDING
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    setRecording(false);
  };

  return (
    <div className="h-dvh flex bg-[#0b141a] text-white overflow-hidden relative">

      {/* SIDEBAR */}
      <div
        className={`
          fixed md:static
          z-50
          top-0 left-0
          h-full
          w-[80%] sm:w-[60%] md:w-[30%] lg:w-[25%]
          bg-[#111b21]
          border-r border-gray-800
          flex flex-col
          transition-transform duration-300
          ${showSidebar ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >

        {/* SIDEBAR HEADER */}
        <div className="p-4 flex items-center justify-between bg-[#202c33] shadow-md">

          <h2 className="font-semibold text-lg">
            {username}
          </h2>

          {/* CLOSE BUTTON MOBILE */}
          <button
            className="md:hidden text-xl"
            onClick={() => setShowSidebar(false)}
          >
            ✕
          </button>
        </div>

        {/* USERS */}
        <div className="flex-1 overflow-y-auto">
          {users.map((user, i) => (
            <div
              key={i}
              onClick={() => {
                setSelectedUser(user.username);
                setShowSidebar(false);
              }}
              className={`
                flex items-center gap-3 p-4
                cursor-pointer transition
                border-b border-[#1f2c34]
                ${
                  selectedUser === user.username
                    ? "bg-[#2a3942]"
                    : "hover:bg-[#202c33]"
                }
              `}
            >
              <img
                src={`https://ui-avatars.com/api/?name=${user.username}`}
                className="w-10 h-10 rounded-full"
              />

              <div>
                <p className="text-sm md:text-base">
                  {user.username}
                </p>

                <p className="text-xs text-green-400">
                  online
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OVERLAY */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col">

        {/* CHAT HEADER */}
        <div className="bg-[#202c33] px-4 py-3 flex items-center gap-3 shadow-md">

          {/* MENU BUTTON */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setShowSidebar(true)}
          >
            ☰
          </button>

          <h2 className="font-medium text-sm md:text-base">
            {selectedUser || room}
          </h2>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3">

          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              currentUser={username}
            />
          ))}

          {typingUser && (
            <p className="text-xs text-gray-400 italic">
              {typingUser} is typing...
            </p>
          )}

          <div ref={messagesEndRef}></div>
        </div>

        {/* INPUT AREA */}
        <div className="bg-[#202c33] p-2 md:p-3 flex items-center gap-2 relative">

          {/* FILE */}
          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />

          <label
            htmlFor="fileInput"
            className="cursor-pointer text-xl"
          >
            📎
          </label>

          {/* EMOJI */}
          <button
            onClick={() => setShowEmoji(!showEmoji)}
          >
            😊
          </button>

          {showEmoji && (
            <div className="absolute bottom-16 left-2 z-50 scale-90 md:scale-100 origin-bottom-left">
              <EmojiPicker
                onEmojiClick={(e) =>
                  setMessage((prev) => prev + e.emoji)
                }
              />
            </div>
          )}

          {/* MIC */}
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            className={`
              px-3 py-2 rounded-full
              ${
                recording
                  ? "bg-red-500"
                  : "bg-gray-600"
              }
            `}
          >
            🎤
          </button>

          {/* INPUT */}
          <input
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              socket.emit("typing");
            }}
            onKeyDown={(e) =>
              e.key === "Enter" && sendMessage()
            }
            placeholder="Type a message..."
            className="
              flex-1
              p-3
              rounded-full
              bg-[#2a3942]
              outline-none
              text-sm md:text-base
            "
          />

          {/* SEND */}
          <button
            onClick={sendMessage}
            className="
              bg-green-500
              px-4 py-2
              rounded-full
              hover:bg-green-600
              transition
            "
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;