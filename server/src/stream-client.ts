import {StreamClient} from "@stream-io/node-sdk";

const apiKey = "zxgj5y794c32";
const apiSecret = "5mcpgsqe85rykd8tr63mnu2md7tx9pwfmg5fm2z7dnvwa4abbk6pcamgc8utypkp";

if (!apiKey || !apiSecret) {
    throw new Error("API key and secret must be provided.");
}

export const client = new StreamClient(apiKey, apiSecret);

const fetchWithRetry = async (url: string | URL | Request, options: RequestInit | undefined, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            if (i === retries - 1) throw error;
            console.log(`Retrying... (${i + 1})`);
        }
    }
};

const getLocationHint = async () => {
    try {
        const hint = await fetchWithRetry("https://hint.stream-io-video.com/", { method: "GET" });
        return hint;
    } catch (error) {
        console.error("Failed to get location hint:", error);
        // Handle error gracefully
    }
};
