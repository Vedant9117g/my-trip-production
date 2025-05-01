import React, { useRef, useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, Bell } from "lucide-react";

const NotificationsDropdown = ({ notifications, onNotificationClick }) => {
  const scrollRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
      setIsAtBottom(atBottom);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="absolute right-4 top-14 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-[1000]">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
        <Bell className="w-5 h-5 text-blue-500" />
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          Notifications
        </h2>
      </div>

      {/* Scrollable Notification List */}
      <div
        ref={scrollRef}
        className="max-h-96 overflow-y-auto px-3 py-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-900"
      >
        {notifications.length === 0 ? (
          <div className="p-4 text-gray-500 text-center">No notifications</div>
        ) : (
          notifications.map((notification) => (


            <div
              key={notification._id}
              className="bg-gray-50 dark:bg-gray-700 shadow-xl shadow-gray-300 dark:shadow-black/40 rounded-lg mb-3  transition hover:shadow-2xl hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer relative z-20"
              onClick={() => onNotificationClick(notification)}
            >

              <div className=" flex ">
                {/* Icon with background */}
                <div className="bg-green-100 dark:bg-gray-900 flex items-center justify-center p-2 rounded-md">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
                </div>

                {/* Message with separate background */}
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                  <p className="text-sm text-gray-800 dark:text-gray-100">
                    {notification.message}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>

            </div>

          ))
        )}

        {/* End Message */}
        {notifications.length > 0 && isAtBottom && (
          <div className="text-center py-4 text-xs text-gray-400 dark:text-gray-500">
            That&apos;s all of your notifications
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsDropdown;
