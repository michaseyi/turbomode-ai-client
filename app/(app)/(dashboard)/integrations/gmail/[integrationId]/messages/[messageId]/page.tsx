"use client"

import React, { useState, useEffect } from "react"
import {
	ArrowLeft,
	Reply,
	ReplyAll,
	Forward,
	Star,
	Archive,
	Trash2,
	MoreVertical,
	Paperclip,
	Download,
	Eye,
	Calendar,
	Clock,
	User,
	ChevronDown,
	ChevronUp,
	Printer,
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import { useRouter } from "next/navigation"
import { LoadingState } from "@/components/loading-state"

// TypeScript interfaces
interface EmailAttachment {
	id: string
	filename: string
	size: number
	mimeType: string
	downloadUrl?: string
}

interface EmailParticipant {
	name: string
	email: string
}

interface EmailDetail {
	id: string
	threadId: string
	from: EmailParticipant
	to: EmailParticipant[]
	cc?: EmailParticipant[]
	bcc?: EmailParticipant[]
	replyTo?: EmailParticipant
	subject: string
	body: {
		html?: string
		text: string
	}
	date: string
	isRead: boolean
	isStarred: boolean
	labels: string[]
	attachments: EmailAttachment[]
	messageId: string
	inReplyTo?: string
	references?: string[]
}

interface EmailThread {
	id: string
	subject: string
	messages: EmailDetail[]
	participants: EmailParticipant[]
	totalMessages: number
}

// Mock data - replace with your API call
const mockEmailDetail: EmailDetail = {
	id: "1",
	threadId: "thread-1",
	from: { name: "John Smith", email: "john@company.com" },
	to: [{ name: "You", email: "you@company.com" }],
	cc: [{ name: "Sarah Johnson", email: "sarah@company.com" }],
	subject: "Q4 Project Update - Action Required",
	body: {
		html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p>Hi team,</p>
        
        <p>I wanted to give you a quick update on the Q4 project progress. We've completed the initial phase and are moving into testing.</p>
        
        <h3>Key Accomplishments:</h3>
        <ul>
          <li>Frontend development completed (95%)</li>
          <li>Backend API integration finished</li>
          <li>Database optimization implemented</li>
          <li>Initial testing phase started</li>
        </ul>
        
        <h3>Next Steps:</h3>
        <ol>
          <li>Complete user acceptance testing by Friday</li>
          <li>Address any critical bugs found</li>
          <li>Prepare for production deployment</li>
          <li>Schedule team review meeting</li>
        </ol>
        
        <p><strong>Action Required:</strong> Please review the attached documentation and provide feedback by end of week.</p>
        
        <p>Let me know if you have any questions or concerns.</p>
        
        <p>Best regards,<br>
        John Smith<br>
        Senior Project Manager<br>
        Company Inc.</p>
      </div>
    `,
		text: `Hi team,

I wanted to give you a quick update on the Q4 project progress. We've completed the initial phase and are moving into testing.

Key Accomplishments:
- Frontend development completed (95%)
- Backend API integration finished  
- Database optimization implemented
- Initial testing phase started

Next Steps:
1. Complete user acceptance testing by Friday
2. Address any critical bugs found
3. Prepare for production deployment
4. Schedule team review meeting

Action Required: Please review the attached documentation and provide feedback by end of week.

Let me know if you have any questions or concerns.

Best regards,
John Smith
Senior Project Manager
Company Inc.`,
	},
	date: "2024-12-15T10:30:00Z",
	isRead: true,
	isStarred: true,
	labels: ["Important", "Work", "Projects"],
	attachments: [
		{
			id: "att-1",
			filename: "Q4_Project_Documentation.pdf",
			size: 2048576, // 2MB
			mimeType: "application/pdf",
		},
		{
			id: "att-2",
			filename: "Testing_Checklist.xlsx",
			size: 512000, // 512KB
			mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		},
	],
	messageId: "msg-12345",
	inReplyTo: undefined,
	references: [],
}

export default function EmailDetailPage() {
	const [email, setEmail] = useState<EmailDetail | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [showFullHeaders, setShowFullHeaders] = useState<boolean>(false)
	const [showRawContent, setShowRawContent] = useState<boolean>(false)
	const [replyMode, setReplyMode] = useState<"none" | "reply" | "replyAll" | "forward">("none")

	// Mock API call - replace with your actual API
	const fetchEmailDetail = async (emailId: string): Promise<EmailDetail> => {
		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 500))
		return mockEmailDetail
	}

	useEffect(() => {
		const loadEmail = async () => {
			setLoading(true)
			try {
				// In real app, get emailId from route params
				const emailId = "1"
				const emailData = await fetchEmailDetail(emailId)
				setEmail(emailData)
			} catch (error) {
				console.error("Failed to fetch email:", error)
			} finally {
				setLoading(false)
			}
		}

		loadEmail()
	}, [])

	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return "0 Bytes"
		const k = 1024
		const sizes = ["Bytes", "KB", "MB", "GB"]
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
	}

	const formatDate = (dateString: string): string => {
		const date = new Date(dateString)
		return date.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		})
	}

	const getInitials = (name: string): string => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2)
	}

	const handleStarToggle = () => {
		if (email) {
			setEmail({ ...email, isStarred: !email.isStarred })
		}
	}

	const router = useRouter()

	const handleGoBack = () => {
		// Replace with your navigation logic (e.g., Next.js router)
		router.back()
	}

	const handleReply = (mode: "reply" | "replyAll" | "forward") => {
		setReplyMode(mode)
		// In real app, open compose modal or navigate to compose page
		console.log("Open compose in mode:", mode)
	}

	const handleDownloadAttachment = (attachment: EmailAttachment) => {
		// Replace with your actual download logic
		console.log("Download attachment:", attachment.filename)
	}

	const handlePrint = () => {
		window.print()
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<LoadingState />
			</div>
		)
	}

	if (!email) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<p className="text-muted-foreground">Email not found</p>
				</div>
			</div>
		)
	}

	return (
		<div className="md:p-4 p-2">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center space-x-4">
					<button
						onClick={handleGoBack}
						className="p-2 hover:bg-muted rounded-lg transition-colors"
					>
						<ArrowLeft className="w-5 h-5" />
					</button>
					<h1 className="text-2xl font-bold text-primary">Email Details</h1>
				</div>

				<div className="flex items-center space-x-2">
					<button
						onClick={() => handleReply("reply")}
						className="p-2 hover:bg-muted rounded-lg transition-colors"
						title="Reply"
					>
						<Reply className="w-5 h-5" />
					</button>
					<button
						onClick={() => handleReply("replyAll")}
						className="p-2 hover:bg-muted rounded-lg transition-colors"
						title="Reply All"
					>
						<ReplyAll className="w-5 h-5" />
					</button>
					<button
						onClick={() => handleReply("forward")}
						className="p-2 hover:bg-muted rounded-lg transition-colors"
						title="Forward"
					>
						<Forward className="w-5 h-5" />
					</button>
					<div className="w-px h-6 bg-border"></div>
					<button
						onClick={handleStarToggle}
						className="p-2 hover:bg-muted rounded-lg transition-colors"
						title={email.isStarred ? "Remove star" : "Add star"}
					>
						<Star
							className={`w-5 h-5 ${
								email.isStarred ? "text-yellow-500 fill-current" : "text-muted-foreground"
							}`}
						/>
					</button>
					<button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Archive">
						<Archive className="w-5 h-5" />
					</button>
					<button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Delete">
						<Trash2 className="w-5 h-5" />
					</button>
					<button
						onClick={handlePrint}
						className="p-2 hover:bg-muted rounded-lg transition-colors"
						title="Print"
					>
						<Printer className="w-5 h-5" />
					</button>
					<button className="p-2 hover:bg-muted rounded-lg transition-colors" title="More actions">
						<MoreVertical className="w-5 h-5" />
					</button>
				</div>
			</div>

			{/* Email Content */}
			<div className="bg-card border border-border rounded-lg overflow-hidden">
				{/* Email Header */}
				<div className="p-6 border-b border-border">
					<div className="flex items-start justify-between mb-4">
						<div className="flex items-start space-x-4">
							<div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
								<span className="text-lg font-medium text-primary">
									{getInitials(email.from.name)}
								</span>
							</div>
							<div className="flex-1">
								<h2 className="text-xl font-semibold mb-2">{email.subject}</h2>
								<div className="space-y-1 text-sm text-muted-foreground">
									<div className="flex items-center space-x-2">
										<User className="w-4 h-4" />
										<span>
											<strong className="text-foreground">{email.from.name}</strong>{" "}
											<span className="text-muted-foreground">&lt;{email.from.email}&gt;</span>
										</span>
									</div>
									<div className="flex items-center space-x-2">
										<Clock className="w-4 h-4" />
										<span>{formatDate(email.date)}</span>
									</div>
								</div>
							</div>
						</div>

						{/* Labels */}
						{email.labels.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{email.labels.map((label) => (
									<span
										key={label}
										className="px-2 py-1 text-xs bg-chart-1 text-white rounded-full"
									>
										{label}
									</span>
								))}
							</div>
						)}
					</div>

					{/* Recipients */}
					<div className="space-y-2 text-sm">
						<div className="flex items-start space-x-2">
							<span className="text-muted-foreground font-medium min-w-[60px]">To:</span>
							<div className="flex flex-wrap gap-2">
								{email.to.map((recipient, index) => (
									<span key={index} className="text-foreground">
										{recipient.name} &lt;{recipient.email}&gt;
										{index < email.to.length - 1 && ","}
									</span>
								))}
							</div>
						</div>

						{email.cc && email.cc.length > 0 && (
							<div className="flex items-start space-x-2">
								<span className="text-muted-foreground font-medium min-w-[60px]">Cc:</span>
								<div className="flex flex-wrap gap-2">
									{email.cc.map((recipient, index) => (
										<span key={index} className="text-foreground">
											{recipient.name} &lt;{recipient.email}&gt;
											{index < email.cc!.length - 1 && ","}
										</span>
									))}
								</div>
							</div>
						)}

						{email.bcc && email.bcc.length > 0 && (
							<div className="flex items-start space-x-2">
								<span className="text-muted-foreground font-medium min-w-[60px]">Bcc:</span>
								<div className="flex flex-wrap gap-2">
									{email.bcc.map((recipient, index) => (
										<span key={index} className="text-foreground">
											{recipient.name} &lt;{recipient.email}&gt;
											{index < email.bcc!.length - 1 && ","}
										</span>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Show/Hide Headers Toggle */}
					<button
						onClick={() => setShowFullHeaders(!showFullHeaders)}
						className="mt-4 flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
					>
						{showFullHeaders ? (
							<ChevronUp className="w-4 h-4" />
						) : (
							<ChevronDown className="w-4 h-4" />
						)}
						<span>{showFullHeaders ? "Hide" : "Show"} full headers</span>
					</button>

					{/* Full Headers */}
					{showFullHeaders && (
						<div className="mt-4 p-4 bg-muted/30 rounded-lg text-sm font-mono space-y-1">
							<div>
								<strong>Message-ID:</strong> {email.messageId}
							</div>
							<div>
								<strong>Thread-ID:</strong> {email.threadId}
							</div>
							{email.inReplyTo && (
								<div>
									<strong>In-Reply-To:</strong> {email.inReplyTo}
								</div>
							)}
							{email.references && email.references.length > 0 && (
								<div>
									<strong>References:</strong> {email.references.join(", ")}
								</div>
							)}
							<div>
								<strong>Date:</strong> {new Date(email.date).toISOString()}
							</div>
						</div>
					)}
				</div>

				{/* Attachments */}
				{email.attachments.length > 0 && (
					<div className="p-6 border-b border-border">
						<div className="flex items-center space-x-2 mb-4">
							<Paperclip className="w-5 h-5 text-muted-foreground" />
							<span className="font-medium">
								{email.attachments.length} Attachment{email.attachments.length !== 1 ? "s" : ""}
							</span>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							{email.attachments.map((attachment) => (
								<div
									key={attachment.id}
									className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
								>
									<div className="flex items-center space-x-3">
										<div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
											<Paperclip className="w-5 h-5 text-primary" />
										</div>
										<div>
											<div className="font-medium text-sm">{attachment.filename}</div>
											<div className="text-xs text-muted-foreground">
												{formatFileSize(attachment.size)}
											</div>
										</div>
									</div>
									<div className="flex items-center space-x-2">
										<button
											onClick={() => handleDownloadAttachment(attachment)}
											className="p-2 hover:bg-muted rounded-lg transition-colors"
											title="Download"
										>
											<Download className="w-4 h-4" />
										</button>
										<button
											className="p-2 hover:bg-muted rounded-lg transition-colors"
											title="Preview"
										>
											<Eye className="w-4 h-4" />
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Email Body */}
				<div className="p-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-medium">Message Content</h3>
						<button
							onClick={() => setShowRawContent(!showRawContent)}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							{showRawContent ? "Show formatted" : "Show raw"}
						</button>
					</div>

					{showRawContent ? (
						<pre className="bg-muted/30 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap overflow-auto">
							{email.body.text}
						</pre>
					) : email.body.html ? (
						<div className="prose" dangerouslySetInnerHTML={{ __html: email.body.html }}></div>
					) : (
						<div className="whitespace-pre-wrap text-sm leading-relaxed">{email.body.text}</div>
					)}
				</div>
			</div>

			{/* Quick Reply Section */}
			<div className="mt-6 bg-card border border-border rounded-lg p-6">
				<h3 className="font-medium mb-4">Quick Reply</h3>
				<div className="space-y-4">
					<textarea
						className="w-full h-32 p-3 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring"
						placeholder="Type your reply..."
					/>
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
								Send
							</button>
							<button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
								Save Draft
							</button>
						</div>
						<div className="flex items-center space-x-2 text-sm text-muted-foreground">
							<Paperclip className="w-4 h-4" />
							<span>Attach files</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
