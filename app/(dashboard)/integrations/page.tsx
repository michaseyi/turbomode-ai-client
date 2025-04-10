import Gmail from "@/assets/images/gmail.png"
import Slack from "@/assets/images/slack.png"
import Zoom from "@/assets/images/zoom.png"

import Image, { StaticImageData } from "next/image"
import Link from "next/link"

const integrations = [
	{
		name: "Gmail",
		description:
			"Integrate your Gmail account to enable the AI assistant to read, organize, and extract insights from your emails.",
		icon: Gmail,
		path: "/integrations/gmail",
	},

	{
		name: "Slack",
		description:
			"Connect your Slack workspace to allow the AI assistant to analyze conversations and provide actionable insights.",
		icon: Slack,
		path: "/integrations/gmail",
	},
	{
		name: "Zoom",
		description:
			"Link your Zoom account to let the AI assistant summarize meetings and extract key points from recordings.",
		icon: Zoom,
		path: "/integrations/gmail",
	},
]

function IntegrationCard({
	integration,
}: {
	integration: { name: string; description: string; icon: string | StaticImageData }
}) {
	return (
		<div className="py-5 px-6 rounded-lg flex bg-card items-center gap-5  hover:bg-accent transition-bg duration-300">
			<Image
				src={integration.icon}
				alt={integration.name}
				width={200}
				className="w-14 h-14 sm:w-20 sm:h-20"
			/>

			<div className="flex flex-col">
				<span className="font-semibold text-lg text-foreground">{integration.name}</span>
				<p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
					{integration.description}
				</p>
			</div>
		</div>
	)
}

function Integrations() {
	return (
		<div className="gap-2 grid md:grid-cols-2">
			{integrations.map((integration) => (
				<Link href={integration.path} key={integration.name}>
					<IntegrationCard integration={integration} />
				</Link>
			))}
		</div>
	)
}

export default function IntegrationsPage() {
	return (
		<>
			<div className="text-center mb-8">
				<h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-4">Integrations</h2>
				<p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
					Connect data sources to enhance your AI assistant's capabilities. Choose an integration to
					get started.
				</p>
				<hr className="mt-6 border-muted" />
			</div>

			<div className="mt-10">
				<Integrations />
			</div>
		</>
	)
}
