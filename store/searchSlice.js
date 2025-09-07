import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchNewsSearch } from "@/services/newsService";
import { fetchSpotifySearch } from "@/services/spotifyService";
import { fetchSocialPosts } from "@/services/socialService";

export const searchContent = createAsyncThunk(
    "search/searchContent",
    async (query, { rejectWithValue }) => {
        const q = (query || "").trim();
        if (!q) return { news: [], spotify: [], social: [] };

        try {
            const [news, spotify, socialAll] = await Promise.all([
                fetchNewsSearch(q),
                fetchSpotifySearch(q),
                fetchSocialPosts(),
            ]);

            const lower = q.toLowerCase();
            const social = (Array.isArray(socialAll) ? socialAll : []).filter(
                (post) => {
                    const content = (
                        post.content ||
                        post.text ||
                        ""
                    ).toLowerCase();
                    const user = (
                        post.username ||
                        post.user ||
                        ""
                    ).toLowerCase();
                    const tags = Array.isArray(post.tags)
                        ? post.tags.join(" ").toLowerCase()
                        : "";
                    return (
                        content.includes(lower) ||
                        user.includes(lower) ||
                        tags.includes(lower)
                    );
                }
            );

            return { news, spotify, social };
        } catch (err) {
            return rejectWithValue(err?.message || "Search failed");
        }
    }
);

const searchSlice = createSlice({
    name: "search",
    initialState: {
        query: "",
        results: { news: [], spotify: [], social: [] },
        loading: false,
        error: null,
    },
    reducers: {
        setQuery: (state, action) => {
            state.query = action.payload;
        },
        clearResults: (state) => {
            state.results = { news: [], spotify: [], social: [] };
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchContent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchContent.fulfilled, (state, action) => {
                state.loading = false;
                state.results = action.payload;
            })
            .addCase(searchContent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Search failed";
            });
    },
});

export const { setQuery, clearResults } = searchSlice.actions;
export default searchSlice.reducer;
