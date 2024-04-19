import { createProducer } from "@rbxts/reflex";

export interface DisplayState {
	displayType: DisplayType;
}

export const initialDisplayState: DisplayState = {
	displayType: DisplayType.Stats,
};

export const displayProducer = createProducer(initialDisplayState, {
	displaySetType: (state, displayType: DisplayType) => ({
		...state,
		displayType,
	}),
});
