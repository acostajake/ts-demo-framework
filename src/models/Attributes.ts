export class Attributes<T> {
	constructor(private data: T) {}

	// Generic constraint so K type can only be a key of T
	// Can only ever call get with a key defined on T (e.g. User interface)
	// implementing as a function ensures binding to this
	get = <K extends keyof T>(key: K): T[K] => {
		return this.data[key];
	};

	set(update: T): void {
		Object.assign(this.data, update);
	}

	getAll(): T {
		return this.data;
	}
}
