import { ConfigViewModel } from './model';
import { html } from "lit-html";
import { config } from "../config";
import { pitchClass } from "../constants";

export const configViewTemplate = ({
	remove,
	update,
	add
}: ConfigViewModel) => html`
	<section class="section" id="config">
		<div class="container">
		<ol reversed="reversed" class="is-unstyled" style="counter-reset: li ${config.strings.length + 1}">
		${config.strings.map((x, index) => html`
			<li class="is-relative">
				<div class="string-config box">
					<div class="columns is-relative">
						<div class="column">
							<label for="note-${index}">String Tuning</label>
							<div class="select is-small is-fullwidth">
								<select id="note-${index}" @change=${(e) => { x.note = e.target.value; update(); }}>
									${pitchClass.map(y => html`
										<option .value=${y} ?selected=${y == x.note.split(',')[0]}>${y}</option>
									`)}
								</select>
							</div>
						</div>
					</div>
					<div class="columns is-relative">
						<div class="column">
							<label for="octave-${index}">Octave</label>
							<input id="octave-${index}" class="input is-small" type="number" .value=${x.octave}  @change=${(e) => { x.octave = parseInt(e.target.value, 10); update(); }} />
						</div>
						<div class="column">
							<label for="frets-${index}">Number of Positions</label>
							<input id="frets-${index}" class="input is-small" type="number" min="0" .value=${x.frets} @change=${(e) => { x.frets = parseInt(e.target.value, 10); update(); }} />
						</div>
						<div class="column">
							<label for="offset-${index}">String Offset</label>
							<input id="offset-${index}" class="input is-small" type="number" .value=${x.offset} @change=${(e) => { x.offset = parseInt(e.target.value, 10); update(); }} />
						</div>
						<div class="column">
							<button class="button is-danger is-fullwidth" type="button" @click=${() => remove(index)}>
								Remove String
							</button>
						</div>
					</div>
				</div>
			</li>
		`)}
		</ol>

		<button type="button" class="button is-primary is-fullwidth" @click=${() => add()}>Add String</button>
		</div>
	</section>
`;