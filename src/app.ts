import { generateLookup } from "./constants";
import { config } from "./config";
import { html } from "lit-html";
import { AudioController } from "./audio";

/**
 * Generate octaves down to A0 (we start at octave 4 by default, hence the negative numbers).
 */
const lookup = [-4, -3, -2, -1, 0]
	.map(generateLookup)
	.reduce((p, c) => p.concat(c));

const stringRanges = config.strings.map(x => {
	const start = lookup.findIndex(y => y.note === x.note && y.octave === x.octave);
	return {
		note: x.note,
		octave: x.octave,
		frets: x.frets,
		offset: x.offset,
		range: lookup.slice(start, start + x.frets + 1)
	};
});

lookup.forEach(x => {
	console.log(x.note, x.octave, x.pitch);
});

export const app = () => {
	const audio = new AudioController();
	let note;

	function start() {
		const stringIndex = Math.floor(Math.random() * (stringRanges.length));
		const string = stringRanges[stringIndex];
		const index = Math.floor(Math.random() * (string.range.length));
		note = string.range[index];
		console.log(string.note, note.note, note.octave);

		document.getElementById('stringName').textContent = string.note;

		if (config.display) {
			const noteDisplay = note.note.split(',');
			const noteName = noteDisplay[Math.floor(Math.random() * noteDisplay.length)];
			document.getElementById('noteName').textContent = noteName + note.octave;
		}

		if (config.audio) {
			audio.playNote(note.pitch);
		}
	}

	function repeat() {
		if (config.audio) {
			audio.playNote(note.pitch);
		}
	}

	function mute() {
		audio.mute();
	}

	function volume (event) {
		audio.volume = event.target.value;
	}

	function toggleAudio (event) {
		config.audio = event.target.checked;
	}

	function toggleDisplay (event) {
		config.display = event.target.checked;
		document.getElementById('noteName').hidden = !config.display;
	}

	return html`
		<div id="stringName" style="font-size: 3rem;"></div>
		<div id="noteName" style="font-size: 3rem;" .hidden=${!config.display}></div>
		<div>
			<button id="mute" type="button" @click=${audio.mute.bind(audio)}>Mute</button>
			<label for="volume">Volume</label>
			<input id="volume" type="number" min="0" max="100" .value=${audio.volume} @change=${volume} />
		</div>
		<div>
			<button id="start" type="button" @click=${start}>Next</button>
			<button id="repeat" type="button" @click=${repeat}>Repeat</button>	
		</div>
		<section id="config">
			<div>
				<input id="config-audio" type="checkbox" .checked=${config.audio} @change=${toggleAudio} />
				<label for="config-audio">Play Audio</label>	
			</div>
			<div>
				<input id="config-display" type="checkbox" .checked=${config.display} @change=${toggleDisplay}  />
				<label for="config-display">Display Note</label>
			</div>
		</section>
	`;
};
