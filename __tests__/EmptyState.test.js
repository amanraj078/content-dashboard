import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import contentReducer from "../store/contentSlice";
import FeedPage from "../app/page";

function renderWithEmptyStore() {
    const emptyStore = configureStore({
        reducer: { content: contentReducer },
        preloadedState: {
            content: {
                news: [],
                spotify: [],
                social: [],
                query: "",
                status: "idle",
                error: null,
            },
        },
    });

    render(
        <Provider store={emptyStore}>
            <FeedPage />
        </Provider>
    );
}

describe("Empty state handling", () => {
    it("shows message when no content available", () => {
        renderWithEmptyStore();

        expect(screen.getByText(/No content available/i)).toBeInTheDocument();
    });
});
