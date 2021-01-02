export * from "./local.datasource";
export * from "./rest.datasource";
import { LocalDatasource } from "./local.datasource";
import path from "path";

// FIXME: This is just a tech demo
export function useDatasource(names: string[]) {
    const home = process.env?.HOME ?? "/";
    return new LocalDatasource({ directory: path.join(home, "Pictures"), recursive: true });
}
