import { config, lookup, instruments } from "../config";
import { TemplateResult, render } from "lit-html";
import { View } from "../types";

export class ConfigViewModel {
	_viewTemplate: View<ConfigViewModel>;
	_targetSelector: () => HTMLElement;
	tunings: any;
	currentTuning: string;

	constructor({ viewTemplate, targetSelector }) {
		this._viewTemplate = viewTemplate;
		this._targetSelector = targetSelector;

		this.tunings = Object.keys(instruments).map(x => {
			return Object.assign({}, instruments[x], { id: x });
		});
	}

	setTuning = (event: Event) => {
		this.currentTuning = event.target.value;
	}

	changeTuning = (event: Event) => {
		event.preventDefault();
	
		if (!this.currentTuning) {
			return;
		}

		config.strings = instruments[this.currentTuning].strings.map(x => {
			return Object.assign({}, x);
		});

		this.currentTuning = undefined;

		this.render();
		this.update(); // stupid hack for now.
	}

	add = () => {
		config.strings.push({ note: 'C', offset: 0, octave: 3, frets: 24 });
		this.render();
		this.update(); // stupid hack for now.
	}

	remove = (index) => {
		if (config.strings.length > 1) {
			config.strings.splice(index, 1);
			this.render();
			this.update(); // stupid hack for now.
		}
	}

	render() {
		render(this._viewTemplate(this), this._targetSelector());
	}

	update () {}
}
