"use client"
import { useState } from "react"
import { Mail, Plus, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GmailIntegration } from "@/types/api"
import { EmailProcessingOptions } from "./email-procession-option"
import { cn } from "@/lib/utils"

type EmailAccount = {
	id: number
	provider: string
	connectedAt: Date
	email: string
}

interface ConnectedAccountsProps {
	accounts: GmailIntegration[]
	onAddAccount: () => void
	onRemoveAccount: (id: string) => void
	activeIntegration?: string
	setActiveIntegration: (id: string) => void
	isLoading?: boolean
	isDisconnecting?: boolean
}

export function ConnectedAccounts({
	accounts = [],
	onAddAccount,
	onRemoveAccount,
	setActiveIntegration,
	activeIntegration,
	isDisconnecting,
	isLoading = false,
}: ConnectedAccountsProps) {
	const [isDisconnectingId, setIsDisconnectingId] = useState<string | null>(null)

	const handleDisconnect = async (id: string) => {
		setIsDisconnectingId(id)
		onRemoveAccount(id)
	}

	return (
		<div className="rounded-xl border bg-card/60 p-5 shadow-sm">
			<div className="mb-5 flex items-center justify-between">
				<h3 className="font-medium">Connected Accounts</h3>
				<Button onClick={onAddAccount} size="sm" variant="outline" className="h-8 gap-1.5">
					<Plus className="h-3.5 w-3.5" />
					Add Account
				</Button>
			</div>

			{accounts.length === 0 && !isLoading ? (
				<div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
					<Mail className="mb-2 h-10 w-10 text-muted-foreground/50" />
					<p className="text-sm text-muted-foreground">No email accounts connected yet</p>
					<Button onClick={onAddAccount} variant="secondary" size="sm" className="mt-4">
						Connect your first account
					</Button>
				</div>
			) : null}

			{isLoading ? (
				<div className="flex items-center justify-center py-6">
					<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
					<span className="ml-2 text-sm text-muted-foreground">Loading accounts...</span>
				</div>
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
