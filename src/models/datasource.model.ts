import { AnyObject, Options, Entity, ValueObject, EntityData, Command } from "./entity.model";

// DataSource denotes a configured connector
export class DataSource<EntityProps extends EntityData, QueryType> extends Entity {
    // connector configuration
    config?: ValueObject | AnyObject;

    // Handle async initialization
    async init(): Promise<void> {}

    // Whether or not the datasource is functioning properly (ie: ping)
    async online(): Promise<boolean> {
        return false;
    }

    // Find all entities matching a given query
    async find(query?: QueryType): Promise<Entity<EntityProps>[]> {
        throw new Error("Not implemented");
    }
}

export default DataSource;
