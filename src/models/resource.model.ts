import axios from "axios";

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

export interface Query {
    tags?: Tag[];
    page?: number;
    limit?: number;
}

export interface SiteProps extends AddressableResourceProps {
    // Authentication/Authorization information
    auth?: object;
    // Image data to show when browsing available sites
    icon?: any;
}

export interface SiteModel {
    // Site model configuration
    readonly props: SiteProps;

    // health check / ping
    online(): Promise<boolean>;

    // Query site for images
    images(query?: Query): Promise<Image[]>;

    // Returns all supported image tags
    tags(query?: Query): Promise<Tag[]>;

    // A unique, human readable, site name
    name: string;
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

export interface ImageProps {}

export type ValueResolver<T> = () => Promise<T>;

export class Image extends TaggedResource<Buffer> implements AddressableResourceProps {
    // TODO: ref, or notarize, or something
    protected cachedValue?: Buffer | Promise<Buffer | undefined>;
    // image uri
    public readonly uri: string;

    constructor(uri: string, value?: string | Buffer | ValueResolver<Buffer>) {
        // TODO: This is ugly
        const valueBuffer = Buffer.isBuffer(value)
            ? value
            : typeof value === "string"
            ? Buffer.from(value, "base64")
            : undefined;

        // TODO: Figure out what "tags" mean in an image constructor
        super(undefined, valueBuffer);
        if (value instanceof Function) {
            // coerce value to promise
            this.cachedValue = Promise.resolve(value())
                .then((value) => (this.cachedValue = value))
                .catch((reason) => {
                    console.error(`Failed to get image: ${uri}: ${reason ?? ""}`);
                    return undefined;
                });
        }
        // Set resource uri
        this.uri = uri;
    }

    // The real or eventual value of this tag
    public async value(): Promise<Buffer | undefined | never> {
        if (this.cachedValue === undefined) {
            if (this.uri) {
                // TODO: Handle errors, resource getting probably shouldn't be an axios thing
                // This purposefully will throw exceptions for a couple cases
                return axios.get(this.uri).then((resp) => {
                    const dataBuffer = Buffer.from(resp.data);
                    this.cachedValue = dataBuffer;
                    return this.cachedValue;
                });
            } else {
                throw Error("undefined value");
            }
        }
        return Promise.resolve(this.cachedValue);
    }
}
