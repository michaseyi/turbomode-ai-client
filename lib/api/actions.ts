import { Action, ApiDataResponse, PaginatedApiDataResponse, UIMessage } from "@/types/api"
import { request, wrapper } from "./api-utils"

export async function listActions(page: number, limit: number = 10) {
	const response = await wrapper(() =>
		request.get<PaginatedApiDataResponse<Action[]>>("/actions", {
			params: {
				page,
				limit,
			},
		})
	)
	return response.data
}

export async function listActionChatHistory(actionId: string) {
	const response = await wrapper(() =>
		request.get<ApiDataResponse<UIMessage[]>>(`/actions/${actionId}/history`, {})
	)
	return response.data
}

export async function createAction() {
	const response = await wrapper(() => request.post<ApiDataResponse<Action>>(`/actions`))
	return response.data
}
