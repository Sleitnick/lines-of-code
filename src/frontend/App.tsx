import React from "@rbxts/react";
import Label from "./components/Label";
import Padding from "./components/Padding";
import StatItem from "./components/StatItem";
import { useThemeColor } from "./hooks/use-theme";
import { useRootSelector } from "./store";

export default function App() {
	const bgColor = useThemeColor(Enum.StudioStyleGuideColor.MainBackground);
	const fgColor = useThemeColor(Enum.StudioStyleGuideColor.MainText);

	const isProcessActive = useRootSelector((state) => state.process.active);
	const stats = useRootSelector((state) => state.stats.all);

	const loading = isProcessActive || !stats;

	return (
		<frame Size={UDim2.fromScale(1, 1)} BackgroundColor3={bgColor} BorderSizePixel={0}>
			<Padding Padding={new UDim(0, 4)} />
			<Label Visible={loading} Size={new UDim2(1, 0, 0, 20)} TextColor3={fgColor} Text={"Loading..."} />
			<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1} Visible={!loading}>
				<uilistlayout FillDirection={Enum.FillDirection.Vertical} SortOrder={Enum.SortOrder.LayoutOrder} />
				<StatItem
					Size={new UDim2(1, 0, 0, 16)}
					LayoutOrder={1}
					BackgroundTransparency={1}
					label={"Total"}
					value={`${stats?.lines.total ?? "..."}`}
				/>
				<StatItem
					Size={new UDim2(1, 0, 0, 16)}
					LayoutOrder={2}
					BackgroundTransparency={1}
					label={"Code"}
					value={`${stats?.lines.code ?? "..."}`}
				/>
				<StatItem
					Size={new UDim2(1, 0, 0, 16)}
					LayoutOrder={3}
					BackgroundTransparency={1}
					label={"Comment"}
					value={`${stats?.lines.comment ?? "..."}`}
				/>
				<StatItem
					Size={new UDim2(1, 0, 0, 16)}
					LayoutOrder={4}
					BackgroundTransparency={1}
					label={"Blank"}
					value={`${stats?.lines.blank ?? "..."}`}
				/>
			</frame>
		</frame>
	);
}
