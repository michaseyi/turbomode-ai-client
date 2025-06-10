import { Box, Mic, Paperclip, Send, Square } from "lucide-react"
import { FormEventHandler, forwardRef } from "react"

type ChatInputProp = {
	onSubmit: (message: string) => void
	disabled: boolean
}

forwardRef

export const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProp>(
	({ onSubmit, disabled }, ref) => {
		const handleFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
			e.preventDefault()

			const form = e.target as HTMLFormElement
			const newChatInput = form.newChatInput.value as string
			form.newChatInput.value = ""
			onSubmit(newChatInput)
		}

		return (
			<form
				autoComplete="off"
				className="items-center gap-2 border rounded-4xl shadow-sm bg-background relative z-50"
				onSubmit={handleFormSubmit}
			>
				<div>
					<div>
						<textarea
							ref={ref}
							id="newChatInput"
							name="newChatInput"
							autoFocus={true}
							required={true}
							rows={1}
							placeholder={"Ask anything"}
							className="resize-none flex-grow px-5 py-4 pb-2 rounded-4xl focus:ring-0 outline-none w-full"
						/>
					</div>
					<div className="flex justify-between w-full p-2.5 pt-0">
						<div>
							<button
								type="button"
								className="p-2 text-muted-foreground hover:text-primary rounded-full hover:bg-accent"
							>
								<Paperclip className="h-5 w-5" />
							</button>
							<button
								type="button"
								className="p-2 text-muted-foreground hover:text-primary rounded-full hover:bg-accent"
							>
								<Mic className="h-5 w-5" />
							</button>
						</div>
						<div>
							{!disabled ? (
								<button
									disabled={disabled}
									type="submit"
									className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-60"
								>
									<Send className="h-5 w-5" />
								</button>
							) : (
								<button
									type="button"
									className="p-2 bg-primary rounded-full hover:bg-primary/90 transition-colors items-center"
								>
									<div className="h-5 w-5 bg-primary-foreground rounded-sm"></div>
								</button>
							)}
						</div>
					</div>
				</div>
			</form>
		)
	}
)
