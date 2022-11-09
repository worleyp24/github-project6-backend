const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
dotenv.config();
connectDB();

app.use(express.json());
app.get("/", (request, response) => {
  response.send(`Welcome to Express App`);
});
app.use("/api/user", userRoutes);
app.use("/api/chat", conversationRoutes);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`.magenta.inverse);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://app-fam.netlify.app",
  },
});

io.on("connection", (socket) => {
  console.log(`Connected to Socket.io`);
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (conversation) => {
    socket.join(conversation);
    console.log("User Joined Conversation: " + conversation);
  });

  socket.on("new message", (newMessageRecieved) => {
    let conversation = newMessageRecieved.conversation;

    if (!conversation.users)
      return console.log("conversation.users not defined");

    conversation.users.forEach((user) => {
      if (user._id == newMessageRecieved.fromUserId._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
