import { Trove } from "@rbxts/trove";
import { LineCounter } from "backend/line-counter";
import { config } from "config";
import { rootProducer } from "frontend/store";
import { UIController } from "frontend/ui-controller";

const toolbar = plugin.CreateToolbar(config.toolbarTitle);
const button = toolbar.CreateButton(config.pluginButtonId, config.pluginButtonTooltip, config.pluginButtonIcon);
button.ClickableWhenViewportHidden = true;

const pluginTrove = new Trove();
const lineCounter = new LineCounter();

let isOn = false;

function turnOn() {
	if (isOn) return;
	isOn = true;
	button.SetActive(true);
	UIController.show(plugin);

	pluginTrove.add(() => {
		isOn = false;
		button.SetActive(false);
		UIController.hide();
	});

	if (!rootProducer.getState().process.active) {
		rootProducer.processSetActive(true);
		lineCounter
			.process()
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
