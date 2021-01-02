import { Image } from "./image.model";

export type Tag = string;

export interface Query {
    tags?: Tag[];
    page?: number;
    limit?: number;
}

export interface SiteProps {
    uri: string;
    // Authentication/Authorization information
    auth?: object;
    // Image data to show when browsing available sites
    icon?: any;
}

export interface Site {
    // Site model configuration
    readonly props: SiteProps;

    // Query site for images
    images(query?: Query): Promise<Image[]>;

    // Returns all supported image tags
    tags(query?: Query): Promise<Tag[]>;

    // A unique, human readable, site name
    name: string;
}
