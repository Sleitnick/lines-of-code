import { UseProducerHook, UseSelectorHook, useProducer, useSelector } from "@rbxts/react-reflex";
import { InferState, combineProducers } from "@rbxts/reflex";
import { processProducer } from "./producers/process-producer";
import { statsProducer } from "./producers/stats-producer";

export type RootProducer = typeof rootProducer;
export type RootState = InferState<RootProducer>;

export const rootProducer = combineProducers({
	process: processProducer,
	stats: statsProducer,
});

export const useRootProducer: UseProducerHook<RootProducer> = useProducer;
export const useRootSelector: UseSelectorHook<RootProducer> = useSelector;
