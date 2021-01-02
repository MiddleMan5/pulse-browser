import { Tag } from "./site.model";
import { Entity, EntityData } from "./entity.model";

export interface ImageProps extends EntityData {
    uri: string;
    tags: Tag[];
}

export class ImageEntity extends Entity<ImageProps> {}
