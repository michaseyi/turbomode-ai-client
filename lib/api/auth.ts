import { ApiDataResponse, AuthUser, LoginBody, LoginResponse } from "@/types/api"
import { buildOAuthUrl, getOAuthCode, openPopup, request, wrapper } from "@/lib/api/api-utils"

export async function login(payload: LoginBody): Promise<ApiDataResponse<LoginResponse>> {
	const response = await wrapper(() =>
		request.post<ApiDataResponse<LoginResponse>>("/auth/login", payload)
	)

	const { accessToken, refreshToken } = response.data.data
	console.log(accessToken, refreshToken)
	localStorage.setItem("accessToken", accessToken)
	localStorage.setItem("refreshToken", refreshToken)
	return response.data
}

export async function logout() {
	localStorage.removeItem("accessToken")
	localStorage.removeItem("refreshToken")

	if (window) {
		window.location.href = "/login"
	}
}

export async function refresh() {}

export async function me(): Promise<ApiDataResponse<AuthUser>> {
	const response = await wrapper(() => request.get<ApiDataResponse<AuthUser>>("/auth/me"))
	return response.data
}

export async function googleAuth(): Promise<ApiDataResponse<LoginResponse>> {
	openPopup(buildOAuthUrl("openid email profile"))

	let code
	try {
		code = await getOAuthCode()
	} catch (err) {
		throw new Error(`Oauth failed`)
	}

	const response = await wrapper(() =>
		request.get<ApiDataResponse<LoginResponse>>("/auth/oauth/google", {
			params: {
				code,
			},
		})
	)

	const { accessToken, refreshToken } = response.data.data
	localStorage.setItem("accessToken", accessToken)
	localStorage.setItem("refreshToken", refreshToken)
	return response.data
}
