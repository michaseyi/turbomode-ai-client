export type ApiDataResponse<T> = {
	success: true
	message: string
	data: T
}

export type PaginatedApiDataResponse<T> = {
	success: true
	message: string
	data: T
	pagination: {
		total: number
		page: number
		limit: number
		pages: number
		hasMore: boolean
	}
}

export type LoginBody = {
	email: string
	password: string
}

export type LoginResponse = {
	refreshToken: string
	accessToken: string
	expiresIn: number
	tokenType: string
}

export type ApiErrorResponse = {
	success: false
	error: {
		message: string
	}
}

export type ApiError = {
	message: string
}
export type AuthUser = {
	id: string
	role: "User" | "Admin"
	firstName: string
	lastName: string
	email: string
	profileImage?: string
	isEmailVerified: boolean
	createdAt: string
	updateAt: string
}

export type GmailIntegration = {
	id: string
	enabled: boolean
	type: "Gmail" | "Zoom" | "Slack" | "Gcalendar"
	gmail: {
		email: string
		processAttachment: boolean
		processThreadHistory: boolean
		instruction: string
		specificAddresses: string | null
		emailProcessOption: "All" | "ExceptSpecific" | "FromSpecific"
	}
	createdAt: string
	updatedAt: string
}

export type ModifyGmailIntegration = {
	processAttachment?: boolean
	processThreadHistory?: boolean
	specificAddresses?: string
	instruction?: string
	emailProcessOption?: "All" | "ExceptSpecific" | "FromSpecific"
}

export type Action = {
	id: string
	title: string
	active: boolean
	createdAt: string
	updateAt: string
}
