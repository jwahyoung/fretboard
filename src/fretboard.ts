import { generateLookup, pitchClass } from "./constants";
import { config, createStringRanges } from "./config";
import { html } from "lit-html";
import { unsafeHTML } from 'lit-html/directives/unsafe-html';

export const fretboard = (strings, activeNotes = pitchClass, hideAllNotes = false) => {
	const { minOffset, maxOffset } = strings.reduce((p, c) => ({ maxOffset: Math.max(p.maxOffset, c.offset), minOffset: Math.min(p.minOffset, c.offset) }), { maxOffset: 0, minOffset: 0 });
	const numberOfFrets = strings.reduce((p, c) => Math.max(p, c.frets + Math.abs(minOffset) + maxOffset), -Infinity);

	const noteDisplay = (note) => html`
		<div class="fretboard-note">
			<span class="${hideAllNotes ? 'is-invisible' : ''} tag ${activeNotes.indexOf(note) > -1 ? 'active' : ''} ${note.indexOf(',') === -1 ? 'is-white' : 'is-dark'}">
				${note.replace(',','/')}
			</span>
		</div>
	`;

	return html`
		<div id="notation">
			<div class="table-container">
				<table class="table fretboard is-fullwidth is-hoverable is-narrow">
					<thead>
						<tr>
							${Array(numberOfFrets + 1).fill('').map((x, index) => html`
								<th class="has-text-centered">
								${index ? index + minOffset : ''}
								</th>
							`)}
						</tr>
					</thead>
					<tbody class="has-background-grey-lighter">
					${strings.reverse().map((x, index) => html`
						<tr>
							${Array(Math.max(0, x.offset + (minOffset * -1))).fill('').map((x) => html`
								<td class="has-background-grey"></td>
							`)}
							${x.range.map((y, i) => i
								? html`<td class="has-text-centered">
									${noteDisplay(y.note)}
								</td>`
								: html`<th class="fretboard-open-string has-text-centered">
									${noteDisplay(y.note)}
								</th>`
							)}
							${Array(Math.max(0, numberOfFrets + 1 - x.range.length - Math.max(0, x.offset + (minOffset * -1)))).fill('').map((x) => html`
								<td></td>
							`)}
						</tr>
					`)}
					</tbody>
					<tfoot>
						<tr>
							${Array(numberOfFrets + 1).fill('').map((x, index) => html`
								<th class="has-text-centered">
									${!index || (index % 12)
										? [3,5,7,9].indexOf(index % 12) > -1
											? unsafeHTML('&bull;')
											: ''
										: unsafeHTML('&bull; &bull;')
									}
								</th>
							`)}
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
	`;
};