import { useState, useEffect, useRef } from "react";
import { IoChatbubbles, IoCloseSharp, IoSend } from "react-icons/io5";
import { PiStarFourFill } from "react-icons/pi";
import { FaUser } from "react-icons/fa";
import { LuSunMoon } from "react-icons/lu";
import { FaFilePdf } from "react-icons/fa6";
import { IoTrashOutline } from "react-icons/io5";
import jsPDF from "jspdf";
import { sendChatMessage } from "../../services/Chat";
import ReactMarkdown from "react-markdown";

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  messages: ChatMessage[];
}

function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load chat histories from localStorage
    const savedHistories = localStorage.getItem("chatHistories");
    if (savedHistories) {
      setChatHistories(JSON.parse(savedHistories));
    }
  }, []);

  useEffect(() => {
    // Save chat histories to localStorage whenever it changes
    localStorage.setItem("chatHistories", JSON.stringify(chatHistories));
  }, [chatHistories]);

  const createNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat: ChatHistory = {
      id: newChatId,
      title: "New Chat",
      messages: [],
    };
    setChatHistories((prev) => [...prev, newChat]);
    setCurrentChatId(newChatId);
    setMessages([]);
  };

  const selectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    const chat = chatHistories.find((h) => h.id === chatId);
    if (chat) {
      setMessages(chat.messages);
    }
  };

  const deleteChat = (chatId: string) => {
    setChatHistories((prev) => prev.filter((h) => h.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setLoading(true);

    try {
      const reply = await sendChatMessage(input);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Update chat history
      if (currentChatId) {
        setChatHistories((prev) =>
          prev.map((h) =>
            h.id === currentChatId
              ? { ...h, messages: [...h.messages, newMessage, aiMessage] }
              : h,
          ),
        );
      } else {
        // Create new chat if none is selected
        const newChatId = Date.now().toString();
        const newChat: ChatHistory = {
          id: newChatId,
          title: input.slice(0, 30) + "...",
          messages: [newMessage, aiMessage],
        };
        setChatHistories((prev) => [...prev, newChat]);
        setCurrentChatId(newChatId);
      }
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: "Connection error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error(err);
    }

    setInput("");
    setLoading(false);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    messages.forEach((msg, i) => {
      doc.text(
        `${msg.sender === "user" ? "You" : "AI"}: ${msg.text}`,
        10,
        10 + i * 10,
      );
    });
    doc.save("chat_history.pdf");
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 bg-gradient-to-tl from-[#635BFF] to-[#2bb8db] text-white p-4 rounded-full shadow-lg z-50 hover:bg-blue-600 transition-colors"
      >
        {isOpen ? (
          <IoCloseSharp className="text-2xl" />
        ) : (
          <IoChatbubbles className="text-2xl" />
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-8 w-[80%] h-[80%] bg-white border rounded-lg shadow-lg z-50 flex">
          {/* Sidebar */}
          <div
            className={`w-1/4 border-r ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}
          >
            <div className="p-4">
              <button
                onClick={createNewChat}
                className="w-full py-2 px-4 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                + New Chat
              </button>
            </div>
            <div className="overflow-y-auto h-[calc(100%-80px)]">
              {chatHistories.map((chat) => (
                <div
                  key={chat.id}
                  className={`flex justify-between items-center p-3 cursor-pointer hover:bg-gray-200 ${
                    currentChatId === chat.id ? "bg-gray-200" : ""
                  }`}
                >
                  <div
                    className="flex-1 truncate"
                    onClick={() => selectChat(chat.id)}
                  >
                    {chat.title}
                  </div>
                  <button
                    onClick={() => deleteChat(chat.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <IoTrashOutline />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Main Chat Area */}
          <div
            className={`flex-1 flex flex-col ${darkMode ? "bg-gray-900" : "bg-white"}`}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`px-4 py-2 rounded flex items-center gap-2 ${
                  darkMode ? "text-white" : "text-gray-700"
                }`}
              >
                <LuSunMoon className="text-xl" />
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
              <button
                onClick={exportPDF}
                className="px-4 py-2 rounded flex items-center gap-2 text-gray-700"
              >
                <FaFilePdf /> Export PDF
              </button>
            </div>

            {/* Messages */}
            <div
              className={`flex-1 overflow-y-auto p-4 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-6 ${
                    msg.sender === "user" ? "ml-auto" : "mr-auto"
                  }`}
                >
                  <div
                    className={`flex items-start gap-4 max-w-3xl ${
                      msg.sender === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {msg.sender === "user" ? (
                        <FaUser className="text-lg" />
                      ) : (
                        <PiStarFourFill className="text-lg" />
                      )}
                    </div>
                    <div
                      className={`prose max-w-none p-4 rounded-lg ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white"
                          : darkMode
                            ? "bg-gray-700 text-white"
                            : "bg-white"
                      }`}
                    >
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-gray-500">
                  <PiStarFourFill className="animate-spin" />
                  <span>AI is thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !e.shiftKey && sendMessage()
                  }
                  placeholder="Type your message..."
                  className={`flex-1 p-3 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading}
                  className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <IoSend className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBox;
