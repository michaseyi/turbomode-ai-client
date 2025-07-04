import type { Metadata } from "next"
import { IBM_Plex_Sans, Spectral } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

const ibmPlexSans = IBM_Plex_Sans({
	variable: "--font-ibm-plex-sans",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"], // Regular, Medium, Semi-Bold, Bold
})

const spectral = Spectral({
	variable: "--font-spectral",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"], // Regular, Medium, Semi-Bold, Bold
})

export const metadata: Metadata = {
	title: "Turbomode AI - From conversations to action",
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${spectral.variable} antialiased h-dvh`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<>
						{children}
						<Toaster />
					</>
				</ThemeProvider>
			</body>
		</html>
	)
}
