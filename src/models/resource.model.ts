// A way to index a specific resource
export type Tag = string;

export class Resource<Props> {
    // object id
    id: () => number | string | Tag | undefined = () => undefined;
    constructor(props?: Props) {
        Object.assign(this, props);
    }
    public get json(): Props {
        // FIXME: This is dumb
        return JSON.parse(JSON.stringify(this)) as Props;
    }
}

export interface AddressableResourceProps {
    uri?: string;
}

export interface TaggedResourceProps {
    tag?: Tag | Tag[];
}

// Tag/ID to value mapping
export class TaggedResource<ValueType> extends Resource<TaggedResourceProps> {
    // TODO: ref, or notarize, or something
    protected cachedValue?: ValueType | Promise<ValueType | undefined>;
    protected setCachedValue = (value: ValueType | undefined) => (this.cachedValue = value);

    constructor(tag?: Tag | Tag[], value?: ValueType) {
        super({ tag });
        // NOTE: Not really a reason for this, just looks interesting
        this.setCachedValue(value);
    }

    // The real or eventual value of this tag
    public async value(): Promise<ValueType | undefined | never> {
        if (this.cachedValue === undefined) {
            throw Error("value undefined");
        }
        return Promise.resolve(this.cachedValue);
    }
}
