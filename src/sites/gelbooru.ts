
import {SiteModel, SiteInterface, Image, Tag} from "./model";
import { Grabber, IParsedDetails, IImage, ISearchQuery, IUrlOptions, IError, IParsedSearch, IPreviousSearch, IParsedTags, ITagsQuery } from "../util";
import axios from "axios";
import GelbooruIcon from "../../resources/icons/gelbooru.png"

export class GelbooruModel extends SiteModel {
    constructor() {
        super({                
            name:"Gelbooru 0.2",
                icon: GelbooruIcon,
                sites: [
                    "gelbooru.com",
                    "rule34.xxx",
                    "safebooru.org"
                ],
                modifiers: ["rating:safe", "rating:questionable", "rating:explicit", "user:", "fav:", "fastfav:", "md5:", "source:", "id:", "width:", "height:", "score:", "mpixels:", "filesize:", "date:", "gentags:", "arttags:", "chartags:", "copytags:", "approver:", "parent:", "sub:", "order:id", "order:id_desc", "order:score", "order:score_asc", "order:mpixels", "order:mpixels_asc", "order:filesize", "order:landscape", "order:portrait", "order:favcount", "order:rank", "parent:none", "unlocked:rating", "sort:updated", "sort:id", "sort:score", "sort:rating", "sort:user", "sort:height", "sort:width", "sort:parent", "sort:source", "sort:updated"],
                tagFormat: {
                    case: "lower",
                    seperator: "_",
                },
                searchFormat:{
                    and: " ",
                },
                auth: {
                    session: {
                        type: "post",
                        url: "/index.php?page=account&s=login&code=00",
                        fields: [
                            {
                                id: "pseudo",
                                key: "user",
                            },
                            {
                                id: "password",
                                key: "pass",
                                type: "password",
                            },
                        ],
                        check: {
                            type: "cookie",
                            key: "user_id",
                        },
                    },
                },
                api: {
                    tagTypes: false,
                    forcedLimit: 100,
                }
            });
    }

    // Check if site is functioning correctly
    public async online(baseUrl: string): Promise<boolean> {
        try{
            const resp = await axios.get(baseUrl, {timeout: this.timeout});
            const respStr = String(resp.data);
            // TODO: This probably isn't correct
            return respStr.includes("Gelbooru");

        }catch (ex){
            console.error("Failed to query:", baseUrl)
        }
        return false;
    }

    // Parse response data and convert to tag list
    private parseImages(data: any[]): Image[]{
        const result: Image[] = [];
        data.forEach(imageData => {
            if(imageData){
                result.push(new Image(imageData));
            };
        });
        return result;
    };

    // Parse response data and convert to tag list
    private parseTags(data: any[]): Tag[]{
        const result: Tag[] = [];
        data.forEach(tagData => {
            // TODO: Don't mutate data
            tagData["name"] = tagData["tag"];
            result.push(new Tag(tagData));
        });
        return result;
    };

    public async images(baseUrl: string, tags?: string[] | Tag[], page?: number): Promise<Image[]> {
        const result: Image[] = [];
        try{
            // TODO: This is ugly
            const tagStr = tags ? (typeof tags === "string" ? tags : (tags as Tag[]).map(tag => tag.name)).join("") : "";
            const pageNum = page ?? 0;
            const apiUri = "http://" + baseUrl + "/index.php?page=dapi&s=post&q=index&json=1&pid=" + pageNum + ( tagStr ? "&tags=" + tagStr : "");
            
            // Query page
            const resp = await axios.get(apiUri, {timeout: this.timeout});
            const contentType = String(resp.headers["Content-Type"] ?? resp.headers["content-type"] ?? "");
            console.log("resp.headers", resp.headers);
            if(contentType.includes("json") &&  Array.isArray(resp.data)){
                result.push(...this.parseImages(resp.data));
            }  else {
                console.error("Invalid data in response:", resp.data);
            };    
        }catch (ex){
            console.error("Failed to get tags:", ex)
        }
        return result;
    }

    // FIXME: Call until all tags have been resolved
    // Get all tags supported by site
    public async tags(baseUrl: string) : Promise<Tag[]> {
        const result: Tag[] = [];
        try{
            const apiUri = "http://" + baseUrl + "/index.php?page=dapi&s=tag&q=index&json=1";
            const getTags = async (uri: string): Promise<Tag[]> => {
                
                const resp = await axios.get(uri, {timeout: this.timeout});
                const contentType = String(resp.headers["Content-Type"] ?? resp.headers["content-type"] ?? "");
                if(contentType.includes("json") && Array.isArray(resp.data)){
                    return this.parseTags(resp.data);
                }  else {
                    console.error("Invalid data in response:", resp.data);
                    return [];
                };    
            }
            let parsedTags = await getTags(apiUri);
            result.push(...parsedTags);

            // Keep getting
            // TODO: This is a HUGE result
            // let pageId = 1;
            // while(parsedTags.length && parsedTags.length === this.config?.api.forcedLimit){
                
            //     parsedTags = await getTags(apiUri + "&pid=" + pageId);
            //     console.log("Got more tags:", parsedTags);
            //     result.push(...parsedTags);
            //     pageId += 1;
            // }
        }catch (ex){
            console.error("Failed to get tags:", ex)
        }
        return result;
    }
}


