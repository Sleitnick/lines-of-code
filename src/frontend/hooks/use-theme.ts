import { useEffect, useMemo, useState } from "@rbxts/react";

export function useTheme() {
	const [theme, setTheme] = useState(settings().Studio.Theme);

	useEffect(() => {
		const conn = settings().Studio.ThemeChanged.Connect(() => {
			setTheme(settings().Studio.Theme);
		});

		return () => {
			conn.Disconnect();
		};
	}, []);

	return theme;
}

export function useThemeColor(color: Enum.StudioStyleGuideColor, modifier?: Enum.StudioStyleGuideModifier) {
	const theme = useTheme();

	return useMemo(() => {
		return theme.GetColor(color, modifier);
	}, [theme, color, modifier]);
}
