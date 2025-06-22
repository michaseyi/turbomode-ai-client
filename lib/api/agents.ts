import { ApiDataResponse } from "@/types/api"
import { request, wrapper } from "./api-utils"

export async function invokeAgent(payload: any) {
	const response = await wrapper(() =>
		request.post<ApiDataResponse<any>>(`/agents/invoke`, payload)
	)
	return response.data
}
