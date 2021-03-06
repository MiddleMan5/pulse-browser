import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ThemeName } from "../../themes";
import { Language, FileAssociation, Keybinding } from "../../models";

export interface SettingsState {
    theme: ThemeName;
    tagDelimiter: string;
    recursive: boolean;
    language: Language;
    keyBindings: Keybinding[];
    fileAssociations: FileAssociation[];
    // TODO: Color type
    tagColor: string;
}

const defaultSettings: SettingsState = {
    theme: "dark",
    tagDelimiter: " ",
    recursive: true,
    language: { iso: "en", title: "English" },
    keyBindings: [],
    fileAssociations: [],
    tagColor: "white",
};

// TODO: Load initial state from storage
const settingsSlice = createSlice({
    name: "settings",
    initialState: defaultSettings,
    reducers: {
        setTheme(state: SettingsState, action: PayloadAction<ThemeName>) {
            state.theme = action.payload;
        },
        setTagDelimiter(state: SettingsState, action: PayloadAction<string>) {
            state.tagDelimiter = action.payload;
        },
        setRecursive(state: SettingsState, action: PayloadAction<boolean>) {
            state.recursive = action.payload;
        },
        // TODO: Language lookup from string
        setLanguage(state: SettingsState, action: PayloadAction<Language>) {
            state.language = action.payload;
        },
        setKeyBindings(state: SettingsState, action: PayloadAction<Keybinding[]>) {
            state.keyBindings = action.payload;
        },
        setFileAssociations(state: SettingsState, action: PayloadAction<FileAssociation[]>) {
            state.fileAssociations = action.payload;
        },
        setTagColor(state: SettingsState, action: PayloadAction<string>) {
            state.tagColor = action.payload;
        },
    },
});

export const actions = settingsSlice.actions;
export default settingsSlice.reducer;
