export const fetchSocialPosts = async () => {
    try {
        const response = await fetch("/social.json");
        return await response.json();
    } catch (error) {
        console.error("Error loading social posts:", error);
        return [];
    }
};
