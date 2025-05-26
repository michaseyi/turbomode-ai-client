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
	type: "Gmail"
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

export type Integrations = GmailIntegration | CalendarIntegration

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

export interface CalendarIntegration {
	id: string
	enabled: boolean
	type: "Gcalendar"
	gCalendar: {
		email: string
	}
	createdAt: string
	updatedAt: string
}

export interface ModifyCalendarIntegration {
	remindersEnabled?: boolean
	fetchEventsEnabled?: boolean
	reminderInstructions?: string
	visibilityOption?: "All" | "OnlySpecific" | "ExcludeSpecific"
	specificCalendars?: string
}

export interface UIMessage {
	id: string
	role: "assistant" | "user" | "tool" | "system"
	content: string
	timestamp: string
	metadata: Record<string, any>
}


export type CalendarEvent = {
	id: string
	eventId: string
	summary: string
	startTime: string
	endTime: string
	status: string
	htmlLink: string
	description: string
	location: string
}