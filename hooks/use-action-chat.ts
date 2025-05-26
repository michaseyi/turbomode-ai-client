"use client"
import { ActionChatContext } from "@/components/action-chat-provider"
import { useContext } from "react"

export function useActionChat() {
	return useContext(ActionChatContext)
}
