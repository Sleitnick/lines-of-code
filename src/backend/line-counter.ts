import { Trove } from "@rbxts/trove";
import { ancestors } from "backend/ancestors";
import { ProcessDispatcher } from "backend/process-dispatcher";

const ScriptEditorService = game.GetService("ScriptEditorService");

export class LineCounter {
	private readonly trove = new Trove();
	private readonly processDispatcher = new ProcessDispatcher();

	constructor() {
		this.trove.add(this.processDispatcher);

		this.trove.connect(ScriptEditorService.TextDocumentDidChange, (document, changes) => {
			if (document.IsCommandBar()) return;
			// TODO
		});
	}

	public process() {
		const allScripts: LuaSourceContainer[] = [];
		for (const ancestor of ancestors) {
			for (const descendant of ancestor.GetDescendants()) {
				if (!descendant.IsA("LuaSourceContainer")) continue;
				allScripts.push(descendant);
			}
		}

		return this.processDispatcher.process(allScripts);
	}

	public destroy() {
		this.trove.destroy();
	}
}
