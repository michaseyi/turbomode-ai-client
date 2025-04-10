"use client"
import Gmail from "@/assets/images/gmail.png"
import { Button } from "@/components/ui/button"
import { MailIcon, PlusIcon } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

type EmailAccount = {
	id: number
	provider: string
	connectedAt: Date
	email: string
}

interface ConnectedAccountsProps {
	accounts: EmailAccount[]
	onAddAccount: () => void
	onRemoveAccount: (id: number) => void
	isLoading?: boolean
}

export function ConnectedAccounts({
	accounts = [],
	onAddAccount,
	onRemoveAccount,
	isLoading = false,
}: ConnectedAccountsProps) {
	// const { toast } = useToast()
	const [isDisconnecting, setIsDisconnecting] = useState<number | null>(null)

	const handleDisconnect = async (id: number) => {
		setIsDisconnecting(id)
		try {
			// In a real app, this would be an API call to disconnect the account
			await new Promise((resolve) => setTimeout(resolve, 1000))
			onRemoveAccount(id)
			// toast({
			// 	title: "Account disconnected",
			// 	description: "Email account has been successfully disconnected",
			// })
		} catch (error) {
			// toast({
			// 	title: "Error",
			// 	description: "Failed to disconnect email account",
			// 	variant: "destructive",
			// })
		} finally {
			setIsDisconnecting(null)
		}
	}

	return (
		<div className="border border-border rounded-lg p-4 mb-6 bg-card/50">
			<h3 className="text-md font-medium mb-4 text-foreground">Connected Accounts</h3>

			{accounts.length === 0 && !isLoading ? (
				<div className="py-3 text-center text-sm text-muted-foreground">
					No email accounts connected. Connect your first account to get started.
				</div>
			) : null}

			{isLoading ? (
				<div className="py-3 text-center text-sm text-muted-foreground">
					Loading connected accounts...
				</div>
			) : (
				accounts.map((account) => (
					<div
						key={account.id}
						className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
					>
						<div className="flex items-center space-x-3">
							<MailIcon className="h-6 w-6 text-primary" />
							<div>
								<p className="text-sm font-medium text-foreground">{account.email}</p>
								<p className="text-xs text-muted-foreground">
									{account.provider} • Connected{" "}
									{new Date(account.connectedAt).toLocaleDateString()}
								</p>
							</div>
						</div>
						<div>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => handleDisconnect(account.id)}
								disabled={isDisconnecting === account.id}
								className="hover:bg-accent text-muted-foreground hover:text-foreground"
							>
								{isDisconnecting === account.id ? "Disconnecting..." : "Disconnect"}
							</Button>
						</div>
					</div>
				))
			)}

			<Button className="mt-4 bg-primary hover:bg-primary/90" size="sm" onClick={onAddAccount}>
				<PlusIcon className="h-4 w-4 mr-2" />
				Connect New Account
			</Button>
		</div>
	)
}

function GmailProcessingSettings() {
	return <div>Gmail Processing Options</div>
}

export default function GmailIntegrationPage() {
	const data = {
		icon: Gmail,
		name: "Gmail",
		description:
			"Integrate your Gmail account to enable the AI assistant to read, organize, and extract insights from your emails.",
	}
	return (
		<>
			<div className="flex items-center gap-3 sm:gap-6">
				<Image width={200} src={data.icon} alt={data.name} className="sm:w-14 sm:h-14 w-10 h-10" />
				<h1 className="text-3xl font-semibold text-foreground">{data.name}</h1>
			</div>
			<p className="text-sm sm:text-base text-muted-foreground mt-3 leading-tight">
				{data.description}
			</p>

			<div className="mt-8 space-y-3">
				<ConnectedAccounts
					accounts={[
						{
							email: "michaseyi@gmail.com",
							provider: "Gmail",
							connectedAt: new Date(),
							id: 1,
						},
						{
							email: "adewolem2@gmail.com",
							provider: "Gmail",
							connectedAt: new Date(),
							id: 2,
						},
					]}
					onAddAccount={() => {}}
					onRemoveAccount={() => {}}
				/>
				<GmailProcessingSettings />
			</div>
		</>
	)
}
