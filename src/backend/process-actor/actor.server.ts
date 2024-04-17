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
