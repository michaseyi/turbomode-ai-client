import { Action, ApiDataResponse } from "@/types/api"
import { request, wrapper } from "./api-utils"

export async function listActions(page: number) {
	const response = await wrapper(() =>
		request.get<ApiDataResponse<Action[]>>("/actions", {
			params: {
				page,
			},
		})
	)
	return response.data
}
