import { parse } from "csv-parse/sync";

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

export async function getSchedule(): Promise<ScheduleEntry[]> {
	const SHEET_URL = `https://docs.google.com/spreadsheets/d/e/2PACX-1vSJ5qqmI3pg5pJEcyBfQtrFqMJ7Bb5nEDjOIIgfqZ5_L9KEjDdOWnN-7O4KyrOW4_KCXDIVh-VAClPP/pub?output=csv&cachebust=${Date.now()}`;

	console.log("Fetching schedule from:", SHEET_URL); // ADD THIS

	try {
		const response = await fetch(SHEET_URL);

		if (!response.ok) throw new Error("Google Sheet fetch failed");
		const csvText = await response.text();
		const records: any[] = parse(csvText, {
			columns: true,
			skip_empty_lines: true,
			trim: true, // This ignores accidental spaces in your Google Sheet headers
		});
		return records as ScheduleEntry[];
	} catch (err) {
		console.error("Schedule Error:", err); // ADD THIS
		return []; // Return empty array so the page at least loads
	}
}

export async function getMetadata(): Promise<ScheduleMetadata> {
	const META_URL = `https://docs.google.com/spreadsheets/d/e/2PACX-1vSJ5qqmI3pg5pJEcyBfQtrFqMJ7Bb5nEDjOIIgfqZ5_L9KEjDdOWnN-7O4KyrOW4_KCXDIVh-VAClPP/pub?gid=625855329&output=csv&cachebust=${Date.now()}`;

	try {
		const response = await fetch(META_URL);

		if (!response.ok) throw new Error("Metadata fetch failed");
		const csvText = await response.text();
		const records: { key: string; value: string }[] = parse(csvText, {
			columns: true,
			skip_empty_lines: true,
			trim: true,
		});
		return records.reduce<ScheduleMetadata>((acc, { key, value }) => ({ ...acc, [key]: value }), {});
	} catch (err) {
		console.error("Metadata Error:", err);
		return { threadId: "0", panelFormUrl: "", vendorFormUrl: "" }; // Fallback to avoid breaking the build
	}
}
