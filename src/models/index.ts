export * from "./entity.model";
export * from "./image.model";
export * from "./site.model";
export * from "./datasource.model";

export type Editor = "@pulsebrowser/html-editor" | "@pulsebrowser/json-editor" | "@pulsebrowser/text-editor";

export interface FileAssociation {
    type: string;
    viewer: string;
    color?: string;
    editor?: Editor;
}

export interface Language {
    iso: string;
    title: string;
    // Fixme: Model type
    model?: any;
}

export interface Keybinding {
    name: string;
    command: string;
}
