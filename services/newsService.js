import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const BASE_URL = "https://newsapi.org/v2";

export const fetchNewsByCategory = async (
    category = "technology",
    page = 1,
    pageSize = 10
) => {
    try {
        const res = await axios.get(`${BASE_URL}/top-headlines`, {
            params: {
                country: "us",
                category,
                apiKey: API_KEY,
                page,
                pageSize,
            },
        });
        return {
            articles: res.data.articles || [],
            totalResults: res.data.totalResults || 0,
        };
    } catch (e) {
        console.error("Error fetching news:", e);
        return { articles: [], totalResults: 0 };
    }
};

export async function fetchNewsSearch(query) {
    const res = await fetch(
        `https://newsapi.org/v2/everything?q=${query}&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
    );
    const data = await res.json();
    return data.articles || [];
}

export async function fetchTrendingNews() {
    const res = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&pageSize=10&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
    );
    const data = await res.json();
    return data.articles || [];
}
