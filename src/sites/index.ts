import { SiteModel } from "../models";
import { PicsumSite } from "./picsum.site";
export * as PicsumSite from "./picsum.site";

// TODO: Design general plugin interface
let PluginSiteList: SiteModel[] | undefined;
try {
    PluginSiteList = require("../../../plugins/sites").default;
} catch (ex) {
    console.debug("Unable to import site plugins:", ex);
}

export const siteList: SiteModel[] = [new PicsumSite()];
if (PluginSiteList != null) {
    siteList.push(...PluginSiteList);
}
// Export list of sites
export default siteList;
