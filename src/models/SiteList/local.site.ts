import { Image, Tag, SiteProps, SiteModel, Query } from "../resource.model";
import axios from "axios";
import { FolderOpen } from "@material-ui/icons";

export interface LocalQuery extends Query {}

export class LocalSite implements SiteModel {
    public get name() {
        return this.constructor.name;
    }

    // Request timeout
    private timeout = 5000;

    public readonly props: SiteProps = {
        uri: "file://downloads",
        auth: undefined,
        //icon: FolderOpen,
    };

    // TODO: Get from API
    protected supportedTags = ["$random"];

    public async images(query?: LocalQuery): Promise<Image[]> {
        return [];
        const queryUri = `${this.props.uri}/v2/list?page=${query?.page ?? 0}&limit=${query?.limit ?? 30}`;
        const resp = await axios.get(queryUri);
        console.log("Got response:", resp);
        // TODO: Validate response
        const imageList = resp.data as any[];
        const getImage = async (download_url: string) => {
            const resp = await axios.get(download_url, { timeout: this.timeout, responseType: "arraybuffer" });
            return Buffer.from(resp.data, "binary");
        };
        return imageList.map((data) => new Image(data.download_url!, () => getImage(data.download_url!)));
    }

    // Returns all supported image tags
    public async tags(query?: LocalQuery): Promise<Tag[]> {
        return [];
        return this.supportedTags.filter((tag) => (query?.tags && tag in query.tags) || true);
    }
}
