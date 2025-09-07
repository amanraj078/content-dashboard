export const fetchSpotify = jest.fn(() =>
    Promise.resolve([
        {
            id: "1",
            name: "Test Song",
            preview_url: "http://test.com/preview.mp3",
            album: { images: [{ url: "http://test.com/album.jpg" }] },
            artists: [{ name: "Test Artist" }],
        },
    ])
);
