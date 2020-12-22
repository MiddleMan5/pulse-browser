import { Image, Tag, SiteProps, SiteModel, Query } from "../models/resource.model";
import axios from "axios";
import PlanetIcon from "../../resources/icons/planet.png";

export interface PicsumQuery extends Query {}

export class PicsumSite implements SiteModel {
    public get name() {
        return this.constructor.name;
    }

    // Request timeout
    private timeout = 5000;

    public readonly props: SiteProps = {
        uri: "https://picsum.photos",
        auth: undefined,
        icon: PlanetIcon,
    };

    // Remote image cache
    protected maxCachedImages = 1000;
    protected imageCache: {[uri: string]: any} = {};

    // Clean up cache if images exceed arbitrary value
    protected validateCache(){
        if(Object.keys(this.imageCache).length >= this.maxCachedImages){
            this.imageCache = {};
        }
    }

    // TODO: Get from API
    protected supportedTags = ["$random"];

    public async images(query?: PicsumQuery): Promise<Image[]> {
        const queryUri = `${this.props.uri}/v2/list?page=${query?.page ?? 0}&limit=${query?.limit ?? 30}`;
        const resp = await axios.get(queryUri);
        
        this.validateCache();

        // TODO: Validate response
        const imageList = resp.data as any[];
        const resolveImage = async (uri: string) => {
            // TODO: Provide global image caching in SiteModel
            if(uri in this.imageCache && this.imageCache[uri]){
                return this.imageCache[uri];
            }
            const resp = await axios.get(uri, { timeout: this.timeout});
            const imageData = resp.data;
            this.imageCache[uri] = imageData;
            return imageData;
        };
        return imageList.map((data) => new Image(data.download_url!, () => resolveImage(data.download_url!)));
    }

    // Returns all supported image tags
    public async tags(query?: PicsumQuery): Promise<Tag[]> {
        return this.supportedTags.filter((tag) => (query?.tags && tag in query.tags) || true);
    }
}
