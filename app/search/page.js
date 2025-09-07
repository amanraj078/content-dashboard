"use client";
import { useSelector } from "react-redux";

export default function SearchPage() {
    const { query, results, loading } = useSelector((state) => state.search);

    if (loading)
        return <p className="p-6">Searching for &quot;{query}&quot;...</p>;

    if (!results) return <p className="p-6">Type something to search...</p>;

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">
                🔍 Results for: &quot;{query}&quot;
            </h2>

            {/* News */}
            <h3 className="text-lg mt-4 mb-2">📰 News</h3>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {results.news.map((article, i) => (
                    <div key={i} className="p-4 border rounded-lg shadow">
                        <h4 className="font-bold">{article.title}</h4>
                        <p className="text-sm">{article.description}</p>
                    </div>
                ))}
            </div>

            {/* Spotify */}
            <h3 className="text-lg mt-6 mb-2">🎵 Spotify</h3>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {results.spotify.map((track) => (
                    <div
                        key={track.id}
                        className="p-4 border rounded-lg shadow flex gap-4"
                    >
                        {track.album?.images?.[0]?.url && (
                            <img
                                src={track.album.images[0].url}
                                alt={track.name}
                                className="w-16 h-16 rounded"
                            />
                        )}
                        <div>
                            <h4 className="font-bold">{track.name}</h4>
                            <p className="text-sm">
                                {track.artists.map((a) => a.name).join(", ")}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Social */}
            <h3 className="text-lg mt-6 mb-2">💬 Social</h3>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {results.social.map((post, i) => (
                    <div key={i} className="p-4 border rounded-lg shadow">
                        <h4 className="font-bold">{post.username}</h4>
                        <p>{post.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
