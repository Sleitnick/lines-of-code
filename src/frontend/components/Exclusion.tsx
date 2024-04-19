import React from "@rbxts/react";
import { config } from "config";
import { useRootProducer } from "frontend/store";
import Button from "./Button";
import TextBox from "./TextBox";

interface ExclusionProps {
	pattern: string;
	index: number;
}

const placeholderTexts = ["MyFolder.node_modules$", "IgnoreThisName$", "^ServerScriptService.Ignore.This.Folder$"];

export default function Exclusion(props: ExclusionProps) {
	const producer = useRootProducer();

	return (
		<frame LayoutOrder={props.index} Size={new UDim2(1, 0, 0, 25)} BackgroundTransparency={1}>
			<uisizeconstraint MaxSize={new Vector2(500, math.huge)} />
			<TextBox
				Size={new UDim2(1, -70, 1, 0)}
				FontFace={config.fontMono}
				Text={props.pattern}
				PlaceholderText={placeholderTexts[props.index % placeholderTexts.size()]}
				Event={{
					FocusLost: (rbx) => {
						const text = rbx.Text;
						if (text !== props.pattern) {
							producer.settingsChangeExclusionPattern(text, props.index);
						}
					},
				}}
			/>
			<Button
				Size={new UDim2(0, 60, 1, 0)}
				Position={UDim2.fromScale(1, 0)}
				AnchorPoint={new Vector2(1, 0)}
				Text={"Delete"}
				Event={{
					Activated: () => {
						producer.settingsRemoveExclusionPattern(props.index);
					},
				}}
			/>
		</frame>
	);
}
