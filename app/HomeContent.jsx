"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState, useCallback } from "react";
import { loadContent } from "@/store/contentSlice";
import { addFavorite, removeFavorite } from "@/store/favoritesSlice";
import { Heart } from "lucide-react";
import Card from "@/components/Card";

export default function HomeContent() {
    const dispatch = useDispatch();
    const { news, spotify, social, loading, hasMore, newsPage, spotifyOffset } =
        useSelector((state) => state.content);
    const categories = useSelector((state) => state.preferences.categories);
    const favorites = useSelector((state) => state.favorites.items);

    const newsContainerRef = useRef(null);
    const newsSentinelRef = useRef(null);
    const spotifySentinelRef = useRef(null);

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [activeCategory, setActiveCategory] = useState("all");

    const availableCategories = [
        { id: "all", name: "All" },
        { id: "business", name: "Business" },
        { id: "entertainment", name: "Entertainment" },
        { id: "general", name: "General" },
        { id: "health", name: "Health" },
        { id: "science", name: "Science" },
        { id: "sports", name: "Sports" },
        { id: "technology", name: "Technology" },
    ];

    const getId = (item, type) => (type === "news" ? item?.url : item?.id);
    const isFavorited = (item, type) =>
        favorites.some((f) => f.id === getId(item, type));

    const handleFavorite = (item, type) => {
        const id = getId(item, type);
        if (!id) return;

        if (favorites.some((fav) => fav.id === id)) {
            dispatch(removeFavorite(id));
        } else {
            const payload =
                type === "news"
                    ? { ...item, id, type }
                    : { ...item, id: item.id, type };
            dispatch(addFavorite(payload));
        }
    };

    const FavoriteButton = ({ item, type, size = "md" }) => {
        const fav = isFavorited(item, type);
        const sizeClasses = {
            sm: "h-4 w-4",
            md: "h-5 w-5",
            lg: "h-6 w-6",
        };

        return (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleFavorite(item, type);
                }}
                className={`p-1.5 rounded-full transition-colors duration-200 ${
                    fav ? "text-red-500" : "text-gray-300 hover:text-red-400"
                }`}
                aria-label={fav ? "Remove from favorites" : "Add to favorites"}
            >
                <Heart
                    className={sizeClasses[size]}
                    fill={fav ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth={2}
                />
            </button>
        );
    };

    useEffect(() => {
        const categoriesToLoad =
            activeCategory === "all" ? categories : [activeCategory];
        if (categoriesToLoad?.length > 0) {
            dispatch(
                loadContent({
                    categories: categoriesToLoad,
                    newsPage: 1,
                    spotifyOffset: 0,
                })
            );
        }
    }, [activeCategory, categories, dispatch]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading && hasMore) {
                    const categoriesToLoad =
                        activeCategory === "all"
                            ? categories
                            : [activeCategory];
                    if (categoriesToLoad?.length > 0) {
                        dispatch(
                            loadContent({
                                categories: categoriesToLoad,
                                newsPage: 1,
                                spotifyOffset: spotify.length,
                            })
                        );
                    }
                }
            },
            { root: null, rootMargin: "100px", threshold: 0.1 }
        );

        if (spotifySentinelRef.current) {
            observer.observe(spotifySentinelRef.current);
        }

        return () => {
            if (spotifySentinelRef.current) {
                observer.unobserve(spotifySentinelRef.current);
            }
        };
    }, [
        loading,
        hasMore,
        spotify.length,
        activeCategory,
        categories,
        dispatch,
    ]);

    const handleMouseDown = (e) => {
        if (!newsContainerRef.current) return;
        const pageX = e.touches ? e.touches[0].pageX : e.pageX;
        setIsDragging(true);
        setStartX(pageX - newsContainerRef.current.offsetLeft);
        setScrollLeft(newsContainerRef.current.scrollLeft);
        document.body.style.cursor = "grabbing";
        document.body.style.userSelect = "none";
    };

    const endDrag = () => {
        setIsDragging(false);
        document.body.style.cursor = "default";
        document.body.style.removeProperty("user-select");
    };

    const handleMouseMove = useCallback(
        (e) => {
            if (!isDragging || !newsContainerRef.current) return;
            e.preventDefault();
            const pageX = e.touches ? e.touches[0].pageX : e.pageX;
            const x = pageX - newsContainerRef.current.offsetLeft;
            const walk = (x - startX) * 1.5;
            newsContainerRef.current.scrollLeft = scrollLeft - walk;
        },
        [isDragging, startX, scrollLeft]
    );

    useEffect(() => {
        const container = newsContainerRef.current;
        if (!container) return;

        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseup", endDrag);
        container.addEventListener("mouseleave", endDrag);
        container.addEventListener("touchmove", handleMouseMove);
        container.addEventListener("touchend", endDrag);
        container.addEventListener("touchcancel", endDrag);

        return () => {
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseup", endDrag);
            container.removeEventListener("mouseleave", endDrag);
            container.removeEventListener("touchmove", handleMouseMove);
            container.removeEventListener("touchend", endDrag);
            container.removeEventListener("touchcancel", endDrag);
        };
    }, [handleMouseMove]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    dispatch(
                        loadContent({
                            categories,
                            newsPage: newsPage + 1,
                            spotifyOffset: spotifyOffset + 10,
                        })
                    );
                }
            },
            {
                root: null,
                rootMargin: "0px",
                threshold: 0.7,
            }
        );

        if (newsSentinelRef.current) observer.observe(newsSentinelRef.current);
        return () => {
            if (newsSentinelRef.current)
                observer.unobserve(newsSentinelRef.current);
        };
    }, [categories, dispatch, hasMore, loading, newsPage, spotifyOffset]);

    if (loading && news.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4">
                    Your Personalized Feed
                </h1>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2 mt-3 overflow-x-auto pb-2 -mx-2 px-2">
                    {availableCategories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`px-3 py-1.5 text-sm sm:text-base rounded-full transition-colors whitespace-nowrap ${
                                activeCategory === category.id
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* News Section with Horizontal Scroll */}
            <section className="mb-12">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl sm:text-2xl font-semibold">
                        Latest News
                    </h2>
                    <span className="text-sm text-gray-500 hidden sm:block">
                        Swipe or drag to see more →
                    </span>
                </div>

                <div
                    ref={newsContainerRef}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                    className="flex overflow-x-auto pb-6 -mx-2 sm:-mx-4 px-2 sm:px-4 cursor-grab active:cursor-grabbing scrollbar-hide"
                    style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        WebkitOverflowScrolling: "touch",
                        scrollSnapType: "x mandatory",
                    }}
                >
                    <div className="flex space-x-4 sm:space-x-6">
                        {news.map((article, index) => {
                            const fav = isFavorited(article, "news");
                            return (
                                <div
                                    key={`${article.url}-${index}`}
                                    className="flex-shrink-0 w-[280px] sm:w-80"
                                    style={{ scrollSnapAlign: "start" }}
                                >
                                    <Card
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
                                </div>
                            );
                        })}

                        {/* Loading indicator */}
                        {loading && news.length > 0 && (
                            <div className="flex-shrink-0 w-80 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        )}

                        {/* Sentinel element for infinite scroll */}
                        <div
                            ref={newsSentinelRef}
                            className="w-1 h-1 flex-shrink-0"
                        />
                    </div>
                </div>

                <div className="text-center mt-2 text-sm text-gray-500">
                    ← Scroll or drag to see more news →
                </div>
            </section>

            {/* Social Section */}
            {social.length > 0 && (
                <section>
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4">
                        Social Updates
                    </h2>
                    <div className="space-y-4">
                        {social.map((post, index) => {
                            const fav = isFavorited(post, "social");
                            return (
                                <Card
                                    key={`${post.id}-${index}`}
                                    type="social"
                                    username={post.user}
                                    description={post.post}
                                    image={post.image}
                                    date={post.date || new Date().toISOString()}
                                    likes={post.likes || 0}
                                    comments={post.comments || 0}
                                    shares={post.shares || 0}
                                    isFavorite={fav}
                                    onFavoriteToggle={() =>
                                        handleFavorite(post, "social")
                                    }
                                    onClick={() => {}}
                                    className="mb-4"
                                />
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Spotify Section */}
            <section className="mb-10 sm:mb-12">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">
                    Recommended Music
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
                {/* Spotify loading indicator */}
                {loading && spotify.length > 0 && (
                    <div className="flex justify-center my-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                )}
                {/* Spotify infinite scroll sentinel */}
                <div ref={spotifySentinelRef} className="h-1"></div>
            </section>

            {/* (Optional) bottom status */}
            {loading && <div className="text-center py-4">Loading more...</div>}
        </div>
    );
}
