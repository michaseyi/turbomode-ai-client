"use client"
import { AuthUserContext } from "@/components/auth-user-provider"
import { useContext } from "react"

export function useAuthUser() {
	return useContext(AuthUserContext)
}
