

function playSound(context, destination, buffer, tempo) {
	const source = context.createBufferSource();
	source.buffer = buffer;
	source.connect(destination);
	source.loopStart = 0;
	source.loopEnd = 60 / tempo;
	source.loop = true;
	source.start();

	return source;
}

function loadSound(context, url) {
	return new Promise((resolve, reject) => {
		// TODO: Convert to fetch?
		const request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
	
		// Decode asynchronously
		request.onload = function() {
			/**
			 * Grab the sample from network, then create a long audio buffer and copy the sample to it channel by channel.
			 * This allows us loop the sound with a time value. Audio buffer is 30 seconds long, allowing a minimum tempo value
			 * of 2 bpm.
			 */
			context.decodeAudioData(request.response, function (buffer) {
				const channelCount = buffer.numberOfChannels;
				const sound = context.createBuffer(channelCount, context.sampleRate * 30, context.sampleRate);
			
				for (let i = 0; i < channelCount; i++) {
					const data = buffer.getChannelData(i);
					sound.copyToChannel(data, i, 0);
				};

				resolve(sound);
			}, reject);
		}

		request.send();
	});
}

document.addEventListener('DOMContentLoaded', () => {
	let context;
	let source;
	let muted = false;

	const maxVolume = 0.2;
	let currentVolume = 80;
	let currentTempo = 120;

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
	const tempoControl = document.getElementById('tempo');

	const bufferPromise = loadSound(context, './sounds/high.mp3');
	bufferPromise.then((buffer) => {
		startButton.addEventListener('click', () => {
			source = playSound(context, gain, buffer, currentTempo);
		});
	
		stopButton.addEventListener('click', () => {
			if (source) {
				source.stop();
				source = null;
			}
		});
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

	tempoControl.value = currentTempo;
	tempoControl.addEventListener('change', (event) => {
		currentTempo = event.target.value;

		if (source) {
			source.loopEnd = 60 / currentTempo;
		}
	});
});