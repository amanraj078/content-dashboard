import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../store";
import FeedPage from "../app/page";

jest.mock("../services/newsService", () => require("../__mocks__/newsService"));
jest.mock("../services/spotifyService", () =>
    require("../__mocks__/spotifyService")
);

describe("FeedPage Integration", () => {
    it("renders news and spotify items from API", async () => {
        render(
            <Provider store={store}>
                <FeedPage />
            </Provider>
        );

        await waitFor(() =>
            expect(screen.getByText("Test News")).toBeInTheDocument()
        );

        expect(screen.getByText("Test Song")).toBeInTheDocument();
        expect(screen.getByText("Test Artist")).toBeInTheDocument();
    });
});
