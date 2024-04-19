import React, { useEffect, useState } from "@rbxts/react";
import { LocalizationService } from "@rbxts/services";
import Container from "frontend/components/Container";
import Label from "frontend/components/Label";
import StatRow from "frontend/components/StatRow";
import { ScriptData, useStats } from "frontend/hooks/use-stats";
import { useThemeColor } from "frontend/hooks/use-theme";
import { useRootSelector } from "frontend/store";
import { localizationTable } from "frontend/util/locale";

const MIN_WIDTH = 600;

function columns(label: string, data: ScriptData | undefined) {
	if (!data) {
		return [label, "0", "0", "0", "0", "0"];
	}
	return [
		label,
		localeNumberFormat(data.count),
		localeNumberFormat(data.lines.code),
		localeNumberFormat(data.lines.comment),
		localeNumberFormat(data.lines.blank),
		localeNumberFormat(data.lines.total),
	];
}

function localeNumberFormat(n: number) {
	return localizationTable.GetTranslator(LocalizationService.RobloxLocaleId).FormatByKey("number", [n]).sub(1, -4);
}

export default function StatsDisplay(props: React.InstanceProps<Frame>) {
	const fgColor = useThemeColor(Enum.StudioStyleGuideColor.MainText);

	const isProcessActive = useRootSelector((state) => state.process.active);
	const stats = useRootSelector((state) => state.stats.all);

	const loading = isProcessActive || !stats;

	const scriptData = useStats();

	const [scrollingFrame, setScrollingFrame] = useState<ScrollingFrame>();
	const [uiTable, setUiTable] = useState<UITableLayout>();

	useEffect(() => {
		if (!scrollingFrame || !uiTable) return;

		const onSizeChanged = () => {
			const size = uiTable.AbsoluteContentSize;
			if (size.X <= MIN_WIDTH) {
				scrollingFrame.CanvasSize = UDim2.fromOffset(MIN_WIDTH, 0);
			} else {
				scrollingFrame.CanvasSize = UDim2.fromScale(1, 1);
			}
		};

		onSizeChanged();
		const conn = uiTable.GetPropertyChangedSignal("AbsoluteContentSize").Connect(onSizeChanged);
		return () => {
			conn.Disconnect();
		};
	}, [scrollingFrame, uiTable]);

	return (
		<Container {...props}>
			<Label Visible={loading} Size={new UDim2(1, 0, 0, 20)} TextColor3={fgColor} Text={"Loading..."} />
			<scrollingframe
				ref={setScrollingFrame}
				Visible={!loading}
				Size={UDim2.fromScale(1, 1)}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				ScrollBarThickness={8}
			>
				<uitablelayout
					ref={setUiTable}
					FillDirection={Enum.FillDirection.Vertical}
					SortOrder={Enum.SortOrder.LayoutOrder}
					FillEmptySpaceColumns={true}
					FillEmptySpaceRows={true}
				/>
				<StatRow
					Size={new UDim2(1, 0, 0, 16)}
					LayoutOrder={1}
					BackgroundTransparency={1}
					header={true}
					columnValues={["Type", "Count", "Code", "Comment", "Blank", "Total"]}
				/>
				<StatRow
					Size={new UDim2(1, 0, 0, 16)}
					LayoutOrder={2}
					BackgroundTransparency={1}
					columnValues={columns("Script (Legacy)", scriptData?.ScriptLegacy)}
				/>
				<StatRow
					Size={new UDim2(1, 0, 0, 16)}
					LayoutOrder={3}
					BackgroundTransparency={1}
					columnValues={columns("Script (Server)", scriptData?.ScriptServer)}
				/>
				<StatRow
					Size={new UDim2(1, 0, 0, 16)}
					LayoutOrder={4}
					BackgroundTransparency={1}
					columnValues={columns("Script (Client)", scriptData?.ScriptClient)}
				/>
				<StatRow
					Size={new UDim2(1, 0, 0, 16)}
					LayoutOrder={5}
					BackgroundTransparency={1}
					columnValues={columns("LocalScript", scriptData?.LocalScript)}
				/>
				<StatRow
					Size={new UDim2(1, 0, 0, 16)}
					LayoutOrder={6}
					BackgroundTransparency={1}
					columnValues={columns("ModuleScript", scriptData?.ModuleScript)}
				/>
				<StatRow
					Size={new UDim2(1, 0, 0, 16)}
					LayoutOrder={7}
					BackgroundTransparency={1}
					columnValues={columns("Total", scriptData?.Total)}
				/>
			</scrollingframe>
		</Container>
	);
}
