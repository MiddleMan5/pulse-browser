import { AddressableResource, Tag } from "./resource.model";

export interface Image extends AddressableResource<Promise<Buffer>> {
    uri: string;
    tags: Tag[];
}
