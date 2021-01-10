import { AnyObject, Entity } from "./entity.model";

// Connector denotes a configured connector
export class Connector<EntityType extends Entity, QueryType> extends Entity {
    // connector configuration
    config?: AnyObject;

    // Handle async initialization
    public async init(): Promise<void> {}

    // Whether or not the connector is functioning properly (ie: ping)
    public async online(): Promise<boolean> {
        return false;
    }

    // Find all entities matching a given query
    public async find(query?: QueryType): Promise<EntityType[]> {
        throw new Error("Not implemented");
    }
}

export default Connector;
