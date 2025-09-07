import { createSlice } from "@reduxjs/toolkit";

const getStoredFavorites = () => {
    if (typeof window === "undefined") return [];
    try {
        const saved = localStorage.getItem("favorites");
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error("Error reading from localStorage:", error);
        return [];
    }
};

const updateStoredFavorites = (items) => {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem("favorites", JSON.stringify(items));
    } catch (error) {
        console.error("Error writing to localStorage:", error);
    }
};

const initialState = {
    items: getStoredFavorites(),
};

const favoritesSlice = createSlice({
    name: "favorites",
    initialState,
    reducers: {
        addFavorite: (state, action) => {
            const exists = state.items.find((i) => i.id === action.payload.id);
            if (!exists) {
                state.items.push(action.payload);
                updateStoredFavorites(state.items);
            }
        },
        removeFavorite: (state, action) => {
            state.items = state.items.filter((i) => i.id !== action.payload);
            updateStoredFavorites(state.items);
        },
    },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
