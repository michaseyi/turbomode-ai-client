"use client"
import { useState } from "react"
import Image, { StaticImageData } from "next/image"
import Link from "next/link"
import { Blocks, ChevronRight, PlusCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

// Import icons
import Gmail from "@/assets/images/gmail.png"
import Slack from "@/assets/images/slack.png"
import Zoom from "@/assets/images/zoom.png"
import GoogleCalendar from "@/assets/images/google-calendar.png"

type Integration = {
	id: string
	name: string
	description: string
	icon: StaticImageData
	path: string
	isPopular?: boolean
	isNew?: boolean
	isComing?: boolean
	category: "communication" | "productivity" | "meeting" | "other"
}

const integrations: Integration[] = [
	{
		id: "gmail",
		name: "Gmail",
		description: "Access and organize emails, extract insights, and automate responses",
		icon: Gmail,
		path: "/integrations/gmail",
		isPopular: true,
		category: "communication",
	},
	{
		id: "google-calendar",
		name: "Google Calendar",
		description:
			"Integrate your Google Calendar to enable the AI assistant to set reminders, schedule events, and access your calendar for planning assistance.",
		icon: GoogleCalendar,
		path: "/integrations/google-calendar",
		isPopular: true,
		category: "communication",
	},
	{
		id: "slack",
		name: "Slack",
		description: "Analyze conversations, extract insights, and automate workflows",
		icon: Slack,
		path: "/integrations/slack",
		isComing: true,
		category: "communication",
	},
	{
		id: "zoom",
		name: "Zoom",
		description: "Summarize meetings and extract key points from recordings",
		icon: Zoom,
		path: "/integrations/zoom",
		isComing: true,
		category: "meeting",
	},
]

function IntegrationCard({ integration }: { integration: Integration }) {
	return (
		<Link
			href={integration.isComing ? "#" : integration.path}
			className="group flex items-center gap-4 rounded-xl border bg-card/50 p-4 transition-all hover:border-primary/20 hover:bg-card hover:shadow-sm"
		>
			<div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/5 p-2 transition-all group-hover:bg-primary/10">
				<Image
					src={integration.icon}
					alt={integration.name}
					width={40}
					height={40}
					className="h-8 w-8 object-contain"
				/>
			</div>

			<div className="flex-1">
				<div className="flex items-center gap-2">
					<h3 className="font-medium">{integration.name}</h3>
					{integration.isComing && (
						<span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
							Coming Soon
						</span>
					)}
					{integration.isNew && (
						<span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
							New
						</span>
					)}
					{integration.isPopular && (
						<span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
							Popular
						</span>
					)}
				</div>
				<p className="mt-1 text-sm text-muted-foreground line-clamp-2">{integration.description}</p>
			</div>

			<ChevronRight className="h-5 w-5 text-muted-foreground/50 transition-all group-hover:text-primary" />
		</Link>
	)
}

function IntegrationsFilters() {
	const [activeFilter, setActiveFilter] = useState<string>("all")

	const filters = [
		{ id: "all", label: "All" },
		{ id: "communication", label: "Communication" },
		// { id: "productivity", label: "Productivity" },
		{ id: "meeting", label: "Meetings" },
	]

	return (
		<div className="mb-6 flex md:items-center justify-between flex-col md:flex-row gap-2">
			<div className="flex gap-2 overflow-hidden pb-1.5 md:pb-0">
				{/* Todo: Fix overflow on mobile */}
				{filters.map((filter) => (
					<Button
						key={filter.id}
						variant={activeFilter === filter.id ? "default" : "outline"}
						size="sm"
						className="h-8"
						onClick={() => setActiveFilter(filter.id)}
					>
						{filter.label}
					</Button>
				))}
			</div>

			<div className="relative w-full md:w-60">
				<Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<input
					type="text"
					placeholder="Search integrations..."
					className="w-full h-8 rounded-md border border-input bg-background pl-8 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
				/>
			</div>
		</div>
	)
}

export function Integrations() {
	return (
		<div className="space-y-3">
			<IntegrationsFilters />

			<div className="grid gap-3 md:grid-cols-2">
				{integrations.map((integration) => (
					<IntegrationCard key={integration.id} integration={integration} />
				))}
			</div>
		</div>
	)
}
