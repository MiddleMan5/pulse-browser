import { ImageModel } from "../models/image.model";
import { Site, SiteProps, Tag, Query } from "../models/site.model";
import axios from "axios";

export interface PicsumSiteProps extends SiteProps {
    timeout: number;
}

export class PicsumSite extends Site implements PicsumSiteProps {
    public readonly name = "picsum";
    public readonly uri = "https://picsum.photos";
    public readonly timeout = 5000;

    // TODO: Get from API
    protected supportedTags = ["$random"];

    public async images(query?: Query): Promise<ImageModel[]> {
        const queryUri = this.buildUri([this.uri, "v2/list"], { page: query?.page ?? 0, limit: query?.limit ?? 30 });
        const resp = await axios.get(queryUri, { timeout: this.timeout });

        // TODO: Validate response
        const imageList = resp.data as any[];

        return imageList.map((data) => {
            const imageData = {
                name: data.download_url!,
                hash: "",
                sources: [data.download_url!],
                tags: [data.author],
                thumbnail: undefined,
                artists: [data.author],
                width: data.width,
                height: data.height,
            };

            // Cache found tags from images
            imageData.tags.forEach((tag) => {
                if (!(tag in this.supportedTags)) {
                    this.supportedTags.push(tag);
                }
            });

            return imageData;
        });
    }

    // Returns all supported image tags
    public async tags(query?: Query): Promise<Tag[]> {
        return this.supportedTags.filter((tag) => (query?.tags && tag in query.tags) || true);
    }
}
