import React from "@rbxts/react";
import { config } from "config";
import { useThemeColor } from "frontend/hooks/use-theme";

interface ButtonProps extends React.InstanceProps<TextButton> {
	icon?: string;
	iconSize?: UDim2;
}

function ButtonIcon(props: { icon?: string; iconSize?: UDim2 }) {
	if (props.icon === undefined || props.icon === "") {
		return <></>;
	}
	return (
		<imagelabel
			Image={props.icon}
			Size={props.iconSize ?? UDim2.fromScale(1, 1)}
			Position={UDim2.fromScale(0.5, 0.5)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={1}
		/>
	);
}

export default function Button(props: ButtonProps) {
	const buttonProps = { ...props };
	const children = buttonProps.children;
	delete buttonProps.children;
	delete buttonProps.icon;
	delete buttonProps.iconSize;

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
			{...buttonProps}
		>
			<uicorner CornerRadius={new UDim(0, 8)} />
			<uistroke Color={borderColor} Thickness={1} ApplyStrokeMode={Enum.ApplyStrokeMode.Border} />
			<ButtonIcon icon={props.icon} iconSize={props.iconSize} />
			{children}
		</textbutton>
	);
}
