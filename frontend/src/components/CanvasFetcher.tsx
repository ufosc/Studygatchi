import React, { useState } from 'react';
import { browser } from '../lib/browser';

const CanvasFetcher: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCanvasData = async () => {
    setLoading(true);
    setError(null);

    try {
      const startDate = '2026-06-07';
      const endDate = '2026-06-13';

      // Get the active Canvas tab
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });

      if (!tab?.id) {
        throw new Error('No active tab found');
      }

      // Send message to content script
      browser.tabs.sendMessage(
        tab.id,
        { action: 'fetchCanvasData', startDate, endDate },
        (response: any) => {
          if (chrome.runtime.lastError) {
            setError(chrome.runtime.lastError.message || 'Failed to communicate with Canvas');
            setLoading(false);
            return;
          }

          if (response?.success) {
            setData(response.data);
          } else {
            setError(response?.error || 'Failed to fetch');
          }
          setLoading(false);
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h2>Canvas Data Fetcher</h2>
      <button onClick={fetchCanvasData} disabled={loading}>
        {loading ? 'Fetching...' : 'Fetch Canvas Data'}
      </button>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {data && (
        <div style={{ marginTop: '20px' }}>
          <h3>Found {data.length} items:</h3>
          <pre style={{
            background: '#2b2b2b',
            color: '#f8f8f2',
            padding: '10px',
            overflow: 'auto',
            borderRadius: '4px'
          }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CanvasFetcher;