import { createProducer } from "@rbxts/reflex";

export interface ProcessState {
	active: boolean;
	error: string | undefined;
}

const initialProcessState: ProcessState = {
	active: false,
	error: undefined,
};

export const processProducer = createProducer(initialProcessState, {
	processSetActive: (state, active: boolean) => ({
		...state,
		active,
	}),

	processSetError: (state, err: string) => ({
		...state,
		error: err,
	}),

	processClearError: (state) => ({
		...state,
		error: undefined,
	}),
});
