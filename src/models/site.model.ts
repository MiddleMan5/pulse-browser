import { ImageEntity } from "./image.model";
import { Entity } from "./entity.model";
import { IsFQDN, IsNotEmpty } from "class-validator";

export type Tag = string;

export interface Query {
    tags?: Tag[];
    page?: number;
    limit?: number;
}

export interface SiteProps {
    uri: string;
    label: string;
}

export abstract class Site extends Entity implements SiteProps {
    @IsFQDN()
    @IsNotEmpty()
    uri: string = "";

    @IsNotEmpty()
    // A unique, human readable, site name
    label: string = "";

    // Query site for images
    images(query?: Query): Promise<ImageEntity[]> {
        throw new Error("Not Implemented");
    }

    // Returns all supported image tags
    tags(query?: Query): Promise<Tag[]> {
        throw new Error("Not Implemented");
    }

    constructor(data: SiteProps) {
        super();
        this.uri = data.uri;
        this.label = data.label;
    }
}
