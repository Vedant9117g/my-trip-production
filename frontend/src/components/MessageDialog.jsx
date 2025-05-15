import React, { useState, useEffect, useContext, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SocketContext } from "@/context/SocketContext";
import {
  useSendMessageMutation,
  useGetMessagesQuery,
} from "@/features/api/conversationApi";
import { addMessage, setMessages } from "@/features/conversationSlice";
import moment from "moment";
import { X } from "lucide-react";

const MessageDialog = ({ onClose }) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const { socket } = useContext(SocketContext);

  const rideDetails = useSelector((state) => state.ride.rideDetails);
  const loggedInUser = useSelector((state) => state.auth.user);

  const isCaptain = loggedInUser.role === "captain";
  const senderId = loggedInUser._id;
  const receiverId = isCaptain
    ? rideDetails?.userId?._id
    : rideDetails?.captainId?._id;

  const messages = useSelector(
    (state) => state.conversation.messages[receiverId] || []
  );

  const [sendMessage] = useSendMessageMutation();
  const { data: initialMessages } = useGetMessagesQuery(receiverId, {
    skip: !receiverId,
  });

  // Auto-scroll to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (initialMessages) {
      dispatch(setMessages({ [receiverId]: initialMessages.messages }));
    }

    const handleNewMessage = (receivedMessage) => {
      if (
        receivedMessage.senderId === receiverId ||
        receivedMessage.receiverId === receiverId
      ) {
        dispatch(addMessage({ receiverId, message: receivedMessage }));
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [initialMessages, socket, receiverId, dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = {
      senderId,
      receiverId,
      message,
      createdAt: new Date().toISOString(),
    };

    socket.emit("sendMessage", newMessage);
    dispatch(addMessage({ receiverId, message: newMessage }));
    await sendMessage({ receiverId, message });

    setMessage("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b dark:border-gray-700 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-2xl">
          <h2 className="text-lg font-semibold">
            Chat with {isCaptain ? "Passenger" : "Captain"}
          </h2>
          <button
            onClick={onClose}
            className="hover:text-red-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-white dark:bg-gray-900">
          {messages.length > 0 ? (
            messages.map((msg, index) => {
              const isUser = msg.senderId === loggedInUser._id;
              const formattedTime = moment(msg.createdAt).format("hh:mm A");

              return (
                <div
                  key={index}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`rounded-xl p-3 text-sm max-w-[75%] shadow-md ${
                      isUser
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-bl-none"
                    }`}
                  >
                    <p>{msg.message}</p>
                    <div className="text-xs mt-1 text-right opacity-70">
                      {formattedTime}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No messages yet
            </p>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-800 flex items-center gap-2 rounded-b-2xl">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-full border dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition duration-200 shadow"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageDialog;
