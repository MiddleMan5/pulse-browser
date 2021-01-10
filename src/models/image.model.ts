import { Tag } from "./site.model";
import { Entity, EntityProps } from "./entity.model";

export interface ImageProps extends EntityProps {
    uri?: string;
    tags: Tag[];
}

export class ImageEntity extends Entity implements ImageProps {
    public uri?: string;
    public tags: Tag[] = [];

    constructor(data: ImageProps) {
        super();
        Object.assign(this, data);
    }
}
