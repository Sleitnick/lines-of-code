import React from "@rbxts/react";
import { LocalizationService } from "@rbxts/services";
import Container from "frontend/components/Container";
import Label from "frontend/components/Label";
import StatRow from "frontend/components/StatRow";
import { ScriptData, useStats } from "frontend/hooks/use-stats";
import { useThemeColor } from "frontend/hooks/use-theme";
import { useRootSelector } from "frontend/store";
import { localizationTable } from "frontend/util/locale";

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

export default function StatsDisplay() {
	const bgColor = useThemeColor(Enum.StudioStyleGuideColor.MainBackground);
	const fgColor = useThemeColor(Enum.StudioStyleGuideColor.MainText);

	const isProcessActive = useRootSelector((state) => state.process.active);
	const stats = useRootSelector((state) => state.stats.all);

	const loading = isProcessActive || !stats;

	const scriptData = useStats();

	return (
		<Container>
			<Label Visible={loading} Size={new UDim2(1, 0, 0, 20)} TextColor3={fgColor} Text={"Loading..."} />
			<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1} Visible={!loading}>
				<uitablelayout
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
			</frame>
		</Container>
	);
}
