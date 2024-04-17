import React from "@rbxts/react";

export default function Label(props: React.InstanceProps<TextLabel>) {
	return (
		<textlabel
			BackgroundTransparency={1}
			FontFace={Font.fromEnum(Enum.Font.BuilderSans)}
			TextScaled={true}
			{...props}
		/>
	);
}
