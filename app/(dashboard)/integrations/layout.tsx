export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return <div className="container mx-auto max-w-5xl p-6 lg:p-8">{children}</div>
}
