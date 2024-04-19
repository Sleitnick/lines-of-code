import { createProducer } from "@rbxts/reflex";
import { SettingsState, initialSettingsState } from "frontend/util/settings";

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

	settingsSetAll: (state, all: SettingsState) => ({
		...all,
	}),
});
