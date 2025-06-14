"use client"
import React, { useEffect, useRef, useState } from "react"
import { Mail, Search } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { LoadingState } from "@/components/loading-state"
import { api } from "@/lib/api"
import { useInfiniteQuery } from "@tanstack/react-query"
import { ErrorState } from "@/components/error-state"

type EmailListProp = {
	integrationId: string
}

export function EmailList({ integrationId }: EmailListProp) {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isLoading, isError } =
		useInfiniteQuery({
			queryKey: ["gmail-messages", integrationId],
			queryFn: async ({ pageParam }) => {
				return await api.integrations.fetchGmailMessages(integrationId, pageParam, 20)
			},
			initialPageParam: 1,
			getNextPageParam: (lastPage) => {
				return lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined
			},
		})

	const router = useRouter()

	const params = useParams<{ integrationId: string }>()

	const handleSearch = (searchTerm: string) => {}

	const handleMarkAsRead = (emailId: string, isRead: boolean) => {}

	const observerRef = useRef<IntersectionObserver | null>(null)
	const bottomRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		if (!bottomRef.current || !hasNextPage) return

		if (observerRef.current) observerRef.current.disconnect()

		observerRef.current = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					fetchNextPage()
				}
			},
			{
				threshold: 1.0,
			}
		)

		observerRef.current.observe(bottomRef.current)

		return () => {
			if (observerRef.current) observerRef.current.disconnect()
		}
	}, [bottomRef.current, hasNextPage, fetchNextPage])

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
		return name[0]?.toUpperCase() || "?"
	}

	const emails = data?.pages.flatMap((page) => page.data) || []

	return (
		<div>
			<div className="mb-4 md:mb-6 space-y-4">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
					<input
						type="text"
						placeholder="Search emails..."
						className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
						onChange={(e) => handleSearch(e.target.value)}
					/>
				</div>
			</div>

			<div className="bg-card overflow-hidden space-y-2 md:space-y-4">
				{isLoading ? (
					<div className="py-12">
						<LoadingState />
					</div>
				) : isError ? (
					<ErrorState
						onRetry={() => {
							refetch()
						}}
					/>
				) : emails.length === 0 ? (
					<div className="text-center py-12">
						<Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
						<p className="text-muted-foreground">No emails found</p>
					</div>
				) : (
					emails.map((email) => {
						const isLastItem = emails.at(-1)!.id === email.id

						return (
							<div
								ref={isLastItem ? bottomRef : null}
								key={email.id}
								onClick={() => handleEmailClick(email.id)}
								className={`p-2 md:p-4 hover:bg-muted/30 cursor-pointer transition-colors border border-border  rounded-lg ${
									email.isUnread ? "bg-muted/10" : ""
								}`}
							>
								<div className="flex items-start space-x-2 md:space-x-4">
									<div className="w-8 h-8 md:w-10 md:h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
										<span className="text-lg font-medium text-primary">
											{getInitials(email.from || "")}
										</span>
									</div>

									<div className="flex-1 min-w-0 md:text-base text-sm">
										<div className="flex items-center justify-between md;mb-1">
											<div className="flex items-center space-x-2">
												<span
													className={`font-medium line-clamp-1 ${
														email.isUnread ? "text-foreground" : "text-muted-foreground"
													}`}
												>
													{email.from || ""}
												</span>
											</div>
											<span className="text-xs md:text-sm text-muted-foreground shrink-0">
												{formatDate(email.internalDate)}
											</span>
										</div>

										<div
											className={`font-medium md:mb-1 line-clamp-1 ${
												email.isUnread ? "text-foreground" : "text-muted-foreground"
											}`}
										>
											{email.subject}
										</div>

										<p className="text-sm text-muted-foreground line-clamp-1">{email.snippet}</p>

										{email.labelIds.length > 0 && (
											<div className="hidden md:flex items-center space-x-2 mt-2">
												{email.labelIds.map((label) => (
													<span
														key={label}
														className="px-2 py-1 text-xs bg-chart-1 text-white rounded-full"
													>
														{label.toLowerCase()}
													</span>
												))}
											</div>
										)}
									</div>
								</div>
							</div>
						)
					})
				)}

				{isFetchingNextPage && <LoadingState />}
			</div>
		</div>
	)
}
