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
  const [progress, setProgress] = useState({ current: 0, total: 0 });

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

  const generateMultipleConversations = async (cfg) => {
    const apiUrl = getApiUrl();
    const singleConversationConfig = {
      ...cfg,
      numberOfConversations: 1 // Always request 1 conversation at a time
    };
    
    const allConversations = [];
    const totalWanted = cfg.numberOfConversations || 3;
    
    setProgress({ current: 0, total: totalWanted });
    
    for (let i = 0; i < totalWanted; i++) {
      try {
        console.log(`Generating conversation ${i + 1}/${totalWanted}`);
        setProgress({ current: i + 1, total: totalWanted });
        
        const response = await fetch(`${apiUrl}/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(singleConversationConfig)
        });
        
        console.log(`Conversation ${i + 1} response status:`, response.status);
        
        if (!response.ok) {
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch (e) {
            // If we can't parse JSON, use the basic error
          }
          throw new Error(`Conversation ${i + 1} failed: ${errorMessage}`);
        }
        
        const data = await response.json();
        console.log(`✅ Successfully generated conversation ${i + 1}`);
        
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
          throw new Error(`Conversation ${i + 1}: ${parsedData.error}`);
        }
        
        // Add conversations to our collection
        if (parsedData.conversations && Array.isArray(parsedData.conversations) && parsedData.conversations.length > 0) {
          allConversations.push(...parsedData.conversations);
        } else {
          console.warn(`Conversation ${i + 1} returned no conversations`);
        }
        
        // Small delay between requests to avoid overwhelming the API
        if (i < totalWanted - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
      } catch (error) {
        console.error(`❌ Error generating conversation ${i + 1}:`, error);
        throw new Error(`Failed at conversation ${i + 1}: ${error.message}`);
      }
    }
    
    return allConversations;
  };

  const handleGenerate = async (cfg) => {
    setConfig(cfg);
    setLoading(true);
    setError(null);
    setProgress({ current: 0, total: 0 });
    
    try {
      console.log('Starting conversation generation...');
      console.log('Config:', cfg);
      
      const allConversations = await generateMultipleConversations(cfg);
      
      if (allConversations.length > 0) {
        setConversations(allConversations);
        setSelectedIndex(0); // Reset to first conversation
        
        // Log success info
        console.log(`✅ Successfully generated ${allConversations.length} total conversations`);
      } else {
        throw new Error('No conversations were generated');
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
      } else if (err.message.includes('Endpoint request timed out')) {
        userMessage = 'Request timed out. The API took too long to respond.';
      }
      
      setError(`Failed to generate conversations: ${userMessage}`);
    } finally {
      setLoading(false);
      setProgress({ current: 0, total: 0 });
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
        error={error}
        progress={progress}
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
                  setProgress({ current: 0, total: 0 });
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

      {/* Enhanced Loading Display with Progress */}
      {loading && (
        <div className="mt-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          <div className="flex items-center mb-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
            <span className="font-medium">Generating conversations with OpenAI...</span>
          </div>
          {progress.total > 0 && (
            <div className="mb-2">
              <div className="text-sm mb-1">
                Progress: {progress.current}/{progress.total} conversations
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
          <div className="text-sm">
            Using {apiInfo.environment} API • Each conversation takes ~10-15 seconds
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
              ChatSynth v1.0 • Powered by OpenAI o3-mini
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
