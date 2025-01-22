import React, { useBinding, useEffect, useState } from "@rbxts/react";
import { LocalizationService } from "@rbxts/services";
import Container from "frontend/components/Container";
import StatRow from "frontend/components/StatRow";
import { ScriptData, useStats } from "frontend/hooks/use-stats";
import { localizationTable } from "frontend/util/locale";

const MIN_WIDTH = 600;

function columns(label: string, data: ScriptData | undefined) {
	if (!data) {
		return [label, "...", "...", "...", "...", "..."];
	}
	return [
		label,
		localeNumberFormat(data.count),
		localeNumberFormat(data.lines.code),
		localeNumberFormat(data.lines.comment),
		localeNumberFormat(data.lines.blank),
		localeNumberFormat(data.lines.total),
	];
}

function localeNumberFormat(n: number) {
	return localizationTable.GetTranslator(LocalizationService.RobloxLocaleId).FormatByKey("number", [n]).sub(1, -4);
}

export default function StatsDisplay(props: React.InstanceProps<Frame>) {
	const scriptData = useStats();

	const [uiTable, setUiTable] = useState<UITableLayout>();
	const [canvasSize, setCanvasSize] = useBinding(UDim2.fromOffset(0, 0));

	useEffect(() => {
		if (!uiTable) return;

		const onSizeChanged = () => {
			const size = uiTable.AbsoluteContentSize;
			if (size.X <= MIN_WIDTH) {
				setCanvasSize(UDim2.fromOffset(MIN_WIDTH, size.Y));
			} else {
				setCanvasSize(new UDim2(1, 0, 0, size.Y));
			}
		};

		onSizeChanged();
		const conn = uiTable.GetPropertyChangedSignal("AbsoluteContentSize").Connect(onSizeChanged);
		return () => {
			conn.Disconnect();
		};
	}, [uiTable]);

	return (
		<Container {...props}>
			<scrollingframe
				Size={UDim2.fromScale(1, 1)}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				ScrollBarThickness={8}
				CanvasSize={canvasSize}
				VerticalScrollBarInset={Enum.ScrollBarInset.Always}
			>
				<uitablelayout
					ref={setUiTable}
					FillDirection={Enum.FillDirection.Vertical}
					SortOrder={Enum.SortOrder.LayoutOrder}
					FillEmptySpaceColumns={true}
					FillEmptySpaceRows={false}
				/>
				<StatRow
					Size={new UDim2(1, 0, 0, 16)}
					LayoutOrder={1}
					BackgroundTransparency={1}
					header={true}
					columnValues={["Type", "Count", "Code", "Comment", "Blank", "Total"]}
				/>
				<StatRow
					Size={new UDim2(1, 0, 0, 16)}
					LayoutOrder={2}
					BackgroundTransparency={1}
					columnValues={columns("Script (Legacy)", scriptData?.ScriptLegacy)}
				/>
				<StatRow
					Size={new UDim2(1, 0, 0, 16)}
					LayoutOrder={3}
					BackgroundTransparency={1}
					columnValues={columns("Script (Server)", scriptData?.ScriptServer)}
				/>
				<StatRow
					Size={new UDim2(1, 0, 0, 16)}
					LayoutOrder={4}
					BackgroundTransparency={1}
					columnValues={columns("Script (Client)", scriptData?.ScriptClient)}
				/>
				<StatRow
					Size={new UDim2(1, 0, 0, 16)}
					LayoutOrder={5}
					BackgroundTransparency={1}
					columnValues={columns("Script (Plugin)", scriptData?.ScriptPlugin)}
				/>
				<StatRow
					Size={new UDim2(1, 0, 0, 16)}
					LayoutOrder={6}
					BackgroundTransparency={1}
					columnValues={columns("LocalScript", scriptData?.LocalScript)}
				/>
				<StatRow
					Size={new UDim2(1, 0, 0, 16)}
					LayoutOrder={7}
					BackgroundTransparency={1}
					columnValues={columns("ModuleScript", scriptData?.ModuleScript)}
				/>
				<StatRow
					Size={new UDim2(1, 0, 0, 16)}
					LayoutOrder={8}
					BackgroundTransparency={1}
					columnValues={columns("Total", scriptData?.Total)}
				/>
			</scrollingframe>
		</Container>
	);
}
