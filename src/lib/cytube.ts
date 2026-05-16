export interface CytubeMetadata {
	name: string;
	url: string;
}

export function getCytubeUrl(channel: string): CytubeMetadata {
	switch (channel) {
		case "1":
			return { name: "CyTube 1", url: "//cytu.be/r/mlp-con" };
		case "2":
			return { name: "CyTube 2", url: "//cytu.be/r/mlp-con2" };
		default:
			return { name: channel, url: `//cytu.be/r/${channel}` };
	}
}