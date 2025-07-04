import { AppSidebar } from "@/components/app-sidebar"
import { AuthUserProvider } from "@/components/auth-user-provider"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { cookies } from "next/headers"

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const cookieStore = await cookies()
	const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
	return (
		<AuthUserProvider>
			<SidebarProvider defaultOpen={defaultOpen} className="h-full">
				<AppSidebar />
				<SidebarInset className="h-full">
					<SiteHeader title="TurboMode AI" />
					<div className="overflow-y-auto w-full h-full">{children}</div>
				</SidebarInset>
			</SidebarProvider>
		</AuthUserProvider>
	)
}
