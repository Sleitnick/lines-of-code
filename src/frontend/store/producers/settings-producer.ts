import { createProducer } from "@rbxts/reflex";
import { SettingsState, initialSettingsState } from "frontend/util/settings";

function isStringEmptyIgnoreWhitespace(str: string) {
	return str.gsub("%s+", "")[0] === "";
}

export const settingsProducer = createProducer(initialSettingsState, {
	settingsAddExclusionPattern: (state, exclusionPattern: string) => ({
		...state,
		exclusionPatterns: [...state.exclusionPatterns, exclusionPattern],
	}),

	settingsChangeExclusionPattern: (state, exclusionPattern: string, index: number) => {
		const newState = {
			...state,
			exclusionPatterns: [...state.exclusionPatterns],
		};
		newState.exclusionPatterns[index] = exclusionPattern;
		return newState;
	},

	settingsRemoveExclusionPattern: (state, exclusionPatternIndex: number) => {
		const newState = { ...state, exclusionPatterns: [...state.exclusionPatterns] };
		newState.exclusionPatterns.remove(exclusionPatternIndex);
		return newState;
	},

	settingsRemoveEmptyExclusionPatterns: (state) => {
		const newState = { ...state };

		let removed = false;
		for (const i of $range(newState.exclusionPatterns.size() - 1, 0, -1)) {
			const pattern = newState.exclusionPatterns[i];
			if (isStringEmptyIgnoreWhitespace(pattern)) {
				newState.exclusionPatterns.remove(i);
				removed = true;
			}
		}

		if (removed) {
			// Force copy so selectors get signaled of change:
			newState.exclusionPatterns = [...newState.exclusionPatterns];
		}

		return newState;
	},

	settingsSetAll: (state, all: SettingsState) => ({
		...all,
	}),
});
