"use client";
import { useSelector, useDispatch } from "react-redux";
import { removeFavorite } from "@/store/favoritesSlice";
import Card from "@/components/Card";

export default function FavoritesPage() {
    const favorites = useSelector((state) => state.favorites.items);
    const dispatch = useDispatch();

    const handleFavorite = (item) => {
        dispatch(removeFavorite(item.id));
    };

    if (favorites.length === 0) {
        return (
            <div className="max-w-7xl mx-auto w-full px-2 sm:px-4 py-6">
                <h2 className="text-2xl font-bold mb-6">⭐ Favorites</h2>
                <p className="text-gray-600">
                    No favorites yet. Start adding some!
                </p>
            </div>
        );
    }

    const favoritesByType = {
        news: favorites.filter((item) => item.type === "news"),
        music: favorites.filter((item) => item.type === "spotify"),
        social: favorites.filter((item) => item.type === "social"),
    };

    return (
        <div className="max-w-7xl mx-auto w-full px-2 sm:px-4 py-6">
            <h2 className="text-2xl font-bold mb-6">⭐ Favorites</h2>

            {/* News Favorites */}
            {favoritesByType.news.length > 0 && (
                <section className="mb-10">
                    <h3 className="text-xl sm:text-2xl font-semibold mb-4">
                        Saved News
                    </h3>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {favoritesByType.news.map((item) => (
                            <Card
                                key={item.id}
                                type="news"
                                title={item.title}
                                description={item.description}
                                image={item.urlToImage}
                                date={item.publishedAt}
                                source={item.source?.name}
                                url={item.url}
                                isFavorite={true}
                                onFavoriteToggle={() => handleFavorite(item)}
                                onClick={() => window.open(item.url, "_blank")}
                                className="h-full"
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Music Favorites */}
            {favoritesByType.music.length > 0 && (
                <section className="mb-10">
                    <h3 className="text-xl sm:text-2xl font-semibold mb-4">
                        Saved Music
                    </h3>
                    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
                        {favoritesByType.music.map((item) => (
                            <div key={item.id} className="h-full">
                                <Card
                                    type="music"
                                    title={item.name}
                                    artist={item.artists?.[0]?.name}
                                    album={item.album?.name}
                                    image={item.album?.images?.[0]?.url}
                                    previewUrl={item.preview_url}
                                    isFavorite={true}
                                    onFavoriteToggle={() =>
                                        handleFavorite(item)
                                    }
                                    onClick={() => {
                                        if (item.preview_url) {
                                            const audio = new Audio(
                                                item.preview_url
                                            );
                                            audio.play();
                                        }
                                    }}
                                    className="h-full"
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Social Favorites */}
            {favoritesByType.social.length > 0 && (
                <section>
                    <h3 className="text-xl sm:text-2xl font-semibold mb-4">
                        Saved Social Posts
                    </h3>
                    <div className="space-y-4">
                        {favoritesByType.social.map((item) => (
                            <Card
                                key={item.id}
                                type="social"
                                username={item.user}
                                description={item.post}
                                image={item.image}
                                date={item.date}
                                likes={item.likes || 0}
                                comments={item.comments || 0}
                                shares={item.shares || 0}
                                isFavorite={true}
                                onFavoriteToggle={() => handleFavorite(item)}
                                className="mb-4"
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
