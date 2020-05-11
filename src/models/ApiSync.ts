import axios, { AxiosPromise } from 'axios';

interface HasId {
	id?: number;
}

// Use interface to add constraint and resolve error at save()
export class ApiSync<T extends HasId> {
	constructor(public rootlUrl: string) {}

	fetch(id: number): AxiosPromise {
		return axios.get(`${this.rootlUrl}/${id}`);
	}

	save(data: T): AxiosPromise {
		const { id } = data;
		if (id) {
			return axios.put(`${this.rootlUrl}/${id}`, data);
		} else {
			return axios.post(this.rootlUrl, data);
		}
	}
}
