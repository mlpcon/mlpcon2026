import { getSheetData } from "./common";

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
		const metadata: Array<{ key: string; value: string }> = await getSheetData<{ key: string; value: string }>("metadata");
		return metadata.reduce<Metadata>((acc: Metadata, { key, value }) => {
			const trimmedKey = key?.trim();
			let trimmedValue: string | URL | undefined = value?.trim();

			if (trimmedValue && (trimmedKey === "panelFormUrl" || trimmedKey === "vendorFormUrl")) 
				trimmedValue = new URL(trimmedValue);
			return { ...acc, [trimmedKey]: trimmedValue };
		}, {});
	} catch (err) {
		console.error("Metadata Error:", err);
		throw err;
	}
}
