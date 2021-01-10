export * from "./types";
import { Language } from "../models";

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
    return { iso, title, model };
});

export const LanguageMap = Object.assign(
    {},
    ...LanguageList.map((lng) => {
        return { [lng.iso]: lng };
    })
);

export const isRenderer = () => process && (process as any)?.type === "renderer";

export const noOp = (...args: any[]) => ({});

// Wrap a function while preserving types

// Source: https://stackoverflow.com/a/61212868

export type AnyFunction = (...args: any[]) => any;

export const wrap = <Func extends AnyFunction>(fn: Func): ((...args: Parameters<Func>) => ReturnType<Func>) => {
    const wrappedFn = (...args: Parameters<Func>): ReturnType<Func> => {
        // your code here
        return fn(...args);
    };
    return wrappedFn;
};

// Get the arguments of a function as a tuple
// Source: https://stackoverflow.com/a/51851844

export type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;
