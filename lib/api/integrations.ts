import { buildOAuthUrl, getOAuthCode, openPopup, request, wrapper } from "@/lib/api/api-utils"
import { ApiDataResponse, GmailIntegration, ModifyGmailIntegration } from "@/types/api"

export async function newGmailIntegration() {
	openPopup(buildOAuthUrl("https://www.googleapis.com/auth/gmail.readonly email openid profile"))

	let code
	try {
		code = await getOAuthCode()
	} catch (err) {
		throw new Error(`Oauth failed`)
	}

	const response = await wrapper(() =>
		request.post<ApiDataResponse<GmailIntegration>>("/integrations/gmail", {
			code,
		})
	)

	return response.data
}

export async function listGmailIntegration() {
	const response = await wrapper(() =>
		request.get<ApiDataResponse<GmailIntegration[]>>("/integrations/gmail")
	)
	return response.data
}

export async function deleteGmailIntegration(id: string) {
	const response = await wrapper(() => request.delete(`/integrations/gmail/${id}`))
	return response.data
}

export async function newCalendarIntegration() {}

export async function patchGmailIntegration(id: string, payload: ModifyGmailIntegration) {
	const response = await wrapper(() =>
		request.patch<ApiDataResponse<GmailIntegration>>(`/integrations/gmail/${id}`, payload)
	)
	return response.data
}
