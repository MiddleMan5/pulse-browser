import { ImageEntity, Tag, Query } from "../models";
import axios from "axios";
import PlanetIcon from "../../public/icons/planet.png";
import { RestDatasource } from "../datasources";

export class PicsumSite extends RestDatasource {
    constructor() {
        super({
            uri: "https://picsum.photos",
            auth: undefined,
            icon: PlanetIcon,
            timeout: 5000,
        });
    }

    // TODO: Get from API
    protected supportedTags = ["$random"];

    public async images(query?: Query): Promise<ImageEntity[]> {
        const queryUri = this.buildUri("/v2/list", { page: query?.page ?? 0, limit: query?.limit ?? 30 });
        const resp = await axios.get(queryUri);

        // TODO: Validate response
        const imageList = resp.data as any[];

        return imageList.map(
            (data) =>
                new ImageEntity({
                    id: data.download_url!,
                    uri: data.download_url!,
                    tags: this.supportedTags,
                })
        );
    }

    // Returns all supported image tags
    public async tags(query?: Query): Promise<Tag[]> {
        return this.supportedTags.filter((tag) => (query?.tags && tag in query.tags) || true);
    }
}
