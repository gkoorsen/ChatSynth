import React, { useState } from 'react';
import './App.css';
import LandingPage from './LandingPage';

// Configuration object for different environments
const config = {
  // Primary endpoint from environment variable
  LAMBDA_ENDPOINT: process.env.REACT_APP_LAMBDA_ENDPOINT,
  
  // Fallback for local development
  FALLBACK_ENDPOINT: 'http://localhost:3001/api/generate',
  
  // Environment detection
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  
  // Optional: Environment-specific settings
  DEBUG_MODE: process.env.REACT_APP_DEBUG_MODE === 'true',
  APP_ENV: process.env.REACT_APP_ENV || 'development'
};

// Validate configuration
const validateConfig = () => {
  if (config.IS_PRODUCTION && !config.LAMBDA_ENDPOINT) {
    console.error('❌ REACT_APP_LAMBDA_ENDPOINT is required in production');
    throw new Error('Missing required environment variable: REACT_APP_LAMBDA_ENDPOINT');
  }
  
  if (config.DEBUG_MODE) {
    console.log('🔧 ChatSynth Configuration:', {
      endpoint: config.LAMBDA_ENDPOINT || config.FALLBACK_ENDPOINT,
      environment: config.APP_ENV,
      isProduction: config.IS_PRODUCTION
    });
  }
};

// Get the appropriate endpoint
const getApiEndpoint = () => {
  if (config.LAMBDA_ENDPOINT) {
    return config.LAMBDA_ENDPOINT;
  }
  
  if (config.IS_DEVELOPMENT) {
    console.warn('⚠️ Using fallback endpoint for development:', config.FALLBACK_ENDPOINT);
    return config.FALLBACK_ENDPOINT;
  }
  
  throw new Error('No API endpoint configured');
};

