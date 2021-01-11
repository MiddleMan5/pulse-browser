import { Tag } from "./site.model";

export interface ImageModel {
    // Filename
    name: string;

    // FIXME: thumbnail pouchdb attachment type
    thumbnail: any;

    // URIs that this image can be retrieved with
    sources: string[];

    // All tags associated with this image
    tags: Tag[];

    // Unique hash identifying this image
    hash: string;

    // Image artists
    artists: string[];

    // Dimensions
    width: number;
    height: number;
}