// search: {
//     url: (query: ISearchQuery, opts: IUrlOptions, previous: IPreviousSearch | undefined): string=> {
//         const search: string = query.search.replace(/(^| )order:/gi, "$1sort:");
//         const fav = search.match(/(?:^| )fav:(\d+)(?:$| )/);
//         if (fav) {
//             const pagePart = this.grabber.pageUrl(query.page, previous, 20000,  "&pid={page}", "&pid={page}", " id:<{min}&p=1", (p: number) => (p - 1) * 50);
//             return "/index.php?page=favorites&s=view&id=" + fav[1] + pagePart;
//         } else {
//             const pagePart = this.grabber.pageUrl(query.page, previous, 20000, "&pid={page}", "&pid={page}", " id:<{min}&p=1", (p: number) => (p - 1) * 42);
//             return "/index.php?page=dapi&s=post&q=index&json=1&tags=" + encodeURIComponent(search) + pagePart;
//         }
//     },
//     parse: (src: string): IParsedSearch => {
//         if (src.indexOf("Unable to search this deep") !== -1) {
//             throw Error("Unable to search this deep");
//         }
//         const pageCountRaw = this.grabber.regexMatch('<a href="[^"]+pid=(?<page>\\d+)[^"]*"[^>]*>[^<]+</a>\\s*(?:<b>(?<last>\\d+)</b>\\s*)?(?:</div>|<br ?/>)', src);
//         const pageCount = pageCountRaw && (pageCountRaw["last"] || pageCountRaw["page"]);
//         return {
//             images: this.grabber.regexToImages('<span[^>]*(?: id="?\\w(?<id>\\d+)"?)?>\\s*<a[^>]*(?: id="?\\w(?<id_2>\\d+)"?)[^>]*>\\s*<img [^>]*(?:src|data-original)="(?<preview_url>[^"]+/thumbnail_(?<md5>[^.]+)\\.[^"]+)" [^>]*title="\\s*(?<tags>[^"]+)"[^>]*/?>\\s*</a>|<img\\s+class="preview"\\s+src="(?<preview_url_2>[^"]+/thumbnail_(?<md5_2>[^.]+)\\.[^"]+)" [^>]*title="\\s*(?<tags_2>[^"]+)"[^>]*/?>', src).map(this.completeImage),
//             tags: this.grabber.regexToTags('<li class="tag-type-(?<type>[^"]+)">(?:[^<]*<a[^>]*>[^<]*</a>)*[^<]*<a[^>]*>(?<name>[^<]*)</a>[^<]*<span[^>]*>(?<count>\\d+)</span>[^<]*</li>', src),
//             pageCount: pageCount && parseInt(pageCount, 10) / 42 + 1,
//         };
//     },
// },
// details: {
//     url: (id: string, md5: string): string => {
//         return "/index.php?page=post&s=view&id=" + id;
//     },
//     parse: (src: string): IParsedDetails => {
//         return {
//             tags: this.grabber.regexToTags('<li class="tag-type-(?<type>[^"]+)">(?:[^<]*<a[^>]*>[^<]*</a>)*[^<]*<a[^>]*>(?<name>[^<]*)</a>[^<]*<span[^>]*>(?<count>\\d+)</span>[^<]*</li>', src),
//             imageUrl: this.grabber.regexToConst("url", '<img[^>]+src="([^"]+)"[^>]+onclick="Note\\.toggle\\(\\);"[^>]*/>', src),
//         };
//     },
// },
// tags: {
//     url: (query: ITagsQuery): string => {
//         const sorts = { count: "desc", date: "asc", name: "asc" };
//         const orderBys = { count: "index_count", date: "updated", name: "tag" };
//         const page: number = (query.page - 1) * 50;
//         return "/index.php?page=tags&s=list&pid=" + page + "&sort=" + sorts[query.order] + "&order_by=" + orderBys[query.order];
//     },
//     parse: (src: string): IParsedTags => {
//         return {
//             tags: this.grabber.regexToTags('<tr>\\s*<td>(?<count>\\d+)</td>\\s*<td><span class="tag-type-(?<type>[^"]+)"><a[^>]+>(?<name>.+?)</a></span></td>', src),
//         };
//     },
// },
// check: {
//     url: (): string => {
//         return "/";
//     },
//     parse: (src: string): boolean => {
//         return src.search(/Running Gelbooru(?: Beta)? 0\.2/) !== -1
//             || src.search(/Running <a[^>]*>Gelbooru<\/a>(?: Beta)? 0\.2/) !== -1;
//     },
// },
