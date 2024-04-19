import React from "@rbxts/react";
import { config } from "config";
import { useThemeColor } from "frontend/hooks/use-theme";
import Padding from "./Padding";

interface TextBoxProps extends React.InstanceProps<TextBox> {}

export default function TextBox(props: TextBoxProps) {
	const children = props.children;
	delete props.children;

	const bgColor = useThemeColor(Enum.StudioStyleGuideColor.InputFieldBackground);
	const borderColor = useThemeColor(Enum.StudioStyleGuideColor.InputFieldBorder);
	const textColor = useThemeColor(Enum.StudioStyleGuideColor.MainText);
	const placeholderTextColor = useThemeColor(
		Enum.StudioStyleGuideColor.MainText,
		Enum.StudioStyleGuideModifier.Disabled,
	);

	return (
		<textbox
			ClearTextOnFocus={false}
			BackgroundColor3={bgColor}
			TextColor3={textColor}
			TextXAlignment={Enum.TextXAlignment.Left}
			TextSize={16}
			PlaceholderColor3={placeholderTextColor}
			FontFace={config.fontRegular}
			{...props}
		>
			<Padding PaddingLeft={new UDim(0, 8)} PaddingRight={new UDim(0, 8)} />
			<uicorner CornerRadius={new UDim(0, 8)} />
			<uistroke Color={borderColor} Thickness={1} ApplyStrokeMode={Enum.ApplyStrokeMode.Border} />
			{children}
		</textbox>
	);
}
