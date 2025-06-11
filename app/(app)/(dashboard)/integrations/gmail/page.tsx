"use client"
import { useState } from "react"
import Image from "next/image"
import Gmail from "@/assets/images/gmail.png"
import { api } from "@/lib/api"
import { EmailProcessingOptions } from "@/components/gmail-integration/email-procession-option"
import { ConnectedAccounts } from "@/components/gmail-integration/connected-accounts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export default function GmailIntegrationPage() {
	const queryClient = useQueryClient()

	const [activeIntegration, setActiveIntegration] = useState<string>()

	const {
		data = [],
		isLoading,
		isError,
		refetch,
	} = useQuery({
		queryKey: ["gmail-integrations"],
		refetchOnWindowFocus: true,
		queryFn: async () => {
			return (await api.integrations.listGmailIntegration()).data
		},
	})

	const addAccountMutation = useMutation({
		mutationKey: ["connect-gmail"],
		mutationFn: async () => {
			return await api.integrations.newGmailIntegration()
		},
		onError: (err) => {
			toast(err.message)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["gmail-integrations"] })
			queryClient.invalidateQueries({ queryKey: ["integration-list"] })
			toast("New email data source connected")
		},
	})

	const removeAccountMutation = useMutation({
		mutationKey: ["remove-gmail"],
		mutationFn: async (id: string) => {
			return await api.integrations.deleteGmailIntegration(id)
		},
		onError: (err) => {
			toast(err.message)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["gmail-integrations"] })
			queryClient.invalidateQueries({ queryKey: ["integration-list"] })

			toast("Email data source removed")
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

	return (
		<div className="pb-6">
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
					isLoadingError={isError}
					refetchAccounts={refetch}
					isDisconnecting={removeAccountMutation.isPending}
					onRemoveAccount={handleRemoveAccount}
					isAdding={addAccountMutation.isPending}
				/>

				<EmailProcessingOptions activeIntegration={activeIntegration} integration={data} />
			</div>
		</div>
	)
}
