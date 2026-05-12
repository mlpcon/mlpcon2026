import { marked } from "marked";
import Papa from "papaparse";

export interface Vendor {
	name: string;
	descriptionHtml: string;
	url: string;
}

export async function getVendors(): Promise<Array<Vendor>> {
	// Your exact Google Sheets CSV export link
	const csvUrl: string = "https://docs.google.com/spreadsheets/d/15kiTemPZnxKE6qMAZfc5Uf3tcrl4E_BICGKCNrKpx10/export?format=csv&gid=1964861081";
	const response: Response = await fetch(csvUrl);
	const text: string = await response.text();

	// PapaParse handles the quotes, commas, and newlines that break manual splitting
	const parsedData: Papa.ParseResult<any> = Papa.parse(text, {
		header: true,
		skipEmptyLines: true,
	});

	const rows: Array<any> = parsedData.data as Array<any>;

	// Wrapped in Promise.all and using an async map to satisfy TypeScript
	const vendors: Array<Vendor> = await Promise.all(
		rows.map(async (row: any) => {
			return {
				name: row.name?.trim() || "Unknown Vendor",
				// Now the description can safely contain commas and newlines
				descriptionHtml: row.description ? await marked.parse(row.description) : "",
				url: row.url?.trim() || "",
			};
		}),
	);

	return vendors;
}
