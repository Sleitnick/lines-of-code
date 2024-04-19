import React from "@rbxts/react";
import Button from "frontend/components/Button";
import Container from "frontend/components/Container";
import Exclusion from "frontend/components/Exclusion";
import Label from "frontend/components/Label";
import { useRootProducer, useRootSelector } from "frontend/store";

export default function SettingsDisplay(props: React.InstanceProps<Frame>) {
	const producer = useRootProducer();

	const exclusionPatterns = useRootSelector((state) => state.settings.exclusionPatterns);

	return (
		<Container {...props}>
			<frame Size={new UDim2(1, 0, 1, -30)} BackgroundTransparency={1}>
				<uilistlayout
					FillDirection={Enum.FillDirection.Vertical}
					SortOrder={Enum.SortOrder.LayoutOrder}
					Padding={new UDim(0, 8)}
				/>
				{exclusionPatterns.map((pattern, i) => (
					<Exclusion pattern={pattern} index={i} />
				))}
				<Button
					LayoutOrder={100000}
					Size={UDim2.fromOffset(150, 30)}
					Text={"Add Exclusion"}
					Event={{
						Activated: () => {
							producer.settingsAddExclusionPattern("");
						},
					}}
				/>
			</frame>
			<frame
				Size={new UDim2(1, 0, 0, 16)}
				Position={UDim2.fromScale(0, 1)}
				AnchorPoint={new Vector2(0, 1)}
				BackgroundTransparency={1}
			>
				<Label
					Size={UDim2.fromScale(1, 1)}
					TextXAlignment={Enum.TextXAlignment.Left}
					Text={"Any Lua string pattern can be used"}
				/>
			</frame>
		</Container>
	);
}
