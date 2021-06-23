import { ConfigViewModel } from './model';
import { html } from "lit-html";
import { config } from "../config";
import { pitchClass } from "../constants";

export const configViewTemplate = ({
	remove,
	update,
	add,
	tunings,
	currentTuning,
	setTuning,
	changeTuning
}: ConfigViewModel) => html`
	<section class="section" id="config">
		<div class="container">
			<form class="box" @submit=${event => changeTuning(event)}>
				<div class="field is-grouped">
					<label class="sr-only" for="tuning">Instrument</label>
					<div class="control is-expanded">
						<div class="select is-fullwidth">
							<select .value=${currentTuning} @change=${event => setTuning(event)} class="input">
								<option value="" disabled hidden ?selected=${!currentTuning}>Select a tuning option...</option>
								${tunings.map(x => html`
									<option ?selected=${currentTuning === x.id} .value=${x.id}>${x.name}</option> 
								`)}
							</select>
						</div>
					</div>
					<div class="control">
						<button class="button is-primary" type="submit">Load instrument</button>
					</div>
				</div>
			</form>

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