// Manifest v3 requires that content scripts be self-contained, so we have to inline it
const browser = (typeof chrome !== 'undefined' ? chrome : (window as any).browser);

browser.runtime.onMessage.addListener((request: any, _sender: any, sendResponse: any) => {
    if (request.action === 'fetchCanvasData') {
        const { startDate, endDate } = request;

        fetch(`/api/v1/planner/items?per_page=100&start_date=${startDate}&end_date=${endDate}`)
            .then(r => r.json())
            .then(data => sendResponse({ success: true, data }))
            .catch(error => sendResponse({ success: false, error: error.message }));

        return true;
    }
});