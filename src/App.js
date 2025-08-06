import React, { useState } from 'react';
import ConfigForm from './components/ConfigForm';
import ConversationList from './components/ConversationList';
import ConversationViewer from './components/ConversationViewer';

function App() {
  const [config, setConfig] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async (cfg) => {
    setConfig(cfg);
    setLoading(true);
    setError(null);
    
    try {
      // Use environment variable for API URL, with fallback
      const apiUrl = process.env.REACT_APP_API_URL || 'https://3py567dr52.execute-api.us-east-1.amazonaws.com/prod';
      
      console.log('Calling API:', `${apiUrl}/generate`);
      console.log('Config:', cfg);
      
      const response = await fetch(`${apiUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cfg)
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.conversations && data.conversations.length > 0) {
        setConversations(data.conversations);
      } else {
        throw new Error('No conversations returned from API');
      }
      
    } catch (err) {
      console.error('Error generating conversations:', err);
      setError(`Failed to generate conversations: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadJSON = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Synthetic Chat Simulator</h1>

      <ConfigForm
        initialConfig={config}
        onSubmit={handleGenerate}
        onDownloadConfig={() => config && downloadJSON(config, 'config.json')}
        loading={loading}
      />

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading && (
        <div className="mt-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          Generating conversations with OpenAI... This may take a moment.
        </div>
      )}

      {conversations.length > 0 && (
        <>
          <div className="mt-6 flex justify-between">
            <ConversationList
              conversations={conversations}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
            />
            <ConversationViewer conversation={conversations[selectedIndex]} />
          </div>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => downloadJSON(conversations, 'conversations.json')}
          >
            Download All Conversations
          </button>
        </>
      )}
    </div>
  );
}

export default App;
