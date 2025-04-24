import React, { useState } from "react";
import { IoChatbubbles, IoCloseSharp, IoSend } from "react-icons/io5";
import { PiStarFourFill } from "react-icons/pi";
import { FaUser } from "react-icons/fa";
import { LuSunMoon } from "react-icons/lu";
import { FaFilePdf } from "react-icons/fa6";
import jsPDF from "jspdf";
import { sendChatMessage } from "../../services/Chat";
import { useEffect } from "react";
function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatBox = () => {
    setIsOpen(!isOpen);
  };
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const reply = await sendChatMessage(input);
      setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Lỗi kết nối đến AI!!!" },
      ]);
      console.error(err);
    }

    setInput("");
    setLoading(false);
  };
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ sender: "ai", text: "Hello, can I help you?" }]);
    }
  }, [isOpen]);

  const exportPDF = () => {
    const doc = new jsPDF();
    messages.forEach((msg, i) => {
      doc.text(
        `${msg.sender === "user" ? "Bạn" : "AI"}: ${msg.text}`,
        10,
        10 + i * 10
      );
    });
    doc.save("chat_history.pdf");
  };

  return (
    <div>
      <button
        onClick={toggleChatBox}
        className="fixed bottom-5 right-5 bg-gradient-to-tl from-[#635BFF] to-[#2bb8db] text-white p-4 rounded-full shadow-lg z-50 hover:bg-blue-600 transition-colors"
      >
        {isOpen ? (
          <IoCloseSharp className="text-2xl" />
        ) : (
          <IoChatbubbles className="text-2xl" />
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-8 w-1/3 h-3/4 bg-white border rounded-lg shadow-lg z-50">
          <div
            className={`w-full h-full m-auto font-sans ${
              darkMode ? "bg-[#1e1e1e]" : "bg-white "
            } rounded-lg p-4`}
          >
            {/* Header buttons */}
            <div className="text-center h-[10%] flex justify-center items-center gap-2.5 bg-gradient-to-tl from-[#635BFF] to-[#2bb8db]">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-4  py-2 rounded flex items-center  transition-colors font-medium text-white hover:text-gray-200"
              >
                <LuSunMoon className="text-xl " /> Dark Mode
              </button>
              <button
                onClick={exportPDF}
                className="px-4 py-2 rounded flex items-center  transition-colors font-medium text-white hover:text-gray-200"
              >
                <FaFilePdf /> Xuất PDF
              </button>
            </div>

            {/* Messages container */}
            <div
              className={`h-[80%] p-2.5 overflow-y-auto ${
                darkMode ? "bg-gray-700" : "bg-white"
              }`}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 mb-5 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[#F4F7FB]">
                    <b className="flex items-center">
                      {msg.sender === "user" ? (
                        <FaUser className="text-gray-600" />
                      ) : (
                        <PiStarFourFill className="text-lg text-blue-500" />
                      )}
                      :
                    </b>
                    <span className="text-black ml-1"> {msg.text}</span>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="italic flex items-center gap-2 text-gray-500 text-base">
                  <PiStarFourFill className="animate-spin" />
                  Loading...
                </div>
              )}
            </div>

            {/* Input area */}
            <div className="h-[10%] flex items-center gap-2 mt-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Nhập tin nhắn..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                className="p-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <IoSend />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBox;
