//!native

import { processScript } from "./process-script";

const actor = script.GetActor()!;
const complete = script.Parent!.WaitForChild("complete") as BindableEvent;

actor.BindToMessageParallel("Process", (sharedTable: SharedTable, id: string, scripts: LuaSourceContainer[]) => {
	const processTable: ScriptInfo[] = table.create(scripts.size());

	for (const i of $range(0, scripts.size() - 1)) {
		const s = scripts[i];
		const info = processScript(s);
		processTable[i] = info;
	}

	sharedTable[id] = new SharedTable(processTable);

	task.synchronize();
	complete.Fire(id);
});

actor.BindToMessageParallel("FilterDuplicates", (id: string, scripts: LuaSourceContainer[]) => {
	const scriptsSeen = new Set<string>();
	const uniqueScripts: LuaSourceContainer[] = table.create(scripts.size());
	const nonUniqueScriptsByName = new Map<string, LuaSourceContainer[]>();

	// Find unique and potentially non-unique scripts by name:
	for (const s of scripts) {
		const name = s.Name;
		if (scriptsSeen.has(name)) {
			let list = nonUniqueScriptsByName.get(name);
			if (list === undefined) {
				list = [];
				nonUniqueScriptsByName.set(name, list);
			}
			list.push(s);
		} else {
			scriptsSeen.add(name);
			uniqueScripts.push(s);
		}
	}

	// Check the non-unique list and compare source code:
	for (const [name, list] of nonUniqueScriptsByName) {
		const dup = new Set<LuaSourceContainer>();

		for (const i of $range(0, list.size() - 1)) {
			const script0 = list[i];
			if (dup.has(script0)) {
				continue;
			}

			const source0 = (script0 as Script).Source;

			uniqueScripts.push(script0);

			for (const j of $range(i + 1, list.size() - 1)) {
				const script1 = list[j];
				const source1 = (script1 as Script).Source;
				if (source0 === source1) {
					dup.add(script1);
				}
			}
		}
	}

	task.synchronize();
	complete.Fire(id, uniqueScripts);
});
