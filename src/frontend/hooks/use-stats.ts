import { useMemo } from "@rbxts/react";
import { useRootSelector } from "frontend/store";

export interface ScriptData {
	count: number;
	lines: ScriptInfo["lines"];
}

interface Data {
	Total: ScriptData;
	ScriptLegacy: ScriptData;
	ScriptServer: ScriptData;
	ScriptClient: ScriptData;
	ScriptPlugin: ScriptData;
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

export function useStats() {
	const stats = useRootSelector((state) => state.stats.all);

	return useMemo<Data | undefined>(() => {
		if (!stats) return;

		const scriptDataTotal = createScriptData();
		const scriptDataLegacy = createScriptData();
		const scriptDataServer = createScriptData();
		const scriptDataClient = createScriptData();
		const scriptDataPlugin = createScriptData();
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
						case Enum.RunContext.Plugin: {
							scriptDataPlugin.count += 1;
							addLines(scriptDataPlugin.lines, info.lines);
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
			ScriptPlugin: scriptDataPlugin,
			LocalScript: scriptDataLocalScript,
			ModuleScript: scriptDataModuleScript,
		};
	}, [stats]);
}
