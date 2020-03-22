import { appConfig } from "./config";

export class AudioController {
	private _context: AudioContext;
	private _gainNode: GainNode;
	private _volume: number = 100;
	private _muted: boolean = false;
	private _disabled: boolean = false;

	public get volume() { return this._volume };
	public set volume(value: number) {
		console.log('set volume', this._gainNode, this._volume, value);
		this._volume = value;
		this._gainNode.gain.setValueAtTime(!this._muted ? appConfig.maxVolume * (this._volume / 100) : 0, this._context.currentTime);
	};

	public get muted() { return this._muted };

	constructor (context?: AudioContext) {
		this._context = context || tryGetAudioContext();
		this._gainNode = this._context.createGain();
		this._gainNode.connect(this._context.destination);

		// TODO: if context isn't supported, this class should do nothing.
		if (!this._context) {
			this._disabled = true;
		}
	}

	public mute() {
		this._muted = !this._muted;
		this._gainNode.gain.setValueAtTime(!this._muted ? appConfig.maxVolume * (this._volume / 100) : 0, this._context.currentTime);
	}

	public playNote(hz) {
		if (this._disabled) return;

		const source = this._context.createOscillator();
		source.frequency.setValueAtTime(hz, 0);
		source.type = 'triangle';
		source.connect(this._gainNode);
		source.start();
		source.stop(this._context.currentTime + 1);
	}
}

function tryGetAudioContext(contextOptions?: AudioContextOptions) {
	try {
		window.AudioContext = window.AudioContext || (window as any).webkitAudioContext;
		return new AudioContext(contextOptions);
	}
	catch(e) {
		alert('Web Audio API is not supported in this browser');
	}
}
