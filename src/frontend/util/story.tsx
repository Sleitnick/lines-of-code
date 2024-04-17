import React, { StrictMode } from "@rbxts/react";
import { ReflexProvider } from "@rbxts/react-reflex";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { Trove } from "@rbxts/trove";
import { RootProducer, rootProducer } from "frontend/store";

export interface StoryProps {
	producer: RootProducer;
	trove: Trove;
}

export function story(Component: React.FunctionComponent<StoryProps>) {
	return (target: GuiObject) => {
		const root = createRoot(new Instance("Folder"));

		const producer = rootProducer.clone();
		const trove = new Trove();

		root.render(
			createPortal(
				<StrictMode>
					<ReflexProvider producer={producer}>
						<Component producer={producer} trove={trove} />
					</ReflexProvider>
				</StrictMode>,
				target,
			),
		);

		return () => {
			trove.clean();
		};
	};
}
