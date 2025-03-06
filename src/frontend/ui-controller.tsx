import React, { StrictMode } from "@rbxts/react";
import { ReflexProvider } from "@rbxts/react-reflex";
import ReactRoblox, { createPortal, createRoot } from "@rbxts/react-roblox";
import Signal from "@rbxutil/signal";
import { config } from "config";
import App from "./App";
import { rootProducer } from "./store";

export class UIController {
	/** Fired when user requests to close the PluginGui. */
	public static readonly requestHide = new Signal<void>();

	private static pluginGui: PluginGui | undefined;
	private static root: ReactRoblox.Root | undefined;

	public static getPluginGui(plugin: Plugin) {
		if (!this.pluginGui) {
			this.pluginGui = plugin.CreateDockWidgetPluginGui("LinesOfCode", config.widgetInfo);
			this.pluginGui.Name = "LinesOfCode";
			this.pluginGui.Title = config.pluginGuiTitle;
			this.pluginGui.ResetOnSpawn = false;
			this.pluginGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;
			this.pluginGui.BindToClose(() => {
				this.requestHide.Fire();
			});
		}

		return this.pluginGui;
	}

	/** Show the PluginGui. */
	public static show(plugin: Plugin) {
		const pluginGui = this.getPluginGui(plugin);

		if (!this.root) {
			this.root = createRoot(new Instance("Folder"));
			this.root.render(
				<StrictMode>
					{createPortal(
						<ReflexProvider producer={rootProducer}>
							<App />
						</ReflexProvider>,
						pluginGui,
					)}
				</StrictMode>,
			);
		}

		pluginGui.Enabled = true;
	}

	/** Hide the PluginGui. */
	public static hide() {
		if (!this.pluginGui) return;

		this.pluginGui.Enabled = false;
	}

	public static destroy() {
		this.root?.unmount();
		this.pluginGui?.Destroy();

		this.root = undefined;
		this.pluginGui = undefined;
	}
}
