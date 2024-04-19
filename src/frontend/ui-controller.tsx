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

	/** Show the PluginGui. */
	public static show(plugin: Plugin) {
		if (!this.pluginGui) {
			this.pluginGui = plugin.CreateDockWidgetPluginGui("LinesOfCode", config.widgetInfo);
			this.pluginGui.Name = "LinesOfCode";
			this.pluginGui.Title = config.pluginGuiTitle;
			this.pluginGui.ResetOnSpawn = false;
			this.pluginGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;
			this.pluginGui.BindToClose(() => {
				this.requestHide.Fire();
			});

			this.pluginGui.PluginDragEntered.Connect((dragData) => {
				print("DRAG_ENTERED", dragData);
			});

			this.pluginGui.PluginDragDropped.Connect((dragData) => {
				print("DRAG_DROPPED", dragData);
			});
		}

		if (!this.root) {
			this.root = createRoot(new Instance("Folder"));
			this.root.render(
				<StrictMode>
					{createPortal(
						<ReflexProvider producer={rootProducer}>
							<App />
						</ReflexProvider>,
						this.pluginGui,
					)}
				</StrictMode>,
			);
		}

		this.pluginGui.Enabled = true;
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
