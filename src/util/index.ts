
import {Language} from "../models";

// FIXME: Language support is just a prototype right now

// TODO: Generate dynamically
export const LanguageIsos = ["en", "es", "fr"];
// Typescript sugar
export type LanguageIso = typeof LanguageIsos[number];

// Load exported themeOptions from every listed theme file
export const LanguageList: Language[] = LanguageIsos.map((iso) => {
    const data = require(`./locales/${iso}`).default;
    const model = data["model"]!;
    const title = String(data["title"]!);
    return {iso, title, model};
});

export const LanguageMap = Object.assign({}, ...LanguageList.map(lng => {return {[lng.iso]: lng}}))

export const isRenderer = () => process && (process as any)?.type === "renderer";
