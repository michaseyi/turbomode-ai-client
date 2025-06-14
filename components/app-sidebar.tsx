"use client"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
	Blocks,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Home,
	Loader2,
	MoreHorizontal,
	NotebookIcon,
	Plus,
} from "lucide-react"
import { NavUser } from "./nav-user"
import Link from "next/link"

import { useAuthUser as useAuthUser } from "@/hooks/use-auth-user"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useEffect, useRef, useState } from "react"
import { EmptyState } from "./empty-state"
import { ErrorState } from "./error-state"
import { LoadingState } from "./loading-state"
import { useRouter } from "next/navigation"
import { GmailIntegration } from "@/types/api"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { useLocalStorage } from "@/hooks/use-localstroage"

const navigations = [
	{
		title: "Dashboard",
		url: "/",
		icon: Home,
	},
	{
		title: "Integrations",
		url: "/integrations",
		icon: Blocks,
	},
	{
		title: "Notes",
		url: "/notes",
		icon: NotebookIcon,
	},
	{
		title: "New Action",
		url: "/actions",
		icon: Plus,
	},
]

function DefaultSidebarGroup() {
	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarMenu>
					{navigations.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton asChild>
								<Link href={item.url}>
									<item.icon />
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}

function TaskSidebarGroup() {
	const router = useRouter()

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isLoading, isError } =
		useInfiniteQuery({
			refetchInterval: 1000 * 60 * 1,
			queryKey: ["actions-list"],
			queryFn: async ({ pageParam }) => {
				return await api.actions.listActions(pageParam, 25)
			},
			initialPageParam: 1,
			getNextPageParam: (lastPage) => {
				return lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined
			},
		})

	const observerRef = useRef<IntersectionObserver | null>(null)
	const bottomRef = useRef<HTMLLIElement | null>(null)

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

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Actions</SidebarGroupLabel>
			<SidebarGroupContent>
				{isLoading ? (
					<LoadingState message="Loading actions..." />
				) : isError ? (
					<ErrorState onRetry={refetch} />
				) : !data ? (
					<></>
				) : data.pages.length && data.pages[0].data.length === 0 ? (
					<SidebarMenu>
						<SidebarMenuItem>
							<EmptyState
								description="No actions yet"
								onAction={() => {
									router.push("/actions")
								}}
								actionLabel="Create your first action"
							/>
						</SidebarMenuItem>
					</SidebarMenu>
				) : (
					<SidebarMenu>
						{data.pages.map((page, pageIndex) =>
							page.data.map((item, idx) => {
								const isLastItem =
									pageIndex === data.pages.length - 1 && idx === page.data.length - 1

								return (
									<SidebarMenuItem
										ref={isLastItem ? bottomRef : null}
										className="group"
										key={item.id}
									>
										<SidebarMenuButton asChild>
											<Link href={`/actions/${item.id}`}>
												<span className="!text-clip relative fade-text">{item.title}</span>
											</Link>
										</SidebarMenuButton>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<SidebarMenuAction>
													<div className="relative">
														{item.active && (
															<Loader2 className="w-5 h-5 group-hover:opacity-0 absolute animate-spin text-muted-foreground" />
														)}
														<MoreHorizontal className="group-hover:opacity-100 opacity-0 text-muted-foreground" />
													</div>
												</SidebarMenuAction>
											</DropdownMenuTrigger>
											<DropdownMenuContent side="right" align="start">
												<DropdownMenuItem>
													<span>Rename</span>
												</DropdownMenuItem>
												<DropdownMenuItem>
													<span>Delete</span>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</SidebarMenuItem>
								)
							})
						)}
					</SidebarMenu>
				)}
			</SidebarGroupContent>
			{isFetchingNextPage && (
				<div className="grid place-items-center my-7">
					<Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
				</div>
			)}
		</SidebarGroup>
	)
}

function GmailIntegrationSidebarGroup({ item }: { item: GmailIntegration }) {
	const categories = [
		{ label: "Inbox", value: "inbox" },
		{ label: "Primary", value: "primary" },
		{ label: "Sent", value: "sent" },
	]

	const [isExpanded, setIsExpanded] = useLocalStorage(`gmail-integration-${item.id}`, false)

	return (
		<Collapsible className="group/collapsible" open={isExpanded} onOpenChange={setIsExpanded}>
			<SidebarMenuItem>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton asChild>
						<div className="flex items-center justify-between">
							<Link className="min-w-0 truncate" href={`/integrations/gmail/${item.id}`}>
								<span className="!text-clip relative fade-text">Gmail ({item.gmail.email})</span>
							</Link>

							<ChevronRight className="group-[data-collapsible]/collapsible:bg-red-300" />
						</div>
					</SidebarMenuButton>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarMenuSub>
						{categories.map((category) => (
							<SidebarMenuSubItem key={category.value}>
								<SidebarMenuSubButton asChild>
									<Link
										href={`/integrations/gmail/${item.id}/#${category.value}`}
										className="!text-clip relative fade-text"
									>
										{category.label}
									</Link>
								</SidebarMenuSubButton>
							</SidebarMenuSubItem>
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</SidebarMenuItem>
		</Collapsible>
	)
}

function IntegrationSidebarGroup() {
	const router = useRouter()

	const { data, refetch, isLoading, isError } = useQuery({
		queryKey: ["integration-list"],
		queryFn: async () => {
			return (await api.integrations.listIntegrations()).data
		},
	})

	const typeMap = new Map<"Gmail" | "Gcalendar", string>([
		["Gmail", "gmail"],
		["Gcalendar", "google-calendar"],
	])

	return isLoading ? (
		<LoadingState message="Loading integrations..." />
	) : isError ? (
		<ErrorState onRetry={refetch} />
	) : !data ? (
		<></>
	) : data.length === 0 ? (
		<></>
	) : (
		<SidebarGroup>
			<SidebarGroupLabel>Active Integrations</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{data.map((item, pageIndex) => {
						if (item.type === "Gmail") {
							return <GmailIntegrationSidebarGroup key={item.id} item={item} />
						}

						return (
							<SidebarMenuItem className="group" key={item.id}>
								<SidebarMenuButton asChild>
									<Link href={`/integrations/${typeMap.get(item.type)}/${item.id}`}>
										<span className="!text-clip relative fade-text">
											{item.type === "Gmail" ? (
												<>
													{item.type} ({item.gmail.email})
												</>
											) : (
												<>
													{item.type} ({item.gCalendar.email})
												</>
											)}
										</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						)
					})}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}

export function AppSidebar() {
	const user = useAuthUser()
	return (
		<Sidebar collapsible="offcanvas">
			<SidebarHeader className="h-12"></SidebarHeader>
			<SidebarContent>
				<DefaultSidebarGroup />
				<IntegrationSidebarGroup />
				<TaskSidebarGroup />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
		</Sidebar>
	)
}
