// worker.js
self.onmessage = async (event) => {
    const { apiUrl } = event.data;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        self.postMessage({ data });
    } catch (error) {
        self.postMessage({ error: error.message });
    }
};
