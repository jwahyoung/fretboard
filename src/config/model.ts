import { config, lookup } from "../config";
import { TemplateResult, render } from "lit-html";
import { View } from "../types";

export class ConfigViewModel {
	_viewTemplate: View<ConfigViewModel>;
	_targetSelector: () => HTMLElement;

	constructor({ viewTemplate, targetSelector }) {
		this._viewTemplate = viewTemplate;
		this._targetSelector = targetSelector;
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
