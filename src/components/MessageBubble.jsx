const MessageBubble = ({ msg, currentUser }) => {
  const isMe = msg.user === currentUser;

  return (
    <div className={`flex ${isMe ? "justify-end" : ""}`}>
      <div className="p-3 bg-gray-700 rounded-lg max-w-[85%] md:max-w-[60%]">

        {msg.text && <p>{msg.text}</p>}

        {msg.file && (
          <div className="mt-2">
            {msg.fileType?.startsWith("image") ? (
              <img src={msg.file} className="w-40 rounded" />
            ) : (
              <a
                href={msg.file}
                download={msg.fileName}
                className="text-blue-400 underline"
              >
                📎 {msg.fileName}
              </a>
            )}
          </div>
        )}

        {/* AUDIO */}
        {msg.audio && (
          <audio controls className="mt-2">
            <source src={msg.audio} type="audio/webm" />
          </audio>
        )}

        <div className="text-xs text-right mt-1 opacity-70">
          {new Date(msg.time || Date.now()).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}

          {isMe && (
            <span className={msg.read ? "text-blue-400" : ""}>
              {msg.read ? "✔✔" : "✔"}
            </span>
          )}
        </div>

      </div>
    </div>
  );
};

export default MessageBubble;