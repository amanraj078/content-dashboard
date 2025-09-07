import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../store";
import Layout from "../app/layout";

describe("Dark mode toggle", () => {
    it("should toggle dark mode when button clicked", () => {
        render(
            <Provider store={store}>
                <Layout>
                    <p>Content</p>
                </Layout>
            </Provider>
        );

        const toggleButton = screen.getByText(/Dark Mode/i);
        fireEvent.click(toggleButton);

        expect(store.getState().preferences.darkMode).toBe(true);

        fireEvent.click(toggleButton);
        expect(store.getState().preferences.darkMode).toBe(false);
    });
});
