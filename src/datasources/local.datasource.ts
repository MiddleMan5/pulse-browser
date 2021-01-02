import { DataSource, AnyObject, Command, Entity } from "../models";
import { Folder as FolderIcon } from "@material-ui/icons";
import _path from "path";
import { promises as fs } from "fs";

export interface LocalEntityProps extends Entity {
    path?: string;
}

export interface LocalQuery {
    regexp?: RegExp;
}

export interface LocalDatasourceConfig extends AnyObject {
    directory: string;
    recursive?: boolean;
    icon?: typeof FolderIcon;
}

export class LocalDatasource extends DataSource<LocalEntityProps, LocalQuery> {
    config: LocalDatasourceConfig;
    constructor(config: LocalDatasourceConfig) {
        super({});
        config.recursive = config?.recursive ?? false;
        config!.icon = config?.icon ?? FolderIcon;
        this.config = config;
    }

    async init(): Promise<void> {
        if (!(await this.online())) {
            console.log("Creating directory:", this.config.directory);
            await fs.mkdir(this.config.directory);
        }
    }

    async online(): Promise<boolean> {
        try {
            await fs.access(this.config.directory);
            return true;
        } catch (ex) {
            return false;
        }
    }

    async find(query?: LocalQuery): Promise<Entity<LocalEntityProps>[]> {
        let paths = await fs.readdir(this.config.directory);
        if (query?.regexp) {
            paths = paths.filter(query.regexp.test);
        }
        return paths.map((path) => {
            const name = _path.basename(path);
            // TODO: Maybe use user@<hostname> syntax since id is supposed to be universal
            return new Entity({ path, name, id: `file://${path}` });
        });
    }
}