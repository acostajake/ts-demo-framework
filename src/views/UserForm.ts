import { User, UserProps } from '../models/User';
import { View } from './View';

export class UserForm extends View<User, UserProps> {
	eventsMap(): { [key: string]: () => void } {
		return {
			'click:#set-age': this.onSetAgeClick,
			'click:#set-name': this.onSetNameClick,
			'click:#save': this.saveAndUpdate,
		};
	}

	onSetAgeClick = (): void => {
		this.model.setRandomAge();
	};

	onSetNameClick = (): void => {
		// at this point the input lives in the parent, so just grab it off input
		const input = this.parent.querySelector('input');
		// type guard to ensure query selector does not return null val
		if (input) {
			const name = input.value;
		}
		this.model.set({ name });
	};

	saveAndUpdate = (): void => {
		this.model.save();
	};

	template(): string {
		return `
      <div>
        <input placeholder="${this.model.get('name')}"/>
        <button id="set-age">Set random age</button>
        <button id="set-name">Update name</button>
        <button id="save">Save</button>
      </div>
    `;
	}
}
