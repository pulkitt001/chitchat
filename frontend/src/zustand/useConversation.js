import { create } from "zustand";

const useConversation = create((set) => ({
	selectedConversation: null,
	setSelectedConversation: (selectedConversation) => set({ selectedConversation }),

	messages: [],
	setMessages: (messages) => set({ messages }),

	// Add this function to append new messages safely
	addMessage: (newMessage) => set((state) => ({
		messages: [...state.messages, newMessage],
	})),
}));

export default useConversation;
