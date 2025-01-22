import React from "@rbxts/react";
import { config } from "config";
import { useThemeColor } from "frontend/hooks/use-theme";

export default React.forwardRef((props: React.InstanceProps<TextLabel>, ref: React.Ref<TextLabel>) => {
	const defaultTextColor = useThemeColor(Enum.StudioStyleGuideColor.MainText);
	return (
		<textlabel
			ref={ref}
			BackgroundTransparency={1}
			FontFace={config.fontRegular}
			TextScaled={true}
			TextColor3={defaultTextColor}
			{...props}
		/>
	);
});
