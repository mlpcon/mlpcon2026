import Papa from "papaparse";
import { getSheetUrl } from "./common";

interface MetadataUnprocessed {
	threadId?: string;
	panelFormUrl?: URL | string;
	vendorFormUrl?: URL | string;
}

export interface Metadata extends MetadataUnprocessed {
	panelFormUrl?: URL;
	vendorFormUrl?: URL;
}

export async function getMetadata(): Promise<Metadata> {
	try {
		const response: Response = await fetch(getSheetUrl("metadata"));

		if (!response.ok) throw new Error("Metadata fetch failed");
		const csvText: string = await response.text();
		const parsedData: Papa.ParseResult<{ key: string; value: string }> = Papa.parse(csvText, {
			header: true,
			skipEmptyLines: true,
			transformHeader: (header: string) => header.trim(),
		});
		const records: Array<{ key: string; value: string }> = parsedData.data as Array<{ key: string; value: string }>;
		return records.reduce<Metadata>((acc: Metadata, { key, value }) => {
			const trimmedKey = key?.trim();
			let trimmedValue: string | URL | undefined = value?.trim();

			if (trimmedValue && (trimmedKey === "panelFormUrl" || trimmedKey === "vendorFormUrl")) trimmedValue = new URL(trimmedValue);
			return { ...acc, [trimmedKey]: trimmedValue };
		}, {});
	} catch (err) {
		console.error("Metadata Error:", err);
		return { threadId: "0" };
	}
}
