"use client"
import { useState } from "react"
import Image from "next/image"
import { Mail, Plus, X, Check, ExternalLink, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Gmail from "@/assets/images/gmail.png"

type EmailAccount = {
	id: number
	provider: string
	connectedAt: Date
	email: string
}

interface ConnectedAccountsProps {
	accounts: EmailAccount[]
	onAddAccount: () => void
	onRemoveAccount: (id: number) => void
	isLoading?: boolean
}

export function ConnectedAccounts({
	accounts = [],
	onAddAccount,
	onRemoveAccount,
	isLoading = false,
}: ConnectedAccountsProps) {
	const [isDisconnecting, setIsDisconnecting] = useState<number | null>(null)

	const handleDisconnect = async (id: number) => {
		setIsDisconnecting(id)
		try {
			// In a real app, this would be an API call to disconnect the account
			await new Promise((resolve) => setTimeout(resolve, 1000))
			onRemoveAccount(id)
		} catch (error) {
			console.error("Failed to disconnect account", error)
		} finally {
			setIsDisconnecting(null)
		}
	}

	return (
		<div className="rounded-xl border bg-card/60 p-5 shadow-sm">
			<div className="mb-5 flex items-center justify-between">
				<h3 className="font-medium">Connected Accounts</h3>
				<Button onClick={onAddAccount} size="sm" variant="outline" className="h-8 gap-1.5">
					<Plus className="h-3.5 w-3.5" />
					Add Account
				</Button>
			</div>

			{accounts.length === 0 && !isLoading ? (
				<div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
					<Mail className="mb-2 h-10 w-10 text-muted-foreground/50" />
					<p className="text-sm text-muted-foreground">No email accounts connected yet</p>
					<Button onClick={onAddAccount} variant="secondary" size="sm" className="mt-4">
						Connect your first account
					</Button>
				</div>
			) : null}

			{isLoading ? (
				<div className="flex items-center justify-center py-6">
					<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
					<span className="ml-2 text-sm text-muted-foreground">Loading accounts...</span>
				</div>
			) : (
				<div className="space-y-3">
					{accounts.map((account) => (
						<div
							key={account.id}
							className="flex items-center justify-between rounded-lg border bg-background p-3 transition-colors"
						>
							<div className="flex items-center gap-3">
								<div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
									<Mail className="h-4 w-4 text-primary" />
								</div>
								<div>
									<p className="font-medium">{account.email}</p>
									<p className="text-xs text-muted-foreground">
										Connected {new Date(account.connectedAt).toLocaleDateString()}
									</p>
								</div>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => handleDisconnect(account.id)}
								disabled={isDisconnecting === account.id}
								className="h-8 px-2 text-sm text-muted-foreground hover:text-destructive"
							>
								{isDisconnecting === account.id ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<X className="h-4 w-4" />
								)}
							</Button>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

function EmailProcessingOptions() {
	const [processingMode, setProcessingMode] = useState("all")
	const [customPrompt, setCustomPrompt] = useState("")

	// Example preset prompts that users can select
	const examplePrompts = [
		{
			id: "categorize",
			title: "Categorize emails",
			description:
				"Automatically sort emails into Work, Personal, Finance, and Shopping categories",
			prompt:
				"Review each email and categorize it into one of the following: Work, Personal, Finance, or Shopping. Add appropriate tags and organize them in my folders.",
		},
		{
			id: "summarize",
			title: "Summarize long emails",
			description: "Create concise summaries of lengthy emails and save to notes",
			prompt:
				"For emails longer than 500 words, create a concise summary highlighting key points, action items, and deadlines. Save these summaries to my notes app.",
		},
		{
			id: "meeting",
			title: "Extract meeting details",
			description: "Identify meetings and add them to your calendar",
			prompt:
				"Scan emails for meeting invitations. Extract date, time, participants, and agenda, then create calendar events with appropriate reminders.",
		},
		{
			id: "followup",
			title: "Generate follow-up reminders",
			description: "Create reminders for emails requiring responses",
			prompt:
				"Identify emails that require my response or follow-up. Create reminders with appropriate deadlines based on the urgency and content of the email.",
		},
	]

	return (
		<div className="rounded-xl border bg-card/60 p-5 shadow-sm">
			<h3 className="mb-5 font-medium">Email Processing Options</h3>

			<div className="space-y-6">
				{/* Email selection settings */}
				<div>
					<h4 className="mb-3 text-sm font-medium text-muted-foreground">
						Which emails should be processed?
					</h4>

					<div className="space-y-2">
						<div className="flex items-center space-x-2">
							<input
								type="radio"
								id="process-all"
								name="processing-mode"
								value="all"
								checked={processingMode === "all"}
								onChange={() => setProcessingMode("all")}
								className="h-4 w-4 text-primary"
							/>
							<label htmlFor="process-all" className="text-sm">
								Process all emails
							</label>
						</div>

						<div className="flex items-center space-x-2">
							<input
								type="radio"
								id="process-specific"
								name="processing-mode"
								value="specific"
								checked={processingMode === "specific"}
								onChange={() => setProcessingMode("specific")}
								className="h-4 w-4 text-primary"
							/>
							<label htmlFor="process-specific" className="text-sm">
								Only process emails from specific addresses
							</label>
						</div>

						<div className="flex items-center space-x-2">
							<input
								type="radio"
								id="ignore-specific"
								name="processing-mode"
								value="ignore"
								checked={processingMode === "ignore"}
								onChange={() => setProcessingMode("ignore")}
								className="h-4 w-4 text-primary"
							/>
							<label htmlFor="ignore-specific" className="text-sm">
								Process all except from specific addresses
							</label>
						</div>
					</div>

					{processingMode !== "all" && (
						<div className="mt-3">
							<label htmlFor="email-patterns" className="mb-1 block text-xs text-muted-foreground">
								{processingMode === "specific"
									? "Enter email addresses to process"
									: "Enter email addresses to ignore"}
							</label>
							<input
								type="text"
								id="email-patterns"
								placeholder="example@domain.com, *@company.com, newsletter*"
								className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
							/>
							<p className="mt-1 text-xs text-muted-foreground">
								Separate multiple patterns with commas. Use * as wildcard (e.g. *@company.com).
							</p>
						</div>
					)}
				</div>

				{/* Processing instructions */}
				<div>
					<h4 className="mb-3 text-sm font-medium text-muted-foreground">
						What should the assistant do with emails?
					</h4>

					<div className="mb-4 grid gap-3 sm:grid-cols-2">
						{examplePrompts.map((example) => (
							<div
								key={example.id}
								onClick={() => setCustomPrompt(example.prompt)}
								className={`cursor-pointer rounded-lg border p-3 transition-all hover:border-primary/50 hover:bg-accent/50 ${
									customPrompt === example.prompt ? "border-primary bg-accent/60" : ""
								}`}
							>
								<h5 className="font-medium">{example.title}</h5>
								<p className="text-xs text-muted-foreground">{example.description}</p>
							</div>
						))}
					</div>

					<div>
						<label htmlFor="custom-prompt" className="mb-1 block text-xs text-muted-foreground">
							Custom instructions (or edit selected template)
						</label>
						<textarea
							id="custom-prompt"
							value={customPrompt}
							onChange={(e) => setCustomPrompt(e.target.value)}
							placeholder="Provide detailed instructions for how the AI should process your emails..."
							className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
						/>
						<p className="mt-1 text-xs text-muted-foreground">
							Be specific about how emails should be processed, categorized, and what actions to
							take.
						</p>
					</div>
				</div>

				{/* Advanced settings */}
				<div>
					<details className="rounded-lg border px-4 py-3">
						<summary className="cursor-pointer text-sm font-medium">Advanced settings</summary>
						<div className="mt-3 space-y-3 pt-2">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium">Process attachments</p>
									<p className="text-xs text-muted-foreground">
										Extract information from attached documents
									</p>
								</div>
								<div
									className="relative h-6 w-11 cursor-pointer rounded-full bg-muted px-1"
									role="switch"
								>
									<div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-muted-foreground transition-all"></div>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium">Process email thread history</p>
									<p className="text-xs text-muted-foreground">
										Include previous messages in thread analysis
									</p>
								</div>
								<div
									className="relative h-6 w-11 cursor-pointer rounded-full bg-muted px-1"
									role="switch"
								>
									<div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-muted-foreground transition-all"></div>
								</div>
							</div>
						</div>
					</details>
				</div>

				<div className="flex justify-end">
					<Button className="gap-2 bg-primary font-medium hover:bg-primary/90">
						Save Processing Settings
					</Button>
				</div>
			</div>
		</div>
	)
}

export default function GmailIntegrationPage() {
	const [accounts, setAccounts] = useState<EmailAccount[]>([
		{
			id: 1,
			email: "michaseyi@gmail.com",
			provider: "Gmail",
			connectedAt: new Date(),
		},
		{
			id: 2,
			email: "adewolem2@gmail.com",
			provider: "Gmail",
			connectedAt: new Date(),
		},
	])

	const handleAddAccount = () => {
		// Implementation for adding a new account
		console.log("Add account clicked")
	}

	const handleRemoveAccount = (id: number) => {
		setAccounts(accounts.filter((account) => account.id !== id))
	}

	return (
		<div>
			<div className="mb-8 flex items-center gap-4">
				<div className="flex shrink-0 h-12 w-12 items-center justify-center rounded-full bg-primary/10 p-2">
					<Image src={Gmail} alt="Gmail" width={24} height={24} />
				</div>
				<div>
					<h1 className="text-2xl font-semibold">Gmail Integration</h1>
					<p className="text-sm text-muted-foreground line-clamp-2">
						Integrate your Gmail account to enable the AI assistant to read, organize, and extract
						insights from your emails.
					</p>
				</div>
			</div>

			<div className="space-y-6">
				<ConnectedAccounts
					accounts={accounts}
					onAddAccount={handleAddAccount}
					onRemoveAccount={handleRemoveAccount}
				/>

				<EmailProcessingOptions />
			</div>
		</div>
	)
}
