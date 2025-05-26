"use client"
import { useState } from "react"
import Image from "next/image"
import GoogleCalendar from "@/assets/images/google-calendar.png"
import { api } from "@/lib/api"
import { ConnectedCalendar } from "@/components/google-calendar-integration/connected-calendar"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Calendar, Check } from "lucide-react"
import { CalendarIntegration } from "@/types/api"

export default function CalendarIntegrationPage() {
	const queryClient = useQueryClient()

	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: ["calendar-integration"],
		refetchOnWindowFocus: true,
		queryFn: async () => {
			return (await api.integrations.getCalendarIntegration()).data
		},
	})

	const connectMutation = useMutation({
		mutationKey: ["connect-calendar"],
		mutationFn: async () => {
			return await api.integrations.connectCalendar()
		},
		onError: (err) => {
			toast(err.message)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["calendar-integration"] })
			queryClient.invalidateQueries({ queryKey: ["integration-list"] })
			toast("Google Calendar connected successfully")
		},
	})

	const disconnectMutation = useMutation({
		mutationKey: ["disconnect-calendar"],
		mutationFn: async (id: string) => {
			return await api.integrations.disconnectCalendar(id)
		},
		onError: (err) => {
			toast(err.message)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["calendar-integration"] })
			queryClient.invalidateQueries({ queryKey: ["integration-list"] })
			toast("Calendar disconnected successfully")
		},
	})

	const handleConnect = async () => {
		connectMutation.mutate()
	}

	const handleDisconnect = (id: string) => {
		disconnectMutation.mutate(id)
	}

	return (
		<div>
			<div className="mb-8 flex items-center gap-4">
				<div className="flex shrink-0 h-12 w-12 items-center justify-center rounded-full bg-primary/10 p-2">
					<Image src={GoogleCalendar} alt="Google Calendar" width={24} height={24} />
				</div>
				<div>
					<h1 className="text-2xl font-semibold">Google Calendar Integration</h1>
					<p className="text-sm text-muted-foreground line-clamp-2">
						Connect your Google Calendar to enable the AI assistant to set reminders and view your
						schedule when helping with tasks.
					</p>
				</div>
			</div>

			<div className="space-y-6">
				<ConnectedCalendar
					account={(data ?? [])[0]}
					onConnect={handleConnect}
					isLoading={isLoading}
					isLoadingError={isError}
					refetch={refetch}
					isDisconnecting={disconnectMutation.isPending}
					onDisconnect={handleDisconnect}
					isConnecting={connectMutation.isPending}
				/>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Card className="p-5 bg-card/60">
						<div className="flex gap-3 items-start">
							<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
								<Calendar className="h-4 w-4 text-primary" />
							</div>
							<div>
								<h3 className="font-medium mb-1">View Schedule</h3>
								<p className="text-sm text-muted-foreground">
									The assistant can check your calendar when planning tasks or scheduling meetings.
								</p>
							</div>
						</div>
					</Card>

					<Card className="p-5 bg-card/60">
						<div className="flex gap-3 items-start">
							<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
								<Check className="h-4 w-4 text-primary" />
							</div>
							<div>
								<h3 className="font-medium mb-1">Set Reminders</h3>
								<p className="text-sm text-muted-foreground">
									The assistant can create reminders and events based on your conversations.
								</p>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	)
}
