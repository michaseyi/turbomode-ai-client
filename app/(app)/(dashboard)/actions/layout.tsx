import { ActionChatProvider } from "@/components/action-chat-provider"

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<ActionChatProvider>
			<div className="max-w-[51rem] mx-auto h-full">{children}</div>
		</ActionChatProvider>
	)
}
