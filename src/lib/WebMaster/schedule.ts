import { marked } from "marked";
import { ScheduleDuration } from "./ScheduleDuration";
import { getSheetData } from "./common";

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

export const DAY_ORDER: Array<string> = ["Friday", "Saturday", "Sunday"];

export async function getGroupedSchedule(): Promise<Record<string, Array<ScheduleEntry>>> {
	const schedule: Array<ScheduleEntry> = await getSchedule();
	return schedule.reduce(
		(groups: Record<string, Array<ScheduleEntry>>, entry: ScheduleEntry) => {
			const day: string = entry.day || "TBD";

			if (!groups[day]) 
				groups[day] = [];
			groups[day].push(entry);
			return groups;
		},
		{} as Record<string, Array<ScheduleEntry>>,
	);
}

export async function getSchedule(): Promise<Array<ScheduleEntry>> {
	try {
		const scheduleData: Array<ScheduleEntryUnprocessed> = await getSheetData<ScheduleEntryUnprocessed>("schedule");
		return await Promise.all(
			scheduleData.map(async (entry: ScheduleEntryUnprocessed) => {
				return {
					...entry,
					description: entry.description ? await marked.parse(entry.description, { breaks: true }) : "",
					duration: new ScheduleDuration(entry.duration),
				};
			})
		);
	} catch (err) {
		console.error("Schedule Error:", err);
		throw err;
	}
}
