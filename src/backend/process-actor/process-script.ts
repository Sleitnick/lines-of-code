//!native

function isLineEmpty(str: string) {
	for (const i of $range(1, str.size())) {
		const b = str.byte(i, i)[0];
		if (b !== 9 && b !== 10 && b !== 13 && b !== 32) {
			return false;
		}
	}
	return true;
}

function isLineSingleLineComment(str: string) {
	return str.find("^%s*%-%-")[0] !== undefined;
}

function isLineMultiLineCommentBegin(str: string) {
	const [start, _, equalSigns] = str.find("^%s*%-%-%[([=]*)%[");
	if (start === undefined) {
		return undefined;
	}

	return {
		start,
		equalSigns: (equalSigns as string).size(),
	};
}

function isLineMultiLineCommentEnd(str: string, numEqualSigns: number) {
	const [_, stop] = str.find(`%]${string.rep("=", numEqualSigns)}%]`);
	if (stop === undefined) {
		return undefined;
	}

	return {
		stop,
	};
}

export function processScript(s: LuaSourceContainer): ScriptInfo {
	const source = (s as Script).Source;

	let code = 0;
	let comment = 0;
	let blank = 0;

	let multilineComment = false;
	let multilineNumEqualSigns = 0;

	for (let line of source.split("\n")) {
		let multilineIdx = 0;

		// If we're already in a multiline comment, check if it ends:
		if (multilineComment) {
			const multilineEnd = isLineMultiLineCommentEnd(line, multilineNumEqualSigns);
			if (multilineEnd) {
				multilineComment = false;
				multilineIdx = multilineEnd.stop + 1;
			}
		}

		// Iterate over starting/stopping multiline comments within the same line:
		while (true) {
			const subLine = string.sub(line, multilineIdx, line.size());
			const multilineBegin = isLineMultiLineCommentBegin(subLine);
			if (multilineBegin) {
				multilineComment = true;
				multilineNumEqualSigns = multilineBegin.equalSigns;
				const multilineEnd = isLineMultiLineCommentEnd(subLine, multilineBegin.equalSigns);
				if (multilineEnd) {
					multilineComment = false;
					multilineIdx = multilineEnd.stop + 1;
					continue;
				}
			}
			break;
		}

		// If we're still in a multiline comment, nothing else to do:
		if (multilineComment) {
			comment += 1;
			continue;
		}

		// If we ended a multiline comment, trim off that part:
		if (multilineIdx !== 0) {
			line = string.sub(line, multilineIdx, line.size());
		}

		if (isLineEmpty(line)) {
			if (multilineIdx !== 0) {
				comment += 1;
			} else {
				blank += 1;
			}
		} else if (isLineSingleLineComment(line)) {
			comment += 1;
		} else {
			code += 1;
		}
	}

	return {
		className: s.ClassName as ScriptClassName,
		context: s.IsA("Script") ? s.RunContext : Enum.RunContext.Legacy,
		lines: {
			code,
			comment,
			blank,
			total: code + comment + blank,
		},
		characters: source.size(),
	};
}
