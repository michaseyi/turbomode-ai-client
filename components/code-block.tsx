import React, { useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Copy, Check } from "lucide-react"
import { vs, vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs"

interface CodeBlockProps {
	node?: any
	inline?: boolean
	className?: string
	children: React.ReactNode
	[key: string]: any
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
	node,
	inline,
	className,
	children,
	...props
}) => {
	const [copied, setCopied] = useState(false)
	const match = /language-(\w+)/.exec(className || "")

	const handleCopy = async () => {
		const code = String(children).replace(/\n$/, "")
		try {
			await navigator.clipboard.writeText(code)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			console.error("Failed to copy code:", err)
		}
	}

	const format = match && match[1]

	return !inline && match ? (
		<div className="overflow-hidden border my-4 rounded-xl">
			<div className="flex justify-between items-center px-4 py-2 border-b">
				<span className="text-xs font-medium uppercase tracking-wide">{format}</span>
				<button
					onClick={handleCopy}
					className="flex items-center gap-2 px-3 py-1.5 bg-transparent border text-xs font-medium hover:opacity-80 active:scale-98 transition-all duration-200 rounded-md"
					aria-label="Copy code"
				>
					{copied ? <Check size={14} /> : <Copy size={14} />}
					<span>{copied ? "Copied!" : "Copy"}</span>
				</button>
			</div>
			<SyntaxHighlighter
				language={match[1]}
				style={vs}
				customStyle={{
					// fontSize: "14px",
					fontFamily: "Ubuntu",
					backgroundColor: "var(--card)",
				}}
				{...props}
			>
				{String(children).replace(/\n$/, "")}
			</SyntaxHighlighter>
		</div>
	) : (
		<code className={className} {...props}>
			{children}
		</code>
	)
}
