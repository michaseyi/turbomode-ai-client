import { LoginForm } from "@/components/login-form"
import LoginBanner from "@/assets/images/banner.png"

import TurboModeAI from "@/assets/images/logo.png"
import Image from "next/image"
export default function LoginPage() {
	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="flex flex-col gap-4 p-6 md:p-10">
				<div className="flex justify-center gap-2 md:justify-start">
					<a href="#" className="flex items-center gap-2 font-medium">
						<Image src={TurboModeAI} alt="TurboMode AI" width={24} />
						TurboMode AI
					</a>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-xs">
						<LoginForm />
					</div>
				</div>
			</div>
			<div className="relative hidden bg-muted lg:block">
				<Image
					src={LoginBanner}
					width={2000}
					alt="Image"
					className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.3] dark:grayscale"
				/>
			</div>
		</div>
	)
}
