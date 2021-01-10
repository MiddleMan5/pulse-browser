export * from "./local.connector";
export * from "./rest.connector";
import { LocalConnector } from "./local.connector";
import { RestConnector } from "./rest.connector";
import path from "path";
import React, { useState, useEffect } from "react";
import { AnyObject, Entity } from "../models";

export type AnyConnector = RestConnector | LocalConnector;
export type ConnectorMap = { [name: string]: new (...args: any[]) => AnyConnector };

const connectorMap: ConnectorMap = {
    [LocalConnector.name]: LocalConnector,
    [RestConnector.name]: RestConnector,
};

export function useConnector(names: string[]): AnyConnector[] {
    const [connectors, setConnectors] = useState<{ [name: string]: AnyConnector }>({});

    useEffect(() => {
        const newConnectors: typeof connectors = {};
        names.forEach((name) => {
            if (!(name in connectors)) {
                if (name in connectorMap) {
                    newConnectors[name] = new connectorMap[name]({});
                } else {
                    throw new Error(
                        `Invalid connector name: ${name}. Valid names are: ${Object.keys(connectorMap).join(", ")}`
                    );
                }
            }
            setConnectors(Object.assign(connectors, newConnectors));
        });
    }, [names]);

    // Ensure undefined names are returned in the "tuple"
    return names.map((name) => connectors[name]);
}
