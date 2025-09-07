import { configureStore } from "@reduxjs/toolkit";
import contentReducer from "./contentSlice";
import favoritesReducer from "./favoritesSlice";
import preferencesReducer from "./preferencesSlice";
import searchReducer from "./searchSlice";

const store = configureStore({
    reducer: {
        content: contentReducer,
        favorites: favoritesReducer,
        preferences: preferencesReducer,
        search: searchReducer,
    },
});

export default store;
