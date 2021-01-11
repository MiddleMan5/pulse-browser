import { IpcRendererEvent, ipcRenderer, remote } from "electron";
import { isRenderer } from "./util";
import { defineChannel, IpcRequest } from "./services/ipc.service";
import { siteList } from "./sites";
import { ImageModel } from "./models/image.model";
import { Tag, Query } from "./models/site.model";
export * from "./services/ipc.service";

const debug = (args: any | any[]) => {
    if (!Array.isArray(args)) {
        args = [args];
    }
    ipcRenderer.send("log:debug", { args });
};

export const channels = [
    defineChannel("searchImages", async (query: Query) => {
        debug("Searching images");
        const images: ImageModel[] = [];
        for (const site of siteList) {
            const siteImages = await site.images(query);
            images.push(...siteImages);
        }
        return images;
    }),
    defineChannel("loadTags", async () => {
        const tags: Tag[] = [];
        for (const site of siteList) {
            const siteTags = await site.tags();
            tags.push(...siteTags);
        }
        return [...new Set(tags.map((tag) => ({ tag: tag, id: tag })))];
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
            handleRequest(event, request).catch((err) => console.error(err));
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
