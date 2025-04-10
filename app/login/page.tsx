import { GalleryVerticalEnd } from "lucide-react"
import Logo from "@/assets/images/logo.png"

import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default function LoginPage() {
	return (
		<div className="bg-sidebar flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<a href="#" className="flex items-center gap-2 self-center font-medium">
					<Image src={Logo} className="w-5 h-5" width={100} alt="" />
					Turbomode AI
				</a>
				<LoginForm />
			</div>
		</div>
	)
}
