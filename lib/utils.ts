import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function clearAuthTokens() {
	localStorage.removeItem("accessToken")
	localStorage.removeItem("refreshToken")
}
