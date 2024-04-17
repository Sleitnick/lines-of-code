import React from "@rbxts/react";
import { useThemeColor } from "frontend/hooks/use-theme";
import Label from "./Label";

interface StatItemProps extends React.InstanceProps<Frame> {
	label?: string;
	value?: string;
}

export default function StatItem(props: StatItemProps) {
	const frameProps = { ...props };
	delete frameProps.label;
	delete frameProps.value;

	const fgColor = useThemeColor(Enum.StudioStyleGuideColor.MainText);

	return (
		<frame {...frameProps}>
			<Label
				Size={UDim2.fromScale(1, 1)}
				TextColor3={fgColor}
				Text={props.label}
				TextXAlignment={Enum.TextXAlignment.Left}
			/>
			<Label
				Size={UDim2.fromScale(1, 1)}
				TextColor3={fgColor}
				Text={props.value}
				TextXAlignment={Enum.TextXAlignment.Right}
				FontFace={Font.fromId(16658246179, Enum.FontWeight.Regular, Enum.FontStyle.Normal)}
			/>
		</frame>
	);
}
