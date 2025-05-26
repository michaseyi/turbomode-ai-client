"use client"
import React, { useState, useEffect } from "react"
import {
	Mail,
	Search,
	Filter,
	ChevronLeft,
	ChevronRight,
	Star,
	Archive,
	Trash2,
	MoreVertical,
	Paperclip,
	Circle,
	CheckCircle2,
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { LoadingState } from "@/components/loading-state"

// TypeScript interfaces
interface Email {
	id: string
	from: {
		name: string
		email: string
	}
	to: {
		name: string
		email: string
	}[]
	subject: string
	snippet: string
	date: string
	isRead: boolean
	isStarred: boolean
	hasAttachments: boolean
	labels: string[]
	threadId?: string
}

interface EmailListResponse {
	emails: Email[]
	totalCount: number
	currentPage: number
	totalPages: number
	hasNextPage: boolean
	hasPreviousPage: boolean
}

interface EmailFilters {
	search: string
	isRead?: boolean
	isStarred?: boolean
	label?: string
}

// Mock data - replace with your API call
const mockEmails: Email[] = [
	{
		id: "1",
		from: { name: "John Smith", email: "john@company.com" },
		to: [{ name: "You", email: "you@company.com" }],
		subject: "Q4 Project Update - Action Required",
		snippet:
			"Hi team, I wanted to give you a quick update on the Q4 project progress. We've completed the initial phase and are moving into testing...",
		date: "2024-12-15T10:30:00Z",
		isRead: false,
		isStarred: true,
		hasAttachments: true,
		labels: ["Important", "Work"],
	},
	{
		id: "2",
		from: { name: "Sarah Johnson", email: "sarah@client.com" },
		to: [{ name: "You", email: "you@company.com" }],
		subject: "Meeting Confirmation - Tomorrow 2PM",
		snippet:
			"Just confirming our meeting scheduled for tomorrow at 2PM. I'll send the Zoom link shortly. Looking forward to discussing the proposal...",
		date: "2024-12-15T09:15:00Z",
		isRead: true,
		isStarred: false,
		hasAttachments: false,
		labels: ["Meetings"],
	},
	{
		id: "3",
		from: { name: "Tech Support", email: "support@platform.com" },
		to: [{ name: "You", email: "you@company.com" }],
		subject: "Your Support Ticket #12345 Has Been Resolved",
		snippet:
			"Good news! Your support ticket regarding the API integration issue has been resolved. Our team has implemented the fix and tested it thoroughly...",
		date: "2024-12-14T16:45:00Z",
		isRead: true,
		isStarred: false,
		hasAttachments: false,
		labels: ["Support"],
	},
	{
		id: "4",
		from: { name: "Marketing Team", email: "marketing@company.com" },
		to: [{ name: "You", email: "you@company.com" }],
		subject: "New Campaign Performance Report",
		snippet:
			"Please find attached the performance report for our latest marketing campaign. The results exceeded our expectations with a 25% increase in conversions...",
		date: "2024-12-14T14:20:00Z",
		isRead: false,
		isStarred: true,
		hasAttachments: true,
		labels: ["Reports", "Marketing"],
	},
	{
		id: "5",
		from: { name: "LinkedIn", email: "noreply@linkedin.com" },
		to: [{ name: "You", email: "you@company.com" }],
		subject: "Weekly Network Update",
		snippet:
			"See what your network has been up to this week. You have 3 new connection requests and 12 profile views...",
		date: "2024-12-14T08:00:00Z",
		isRead: true,
		isStarred: false,
		hasAttachments: false,
		labels: ["Social"],
	},
]

const EmailListPage: React.FC = () => {
	const [emails, setEmails] = useState<Email[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set())
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [totalPages, setTotalPages] = useState<number>(1)
	const [totalCount, setTotalCount] = useState<number>(0)
	const [filters, setFilters] = useState<EmailFilters>({
		search: "",
		isRead: undefined,
		isStarred: undefined,
		label: undefined,
	})
	const [showFilters, setShowFilters] = useState<boolean>(false)

	const itemsPerPage = 10

	// Mock API call - replace with your actual API
	const fetchEmails = async (page: number, filters: EmailFilters): Promise<EmailListResponse> => {
		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 500))

		let filteredEmails = [...mockEmails]

		// Apply filters
		if (filters.search) {
			const searchLower = filters.search.toLowerCase()
			filteredEmails = filteredEmails.filter(
				(email) =>
					email.subject.toLowerCase().includes(searchLower) ||
					email.from.name.toLowerCase().includes(searchLower) ||
					email.from.email.toLowerCase().includes(searchLower) ||
					email.snippet.toLowerCase().includes(searchLower)
			)
		}

		if (filters.isRead !== undefined) {
			filteredEmails = filteredEmails.filter((email) => email.isRead === filters.isRead)
		}

		if (filters.isStarred !== undefined) {
			filteredEmails = filteredEmails.filter((email) => email.isStarred === filters.isStarred)
		}

		if (filters.label) {
			filteredEmails = filteredEmails.filter((email) => email.labels.includes(filters.label!))
		}

		const totalCount = filteredEmails.length
		const totalPages = Math.ceil(totalCount / itemsPerPage)
		const startIndex = (page - 1) * itemsPerPage
		const endIndex = startIndex + itemsPerPage
		const paginatedEmails = filteredEmails.slice(startIndex, endIndex)

		return {
			emails: paginatedEmails,
			totalCount,
			currentPage: page,
			totalPages,
			hasNextPage: page < totalPages,
			hasPreviousPage: page > 1,
		}
	}

	useEffect(() => {
		const loadEmails = async () => {
			setLoading(true)
			try {
				const response = await fetchEmails(currentPage, filters)
				setEmails(response.emails)
				setTotalPages(response.totalPages)
				setTotalCount(response.totalCount)
			} catch (error) {
				console.error("Failed to fetch emails:", error)
			} finally {
				setLoading(false)
			}
		}

		loadEmails()
	}, [currentPage, filters])

	const handleSearch = (searchTerm: string) => {
		setFilters((prev) => ({ ...prev, search: searchTerm }))
		setCurrentPage(1)
	}

	const handleFilterChange = (newFilters: Partial<EmailFilters>) => {
		setFilters((prev) => ({ ...prev, ...newFilters }))
		setCurrentPage(1)
	}

	const handleEmailSelect = (emailId: string) => {
		const newSelected = new Set(selectedEmails)
		if (newSelected.has(emailId)) {
			newSelected.delete(emailId)
		} else {
			newSelected.add(emailId)
		}
		setSelectedEmails(newSelected)
	}

	const handleSelectAll = () => {
		if (selectedEmails.size === emails.length) {
			setSelectedEmails(new Set())
		} else {
			setSelectedEmails(new Set(emails.map((email) => email.id)))
		}
	}

	const handleStarToggle = (emailId: string, event: React.MouseEvent) => {
		event.stopPropagation()
		setEmails((prev) =>
			prev.map((email) =>
				email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
			)
		)
	}

	const handleMarkAsRead = (emailId: string, isRead: boolean) => {
		setEmails((prev) => prev.map((email) => (email.id === emailId ? { ...email, isRead } : email)))
	}

	const router = useRouter()

	const params = useParams<{ integrationId: string }>()

	const handleEmailClick = (emailId: string) => {
		handleMarkAsRead(emailId, true)
		router.push(`${params.integrationId}/messages/${emailId}`)
	}

	const formatDate = (dateString: string): string => {
		const date = new Date(dateString)
		const now = new Date()
		const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

		if (diffInHours < 24) {
			return date.toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
			})
		} else if (diffInHours < 168) {
			return date.toLocaleDateString("en-US", { weekday: "short" })
		} else {
			return date.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			})
		}
	}

	const getInitials = (name: string): string => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2)
	}

	return (
		<div className="bg-background text-foreground">
			<div className="p-4">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center space-x-4">
						<Mail className="w-8 h-8 text-primary" />
						<h1 className="text-3xl font-bold text-primary">Inbox</h1>
						<span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
							{totalCount} messages
						</span>
					</div>

					<div className="flex items-center space-x-2">
						<button
							onClick={() => setShowFilters(!showFilters)}
							className={`p-2 rounded-lg transition-colors ${
								showFilters ? "bg-primary text-primary-foreground" : "hover:bg-muted"
							}`}
						>
							<Filter className="w-5 h-5" />
						</button>
					</div>
				</div>

				{/* Search and Filters */}
				<div className="mb-6 space-y-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
						<input
							type="text"
							placeholder="Search emails..."
							className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
							value={filters.search}
							onChange={(e) => handleSearch(e.target.value)}
						/>
					</div>

					{showFilters && (
						<div className="bg-card border border-border rounded-lg p-4">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<select
									className="bg-background border border-border rounded-lg px-3 py-2"
									value={filters.isRead === undefined ? "" : filters.isRead.toString()}
									onChange={(e) =>
										handleFilterChange({
											isRead: e.target.value === "" ? undefined : e.target.value === "true",
										})
									}
								>
									<option value="">All Messages</option>
									<option value="false">Unread</option>
									<option value="true">Read</option>
								</select>

								<select
									className="bg-background border border-border rounded-lg px-3 py-2"
									value={filters.isStarred === undefined ? "" : filters.isStarred.toString()}
									onChange={(e) =>
										handleFilterChange({
											isStarred: e.target.value === "" ? undefined : e.target.value === "true",
										})
									}
								>
									<option value="">All Stars</option>
									<option value="true">Starred</option>
									<option value="false">Not Starred</option>
								</select>

								<select
									className="bg-background border border-border rounded-lg px-3 py-2"
									value={filters.label || ""}
									onChange={(e) =>
										handleFilterChange({
											label: e.target.value || undefined,
										})
									}
								>
									<option value="">All Labels</option>
									<option value="Important">Important</option>
									<option value="Work">Work</option>
									<option value="Meetings">Meetings</option>
									<option value="Reports">Reports</option>
									<option value="Marketing">Marketing</option>
									<option value="Social">Social</option>
								</select>
							</div>
						</div>
					)}
				</div>

				{/* Email List */}
				<div className="bg-card border border-border rounded-lg overflow-hidden">
					{/* Bulk Actions Header */}
					{selectedEmails.size > 0 && (
						<div className="bg-muted/50 border-b border-border p-4 flex items-center justify-between">
							<div className="flex items-center space-x-4">
								<span className="text-sm text-muted-foreground">
									{selectedEmails.size} selected
								</span>
								<div className="flex items-center space-x-2">
									<button className="p-2 hover:bg-muted rounded-lg transition-colors">
										<Archive className="w-4 h-4" />
									</button>
									<button className="p-2 hover:bg-muted rounded-lg transition-colors">
										<Trash2 className="w-4 h-4" />
									</button>
									<button className="p-2 hover:bg-muted rounded-lg transition-colors">
										<Star className="w-4 h-4" />
									</button>
								</div>
							</div>
							<button
								onClick={() => setSelectedEmails(new Set())}
								className="text-sm text-muted-foreground hover:text-foreground"
							>
								Clear selection
							</button>
						</div>
					)}

					{/* List Header */}
					<div className="border-b border-border p-4 flex items-center space-x-4">
						<button onClick={handleSelectAll} className="p-1">
							{selectedEmails.size === emails.length && emails.length > 0 ? (
								<CheckCircle2 className="w-5 h-5 text-primary" />
							) : (
								<Circle className="w-5 h-5 text-muted-foreground" />
							)}
						</button>
						<div className="flex-1 text-sm font-medium text-muted-foreground">Email</div>
						<div className="w-24 text-sm font-medium text-muted-foreground text-right">Date</div>
					</div>

					{/* Email Items */}
					<div className="divide-y divide-border">
						{loading ? (
							<div className="py-12">
								<LoadingState />
							</div>
						) : emails.length === 0 ? (
							<div className="text-center py-12">
								<Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
								<p className="text-muted-foreground">No emails found</p>
							</div>
						) : (
							emails.map((email) => (
								<div
									key={email.id}
									onClick={() => handleEmailClick(email.id)}
									className={`p-4 hover:bg-muted/30 cursor-pointer transition-colors ${
										!email.isRead ? "bg-muted/10" : ""
									}`}
								>
									<div className="flex items-start space-x-4">
										<button
											onClick={(e) => {
												e.stopPropagation()
												handleEmailSelect(email.id)
											}}
											className="mt-1"
										>
											{selectedEmails.has(email.id) ? (
												<CheckCircle2 className="w-5 h-5 text-primary" />
											) : (
												<Circle className="w-5 h-5 text-muted-foreground" />
											)}
										</button>

										<button onClick={(e) => handleStarToggle(email.id, e)} className="mt-1">
											<Star
												className={`w-5 h-5 ${
													email.isStarred ? "text-yellow-500 fill-current" : "text-muted-foreground"
												}`}
											/>
										</button>

										<div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
											<span className="text-sm font-medium text-primary">
												{getInitials(email.from.name)}
											</span>
										</div>

										<div className="flex-1 min-w-0">
											<div className="flex items-center justify-between mb-1">
												<div className="flex items-center space-x-2">
													<span
														className={`font-medium ${
															!email.isRead ? "text-foreground" : "text-muted-foreground"
														}`}
													>
														{email.from.name}
													</span>
													{email.hasAttachments && (
														<Paperclip className="w-4 h-4 text-muted-foreground" />
													)}
												</div>
												<span className="text-sm text-muted-foreground">
													{formatDate(email.date)}
												</span>
											</div>

											<div
												className={`font-medium mb-1 ${
													!email.isRead ? "text-foreground" : "text-muted-foreground"
												}`}
											>
												{email.subject}
											</div>

											<p className="text-sm text-muted-foreground line-clamp-2">{email.snippet}</p>

											{email.labels.length > 0 && (
												<div className="flex items-center space-x-2 mt-2">
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
									</div>
								</div>
							))
						)}
					</div>
				</div>

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="flex items-center justify-between mt-6">
						<div className="text-sm text-muted-foreground">
							Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)} to{" "}
							{Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} emails
						</div>

						<div className="flex items-center space-x-2">
							<button
								onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
								disabled={currentPage === 1}
								className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<ChevronLeft className="w-5 h-5" />
							</button>

							<div className="flex items-center space-x-1">
								{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
									const page = i + 1
									return (
										<button
											key={page}
											onClick={() => setCurrentPage(page)}
											className={`px-3 py-2 rounded-lg text-sm ${
												currentPage === page
													? "bg-primary text-primary-foreground"
													: "hover:bg-muted"
											}`}
										>
											{page}
										</button>
									)
								})}
							</div>

							<button
								onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
								disabled={currentPage === totalPages}
								className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<ChevronRight className="w-5 h-5" />
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default EmailListPage
