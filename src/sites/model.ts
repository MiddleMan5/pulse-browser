
import axios from "axios";
import { Grabber, IParsedDetails, IImage, ITag, ISearchQuery, IUrlOptions, IError, IParsedSearch, IPreviousSearch, IParsedTags, ITagsQuery } from "../util";

export interface TagFormat {
    case: "lower" | "upper";
    seperator: string;
};

export interface SiteAPI {
    forcedLimit: number;
    tagTypes: boolean;
};

export interface SiteConfig {

    // Supported sites
    sites: string[]

    // Supported special search modifiers
    modifiers: string[];

    // Image tag format
    tagFormat: TagFormat;

    // Icon to load for site manager
    icon: string;

    // Site api definition for building queries
    // TODO: Support multiple APIs
    api: SiteAPI;

    // Extra properties
    [key: string]: any;
};

// TODO: Define Tag class
export class Tag implements ITag{
    public readonly id?: number;
    public readonly name: string;
    public readonly count?: number;
    public readonly type?: string;
    public readonly typeId?: number;

    constructor(data: ITag){
        this.id = data?.id;
        this.name = data.name;
        this.count = data?.count;
        this.type = data.type;
        this.typeId = data?.typeId;
    }
};

export class Image {

    public readonly props: IImage;

    constructor(props: IImage) {
        this.props = props;
    }

    // Get image details
    public async details(): Promise<IParsedDetails> {
        return {};
    }
};

export class SiteModel {
    public readonly config: SiteConfig | undefined;
    protected grabber = new Grabber();
    protected timeout = 3000;


    constructor(config?: SiteConfig){
        this.config = config;
    }

    public async images(baseUrl: string, tags?: string[] | Tag[], page?: number): Promise<Image[]> {
        return [];
    }

    // Check if site is functioning correctly
    public async online(baseUrl: string): Promise<boolean> {
        return false;
    }

    // Get all tags supported by site
    public async tags(baseUrl: string) : Promise<Tag[]> {
        return [];
    }
};
