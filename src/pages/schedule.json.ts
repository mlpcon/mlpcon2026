import { getSchedule, type ScheduleEntry } from "../lib/WebMaster/schedule";

export async function GET(): Promise<Response> {
	const fullSchedule: Array<ScheduleEntry> = await getSchedule();

	// We'll map the raw sheet data into the specific JSON structure you want
	const machineReadable = fullSchedule.map((entry) => ({
		title: entry.title,
		startTime: entry.startTime, // e.g., "2026-06-26T14:00:00-04:00"
		duration: entry.duration.toString(), // e.g., "PT1H"
		description: entry.rawDescription,
		channel: entry.channel, // Useful for filtering on CyTube's end
	}));

	return new Response(JSON.stringify(machineReadable), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*", // Allows CyTube to fetch this safely
		},
	});
}
