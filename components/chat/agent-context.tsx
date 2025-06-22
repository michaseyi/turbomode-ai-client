import { Notebook, X, FileText, File } from "lucide-react"
import { useRouter } from "next/navigation"

const contextTypeMap = {
	email: { icon: FileText, color: "text-gray-500", bgColor: "bg-gray-50" },
	note: { icon: Notebook, color: "text-purple-500", bgColor: "bg-purple-50" },
	default: { icon: File, color: "text-gray-500", bgColor: "bg-gray-50" },
}

type AgentContextProps = {
	name: string
	type: string
	metadata: Record<string, any>
	onRemove?: () => void
	className?: string
}

export function AgentContext({
	name,
	metadata,
	type,
	onRemove,
	className = "",
}: AgentContextProps) {
	const contextType =
		contextTypeMap[type.toLowerCase() as keyof typeof contextTypeMap] || contextTypeMap.default
	const IconComponent = contextType.icon

	const router = useRouter()

	function handleContextClick(event: React.MouseEvent<HTMLDivElement>) {
		event.stopPropagation()

		switch (type.toLocaleLowerCase()) {
			case "email": {
				const { messageId, integrationId } = metadata
				router.push(`/integrations/gmail/${integrationId}/messages/${messageId}`)
				return
			}
			case "note": {
				const { noteId } = metadata
				router.push(`/notes/${noteId}`)
				return
			}
		}
	}
	function handleOnRemove(event: React.MouseEvent<HTMLButtonElement>) {
		event.stopPropagation()
		if (onRemove) {
			onRemove()
		}
	}

	return (
		<div
			className={`cursor-pointer p-1 border border-border rounded-2xl flex items-center gap-3 transition-all duration-200 hover:border-border/80 hover:shadow-sm min-w-48 ${className}`}
			onClick={handleContextClick}
		>
			<div
				className={`${contextType.color} rounded-md pl-2 flex-shrink-0 transition-colors duration-200`}
			>
				<IconComponent className="w-4 h-4" />
			</div>

			<div className="flex-1 min-w-0">
				<div className="flex items-center">
					<span className="text-sm  font-medium text-foreground truncate max-w-40" title={name}>
						{name}
					</span>
				</div>

				<div className="flex items-center">
					<span className="text-muted-foreground font-medium text-xs">{type}</span>
				</div>
			</div>

			{onRemove && (
				<button
					type="button"
					onClick={handleOnRemove}
					className="flex-shrink-0 rounded-full p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-destructive/20"
					aria-label={`Remove ${name}`}
				>
					<X className="w-3 h-3" />
				</button>
			)}
		</div>
	)
}
