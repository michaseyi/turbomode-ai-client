"use client"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function CallbackPage() {
	const params = useSearchParams()

	useEffect(() => {
		const code = params.get("code")
		const error = params.get("error")

		if (window.opener) {
			window.opener.postMessage(
				{
					source: "google-oauth",
					code,
					error,
					values: [...params.values()],
					keys: [...params.keys()],
				},
				window.location.origin
			)
		}

		window.close()
	}, [params])

	return <></>
}
