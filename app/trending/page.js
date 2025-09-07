"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "@/store/favoritesSlice";
import { fetchTrendingNews } from "@/services/newsService";
import { fetchTrendingSpotify } from "@/services/spotifyService";
import Card from "@/components/Card";

export default function TrendingPage() {
    const [news, setNews] = useState([]);
    const [spotify, setSpotify] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const favorites = useSelector((state) => state.favorites.items);

    const isFavorited = (item, type) => {
        const id = type === "news" ? item.url : item.id;
        return favorites.some((fav) => fav.id === id);
    };
    const handleFavorite = (item, type) => {
        const id = type === "news" ? item.url : item.id;
        if (favorites.some((fav) => fav.id === id)) {
            dispatch(removeFavorite(id));
        } else {
            dispatch(addFavorite({ ...item, id, type }));
        }
    };

    useEffect(() => {
        async function loadTrending() {
            setLoading(true);
            try {
                const [newsData, spotifyData] = await Promise.all([
                    fetchTrendingNews(),
                    fetchTrendingSpotify(),
                ]);
                setNews(newsData);
                setSpotify(spotifyData);
            } catch (error) {
                console.error("Error loading trending content:", error);
            } finally {
                setLoading(false);
            }
        }
        loadTrending();
    }, []);

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto w-full px-2 sm:px-4 py-6">
            <h1 className="text-2xl font-bold mb-6">🔥 Trending Now</h1>

            {/* News Section */}
            {news.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4">
                        Trending News
                    </h2>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {news.map((article, index) => {
                            const fav = isFavorited(article, "news");
                            return (
                                <Card
                                    key={`${article.url}-${index}`}
                                    type="news"
                                    title={article.title}
                                    description={
                                        article.description ||
                                        "No description available."
                                    }
                                    image={article.urlToImage}
                                    date={article.publishedAt}
                                    source={article.source?.name}
                                    url={article.url}
                                    isFavorite={fav}
                                    onFavoriteToggle={() =>
                                        handleFavorite(article, "news")
                                    }
                                    onClick={() =>
                                        window.open(article.url, "_blank")
                                    }
                                    className="h-full"
                                />
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Music Section */}
            {spotify.length > 0 && (
                <section>
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4">
                        Trending Music
                    </h2>
                    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
                        {spotify.map((track, index) => {
                            const fav = isFavorited(track, "spotify");
                            return (
                                <div
                                    key={`${track.id}-${index}`}
                                    className="h-full"
                                >
                                    <Card
                                        type="music"
                                        title={track.name}
                                        artist={track.artists?.[0]?.name}
                                        album={track.album?.name}
                                        image={track.album?.images?.[0]?.url}
                                        previewUrl={track.preview_url}
                                        isFavorite={fav}
                                        onFavoriteToggle={() =>
                                            handleFavorite(track, "spotify")
                                        }
                                        onClick={() => {
                                            if (track.preview_url) {
                                                const audio = new Audio(
                                                    track.preview_url
                                                );
                                                audio.play();
                                            }
                                        }}
                                        className="h-full"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
}
