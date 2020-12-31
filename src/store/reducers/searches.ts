import { Tag, Image } from "../../models";
import { createSlice, PayloadAction, createEntityAdapter } from "@reduxjs/toolkit";

export interface SearchOptions {}

export interface Search {
    id: string;
    tags?: Tag[];
    options?: SearchOptions;
    results?: Image[];
}

const searchAdapter = createEntityAdapter<Search>({
    selectId: (search) => search.id,
    sortComparer: (a, b) => a.id.localeCompare(b.id),
});

const searchesSlice = createSlice({
    name: "searches",
    initialState: searchAdapter.getInitialState(),
    reducers: {
        addSearch: searchAdapter.addOne,
        removeSearch: searchAdapter.removeOne,
    },
});

export const actions = searchesSlice.actions;
export default searchesSlice.reducer;
