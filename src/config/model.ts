import { config, lookup } from "../config";
import { TemplateResult, render } from "lit-html";
import { View } from "./view";

export class ConfigViewModel {
	_viewTemplate: View<ConfigViewModel>;
	_targetSelector: () => HTMLElement;

	constructor({ viewTemplate, targetSelector }) {
		this._viewTemplate = viewTemplate;
		this._targetSelector = targetSelector;
	}

	toggleActive = (string) => {
		string.active = !string.active;
	}

	remove = (index) => {
		config.strings.splice(index, 1);
		this.render();
	}

	render() {
		render(this._viewTemplate(this), this._targetSelector());
	}
}
