import { marked } from "marked";
import { getSheetData } from "./common";

export interface Vendor {
	name: string;
	descriptionHtml: string;
	url: string;
}

export async function getVendors(): Promise<Array<Vendor>> {
	try {
		const vendorsData: Array<any> = await getSheetData<any>("vendors");
		const vendors: Array<Vendor> = await Promise.all(
			vendorsData.map(async (row: any) => {
				return {
					name: row.name?.trim() || "Unknown Vendor",
					descriptionHtml: row.description ? await marked.parse(row.description, { breaks: true }) : "",
					url: row.url?.trim() || ""
				};
			}),
		);
		return vendors;
	} catch (err: any) {
		console.error("Vendors Error:", err);
		return [];
	}
}
