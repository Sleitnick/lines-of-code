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
			// TODO: Recount? Does this fire for every keystroke essentially?
		});
	}

	public async process(excludePatterns: string[], ignoreDuplicates: boolean) {
		let allScripts: LuaSourceContainer[] = [];

		for (const ancestor of ancestors) {
			for (const descendant of ancestor.GetDescendants()) {
				if (!descendant.IsA("LuaSourceContainer")) continue;

				// Check exclusion patterns:
				const fullName = descendant.GetFullName();
				let exclude = false;
				for (const excludePattern of excludePatterns) {
					if (fullName.match(excludePattern)[0] !== undefined) {
						exclude = true;
						break;
					}
				}
				if (exclude) continue;

				allScripts.push(descendant);
			}
		}

		if (ignoreDuplicates) {
			allScripts = await this.processDispatcher.filterDuplicates(allScripts);
		}

		return await this.processDispatcher.process(allScripts);
	}

	public destroy() {
		this.trove.destroy();
	}
}
