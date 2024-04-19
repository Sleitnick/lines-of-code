import React from "@rbxts/react";
import { story } from "frontend/util/story";
import StatsDisplay from "./StatsDisplay";

export = story((props) => {
	const linesBlank = 2345;
	const linesComment = 457;
	const linesCode = 43534;
	const linesTotal = linesBlank + linesComment + linesCode;

	props.producer.statsSetAll({
		lines: {
			blank: linesBlank,
			code: linesCode,
			comment: linesComment,
			total: linesTotal,
		},
		scripts: [
			{
				characters: 0,
				className: "Script",
				context: Enum.RunContext.Legacy,
				lines: {
					blank: linesBlank,
					code: linesCode,
					comment: linesComment,
					total: linesTotal,
				},
			},
		],
	});

	return <StatsDisplay />;
});
