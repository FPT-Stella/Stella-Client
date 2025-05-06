import { useState, useEffect, useRef } from "react";
import { IoChatbubbles, IoCloseSharp, IoSend } from "react-icons/io5";
import { FaRobot } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";
import { IoTrashOutline } from "react-icons/io5";
import { BiPlus } from "react-icons/bi";
import { TbResize } from "react-icons/tb";
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

interface ChatBoxSize {
  width: number;
  height: number;
}

const DEFAULT_WIDTH = 80; // % of screen width
const DEFAULT_HEIGHT = 75; // % of screen height
const MIN_WIDTH = 40; // %
const MIN_HEIGHT = 50; // %
const MAX_WIDTH = 95; // %
const MAX_HEIGHT = 95; // %

function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [size, setSize] = useState<ChatBoxSize>({
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  // Add greeting message when chat is opened
  useEffect(() => {
    if (isOpen && messages.length === 0 && !currentChatId) {
      const greetingMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "ai",
        text: "Hello, how can I help you today?",
        timestamp: new Date(),
      };
      setMessages([greetingMessage]);
    }
  }, [isOpen, messages.length, currentChatId]);

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

    // Load saved chat box size if exists
    const savedSize = localStorage.getItem("chatBoxSize");
    if (savedSize) {
      setSize(JSON.parse(savedSize));
    }
  }, []);

  useEffect(() => {
    // Save chat histories to localStorage whenever it changes
    localStorage.setItem("chatHistories", JSON.stringify(chatHistories));
  }, [chatHistories]);

  useEffect(() => {
    // Save chat box size to localStorage
    localStorage.setItem("chatBoxSize", JSON.stringify(size));
  }, [size]);

  // Handle resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !chatBoxRef.current) return;

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Calculate new width and height as percentages
      const newWidth = Math.min(
        MAX_WIDTH,
        Math.max(MIN_WIDTH, (e.clientX / windowWidth) * 100)
      );
      const newHeight = Math.min(
        MAX_HEIGHT,
        Math.max(MIN_HEIGHT, (e.clientY / windowHeight) * 100)
      );

      setSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const startResizing = () => {
    setIsResizing(true);
  };

  const createNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat: ChatHistory = {
      id: newChatId,
      title: "New Chat",
      messages: [],
    };

    // Add greeting message to new chat
    const greetingMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "ai",
      text: "Hello, how can I help you today?",
      timestamp: new Date(),
    };

    newChat.messages = [greetingMessage];
    setChatHistories((prev) => [...prev, newChat]);
    setCurrentChatId(newChatId);
    setMessages([greetingMessage]);
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
          prev.map((h) => {
            if (h.id === currentChatId) {
              // Update title only if it's still the default "New Chat"
              const updatedTitle =
                h.title === "New Chat"
                  ? input.length > 30
                    ? input.slice(0, 30) + "..."
                    : input
                  : h.title;

              return {
                ...h,
                title: updatedTitle,
                messages: [...h.messages, newMessage, aiMessage],
              };
            }
            return h;
          })
        );
      } else {
        // Create new chat if none is selected
        const newChatId = Date.now().toString();
        const greetingMessage: ChatMessage = {
          id: (Date.now() - 1).toString(),
          sender: "ai",
          text: "Hello, how can I help you today?",
          timestamp: new Date(Date.now() - 1000),
        };

        const newChat: ChatHistory = {
          id: newChatId,
          title: input.length > 30 ? input.slice(0, 30) + "..." : input,
          messages: [greetingMessage, newMessage, aiMessage],
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
        10 + i * 10
      );
    });
    doc.save("chat_history.pdf");
  };

  const resetSize = () => {
    setSize({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT });
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 bg-gradient-to-tl from-[#635BFF] to-[#2bb8db] text-white p-4 rounded-full shadow-lg z-50 hover:from-[#5349FF] hover:to-[#1a9fc0] transition-all"
      >
        {isOpen ? (
          <IoCloseSharp className="text-3xl" />
        ) : (
          <IoChatbubbles className="text-3xl" />
        )}
      </button>

      {isOpen && (
        <div
          ref={chatBoxRef}
          style={{
            width: `${size.width}%`,
            height: `${size.height}%`,
          }}
          className="fixed bottom-20 right-8 bg-white border rounded-lg shadow-xl z-50 flex overflow-hidden"
        >
          {/* Size Controls */}
          <div className="absolute top-0 right-0 flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-bl-lg z-10">
            <button
              onClick={resetSize}
              className="p-1 text-gray-500 hover:text-blue-500 transition-colors"
              title="Khôi phục kích thước mặc định"
            >
              <TbResize size={16} />
            </button>
            <div
              className="w-4 h-4 cursor-nwse-resize bg-gray-200 hover:bg-gray-300 transition-colors"
              onMouseDown={startResizing}
              title="Kéo để thay đổi kích thước"
            ></div>
          </div>

          {/* Sidebar */}
          <div className="w-[260px] bg-[#f9f9f9] border-r border-gray-200 flex flex-col">
            <div className="p-3 border-b border-gray-200">
              <button
                onClick={createNewChat}
                className="w-full py-2 px-3 rounded bg-[#635BFF] text-white hover:bg-[#5349FF] transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <BiPlus className="text-lg" /> New Chat
              </button>
            </div>
            <div className="overflow-y-auto flex-1 py-2">
              {chatHistories.length === 0 ? (
                <div className="text-center text-gray-500 py-4 text-sm">
                  Not found chatchat
                </div>
              ) : (
                chatHistories.map((chat) => (
                  <div
                    key={chat.id}
                    className={`flex justify-between items-center px-3 py-2 cursor-pointer hover:bg-gray-200 mx-2 rounded-md ${
                      currentChatId === chat.id ? "bg-gray-200" : ""
                    }`}
                  >
                    <div
                      className="flex-1 truncate text-sm font-medium"
                      onClick={() => selectChat(chat.id)}
                    >
                      {chat.title}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      className="text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-gray-100"
                    >
                      <IoTrashOutline />
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="p-3 border-t border-gray-200">
              <button
                onClick={exportPDF}
                className="w-full py-2 px-3 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <FaFilePdf /> PDF
              </button>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col bg-white">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`${
                    msg.sender === "user" ? "bg-white" : "bg-[#f9f9f9]"
                  }`}
                >
                  <div className=" mx-auto py-5 px-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          msg.sender === "user"
                            ? "bg-gray-300 text-gray-700"
                            : "bg-gradient-to-tl from-[#635BFF] to-[#2bb8db] text-white"
                        }`}
                      >
                        {msg.sender === "user" ? (
                          <FaUser className="text-sm" />
                        ) : (
                          <FaRobot className="text-sm" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm mb-1">
                          {msg.sender === "user" ? "You" : "AI Assistant"}
                        </div>
                        <div className="prose max-w-none text-sm">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="bg-[#f9f9f9] py-5">
                  <div className="max-w-4xl mx-auto px-4 flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-tl from-[#635BFF] to-[#2bb8db] flex items-center justify-center text-white">
                      <FaRobot className="text-sm" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1">
                        AI Assistant
                      </div>
                      <div className="text-gray-500 text-sm flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#635BFF] rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-[#635BFF] rounded-full animate-pulse delay-150"></div>
                        <div className="w-2 h-2 bg-[#635BFF] rounded-full animate-pulse delay-300"></div>
                        <span className="ml-1">Loading...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white flex justify-center">
              <div className="  mx-5 w-full">
                <div className="relative w-full">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Enter your question..."
                    rows={1}
                    className="w-full p-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#635BFF] focus:border-transparent resize-none text-sm bg-white"
                    style={{ minHeight: "50px", maxHeight: "150px" }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="absolute right-3 bottom-2.5 p-2 text-white rounded-md bg-gradient-to-tl from-[#635BFF] to-[#2bb8db] hover:from-[#5349FF] hover:to-[#1a9fc0] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <IoSend className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBox;
