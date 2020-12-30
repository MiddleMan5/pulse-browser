// A way to index a specific resource
export type Tag = string;

export interface Resource<ValueType> {
    // object id
    id: number | string;
    value: () => ValueType;
}

export interface AddressableResource<ValueType> extends Resource<ValueType> {
    uri: string;
}
