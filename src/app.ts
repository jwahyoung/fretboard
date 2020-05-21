import { generateLookup, pitchClass } from "./constants";
import { config, createStringRanges } from "./config";
import { html } from "lit-html";
import { unsafeHTML } from 'lit-html/directives/unsafe-html';

export const app = () => {
	const strings = createStringRanges();
	const numberOfFrets = strings.reduce((p, c) => Math.max(p, c.frets - c.offset), -Infinity);

	return html`
		<div id="notation">
			<div class="table-container">
				<table class="table fretboard is-fullwidth is-hoverable is-narrow">
					<thead>
						<tr>
							${Array(numberOfFrets + 1).fill('').map((x, index) => html`
								<th class="has-text-centered">
								${index ? index : ''}
								</th>
							`)}
						</tr>
					</thead>
					<tbody class="has-background-grey-lighter">
					${strings.reverse().map((x, index) => html`
						<tr>
							${x.range.map((y, i) => i
								? html`<td class="has-text-centered">
									${noteDisplay(y.note)}
								</td>`
								: html`<th class="fretboard-open-string has-text-centered">
									${noteDisplay(y.note)}
								</th>`
							)}
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
		<div id="config">
			Nothing here
		</div>
	`;
};

const noteDisplay = (note) => html`
	<div class="fretboard-note">
		<span class="tag ${note.indexOf(',') === -1 ? 'is-white' : 'is-dark'}">${note.replace(',','/')}</span>
	</div>
`;