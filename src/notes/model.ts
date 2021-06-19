import { config, lookup } from "../config";
import { TemplateResult, render } from "lit-html";
import { View } from "../types";

export class NoteViewModel {
	_viewTemplate: View<NoteViewModel>;
	_targetSelector: () => HTMLElement;

	constructor({ viewTemplate, targetSelector }) {
		this._viewTemplate = viewTemplate;
		this._targetSelector = targetSelector;
	}

	remove = (index) => {
		config.strings.splice(index, 1);
		this.render();
		this.update(); // stupid hack for now.	
	}

	render() {
		render(this._viewTemplate(this), this._targetSelector());
	}

	update () {}
}
