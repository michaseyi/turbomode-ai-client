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
import { Blocks, MoreHorizontal, Plus } from "lucide-react"
import { NavUser } from "./nav-user"
import Link from "next/link"
import Image from "next/image"

import Logo from "@/assets/images/logo.png"

const tasks = [
	{
		title: "Complete project proposal for client",
		url: "idadf",
	},
	{
		title: "Review pull requests from team",
		url: "#",
	},
	{
		title: "Prepare presentation for quarterly meeting",
		url: "#",
	},
	{
		title: "Update documentation for API endpoints",
		url: "#",
	},

	{
		title: "Plan sprint tasks for next week",
		url: "#",
	},
	{
		title: "Write unit tests for new features",
		url: "#",
	},
	{
		title: "Optimize database queries for performance",
		url: "#",
	},
	{
		title: "Design wireframes for new dashboard",
		url: "#",
	},
	{
		title: "Conduct user interviews for feedback",
		url: "#",
	},
	{
		title: "Set up CI/CD pipeline for deployment",
		url: "#",
	},
]

const navigations = [
	{
		title: "New Task",
		url: "/",
		icon: Plus,
	},
	{
		title: "Integrations",
		url: "/integrations",
		icon: Blocks,
	},
]

const user = {
	avatar: "",
	email: "michaseyi@gmail.com",
	name: "Michael Adewole",
}

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
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Tasks</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{tasks.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton asChild>
								<Link href={`/`}>
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
			</SidebarGroupContent>
		</SidebarGroup>
	)
}

export function AppSidebar() {
	return (
		<Sidebar collapsible="offcanvas">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
							<Link href="/">
								<Image src={Logo} alt="d" className="h-5 w-5" width={100} />
								<span className="text-base font-medium">Turbomode AI</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
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
