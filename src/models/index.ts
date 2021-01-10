export * from "./entity.model";
export * from "./image.model";
export * from "./site.model";
export * from "./connector.model";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

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

// class-validator generates JSON schemas
export const schemas = validationMetadatasToSchemas();
