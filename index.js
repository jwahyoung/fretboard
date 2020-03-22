const A4 = 440; // A = 440hz.
const twelfthRoot = Math.pow(2, (1 / 12));

// TODO: Generate this from a configuration function for later use.
const config = {
	strings:  [
		{ note: 'B', offset: 0, octave: 0, frets: 24 },
		{ note: 'E', offset: 0, octave: 1, frets: 24 },
		{ note: 'A', offset: 0, octave: 1, frets: 24 },
		{ note: 'D', offset: 0, octave: 2, frets: 24 },
		{ note: 'G', offset: 0, octave: 2, frets: 24 },
		{ note: 'C', offset: 0, octave: 3, frets: 24 },
	],
	audio: true,
	display: true
};

/**
 * For a given class of pitches, generate a range of notes in the specified octave range.
 * Includes the pitch name, the octave number, and the note frequency in equal temperament.
 * 
 * // TODO: Pitchclass should be configurable. Octave should be able to be generated without
 * //       hardcoding number of notes.
 * // TODO: Handle the offset in here so callers don't have to.
 * // TODO: Is there a way to do this for a note instead of an octave so that we can do B0 to
 *          C5 withour the extra range?
 */
function generateLookup(octaveOffset = 0) {
	const base = 4;
	const pitchClass = ['A', 'A#,Bb', 'B', 'C', 'C#,Db', 'D', 'D#,Eb', 'E', 'F', 'F#,Gb', 'G', 'G#,Ab'];
	return pitchClass.map((x, i) => {
		return {
			note: x,
			octave: Math.floor((i + 9) / 12) + base + octaveOffset,
			pitch: getEqualTemperedNote(i + (12 * octaveOffset))
		};
	});
}

function getEqualTemperedNote(number) {
	return A4 * Math.pow(twelfthRoot, number);
}

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

stringRanges.forEach(console.log);

document.addEventListener('DOMContentLoaded', () => {
	let context;
	let source;
	let muted = false;

	const maxVolume = 0.2;
	let currentVolume = 30;

	try {
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		context = new AudioContext();
	}
	catch(e) {
		alert('Web Audio API is not supported in this browser');
	}

	const gain = context.createGain();
	gain.connect(context.destination);
	gain.gain.setValueAtTime(maxVolume * (currentVolume / 100), context.currentTime);

	const startButton = document.getElementById('start');
	const stopButton = document.getElementById('stop');
	const muteButton = document.getElementById('mute');
	const volumeControl = document.getElementById('volume');

	const configAudio = document.getElementById('config-audio');
	const configDisplay = document.getElementById('config-display');

	let note;

	function playNote(hz) {
		source = context.createOscillator();
		source.frequency.setValueAtTime(hz, 0);
		source.type = 'triangle';
		source.connect(gain);
		source.loop = true;
		source.start();
		source.stop(context.currentTime + 1);
	}

	startButton.addEventListener('click', () => {
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
			playNote(note.pitch);
		}
	});

	stopButton.addEventListener('click', () => {
		if (note) {
			playNote(note.pitch);
		}
	});

	muteButton.addEventListener('click', () => {
		gain.gain.setValueAtTime(muted ? maxVolume * (currentVolume / 100) : 0, context.currentTime);
		muted = !muted;
	});

	volumeControl.value = currentVolume;
	volumeControl.addEventListener('change', (event) => {
		currentVolume = event.target.value;

		if (!muted) {
			gain.gain.setValueAtTime(maxVolume * (currentVolume / 100), context.currentTime);
		}
	});

	configAudio.checked = config.audio;
	configAudio.addEventListener('change', (event) => {
		config.audio = event.target.checked;
	});

	configDisplay.checked = config.display;
	document.getElementById('noteName').hidden = !config.display;
	configDisplay.addEventListener('change', (event) => {
		config.display = event.target.checked;
		document.getElementById('noteName').hidden = !config.display;
	});
});