import { Tag, Image, Site, Query } from "../models";
import PouchDB from "pouchdb-browser";
import PouchDBFind from "pouchdb-find";
import siteList from "../sites";
import { usePouch } from "use-pouchdb";

export type AnyDocument = PouchDB.Core.ExistingDocument<{ [key: string]: any }>;

// Load mongo-like (mango) query plugin
PouchDB.plugin(PouchDBFind);

// TODO: App settings state in DB
export const DefaultSettings = {
    enabled: true,
    appName: "Pulse Browser",
};

interface IndexOptions {
    name: string;
    fields: string[];
}

export interface Collection {
    name: string;
    fields: string[];
    ddoc: string;
}


function buildCollection(name: string, fields: string[]): Collection {
    const ddoc = `${name}.collection.index`;
    return { name, fields, ddoc };
}

export class PulseDatabase {
    public db: PouchDB.Database;
    protected providedCollections: Collection[] = [
        buildCollection("redux", ["doc"]),
        buildCollection("index", ["uri"]),
    ];
    
    constructor(db?: PouchDB.Database){
        this.db = db ?? new PouchDB("PulseDB", { adapter: "idb" });
    }

    protected collectionFields = ["collection"];
    protected collectionIndex: IndexOptions = {
        name: "collections",
        fields: this.collectionFields,
    };

    public async createCollection(collection: Omit<Collection, "ddoc">) {
        const newCollection = buildCollection(collection.name, collection.fields);
        await this.db.createIndex({ index: newCollection });
    }

    // Remove all documents in a collection
    public async removeCollection(collection: Collection | string) {
        const collections = await this.collections();
        const name = typeof collection === "string" ? collection : collection.name;
        const match = collections.find((c) => c.name === name);
        if (match) {
            const collectionDocs = await this.db.find({
                selector: {
                    collection: match.name,
                },
                fields: ["_id", "_rev"],
            });
            // This is literally the worst database...
            await this.db.bulkDocs(collectionDocs.docs.map((doc) => ({ ...doc, _deleted: true })));
        } else {
            console.log(`No such collection ${name} found; nothing to do`);
        }
    }

    // Get all collections names in database
    public async collectionNames(): Promise<string[]> {
        const requiredFields = this.collectionFields;
        const selector = Object.assign({}, ...requiredFields.map((f) => ({ [f]: { $gt: "" } })));
        const result = await this.db.find({ fields: requiredFields, selector });
        const names = result.docs.map((doc) => (doc as any).collection);
        // Get only unique collection names
        return [...new Set(names)];
    }

    public async collections(): Promise<Collection[]> {
        // Copy provided collections
        const collectionMap = Object.assign({}, ...this.providedCollections.map((c) => ({ [c.name]: c })));
        const providedCollectionNames = Object.keys(collectionMap);
        const foundCollectionNames = await this.collectionNames();

        // If a collection definition wasn't found (new runtime collection defined) generate a new definition
        for (const name of foundCollectionNames) {
            if (!providedCollectionNames.includes(name)) {
                // FIXME: Generate collection definition from all common keys
                continue;
            }
        }
        return Object.values(collectionMap);
    }

    public async init() {
        console.log("Database connected");
        await this.initCollections();
    }

    // Clear all created indexes
    protected async clearIndexes() {
        const collections = await this.collections();
        await Promise.all(
            collections.map(async (collection) => {
                return this.db.deleteIndex(collection);
            })
        );
    }

    protected async initCollections() {
        for (const options of this.providedCollections) {
            console.log("Creating index:", options);
            await this.db.createIndex({ index: options });
        }
    }

    // Default collections

    public async settings(): Promise<typeof DefaultSettings> {
        // FIXME: Return current settings
        return DefaultSettings;
    }

    public async sites(): Promise<Site[]> {
        return siteList;
    }

    public async images(query: Query = {}, siteNames: string[] | undefined = undefined): Promise<[Site, Image[]][]> {
        const sites = await this.sites();
        const pendingResults: Promise<[Site, Image[]]>[] = [];
        for (const site of sites) {
            // undefined should match all sites
            if (siteNames == null || siteNames?.includes(site.name)) {
                const pending = Promise.all([site, site.images(query)]);
                pendingResults.push(pending);
            }
        }
        const results = await Promise.all(pendingResults);
        return results;
    }

    public async tags(query: Query = {}): Promise<Tag[]> {
        const sites = await this.sites();
        const siteTagLists = await Promise.all(
            sites.map(async (site) => {
                return site.tags(query);
            })
        );
        const siteTags = siteTagLists.flatMap((tags) => tags);
        return siteTags;
    }
}

// Wrap usePouch for react components
export const usePulse = (dbName?: string) => new PulseDatabase(usePouch(dbName));
