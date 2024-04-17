import { createProducer } from "@rbxts/reflex";

export interface StatsState {
	all: AllScriptsInfo | undefined;
	lastUpdated: number;
}

export const initialStatsState: StatsState = {
	all: undefined,
	lastUpdated: 0,
};

export const statsProducer = createProducer(initialStatsState, {
	statsSetAll: (state, all: AllScriptsInfo) => ({
		...state,
		all,
		lastUpdated: os.clock(),
	}),
});
