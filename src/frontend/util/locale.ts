import { LocalizationService } from "@rbxts/services";

export const localizationTable = new Instance("LocalizationTable");

localizationTable.SetEntries([
	{
		Key: "number",
		Source: "{1:num}",
		Values: {
			[LocalizationService.RobloxLocaleId]: "{1:num}",
		} as unknown as Map<string, string>,
	} as LocalizationEntry,
]);
