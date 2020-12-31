import { IpcRenderer, ipcRenderer } from "electron";
import { isRenderer } from "../util";

export interface IpcRequest<ArgsType = undefined> {
    responseChannel?: string;
    args?: ArgsType;
}
// apply<T, A extends any[], R>(this: (this: T, ...args: A) => R, thisArg: T, args: A): R;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IpcHandler<A extends any[], R> = (...args: A) => R;

export type IpcChannelInterface<ArgsType extends any[], ReturnType> = {
    name: string;
    handle: IpcHandler<ArgsType, ReturnType>;
};

// Typescript type inferencing
export function defineChannel<ArgsType extends any[], ReturnType>(
    name: string,
    handle: IpcHandler<ArgsType, ReturnType>
) {
    return { name, handle };
}

export class IpcService {
    // Cached renderer instance
    protected ipcRenderer: IpcRenderer;

    constructor(ipcRendererOverride?: IpcRenderer) {
        this.ipcRenderer = ipcRendererOverride ?? ipcRenderer!;
    }

    // FIXME: get return type from channel
    public send(channel: string, ...args: any[]): Promise<unknown> {
        // Autogenerate request channel
        const responseChannel = `${channel}_response_${new Date().getTime()}`;
        // return result;
        const result = new Promise((resolve) => {
            this.ipcRenderer.once(responseChannel, (event, response) => resolve(response));
        });
        this.ipcRenderer.send(channel, { responseChannel, args });
        return result;
    }
}

// Export ipcService object only to renderer processes
export const ipcService = (isRenderer() ? new IpcService() : undefined) as IpcService;
