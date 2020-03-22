import { render } from 'lit-html';
import { app } from './app';


document.addEventListener('DOMContentLoaded', () => {
	render(app(), document.getElementById('application'));
});