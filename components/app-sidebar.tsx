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
} from "@/components/ui/sidebar"

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Blocks, Home, MoreHorizontal, Plus } from "lucide-react"
import { NavUser } from "./nav-user"
import Link from "next/link"

import { userAuthUser as useAuthUser } from "@/hooks/user-auth-user"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useState } from "react"
import { EmptyState } from "./empty-state"
import { ErrorState } from "./error-state"
import { LoadingState } from "./loading-state"
import { useRouter } from "next/navigation"

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
	const [page, setPage] = useState(1)

	const router = useRouter()

	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: ["actions-list"],
		queryFn: async () => {
			return await api.actions.listActions(page)
		},
	})

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
				) : data.data.length === 0 ? (
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
						{data.data.map((item) => (
							<SidebarMenuItem key={item.id}>
								<SidebarMenuButton asChild>
									<Link href={`/actions/${item.id}`}>
										<span className="!text-clip relative fade-text">{item.title}</span>
									</Link>
								</SidebarMenuButton>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<SidebarMenuAction>
											<MoreHorizontal />
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
						))}
					</SidebarMenu>
				)}
			</SidebarGroupContent>
		</SidebarGroup>
	)
}

export function AppSidebar() {
	const user = useAuthUser()
	return (
		<Sidebar collapsible="offcanvas">
			<SidebarHeader className="h-12">
				{/* <SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
							<Link href="/">
								<Image src={Logo} alt="TruboMode AI" className="h-6 w-6" width={100} />
								<span className="text-base font-medium">TurboMode AI</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu> */}
			</SidebarHeader>
			<SidebarContent>
				<DefaultSidebarGroup />
				<TaskSidebarGroup />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
		</Sidebar>
	)
}
