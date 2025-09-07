import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchNewsByCategory } from "@/services/newsService";
import { fetchSpotifyTracksByGenre } from "@/services/spotifyService";
import { fetchSocialPosts } from "@/services/socialService";

const PAGE_SIZE = 10;

export const loadContent = createAsyncThunk(
    "content/loadContent",
    async ({ categories, newsPage = 1, spotifyOffset = 0 }) => {
        const category = categories[0] || "technology";
        const [newsRes, spotifyRes, social] = await Promise.all([
            fetchNewsByCategory(category, newsPage, PAGE_SIZE),
            fetchSpotifyTracksByGenre("pop", spotifyOffset, PAGE_SIZE),
            fetchSocialPosts(),
        ]);
        return {
            news: newsRes.articles,
            newsTotal: newsRes.totalResults,
            spotify: spotifyRes.tracks,
            spotifyTotal: spotifyRes.total,
            nextSpotifyOffset: spotifyRes.nextOffset,
            social,
            newsPage,
        };
    }
);

const initialState = {
    news: [],
    newsTotal: 0,
    newsPage: 1,

    spotify: [],
    spotifyTotal: 0,
    spotifyOffset: 0,

    social: [],
    loading: false,
    hasMore: true,
};

const contentSlice = createSlice({
    name: "content",
    initialState,
    reducers: {
        resetContent(state) {
            state.news = [];
            state.spotify = [];
            state.social = [];
            state.newsPage = 1;
            state.spotifyOffset = 0;
            state.hasMore = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadContent.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadContent.fulfilled, (state, action) => {
                const isFirstPage =
                    action.payload.newsPage === 1 &&
                    action.meta.arg.spotifyOffset === 0;

                state.news = isFirstPage
                    ? action.payload.news
                    : [...state.news, ...action.payload.news];
                state.newsTotal = action.payload.newsTotal;

                state.spotify = isFirstPage
                    ? action.payload.spotify
                    : [...state.spotify, ...action.payload.spotify];
                state.spotifyTotal = action.payload.spotifyTotal;
                state.spotifyOffset = action.payload.nextSpotifyOffset;

                if (isFirstPage) state.social = action.payload.social;

                state.newsPage = action.payload.newsPage;
                state.loading = false;

                const totalLoaded = state.news.length + state.spotify.length;
                const totalAvailable =
                    (state.newsTotal || 0) + (state.spotifyTotal || 0);
                state.hasMore = totalAvailable
                    ? totalLoaded < totalAvailable
                    : true;
            })
            .addCase(loadContent.rejected, (state) => {
                state.loading = false;
                state.hasMore = false;
            });
    },
});

export const { resetContent } = contentSlice.actions;
export default contentSlice.reducer;
