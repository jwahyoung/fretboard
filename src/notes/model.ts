import { config, lookup } from "../config";
import { TemplateResult, render } from "lit-html";
import { View } from "../types";
import { octaveNotes } from "../constants";

export class NoteViewModel {
	_viewTemplate: View<NoteViewModel>;
	_targetSelector: () => HTMLElement;

	notes: string[];

	constructor({ viewTemplate, targetSelector }) {
		this._viewTemplate = viewTemplate;
		this._targetSelector = targetSelector;

		this.notes = octaveNotes.slice();
	}

	render() {
		render(this._viewTemplate(this), this._targetSelector());
	}

	update (value) {
		console.log('value', value);
	}
}
