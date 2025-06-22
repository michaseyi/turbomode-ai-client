"use client"
import { BlockNoteView } from "@blocknote/mantine"
import { useCreateBlockNote } from "@blocknote/react"
import React, { useEffect, useState } from "react"
import { Send, Loader2 } from "lucide-react"

import "@blocknote/mantine/style.css"
import "./styles.css"
import { Button } from "../ui/button"
import { useMutation } from "@tanstack/react-query"
import { NewEmailPayload, ReplyEmailPayload } from "@/types/api"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export type EmailComposerProps = {
	integrationId: string
	initial?: string
	onSendDone?: () => void
} & (
	| {
			isReply: false
	  }
	| {
			isReply: true
			messageId: string
	  }
)

export function EmailComposer(props: EmailComposerProps) {
	const { integrationId, isReply } = props
	const [to, setTo] = useState("")
	const [subject, setSubject] = useState("")

	const editor = useCreateBlockNote()

	const sendOrReplyMutation = useMutation({
		mutationKey: ["send-or-reply", integrationId],
		mutationFn: async (payload: ReplyEmailPayload | NewEmailPayload) => {
			return await api.integrations.sendGmailMessage(integrationId, payload)
		},
		onSuccess: () => {
			reset()
			toast.success("Email sent")

			if (props.onSendDone) {
				props.onSendDone()
			}
		},
		onError: () => {
			toast.error("Unexpected error sending mail")
		},
	})

	const handleSend = async () => {
		const body = await editor.blocksToHTMLLossy()

		sendOrReplyMutation.mutate(
			isReply
				? {
						messageId: props.messageId,
						body,
				  }
				: {
						to: [to],
						subject,
						body,
				  }
		)
	}

	useEffect(() => {
		if (props.initial) {
			editor.pasteHTML(props.initial)
		}
	}, [props.initial])

	function reset() {
		setTo("")
		setSubject("")
	}

	return (
		<div className="bg-card divide-y divide-border overflow-hidden h-full flex flex-col">
			{!isReply && (
				<div className="p-4 space-y-4">
					<div className="flex items-center space-x-3">
						<label className="text-sm font-medium text-muted-foreground w-16 flex-shrink-0">
							To:
						</label>
						<input
							type="email"
							value={to}
							onChange={(e) => setTo(e.target.value)}
							placeholder="recipient@example.com"
							className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all duration-200 text-sm text-foreground placeholder:text-muted-foreground"
						/>
					</div>

					<div className="flex items-center space-x-3">
						<label className="text-sm font-medium text-muted-foreground w-16 flex-shrink-0">
							Subject:
						</label>
						<input
							type="text"
							value={subject}
							onChange={(e) => setSubject(e.target.value)}
							placeholder="Enter subject line"
							className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all duration-200 text-sm text-foreground placeholder:text-muted-foreground"
						/>
					</div>
				</div>
			)}

			<div className="py-2 flex-1 min-h-0">
				<div
					className={cn(
						"bg-background overflow-scroll h-full relative",
						isReply ? "min-h-[100px]" : "min-h-[400px] md:min-h-[500px]"
					)}
				>
					<BlockNoteView editor={editor} data-theming-css-variables-demo className="email-editor" />
				</div>
			</div>

			<div className="p-3 flex justify-end">
				<Button
					disabled={sendOrReplyMutation.isPending}
					onClick={handleSend}
					className="cursor-pointer"
				>
					{sendOrReplyMutation.isPending ? (
						<Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
					) : (
						<Send className="w-4 h-4" />
					)}
					<span>Send</span>
				</Button>
			</div>
		</div>
	)
}
