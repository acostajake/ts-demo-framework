import { AxiosPromise, AxiosResponse } from 'axios';

interface ModelAttributes<T> {
	get<K extends keyof T>(key: K): T[K];
	getAll(): T;
	set(value: T): void;
}

interface Sync<T> {
	fetch(id: number): AxiosPromise;
	save(data: T): AxiosPromise;
}

interface Events {
	on(eventName: string, callback: () => void): void;
	trigger(eventName: string): void;
}

interface hasId {
	id?: number;
}

export class Model<T extends hasId> {
	constructor(
		private attributes: ModelAttributes<T>,
		private events: Events,
		private sync: Sync<T>
	) {}

	// getters forward reference to methods
	get = this.attributes.get;
	on = this.events.on;
	trigger = this.events.trigger;

	set(update: T): void {
		this.attributes.set(update);
		this.events.trigger('change');
	}

	fetch(): void {
		const id = this.attributes.get('id');
		if (typeof id !== 'number') {
			throw new Error('Cannot fetch without id');
		}
		//  set with method defined on this to run change func rather than referencing set method on attributes
		this.sync.fetch(id).then((res: AxiosResponse) => {
			this.set(res.data);
		});
	}

	save(): void {
		this.sync
			.save(this.attributes.getAll())
			.then((res: AxiosResponse): void => {
				this.trigger('save');
			})
			.catch((err) => this.trigger('error'));
	}
}
