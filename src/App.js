import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import ConversationList from './components/ConversationList';
import ConversationViewer from './components/ConversationViewer';

function App() {
  const [config, setConfig] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API Configuration - Support both local and production
  const getApiUrl = () => {
    // Check for environment variable first
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    
    // Check if we're in development and local server is available
    if (process.env.NODE_ENV === 'development') {
      // Try local server first in development
      return 'http://localhost:3001';
    }
    
    // Fallback to your AWS API Gateway
    return 'https://3py5676r52.execute-api.us-east-1.amazonaws.com/prod';
  };

  const handleGenerate = async (cfg) => {
    setConfig(cfg);
    setLoading(true);
    setError(null);
    
    try {
      const apiUrl = getApiUrl();
      const endpoint = `${apiUrl}/generate`;
      
      console.log('Calling API:', endpoint);
      console.log('Config:', cfg);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cfg)
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        // Try to get error details
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          // If we can't parse JSON, use the basic error
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      // Handle different response formats
      let parsedData = data;
      
      // If it's a Lambda response with statusCode, body format
      if (data.statusCode && data.body) {
        if (data.statusCode !== 200) {
          const errorBody = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
          throw new Error(errorBody.error || 'API returned error status');
        }
        parsedData = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
      }
      
      // Check for errors in the parsed data
      if (parsedData.error) {
        throw new Error(parsedData.error);
      }
      
      // Extract conversations
      if (parsedData.conversations && Array.isArray(parsedData.conversations) && parsedData.conversations.length > 0) {
        setConversations(parsedData.conversations);
        setSelectedIndex(0); // Reset to first conversation
        
        // Log success info
        console.log(`✅ Successfully generated ${parsedData.conversations.length} conversations`);
        if (parsedData.metadata) {
          console.log('📊 Metadata:', parsedData.metadata);
        }
      } else {
        throw new Error('No conversations returned from API');
      }
      
    } catch (err) {
      console.error('❌ Error generating conversations:', err);
      
      // Provide user-friendly error messages
      let userMessage = err.message;
      
      if (err.message.includes('Failed to fetch')) {
        const apiUrl = getApiUrl();
        if (apiUrl.includes('localhost')) {
          userMessage = 'Cannot connect to local server. Make sure you\'re running: node local-server.js';
        } else {
          userMessage = 'Cannot connect to the API. Please check your internet connection.';
        }
      } else if (err.message.includes('CORS')) {
        userMessage = 'CORS error - the API server may not be configured properly for this domain.';
      } else if (err.message.includes('OpenAI API key')) {
        userMessage = 'OpenAI API key is not configured on the server.';
      }
      
      setError(`Failed to generate conversations: ${userMessage}`);
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
    URL.revokeObjectURL(url); // Clean up
  };

  const getCurrentApiInfo = () => {
    const apiUrl = getApiUrl();
    const isLocal = apiUrl.includes('localhost');
    const isProduction = apiUrl.includes('amazonaws.com');
    
    return {
      url: apiUrl,
      environment: isLocal ? 'Local Development' : isProduction ? 'AWS Production' : 'Custom',
      status: isLocal ? '🏠' : isProduction ? '☁️' : '⚙️'
    };
  };

  const apiInfo = getCurrentApiInfo();

  // Show landing page if no conversations have been generated
  if (conversations.length === 0) {
    return (
      <LandingPage
        onSubmit={handleGenerate}
        loading={loading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ChatSynth</h1>
              <p className="text-gray-600">Generated Conversations</p>
            </div>
            
            {/* API Status Indicator */}
            <div className="flex items-center space-x-4">
              <button
                className="px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600 transition-colors"
                onClick={() => {
                  setConversations([]);
                  setConfig(null);
                  setSelectedIndex(0);
                  setError(null);
                }}
              >
                ← New Configuration
              </button>
              <div className="text-sm bg-gray-100 px-3 py-1 rounded">
                <span className="mr-1">{apiInfo.status}</span>
                <span className="font-medium">{apiInfo.environment}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">

      {/* Enhanced Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <div className="font-medium mb-2">⚠️ Generation Failed</div>
          <div className="mb-2">{error}</div>
          <details className="text-sm">
            <summary className="cursor-pointer hover:underline">Debug Information</summary>
            <div className="mt-2 p-2 bg-red-50 rounded text-xs">
              <div>API Endpoint: {apiInfo.url}/generate</div>
              <div>Environment: {apiInfo.environment}</div>
              <div>Timestamp: {new Date().toLocaleString()}</div>
            </div>
          </details>
        </div>
      )}

      {/* Enhanced Loading Display */}
      {loading && (
        <div className="mt-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
            <span className="font-medium">Generating conversations with OpenAI...</span>
          </div>
          <div className="text-sm mt-1">
            Using {apiInfo.environment} API • This may take 10-30 seconds
          </div>
        </div>
      )}

        {/* Results Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Generated Conversations ({conversations.length})
              </h2>
              <button
                className="px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600 transition-colors shadow-sm"
                onClick={() => downloadJSON(conversations, `conversations-${Date.now()}.json`)}
              >
                📥 Download All Conversations
              </button>
            </div>
          </div>
          
          <div className="flex">
            <ConversationList
              conversations={conversations}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
            />
            <ConversationViewer 
              conversation={conversations[selectedIndex]} 
              conversationIndex={selectedIndex}
              totalConversations={conversations.length}
            />
          </div>
        </div>

        {/* Additional Actions */}
        <div className="mt-6 flex gap-4 justify-center">
          <button
            className="px-6 py-3 bg-green-500 text-black rounded-lg hover:bg-green-600 transition-colors shadow-sm"
            onClick={() => {
              const conversation = conversations[selectedIndex];
              const text = conversation
                .map(turn => `${turn.role.toUpperCase()}: ${turn.message}`)
                .join('\n\n');
              navigator.clipboard.writeText(text);
              alert('Conversation copied to clipboard!');
            }}
          >
            📋 Copy Current Conversation
          </button>
          
          <button
            className="px-6 py-3 bg-purple-500 text-black rounded-lg hover:bg-purple-600 transition-colors shadow-sm"
            onClick={() => {
              // Generate more conversations with the same config
              if (config && !loading) {
                handleGenerate(config);
              }
            }}
            disabled={loading || !config}
          >
            🔄 Generate More
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-8 pt-6 border-t text-sm text-gray-500 text-center">
          <div className="flex justify-between items-center">
            <div>
              ChatSynth v1.0 • Powered by OpenAI GPT-3.5-turbo
            </div>
            <div>
              API: {apiInfo.environment}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
