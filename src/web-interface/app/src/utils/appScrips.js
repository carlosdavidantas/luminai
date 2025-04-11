export const handleLeftSideChatTitles = async (setTitles) => {
    try {
        const response = await fetch("http://localhost:5000/get-titles", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("An error occurred while fetching the titles.");
        }

        const data = await response.json();
        setTitles([]);
        setTitles(data.titles);
    } catch (error) {
        console.error("Request error:", error);
    }
}