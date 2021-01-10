// NOTE: Heavily influenced by https://github.com/strongloop/loopback-next.git

import { v4 as uuid } from "uuid";
import { TypeResolver, Class, PrototypeOf, Type } from "../util";
import { validate, IsString, IsNotEmpty } from "class-validator";

// Allowable model property types (in order to keep models serializable)
export type PropertyType = string | number | Function | object | undefined | TypeResolver<Model> | Type<any>;

export interface AnyObject {
    [key: string]: any;
}

export interface ModelProps {
    name: string;
}

export abstract class Model implements ModelProps {
    @IsString()
    public readonly name = this.constructor.name;
    [key: string]: PropertyType;

    public async validate() {
        return validate(this);
    }

    public toJSON(): Object {
        const obj: AnyObject = {};
        Object.keys(this).forEach((key) => {
            const val = (this as AnyObject)[key];
            if (val !== undefined) {
                obj[key] = asJson(val);
            }
        });

        return obj;
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

export interface EntityProps extends Omit<ModelProps, "name"> {
    id: string | number;
}

// An object that has a concept of a unique identity
export class Entity extends Model implements EntityProps {
    @IsNotEmpty()
    readonly id: string | number = uuid();
}

export default Entity;
