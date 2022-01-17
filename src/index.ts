import { render, html } from 'lit-html';
import { fretboard } from './fretboard';
import { configViewTemplate } from './config/view';
import { ConfigViewModel } from './config/model';
import { noteViewTemplate } from './notes/view';
import { NoteViewModel } from './notes/model';
import './model/fretmodel';

import '@fortawesome/fontawesome-free/css/all.css';
import { createStringRanges, config } from './config';

const flags = {
	notesConfig: true,
	fretboardConfig: true,
	settingsConfig: false
};

document.addEventListener('DOMContentLoaded', () => {
	const configContainer = document.createElement('div');
	const notesContainer = document.createElement('div');
	const fretboardContainer = document.createElement('div');


	const configViewModel = new ConfigViewModel({
		viewTemplate: configViewTemplate,
		targetSelector: () => configContainer
	});

	// dumb hack. Fix later.
	configViewModel.update = () => {
		render(fretboard(createStringRanges(), config.activeNotes), fretboardContainer);
	};

	configViewModel.render();

	const noteViewModel = new NoteViewModel({
		viewTemplate: noteViewTemplate,
		targetSelector: () => notesContainer
	});

	noteViewModel.update = () => {
		render(fretboard(createStringRanges(), config.activeNotes), fretboardContainer);
	};

	noteViewModel.render();

	render(fretboard(createStringRanges(), config.activeNotes), fretboardContainer);

	render(template(fretboardContainer, notesContainer, configContainer), document.getElementById('application'));
});

const template = (fretboardContainer, notesContainer, configContainer) => html`
	${fretboardContainer}
	<div class="tabs is-fullwidth">
		<ul>
			<li ?hidden="${!flags.notesConfig}" class="is-active">
				<a>
					<span class="icon is-small">
						<i class="fas fa-music"></i>
					</span>
					Notes/scale
				</a>
			</li>
			<li ?hidden="${!flags.fretboardConfig}" class="is-active">
				<a>
					<span class="icon is-small">
						<i class="fas fa-cog"></i>
					</span>
					Fretboard Configuration
				</a>
			</li>
			<li ?hidden="${!flags.settingsConfig}" class="is-active">
				<a>
					<span class="icon is-small">
						<i class="fas fa-cog"></i>
					</span>
					Settings
				</a>
			</li>
		</ul>
	</div>
	${flags.notesConfig ? notesContainer : ''}
	${flags.fretboardConfig ? configContainer : ''}
`;