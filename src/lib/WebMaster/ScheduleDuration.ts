export class ScheduleDuration {
	hours: number = 0;
	minutes: number = 0;

	constructor(duration: ScheduleDuration | string);
	constructor(hours: number, minutes: number);
	constructor(durationOrHours: ScheduleDuration | string | number, minutes?: number) {
		if (durationOrHours instanceof ScheduleDuration) {
			this.hours = durationOrHours.hours;
			this.minutes = durationOrHours.minutes;
		} else if (typeof durationOrHours === "string") {
			const regex: RegExp = /^PT(?:(\d+)H)?(?:(\d+)M)?$/;
			const matches: RegExpMatchArray = durationOrHours.match(regex) as RegExpMatchArray;

			if (matches) {
				this.hours = parseInt(matches[1] || "0", 10);
				this.minutes = parseInt(matches[2] || "0", 10);
			} else {
				this.hours = 0;
				this.minutes = 0;
				console.warn("Invalid duration format:", durationOrHours);
			}
		} else {
			this.hours = durationOrHours;
			this.minutes = minutes || 0;
		}

		if (this.hours < 0) 
			this.hours = 0;

		if (this.minutes < 0) 
			this.minutes = 0;
		else if (this.minutes >= 60) {
			this.hours += Math.floor(this.minutes / 60);
			this.minutes = this.minutes % 60;
		}
	}

	format(): string {
		const formatter: Intl.DurationFormat = new Intl.DurationFormat("en", { style: "long" });
		return formatter.format({ hours: this.hours, minutes: this.minutes });
	}

	toString(): string {
		if (this.hours === 0) 
			return `PT${this.minutes}M`;
		else if (this.minutes === 0) 
			return `PT${this.hours}H`;
		return `PT${this.hours}H${this.minutes}M`;
	}
}