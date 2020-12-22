
import { PicsumSite } from "./picsum.site";
export * as PicsumSite from "./picsum.site";
import { LocalSite } from "./local.site";
export * as LocalSite from "./local.site";

// Export list of sites
export default [new PicsumSite(), new LocalSite()];