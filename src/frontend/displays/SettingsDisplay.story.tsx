import React from "@rbxts/react";
import { story } from "frontend/util/story";
import SettingsDisplay from "./SettingsDisplay";

export = story((props) => {
	props.producer.settingsAddExclusionPattern("^ReplicatedStorage.node_modules");

	return <SettingsDisplay />;
});
