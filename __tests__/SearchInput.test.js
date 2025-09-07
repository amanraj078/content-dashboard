import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../store";
import Layout from "../app/layout";

describe("Search bar", () => {
    it("updates query when typing", () => {
        render(
            <Provider store={store}>
                <Layout>
                    <p>Child</p>
                </Layout>
            </Provider>
        );

        const searchInput = screen.getByPlaceholderText(/Search/i);
        fireEvent.change(searchInput, { target: { value: "test query" } });

        expect(store.getState().content.query).toBe("test query");
    });
});
