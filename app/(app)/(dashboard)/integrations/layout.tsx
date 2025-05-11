export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		// <div className="flex flex-col items-center container mx-auto max-w-5xl p-3 sm:p-6">
		<div>{children}</div>
	)
}
