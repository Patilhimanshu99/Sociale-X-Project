import { useContext, useEffect, useState } from "react";
import socket from "../services/socket";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

function Chat() {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [chatId, setChatId] = useState("");

  // connect user to socket
  useEffect(() => {
    socket.emit("addUser", user.id);

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receiveMessage");
  }, [user.id]);

  // create or get chat automatically
  const startChat = async () => {
    if (!receiverId) return alert("Enter receiver user id");

    try {
      const res = await api.post("/chats", { receiverId });
      setChatId(res.data._id);
      setMessages([]);
    } catch (err) {
      alert("Failed to start chat");
    }
  };

  const sendMessage = async () => {
    if (!text || !chatId) return;

    await api.post("/chats/message", {
      chatId,
      text
    });

    setText("");
  };

  return (
    <div>
      <h2>Chat</h2>

      <input
        placeholder="Receiver User ID"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
      />
      <button onClick={startChat}>Start Chat</button>

      <div
        style={{
          border: "1px solid #ccc",
          height: "200px",
          overflowY: "auto",
          marginTop: "10px"
        }}
      >
        {messages.map((m, index) => (
          <p key={index}>
            <strong>{m.senderId === user.id ? "You" : "User"}:</strong>{" "}
            {m.text}
          </p>
        ))}
      </div>

      <input
        placeholder="Message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
