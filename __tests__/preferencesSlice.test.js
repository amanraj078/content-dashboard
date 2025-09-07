import preferencesReducer, {
    setCategories,
    toggleDarkMode,
} from "../store/preferencesSlice";

describe("preferencesSlice", () => {
    it("should return initial state", () => {
        const initialState = preferencesReducer(undefined, { type: "@@INIT" });
        expect(initialState).toEqual({
            categories: [],
            darkMode: false,
        });
    });

    it("should set categories", () => {
        const state = preferencesReducer(
            undefined,
            setCategories(["sports", "tech"])
        );
        expect(state.categories).toEqual(["sports", "tech"]);
    });

    it("should toggle dark mode", () => {
        let state = preferencesReducer(undefined, toggleDarkMode());
        expect(state.darkMode).toBe(true);

        state = preferencesReducer(state, toggleDarkMode());
        expect(state.darkMode).toBe(false);
    });
});
