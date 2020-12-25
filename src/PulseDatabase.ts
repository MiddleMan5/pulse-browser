import { Tag, Image, SiteModel, Query } from "./models";
import PouchDB from "pouchdb-browser";
import PouchDBFind from "pouchdb-find";
import siteList from "./models/SiteList";

// Load mongo-like (mango) query plugin
PouchDB.plugin(PouchDBFind);

interface IndexOptions {
    name: string;
    fields: string[];
}

export interface Collection {
    name: string;
    fields: string[];
    ddoc: string;
}

export class PulseDatabase {
    protected db = new PouchDB("PulseDB", { adapter: "idb" });
    protected providedIndexes: IndexOptions[] = [
        {
            name: "images",
            fields: ["tags"],
        },
        {
            name: "tags",
            fields: ["alias", "value", "sites"],
        },
        {
            name: "settings",
            fields: ["type", "value"],
        },
    ];

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

    // Get all provided (non-special) collections in database
    public async createCollection(collection: Omit<Collection, "ddoc">) {
        const ddoc = `${collection.name}.collection.index`;
        const newCollection = {
            index: { name: collection.name, fields: collection.fields, ddoc },
        };
        await this.db.createIndex(newCollection);
    }

    // Get all provided (non-special) collections in database
    public async removeCollection(collection: Collection | string) {
        const collections = await this.collections();
        const name = typeof collection === "string" ? collection : collection.name;
        const match = collections.find((c) => c.name === name);
        if (match) {
            await this.db.deleteIndex(match);
        } else {
            console.log(`No such collection ${name} found; nothing to do`);
        }
    }

    // Get all provided (non-special) collections in database
    public async collections(): Promise<Collection[]> {
        const { indexes } = await this.db.getIndexes();
        const collections: Collection[] = [];
        await indexes.forEach(async (index) => {
            const { name, type, ddoc, def } = index;
            if (ddoc != null && type != "special") {
                const fields = def.fields.flatMap((field) => Object.keys(field));
                collections.push({ name, fields: fields, ddoc });
            }
        });
        return collections;
    }

    public async init() {
        console.log("Database connected");
        await this.initIndexes();
    }

    // Clear all created indexes
    protected async clearIndexes() {
        const collections = await this.collections();
        await collections.forEach(async (collection) => {
            await this.db.deleteIndex(collection);
        });
    }

    protected async initIndexes() {
        for (const options of this.providedIndexes) {
            console.log("Creating index:", options);
            await this.db.createIndex({ index: { ...options } });
        }
    }
}

// Why even make this a class?
export const pulseDatabase = new PulseDatabase();
