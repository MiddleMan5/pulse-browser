// FIXME: This really needs to be thought out, what I really want to do is
// store component and navigation state (with two discrete solutions for each)

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const defaultLocation = {
    rootPageIndex: 0,
};
type LocationState = typeof defaultLocation;

const locationSlice = createSlice({
    name: "location",
    initialState: defaultLocation,
    reducers: {
        literallyUpdateEverything(state: LocationState, action: PayloadAction<Partial<LocationState>>) {
            Object.assign(state, action.payload);
        },
    },
});

export const actions = locationSlice.actions;
export default locationSlice.reducer;
