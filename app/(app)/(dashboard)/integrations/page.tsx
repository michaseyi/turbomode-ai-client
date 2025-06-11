"use client"
import { Blocks } from "lucide-react"

import { Integrations } from "@/components/integrations"

export default function IntegrationsPage() {
	return (
		<div className="pb-6">
			<div className="mb-8 flex items-center gap-4">
				<div className="flex shrink-0 h-12 w-12 items-center justify-center rounded-full bg-primary/10 p-2">
					<Blocks />
				</div>
				<div>
					<h1 className="text-2xl font-semibold">Integrations</h1>
					<p className="text-sm text-muted-foreground line-clamp-2">
						Connect your favorite tools to enhance your AI assistant's capabilities
					</p>
				</div>
			</div>

			<div className="rounded-xl border bg-card/40 p-4 sm:p-6 shadow-sm">
				<div className="flex flex-col gap-2">
					<h2 className="text-lg font-medium">Available Integrations</h2>
					<p className="text-sm text-muted-foreground">
						Select an integration to configure and enable AI-powered features
					</p>
				</div>

				<div className="mt-6">
					<Integrations />
				</div>
			</div>
		</div>
	)
}
