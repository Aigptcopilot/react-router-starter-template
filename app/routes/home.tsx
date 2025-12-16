import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { useAgentChat } from "@cloudflare/agents/ai-react";
import { useAgent } from "@cloudflare/agents/react";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "AI Agent Chat on Cloudflare" },
		{ name: "description", content: "Chat with your AI Agent!" },
	];
}

export function loader({ context }: Route.LoaderArgs) {
	return { message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE || "Hello from Cloudflare!" };
}

export default function Home({ loaderData }: Route.ComponentProps) {
	// اتصال به agent (name منحصر به فرد برای هر session، مثلاً random)
	const agentName = useState(() => crypto.randomUUID())[0];

	const agent = useAgent({
		agent: "my-chat-agent", // اسم class در worker
		name: agentName,
	});

	const { messages, input, handleInputChange, handleSubmit, isLoading } = useAgentChat({
		agent,
	});

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col">
			<div className="p-8 text-center">
				<Welcome message={loaderData.message} />
			</div>

			<div className="flex-1 max-w-2xl mx-auto w-full p-4">
				<h2 className="text-2xl font-bold mb-4">AI Agent Chat</h2>
				<div className="bg-white rounded-lg shadow-lg p-4 h-96 overflow-y-auto mb-4">
					{messages.map((msg: any, i: number) => (
						<div key={i} className={`mb-4 ${msg.role === "user" ? "text-right" : "text-left"}`}>
							<span className={`inline-block p-3 rounded-lg ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
								{msg.content}
							</span>
						</div>
					))}
					{isLoading && <div className="text-gray-500">در حال فکر کردن...</div>}
				</div>

				<form onSubmit={handleSubmit} className="flex gap-2">
					<input
						type="text"
						value={input}
						onChange={handleInputChange}
						placeholder="پیامت رو بنویس..."
						className="flex-1 p-3 border rounded-lg"
						disabled={isLoading}
					/>
					<button type="submit" disabled={isLoading} className="px-6 py-3 bg-blue-600 text-white rounded-lg">
						ارسال
					</button>
				</form>
			</div>
		</div>
	);
}
