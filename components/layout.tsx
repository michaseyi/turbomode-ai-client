import { cn } from "@/lib/utils"

export function Layout({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<div
			className={cn(
				"h-full flex flex-col items-center container mx-auto max-w-7xl p-4 sm:p-6",
				className
			)}
		>
			<div className="w-full h-full">{children}</div>
		</div>
	)
}
