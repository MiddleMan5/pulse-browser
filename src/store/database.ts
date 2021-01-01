import { Tag, Image, SiteModel, Query } from "../models";
import PouchDB from 'pouchdb-browser';
import PouchDBFind from "pouchdb-find";
import siteList from "../sites";

export type AnyDocument = PouchDB.Core.ExistingDocument<{[key: string]: any}>;

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

// Allows redux storage in PouchDB
// TODO: Move this somewhere else
export class PouchReduxStorage {
    protected db: PouchDB.Database;
    protected docRevs: { [key: string]: any } = {};

    constructor(db: PouchDB.Database) {
        this.db = db;
    }

    async setItem(key: string, value: any) {
        const doc = JSON.parse(value);
        const _rev = this.docRevs[key];
        const collection = "redux";
        const result = await this.db.put({ _id: key, _rev, collection, doc });
        this.docRevs[key] = result.rev;
        return result;
    }

    async getItem(key: string) {
        const doc = (await this.db.get(key)) as any;
        this.docRevs[key] = doc._rev;
        return doc?.doc;
    }

    async removeItem(key: string, value: any) {
        await this.db.remove({ _id: key, _rev: this.docRevs[key] });
        delete this.docRevs[key];
    }

    async getAllKeys() {
        return Object.keys(this.docRevs);
    }
}

function buildCollection(name: string, fields: string[]): Collection {
    const ddoc = `${name}.collection.index`;
    return { name, fields, ddoc };
}

export class PulseDatabase {
    public db = new PouchDB("PulseDB", { adapter: "idb" });
    public storage = new PouchReduxStorage(this.db);
    protected providedCollections: Collection[] = [
        buildCollection("redux", ["doc"]),
        buildCollection("images", ["id", "uri", "tags"]),
        buildCollection("tags", ["tag"]),
    ];


    protected collectionFields = ["collection"];
    protected collectionIndex: IndexOptions = {
        name: "collections",
        fields: this.collectionFields,
    };


    // Get all provided (non-special) collections in database
    public async createCollection(collection: Omit<Collection, "ddoc">) {
        const newCollection = buildCollection(collection.name, collection.fields);
        await this.db.createIndex({index: newCollection});
    }

    // Get all provided (non-special) collections in database
    public async removeCollection(collection: Collection | string) {
        const collections = await this.collections();
        const name = typeof collection === "string" ? collection : collection.name;
        const match = collections.find((c) => c.name === name);
        if (match) {
            console.log("Deleting index:", match);
            await this.db.deleteIndex(match);
        } else {
            console.log(`No such collection ${name} found; nothing to do`);
        }
    }

    // Get all collections names in database
    public async collectionNames(): Promise<string[]> {
        const requiredFields = this.collectionFields;
        const selector = Object.assign({}, ...requiredFields.map(f => ({[f]: {"$gt": ""}})))
        const result = await this.db.find({fields: requiredFields, selector })
        const names =  result.docs.map(doc => (doc as any).collection);
        // Get only unique collection names
        return [... new Set(names)];
    }

    public async collections(): Promise<Collection[]>{
        // Copy provided collections
        const collectionMap = Object.assign({}, ...this.providedCollections.map(c => ({[c.name]: c})));
        const providedCollectionNames = Object.keys(collectionMap);
        const foundCollectionNames = await this.collectionNames();

        // If a collection definition wasn't found (new runtime collection defined) generate a new definition
        for(const name of foundCollectionNames){
            if(!providedCollectionNames.includes(name)){
                // FIXME: Generate collection definition from all common keys
                continue
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

    public async sites(): Promise<SiteModel[]> {
        return siteList;
    }

    public async images(query: Query = {}): Promise<Image[]> {
        const sites = await this.sites();
        const siteImageLists = await Promise.all(
            sites.map(async (site) => {
                return site.images(query);
            })
        );
        const siteImages = siteImageLists.flatMap((images) => images);
        return siteImages;
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

// Why even make this a class?
export const pulseDatabase = new PulseDatabase();
