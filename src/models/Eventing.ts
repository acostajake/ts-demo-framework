// to indicate a func should return nothing specify void over {} in return value
type Callback = () => void;

// Handle events tied to a user
export class Eventing {
	events: { [key: string]: Callback[] } = {};

	// Listen for changes to properties
	on = (eventName: string, callback: Callback): void => {
		const handlers = this.events[eventName] || [];
		handlers.push(callback);
		this.events[eventName] = handlers;
	};

	trigger = (eventName: string): void => {
		const handlers = this.events[eventName];

		if (!handlers || !handlers.length) return;
		handlers.forEach((callback) => callback());
	};
}
