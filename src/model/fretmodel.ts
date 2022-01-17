export const A4 = 440; // A = 440hz.
export const twelfthRoot = Math.pow(2, (1 / 12));

export function getEqualTemperedNote(number) {
	return A4 * Math.pow(twelfthRoot, number);
};

export type PitchClass = 'A' | 'A#,Bb' | 'B' | 'C' | 'C#,Db' | 'D' | 'D#,Eb' | 'E' | 'F' | 'F#,Gb' | 'G' | 'G#,Ab';

export const pitchClass: PitchClass[] = ['A', 'A#,Bb', 'B', 'C', 'C#,Db', 'D', 'D#,Eb', 'E', 'F', 'F#,Gb', 'G', 'G#,Ab'];
export const octaveNotes: PitchClass[] = ['C', 'C#,Db', 'D', 'D#,Eb', 'E', 'F', 'F#,Gb', 'G', 'G#,Ab', 'A', 'A#,Bb', 'B'];

export type FretboardNote = {
	fret: number;
	note: PitchClass;
	octave: number;
	frequency: number;
};

/**
 * For a given class of pitches, generate a range of notes in the specified octave range.
 * Includes the pitch name, the octave number, and the note frequency in equal temperament.
 * 
 * // TODO: Pitchclass should be configurable. Octave should be able to be generated without
 * //       hardcoding number of notes.
 * // TODO: Handle the offset in here so callers don't have to.
 * // TODO: Is there a way to do this for a note instead of an octave so that we can do B0 to
 *          C5 without the extra range?
 */
export function generateLookup(octaveOffset = 0) {
	const base = 4;
	return pitchClass.map((x, i) => {
		return {
			note: x,
			octave: Math.floor((i + 9) / 12) + base + octaveOffset,
			pitch: getEqualTemperedNote(i + (12 * octaveOffset))
		};
	});
}

export function generateLookupRange(start: string, end?: string) {

}

export class FretboardModel {
	constructor () {}
}

export class StringModel {
	public pitch: PitchClass;
	public octave: number;

	constructor (pitch: PitchClass, octave: number) {
		this.pitch = pitch;
		this.octave = octave;
	}

	/**
	 * Get a Note object for a specific range of frets on the fretboard.
	 */
	getFretNote (start: number, end: number): FretboardNote[] {
		// Find the offset of the base string note.
		const octaveIndex = octaveNotes.indexOf(this.pitch);
		const pitchIndex = pitchClass.indexOf(this.pitch);

		const notes = [];
		// Let's do it the slow way tof now, O(n).
		for (let i = start; i <= end; i++) {
			notes.push(octaveNotes[(i + octaveIndex) % 12])
		};

		return notes.map((x, i) => {
			const octave = this.octave + Math.floor((start + i + octaveIndex) / 12);

			return {
				fret: i + start,
				note: x,
				octave, 
				frequency: getEqualTemperedNote(((octave - 4) * 12) + ((start + pitchIndex + i) % 12))
			}
		});
	}

	findNotesInRange (pitches: PitchClass[]) {
		return [{}];
	}
}

const stringTest = new StringModel('A', 2);
console.log('Fret 1, A#/Bb', stringTest.getFretNote(1, 1));
console.log('Fret 5, D', stringTest.getFretNote(5, 5));
console.log('Fret 12, A', stringTest.getFretNote(12, 12));
console.log('Fret 13, A#/Bb', stringTest.getFretNote(13, 13));
console.log('Fret 0, A', stringTest.getFretNote(0, 0));
console.log('Fret 0 through 12', stringTest.getFretNote(0, 12));
console.log('Fret 0 through 24', stringTest.getFretNote(0, 24));
console.log('Fret 12 through 24', stringTest.getFretNote(12, 24));
console.log('Fret 13 through 25', stringTest.getFretNote(13, 25));
