import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { messages, setMessages } = useConversation();

	useEffect(() => {
		const handleNewMessage = (newMessage) => {
			newMessage.shouldShake = true;
			const sound = new Audio(notificationSound);
			sound.play();
			setMessages(newMessage); // Use addMessage instead of setMessages
		};
	
		socket?.on("receiveMessage", handleNewMessage);
	
		return () => {
			socket?.off("receiveMessage", handleNewMessage);
		};
	}, [socket, setMessages]);
	return null;  // This hook doesn't render anything
};

export default useListenMessages;
