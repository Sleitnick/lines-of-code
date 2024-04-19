import React from "@rbxts/react";

export default function Container(props: React.InstanceProps<Frame>) {
	return <frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1} {...props} />;
}
