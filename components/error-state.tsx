import { AlertTriangle, RefreshCw } from "lucide-react"
import { ReactNode } from "react"
import { Button } from "./ui/button"

interface ErrorStateProps {
	onRetry?: () => void
	title?: string
	icon?: ReactNode
	className?: string
}

export function ErrorState({
	onRetry,
	title = "An error occurred",
	icon = <AlertTriangle className="h-10 w-10 text-destructive/70" />,
	className = "",
}: ErrorStateProps) {
	return (
		<div
			className={`flex flex-col items-center justify-center rounded-lg border border-dashed border-destructive/50 py-8 text-center ${className}`}
		>
			{/* <div className="mb-2">{icon}</div> */}
			{/* <p className="font-medium text-destructive">{title}</p> */}
			<p className="text-sm text-muted-foreground mt-1">{title}</p>
			{onRetry && (
				<Button
					onClick={onRetry}
					variant="outline"
					size="sm"
					className="mt-4 gap-2 border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
				>
					<RefreshCw className="h-3.5 w-3.5" />
					Try again
				</Button>
			)}
		</div>
	)
}
