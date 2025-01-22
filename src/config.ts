export const config = {
	toolbarTitle: "Lines of Code",

	pluginButtonId: "Lines of Code",
	pluginButtonTooltip: "View lines of code within your experience",
	pluginButtonIcon: "rbxassetid://91634687315875",

	pluginGuiTitle: "Lines of Code",
	widgetInfo: new DockWidgetPluginGuiInfo(Enum.InitialDockState.Right, false, true, 600, 300, 300, 200),

	fontRegular: Font.fromEnum(Enum.Font.BuilderSans),
	fontRegularBold: Font.fromEnum(Enum.Font.BuilderSansBold),
	fontMono: Font.fromId(16658246179, Enum.FontWeight.Regular, Enum.FontStyle.Normal),
} as const;
