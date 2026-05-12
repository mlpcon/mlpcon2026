import { marked } from "marked";
import Papa from "papaparse";
import { getSheetUrl } from "./common";

export interface Vendor {
	name: string;
	descriptionHtml: string;
	url: string;
}

export async function getVendors(): Promise<Array<Vendor>> {
	const response: Response = await fetch(getSheetUrl("vendors"));
	const text: string = await response.text();
	const parsedData: Papa.ParseResult<any> = Papa.parse(text, {
		header: true,
		skipEmptyLines: true,
	});
	const rows: Array<any> = parsedData.data as Array<any>;
	const vendors: Array<Vendor> = await Promise.all(
		rows.map(async (row: any) => {
			return {
				name: row.name?.trim() || "Unknown Vendor",
				// Now the description can safely contain commas and newlines
				descriptionHtml: row.description ? await marked.parse(row.description, { breaks: true }) : "",
				url: row.url?.trim() || ""
			};
		}),
	);

	return vendors;
}
