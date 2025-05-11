"use client"

import React, { createContext, useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { AuthUser } from "@/types/api"
import { clearAuthTokens } from "@/lib/utils"

export const AuthUserContext = createContext<AuthUser>({} as AuthUser)

type AuthUserProviderProp = {
	children: React.ReactNode
}

export function AuthUserProvider({ children }: AuthUserProviderProp) {
	const router = useRouter()
	const pathname = usePathname()

	const {
		data: user,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["auth-user"],
		queryFn: async () => {
			const res = await api.auth.me()
			return res.data
		},
		retry: false,
	})

	useEffect(() => {
		if (!isLoading && !user) {
			clearAuthTokens()
			router.push(`/login?next=${pathname}`)
		}

		if (error) {
			console.log(error.message)
		}
	}, [isLoading, user, router, pathname, error])

	if (isLoading) {
		return <div> </div>
	}

	if (!user) {
		return null
	}

	return <AuthUserContext.Provider value={user}>{children}</AuthUserContext.Provider>
}
