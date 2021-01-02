import { DataSource, AnyObject, Command, Entity } from "../models";
import { Http as HttpIcon } from "@material-ui/icons";
import axios from "axios";

export interface RestEntityProps extends Entity {
    uri?: string;
    tags?: string[];
}

export interface RestQuery {
    regexp?: RegExp;
}

export interface RestDatasourceConfig extends AnyObject {
    uri: string;
    auth?: string;
    timeout?: number;
    icon?: typeof HttpIcon;
}

export class RestDatasource extends DataSource<RestEntityProps, RestQuery> {
    config: RestDatasourceConfig;
    constructor(config: RestDatasourceConfig) {
        super({});
        config.icon = config?.icon ?? HttpIcon;
        config.timeout = config?.timeout ?? 5000;
        this.config = config;
    }

    async init(): Promise<void> {}

    async online(): Promise<boolean> {
        try {
            const result = await axios.get(this.config.uri, { timeout: this.config.timeout });
            return result.status === 200;
        } catch (ex) {
            return false;
        }
    }

    async find(query?: RestQuery): Promise<Entity<RestEntityProps>[]> {
        return [];
    }

    public buildUri(path?: string, params?: AnyObject): string {
        const pathStr = path ? `/${path}` : "";
        const paramStr = Object.entries(params ?? {})
            .map((kv) => kv.map(encodeURIComponent).join("="))
            .join("&");

        return `${this.config.uri}${pathStr}?${paramStr}`;
    }
}
