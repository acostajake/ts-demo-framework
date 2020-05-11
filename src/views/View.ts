import { Model } from '../models/Model';

// Every time we reference View we pass in a type of model T and set of attrs K that live on it
export abstract class View<T extends Model<K>, K> {
	regions: { [key: string]: Element } = {};

	constructor(public parent: Element, public model: T) {
		this.bindModel();
	}

	bindModel(): void {
		// manually trigger re-render if User data changes
		this.model.on('change', () => {
			this.render();
		});
	}

	abstract template(): string;

	regionsMap(): { [key: string]: string } {
		return {};
	}

	// implement eventsMap here with empty return so classes extending View do not need to implement it on their classes
	eventsMap(): { [key: string]: () => void } {
		return {};
	}

	bindEvents(fragment: DocumentFragment): void {
		const eventsMap = this.eventsMap();
		for (let eventKey in eventsMap) {
			const [eventName, selector] = eventKey.split(':');

			fragment.querySelectorAll(selector).forEach((elem) => {
				elem.addEventListener(eventName, eventsMap[eventKey]);
			});
		}
	}

	mapRegions(fragment: DocumentFragment): void {
		const regionsMap = this.regionsMap();
		for (let key in regionsMap) {
			const selector = regionsMap[key];
			const element = fragment.querySelector(selector);
			if (element) {
				this.regions[key] = element;
			}
		}
	}

	onRender(): void {}

	render(): void {
		// remove content from parent and replace w new template
		this.parent.innerHTML = '';

		const templateElem = document.createElement('template');
		templateElem.innerHTML = this.template();
		this.bindEvents(templateElem.content);
		this.mapRegions(templateElem.content);

		this.onRender();

		this.parent.append(templateElem.content);
	}
}
