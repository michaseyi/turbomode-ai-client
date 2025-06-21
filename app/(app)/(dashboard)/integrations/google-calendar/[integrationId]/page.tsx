"use client"
import React, { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Plus, Loader2 } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const colors = ["bg-chart-4", "bg-chart-3", "bg-chart-2", "bg-chart-1"]

export function getStartOfMonth(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0)
}

export function getEndOfMonth(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
}

function randomColor(id: string) {
	const key = `calendar-event:${id}:color`
	let color = localStorage.getItem(key)

	if (color) {
		return color
	}

	color = colors.at(Math.floor(Math.random() * colors.length))!
	localStorage.setItem(key, color)
	return color
}

function buildCalendar(currentDate: Date, today: Date) {
	const currentMonth = currentDate.getMonth()
	const currentYear = currentDate.getFullYear()

	// get first day of month and number of days
	const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
	const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
	const firstDayWeekday = firstDayOfMonth.getDay()
	const daysInMonth = lastDayOfMonth.getDate()
	const calendarDays = []

	// previous month's trailing days
	const prevMonth = new Date(currentYear, currentMonth - 1, 0)
	for (let i = firstDayWeekday - 1; i >= 0; i--) {
		calendarDays.push({
			date: new Date(currentYear, currentMonth - 1, prevMonth.getDate() - i),
			isCurrentMonth: false,
			isToday: false,
		})
	}

	// current month days
	for (let day = 1; day <= daysInMonth; day++) {
		const date = new Date(currentYear, currentMonth, day)
		calendarDays.push({
			date,
			isCurrentMonth: true,
			isToday: date.toDateString() === today.toDateString(),
		})
	}

	// next month's leading days
	const remainingDays = 42 - calendarDays.length // 6 rows × 7 days
	for (let day = 1; day <= remainingDays; day++) {
		calendarDays.push({
			date: new Date(currentYear, currentMonth + 1, day),
			isCurrentMonth: false,
			isToday: false,
		})
	}

	return calendarDays
}

