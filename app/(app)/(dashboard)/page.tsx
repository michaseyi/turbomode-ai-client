"use client"
import { useState } from "react"
import Gmail from "@/assets/images/gmail.png"
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	AreaChart,
	Area,
} from "recharts"
import {
	Mail,
	MessageSquare,
	Video,
	Clock,
	ArrowUpRight,
	CheckCircle,
	AlertCircle,
	MoreHorizontal,
	ChevronRight,
	Calendar,
	Search,
	Bell,
	TrendingUp,
	Zap,
	BarChart3,
	Home,
} from "lucide-react"
import Image from "next/image"
import { Layout } from "@/components/layout"

// Sample data - replace with your actual data
const activityData = [
	{ name: "Apr 30", tasks: 5, emails: 3, meetings: 2 },
	{ name: "May 01", tasks: 8, emails: 5, meetings: 3 },
	{ name: "May 02", tasks: 7, emails: 4, meetings: 3 },
	{ name: "May 03", tasks: 10, emails: 7, meetings: 3 },
	{ name: "May 04", tasks: 12, emails: 8, meetings: 4 },
	{ name: "May 05", tasks: 6, emails: 4, meetings: 2 },
	{ name: "May 06", tasks: 9, emails: 6, meetings: 3 },
	{ name: "May 07", tasks: 11, emails: 7, meetings: 4 },
	{ name: "May 08", tasks: 14, emails: 9, meetings: 5 },
	{ name: "May 09", tasks: 10, emails: 6, meetings: 4 },
	{ name: "May 10", tasks: 8, emails: 5, meetings: 3 },
	{ name: "May 11", tasks: 13, emails: 8, meetings: 5 },
]

const hourlyDistribution = [
	{ name: "12 AM", tasks: 1 },
	{ name: "4 AM", tasks: 0 },
	{ name: "8 AM", tasks: 3 },
	{ name: "12 PM", tasks: 9 },
	{ name: "4 PM", tasks: 6 },
	{ name: "8 PM", tasks: 2 },
]

const recentActivity = [
	{
		id: 1,
		type: "email",
		title: "Scheduled meeting with marketing team",
		source: "From: Sarah Johnson",
		time: "24 min ago",
		status: "completed",
	},
	{
		id: 2,
		type: "slack",
		title: "Added task reminder from Slack",
		source: "Project channel",
		time: "1 hr ago",
		status: "completed",
	},
	{
		id: 3,
		type: "email",
		title: "Flagged urgent email for review",
		source: "From: Client XYZ",
		time: "3 hrs ago",
		status: "pending",
	},
	{
		id: 4,
		type: "meeting",
		title: "Summarized meeting notes",
		source: "Weekly team sync",
		time: "5 hrs ago",
		status: "completed",
	},
]

