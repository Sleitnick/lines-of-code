import React from "@rbxts/react";
import { config } from "config";
import { useThemeColor } from "frontend/hooks/use-theme";

export default function Label(props: React.InstanceProps<TextLabel>) {
	const defaultTextColor = useThemeColor(Enum.StudioStyleGuideColor.MainText);
	return (
		<textlabel
			BackgroundTransparency={1}
			FontFace={config.fontRegular}
			TextScaled={true}
			TextColor3={defaultTextColor}
			{...props}
		/>
	);
}
