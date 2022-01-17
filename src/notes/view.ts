import { html, TemplateResult } from "lit-html";
import { config } from "../config";
import { pitchClass, octaveNotes } from "../constants";
import { NoteViewModel } from "./model";

export const noteViewTemplate = ({
	update,
	notes
}: NoteViewModel) => html`
	<section class="section" id="notes">
		<div class="container">
			<div class="columns">
				<div class="column">
					<div class="select is-fullwidth">
						<select>
							<option>Choose a key</option>
						</select>
					</div>
				</div>
				<div class="column">
					<div class="chromaticcircle">
						${notes.map((x, i) => html`
							<label class="button b${i + 1} ${x.indexOf(',') > -1 ? 'button-blackkey' : 'button-whitekey'}">
								<span>${x.replace(',', '/')}</span>
								<input type="checkbox" class="is-sr-only" .value=${x} @click=${update}/>
							</label>
						`)}
					</div>
				</div>
			</div>
		</div>
	</section>
`;