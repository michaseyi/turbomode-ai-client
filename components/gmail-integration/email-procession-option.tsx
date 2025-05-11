"use client"
import { FormEventHandler, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { GmailIntegration, ModifyGmailIntegration } from "@/types/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

type EmailProcessingOptionsProps = {
	integration: GmailIntegration[]
	activeIntegration?: string
}

export function EmailProcessingOptions({
	integration,
	activeIntegration,
}: EmailProcessingOptionsProps) {
	const active = integration.find(({ id }) => activeIntegration === id)
	const hide = !active
	const [processingMode, setProcessingMode] = useState(active?.gmail.emailProcessOption ?? "All")
	const [customPrompt, setCustomPrompt] = useState(active?.gmail.instruction ?? "")
	const [special, setSpecial] = useState(active?.gmail.specificAddresses ?? "")

	useEffect(() => {
		const active = integration.find(({ id }) => activeIntegration === id)
		setProcessingMode(active?.gmail.emailProcessOption ?? "All")
		setCustomPrompt(active?.gmail.instruction ?? "")
		setSpecial(active?.gmail.specificAddresses ?? "")
	}, [integration, activeIntegration])

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
	const queryClient = useQueryClient()

	const updateAccountMutation = useMutation({
		mutationKey: ["connect-gmail"],
		mutationFn: async (data: { id: string; payload: ModifyGmailIntegration }) => {
			return await api.integrations.modifyGmailIntegration(data.id, data.payload)
		},
		onError: (err) => {
			toast(err.message)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["gmail-integrations"] })
			toast("Email data source config updated")
		},
	})

	const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault()

		if (!activeIntegration) {
			return
		}

		updateAccountMutation.mutate({
			id: activeIntegration,
			payload: {
				emailProcessOption: processingMode,
				instruction: customPrompt,
				specificAddresses: special,
			},
		})
	}

	return (
		<form onSubmit={onSubmit} className="rounded-xl border bg-card/60 p-5 shadow-sm relative">
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
								checked={processingMode === "All"}
								onChange={() => setProcessingMode("All")}
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
								checked={processingMode === "FromSpecific"}
								onChange={() => setProcessingMode("FromSpecific")}
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
								checked={processingMode === "ExceptSpecific"}
								onChange={() => setProcessingMode("ExceptSpecific")}
								className="h-4 w-4 text-primary"
							/>
							<label htmlFor="ignore-specific" className="text-sm">
								Process all except from specific addresses
							</label>
						</div>
					</div>

					{processingMode !== "All" && (
						<div className="mt-3">
							<label htmlFor="email-patterns" className="mb-1 block text-xs text-muted-foreground">
								{processingMode === "FromSpecific"
									? "Enter email addresses to process"
									: "Enter email addresses to ignore"}
							</label>
							<input
								type="text"
								value={special}
								onChange={(e) => setSpecial(e.target.value)}
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
				{/* <div>
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
				</div> */}

				<div className="flex justify-end">
					<Button
						disabled={updateAccountMutation.isPending}
						type="submit"
						className="gap-2 bg-primary font-medium hover:bg-primary/90 w-48"
					>
						{updateAccountMutation.isPending ? (
							<Loader2 className="!h-6 !w-6 animate-spin text-muted-foreground" />
						) : (
							<>Save Processing Settings</>
						)}
					</Button>
				</div>
			</div>
			{hide && (
				<div className="absolute top-0 left-0 w-full h-full bg-background/70 rounded-xl"></div>
			)}
		</form>
	)
}
