// NOTE: Heavily influenced by https://github.com/strongloop/loopback-next.git

import { v4 as uuid } from "uuid";

// Allowable model property types (in order to keep models serializable)
export type PropertyType = string | number | Function | object | undefined;

export interface AnyObject {
    [key: string]: any;
}

export type Options = AnyObject;

// Type alias for Node.js callback functions
export type Callback<T> = (err: Error | string | null | undefined, result?: T) => void;

// Type for a command
export type Command = string | AnyObject;

// Property definition for a model
export interface PropertyDefinition {
    type: PropertyType; // For example, 'string', String, or {}
    id?: boolean | number;
}

// Base config interface for model settings
export interface ModelSettings {
    // Description of model
    description?: string;
    // Additonal model-specific settings
    [key: string]: PropertyType;
}

export interface ModelDefinition {
    name?: string;
    properties?: { [name: string]: PropertyDefinition | PropertyType };
    settings?: ModelSettings;
}

export class Model implements ModelDefinition {
    readonly name: string;
    properties: { [name: string]: PropertyDefinition };
    settings: ModelSettings;
    [key: string]: PropertyType;

    constructor(definition: ModelDefinition) {
        const { name, properties, settings } = definition;

        this.name = name ?? this.constructor.name;
        this.properties = {};
        Object.entries(properties ?? {}).forEach(([k, v]) => {
            this.addProperty(k, v);
        });
        this.settings = settings ?? {};
    }

    protected addProperty(name: string, definitionOrType: PropertyDefinition | PropertyType): this {
        const definition = (definitionOrType as PropertyDefinition).type
            ? (definitionOrType as PropertyDefinition)
            : { type: definitionOrType };

        this.properties[name] = definition;
        return this;
    }

    protected addSetting(name: string, value: PropertyType): this {
        this.settings[name] = value;
        return this;
    }
}

// Recursive convert value to json, calls model's toJSON function if it exists
function asJson(value: any): any {
    if (value == null) return value;
    if (typeof value?.toJson === "function") {
        return value.toJson();
    }
    if (Array.isArray(value)) {
        return value.map((item) => asJson(item));
    }
    return value;
}

export interface Persistable {}
export interface ValueData extends Partial<Model> {}

// Generate properties from plain data
function getProperties(data: ValueData): { [name: string]: PropertyDefinition } {
    return Object.assign({}, ...Object.entries(data).map(([k, v], i) => ({ [k]: { type: typeof v, id: i } })));
}

// An object that contains attributes but has no concept of an identity (should be immutable)
export class ValueObject<Props extends ValueData = {}> extends Model implements Persistable {
    constructor(data: Props, definition?: ModelDefinition) {
        super(definition ?? { name: data?.name, properties: getProperties(data) });
        Object.assign(this, data);
    }

    // Serialize into a plain JSON object
    toJSON(): Object {
        const obj: AnyObject = {};
        Object.keys(this?.properties ?? {}).forEach((key) => {
            const val = (this as AnyObject)[key];
            if (val !== undefined) {
                obj[key] = asJson(val);
            }
        });

        return obj;
    }
}

export interface EntityData extends Partial<Model> {
    id?: string | number;
}

// An object that has a concept of a unique identity
export class Entity<Props extends EntityData = {}> extends ValueObject<Props> implements Persistable {
    readonly id: string | number;
    constructor(data: Props, definition?: ModelDefinition) {
        super(data, definition);
        this.id = data?.id ?? uuid();
    }
}

export default Entity;
