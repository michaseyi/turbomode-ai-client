import { Layout as PageLayout } from "@/components/layout"

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<PageLayout>
			<div>{children}</div>
		</PageLayout>
	)
}
