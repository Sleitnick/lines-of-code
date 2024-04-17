import React from "@rbxts/react";

interface PaddingProps extends React.InstanceProps<UIPadding> {
	Padding?: UDim | React.Binding<UDim>;
}

export default function Padding(props: PaddingProps) {
	props.PaddingBottom ??= props.Padding;
	props.PaddingTop ??= props.Padding;
	props.PaddingLeft ??= props.Padding;
	props.PaddingRight ??= props.Padding;

	delete props.Padding;

	return <uipadding {...props} />;
}
