export const getOrPostOrDeleteData = async (route, method = "GET", body = null) => {
    try {
        let url = `http://localhost:5000/${route}`;
        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
            },
        };

        if (method === "GET" && body) {
            const queryParams = new URLSearchParams(body).toString();
            url += `?${queryParams}`;
        } else if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error("The response was not ok. Status: " + response.status);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Request error:", error);
        return [];
    }
};

export const handleLeftSideChatTitles = async (setTitles) => {
    const data = await getOrPostOrDeleteData("get-titles");
    if (data.length === 0) {
        return;
    }
    setTitles(data.titles);
}

export const handleChatHistory = async (setChatHistory, youtubeTitle) => {
    if(youtubeTitle.trim() === "" || youtubeTitle === undefined || youtubeTitle === null) {
        return;
    }
    try {
        const data = await getOrPostOrDeleteData("get-chat-history", "GET", { title: youtubeTitle });
        if (data.length !== 0) {
            setChatHistory(data["chat-history"]);
        }

    } catch (error) {
        console.error("Error fetching chat history:", error);
    }
}

export const handleDeleteLeftSideChatTitles = async (title, setTitles) => {
    const result = await getOrPostOrDeleteData("delete-chat", "DELETE", { "title": title });
    await handleLeftSideChatTitles(setTitles);
    console.log("Delete result:", result);
}