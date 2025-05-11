import { ApiErrorResponse } from "@/types/api"
import axios, { isAxiosError } from "axios"

export const request = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
})

request.interceptors.request.use(
	(config) => {
		const accessToken = localStorage.getItem("accessToken")
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`
		}
		return config
	},
	(error) => Promise.reject(error)
)

request.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			localStorage.removeItem("token")
			if (window) {
				window.location.href = `/login?next=${window.location.pathname}`
			}
		}
		return Promise.reject(error)
	}
)

export async function wrapper<T>(callback: () => T) {
	try {
		return await callback()
	} catch (error) {
		if (!isAxiosError<ApiErrorResponse>(error)) {
			throw new Error("Unexpected error occured")
		}

		if (!error.response) {
			throw new Error(error.message)
		}

		throw new Error(error.response.data.error.message)
	}
}

export async function getOAuthCode() {
	const controller = new AbortController()
	return await new Promise<string>((res, rej) => {
		const listener = (e: MessageEvent) => {
			if (e.origin !== window.location.origin) return
			if (e.data.source !== "google-oauth") return

			controller.abort()
			console.log(e.data)
			if (e.data.error) {
				rej(e.data.error)
			} else {
				res(e.data.code)
			}
		}

		window.addEventListener("message", listener, { signal: controller.signal })

		setTimeout(() => {
			controller.abort()
			rej("OAuth login timed out")
		}, 900000)
	})
}

export function buildOAuthUrl(scope: string) {
	const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
	const redirectUri = window.location.origin + process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
	const authEndpoint = "https://accounts.google.com/o/oauth2/v2/auth"

	return `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${encodeURIComponent(
		scope
	)}&access_type=offline&prompt=consent`
}

export function openPopup(url: string) {
	return window.open(url, "_blank", "width=500,height=700")
}
