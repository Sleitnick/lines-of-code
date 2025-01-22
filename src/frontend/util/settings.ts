export interface SettingsState {
	readonly exclusionPatterns: string[];
	readonly ignoreDuplicates: boolean;
}

const KEY = "LinesOfCodePluginSettings";

function getKey() {
	return `${KEY}_${game.GameId}`;
}

export const initialSettingsState: SettingsState = {
	exclusionPatterns: [],
	ignoreDuplicates: false,
};

export function loadSettings(plugin: Plugin): SettingsState {
	const loadedSettings = plugin.GetSetting(getKey());

	if (typeIs(loadedSettings, "table")) {
		const reconciled = {
			...initialSettingsState,
			...loadedSettings,
		};

		// Remove unused keys:
		const removeKey: string[] = [];
		for (const [key] of pairs(reconciled)) {
			if (!(key in initialSettingsState)) {
				removeKey.push(key);
			}
		}
		for (const key of removeKey) {
			delete (reconciled as Record<string, unknown>)[key];
		}

		return reconciled;
	}

	return { ...initialSettingsState };
}

export function saveSettings(plugin: Plugin, settingsState: SettingsState) {
	plugin.SetSetting(getKey(), settingsState);
}
