export * from "./image.model";
export * from "./site.model";
import { ImageModel } from "./image.model";
import { useDoc } from "use-pouchdb";
import React, { useEffect, useState } from "react";
import PlaceholderImage from "../../public/icons/icon.svg";
import axios from "axios";
import { Tag } from "./site.model";

export type Editor = "@pulsebrowser/html-editor" | "@pulsebrowser/json-editor" | "@pulsebrowser/text-editor";

export interface FileAssociation {
    type: string;
    viewer: string;
    color?: string;
    editor?: Editor;
}

export interface Language {
    iso: string;
    title: string;
    // Fixme: Model type
    model?: any;
}

export interface Keybinding {
    name: string;
    command: string;
}

export class ImageEntity implements ImageModel {
    name = "ImageEntity Name";
    sources: string[] = [];
    tags: Tag[] = [];
    hash: string = "";
    artists = [];
    height = 0;
    width = 0;

    static timeout = 1000;
    protected imageData: any;

    constructor(data?: Partial<ImageModel>) {
        Object.assign(this, data);
    }

    // TODO: get thumbnail or placeholder
    public get thumbnail() {
        return PlaceholderImage;
    }

    // TODO: get thumbnail or placeholder
    public get data() {
        return this.imageData ?? PlaceholderImage;
    }

    // Iterate sources in priority order and attempt to load image
    public async resolve() {
        for (const uri of this.sources) {
            try {
                const resp = await axios.get(uri, { timeout: ImageEntity.timeout });
                if (resp.status === 200) {
                    this.imageData = resp.data;
                }
            } catch (err) {
                console.debug("Failed to load image from uri:", uri);
            }
        }
        return this.imageData;
    }
}

// Handles placeholder, and async resolution
export const useImage = (documentId: string): [ImageEntity | undefined, Boolean, PouchDB.Core.Error | null] => {
    const [image, setImage] = useState<ImageEntity | undefined>(undefined);
    const { doc, loading, error, state } = useDoc(documentId);
    const [imageLoading, setImageLoading] = useState(true);

    useEffect(() => {
        if (doc != null) {
            console.log("Loading image");
            try {
                setImageLoading(true);
                const newImage = new ImageEntity(doc);
                setImage(newImage);
                (async () => {
                    const imageData = await newImage.resolve();
                    if (imageData != null) {
                        setImageLoading(false);
                    }
                })().catch((err) => console.error("Error resolving image:", err));
            } catch (err) {
                console.debug("Failed to construct image:", err);
            }
        }
    }, [doc, documentId]);

    return [image, loading && imageLoading, error];
};
