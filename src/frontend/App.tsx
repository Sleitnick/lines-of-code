import React, { useMemo } from "@rbxts/react";
import { LocalizationService } from "@rbxts/services";
import Label from "./components/Label";
import Padding from "./components/Padding";
import StatRow from "./components/StatRow";
import { useThemeColor } from "./hooks/use-theme";
import { useRootSelector } from "./store";

const localizationTable = new Instance("LocalizationTable");
localizationTable.SetEntries([
	{
		Key: "number",
		Source: "{1:num}",
		Values: {
			[LocalizationService.RobloxLocaleId]: "{1:num}",
		} as unknown as Map<string, string>,
	} as LocalizationEntry,
]);

interface ScriptData {
	count: number;
	lines: ScriptInfo["lines"];
}

interface Data {
	Total: ScriptData;
	ScriptLegacy: ScriptData;
	ScriptServer: ScriptData;
	ScriptClient: ScriptData;
	LocalScript: ScriptData;
	ModuleScript: ScriptData;
}

function createScriptData(): ScriptData {
	return {
		count: 0,
		lines: {
			blank: 0,
			code: 0,
			comment: 0,
			total: 0,
		},
	};
}

function addLines(to: ScriptInfo["lines"], from: ScriptInfo["lines"]) {
	to.blank += from.blank;
	to.comment += from.comment;
	to.code += from.code;
	to.total += from.total;
}

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

export default function App() {
	const bgColor = useThemeColor(Enum.StudioStyleGuideColor.MainBackground);
	const fgColor = useThemeColor(Enum.StudioStyleGuideColor.MainText);

	const isProcessActive = useRootSelector((state) => state.process.active);
	const stats = useRootSelector((state) => state.stats.all);

	const loading = isProcessActive || !stats;

	const scriptData = useMemo<Data | undefined>(() => {
		if (!stats) return;

		const scriptDataTotal = createScriptData();
		const scriptDataLegacy = createScriptData();
		const scriptDataServer = createScriptData();
		const scriptDataClient = createScriptData();
		const scriptDataLocalScript = createScriptData();
		const scriptDataModuleScript = createScriptData();

		for (const info of stats.scripts) {
			scriptDataTotal.count += 1;
			addLines(scriptDataTotal.lines, info.lines);

			switch (info.className) {
				case "Script": {
					switch (info.context) {
						case Enum.RunContext.Legacy: {
							scriptDataLegacy.count += 1;
							addLines(scriptDataLegacy.lines, info.lines);
							break;
						}
						case Enum.RunContext.Server: {
							scriptDataServer.count += 1;
							addLines(scriptDataServer.lines, info.lines);
							break;
						}
						case Enum.RunContext.Client: {
							scriptDataClient.count += 1;
							addLines(scriptDataClient.lines, info.lines);
							break;
						}
					}
					break;
				}
				case "LocalScript": {
					scriptDataLocalScript.count += 1;
					addLines(scriptDataLocalScript.lines, info.lines);
					break;
				}
				case "ModuleScript": {
					scriptDataModuleScript.count += 1;
					addLines(scriptDataModuleScript.lines, info.lines);
					break;
				}
			}
		}

		return {
			Total: scriptDataTotal,
			ScriptLegacy: scriptDataLegacy,
			ScriptServer: scriptDataServer,
			ScriptClient: scriptDataClient,
			LocalScript: scriptDataLocalScript,
			ModuleScript: scriptDataModuleScript,
		};
	}, [stats]);

	return (
		<frame Size={UDim2.fromScale(1, 1)} BackgroundColor3={bgColor} BorderSizePixel={0}>
			<Padding Padding={new UDim(0, 4)} />
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
		</frame>
	);
}
