"use client"

import { Clock, Download, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type ChatHeaderProps = {
	title: string
	status?: "active" | "completed"
}

export default function ChatHeader({ title, status }: ChatHeaderProps) {
	return (
		<div className="flex items-center justify-between border-b px-6 py-3">
			<div className="flex items-center gap-3">
				{title && (
					<>
						<h1 className="text-xl font-semibold">{title}</h1>
						{status && (
							<span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
								<Clock className="h-3 w-3" />
								{status === "active" ? "In Progress" : "Completed"}
							</span>
						)}
					</>
				)}
			</div>

			<div className="flex items-center gap-2">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="outline" size="sm" className="h-8 gap-1">
								<Plus className="h-4 w-4" />
								<span className="hidden sm:inline">New Chat</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>Start a new conversation</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				{title && (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="outline" size="sm" className="h-8 gap-1">
									<Download className="h-4 w-4" />
									<span className="hidden sm:inline">Export</span>
								</Button>
							</TooltipTrigger>
							<TooltipContent>Export conversation</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
			</div>
		</div>
	)
}
