export type Sheet = "schedule" | "vendors" | "metadata";

const BASE_URL: URL = new URL("https://docs.google.com/spreadsheets/d/e/2PACX-1vSJ5qqmI3pg5pJEcyBfQtrFqMJ7Bb5nEDjOIIgfqZ5_L9KEjDdOWnN-7O4KyrOW4_KCXDIVh-VAClPP/pub?output=csv");
const CACHEBUST: boolean = true;

const SheetIdMap: Record<Sheet, number> = {
	schedule: 0,
	vendors: 1964861081,
	metadata: 625855329,
};

export function getSheetUrl(sheet: Sheet): URL {
	const sheetUrl: URL = new URL(BASE_URL);
	sheetUrl.searchParams.set("gid", SheetIdMap[sheet].toString());

	if (CACHEBUST) 
		sheetUrl.searchParams.set("cachebust", Date.now().toString());
	return sheetUrl;
}
