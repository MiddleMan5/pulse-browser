import PouchDB from "pouchdb-browser";
import PouchDBFind from "pouchdb-find";
import { usePouch, useAllDocs, CommonOptions, ResultType } from "use-pouchdb";
import { AnyObject } from "../models";
import { v4 as uuid } from "uuid";
import { responsiveFontSizes } from "@material-ui/core";

export type AnyDocument = PouchDB.Core.ExistingDocument<{ [key: string]: any }>;

// Load mongo-like (mango) query plugin
PouchDB.plugin(PouchDBFind);

// TODO: Better seperator?
const collectionSeperator = "/";

export interface CollectionAllDocsOptions extends Omit<PouchDB.Core.AllDocsWithinRangeOptions, "startkey" | "endkey"> {
    // restrict results to only those containing the following keys
    keys?: string[];
}

export class Collection {
    public readonly name: string;
    protected db: PouchDB.Database;
    protected indexOptions: PouchDB.Find.CreateIndexOptions;

    constructor(name: string, db: PouchDB.Database) {
        this.name = name;
        this.db = db;
        // Fields will be updated in init()
        this.indexOptions = { index: { fields: [], name, ddoc: `collection.index.${name}` } };
    }

    public async init() {
        const fields = await this.fields();
        this.indexOptions.index.fields = fields;
        await this.db.createIndex(this.indexOptions);
    }

    public buildAllDocsOptions(options?: CollectionAllDocsOptions) {
        // Limit the result to documents in this collection
        const collectionOptions: PouchDB.Core.AllDocsWithinRangeOptions = {
            startkey: `${this.name}/`,
            endkey: `${this.name}/\uffff`,
        };
        return Object.assign({}, options ?? {}, collectionOptions);
    }

    public async allDocs(options?: CollectionAllDocsOptions) {
        const opts = this.buildAllDocsOptions(options);
        const results = await this.db.allDocs(opts);
        return results;
    }

    // Get all documents belonging to this collection
    public async docs(options?: Omit<CollectionAllDocsOptions, "include_docs">) {
        const opts = Object.assign({}, options ?? {}, { include_docs: true });
        const result = await this.allDocs(opts);
        return result.rows.reduce((_docs, row) => {
            if (row?.doc) {
                _docs.push(row.doc);
            }
            return _docs;
        }, [] as PouchDB.Core.ExistingDocument<{}>[]);
    }

    // Get a unique list of all fields in all documents in collection
    public async fields() {
        const docs = await this.docs();
        return [...new Set(docs.flatMap((doc) => Object.keys(doc)))];
    }

    // Check at least one document exists in collection
    public async exists(): Promise<boolean> {
        const result = await this.allDocs({ limit: 1 });
        return result?.rows?.length > 1;
    }

    // Deletes all documents in collection
    public async destroy() {
        const docs = await this.allDocs();
        const resp = await this.db.bulkDocs(docs.rows.map((row) => ({ ...row, deleted: true })));
        return resp;
    }

    // Insert one or more documents into database
    public async insert(data: AnyDocument | AnyObject | (AnyObject | AnyDocument)[]) {
        const documents = (Array.isArray(data) ? data : [data]).map((d) => {
            const docId = d?._id ?? d?.id ?? uuid();
            return { ...d, _id: `${this.name}/${docId}` };
        });
        const result = await this.db.bulkDocs(documents);
        return result;
    }
}

export class PulseDatabase {
    public db: PouchDB.Database;
    protected cachedCollections: { [name: string]: Collection } = {};

    constructor(db?: PouchDB.Database) {
        this.db = db ?? new PouchDB("PulseDB", { adapter: "idb" });
    }

    // Get all collections names in database
    public async collectionNames(): Promise<string[]> {
        // Find all keys starting with "{name}/" and at least one document
        const result = await this.db.allDocs({});
        return result.rows.reduce((names, row) => {
            const rowId = row.id;
            if (rowId.includes(collectionSeperator)) {
                const collectionName = rowId.split(collectionSeperator)[0];
                if (!names.includes(collectionName)) {
                    names.push(collectionName);
                }
            }
            return names;
        }, [] as string[]);
    }

    // Get a new collection
    public collection(name: string) {
        return name in this.cachedCollections ? this.cachedCollections[name] : new Collection(name, this.db);
    }

    public async init() {
        console.log("Database connected");
        // Initialize collections
        await this.collections();
    }

    // initialize all collections and return list of collections
    public async collections() {
        const names = await this.collectionNames();
        const collections = names.map((name) => this.collection(name));
        const pendingInit: Promise<void>[] = [];
        collections.forEach((c) => {
            const id = c.name;
            if (!(id in this.cachedCollections)) {
                pendingInit.push(c.init());
                this.cachedCollections[id] = c;
            }
        });
        await Promise.all(pendingInit);
        return collections;
    }
}

// Wrap usePouch for react components
export const usePulse = (dbName?: string) => new PulseDatabase(usePouch(dbName));

export type UseCollectionOptions = CommonOptions & CollectionAllDocsOptions;

// Infer tuple type from array literal
const tuple = <T extends any[]>(...args: T): T => args;

// Use a specific collection and associated documents from the database
export const useCollection = (name: string, options?: UseCollectionOptions) => {
    const pulse = usePulse(options?.db);
    const collection = pulse.collection(name);
    const opts: UseCollectionOptions = collection.buildAllDocsOptions(options);
    if (options?.db != null) {
        opts.db = options.db;
    }
    const { rows, loading, error } = useAllDocs(opts);
    return tuple(rows, loading, error, collection);
};
