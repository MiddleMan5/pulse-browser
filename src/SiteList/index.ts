
import { PicsumSite } from "./picsum.site";
export * as PicsumSite from "./picsum.site";
import { LocalSite } from "./local.site";
export * as LocalSite from "./local.site";

// TODO: This will break if the plugins folder is missing
import PluginSiteList from "../../plugins/sites";

// Export list of sites
export default [new PicsumSite(), new LocalSite(), ... PluginSiteList];