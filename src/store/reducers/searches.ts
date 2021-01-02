import { v4 as uuid } from "uuid";
import { Tag, ImageEntity, Query } from "../../models";
import { createSlice, PayloadAction, createEntityAdapter, EntityState } from "@reduxjs/toolkit";

export interface SearchOptions {}

export interface Search {
    id: string;
    query: Query;
    results: ImageEntity[];
    options?: SearchOptions;
}

const searchAdapter = createEntityAdapter<Search>({
    selectId: (search) => search.id,
    sortComparer: (a, b) => a.id.localeCompare(b.id),
});

const searchesSlice = createSlice({
    name: "searches",
    initialState: searchAdapter.getInitialState(),
    reducers: {
        addSearch: (state: EntityState<Search>, action: PayloadAction<Partial<Search>>) => {
            const searchDefault = {
                id: uuid(),
                query: {
                    page: 0,
                    tags: [],
                    limit: 1000,
                },
                results: [],
                options: {},
            };
            searchAdapter.addOne(state, Object.assign(searchDefault, action?.payload ?? {}));
        },
        removeSearch: searchAdapter.removeOne,
        updateSearch: searchAdapter.updateOne,
    },
});

export const actions = searchesSlice.actions;
export default searchesSlice.reducer;
