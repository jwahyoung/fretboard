import { TemplateResult } from "lit-html";

export type View<T> = (m: T) => TemplateResult;
