import moment from "moment";
import { useSelector } from "react-redux";

const Message = ({ message }) => {
  const loggedInUser = useSelector((state) => state.auth.user); // Get logged-in user
  const isUser = message.senderId === loggedInUser?._id; // ✅ Compare with logged-in user ID
  const formattedTime = moment(message.createdAt).format("hh:mm A"); // ✅ Format creation time

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`chat-bubble ${isUser ? "bg-blue-500 text-white" : "bg-gray-300 text-black"} dark:${isUser ? "bg-blue-700" : "bg-gray-600"} p-2 rounded-lg max-w-xs`}>
        {message.message}
        <div className="text-xs text-gray-200 mt-1 text-right">{formattedTime}</div> {/* ✅ Show message creation time */}
      </div>
    </div>
  );
};

export default Message;
