"use client"
import { useAuthUser } from "@/hooks/use-auth-user"
import { ChatWelcomeMessage } from "@/components/chat/chat-welcome-message"
import { ChatInput } from "@/components/chat/chat-input"
import { Layout } from "@/components/layout"
import { useActionChat } from "@/hooks/use-action-chat"

export default function NewChatPage() {
	const user = useAuthUser()

	const { initiate } = useActionChat()

	return (
		<div className="h-full flex relative">
			<Layout className="!pt-0">
				<div className="bg-card flex flex-col h-full text-foreground">
					<div className="overflow-y-auto mb-4 pr-2 scrollbar-hidden flex-auto">
						<ChatWelcomeMessage user={user} />
					</div>

					<ChatInput disabled={false} onSubmit={initiate} />
				</div>
			</Layout>
		</div>
	)
}
