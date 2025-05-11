import { Inbox, Loader2 } from "lucide-react"
import { ReactNode } from "react"
import { Button } from "./ui/button"

interface EmptyStateProps {
	icon?: ReactNode
	title?: string
	description: string
	actionLabel?: string
	onAction?: () => void
	actionDisabled?: boolean
	isLoading?: boolean
	className?: string
}

export function EmptyState({
	icon = <Inbox className="h-10 w-10 text-muted-foreground/50" />,
	title,
	description,
	actionLabel,
	onAction,
	actionDisabled = false,
	isLoading = false,
	className = "",
}: EmptyStateProps) {
	return (
		<div
			className={`flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center ${className}`}
		>
			{/* <div className="mb-2">{icon}</div> */}
			{title && <p className="font-medium">{title}</p>}
			<p className="text-sm text-muted-foreground">{description}</p>
			{onAction && (
				<Button
					disabled={actionDisabled || isLoading}
					onClick={onAction}
					variant="secondary"
					size="sm"
					className="mt-4"
				>
					{isLoading ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<>{actionLabel || "Action"}</>
					)}
				</Button>
			)}
		</div>
	)
}
