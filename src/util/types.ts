export interface ITag {
    id?: number;
    name: string;
    count?: number;
    type?: string;
    typeId?: number;
}
export interface ITagType {
    id: number;
    name: string;
}
export interface IImage {
    // Known "meaningful" tokens
    type?: "image" | "gallery";
    md5?: string;
    author?: string;
    name?: string;
    status?: string;
    id: number | string;
    score?: number;
    parent_id?: number | string;
    author_id?: number | string;
    has_children?: boolean;
    has_note?: boolean;
    has_comments?: boolean;
    sources?: string[];
    source?: string;
    position?: number;
    gallery_count?: number;
    page_url?: string;
    rating?: string;
    tags?: string[] | ITag[];
    ext?: string;
    created_at?: string;
    date?: string;

    // Full size
    file_url?: string;
    width?: number;
    height?: number;
    file_size?: number;
    rect?: string;

    // Sample
    sample_url?: string;
    sample_width?: number;
    sample_height?: number;
    sample_file_size?: number;
    sample_rect?: string;

    // Thumbnail
    preview_url?: string;
    preview_width?: number;
    preview_height?: number;
    preview_file_size?: number;
    preview_rect?: string;

    // Additional raw tokens to pass to the filename
    tokens?: {
        [key: string]: any; 
    };
}
export interface IPool {
    id?: number;
    name: string;
    previous?: number;
    current?: number;
    next?: number;
}

export interface IUrl {
    url: string;
    headers?: { [key: string]: string };
}

export interface IError {
    error: string;
}
export interface IParsedSearch {
    images: IImage[];
    tags?: ITag[] | string[];
    wiki?: string;
    pageCount?: number;
    imageCount?: number;
    urlNextPage?: string;
    urlPrevPage?: string;
}
export interface IParsedTagTypes {
    types: ITagType[];
}
export interface IParsedTags {
    tags: ITag[] | string[];
}
export interface IParsedDetails {
    pools?: IPool[];
    tags?: ITag[] | string[];
    imageUrl?: string;
    createdAt?: string;
}
export interface IParsedGallery extends IParsedSearch {}

type IAuthField = IAuthNormalField | IAuthConstField | IAuthHashField;
export interface IAuthFieldBase {
    key?: string;
}
export interface IAuthNormalField extends IAuthFieldBase {
    id: string;
    type?: "text" | "password" | "salt";
    def?: string;
}
export interface IAuthConstField extends IAuthFieldBase {
    type: "const";
    value: string;
}
export interface IAuthHashField extends IAuthFieldBase {
    type: "hash";
    hash: "md5" | "sha1";
    salt: string;
}

type IAuthCheck = IAuthCheckCookie | IAuthCheckMaxPage;
export interface IAuthCheckCookie {
    type: "cookie";
    key: string;
}
export interface IAuthCheckMaxPage {
    type: "max_page";
    value: number;
}

type IAuth = IBasicAuth | IOauth2Auth | IHttpAuth | IHttpBasicAuth;
export interface IOauth2Auth {
    type: "oauth2";
    authType: "password" | "client_credentials" | "header_basic";
    requestUrl?: string;
    tokenUrl?: string;
    refreshTokenUrl?: string;
    scope?: string[];
}
export interface IBasicAuth {
    type: "url";
    fields: IAuthField[];
    check?: IAuthCheck;
}
export interface IHttpAuth {
    type: "get" | "post";
    url: string;
    fields: IAuthField[];
    check?: IAuthCheck;
}
export interface IHttpBasicAuth {
    type: "http_basic";
    passwordType?: "password" | "apiKey";
    check?: IAuthCheck;
}

export interface ITagFormat {
    case: "lower" | "upper_first" | "upper" | "caps";
    wordSeparator: string;
}

type SearchFormat = ISearchFormatBasic | ISearchFormatFull;
export interface ISearchFormatBasic {
    and: ISearchFormatType | string;
}
export interface ISearchFormatFull extends ISearchFormatBasic {
    or: ISearchFormatType | string;
    parenthesis: boolean;
    precedence: "and" | "or";
}
export interface ISearchFormatType {
    separator: string;
    prefix?: string;
}

export interface ISearchQuery {
    search: string;
    page: number;
}
export interface IGalleryQuery {
    id: string;
    md5: string;
    page: number;
}
export interface ITagsQuery {
    page: number;
    order: "count" | "date" | "name";
}

export interface IUrlOptions {
    limit: number;
    baseUrl: string;
    loggedIn: boolean;
}

export interface IPreviousSearch {
    page: number;
    minIdM1: string;
    minId: string;
    minDate: string;
    maxId: string;
    maxIdP1: string;
    maxDate: string;
}

export interface IApi {
    name: string;
    auth: string[];
    maxLimit?: number;
    forcedLimit?: number;
    search: {
        parseErrors?: boolean;
        url: (query: ISearchQuery, opts: IUrlOptions, previous: IPreviousSearch | undefined) => IUrl | IError | string;
        parse: (src: string, statusCode: number) => IParsedSearch | IError;
    };
    details?: {
        parseErrors?: boolean;
        url: (id: string, md5: string) => IUrl | IError | string;
        parse: (src: string, statusCode: number) => IParsedDetails | IError;
    };
    gallery?: {
        parseErrors?: boolean;
        url: (query: IGalleryQuery, opts: IUrlOptions) => IUrl | IError | string;
        parse: (src: string, statusCode: number) => IParsedGallery | IError;
    };
    tagTypes?: {
        parseErrors?: boolean;
        url: () => IUrl | IError | string;
        parse: (src: string, statusCode: number) => IParsedTagTypes | IError;
    } | false;
    tags?: {
        parseErrors?: boolean;
        url: (query: ITagsQuery, opts: IUrlOptions) => IUrl | IError | string;
        parse: (src: string, statusCode: number) => IParsedTags | IError;
    };
    check?: {
        parseErrors?: boolean;
        url: () => IUrl | IError | string;
        parse: (src: string, statusCode: number) => boolean | IError;
    };
}
export interface ISource {
    name: string;
    modifiers?: string[];
    tokens?: string[];
    forcedTokens?: string[];
    tagFormat?: ITagFormat;
    searchFormat?: SearchFormat;
    auth?: { [id: string]: IAuth };
    apis: { [id: string]: IApi };
}
