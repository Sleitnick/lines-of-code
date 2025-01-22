import React, { useBinding, useEffect, useState } from "@rbxts/react";
import { useThemeColor } from "frontend/hooks/use-theme";
import Label from "./Label";

interface CheckboxProps extends React.InstanceProps<Frame> {
	checked?: boolean;
	label?: string;
	toggled?: () => void;
}

const CHECK_ICON = "rbxassetid://129687445115853";

export default function Checkbox(props: CheckboxProps) {
	const checkboxProps = { ...props };
	delete checkboxProps.children;
	delete checkboxProps.checked;
	delete checkboxProps.label;
	delete checkboxProps.toggled;

	const bgColor = useThemeColor(Enum.StudioStyleGuideColor.Button);
	const bgColorHover = useThemeColor(Enum.StudioStyleGuideColor.Button, Enum.StudioStyleGuideModifier.Hover);
	const bgColorPressed = useThemeColor(Enum.StudioStyleGuideColor.Button, Enum.StudioStyleGuideModifier.Pressed);
	const borderColor = useThemeColor(Enum.StudioStyleGuideColor.ButtonBorder);
	const fgColor = useThemeColor(Enum.StudioStyleGuideColor.ButtonText);

	const [textBoundsX, setTextBoundsX] = useBinding(0);
	const [mouseState, setMouseState] = useBinding<"default" | "hover" | "pressed">("default");

	const [label, setLabel] = useState<TextLabel>();
	useEffect(() => {
		if (!label) return;

		const onTextBoundsChanged = () => {
			const bounds = label.TextBounds;
			setTextBoundsX(bounds.X);
		};

		onTextBoundsChanged();
		const conn = label.GetPropertyChangedSignal("TextBounds").Connect(onTextBoundsChanged);

		return () => {
			conn.Disconnect();
		};
	}, [label]);

	return (
		<frame Size={UDim2.fromOffset(100, 30)} BackgroundTransparency={1} {...checkboxProps}>
			<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
				<uilistlayout
					SortOrder={Enum.SortOrder.LayoutOrder}
					FillDirection={Enum.FillDirection.Horizontal}
					HorizontalAlignment={Enum.HorizontalAlignment.Left}
					Padding={new UDim(0, 10)}
				/>
				<imagelabel
					BackgroundColor3={mouseState.map((state) => {
						switch (state) {
							case "default":
								return bgColor;
							case "hover":
								return bgColorHover;
							case "pressed":
								return bgColorPressed;
						}
					})}
					Size={UDim2.fromScale(1, 1)}
					SizeConstraint={Enum.SizeConstraint.RelativeYY}
					Image={CHECK_ICON}
					ImageColor3={fgColor}
					ImageTransparency={props.checked ? 0 : 1}
				>
					<uicorner CornerRadius={new UDim(0, 4)} />
					<uistroke Color={borderColor} Thickness={1} ApplyStrokeMode={Enum.ApplyStrokeMode.Border} />
				</imagelabel>
				<Label
					ref={setLabel}
					Size={UDim2.fromScale(1, 1)}
					Text={props.label}
					TextXAlignment={Enum.TextXAlignment.Left}
				/>
			</frame>
			<imagebutton
				Size={textBoundsX.map((x) => new UDim2(0, x + 30, 1, 0))}
				BackgroundTransparency={1}
				AutoButtonColor={false}
				Image=""
				Event={{
					MouseEnter: () => setMouseState("hover"),
					MouseLeave: () => setMouseState("default"),
					MouseButton1Down: () => setMouseState("pressed"),
					MouseButton1Up: () => setMouseState("hover"),
					Activated: () => props.toggled?.(),
				}}
			/>
		</frame>
	);
}
