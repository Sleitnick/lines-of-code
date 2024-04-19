import { Trove } from "@rbxts/trove";
import { LineCounter } from "backend/line-counter";
import { config } from "config";
import { rootProducer } from "frontend/store";
import { UIController } from "frontend/ui-controller";
import { loadSettings, saveSettings } from "frontend/util/settings";

const toolbar = plugin.CreateToolbar(config.toolbarTitle);
const button = toolbar.CreateButton(config.pluginButtonId, config.pluginButtonTooltip, config.pluginButtonIcon);
button.ClickableWhenViewportHidden = true;

const pluginTrove = new Trove();
const lineCounter = new LineCounter();

let isOn = false;

function refreshStats() {
	if (rootProducer.getState().process.active) return Promise.resolve();
	rootProducer.processSetActive(true);

	return lineCounter
		.process(rootProducer.getState().settings.exclusionPatterns)
		.then((allScriptsInfo) => {
			rootProducer.processClearError();
			rootProducer.statsSetAll(allScriptsInfo);
		})
		.catch((err) => {
			rootProducer.processSetError(err);
			warn(err);
		})
		.finally(() => {
			rootProducer.processSetActive(false);
		});
}

function turnOn() {
	if (isOn) return;
	isOn = true;
	button.SetActive(true);
	rootProducer.settingsSetAll(loadSettings(plugin));
	UIController.show(plugin);

	// Save settings when settings change:
	pluginTrove.add(
		rootProducer.subscribe(
			(state) => state.settings,
			(newSettings, prevSettings) => {
				saveSettings(plugin, newSettings);
			},
		),
	);

	// Refresh stats when the stats page is shown:
	pluginTrove.add(
		rootProducer.subscribe(
			(state) => state.display.displayType,
			(displayType, prevDisplayType) => displayType !== prevDisplayType,
			(displayType) => {
				if (displayType === DisplayType.Stats) {
					refreshStats();
				}
			},
		),
	);

	pluginTrove.add(() => {
		isOn = false;
		button.SetActive(false);
		UIController.hide();
	});

	refreshStats();
}

function turnOff() {
	pluginTrove.clean();
}

button.Click.Connect(() => {
	if (isOn) {
		turnOff();
	} else {
		turnOn();
	}
});

UIController.requestHide.Connect(turnOff);
plugin.Unloading.Connect(turnOff);
