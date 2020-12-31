import { SiteModel } from "..";
import { PicsumSite } from "./picsum.site";
export * as PicsumSite from "./picsum.site";

// TODO: This will break if the plugins folder is missing
import PluginSiteList from "../../../plugins/sites";

//const PluginSiteList: SiteModel[] = [];

export const siteList: SiteModel[] = [new PicsumSite(), ...PluginSiteList];
// Export list of sites
export default siteList;
