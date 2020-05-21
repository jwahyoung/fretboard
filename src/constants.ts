export const A4 = 440; // A = 440hz.
export const twelfthRoot = Math.pow(2, (1 / 12));

export function getEqualTemperedNote(number) {
	return A4 * Math.pow(twelfthRoot, number);
};

export const pitchClass = ['A', 'A#,Bb', 'B', 'C', 'C#,Db', 'D', 'D#,Eb', 'E', 'F', 'F#,Gb', 'G', 'G#,Ab'];

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
