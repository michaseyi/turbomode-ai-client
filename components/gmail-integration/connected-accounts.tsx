"use client"
import { useState } from "react"
import { Mail, Plus, X, Loader2, AlertTriangle, RefreshCw, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GmailIntegration } from "@/types/api"
import { cn } from "@/lib/utils"
import { ErrorState } from "../error-state"
import { EmptyState } from "../empty-state"
import { LoadingState } from "../loading-state"

interface ConnectedAccountsProps {
	accounts: GmailIntegration[]
	onAddAccount: () => void
	onRemoveAccount: (id: string) => void
	activeIntegration?: string
	setActiveIntegration: (id: string) => void
	isLoading?: boolean
	isDisconnecting?: boolean
	isAdding?: boolean
	isLoadingError?: boolean
	refetchAccounts?: () => void
}

export function ConnectedAccounts({
	accounts = [],
	onAddAccount,
	onRemoveAccount,
	setActiveIntegration,
	activeIntegration,
	isDisconnecting,
	isAdding,
	isLoading = false,
	isLoadingError,
	refetchAccounts,
}: ConnectedAccountsProps) {
	const [isDisconnectingId, setIsDisconnectingId] = useState<string | null>(null)

	const handleDisconnect = async (id: string) => {
		setIsDisconnectingId(id)
		onRemoveAccount(id)
	}

	const error = {}
	return (
		<div className="rounded-xl border bg-card/60 p-5 shadow-sm">
			<div className="mb-5 flex items-center justify-between">
				<h3 className="font-medium">Connected Accounts</h3>
				<Button
					disabled={isAdding}
					onClick={onAddAccount}
					size="sm"
					variant="outline"
					className="h-8 gap-1.5"
				>
					{isAdding ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<Plus className="h-3.5 w-3.5" />
					)}
					Add Account
				</Button>
			</div>

			{isLoading ? (
				<LoadingState message="Loading accounts..." />
			) : isLoadingError ? (
				<ErrorState onRetry={refetchAccounts} />
			) : accounts.length === 0 ? (
				<EmptyState
					description="No email accounts connected yet"
					actionLabel="Connect your first account"
					isLoading={isAdding}
					onAction={onAddAccount}
				/>
			) : (
				<div className="space-y-3">
					{accounts.map((integration) => (
						<div
							onClick={() => setActiveIntegration(integration.id)}
							key={integration.id}
							className={cn(
								`cursor-pointer flex items-center justify-between rounded-lg border bg-background p-3 transition-colors`,
								activeIntegration === integration.id && "border-foreground"
							)}
						>
							<div className="flex items-center gap-3">
								<div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
									<Mail className="h-4 w-4 text-primary" />
								</div>
								<div>
									<p className="font-medium">{integration.gmail.email}</p>
									<p className="text-xs text-muted-foreground">
										Connected {new Date(integration.createdAt).toLocaleDateString()}
									</p>
								</div>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => handleDisconnect(integration.id)}
								disabled={isDisconnecting}
								className="h-8 px-2 text-sm text-muted-foreground hover:text-destructive"
							>
								{isDisconnecting && isDisconnectingId === integration.id ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<X className="h-4 w-4" />
								)}
							</Button>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
