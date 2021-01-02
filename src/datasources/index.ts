import { Site } from "../models";
import { PicsumSite } from "./picsum.site";
export * as PicsumSite from "./picsum.site";

// NOTE: Look into the following web scraper https://github.com/ayakashi-io/ayakashi/tree/master/src

// TODO: Design general plugin interface
let PluginSiteList: Site[] | undefined;
try {
    PluginSiteList = require("../../plugins/sites").default;
} catch (ex) {
    console.debug("Unable to import site plugins:", ex);
}

export const siteList: Site[] = [new PicsumSite()];
if (PluginSiteList != null) {
    siteList.push(...PluginSiteList);
}
// Export list of sites
export default siteList;
