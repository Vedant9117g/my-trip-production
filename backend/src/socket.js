const socketIo = require("socket.io");
const User = require("./models/User"); // Adjust path as needed

let io;
const userSocketMap = new Map(); // Map to store userId and socketId mappings

function initializeSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      Credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Listen for the "join" event with an object containing userId
    socket.on("join", async (data) => {
      const { userId } = data; // Extract userId from the object
      if (!userId) {
        console.log("No userId provided for join event");
        return;
      }

      try {
        // Fetch the user from the database
        const user = await User.findById(userId);
        if (!user) {
          console.log("User not found");
          return;
        }

        console.log(`Fetched user: ${user.name}, Role: ${user.role}`); // Debugging log

        // Map userId to socketId
        userSocketMap.set(userId, socket.id);
        console.log(`User ${userId} (${user.name}) joined with socket ID ${socket.id}`);

        // Update the user's socketId in the database
        user.socketId = socket.id;
        await user.save();
        console.log(`Updated socketId for user ${userId} in the database`);

        // Send a success message back to the client
        socket.emit("joinSuccess", `Welcome, ${user.name}!`);

        // Log based on role
        switch (user.role) {
          case "passenger":
            console.log(`Passenger ${user.name} is now connected`);
            break;
          case "captain":
            console.log(`Captain ${user.name} is now online`);
            break;
          case "both":
            console.log(`User ${user.name} has both roles and is connected`);
            break;
          default:
            console.log(`User ${user.name} with unknown role joined`);
        }
      } catch (err) {
        console.error("Error processing join event:", err.message);
      }
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
      console.log(`user disconnected: ${socket.id}`);
  });
  });
}

const sendMessageToSocketId = (socketId, messageObject) => {

  console.log(`Sending message to ${socketId}`, messageObject);

  if (io) {
      io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
      console.log('Socket.io not initialized.');
  }
}

module.exports = { initializeSocket , sendMessageToSocketId };

