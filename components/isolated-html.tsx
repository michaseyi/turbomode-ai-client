import { useEffect, useRef } from "react"

type IsolatedHtmlProps = {
	htmlContent: string
	className?: string
}

export const IsolatedHtml = ({ htmlContent, className = "" }: IsolatedHtmlProps) => {
	const shadowRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (shadowRef.current && htmlContent) {
			// Clear existing shadow root if it exists
			if (shadowRef.current.shadowRoot) {
				shadowRef.current.shadowRoot.innerHTML = ""
			} else {
				shadowRef.current.attachShadow({ mode: "open" })
			}

			const shadowRoot = shadowRef.current.shadowRoot!

			const style = document.createElement("style")
			style.textContent = `
				:host {
					color-scheme: light !important;
					display: block;
					font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
					line-height: 1.5;
					color: #000000 !important;
					background-color: #ffffff !important;
				}
				
				/* Force light theme for all elements */
				* {
					color-scheme: light !important;
				}
				
				/* Reset and force light colors */
				div, p, span, h1, h2, h3, h4, h5, h6, td, th, li, ul, ol {
					color: #000000 !important;
					background-color: transparent !important;
				}
				
				/* Style links appropriately for light theme */
				a {
					color: #0066cc !important;
				}
				
				a:visited {
					color: #551a8b !important;
				}
				
				/* Handle tables */
				table {
					color: #000000 !important;
					background-color: #ffffff !important;
				}
				
				/* Handle any inline styles that might override */
				[style*="color"]:not(a) {
					color: #000000 !important;
				}
				
				[style*="background"] {
					background-color: transparent !important;
				}
			`

			shadowRoot.appendChild(style)

			const contentDiv = document.createElement("div")
			contentDiv.innerHTML = htmlContent
			shadowRoot.appendChild(contentDiv)
		}
	}, [htmlContent])

	return <div ref={shadowRef} className={className} style={{ colorScheme: "light" }} />
}