export default function Dashboard() {
	const [timeFrame, setTimeFrame] = useState("week")

	return (
		<Layout>
			<div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
				<div className="flex items-center gap-4">
					<div className="flex shrink-0 h-12 w-12 items-center justify-center rounded-full bg-primary/10 p-2">
						<Home />
					</div>
					<div>
						<h1 className="text-2xl font-semibold text-foreground">Your Assistant Overview</h1>
						<p className="text-muted-foreground text-sm">May 11, 2025</p>
					</div>
				</div>

				<div className="mt-4 md:mt-0 flex gap-2 bg-secondary rounded-lg p-1 shadow-sm border border-border">
					<button
						className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
							timeFrame === "day"
								? "bg-primary text-primary-foreground"
								: "text-foreground hover:bg-accent hover:text-accent-foreground"
						}`}
						onClick={() => setTimeFrame("day")}
					>
						Day
					</button>
					<button
						className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
							timeFrame === "week"
								? "bg-primary text-primary-foreground"
								: "text-foreground hover:bg-accent hover:text-accent-foreground"
						}`}
						onClick={() => setTimeFrame("week")}
					>
						Week
					</button>
					<button
						className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
							timeFrame === "month"
								? "bg-primary text-primary-foreground"
								: "text-foreground hover:bg-accent hover:text-accent-foreground"
						}`}
						onClick={() => setTimeFrame("month")}
					>
						Month
					</button>
				</div>
			</div>

			{/* Key Stats Row */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
				<div className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
					<div className="flex items-center justify-between">
						<p className="text-sm font-medium text-muted-foreground">Completed Tasks</p>
						<div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
							<CheckCircle className="h-4 w-4 text-primary" />
						</div>
					</div>
					<div className="mt-3 flex items-baseline justify-between">
						<h3 className="text-2xl font-medium text-foreground">43</h3>
						<div className="bg-secondary text-primary text-xs font-medium px-2 py-0.5 rounded-full flex items-center">
							+12% <ArrowUpRight className="ml-0.5 h-3 w-3" />
						</div>
					</div>
					<div className="mt-3">
						<div className="w-full bg-muted rounded-full h-1.5">
							<div className="bg-chart-1 h-1.5 rounded-full" style={{ width: "78%" }}></div>
						</div>
					</div>
				</div>

				<div className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
					<div className="flex items-center justify-between">
						<p className="text-sm font-medium text-muted-foreground">Emails Processed</p>
						<div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
							<Mail className="h-4 w-4 text-primary" />
						</div>
					</div>
					<div className="mt-3 flex items-baseline justify-between">
						<h3 className="text-2xl font-medium text-foreground">32</h3>
						<p className="text-xs text-muted-foreground">8 actionable</p>
					</div>
					<div className="mt-3">
						<div className="w-full bg-muted rounded-full h-1.5">
							<div className="bg-chart-2 h-1.5 rounded-full" style={{ width: "65%" }}></div>
						</div>
					</div>
				</div>

				<div className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
					<div className="flex items-center justify-between">
						<p className="text-sm font-medium text-muted-foreground">Time Saved</p>
						<div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
							<Clock className="h-4 w-4 text-primary" />
						</div>
					</div>
					<div className="mt-3 flex items-baseline justify-between">
						<h3 className="text-2xl font-medium text-foreground">4.5 hrs</h3>
						<div className="bg-secondary text-primary text-xs font-medium px-2 py-0.5 rounded-full flex items-center">
							+32m <ArrowUpRight className="ml-0.5 h-3 w-3" />
						</div>
					</div>
					<div className="mt-3">
						<div className="w-full bg-muted rounded-full h-1.5">
							<div className="bg-chart-3 h-1.5 rounded-full" style={{ width: "85%" }}></div>
						</div>
					</div>
				</div>

				<div className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
					<div className="flex items-center justify-between">
						<p className="text-sm font-medium text-muted-foreground">Success Rate</p>
						<div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
							<TrendingUp className="h-4 w-4 text-primary" />
						</div>
					</div>
					<div className="mt-3 flex items-baseline justify-between">
						<h3 className="text-2xl font-medium text-foreground">94%</h3>
						<div className="bg-secondary text-primary text-xs font-medium px-2 py-0.5 rounded-full flex items-center">
							-2% <ArrowUpRight className="ml-0.5 h-3 w-3 rotate-45" />
						</div>
					</div>
					<div className="mt-3">
						<div className="w-full bg-muted rounded-full h-1.5">
							<div className="bg-chart-4 h-1.5 rounded-full" style={{ width: "94%" }}></div>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content Area */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left Column - Charts */}
				<div className="lg:col-span-2 space-y-6">
					{/* Activity Chart */}
					<div className="bg-card rounded-xl border border-border p-5 shadow-sm">
						<div className="flex items-center justify-between mb-6">
							<h3 className="font-semibold text-foreground">Activity Over Time</h3>
							<div className="flex gap-1">
								<button className="p-1 rounded hover:bg-accent">
									<MoreHorizontal className="h-4 w-4 text-muted-foreground" />
								</button>
							</div>
						</div>
						<div className="h-64">
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart data={activityData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
									<defs>
										<linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
											<stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.2} />
											<stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
										</linearGradient>
									</defs>
									<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
									<XAxis
										dataKey="name"
										axisLine={false}
										tickLine={false}
										tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
										tickFormatter={(value) => value.split(" ")[1]}
									/>
									<YAxis
										axisLine={false}
										tickLine={false}
										tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
									/>
									<Tooltip
										contentStyle={{
											backgroundColor: "var(--popover)",
											border: "1px solid var(--border)",
											borderRadius: "6px",
											color: "var(--popover-foreground)",
										}}
									/>
									<Area
										type="monotone"
										dataKey="tasks"
										stroke="var(--chart-1)"
										strokeWidth={2}
										fillOpacity={1}
										fill="url(#colorTasks)"
									/>
								</AreaChart>
							</ResponsiveContainer>
						</div>
						<div className="flex items-center justify-center gap-6 mt-4 text-sm">
							<div className="flex items-center gap-1.5">
								<div className="w-3 h-3 rounded-full bg-chart-1"></div>
								<span className="text-muted-foreground">Total Tasks</span>
							</div>
						</div>
					</div>

					{/* Source Distribution and Hourly Charts */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Source Distribution */}
						<div className="bg-card rounded-xl border border-border p-5 shadow-sm">
							<h3 className="font-semibold text-foreground mb-5">Sources</h3>
							<div className="space-y-4">
								<div>
									<div className="flex justify-between items-center mb-1">
										<span className="text-sm font-medium text-muted-foreground">Email</span>
										<span className="text-sm font-medium text-foreground">32 (48%)</span>
									</div>
									<div className="w-full bg-muted rounded-full h-2">
										<div className="bg-chart-1 h-2 rounded-full" style={{ width: "48%" }}></div>
									</div>
								</div>
								<div>
									<div className="flex justify-between items-center mb-1">
										<span className="text-sm font-medium text-muted-foreground">Slack</span>
										<span className="text-sm font-medium text-foreground">18 (27%)</span>
									</div>
									<div className="w-full bg-muted rounded-full h-2">
										<div className="bg-chart-2 h-2 rounded-full" style={{ width: "27%" }}></div>
									</div>
								</div>
								<div>
									<div className="flex justify-between items-center mb-1">
										<span className="text-sm font-medium text-muted-foreground">Meetings</span>
										<span className="text-sm font-medium text-foreground">14 (20%)</span>
									</div>
									<div className="w-full bg-muted rounded-full h-2">
										<div className="bg-chart-3 h-2 rounded-full" style={{ width: "20%" }}></div>
									</div>
								</div>
								<div>
									<div className="flex justify-between items-center mb-1">
										<span className="text-sm font-medium text-muted-foreground">Manual</span>
										<span className="text-sm font-medium text-foreground">7 (5%)</span>
									</div>
									<div className="w-full bg-muted rounded-full h-2">
										<div className="bg-chart-4 h-2 rounded-full" style={{ width: "5%" }}></div>
									</div>
								</div>
							</div>
						</div>

						{/* Hourly Activity */}
						<div className="bg-card rounded-xl border border-border p-5 shadow-sm">
							<h3 className="font-semibold text-foreground mb-5">Hourly Activity</h3>
							<div className="h-48">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart
										data={hourlyDistribution}
										margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
									>
										<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
										<XAxis
											dataKey="name"
											axisLine={false}
											tickLine={false}
											tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
										/>
										<YAxis
											axisLine={false}
											tickLine={false}
											tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
										/>
										<Tooltip
											contentStyle={{
												backgroundColor: "var(--popover)",
												border: "1px solid var(--border)",
												borderRadius: "6px",
												color: "var(--popover-foreground)",
											}}
										/>
										<Bar dataKey="tasks" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
									</BarChart>
								</ResponsiveContainer>
							</div>
						</div>
					</div>
				</div>

				{/* Right Column - Activity and Insights */}
				<div className="space-y-6 mb-8">
					{/* Insight Card */}
					<div className="bg-gradient-to-br from-primary to-ring rounded-xl p-5 shadow-md text-primary-foreground">
						<div className="flex items-center gap-2 mb-3">
							<Zap className="h-5 w-5" />
							<h3 className="font-semibold">Smart Insight</h3>
						</div>
						<p className="text-primary-foreground mb-4">
							Your assistant is most active between 11 AM - 2 PM, processing 43% of all tasks during
							this period.
						</p>
						<div className="flex justify-between items-center text-sm">
							<span className="text-primary-foreground opacity-80">Based on your data</span>
							<button className="flex items-center font-medium hover:opacity-80 transition-opacity">
								View details <ChevronRight className="h-4 w-4 ml-1" />
							</button>
						</div>
					</div>

					{/* Recent Activity */}
					<div className="bg-card rounded-xl border border-border p-5 shadow-sm">
						<div className="flex items-center justify-between mb-5">
							<h3 className="font-semibold text-foreground">Recent Activity</h3>
							<button className="text-sm text-primary font-medium hover:text-ring">View all</button>
						</div>
						<div className="space-y-4">
							{recentActivity.map((activity) => (
								<div
									key={activity.id}
									className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
								>
									<div
										className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary`}
									>
										{activity.type === "email" && <Mail className="h-4 w-4 text-chart-1" />}
										{activity.type === "slack" && (
											<MessageSquare className="h-4 w-4 text-chart-2" />
										)}
										{activity.type === "meeting" && <Video className="h-4 w-4 text-chart-3" />}
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
										<div className="flex items-center justify-between mt-1">
											<p className="text-xs text-muted-foreground">{activity.source}</p>
											<p className="text-xs text-muted-foreground opacity-70">{activity.time}</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Tasks Breakdown */}
					<div className="bg-card rounded-xl border border-border p-5 shadow-sm">
						<div className="flex items-center justify-between mb-5">
							<h3 className="font-semibold text-foreground">Task Breakdown</h3>
							<button className="p-1 rounded hover:bg-accent">
								<BarChart3 className="h-4 w-4 text-muted-foreground" />
							</button>
						</div>
						<div className="space-y-4">
							<div>
								<div className="flex justify-between items-center mb-1">
									<span className="text-sm font-medium text-muted-foreground">Completed</span>
									<span className="text-sm font-medium text-chart-2">38</span>
								</div>
								<div className="w-full bg-muted rounded-full h-2">
									<div className="bg-chart-2 h-2 rounded-full" style={{ width: "82%" }}></div>
								</div>
							</div>
							<div>
								<div className="flex justify-between items-center mb-1">
									<span className="text-sm font-medium text-muted-foreground">In Progress</span>
									<span className="text-sm font-medium text-chart-3">5</span>
								</div>
								<div className="w-full bg-muted rounded-full h-2">
									<div className="bg-chart-3 h-2 rounded-full" style={{ width: "10%" }}></div>
								</div>
							</div>
							<div>
								<div className="flex justify-between items-center mb-1">
									<span className="text-sm font-medium text-muted-foreground">Failed</span>
									<span className="text-sm font-medium text-destructive">3</span>
								</div>
								<div className="w-full bg-muted rounded-full h-2">
									<div className="bg-destructive h-2 rounded-full" style={{ width: "8%" }}></div>
								</div>
							</div>
						</div>
						<div className="mt-5 pt-4 border-t border-border">
							<div className="flex justify-between items-center">
								<span className="text-sm font-medium text-muted-foreground">Total Tasks</span>
								<span className="text-sm font-bold text-foreground">46</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}
