import Papa from "papaparse";

export interface ScheduleEntry {
	title: string;
	startTime: string;
	duration: string;
	platform: string;
	channel: string;
	description: string;
	day: string;
}

export interface ScheduleMetadata {
	threadId?: string;
	panelFormUrl?: string;
	vendorFormUrl?: string;
}

export async function getSchedule(): Promise<Array<ScheduleEntry>> {
	const SHEET_URL: string = `https://docs.google.com/spreadsheets/d/e/2PACX-1vSJ5qqmI3pg5pJEcyBfQtrFqMJ7Bb5nEDjOIIgfqZ5_L9KEjDdOWnN-7O4KyrOW4_KCXDIVh-VAClPP/pub?output=csv&cachebust=${Date.now()}`;
	console.log("Fetching schedule from:", SHEET_URL);

	try {
		const response: Response = await fetch(SHEET_URL);

		if (!response.ok) throw new Error("Google Sheet fetch failed");
		const csvText: string = await response.text();
		const parsedData: Papa.ParseResult<ScheduleEntry> = Papa.parse(csvText, {
			header: true,
			skipEmptyLines: true,
			transformHeader: (header: string) => header.trim(),
		});

		return parsedData.data as Array<ScheduleEntry>;
	} catch (err) {
		console.error("Schedule Error:", err);
		return [];
	}
}

export async function getMetadata(): Promise<ScheduleMetadata> {
	const META_URL: string = `https://docs.google.com/spreadsheets/d/e/2PACX-1vSJ5qqmI3pg5pJEcyBfQtrFqMJ7Bb5nEDjOIIgfqZ5_L9KEjDdOWnN-7O4KyrOW4_KCXDIVh-VAClPP/pub?gid=625855329&output=csv&cachebust=${Date.now()}`;

	try {
		const response: Response = await fetch(META_URL);

		if (!response.ok) throw new Error("Metadata fetch failed");

		const csvText: string = await response.text();

		// Standardized with PapaParse
		const parsedData: Papa.ParseResult<{ key: string; value: string }> = Papa.parse(csvText, {
			header: true,
			skipEmptyLines: true,
			transformHeader: (header: string) => header.trim(),
		});

		const records: Array<{ key: string; value: string }> = parsedData.data as Array<{ key: string; value: string }>;

		return records.reduce<ScheduleMetadata>(
			(acc: ScheduleMetadata, { key: key, value: value }) => ({
				...acc,
				[key?.trim()]: value?.trim(),
			}),
			{},
		);
	} catch (err) {
		console.error("Metadata Error:", err);
		return { threadId: "0", panelFormUrl: "", vendorFormUrl: "" };
	}
}
