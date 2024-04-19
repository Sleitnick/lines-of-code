import React from "@rbxts/react";
import { config } from "config";
import { useThemeColor } from "frontend/hooks/use-theme";

interface ButtonProps extends React.InstanceProps<TextButton> {}

export default function Button(props: ButtonProps) {
	const children = props.children;
	delete props.children;

	const bgColor = useThemeColor(Enum.StudioStyleGuideColor.Button);
	const borderColor = useThemeColor(Enum.StudioStyleGuideColor.ButtonBorder);
	const fgColor = useThemeColor(Enum.StudioStyleGuideColor.ButtonText);

	return (
		<textbutton
			Size={UDim2.fromOffset(100, 30)}
			BackgroundColor3={bgColor}
			TextColor3={fgColor}
			TextSize={16}
			FontFace={config.fontRegular}
			{...props}
		>
			<uicorner CornerRadius={new UDim(0, 8)} />
			<uistroke Color={borderColor} Thickness={1} ApplyStrokeMode={Enum.ApplyStrokeMode.Border} />
			{children}
		</textbutton>
	);
}
