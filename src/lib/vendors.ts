import { marked } from "marked";

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

	// Assuming a basic CSV parse for now (or use your preferred CSV parser)
	const rows: Array<string> = text.split("\n").slice(1);

	// Wrapped in Promise.all and using an async map to satisfy TypeScript
	const vendors: Array<Vendor> = await Promise.all(
		rows.map(async (row: string) => {
			// Split by columns (Name, Description, URL)
			const [name, description, url]: Array<string> = row.split(",");

			return {
				name: name?.trim() || "Unknown Vendor",
				// Await the marked parser to ensure it resolves to a string
				descriptionHtml: description ? await marked.parse(description) : "",
				url: url?.trim() || "",
			};
		}),
	);

	return vendors;
}
