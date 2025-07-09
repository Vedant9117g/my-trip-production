import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiMessageCircle, FiX } from "react-icons/fi";

const welcomeMessages = [
  "👋 Hi! I'm your MyTrip Assistant.",
  "Ask me anything about booking rides, offers, or using MyTrip!",
  "How can I help you today?",
];

function getBotReply(userMsg) {
  // Simple rule-based responses for demo
  const msg = userMsg.toLowerCase();
  if (msg.includes("book") || msg.includes("ride")) {
    return "To book a ride, use the search bar above. Enter your origin, destination, and date, then click 'Search'.";
  }
  if (msg.includes("offer") || msg.includes("discount")) {
    return "Check out our Offers section for the latest discounts and deals!";
  }
  if (msg.includes("login") || msg.includes("register")) {
    return "You can login or register using the buttons at the top right.";
  }
  if (msg.includes("help") || msg.includes("support")) {
    return "For support, visit our Help Center or contact us via the support page.";
  }
  if (msg.includes("track")) {
    return "After booking, you can track your ride in real-time from your dashboard.";
  }
  return "I'm here to help! Ask me about rides, offers, or anything about MyTrip.";
}

const AIChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: welcomeMessages[0] },
    { from: "bot", text: welcomeMessages[1] },
    { from: "bot", text: welcomeMessages[2] },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((msgs) => [...msgs, { from: "user", text: userMsg }]);
    setInput("");
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: getBotReply(userMsg) },
      ]);
    }, 700);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[120]">
      {/* Chatbot Button */}
      {!open && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1, rotate: 6 }}
          className="bg-blue-600 text-white p-4 rounded-full shadow-xl flex items-center justify-center"
          onClick={() => setOpen(true)}
        >
          <FiMessageCircle className="text-2xl" />
        </motion.button>
      )}

      {/* Chatbot Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: 80, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="w-80 max-w-[90vw] bg-white dark:bg-gray-900 border border-blue-200 dark:border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-blue-600 dark:bg-blue-800 text-white">
              <span className="font-bold flex items-center gap-2">
                <FiMessageCircle /> MyTrip Assistant
              </span>
              <button
                onClick={() => setOpen(false)}
                className="hover:bg-blue-700/30 rounded-full p-1 transition"
              >
                <FiX className="text-lg" />
              </button>
            </div>
            {/* Messages */}
            <div className="flex-1 px-4 py-3 space-y-2 overflow-y-auto bg-blue-50/60 dark:bg-gray-950/80" style={{ minHeight: 220, maxHeight: 320 }}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg text-sm shadow
                      ${msg.from === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-blue-100 rounded-bl-none border border-blue-100 dark:border-gray-800"
                      }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            {/* Input */}
            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 border-t border-blue-100 dark:border-gray-800"
            >
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 px-3 py-2 rounded-lg border border-blue-200 dark:border-gray-700 bg-blue-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition"
              >
                <FiSend />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChatBot;