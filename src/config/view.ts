import { ConfigViewModel } from './model';
import { html, TemplateResult } from "lit-html";
import { config } from "../config";
import { pitchClass } from "../constants";

export type View<T> = (m: T) => TemplateResult;

export const configViewTemplate = ({
	toggleActive,
	remove
}: ConfigViewModel) => html`
	<section id="config">
		<table class="table is-fullwidth is-hoverable is-narrow">
			<thead>
				<tr>
					<th>Note Name</th>
					<th>Octave</th>
					<th>Fret Count</th>
					<th>Fret Offset</th>
					<th>Remove</th>
				</tr>
			</thead>
			<tbody>
			${config.strings.map((x, index) => html`
				<tr>
					<td>
						<div class="select is-fullwidth">
							<select>
								${pitchClass.map(y => html`
									<option .value=${y} ?selected=${y == x.note.split(',')[0]} >${y}</option>
								`)}
							</select>
						</div>
					</td>
					<td>
						<input class="input" type="number" .value=${x.octave} />
					</td>
					<td>
						<input class="input" type="number" min="0" .value=${x.frets} />
					</td>
					<td>
						<input class="input" type="number" min="0" .value=${x.offset} />
					</td>
					<td>
						<button class="button is-fullwidth" type="button" @click=${() => remove(index)}>Remove</button>
					</td>
				</tr>
			`)}
			</tbody>
		</table>
	</section>
`;