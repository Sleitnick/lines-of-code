//!native

import { HttpService } from "@rbxts/services";

const MAX_SCRIPTS_PER_ACTOR = 10;
const MAX_PROCESS_TIME_BEFORE_YIELD = 10 / 1000;

export class ProcessDispatcher {
	private destroyed = false;

	/** Process the given scripts. */
	public async process(scripts: LuaSourceContainer[]) {
		const actorPool: Actor[] = [];
		for (const actor of script.Parent!.WaitForChild("actors").GetChildren()) {
			if (!actor.IsA("Actor")) continue;
			actorPool.push(actor);
		}

		const sharedTable = new SharedTable();
		scripts = table.clone(scripts);

		// Get scripts to process into groups to marshal over to the actors:
		const scriptGroups: LuaSourceContainer[][] = [];
		while (scripts.size() > 0) {
			const processScripts: LuaSourceContainer[] = table.create(MAX_SCRIPTS_PER_ACTOR);
			for (const _ of $range(1, MAX_SCRIPTS_PER_ACTOR)) {
				const s = scripts.pop();
				if (!s) break;
				processScripts.push(s);
			}
			scriptGroups.push(processScripts);
		}

		return new Promise<AllScriptsInfo>((resolve, reject) => {
			const thread = coroutine.running();

			let processStart = os.clock();
			const tasksTotal = scriptGroups.size();
			let tasksDone = 0;

			let awaitingEnd = false;
			let waitingForProcessTime = false;

			const scriptData: AllScriptsInfo = {
				lines: {
					blank: 0,
					code: 0,
					comment: 0,
					total: 0,
				},
				scripts: [],
			};

			for (const processScripts of scriptGroups) {
				if (this.destroyed) break;

				if (os.clock() - processStart > MAX_PROCESS_TIME_BEFORE_YIELD) {
					waitingForProcessTime = true;
					task.wait();
					waitingForProcessTime = false;
					processStart = os.clock();
				}

				// Get or wait for available actor:
				let actor = actorPool.pop() as Actor;
				if (actor === undefined) {
					actor = coroutine.yield() as unknown as Actor;
				}
				const id = HttpService.GenerateGUID(false);

				// Handle actor completion:
				const complete = actor.FindFirstChild("complete") as BindableEvent;
				const completeConn = complete.Event.Connect((completeId: string) => {
					if (completeId !== id) return;
					completeConn.Disconnect();
					if (this.destroyed) {
						// actor.Destroy();
					} else if (coroutine.status(thread) === "suspended" && !awaitingEnd && !waitingForProcessTime) {
						task.spawn(thread, actor);
					} else {
						actorPool.push(actor);
					}

					const timeoutThread = task.delay(5, () => {
						task.cancel(waitForDataThread);
					});

					const waitForDataThread = task.spawn(() => {
						let data = sharedTable[completeId] as SharedTable;
						while (data === undefined) {
							task.wait();
							data = sharedTable[completeId] as SharedTable;
						}
						task.cancel(timeoutThread);
						for (const i of $range(0, processScripts.size() - 1)) {
							scriptData.scripts.push(data[i] as unknown as ScriptInfo);
						}
						tasksDone += 1;
						if (
							scripts.size() === 0 &&
							tasksDone === tasksTotal &&
							coroutine.status(thread) === "suspended"
						) {
							task.spawn(thread);
						}
					});
				});

				// Send info to the actor:
				actor.SendMessage("Process", sharedTable, id, processScripts);
			}

			if (tasksDone < tasksTotal) {
				awaitingEnd = true;
				coroutine.yield();
			}

			if (this.destroyed) {
				reject("destroyed");
			}

			for (const data of scriptData.scripts) {
				scriptData.lines.blank += data.lines.blank;
				scriptData.lines.code += data.lines.code;
				scriptData.lines.comment += data.lines.comment;
				scriptData.lines.total += data.lines.total;
			}

			resolve(scriptData);
		});
	}

	public destroy() {
		this.destroyed = true;
	}
}