const CalendarPage = () => {
	const { integrationId } = useParams<{ integrationId: string }>()

	const [currentDate, setCurrentDate] = useState(new Date())

	const today = new Date()
	const currentMonth = currentDate.getMonth()
	const currentYear = currentDate.getFullYear()

	const queryClient = useQueryClient()

	const { data: events = [] } = useQuery({
		queryKey: ["calendar-events", integrationId, getStartOfMonth(currentDate).toISOString()],
		queryFn: async () => {
			return (
				await api.integrations.fetchGoogleCalendarEventsByMonth(
					integrationId,
					getStartOfMonth(currentDate)
				)
			).data
		},
	})

	const [selectedDate, setSelectedDate] = useState<Date | null>(null)

	const [view, setView] = useState("month") // 'month', 'week', 'day'

	const calendarDays = buildCalendar(currentDate, today)

	const goToPrevMonth = () => {
		setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
	}

	const goToNextMonth = () => {
		setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
	}

	const goToToday = () => {
		setCurrentDate(new Date())
		setSelectedDate(new Date())
	}

	const getEventsForDate = (date: Date) => {
		return events.filter((event) => {
			const eventDate = new Date(event.startTime)
			return eventDate.toDateString() === date.toDateString()
		})
	}

	const formatTime = (dateString: string) => {
		return new Date(dateString).toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		})
	}

	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	]

	const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

	const syncMutation = useMutation({
		mutationKey: ["sync-calendar", integrationId, getStartOfMonth(currentDate).toISOString()],
		mutationFn: async (date: Date) => {
			await api.integrations.syncGoogleCalendarEvents(integrationId, date)
		},
		onSuccess: (_, variable) => {
			queryClient.invalidateQueries({
				queryKey: ["calendar-events", integrationId, variable.toISOString()],
			})
			toast("Calender events from selected months synced")
		},

		onError: (error) => {
			toast.error(`Failed to sync calendar events: ${error.message}`)
		},
	})

	function sync() {
		const startOfMonth = getStartOfMonth(currentDate)
		syncMutation.mutate(startOfMonth)
	}

	const isSyncDisabled = syncMutation.isPending

	return (
		<div className="bg-background text-foreground pb-6">
			{/* Header */}
			<div className="flex flex-col md:flex-row items-center justify-between mb-4 md:mb-6 gap-4 md:gap-0">
				<div className="flex w-full md:w-fit items-center space-x-4 self-start">
					<h1 className="text-2xl font-bold text-primary">Calendar</h1>

					<Button className="ml-auto" disabled={isSyncDisabled} onClick={goToToday}>
						Today
					</Button>
					<Button disabled={isSyncDisabled} variant="outline" onClick={sync}>
						{isSyncDisabled ? (
							<Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
						) : (
							<>Sync</>
						)}
					</Button>
				</div>

				<div className="flex md:self-start items-center space-x-4">
					{/* View Toggle */}
					{/* <div className="flex bg-muted rounded-lg p-1">
						{["month", "week", "day"].map((v) => (
							<button
								key={v}
								onClick={() => setView(v)}
								className={`px-3 py-1 rounded-md text-sm font-medium transition-colors capitalize ${
									view === v
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:text-foreground"
								}`}
							>
								{v}
							</button>
						))}
					</div> */}

					{/* Navigation */}
					<div className="flex items-center space-x-2">
						<Button variant="ghost" disabled={isSyncDisabled} onClick={goToPrevMonth}>
							<ChevronLeft className="w-5 h-5" />
						</Button>

						<h2 className="text-lg md:text-xl font-semibold min-w-[150px] md:min-w-[150px] text-center">
							{monthNames[currentMonth]} {currentYear}
						</h2>

						<Button variant="ghost" disabled={isSyncDisabled} onClick={goToNextMonth}>
							<ChevronRight className="w-5 h-5" />
						</Button>
					</div>
				</div>
			</div>

			{/* Calendar Grid */}
			<div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
				{/* Day Headers */}
				<div className="grid grid-cols-7 bg-muted/50">
					{dayNames.map((day) => (
						<div
							key={day}
							className="p-4 text-center font-medium text-muted-foreground border-r border-border last:border-r-0"
						>
							{day}
						</div>
					))}
				</div>

				{/* Calendar Days */}
				<div className="grid grid-cols-7">
					{calendarDays.map((day, index) => {
						const dayEvents = getEventsForDate(day.date)
						const isSelected =
							selectedDate && day.date.toDateString() === selectedDate.toDateString()

						return (
							<div
								key={index}
								onClick={() => setSelectedDate(day.date)}
								className={`min-h-[120px] p-2 border-r border-b border-border last:border-r-0 cursor-pointer transition-colors hover:bg-muted/30 ${
									!day.isCurrentMonth ? "bg-muted/10 text-muted-foreground" : ""
								} ${day.isToday ? "bg-primary/10" : ""} ${isSelected ? "bg-accent/30" : ""}`}
							>
								<div className="flex justify-between items-start mb-2">
									<span
										className={`text-sm font-medium ${
											day.isToday
												? "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center"
												: ""
										}`}
									>
										{day.date.getDate()}
									</span>
									{day.isCurrentMonth && dayEvents.length > 0 && (
										<span className="text-xs bg-chart-1 text-white rounded-full w-5 h-5 flex items-center justify-center">
											{dayEvents.length}
										</span>
									)}
								</div>

								{/* Events */}
								<div className="space-y-1">
									{dayEvents.slice(0, 3).map((event) => (
										<div
											key={event.id}
											className={`text-xs p-1 rounded truncate ${randomColor(event.id)} text-white`}
											title={`${event.summary} - ${formatTime(event.startTime)}`}
										>
											{event.summary}
										</div>
									))}
									{dayEvents.length > 3 && (
										<div className="text-xs text-muted-foreground">
											+{dayEvents.length - 3} more
										</div>
									)}
								</div>
							</div>
						)
					})}
				</div>
			</div>

			{/* Selected Date Events Panel */}
			{selectedDate && (
				<div className="mt-6 bg-card rounded-xl border border-border p-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold">
							Events for{" "}
							{selectedDate.toLocaleDateString("en-US", {
								weekday: "long",
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</h3>
						<button
							onClick={() => setSelectedDate(null)}
							className="text-muted-foreground hover:text-foreground"
						>
							✕
						</button>
					</div>

					<div className="space-y-3">
						{getEventsForDate(selectedDate).length === 0 ? (
							<p className="text-muted-foreground">No events scheduled for this day.</p>
						) : (
							getEventsForDate(selectedDate).map((event) => (
								<div
									key={event.id}
									className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg"
								>
									<div className={`w-3 h-3 rounded-full ${randomColor(event.id)} mt-1.5`}></div>
									<div className="flex-1">
										<h4 className="font-medium">{event.summary}</h4>
										<div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
											<div className="flex items-center space-x-1">
												<Clock className="w-4 h-4" />
												<span>
													{formatTime(event.startTime)} - {formatTime(event.endTime)}
												</span>
											</div>
											{event.location && (
												<div className="flex items-center space-x-1">
													<MapPin className="w-4 h-4" />
													<span>{event.location}</span>
												</div>
											)}
										</div>
										{event.description && (
											<p className="text-sm text-muted-foreground mt-2">{event.description}</p>
										)}
									</div>
								</div>
							))
						)}
					</div>
				</div>
			)}
		</div>
	)
}

export default CalendarPage
