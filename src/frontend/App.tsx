import React from "@rbxts/react";
import Container from "./components/Container";
import Label from "./components/Label";
import Padding from "./components/Padding";
import SettingsDisplay from "./displays/SettingsDisplay";
import StatsDisplay from "./displays/StatsDisplay";
import { useThemeColor } from "./hooks/use-theme";
import { useRootSelector } from "./store";

function Display() {
	const displayType = useRootSelector((state) => state.display.displayType);

	switch (displayType) {
		case DisplayType.Stats:
			return <StatsDisplay />;
		case DisplayType.Settings:
			return <SettingsDisplay />;
		default:
			return <></>;
	}
}

export default function App() {
	const bgColor = useThemeColor(Enum.StudioStyleGuideColor.MainBackground);
	const fgColor = useThemeColor(Enum.StudioStyleGuideColor.MainText);

	return (
		<frame Size={UDim2.fromScale(1, 1)} BackgroundColor3={bgColor} BorderSizePixel={0}>
			<Padding Padding={new UDim(0, 4)} />
			<Container key="Header" Size={new UDim2(1, 0, 0, 20)}>
				<Label
					Size={UDim2.fromScale(1, 1)}
					Text={"Lines of Code"}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextColor3={fgColor}
				/>
				<imagebutton
					BackgroundTransparency={1}
					Size={UDim2.fromOffset(16, 16)}
					Position={UDim2.fromScale(1, 0)}
					AnchorPoint={new Vector2(1, 0)}
					Image={"rbxassetid://15112361227"}
					ImageColor3={fgColor}
					ZIndex={10}
					Event={{
						MouseEnter: () => {},
						MouseLeave: () => {},
						Activated: () => {},
					}}
				/>
			</Container>
			<Container key="Display" Size={new UDim2(1, 0, 1, -25)} Position={UDim2.fromOffset(0, 25)}>
				<Display />
			</Container>
		</frame>
	);
}
