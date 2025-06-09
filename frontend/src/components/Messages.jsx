import { useEffect } from "react";
import Message from "./Message";
import { useSelector, useDispatch } from "react-redux";
import { useGetMessagesQuery } from "@/features/api/conversationApi";
import { addMessage, setMessages } from "../features/conversationSlice";

const Messages = () => {
  const selectedUser = useSelector((state) => state.auth.selectedUser);
  const messages = useSelector((state) => state.conversation.messages[selectedUser?._id] || []);
  const socket = useSelector((state) => state.socket.socket); // ✅ Get socket from Redux
  const dispatch = useDispatch();

  const { data: initialMessages, isLoading } = useGetMessagesQuery(selectedUser?._id, { skip: !selectedUser });

  // Set initial messages when user is selected
  useEffect(() => {
    if (initialMessages) {
      dispatch(setMessages({ [selectedUser._id]: initialMessages }));
    }
  }, [initialMessages, dispatch, selectedUser]);

  // Listen for new messages via socket
  useEffect(() => {
    if (socket && selectedUser) {
      const handleNewMessage = (message) => {
        if (message.senderId === selectedUser._id || message.receiverId === selectedUser._id) {
          dispatch(addMessage({ receiverId: selectedUser._id, message }));
        }
      };

      socket.on("newMessage", handleNewMessage);

      return () => {
        socket.off("newMessage", handleNewMessage);
      };
    }
  }, [socket, selectedUser, dispatch]);

  if (!selectedUser) {
    return <p className="p-4 text-center">Select a user to start chatting</p>;
  }

  return (
    <div className="flex-1 overflow-auto p-4 space-y-2 bg-gray-100 dark:bg-gray-900">
      {isLoading ? (
        <p className="text-center">Loading messages...</p>
      ) : (
        Array.isArray(messages) && messages.map((msg) => <Message key={msg._id} message={msg} />)
      )}
    </div>
  );
};

export default Messages;