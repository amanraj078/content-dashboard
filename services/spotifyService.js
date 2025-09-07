import axios from "axios";

const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

let accessToken = null;
let tokenExpiry = null;

async function getAccessToken() {
    if (accessToken && tokenExpiry && Date.now() < tokenExpiry)
        return accessToken;

    const tokenUrl = "https://accounts.spotify.com/api/token";
    const res = await axios.post(
        tokenUrl,
        new URLSearchParams({ grant_type: "client_credentials" }),
        {
            headers: {
                Authorization:
                    "Basic " +
                    Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString(
                        "base64"
                    ),
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );

    accessToken = res.data.access_token;
    tokenExpiry = Date.now() + res.data.expires_in * 1000;
    return accessToken;
}

export async function fetchSpotifyTracksByGenre(
    genre = "pop",
    offset = 0,
    limit = 10
) {
    try {
        const token = await getAccessToken();
        const res = await axios.get("https://api.spotify.com/v1/search", {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                q: `genre:${genre}`,
                type: "track",
                limit,
                offset,
            },
        });
        return {
            tracks: res.data?.tracks?.items || [],
            total: res.data?.tracks?.total || 0,
            nextOffset: offset + limit,
        };
    } catch (e) {
        console.error("Error fetching Spotify:", e);
        return { tracks: [], total: 0, nextOffset: offset };
    }
}

export async function fetchSpotifySearch(query) {
    try {
        const token = await getAccessToken();
        const res = await axios.get("https://api.spotify.com/v1/search", {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                q: query,
                type: "track",
                limit: 10,
            },
        });
        return res.data.tracks?.items || [];
    } catch (error) {
        console.error("Error searching Spotify:", error);
        return [];
    }
}

export async function fetchTrendingSpotify() {
    try {
        const token = await getAccessToken();

        const playlistsRes = await axios.get(
            "https://api.spotify.com/v1/browse/featured-playlists?limit=1",
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const playlistId = playlistsRes.data.playlists?.items?.[0]?.id;
        if (!playlistId) return [];

        const tracksRes = await axios.get(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=10`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        return tracksRes.data.items?.map((item) => item.track) || [];
    } catch (error) {
        console.error("Error fetching trending Spotify content:", error);
        return [];
    }
}
