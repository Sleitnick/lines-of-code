import React, { useBinding } from "@rbxts/react";
import Container from "./components/Container";
import Label from "./components/Label";
import Padding from "./components/Padding";
import SettingsDisplay from "./displays/SettingsDisplay";
import StatsDisplay from "./displays/StatsDisplay";
import { useThemeColor } from "./hooks/use-theme";
import { useRootProducer, useRootSelector } from "./store";

const MAX_WIDTH = 900;

function Display() {
	const displayType = useRootSelector((state) => state.display.displayType);

	return (
		<>
			<StatsDisplay Visible={displayType === DisplayType.Stats} />
			<SettingsDisplay Visible={displayType === DisplayType.Settings} />
		</>
	);
}

export default function App() {
	const bgColor = useThemeColor(Enum.StudioStyleGuideColor.MainBackground);
	const fgColor = useThemeColor(Enum.StudioStyleGuideColor.MainText);
	const fgHoverColor = useThemeColor(Enum.StudioStyleGuideColor.LinkText);
	const [settingsBtnHover, setSettingsBtnHover] = useBinding(false);

	const producer = useRootProducer();

	return (
		<frame Size={UDim2.fromScale(1, 1)} BackgroundColor3={bgColor} BorderSizePixel={0}>
			<frame
				Size={UDim2.fromScale(1, 1)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={new Vector2(0.5, 0.5)}
			>
				<uisizeconstraint MaxSize={new Vector2(MAX_WIDTH, math.huge)} />
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
						ImageColor3={settingsBtnHover.map((hover) => (hover ? fgHoverColor : fgColor))}
						ZIndex={10}
						Event={{
							MouseEnter: () => {
								setSettingsBtnHover(true);
							},
							MouseLeave: () => {
								setSettingsBtnHover(false);
							},
							Activated: () => {
								if (producer.getState().display.displayType === DisplayType.Settings) {
									producer.displaySetType(DisplayType.Stats);
									producer.settingsRemoveEmptyExclusionPatterns();
								} else {
									producer.displaySetType(DisplayType.Settings);
								}
							},
						}}
					/>
				</Container>
				<Container key="Display" Size={new UDim2(1, 0, 1, -25)} Position={UDim2.fromOffset(0, 25)}>
					<Display />
				</Container>
			</frame>
		</frame>
	);
}
