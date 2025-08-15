import React, { useState } from 'react';
import './App.css';

// Import the improved LandingPage component
import LandingPage from './components/LandingPage';

const LAMBDA_ENDPOINT = 'https://3py5676r52.execute-api.us-east-1.amazonaws.com/prod/generate';

function App() {
  const [conversations, setConversations] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentConversation, setCurrentConversation] = useState(0);

  const generateConversations = async (config, aiSettings) => {
    console.log('Starting conversation generation...');
    console.log('Config:', config);
    console.log('AI Settings:', aiSettings);

    setIsGenerating(true);
    setError(null);
    setProgress(0);
    setCurrentConversation(0);
    setConversations([]);

    const conversationCount = config.conversation_count || 1;
    const generatedConversations = [];

    try {
      for (let i = 0; i < conversationCount; i++) {
        setCurrentConversation(i + 1);
        console.log(`Generating conversation ${i + 1}/${conversationCount} using model: ${aiSettings.model}`);

        try {
          let conversation;
          
          // Check if this is dual AI mode
          if (config.generationMode === 'dual_ai') {
            // Use async processing for dual AI
            conversation = await generateDualAIConversation(config, aiSettings);
          } else {
            // Use direct processing for single AI
            conversation = await generateSingleAIConversation(config, aiSettings);
          }

          if (conversation && conversation.length > 0) {
            generatedConversations.push({
              id: i + 1,
              conversation: conversation,
              metadata: {
                generated_at: new Date().toISOString(),
                total_turns: conversation.length,
                subject: config.subject,
                generation_mode: config.generationMode || 'single_ai',
                model: aiSettings.model
              }
            });
            console.log(`✅ Conversation ${i + 1} generated successfully with ${conversation.length} turns`);
          } else {
            throw new Error(`Conversation ${i + 1} failed: No conversation data received`);
          }
        } catch (conversationError) {
          console.error(`❌ Error generating conversation ${i + 1}:`, conversationError);
          throw new Error(`Failed at conversation ${i + 1}: ${conversationError.message}`);
        }

        // Update progress
        const progressPercent = ((i + 1) / conversationCount) * 100;
        setProgress(progressPercent);
        setConversations([...generatedConversations]);
      }

      console.log(`✅ All ${conversationCount} conversations generated successfully!`);
      setProgress(100);

    } catch (error) {
      console.error('❌ Error generating conversations:', error);
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Single AI conversation generation (direct endpoint call)
  const generateSingleAIConversation = async (config, aiSettings) => {
    const requestBody = {
      ...config,
      ai_settings: aiSettings
    };

    console.log('Making request to Lambda for single AI:', requestBody);

    const response = await fetch(LAMBDA_ENDPOINT, {
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
  const generateDualAIConversation = async (config, aiSettings) => {
    const requestBody = {
      ...config,
      ai_settings: aiSettings
    };

    console.log('Starting dual AI async job:', requestBody);

    // Start the async job using the single endpoint with mode=async query parameter
    const startResponse = await fetch(`${LAMBDA_ENDPOINT}?mode=async`, {
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

    const jobId = startResult.jobId;
    console.log(`Polling job ${jobId} for completion...`);

    // Poll for completion using the single endpoint with mode=status query parameter
    const maxAttempts = 60; // 5 minutes max (5 seconds * 60)
    let attempts = 0;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      attempts++;

      try {
        const statusResponse = await fetch(`${LAMBDA_ENDPOINT}?mode=status&jobId=${jobId}`);
        
        if (!statusResponse.ok) {
          console.error(`Status check failed: ${statusResponse.status}`);
          continue;
        }

        const statusResult = await statusResponse.json();
        console.log(`Job ${jobId} status:`, statusResult);

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
        console.error(`Error polling job ${jobId}:`, pollError);
        if (attempts >= maxAttempts - 5) { // Only throw on last few attempts
          throw pollError;
        }
      }
    }

    throw new Error(`Job ${jobId} timed out after ${maxAttempts} attempts (5 minutes)`);
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
