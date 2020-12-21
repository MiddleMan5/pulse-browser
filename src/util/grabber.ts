
import {IPreviousSearch, IImage, ITag, IPool} from "./types";

export class Grabber {

    makeArray = (val: any, allowFalsy: boolean = false): any[] => {
        if (!val && !allowFalsy) {
            return [];
        }
        if (!Array.isArray(val)) {
            return [ val ];
        }
        return val;
    };
    
    regexMatches = (regexp: string, src: string): string[] => {
        return RegExp(regexp).exec(src) ?? [];
    };

    regexMatch = (regexp: string, src: string): any => {
        const matches = this.regexMatches(regexp, src);
        if (matches && matches.length > 0) {
            return matches[0];
        }
        return undefined;
    };
    
    mapObject = (obj: any, fn: (v: any) => any): any => {
        const ret: any = {};
        for (const k in obj) {
            ret[k] = fn(obj[k]);
        }
        return ret;
    };
    
    typedXML = (val: any): any => {
        if (val && typeof val === "object" && ("#text" in val || "@attributes" in val)) {
            const txt = val["#text"];
    
            const isNil = "@attributes" in val && "nil" in val["@attributes"] && val["@attributes"]["nil"] === "true";
            if (isNil) {
                return null;
            }
    
            const type = "@attributes" in val && "type" in val["@attributes"] ? val["@attributes"]["type"] : undefined;
            if (type === "integer") {
                return parseInt(txt, 10);
            } else if (type === "array") {
                delete val["@attributes"]["type"];
                if (Object.keys(val["@attributes"]).length === 0) {
                    delete val["@attributes"];
                }
                return this.mapObject(val, this.typedXML);
            }
    
            if (txt !== undefined) {
                return txt;
            }
        }
    
        if (val && val instanceof Array) {
            return val.map(this.typedXML);
        }
    
        if (val && typeof val === "object") {
            if (Object.keys(val).length === 0) {
                return "";
            }
    
            return this.mapObject(val, this.typedXML);
        }
    
        return val;
    };
    
    mapFields = (data: any, map: { [key: string]: string }): any => {
        const result: any = {};
        if (typeof data !== "object") {
            return result;
        }
        for (const to in map) {
            const from = map[to].split(".");
            let val: any = data;
            for (const part of from) {
                val = part in val && val[part] !== null ? val[part] : undefined;
            }
            result[to] = val !== data ? val : undefined;
        }
        return result;
    };
    
    countToInt = (str: string): number | undefined => {
        if (!str) {
            return undefined;
        }
        let count: number;
        const normalized = str.toLowerCase().trim().replace(/,/g, "");
        if (normalized.slice(-1) === "k") {
            const withoutK = normalized.substring(0, normalized.length - 1).trim();
            count = parseFloat(withoutK) * 1000;
        } else {
            count = parseFloat(normalized);
        }
        return Math.round(count);
    };
    
    fileSizeToInt = (str: string): number => {
        if  (typeof str !== "string") {
            return str as any;
        }
        const res = str.match(/^(\d+(?:\.\d+))\s*(\w+)$/);
        if (res) {
            const val = parseFloat(res[1]);
            const unit = res[2].toLowerCase();
            if (unit === "mb") {
                return Math.round(val * 1024 * 1024);
            }
            if (unit === "kb") {
                return Math.round(val * 1024);
            }
            return Math.round(val);
        }
        return parseInt(str, 10);
    };
    
    fixPageUrl = (url: string, page: number, previous: IPreviousSearch | undefined, pageTransformer?: (page: number) => number): string => {
        if (!pageTransformer) {
            pageTransformer = (p: number) => p;
        }
        url = url.replace("{page}", String(pageTransformer(page)));
        if (previous) {
            url = url.replace("{min}", previous.minId);
            url = url.replace("{max}", previous.maxId);
            url = url.replace("{min-1}", previous.minIdM1);
            url = url.replace("{max+1}", previous.maxIdP1);
        }
        return url;
    };
    
    pageUrl = (page: number, previous: IPreviousSearch | undefined, limit: number, ifBelow: string, ifPrev: string, ifNext: string, pageTransformer?: (page: number) => number): string => {
        const pageLimit = pageTransformer ? pageTransformer(page) : page;
        if (pageLimit <= limit || limit < 0) {
            return this.fixPageUrl(ifBelow, page, previous, pageTransformer);
        };
        if (previous && previous.page === page + 1) {
            return this.fixPageUrl(ifPrev, page, previous, pageTransformer);
        }
        if (previous && previous.page === page - 1) {
            return this.fixPageUrl(ifNext, page, previous, pageTransformer);
        }
        throw new Error("You need valid previous page information to browse that far");
    };
    
    regexToImages = (regexp: string, src: string): IImage[] => {
        const images: IImage[] = [];
        const matches = this.regexMatches(regexp, src);
        console.log("Got matches", src)
        for (const match of matches) {
            console.log("Got match", match)
            // let image: any = {};
            // if (match.includes('json')) {
            //     const data = JSON.parse(match)["json"];
            //     for (const key in data) {
            //         image[key] = data[key];
            //     }
            // }
            // if (image?.id) {
            //     image.id = parseInt(image.id, 10);
            // }
            // if (image?.file_size) {
            //     image.file_size = this.fileSizeToInt(image.file_size);
            // }
            // images.push(image as IImage);
        }
        return images;
    };
    
    pick = (obj: any, keys: string[]): any => {
        return keys.reduce((ret, key) => {
            if (key in obj && obj[key] !== undefined) {
                ret[key] = obj[key];
            }
            return ret;
        }, {} as any);
    };
    
    regexToTags = (regexp: string, src: string): ITag[] => {
        const tags: ITag[] = [];
        const uniques: { [key: string]: boolean } = {};
    
        const matches = this.regexMatches(regexp, src);
        // for (const match of matches) {
        //     if (match["name"] in uniques) {
        //         continue;
        //     }
        //     if ("count" in match) {
        //         match["count"] = this.countToInt(match["count"]);
        //     }
        //     tags.push(this.pick(match, ["id", "name", "count", "type", "typeId"]));
        //     uniques[match["name"]] = true;
        // }
        return tags;
    };
    
    regexToPools = (regexp: string, src: string): IPool[] => {
        const pools: IPool[] = [];
        const matches = this.regexMatches(regexp, src);
        // for (const match of matches) {
        //     pools.push(match);
        // }
        return pools;
    };
    
    regexToConst = (key: string, regexp: string, src: string): string | undefined => {
        const matches = this.regexMatches(regexp, src);
        // for (const match of matches) {
        //     return match[key];
        // }
        return undefined;
    };

    parseXML(src: string): any{
        throw new Error("Not implemented");
    }

};