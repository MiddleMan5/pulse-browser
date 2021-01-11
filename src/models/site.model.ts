import { ImageModel } from "./image.model";

export interface AnyObject {
    [key: string]: any;
}

export type Tag = string;

export interface Query {
    tags: Tag[];
    page: number;
    limit: number;
}

export interface SiteProps {
    // Query site for images
    images(query?: Query): Promise<ImageModel[]>;

    // Returns all supported image tags
    tags(query?: Query): Promise<Tag[]>;

    // A unique, human readable, site name
    name: string;

    // The root api uri
    uri: string;

    // Authentication/Authorization information
    auth?: object;

    // Image data to show when browsing available sites
    icon?: any;
}

export class Site {
    public buildUri(path?: string | string[], params?: AnyObject): string {
        // FIXME: Use a library to sanitize path
        if (Array.isArray(path)) {
            path = path.join("/");
        }
        const paramStr = Object.entries(params ?? {})
            .map((kv) => kv.map(encodeURIComponent).join("="))
            .join("&");

        return `${path}?${paramStr}`;
    }
}
