import { IoSend } from "react-icons/io5";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSendMessageMutation, useGetMessagesQuery } from "@/features/api/conversationApi";
import { addMessage } from "@/features/conversationSlice";

const SendInput = () => {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.auth.selectedUser);
  const loggedInUser = useSelector((state) => state.auth.user);
  const [sendMessage] = useSendMessageMutation();
  const { refetch } = useGetMessagesQuery(selectedUser?._id, { skip: !selectedUser });

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedUser) return;

    const timestamp = new Date().toISOString(); // Generate timestamp

    const newMessage = {
      _id: Date.now().toString(), // Temporary ID
      senderId: loggedInUser._id,
      message,
      timestamp, // Add timestamp
    };

    // Optimistic UI update (adds message instantly)
    dispatch(addMessage({ receiverId: selectedUser._id, message: newMessage }));

    try {
      await sendMessage({ receiverId: selectedUser._id, message, timestamp }).unwrap();
      refetch(); // 🔄 Refetch messages to get the latest from the server
    } catch (error) {
      console.error("Failed to send message:", error);
    }

    setMessage(""); // Clear input field
  };

  return (
    <form onSubmit={sendMessageHandler} className="px-4 py-3">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Send a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border text-sm rounded-lg w-full p-3 border-gray-400 dark:border-gray-600 bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
        />
        <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-4">
          <IoSend className="text-black dark:text-white" />
        </button>
      </div>
    </form>
  );
};

export default SendInput;
