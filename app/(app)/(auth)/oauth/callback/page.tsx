"use client"
import { Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"

function CallBack() {
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

export default function CallbackPage() {
	return (
		<Suspense>
			<CallBack />
		</Suspense>
	)
}
