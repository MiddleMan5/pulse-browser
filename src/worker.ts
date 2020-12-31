import { IpcRendererEvent, ipcRenderer, remote } from "electron";
import { isRenderer } from "./util";
import { execSync } from "child_process";
import { defineChannel, IpcRequest } from "./services/ipc.service";
export * from "./services/ipc.service";

export const channels = [
    defineChannel("systemInfo", () => execSync("uname -a").toString()),
    defineChannel("echo", (msg: string) => {
        console.log("Got message:", msg);
        return msg;
    }),
];

const registerWorkerChannels = (workerName: string) => {
    channels.forEach((channel) => {
        // Wrap channel handlers with event unpacker
        const handleRequest = async (event: IpcRendererEvent, request: IpcRequest) => {
            console.log("Unpacking args:", request?.args);
            const args = request?.args ?? [];
            // FIXME: I'm tired...
            const result = await Promise.resolve(channel.handle.apply(undefined, args));
            if (request?.responseChannel) {
                console.log("Sending response:", result);
                event.sender.send(request.responseChannel, result);
            }
        };

        // TODO: Standardize this naming scheme somewhere
        ipcRenderer.on(`${workerName}.${channel.name}`, (event, request) => {
            handleRequest(event, request).catch(console.error);
        });
    });
};

// Only construct worker in renderer process
if (isRenderer()) {
    // TODO: Standardize this somewhere, it would be *lovely* to use a human-readable name
    const workerName = `${remote.getCurrentWindow().id}`;
    console.log("Registering worker:", workerName);
    registerWorkerChannels(workerName);
}
