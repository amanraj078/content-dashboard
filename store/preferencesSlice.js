import { createSlice } from "@reduxjs/toolkit";

const getStoredCategories = () => {
    if (typeof window === "undefined") return ["technology"];
    try {
        const saved = localStorage.getItem("categories");
        return saved ? JSON.parse(saved) : ["technology"];
    } catch (error) {
        console.error("Error reading from localStorage:", error);
        return ["technology"];
    }
};

const updateStoredCategories = (categories) => {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem("categories", JSON.stringify(categories));
    } catch (error) {
        console.error("Error writing to localStorage:", error);
    }
};

const initialState = {
    categories: getStoredCategories(),
};

const preferencesSlice = createSlice({
    name: "preferences",
    initialState,
    reducers: {
        setCategories: (state, action) => {
            state.categories = action.payload;
            updateStoredCategories(state.categories);
        },
    },
});

export const { setCategories } = preferencesSlice.actions;
export default preferencesSlice.reducer;
