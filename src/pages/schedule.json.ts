import { getSchedule } from "../lib/schedule";

export async function GET() {
	const fullSchedule = await getSchedule();
	const now = new Date();

	// Logic to filter fullSchedule based on 'now' and 'channel' goes here.
	// For now, we'll return the full list to verify the connection.

	return new Response(JSON.stringify(fullSchedule), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
}
