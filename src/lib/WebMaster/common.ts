import Papa from "papaparse";

export type Sheet = "schedule" | "vendors" | "metadata";

const BASE_URL: URL = new URL("https://docs.google.com/spreadsheets/d/e/2PACX-1vSJ5qqmI3pg5pJEcyBfQtrFqMJ7Bb5nEDjOIIgfqZ5_L9KEjDdOWnN-7O4KyrOW4_KCXDIVh-VAClPP/pub?output=csv");
const CACHEBUST: boolean = true;
const SHEET_ID_MAP: Record<Sheet, number> = {
	schedule: 0,
	vendors: 1964861081,
	metadata: 625855329,
};

function getSheetUrl(sheet: Sheet): URL {
	const sheetUrl: URL = new URL(BASE_URL);
	sheetUrl.searchParams.set("gid", SHEET_ID_MAP[sheet].toString());

	if (CACHEBUST) 
		sheetUrl.searchParams.set("cachebust", Date.now().toString());
	return sheetUrl;
}

export async function getSheetData<T>(sheet: Sheet): Promise<Array<T>> {
	try {
		const response: Response = await fetch(getSheetUrl(sheet));

		if (!response.ok) 
			throw new Error(`Fetch failed: ${response.status} - ${response.statusText}`);
		const text: string = await response.text();
		const parsedData: Papa.ParseResult<T> = Papa.parse(text, {
			header: true,
			skipEmptyLines: true,
			transformHeader: (header: string) => header.trim()
		});
		return parsedData.data as Array<T>;
	} catch (err: any) {
		console.error(`Error fetching ${sheet} data:`, err);
		throw err;
	}
}