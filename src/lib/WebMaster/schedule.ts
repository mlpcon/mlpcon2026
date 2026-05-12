import { marked } from "marked";
import Papa from "papaparse";
import { getSheetUrl } from "./common";

interface ScheduleEntryUnprocessed {
	title: string;
	startTime: string;
	duration: ScheduleDuration | string;
	platform: string;
	channel: string;
	description: string;
	day: string;
}

export interface ScheduleEntry extends ScheduleEntryUnprocessed {
	duration: ScheduleDuration;
}

export class ScheduleDuration {
	hours: number = 0;
	minutes: number = 0;

	constructor(duration: ScheduleDuration | string);
	constructor(hours: number, minutes: number);
	constructor(durationOrHours: ScheduleDuration | string | number, minutes?: number) {
		if (durationOrHours instanceof ScheduleDuration) {
			this.hours = durationOrHours.hours;
			this.minutes = durationOrHours.minutes;
		} else if (typeof durationOrHours === "string") {
			const regex: RegExp = /^PT(?:(\d+)H)?(?:(\d+)M)?$/;
			const matches: RegExpMatchArray = durationOrHours.match(regex) as RegExpMatchArray;

			if (matches) {
				this.hours = parseInt(matches[1] || "0", 10);
				this.minutes = parseInt(matches[2] || "0", 10);
			} else {
				this.hours = 0;
				this.minutes = 0;
				console.warn("Invalid duration format:", durationOrHours);
			}
		} else {
			this.hours = durationOrHours;
			this.minutes = minutes || 0;
		}

		if (this.hours < 0) this.hours = 0;

		if (this.minutes < 0) this.minutes = 0;
		else if (this.minutes >= 60) {
			this.hours += Math.floor(this.minutes / 60);
			this.minutes = this.minutes % 60;
		}
	}

	toString(): string {
		if (this.hours === 0) return `PT${this.minutes}M`;
		else if (this.minutes === 0) return `PT${this.hours}H`;
		return `PT${this.hours}H${this.minutes}M`;
	}
}

export async function getSchedule(): Promise<Array<ScheduleEntry>> {
	try {
		const response: Response = await fetch(getSheetUrl("schedule"));

		if (!response.ok) throw new Error("Google Sheet fetch failed");
		const csvText: string = await response.text();
		const parsedData: Papa.ParseResult<ScheduleEntryUnprocessed> = Papa.parse(csvText, {
			header: true,
			skipEmptyLines: true,
			transformHeader: (header: string) => header.trim(),
		});
		return await Promise.all(
			parsedData.data.map(async (entry: ScheduleEntryUnprocessed) => {
				return {
					...entry,
					description: entry.description ? await marked.parse(entry.description, { breaks: true }) : "",
					duration: new ScheduleDuration(entry.duration),
				};
			}),
		);
	} catch (err) {
		console.error("Schedule Error:", err);
		return [];
	}
}
