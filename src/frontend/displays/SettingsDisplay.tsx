import React, { useBinding, useEffect, useState } from "@rbxts/react";
import { config } from "config";
import Button from "frontend/components/Button";
import Checkbox from "frontend/components/Checkbox";
import Container from "frontend/components/Container";
import Exclusion from "frontend/components/Exclusion";
import Label from "frontend/components/Label";
import Padding from "frontend/components/Padding";
import { useRootProducer, useRootSelector } from "frontend/store";

function IgnorePatternsList(props: React.InstanceProps<Frame>) {
	const producer = useRootProducer();

	const exclusionPatterns = useRootSelector((state) => state.settings.exclusionPatterns);

	const [uiList, setUiList] = useState<UIListLayout>();
	const [canvasSize, setCanvasSize] = useBinding(UDim2.fromOffset(0, 0));

	useEffect(() => {
		if (!uiList) return;

		const onSizeChanged = () => {
			const size = uiList.AbsoluteContentSize;
			setCanvasSize(UDim2.fromOffset(0, size.Y + 2));
		};

		onSizeChanged();
		const conn = uiList.GetPropertyChangedSignal("AbsoluteContentSize").Connect(onSizeChanged);

		return () => {
			conn.Disconnect();
		};
	}, [uiList]);

	return (
		<frame {...props}>
			<scrollingframe
				Size={UDim2.fromScale(1, 1)}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				ScrollBarThickness={8}
				CanvasSize={canvasSize}
			>
				<uilistlayout
					ref={setUiList}
					FillDirection={Enum.FillDirection.Vertical}
					SortOrder={Enum.SortOrder.LayoutOrder}
					Padding={new UDim(0, 8)}
				/>
				<Padding Padding={new UDim(0, 1)} />
				{exclusionPatterns.map((pattern, i) => (
					<Exclusion pattern={pattern} index={i} />
				))}
				{exclusionPatterns.size() === 0 ? (
					<Label Size={new UDim2(1, 0, 0, 16)} Text={"(None)"} TextXAlignment={Enum.TextXAlignment.Left} />
				) : (
					<></>
				)}
				<Button
					LayoutOrder={100000}
					Size={UDim2.fromOffset(150, 30)}
					Text={"Add Ignore Pattern"}
					Event={{
						Activated: () => {
							producer.settingsAddExclusionPattern("");
						},
					}}
				/>
			</scrollingframe>
		</frame>
	);
}

export default function SettingsDisplay(props: React.InstanceProps<Frame>) {
	const producer = useRootProducer();

	const ignoreDuplicates = useRootSelector((state) => state.settings.ignoreDuplicates);

	return (
		<Container {...props}>
			<Checkbox
				Size={new UDim2(1, 0, 0, 16)}
				Position={new UDim2(0, 0, 0, 0)}
				label={"Ignore Duplicates"}
				checked={ignoreDuplicates}
				toggled={() => {
					producer.settingsSetIgnoreDuplicates(!ignoreDuplicates);
				}}
			/>
			<Label
				Size={new UDim2(1, 0, 0, 16)}
				Position={new UDim2(0, 0, 0, 25)}
				TextXAlignment={Enum.TextXAlignment.Left}
				Text={"Ignore Patterns:"}
				FontFace={config.fontRegularBold}
			/>
			<IgnorePatternsList
				Size={new UDim2(1, 0, 1, -60)}
				Position={new UDim2(0, 0, 0, 50)}
				BackgroundTransparency={1}
			/>
			<Label
				Size={new UDim2(1, 0, 0, 16)}
				Position={UDim2.fromScale(0, 1)}
				AnchorPoint={new Vector2(0, 1)}
				TextXAlignment={Enum.TextXAlignment.Left}
				Text={"Any Luau string pattern can be used"}
			/>
		</Container>
	);
}
