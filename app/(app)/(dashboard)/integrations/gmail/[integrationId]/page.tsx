"use client"
import React, { useEffect, useState } from "react"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { EmailList } from "@/components/gmail-integration/email-list"
import { ArrowLeft, Mail, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmailComposer } from "@/components/gmail-integration/email-composer"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

export default function GmailIntegrationViewPage() {
	const { integrationId } = useParams<{ integrationId: string }>()

	const router = useRouter()

	const queries = useSearchParams()

	const [displayComposer, setDisplayComposer] = useState(!!queries.get("compose"))

	const pathname = usePathname()

	const isMobile = useIsMobile()

	useEffect(() => {
		if (queries.get("compose")) {
			setDisplayComposer(true)
		} else {
			setDisplayComposer(false)
		}
	}, [queries])

	function handleComposeMail() {
		router.push("?compose=new")
	}

	function handleGoBack() {
		router.back()
	}

	function onSendComplete() {
		router.push(pathname)
	}

	return (
		<div className="bg-background text-foreground pb-6 h-full flex flex-col min-h-0">
			<div className="flex items-center justify-between mb-4 md:mb-6">
				<div className={cn("flex items-center", "space-x-4")}>
					<Mail />
					<h1 className="text-2xl font-bold text-primary">Inbox</h1>
				</div>

				<Button onClick={handleComposeMail} variant="outline" className="cursor-pointer">
					<Plus />
				</Button>
			</div>

			{isMobile ? (
				<>
					{displayComposer ? (
						<div className="border border-border rounded-lg overflow-clip flex-1 min-h-0">
							<EmailComposer
								onSendDone={onSendComplete}
								isReply={false}
								integrationId={integrationId}
							/>
						</div>
					) : (
						<EmailList integrationId={integrationId} />
					)}
				</>
			) : (
				<>
					<EmailList integrationId={integrationId} />
					{displayComposer && (
						<div className="flex-1 flex flex-col min-h-0 fixed bottom-0 right-0 z-10 m-7 w-3xl h-3/4 rounded-lg border border-border overflow-clip shadow-lg divide-y divide-border">
							<div className="bg-card px-3 py-1 flex justify-between items-center">
								<span>Composer</span>

								<Button
									variant="ghost"
									size="sm"
									onClick={() => {
										{
											displayComposer ? (
												<EmailComposer
													onSendDone={onSendComplete}
													isReply={false}
													integrationId={integrationId}
												/>
											) : (
												<EmailList integrationId={integrationId} />
											)
										}
										router.push(pathname)
									}}
								>
									<X />
								</Button>
							</div>
							<div className="min-h-0 flex-1">
								<EmailComposer
									onSendDone={onSendComplete}
									isReply={false}
									integrationId={integrationId}
								/>
							</div>
						</div>
					)}
				</>
			)}
		</div>
	)
}
