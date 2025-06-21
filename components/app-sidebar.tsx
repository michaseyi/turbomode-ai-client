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
import { useEffect, useMemo, useRef, useState } from "react"
import { EmptyState } from "./empty-state"
import { ErrorState } from "./error-state"
import { LoadingState } from "./loading-state"
import { useRouter } from "next/navigation"
import { GmailIntegration } from "@/types/api"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { useLocalStorage } from "@/hooks/use-localstroage"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

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
										className="group/action"
										key={item.id}
									>
										<SidebarMenuButton asChild>
											<Link href={`/actions/${item.id}`}>
												<span className="!text-clip relative fade-text">{item.title}</span>
											</Link>
										</SidebarMenuButton>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<SidebarMenuAction className="!bg-transparent cursor-pointer">
													<div className="relative">
														{item.active && (
															<Loader2 className="group-hover/action:opacity-0 absolute animate-spin text-muted-foreground" />
														)}
														<MoreHorizontal className="group-hover/action:opacity-100 opacity-0 text-muted-foreground" />
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
	const [isExpanded, setIsExpanded] = useLocalStorage(`gmail-integration-${item.id}`, false)

	type Categories = {
		[key: string]: { id: string; name: string }[] | { id: string; name: string }
	}
	const categories = useMemo(() => {
		return item.gmail.messageLabels.reduce<Categories>(
			(acc, category) => {
				// ignore list
				if (["yellow_star", "chat", "trash"].includes(category.labelId.toLowerCase())) {
					return acc
				}

				if (category.labelId.toLowerCase().startsWith("category")) {
					const name = category.labelName.substring("category_".length)
					const group = "Categories"
					if (!acc[group]) {
						acc[group] = []
					}
					if (Array.isArray(acc[group])) {
						acc[group].push({
							id: category.labelId,
							name: name.length > 1 ? name[0].toUpperCase() + name.slice(1).toLowerCase() : name,
						})
					}
				} else if (category.labelId.toLowerCase().startsWith("label")) {
					const name = category.labelName
					const group = "Labels"
					if (!acc[group]) {
						acc[group] = []
					}
					if (Array.isArray(acc[group])) {
						acc[group].push({
							id: category.labelId,
							name,
						})
					}
				} else {
					acc[category.labelId] = {
						id: category.labelId,
						name: category.labelName[0].toUpperCase() + category.labelName.slice(1).toLowerCase(),
					}
				}
				return acc
			},
			{
				Generated: {
					id: "GENERATED",
					name: "Generated (agent)",
				},
			}
		)
	}, [item.gmail.messageLabels])

	return (
		<Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
			<SidebarMenuItem>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton asChild>
						<button
							className="flex items-center cursor-pointer"
							title={`Gmail (${item.gmail.email})`}
						>
							<ChevronRight
								className={cn(
									"transition-transform duration-400",
									isExpanded ? "rotate-90" : "rotate-0"
								)}
							/>
							<span className="truncate">Gmail ({item.gmail.email})</span>
						</button>
					</SidebarMenuButton>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarMenuSub>
						{Object.entries(categories).map(([key, value]) => (
							<SidebarMenuSubItem key={key}>
								{Array.isArray(value) ? (
									<Collapsible>
										<CollapsibleTrigger asChild>
											<SidebarMenuSubButton asChild>
												<button className="flex items-center w-full">
													<ChevronDown className={`w-4 h-4`} />
													<span className="!text-clip relative fade-text truncate">{key}</span>
												</button>
											</SidebarMenuSubButton>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												{value.map((subValue) => (
													<SidebarMenuSubItem key={subValue.id}>
														<SidebarMenuSubButton asChild>
															<Link
																href={`/integrations/gmail/${item.id}/${subValue.id}`}
																className="relative fade-text !truncate min-w-0"
															>
																{subValue.name}
															</Link>
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												))}
											</SidebarMenuSub>
										</CollapsibleContent>
									</Collapsible>
								) : (
									<SidebarMenuSubButton asChild>
										<Link
											href={`/integrations/gmail/${item.id}/${value.id}`}
											className="relative fade-text !truncate min-w-0"
										>
											{value.name}
										</Link>
									</SidebarMenuSubButton>
								)}
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
											{/* {item.type === "Gmail" ? (
												<>
													{item.type} ({item.gmail.email})
												</>
											) : ( */}
											<>
												{item.type} ({item.gCalendar.email})
											</>
											{/* )} */}
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
