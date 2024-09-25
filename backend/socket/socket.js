import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000"], // or your frontend URL if hosted elsewhere
		methods: ["GET", "POST"],
	},
});

const userSocketMap = {}; // { userId: socketId }

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

// Handle socket connections
io.on("connection", (socket) => {
	console.log("User connected:", socket.id);

	// Extract userId from query params
	const userId = socket.handshake.query.userId;
	if (userId !== "undefined") userSocketMap[userId] = socket.id;

	// Send the updated list of online users
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	// Listen for chat message events from clients
	socket.on("sendMessage", (messageData) => {
		const { senderId, receiverId, content } = messageData;
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("receiveMessage", {
				senderId,
				content,
			});
		}
	});

	// Handle disconnections
	socket.on("disconnect", () => {
		console.log("User disconnected:", socket.id);
		delete userSocketMap[userId]; // Remove user from map
		io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Update online users
	});
});

export { app, io, server };
