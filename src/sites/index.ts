
import {SiteModel, Image, Tag} from "./model";
import {GelbooruModel} from "./gelbooru";


export class Site {

    public readonly baseUrl: string;
    public readonly model: SiteModel;

    constructor(baseUrl: string, model: SiteModel){
        this.baseUrl = baseUrl;
        this.model = model;
    }

    public async images(tags?: string[] | Tag[], page?: number): Promise<Image[]> {
        return await this.model.images(this.baseUrl, tags, page);
    }

    // Check if site is functioning correctly
    public async online(): Promise<boolean> {
        return await this.model.online(this.baseUrl);
    }

    // Get all tags supported by site
    public async tags() : Promise<Tag[]> {
        return await this.model.tags(this.baseUrl);
    }
};

// TODO: Do this dynamically
const SiteModels: SiteModel[] = [new GelbooruModel()]
const siteMap: {[url: string]: Site} = {};

// Build model map for all supported urls
SiteModels.forEach(model => model.config!.sites!.forEach(url => {
    if(url in siteMap){
        console.warn("Overriding site model:", url);
    }
    siteMap[url] = new Site(url, model);   
}));

export const Sites = Object.entries(siteMap).map(([, site]) => site);