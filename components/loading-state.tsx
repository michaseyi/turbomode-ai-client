import { Loader2 } from "lucide-react"

interface LoadingStateProps {
	message?: string
	className?: string
}

export function LoadingState({ message = "Loading...", className = "" }: LoadingStateProps) {
	return (
		<div className={`flex items-center justify-center py-6 ${className}`}>
			<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
			<span className="ml-2 text-sm text-muted-foreground">{message}</span>
		</div>
	)
}
