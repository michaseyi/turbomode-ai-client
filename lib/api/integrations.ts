import { buildOAuthUrl, getOAuthCode, openPopup, request, wrapper } from "@/lib/api/api-utils"
import {
	ApiDataResponse,
	CalendarEvent,
	CalendarIntegration,
	FullGmailMessage,
	GmailIntegration,
	Integrations,
	ModifyGmailIntegration,
	NewEmailPayload,
	PaginatedApiDataResponse,
	PartialGmailMessage,
	ReplyEmailPayload,
} from "@/types/api"

export async function newGmailIntegration() {
	openPopup(buildOAuthUrl("https://www.googleapis.com/auth/gmail.modify email openid profile"))

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

export async function getCalendarIntegration(): Promise<ApiDataResponse<CalendarIntegration[]>> {
	const response = await wrapper(() =>
		request.get<ApiDataResponse<CalendarIntegration[]>>("/integrations/google-calendar")
	)

	return response.data
}

export async function connectCalendar() {
	openPopup(buildOAuthUrl("https://www.googleapis.com/auth/calendar email openid profile"))

	let code
	try {
		code = await getOAuthCode()
	} catch (err) {
		throw new Error(`Oauth failed`)
	}

	const response = await wrapper(() =>
		request.post("/integrations/google-calendar", {
			code,
		})
	)

	return response.data
}

export async function disconnectCalendar(id: string) {
	const response = await wrapper(() => request.delete(`/integrations/google-calendar/${id}`))
	return response.data
}

export async function listIntegrations() {
	const response = await wrapper(() =>
		request.get<ApiDataResponse<Integrations[]>>("/integrations")
	)
	return response.data
}

export async function fetchGoogleCalendarEventsByMonth(integrationId: string, month: Date) {
	const response = await wrapper(() =>
		request.get<ApiDataResponse<CalendarEvent[]>>(
			`/integrations/google-calendar/${integrationId}/events`,
			{
				params: {
					date: month.toISOString(),
				},
			}
		)
	)
	return response.data
}

export async function syncGoogleCalendarEvents(integrationId: string, month: Date) {
	await wrapper(() =>
		request.post(`/integrations/google-calendar/${integrationId}/events/sync`, {
			date: month.toISOString(),
		})
	)
}

export async function fetchGmailMessages(
	integrationId: string,
	page: number,
	limit: number,
	{
		labelId,
	}: {
		labelId?: string
	} = {}
) {
	const response = await wrapper(() =>
		request.get<PaginatedApiDataResponse<PartialGmailMessage[]>>(
			`/integrations/gmail/${integrationId}/messages`,
			{
				params: {
					page,
					limit,
					labelId,
				},
			}
		)
	)
	return response.data
}

export async function fetchGmailMessage(integrationId: string, messageId: string) {
	const response = await wrapper(() =>
		request.get<ApiDataResponse<FullGmailMessage>>(
			`/integrations/gmail/${integrationId}/messages/${messageId}`
		)
	)
	return response.data
}

export async function sendGmailMessage(
	integrationId: string,
	payload: NewEmailPayload | ReplyEmailPayload
) {
	const response = await wrapper(() =>
		request.post<ApiDataResponse<undefined>>(
			`/integrations/gmail/${integrationId}/messages/send`,
			payload
		)
	)
	return response.data
}
