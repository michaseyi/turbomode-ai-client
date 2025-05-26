"use client"
import { Calendar, Plus, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CalendarIntegration } from "@/types/api"
import { ErrorState } from "../error-state"
import { EmptyState } from "../empty-state"
import { LoadingState } from "../loading-state"

interface ConnectedCalendarProps {
	account?: CalendarIntegration
	onConnect: () => void
	onDisconnect: (id: string) => void
	isLoading?: boolean
	isDisconnecting?: boolean
	isConnecting?: boolean
	isLoadingError?: boolean
	refetch?: () => void
}

export function ConnectedCalendar({
	account,
	onConnect,
	onDisconnect,
	isDisconnecting,
	isConnecting,
	isLoading = false,
	isLoadingError,
	refetch,
}: ConnectedCalendarProps) {
	return (
		<div className="rounded-xl border bg-card/60 p-5 shadow-sm">
			<div className="mb-5 flex items-center justify-between">
				<h3 className="font-medium">Google Calendar</h3>
				{!account && (
					<Button
						disabled={isConnecting}
						onClick={onConnect}
						size="sm"
						variant="outline"
						className="h-8 gap-1.5"
					>
						{isConnecting ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Plus className="h-3.5 w-3.5" />
						)}
						Connect Calendar
					</Button>
				)}
			</div>

			{isLoading ? (
				<LoadingState message="Loading calendar..." />
			) : isLoadingError ? (
				<ErrorState onRetry={refetch} />
			) : !account ? (
				<EmptyState
					description="No Google Calendar connected yet"
					actionLabel="Connect your calendar"
					isLoading={isConnecting}
					onAction={onConnect}
				/>
			) : (
				<div className="flex items-center justify-between rounded-lg border bg-background p-3 transition-colors">
					<div className="flex items-center gap-3">
						<div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
							<Calendar className="h-4 w-4 text-primary" />
						</div>
						<div>
							<p className="font-medium">{account.gCalendar.email}</p>
							<p className="text-xs text-muted-foreground">
								Connected {new Date(account.createdAt).toLocaleDateString()}
							</p>
						</div>
					</div>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => onDisconnect(account.id)}
						disabled={isDisconnecting}
						className="h-8 px-2 text-sm text-muted-foreground hover:text-destructive"
					>
						{isDisconnecting ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<X className="h-4 w-4" />
						)}
					</Button>
				</div>
			)}
		</div>
	)
}
