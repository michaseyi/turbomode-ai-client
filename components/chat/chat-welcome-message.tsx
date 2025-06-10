"use client"
import { AuthUser } from "@/types/api"

const defaultPrompts = [
	{
		title: "Email Assistant",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="text-blue-500"
			>
				<rect width="20" height="16" x="2" y="4" rx="2" />
				<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
			</svg>
		),
		description: `"Summarize my unread emails" or "Draft a response to John's latest message"`,
	},
	{
		title: "Calendar Management",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="text-green-500"
			>
				<rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
				<line x1="16" x2="16" y1="2" y2="6" />
				<line x1="8" x2="8" y1="2" y2="6" />
				<line x1="3" x2="21" y1="10" y2="10" />
				<path d="M8 14h.01" />
				<path d="M12 14h.01" />
				<path d="M16 14h.01" />
				<path d="M8 18h.01" />
				<path d="M12 18h.01" />
				<path d="M16 18h.01" />
			</svg>
		),
		description: `"What meetings do I have tomorrow?" or "Schedule a call with the marketing team"`,
	},
	{
		title: "Notes & Documents",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="text-purple-500"
			>
				<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
				<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
			</svg>
		),
		description: `"Find notes from yesterday's meeting" or "Summarize my project report"`,
	},
	{
		title: "Smart Suggestions",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="text-amber-500"
			>
				<path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
				<path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
				<circle cx="12" cy="12" r="2" />
				<path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
				<path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
			</svg>
		),
		description: `"Analyze my spending trends" or "Give me ideas for my presentation next week"`,
	},
]

type ChatWelcomeMessageProps = {
	user: AuthUser
	onSelectPrompt: (prompt: string) => void
}

export function ChatWelcomeMessage({ user, onSelectPrompt }: ChatWelcomeMessageProps) {
	return (
		<div className="flex flex-col items-center justify-center h-full text-center p-6">
			<div className="mb-4 text-3xl font-bold text-primary">Welcome, {user.firstName}!</div>
			<p className="text-lg text-muted-foreground mb-6">How can I help you today?</p>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
				{defaultPrompts.map((prompt, idx) => (
					<div
						key={prompt.title + idx}
						className="bg-muted/50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
						onClick={() => onSelectPrompt(prompt.description)}
					>
						<h3 className="font-medium mb-2 flex items-center justify-center gap-2">
							{prompt.icon}
							{prompt.title}
						</h3>
						<p className="text-sm text-muted-foreground">{prompt.description}</p>
					</div>
				))}
			</div>
		</div>
	)
}