function App() {
  const [conversations, setConversations] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState(''); // For better user feedback
  const [currentConversation, setCurrentConversation] = useState(0);

  // Validate configuration on app load
  React.useEffect(() => {
    try {
      validateConfig();
    } catch (configError) {
      setError(`Configuration Error: ${configError.message}`);
    }
  }, []);

  // Main function to generate conversations using the async pattern
  const generateConversations = async (config, aiSettings) => {
    setIsGenerating(true);
    setError(null);
    setProgress(0);
    setProgressMessage('Initializing...');
    setCurrentConversation(0);
    setConversations([]);

    const conversationCount = config.conversation_count || 1;
    const generatedConversations = [];

    try {
      const apiEndpoint = getApiEndpoint();

      for (let i = 0; i < conversationCount; i++) {
        setCurrentConversation(i + 1);
        setProgressMessage(`Starting conversation ${i + 1}/${conversationCount}...`);
        console.log(`Generating conversation ${i + 1}/${conversationCount}`);

        const requestBody = {
          ...config,
          ai_settings: aiSettings,
          // Ensure generationMode is set for the Lambda
          generationMode: config.generationMode || 'single_ai'
        };

        // 1. Start the async job
        const startResponse = await fetch(`${apiEndpoint}?mode=async`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        if (!startResponse.ok) {
          const errorText = await startResponse.text();
          throw new Error(`Failed to start job: ${startResponse.status} - ${errorText}`);
        }

        const startResult = await startResponse.json();
        const { jobId } = startResult;

        if (!jobId) {
          throw new Error('No Job ID received from the server.');
        }

        console.log(`🚀 Job ${jobId} started. Polling for results...`);

        // 2. Poll for the result
        const conversationResult = await pollForJobCompletion(jobId, apiEndpoint);
        
        generatedConversations.push({
          id: i + 1,
          conversation: conversationResult.conversation,
          metadata: {
            ...conversationResult.enhancedMetadata,
            generated_at: new Date().toISOString(),
            total_turns: conversationResult.conversation.length,
            subject: config.subject,
            model: aiSettings.model,
            processing_mode: 'async',
          }
        });

        setConversations([...generatedConversations]);
        const progressPercent = ((i + 1) / conversationCount) * 100;
        setProgress(progressPercent);
      }

      console.log(`✅ All ${conversationCount} conversations generated!`);
      setProgress(100);
      setProgressMessage('Completed!');

    } catch (err) {
      console.error('❌ Conversation generation failed:', err);
      setError(err.message);
      setProgressMessage('Error!');
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to poll the job status endpoint
  const pollForJobCompletion = (jobId, endpoint) => {
    return new Promise((resolve, reject) => {
      const maxAttempts = 200; // ~10 minutes
      let attempts = 0;

      const interval = setInterval(async () => {
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          reject(new Error(`Job ${jobId} timed out after 10 minutes.`));
          return;
        }
        attempts++;

        try {
          const statusResponse = await fetch(`${endpoint}?mode=status&jobId=${jobId}`);
          
          if (!statusResponse.ok) {
            // Don't stop polling for server errors, just log and continue
            console.error(`Status check for ${jobId} failed with status: ${statusResponse.status}`);
            return;
          }

          const result = await statusResponse.json();
          
          setProgress(result.progress || 0);
          setProgressMessage(result.message || result.status);
          console.log(`Job ${jobId} status (${result.progress}%): ${result.message}`);

          if (result.status === 'completed') {
            clearInterval(interval);
            if (result.conversation && result.conversation.length > 0) {
              resolve(result);
            } else {
              reject(new Error('Job completed but returned no conversation data.'));
            }
          } else if (result.status === 'failed') {
            clearInterval(interval);
            reject(new Error(result.error || 'The generation job failed.'));
          }
          // If 'queued' or 'processing', the loop will continue naturally

        } catch (error) {
          console.error(`Error while polling job ${jobId}:`, error);
          // Don't reject on a single failed poll, to be resilient to network issues
        }
      }, 3000); // Poll every 3 seconds
    });
  };


  // Direct conversation generation (for simple jobs under 25 seconds)
  const generateDirectConversation = async (config, aiSettings, endpoint) => {
    const requestBody = {
      ...config,
      ai_settings: aiSettings
    };
  
    console.log('Making direct request to Lambda:', requestBody);
  
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
  
    console.log('Direct response status:', response.status);
  
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Direct error response:', errorText);
      throw new Error(`Direct request failed: ${response.status} ${response.statusText}: ${errorText}`);
    }
  
    const result = await response.json();
    console.log('Direct result:', result);
  
    if (result.conversation && Array.isArray(result.conversation)) {
      return result.conversation;
    } else {
      throw new Error('Invalid response format: expected conversation array');
    }
  };
  
  // Async conversation generation (for complex jobs)
  const generateAsyncConversation = async (config, aiSettings, endpoint) => {
    const requestBody = {
      ...config,
      ai_settings: aiSettings
    };
  
    console.log('Starting async job:', requestBody);
  
    // Start the async job
    const startResponse = await fetch(`${endpoint}?mode=async`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
  
    console.log('Async start response status:', startResponse.status);
  
    if (!startResponse.ok) {
      const errorText = await startResponse.text();
      console.error('Async start error:', errorText);
      throw new Error(`Async start failed: ${startResponse.status} ${startResponse.statusText}: ${errorText}`);
    }
  
    const startResult = await startResponse.json();
    console.log('Async job started:', startResult);
  
    if (!startResult.jobId) {
      throw new Error('No job ID received from async start');
    }
  
    const jobId = startResult.jobId;
    console.log(`Polling job ${jobId} for completion...`);
  
    // Poll for completion
    const maxAttempts = 200; // 10 minutes max (3 seconds * 200)
    let attempts = 0;
  
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
      attempts++;
  
      try {
        const statusResponse = await fetch(`${endpoint}?mode=status&jobId=${jobId}`);
        
        if (!statusResponse.ok) {
          console.error(`Status check failed: ${statusResponse.status}`);
          continue;
        }
  
        const statusResult = await statusResponse.json();
        
        // Update progress in UI
        if (statusResult.progress !== undefined) {
          setProgress(statusResult.progress);
        }
        
        console.log(`Job ${jobId} status (${statusResult.progress}%): ${statusResult.message || statusResult.status}`);
  
        if (statusResult.status === 'completed') {
          if (statusResult.conversation && Array.isArray(statusResult.conversation)) {
            console.log(`✅ Async job ${jobId} completed successfully`);
            return statusResult.conversation;
          } else {
            throw new Error('Completed job has no valid conversation data');
          }
        } else if (statusResult.status === 'failed') {
          throw new Error(`Job failed: ${statusResult.error || 'Unknown error'}`);
        } else if (statusResult.status === 'processing' || statusResult.status === 'queued') {
          console.log(`Job ${jobId} still ${statusResult.status}... (attempt ${attempts}/${maxAttempts})`);
          continue;
        }
      } catch (pollError) {
        console.error(`Error polling job ${jobId} (attempt ${attempts}):`, pollError);
        if (attempts >= maxAttempts - 5) {
          throw pollError;
        }
      }
    }
  
    throw new Error(`Job ${jobId} timed out after ${maxAttempts} attempts (10 minutes)`);
  };

  // Single AI conversation generation (direct endpoint call)
  const generateSingleAIConversation = async (config, aiSettings, endpoint) => {
    const requestBody = {
      ...config,
      ai_settings: aiSettings
    };

    console.log('Making request to Lambda for single AI:', requestBody);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Single AI response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Single AI error response:', errorText);
      throw new Error(`Single AI failed: ${response.status} ${response.statusText}: ${errorText}`);
    }

    const result = await response.json();
    console.log('Single AI result:', result);

    if (result.conversation && Array.isArray(result.conversation)) {
      return result.conversation;
    } else {
      throw new Error('Invalid response format: expected conversation array');
    }
  };

  // Dual AI conversation generation (async with job polling)
const generateDualAIConversation = async (config, aiSettings, endpoint) => {
  const requestBody = {
    ...config,
    ai_settings: aiSettings
  };

  console.log('Starting dual AI async job:', requestBody);

  let jobId;

  try {
    // Start the async job using the endpoint with mode=async query parameter
    const startResponse = await fetch(`${endpoint}?mode=async`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Dual AI start response status:', startResponse.status);

    if (!startResponse.ok) {
      const errorText = await startResponse.text();
      console.error('Dual AI start error:', errorText);
      throw new Error(`Dual AI start failed: ${startResponse.status} ${startResponse.statusText}: ${errorText}`);
    }

    const startResult = await startResponse.json();
    console.log('Dual AI job started:', startResult);

    if (!startResult.jobId) {
      throw new Error('No job ID received from async start');
    }

    jobId = startResult.jobId;
    
  } catch (startError) {
    // If we get a 504 error, the job might still have started
    if (startError.message.includes('504') || startError.name === 'TypeError') {
      console.warn('⚠️ Got timeout starting job, but job may have started. Attempting to find job...');
      
      // Generate a probable jobId based on timestamp (this is a fallback)
      // In a real scenario, you might want to implement a different strategy
      throw new Error('Job start timed out at API Gateway level. Please try with a simpler configuration (single AI, fewer turns, or GPT-4o instead of O3-mini).');
    } else {
      throw startError;
    }
  }

  console.log(`Polling job ${jobId} for completion...`);

  // Poll for completion using the endpoint with mode=status query parameter
  const maxAttempts = 120; // 10 minutes max (5 seconds * 120)
  let attempts = 0;

  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds (faster polling)
    attempts++;

    try {
      const statusResponse = await fetch(`${endpoint}?mode=status&jobId=${jobId}`);
      
      if (!statusResponse.ok) {
        console.error(`Status check failed: ${statusResponse.status}`);
        continue;
      }

      const statusResult = await statusResponse.json();
      console.log(`Job ${jobId} status (${statusResult.progress}%):`, statusResult.message || statusResult.status);

      // Update progress if available
      if (statusResult.progress !== undefined) {
        const progressPercent = statusResult.progress;
        setProgress(progressPercent);
      }

      if (statusResult.status === 'completed') {
        if (statusResult.conversation && Array.isArray(statusResult.conversation)) {
          console.log(`✅ Dual AI job ${jobId} completed successfully`);
          return statusResult.conversation;
        } else {
          throw new Error('Completed job has no valid conversation data');
        }
      } else if (statusResult.status === 'failed') {
        throw new Error(`Job failed: ${statusResult.error || 'Unknown error'}`);
      } else if (statusResult.status === 'processing' || statusResult.status === 'queued') {
        console.log(`Job ${jobId} still ${statusResult.status}... (attempt ${attempts}/${maxAttempts})`);
        continue;
      } else {
        console.warn(`Unknown job status: ${statusResult.status}`);
        continue;
      }
    } catch (pollError) {
      console.error(`Error polling job ${jobId} (attempt ${attempts}):`, pollError);
      if (attempts >= maxAttempts - 5) { // Only throw on last few attempts
        throw pollError;
      }
    }
  }

  throw new Error(`Job ${jobId} timed out after ${maxAttempts} attempts (10 minutes)`);
};
  const downloadConversations = () => {
    const dataStr = JSON.stringify(conversations, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `chatsynth_conversations_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <div className="App">
      <LandingPage 
        onGenerate={generateConversations}
        isGenerating={isGenerating}
        progress={progress}
        progressMessage={progressMessage}
        currentConversation={currentConversation}
        conversations={conversations}
        error={error}
        onDownload={downloadConversations}
        onCopy={copyToClipboard}
      />
    </div>
  ); 
}

export default App;
