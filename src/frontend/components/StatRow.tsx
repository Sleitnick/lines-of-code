import React from "@rbxts/react";
import { useThemeColor } from "frontend/hooks/use-theme";
import Label from "./Label";
import Padding from "./Padding";

interface StatRowProps extends React.InstanceProps<Frame> {
	header?: boolean;
	columnValues?: string[];
}

export default function StatRow(props: StatRowProps) {
	const frameProps = { ...props };
	delete frameProps.header;
	delete frameProps.columnValues;

	const fgColor = useThemeColor(Enum.StudioStyleGuideColor.MainText);

	const bgColor = useThemeColor(
		((props.LayoutOrder as number) ?? 0) % 2 === 0
			? Enum.StudioStyleGuideColor.Border
			: Enum.StudioStyleGuideColor.MainBackground,
	);

	return (
		<frame {...frameProps}>
			<uisizeconstraint MaxSize={new Vector2(math.huge, 24)} />
			{(props.columnValues ?? []).map((value, i) => (
				<Label
					Size={UDim2.fromScale(0.1, 1)}
					TextColor3={fgColor}
					Text={value}
					TextXAlignment={i === 0 ? Enum.TextXAlignment.Left : Enum.TextXAlignment.Right}
					FontFace={
						props.header
							? Font.fromEnum(Enum.Font.BuilderSansBold)
							: i === 0
								? Font.fromEnum(Enum.Font.BuilderSans)
								: Font.fromId(16658246179, Enum.FontWeight.Regular, Enum.FontStyle.Normal)
					}
					LayoutOrder={i}
					BackgroundTransparency={0}
					BorderSizePixel={0}
					BackgroundColor3={bgColor}
				>
					<Padding Padding={new UDim(0, 4)} />
				</Label>
			))}
		</frame>
	);
}
