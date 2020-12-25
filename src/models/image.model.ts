import axios from "axios";
import { TaggedResource, AddressableResourceProps, Tag } from "./resource.model";

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
