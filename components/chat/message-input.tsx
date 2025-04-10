"use client"
import { useState, useRef } from "react"
import { Bot, CornerUpRight, Paperclip, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

type MessageInputProps = {
	value: string
	onChange: (value: string) => void
	onSendMessage: (
		message: string,
		attachments?: { name: string; size: string; type: string }[]
	) => void
}

export default function MessageInput({ value, onChange, onSendMessage }: MessageInputProps) {
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault()
			onSendMessage(value)
		}
	}

	const triggerFileUpload = () => {
		fileInputRef.current?.click()
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (!files || files.length === 0) return

		// Process file upload
		const fileArray = Array.from(files).map((file) => ({
			name: file.name,
			size: formatFileSize(file.size),
			type: file.type,
		}))

		onSendMessage("I've uploaded some files for reference.", fileArray)

		// Reset file input
		if (fileInputRef.current) fileInputRef.current.value = ""
	}

	const formatFileSize = (bytes: number) => {
		if (bytes < 1024) return bytes + " bytes"
		else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
		else return (bytes / 1048576).toFixed(1) + " MB"
	}

	return (
		<div className="border-t p-4">
			<div className="mx-auto max-w-3xl">
				<div className="relative flex w-full items-center">
					<input
						type="file"
						ref={fileInputRef}
						className="hidden"
						multiple
						onChange={handleFileChange}
					/>

					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="h-9 w-9 rounded-full p-0"
						onClick={triggerFileUpload}
					>
						<Paperclip className="h-5 w-5 text-muted-foreground" />
					</Button>

					<div className="relative flex-1 flex items-center">
						<textarea
							className="h-10 max-h-32 w-full resize-none rounded-lg border border-input bg-background px-3 py-2 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
							placeholder="Type your message..."
							value={value}
							onChange={(e) => onChange(e.target.value)}
							onKeyDown={handleKeyDown}
							rows={1}
							style={{ minHeight: "40px" }}
						/>

						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full p-0"
							onClick={() => onSendMessage(value)}
							disabled={!value.trim()}
						>
							<Send
								className={`h-4 w-4 ${value.trim() ? "text-primary" : "text-muted-foreground"}`}
							/>
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
