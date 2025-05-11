"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormEventHandler } from "react"
import { api } from "@/lib/api"
import { useMutation } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { ApiDataResponse, ApiError, LoginBody, LoginResponse } from "@/types/api"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
	const router = useRouter()
	const params = useSearchParams()

	const localAuthMutation = useMutation<ApiDataResponse<LoginResponse>, ApiError, LoginBody>({
		mutationKey: ["local-auth"],
		mutationFn: async (payload) => {
			return await api.auth.login(payload)
		},
		onError: (err) => {
			toast(err.message, {
				action: {
					label: "Undo",
					onClick: () => 0,
				},
			})
		},
		onSuccess: (data) => {
			toast(data.message, {
				action: {
					label: "Undo",
					onClick: () => 0,
				},
			})
			const next = params.get("next")
			router.push(next || "/")
		},
	})

	const googleAuthMutation = useMutation({
		mutationKey: ["google-auth"],
		mutationFn: async () => {
			return await api.auth.googleAuth()
		},
		onError: (err) => {
			toast(err.message, {
				action: {
					label: "Undo",
					onClick: () => 0,
				},
			})
		},
		onSuccess: (data) => {
			toast(data.message, {
				action: {
					label: "Undo",
					onClick: () => 0,
				},
			})
			const next = params.get("next")
			router.push(next || "/")
		},
	})

	const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault()

		const form = e.target as HTMLFormElement
		const email = form.email.value as string
		const password = form.password.value as string

		localAuthMutation.mutate({ email, password })
	}

	const handleGoogleSignIn = async () => {
		googleAuthMutation.mutate()
	}

	const disableAuthButton = googleAuthMutation.isPending || localAuthMutation.isPending

	return (
		<form onSubmit={handleFormSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-2xl font-bold">Login to your account</h1>
				<p className="text-balance text-sm text-muted-foreground">
					Enter your email below to login to your account
				</p>
			</div>
			<div className="grid gap-6">
				<div className="grid gap-2">
					<Label htmlFor="email">Email</Label>
					<Input id="email" type="email" placeholder="m@example.com" required />
				</div>
				<div className="grid gap-2">
					<div className="flex items-center">
						<Label htmlFor="password">Password</Label>
						<a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
							Forgot your password?
						</a>
					</div>
					<Input id="password" type="password" required />
				</div>
				<Button disabled={disableAuthButton} type="submit" className="w-full">
					{localAuthMutation.isPending ? (
						<Loader2 className="!h-6 !w-6 animate-spin text-muted-foreground" />
					) : (
						<>Login</>
					)}
				</Button>
				<div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
					<span className="relative z-10 bg-background px-2 text-muted-foreground">
						Or continue with
					</span>
				</div>
				<Button
					disabled={disableAuthButton}
					onClick={handleGoogleSignIn}
					type="button"
					variant="outline"
					className="w-full"
				>
					{googleAuthMutation.isPending ? (
						<Loader2 className="!h-6 !w-6 animate-spin text-muted-foreground" />
					) : (
						<>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
								<path
									d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
									fill="currentColor"
								/>
							</svg>
							Login with Google
						</>
					)}
				</Button>
			</div>
			<div className="text-center text-sm">
				Don&apos;t have an account?{" "}
				<a href="#" className="underline underline-offset-4">
					Sign up
				</a>
			</div>
		</form>
	)
}
