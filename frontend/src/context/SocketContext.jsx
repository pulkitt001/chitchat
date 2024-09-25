import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const [messages, setMessages] = useState([]); // Store messages here
	const { authUser } = useAuthContext();

	useEffect(() => {
		if (authUser) {
			// Initialize the socket connection
			const socketInstance = io("https://chatwithchai.onrender.com/", {
				query: {
					userId: authUser._id,
				},
			});

			setSocket(socketInstance);

			// Listen for the list of online users
			socketInstance.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			// Listen for incoming messages
			socketInstance.on("receiveMessage", (messageData) => {
				setMessages((prevMessages) => [...prevMessages, messageData]);
			});

			// Clean up socket connection on component unmount or when user logs out
			return () => {
				socketInstance.close();
			};
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [authUser]);

	// Method to send messages
	const sendMessage = (receiverId, content) => {
		if (socket) {
			socket.emit("sendMessage", {
				senderId: authUser._id,
				receiverId,
				content,
			});
		}
	};

	return (
		<SocketContext.Provider value={{ socket, onlineUsers, messages, sendMessage }}>
			{children}
		</SocketContext.Provider>
	);
};
