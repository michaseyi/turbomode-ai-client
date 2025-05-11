"use client"
import { useState } from "react"
import Image from "next/image"
import Gmail from "@/assets/images/gmail.png"
import { api } from "@/lib/api"
import { EmailProcessingOptions } from "@/components/gmail-integration/email-procession-option"
import { ConnectedAccounts } from "@/components/gmail-integration/connected-accounts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

type EmailAccount = {
	id: number
	provider: string
	connectedAt: Date
	email: string
}

export default function GmailIntegrationPage() {
	const queryClient = useQueryClient()

	const { data = [], isLoading } = useQuery({
		queryKey: ["gmail-integrations"],
		queryFn: async () => {
			return (await api.integrations.getGmailIntegrations()).data
		},
	})

	const addAccountMutation = useMutation({
		mutationKey: ["connect-gmail"],
		mutationFn: async () => {
			return await api.integrations.addgmailIntegration()
		},
		onError: (err) => {
			toast(err.message, {
				action: {
					label: "Undo",
					onClick: () => 0,
				},
			})
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["gmail-integrations"] })
			toast("New email data source connected", {
				action: {
					label: "Undo",
					onClick: () => 0,
				},
			})
		},
	})

	const removeAccountMutation = useMutation({
		mutationKey: ["remove-gmail"],
		mutationFn: async (id: string) => {
			return await api.integrations.removeGmailIntegration(id)
		},
		onError: (err) => {
			toast(err.message, {
				action: {
					label: "Undo",
					onClick: () => 0,
				},
			})
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["gmail-integrations"] })
			toast("Email data source removed", {
				action: {
					label: "Undo",
					onClick: () => 0,
				},
			})
		},
	})

	const handleAddAccount = async () => {
		addAccountMutation.mutate()
	}

	const handleRemoveAccount = (id: string) => {
		if (id === activeIntegration) {
			setActiveIntegration(undefined)
		}
		removeAccountMutation.mutate(id)
	}

	const [activeIntegration, setActiveIntegration] = useState<string>()

	return (
		<div>
			<div className="mb-8 flex items-center gap-4">
				<div className="flex shrink-0 h-12 w-12 items-center justify-center rounded-full bg-primary/10 p-2">
					<Image src={Gmail} alt="Gmail" width={24} height={24} />
				</div>
				<div>
					<h1 className="text-2xl font-semibold">Gmail Integration</h1>
					<p className="text-sm text-muted-foreground line-clamp-2">
						Integrate your Gmail account to enable the AI assistant to read, organize, and extract
						insights from your emails.
					</p>
				</div>
			</div>

			<div className="space-y-6">
				<ConnectedAccounts
					accounts={data}
					activeIntegration={activeIntegration}
					setActiveIntegration={setActiveIntegration}
					onAddAccount={handleAddAccount}
					isLoading={isLoading}
					isDisconnecting={removeAccountMutation.isPending}
					onRemoveAccount={handleRemoveAccount}
				/>

				<EmailProcessingOptions activeIntegration={activeIntegration} integration={data} />
			</div>
		</div>
	)
}
