import React, { useState } from 'react';
import { Storage, API } from 'aws-amplify';
import ConfigForm from './components/ConfigForm';
import ConversationList from './components/ConversationList';
import ConversationViewer from './components/ConversationViewer';

function App() {
  const [config, setConfig] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleGenerate = async (cfg) => {
    setConfig(cfg);
    // call your backend Lambda via API Gateway
    const response = await API.post('ChatSimAPI', '/generate', { body: cfg });
    setConversations(response.conversations);
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
      />

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
