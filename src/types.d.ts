type ScriptClassName = "Script" | "LocalScript" | "ModuleScript";

interface ScriptInfoLines {
	code: number;
	comment: number;
	blank: number;
	total: number;
}

interface ScriptInfo {
	className: ScriptClassName;
	context: Enum.RunContext;
	lines: ScriptInfoLines;
	characters: number;
}

interface AllScriptsInfo {
	lines: ScriptInfoLines;
	scripts: ScriptInfo[];
}
