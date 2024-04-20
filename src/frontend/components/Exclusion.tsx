import React, { useEffect, useState } from "@rbxts/react";
import { config } from "config";
import { useRootProducer } from "frontend/store";
import Button from "./Button";
import TextBox from "./TextBox";

const Selection = game.GetService("Selection");

interface ExclusionProps {
	pattern: string;
	index: number;
}

const placeholderTexts = ["node_modules", "IgnoreThisName", "^ServerScriptService.Ignore.This"];

export default function Exclusion(props: ExclusionProps) {
	const producer = useRootProducer();

	const [focused, setFocused] = useState(false);
	const [textBox, setTextBox] = useState<TextBox>();

	useEffect(() => {
		if (!focused || !textBox) return;

		let lastPattern = "";

		const conn = Selection.SelectionChanged.Connect(() => {
			const s = Selection.Get()[0];
			if (!s || textBox.Text !== lastPattern) return;
			const fullName = s.GetFullName();
			const pattern = `^${fullName}`;
			lastPattern = pattern;
			textBox.Text = lastPattern;
			textBox.CaptureFocus();
			textBox.CursorPosition = lastPattern.size() + 1;
		});

		return () => {
			conn.Disconnect();
		};
	}, [focused, textBox]);

	return (
		<frame LayoutOrder={props.index} Size={new UDim2(1, 0, 0, 25)} BackgroundTransparency={1}>
			<uisizeconstraint MaxSize={new Vector2(500, math.huge)} />
			<TextBox
				ref={setTextBox}
				Size={new UDim2(1, -30, 1, 0)}
				FontFace={config.fontMono}
				Text={props.pattern}
				TextTruncate={Enum.TextTruncate.AtEnd}
				PlaceholderText={placeholderTexts[props.index % placeholderTexts.size()]}
				Event={{
					Focused: () => {
						setFocused(true);
					},
					FocusLost: (rbx) => {
						setFocused(false);
						const text = rbx.Text;
						if (text !== props.pattern) {
							producer.settingsChangeExclusionPattern(text, props.index);
						}
					},
				}}
			/>
			<Button
				Size={UDim2.fromScale(1, 1)}
				SizeConstraint={Enum.SizeConstraint.RelativeYY}
				Position={UDim2.fromScale(1, 0)}
				AnchorPoint={new Vector2(1, 0)}
				Text={""}
				icon={"rbxassetid://5516413280"}
				iconSize={UDim2.fromOffset(16, 16)}
				Event={{
					Activated: () => {
						producer.settingsRemoveExclusionPattern(props.index);
					},
				}}
			/>
		</frame>
	);
}
