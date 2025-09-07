export const fetchNews = jest.fn(() =>
    Promise.resolve([
        {
            url: "http://test.com",
            title: "Test News",
            description: "This is a test article",
            urlToImage: "http://test.com/image.jpg",
        },
    ])
);
