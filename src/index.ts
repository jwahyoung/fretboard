import { render } from 'lit-html';
import { app } from './app';
import { configViewTemplate } from './config/view';
import { ConfigViewModel } from './config/model';

document.addEventListener('DOMContentLoaded', () => {
	render(app(), document.getElementById('application'));

	const configViewModel = new ConfigViewModel({
		viewTemplate: configViewTemplate,
		targetSelector: () => document.querySelector('#config')
	});

	configViewModel.render();
});