
import {Image, Tag, SiteProps, SiteModel, Query} from "../models/resource.model";
import axios from "axios";
import PlanetIcon from "../../resources/icons/planet.png"

export interface PicsumQuery extends Query {

};

export class PicsumSite implements SiteModel {

    public get name(){
        return PicsumSite.constructor.name;
    }

    // Request timeout
    private timeout = 5000;

    public readonly props: SiteProps = {
        uri: "https://picsum.photos",
        auth: undefined,
        icon: PlanetIcon,
    };

    // TODO: Get from API
    protected supportedTags = ["$random"];

    // Check if site is functioning correctly
    public async online(): Promise<boolean> {
        try{
            if(this.props?.uri){
                const resp = await axios.get(this.props.uri, {timeout: this.timeout});
                return resp.status === 200;
            }
        }catch (ex){
            console.error("Failed to query:", this.props.uri)
        }
        return false;
    }

    public async images(query?: PicsumQuery): Promise<Image[]> {
        const queryUri = `${this.props.uri}/v2/list?page=${query?.page ?? 0}&limit=${query?.limit ?? 30}`;
        const resp = await axios.get(queryUri);
        console.log("Got response:", resp);
        // TODO: Validate response
        const imageList = resp.data as any[];
        const getImage = async (download_url: string) => {
            const resp = await axios.get(download_url, {timeout: this.timeout, responseType: 'arraybuffer'});
            return Buffer.from(resp.data, 'binary');
        };
        return imageList.map(data => new Image(data.download_url!, () => getImage(data.download_url!)));
    }

    // Returns all supported image tags
    public async tags(query?: PicsumQuery): Promise<Tag[]> {
        return this.supportedTags.filter(tag => query?.tags && tag in query.tags || true);
    }
}
