import React, { useState } from 'react';

const LandingPage = ({ onGenerate, isGenerating, progress, currentConversation, conversations, error, onDownload, onCopy }) => {
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [config, setConfig] = useState({
    generationMode: 'single_ai',
    conversation_count: 1,
    subject: 'mathematics',
    conversation_structure: {
      turns: 8,
      starter: 'tutor',
      purpose: 'Educational tutoring session focusing on student understanding and skill development',
      tutor_student_ratio: "1:1",
      conversation_starter: 'tutor'
    },
    vocabulary: {
      complexity: 'intermediate',
      domain_specific: true,
      subject: 'general'
    },
    tutor_questions: {
      frequency: 'moderate',
      type: 'scaffolding',
      purpose_distribution: {
        assessment: 1,
        guidance: 1,
        clarification: 1
      }
    },
    student_utterances: {
      engagement: 'high',
      confusion_level: 'realistic',
      confusion_scores: {
        mean: 3,
        std: 1,
        min: 1,
        max: 5
      },
      correctness_distribution: {
        correct_independent: 0.3,
        correct_assisted: 0.5,
        incorrect: 0.2
      }
    },
    student_purposes: {
      purpose_weights: {
        better_understanding: 0.3,
        clarification: 0.3,
        practice: 0.2,
        validation: 0.1,
        help_with_problem: 0.1
      },
      custom_purposes: []
    },
    tutor_purposes: {
      purpose_weights: {
        scaffolding: 0.3,
        explanation: 0.3,
        assessment: 0.2,
        encouragement: 0.1,
        guided_discovery: 0.1
      },
      custom_purposes: []
    },
    // Additional parameters that might be needed by the lambda function
    response_format: 'json',
    include_metadata: true,
    language: 'english'
  });

  // Cookie helpers
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const setCookie = (name, value, days = 30) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
  };

  const [apiKey, setApiKey] = useState(() => getCookie('openai_api_key') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(() => !getCookie('openai_api_key'));

  const [aiSettings, setAiSettings] = useState({
    model: 'gpt-4o',
    temperature: 0.7,
    max_completion_tokens: 2000, // O3-mini uses max_completion_tokens instead of max_tokens
    reasoning_effort: 'medium', // For O3-mini: 'low', 'medium', 'high'
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0
  });

  // Helper function to check if model is O3-mini
  const isO3Mini = (model) => model === 'o3-mini';

  // Complete preset configurations with O3-mini support
  const presets = [
    {
      id: 'math_basic',
      title: 'Mathematics Tutoring',
      description: 'Basic algebra and arithmetic problem-solving sessions',
      mode: 'Single AI',
      complexity: 'Beginner',
      popular: true,
      config: {
        generationMode: 'single_ai',
        subject: 'mathematics',
        conversation_structure: {
          turns: 8,
          starter: 'tutor',
          purpose: 'Mathematics tutoring focusing on algebra and problem-solving with step-by-step guidance',
          tutor_student_ratio: "1:1",
          conversation_starter: 'tutor'
        },
        vocabulary: {
          complexity: 'intermediate',
          domain_specific: true,
          subject: 'mathematics'
        },
        tutor_questions: {
          frequency: 'high',
          type: 'scaffolding',
          purpose_distribution: { assessment: 2, guidance: 3, clarification: 1 }
        },
        student_utterances: {
          engagement: 'high',
          confusion_level: 'moderate',
          confusion_scores: { mean: 3, std: 1, min: 1, max: 5 },
          correctness_distribution: { correct_independent: 0.2, correct_assisted: 0.6, incorrect: 0.2 }
        },
        student_purposes: {
          purpose_weights: { better_understanding: 0.4, clarification: 0.3, practice: 0.2, validation: 0.05, help_with_problem: 0.05 },
          custom_purposes: []
        },
        tutor_purposes: {
          purpose_weights: { scaffolding: 0.4, explanation: 0.3, assessment: 0.2, encouragement: 0.05, guided_discovery: 0.05 },
          custom_purposes: []
        },
        response_format: 'json',
        include_metadata: true,
        language: 'english'
      },
      aiSettings: {
        model: 'gpt-4o',
        temperature: 0.6,
        max_completion_tokens: 1800,
        reasoning_effort: 'medium',
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
      }
    },
    {
      id: 'math_o3',
      title: 'Advanced Math Reasoning (O3-mini)',
      description: 'Complex mathematical problem-solving with advanced reasoning',
      mode: 'Single AI',
      complexity: 'Advanced',
      popular: true,
      config: {
        generationMode: 'single_ai',
        subject: 'mathematics',
        conversation_structure: {
          turns: 10,
          starter: 'tutor',
          purpose: 'Advanced mathematics tutoring with deep reasoning and complex problem-solving',
          tutor_student_ratio: "1:1",
          conversation_starter: 'tutor'
        },
        vocabulary: {
          complexity: 'advanced',
          domain_specific: true,
          subject: 'mathematics'
        },
        tutor_questions: {
          frequency: 'high',
          type: 'socratic',
          purpose_distribution: { assessment: 3, guidance: 2, clarification: 1 }
        },
        student_utterances: {
          engagement: 'high',
          confusion_level: 'challenging',
          confusion_scores: { mean: 4, std: 1, min: 2, max: 5 },
          correctness_distribution: { correct_independent: 0.1, correct_assisted: 0.7, incorrect: 0.2 }
        },
        student_purposes: {
          purpose_weights: { better_understanding: 0.5, clarification: 0.3, practice: 0.1, validation: 0.05, help_with_problem: 0.05 },
          custom_purposes: []
        },
        tutor_purposes: {
          purpose_weights: { scaffolding: 0.3, explanation: 0.4, assessment: 0.2, encouragement: 0.05, guided_discovery: 0.05 },
          custom_purposes: []
        },
        response_format: 'json',
        include_metadata: true,
        language: 'english'
      },
      aiSettings: {
        model: 'o3-mini',
        reasoning_effort: 'high',
        max_completion_tokens: 2500,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
      }
    },
    {
      id: 'science_discovery',
      title: 'Science Discovery Learning',
      description: 'Inquiry-based science exploration and hypothesis testing',
      mode: 'Dual AI',
      complexity: 'Intermediate',
      popular: true,
      config: {
        generationMode: 'dual_ai',
        conversation_count: 2,
        subject: 'science',
        conversation_structure: {
          turns: 10,
          starter: 'student',
          purpose: 'Science discovery learning with inquiry-based approach and hypothesis testing',
          tutor_student_ratio: "1:1",
          conversation_starter: 'student'
        },
        vocabulary: {
          complexity: 'intermediate',
          domain_specific: true,
          subject: 'science'
        },
        tutor_questions: {
          frequency: 'moderate',
          type: 'socratic',
          purpose_distribution: { assessment: 1, guidance: 2, clarification: 2 }
        },
        student_utterances: {
          engagement: 'high',
          confusion_level: 'realistic',
          confusion_scores: { mean: 3, std: 1.5, min: 1, max: 5 },
          correctness_distribution: { correct_independent: 0.3, correct_assisted: 0.4, incorrect: 0.3 }
        },
        student_purposes: {
          purpose_weights: { better_understanding: 0.3, clarification: 0.2, practice: 0.3, validation: 0.1, help_with_problem: 0.1 },
          custom_purposes: []
        },
        tutor_purposes: {
          purpose_weights: { scaffolding: 0.2, explanation: 0.2, assessment: 0.1, encouragement: 0.2, guided_discovery: 0.3 },
          custom_purposes: []
        },
        response_format: 'json',
        include_metadata: true,
        language: 'english'
      },
      aiSettings: {
        model: 'gpt-4o',
        temperature: 0.8,
        max_completion_tokens: 2200,
        reasoning_effort: 'medium',
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
      }
    },
    {
      id: 'language_arts',
      title: 'Language Arts Discussion',
      description: 'Reading comprehension and literary analysis conversations',
      mode: 'Single AI',
      complexity: 'Intermediate',
      popular: false,
      config: {
        generationMode: 'single_ai',
        subject: 'language arts',
        conversation_structure: {
          turns: 12,
          starter: 'tutor',
          purpose: 'Language arts discussion focusing on reading comprehension and literary analysis',
          tutor_student_ratio: "1:1",
          conversation_starter: 'tutor'
        },
        vocabulary: {
          complexity: 'advanced',
          domain_specific: true,
          subject: 'language arts'
        },
        tutor_questions: {
          frequency: 'moderate',
          type: 'analytical',
          purpose_distribution: { assessment: 1, guidance: 2, clarification: 1 }
        },
        student_utterances: {
          engagement: 'high',
          confusion_level: 'low',
          confusion_scores: { mean: 2, std: 1, min: 1, max: 4 },
          correctness_distribution: { correct_independent: 0.4, correct_assisted: 0.4, incorrect: 0.2 }
        },
        student_purposes: {
          purpose_weights: { better_understanding: 0.4, clarification: 0.2, practice: 0.2, validation: 0.1, help_with_problem: 0.1 },
          custom_purposes: []
        },
        tutor_purposes: {
          purpose_weights: { scaffolding: 0.2, explanation: 0.3, assessment: 0.3, encouragement: 0.1, guided_discovery: 0.1 },
          custom_purposes: []
        },
        response_format: 'json',
        include_metadata: true,
        language: 'english'
      },
      aiSettings: {
        model: 'gpt-4o',
        temperature: 0.7,
        max_completion_tokens: 2000,
        reasoning_effort: 'medium',
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
      }
    },
    {
      id: 'history_analysis',
      title: 'Historical Analysis',
      description: 'Critical thinking about historical events and contexts',
      mode: 'Dual AI',
      complexity: 'Advanced',
      popular: false,
      config: {
        generationMode: 'dual_ai',
        conversation_count: 2,
        subject: 'history',
        conversation_structure: {
          turns: 10,
          starter: 'tutor',
          purpose: 'Historical analysis with critical thinking emphasis and contextual understanding',
          tutor_student_ratio: "1:1",
          conversation_starter: 'tutor'
        },
        vocabulary: {
          complexity: 'advanced',
          domain_specific: true,
          subject: 'history'
        },
        tutor_questions: {
          frequency: 'high',
          type: 'analytical',
          purpose_distribution: { assessment: 2, guidance: 1, clarification: 1 }
        },
        student_utterances: {
          engagement: 'high',
          confusion_level: 'moderate',
          confusion_scores: { mean: 3, std: 1, min: 2, max: 5 },
          correctness_distribution: { correct_independent: 0.3, correct_assisted: 0.5, incorrect: 0.2 }
        },
        student_purposes: {
          purpose_weights: { better_understanding: 0.4, clarification: 0.3, practice: 0.1, validation: 0.1, help_with_problem: 0.1 },
          custom_purposes: []
        },
        tutor_purposes: {
          purpose_weights: { scaffolding: 0.2, explanation: 0.3, assessment: 0.3, encouragement: 0.1, guided_discovery: 0.1 },
          custom_purposes: []
        },
        response_format: 'json',
        include_metadata: true,
        language: 'english'
      },
      aiSettings: {
        model: 'o3-mini',
        reasoning_effort: 'high',
        max_completion_tokens: 2400,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
      }
    },
    {
      id: 'coding_tutor',
      title: 'Programming Tutor',
      description: 'Code review and programming concept explanation',
      mode: 'Single AI',
      complexity: 'Advanced',
      popular: true,
      config: {
        generationMode: 'single_ai',
        subject: 'computer_science',
        conversation_structure: {
          turns: 10,
          starter: 'tutor',
          purpose: 'Programming tutoring session with code examples and debugging practice',
          tutor_student_ratio: "1:1",
          conversation_starter: 'tutor'
        },
        vocabulary: {
          complexity: 'advanced',
          domain_specific: true,
          subject: 'computer_science'
        },
        tutor_questions: {
          frequency: 'moderate',
          type: 'problem_solving',
          purpose_distribution: { assessment: 2, guidance: 2, clarification: 1 }
        },
        student_utterances: {
          engagement: 'high',
          confusion_level: 'challenging',
          confusion_scores: { mean: 4, std: 1, min: 2, max: 5 },
          correctness_distribution: { correct_independent: 0.2, correct_assisted: 0.6, incorrect: 0.2 }
        },
        student_purposes: {
          purpose_weights: { better_understanding: 0.35, clarification: 0.25, practice: 0.2, validation: 0.1, help_with_problem: 0.1 },
          custom_purposes: []
        },
        tutor_purposes: {
          purpose_weights: { scaffolding: 0.35, explanation: 0.35, assessment: 0.2, encouragement: 0.05, guided_discovery: 0.05 },
          custom_purposes: []
        },
        response_format: 'json',
        include_metadata: true,
        language: 'english'
      },
      aiSettings: {
        model: 'o3-mini',
        reasoning_effort: 'high',
        max_completion_tokens: 2800,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
      }
    },
    {
      id: 'custom_topic',
      title: 'Custom Topic Exploration',
      description: 'Flexible conversation generation for any educational topic',
      mode: 'Single AI',
      complexity: 'Beginner',
      popular: false,
      config: {
        generationMode: 'single_ai',
        subject: 'general',
        conversation_structure: {
          turns: 8,
          starter: 'tutor',
          purpose: 'Custom topic exploration with adaptive approach and flexible learning goals',
          tutor_student_ratio: "1:1",
          conversation_starter: 'tutor'
        },
        vocabulary: {
          complexity: 'intermediate',
          domain_specific: false,
          subject: 'general'
        },
        tutor_questions: {
          frequency: 'moderate',
          type: 'exploratory',
          purpose_distribution: { assessment: 1, guidance: 2, clarification: 1 }
        },
        student_utterances: {
          engagement: 'moderate',
          confusion_level: 'realistic',
          confusion_scores: { mean: 3, std: 1, min: 1, max: 5 },
          correctness_distribution: { correct_independent: 0.3, correct_assisted: 0.5, incorrect: 0.2 }
        },
        student_purposes: {
          purpose_weights: { better_understanding: 0.3, clarification: 0.3, practice: 0.2, validation: 0.1, help_with_problem: 0.1 },
          custom_purposes: []
        },
        tutor_purposes: {
          purpose_weights: { scaffolding: 0.3, explanation: 0.3, assessment: 0.2, encouragement: 0.1, guided_discovery: 0.1 },
          custom_purposes: []
        },
        response_format: 'json',
        include_metadata: true,
        language: 'english'
      },
      aiSettings: {
        model: 'gpt-4o',
        temperature: 0.7,
        max_completion_tokens: 2000,
        reasoning_effort: 'medium',
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
      }
    }
  ];

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset.id);
    setConfig(preset.config);
    setAiSettings(preset.aiSettings);
  };

  const handleConfigChange = (path, value) => {
    setConfig(prev => {
      const newConfig = { ...prev };
      const keys = path.split('.');
      let current = newConfig;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newConfig;
    });
  };

  const handleAiSettingChange = (key, value) => {
    setAiSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      
      // Handle model-specific parameter changes
      if (key === 'model') {
        if (isO3Mini(value)) {
          // Switching to O3-mini: remove unsupported parameters, use max_completion_tokens
          const { temperature, top_p, frequency_penalty, presence_penalty, max_tokens, ...o3Settings } = newSettings;
          return {
            ...o3Settings,
            max_completion_tokens: o3Settings.max_completion_tokens || o3Settings.max_tokens || 2000,
            reasoning_effort: o3Settings.reasoning_effort || 'medium'
          };
        } else {
          // Switching from O3-mini: add standard parameters, use max_tokens for compatibility
          const { max_completion_tokens, ...standardSettings } = newSettings;
          return {
            ...standardSettings,
            max_tokens: max_completion_tokens || standardSettings.max_tokens || 2000,
            temperature: standardSettings.temperature || 0.7,
            top_p: standardSettings.top_p || 1.0,
            frequency_penalty: standardSettings.frequency_penalty || 0.0,
            presence_penalty: standardSettings.presence_penalty || 0.0
          };
        }
      }
      
      return newSettings;
    });
  };

  const handleApiKeyChange = (value) => {
    setApiKey(value);
    if (value.trim()) {
      setCookie('openai_api_key', value.trim());
      setShowApiKeyInput(false);
    }
  };

  const handleApiKeyToggle = () => {
    setShowApiKeyInput(!showApiKeyInput);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if API key is provided
    if (!apiKey.trim()) {
      alert('Please provide your OpenAI API key before generating conversations.');
      setShowApiKeyInput(true);
      return;
    }
    
    // Include API key in the generation call
    onGenerate(config, { ...aiSettings, api_key: apiKey.trim() });
  };

  // Safe function to get conversations array
  const getConversationsArray = () => {
    if (!conversations || !Array.isArray(conversations)) {
      return [];
    }
    return conversations;
  };

  // Safe function to get conversation content
  const getConversationContent = (conversation) => {
    if (!conversation) return [];
    
    // If conversation has a 'conversation' property (from metadata structure)
    if (conversation.conversation && Array.isArray(conversation.conversation)) {
      return conversation.conversation;
    }
    
    // If conversation is directly an array
    if (Array.isArray(conversation)) {
      return conversation;
    }
    
    return [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CS</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ChatSynth</h1>
                <p className="text-sm text-gray-600">AI-Powered Educational Conversations</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {isGenerating ? `Generating... ${progress}%` : 'Ready'}
              </div>
              {!showApiKeyInput && (
                <button
                  onClick={handleApiKeyToggle}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m0 0a2 2 0 01-2 2m2-2a2 2 0 002-2m0 0a2 2 0 00-2-2m-4 6V9a2 2 0 00-2-2V5a2 2 0 10-4 0v2a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2z" />
                  </svg>
                  <span>API Key</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API Key Input Section */}
        {showApiKeyInput && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-yellow-800">OpenAI API Key Required</h3>
                <p className="text-sm text-yellow-700 mt-1 mb-4">
                  Please enter your OpenAI API key to generate conversations. Your key will be stored securely in your browser and never shared.
                </p>
                <div className="flex items-center space-x-3">
                  <input
                    type="password"
                    placeholder="sk-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1 px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => handleApiKeyChange(apiKey)}
                    disabled={!apiKey.trim()}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      apiKey.trim()
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Save Key
                  </button>
                  {apiKey && (
                    <button
                      onClick={() => setShowApiKeyInput(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                  )}
                </div>
                <p className="text-xs text-yellow-600 mt-2">
                  Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-800">OpenAI Platform</a>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Presets */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose a Preset</h2>
              <div className="space-y-3">
                {presets.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedPreset === preset.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900">{preset.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{preset.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-blue-400 rounded-full mr-1"></span>
                            {preset.mode}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Column - Configuration */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Basic Configuration */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuration</h2>
                
                <div className="space-y-4">
                  {/* Generation Mode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Generation Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleConfigChange('generationMode', 'single_ai')}
                        className={`p-3 text-sm font-medium rounded-lg border-2 transition-colors ${
                          config.generationMode === 'single_ai'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Single AI
                      </button>
                      <button
                        type="button"
                        onClick={() => handleConfigChange('generationMode', 'dual_ai')}
                        className={`p-3 text-sm font-medium rounded-lg border-2 transition-colors ${
                          config.generationMode === 'dual_ai'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Dual AI
                      </button>
                    </div>
                  </div>

                  {/* Conversation Count */}
                  {config.generationMode === 'dual_ai' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Conversations
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={config.conversation_count}
                        onChange={(e) => handleConfigChange('conversation_count', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <select
                      value={config.subject}
                      onChange={(e) => handleConfigChange('subject', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="mathematics">Mathematics</option>
                      <option value="science">Science</option>
                      <option value="language_learning">Language Learning</option>
                      <option value="language arts">Language Arts</option>
                      <option value="computer_science">Computer Science</option>
                      <option value="history">History</option>
                      <option value="philosophy">Philosophy</option>
                      <option value="general">General</option>
                    </select>
                  </div>

                  {/* Conversation Turns */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Conversation Turns: {config.conversation_structure.turns}
                    </label>
                    <input
                      type="range"
                      min="4"
                      max="20"
                      value={config.conversation_structure.turns}
                      onChange={(e) => handleConfigChange('conversation_structure.turns', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* AI Settings */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Settings</h2>
                
                <div className="space-y-4">
                  {/* Model Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">AI Model</label>
                    <select
                      value={aiSettings.model}
                      onChange={(e) => handleAiSettingChange('model', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="gpt-4o">GPT-4o (Balanced)</option>
                      <option value="o3-mini">O3-mini (Advanced Reasoning)</option>
                    </select>
                  </div>

                  {/* Model-specific parameters */}
                  {isO3Mini(aiSettings.model) ? (
                    // O3-mini specific settings
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reasoning Effort
                        </label>
                        <select
                          value={aiSettings.reasoning_effort}
                          onChange={(e) => handleAiSettingChange('reasoning_effort', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="low">Low (Faster, Less Reasoning)</option>
                          <option value="medium">Medium (Balanced)</option>
                          <option value="high">High (Slower, More Reasoning)</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          Controls how much reasoning the model performs before responding
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">O3-mini Reasoning Model</h3>
                            <p className="text-sm text-blue-700 mt-1">
                              O3-mini is optimized for STEM reasoning tasks. It does not support temperature, top_p, frequency_penalty, or presence_penalty parameters as it uses internal reasoning processes instead.
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    // GPT-4 specific settings
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Temperature: {aiSettings.temperature}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={aiSettings.temperature}
                        onChange={(e) => handleAiSettingChange('temperature', parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Focused</span>
                        <span>Balanced</span>
                        <span>Creative</span>
                      </div>
                    </div>
                  )}

                  {/* Max Completion Tokens (for O3-mini) or Max Tokens (for other models) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isO3Mini(aiSettings.model) ? 'Max Completion Tokens' : 'Max Tokens'}: {aiSettings.max_completion_tokens || aiSettings.max_tokens}
                    </label>
                    <input
                      type="range"
                      min="500"
                      max="4000"
                      step="100"
                      value={aiSettings.max_completion_tokens || aiSettings.max_tokens}
                      onChange={(e) => {
                        const paramName = isO3Mini(aiSettings.model) ? 'max_completion_tokens' : 'max_tokens';
                        handleAiSettingChange(paramName, parseInt(e.target.value));
                      }}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Short</span>
                      <span>Medium</span>
                      <span>Long</span>
                    </div>
                    {isO3Mini(aiSettings.model) && (
                      <p className="text-xs text-gray-500 mt-1">
                        Includes both visible output tokens and internal reasoning tokens
                      </p>
                    )}
                  </div>

                  {/* Additional AI Parameters for Non-O3 models */}
                  {!isO3Mini(aiSettings.model) && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Top P: {aiSettings.top_p}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={aiSettings.top_p}
                          onChange={(e) => handleAiSettingChange('top_p', parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Frequency Penalty: {aiSettings.frequency_penalty}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="2"
                          step="0.1"
                          value={aiSettings.frequency_penalty}
                          onChange={(e) => handleAiSettingChange('frequency_penalty', parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Presence Penalty: {aiSettings.presence_penalty}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="2"
                          step="0.1"
                          value={aiSettings.presence_penalty}
                          onChange={(e) => handleAiSettingChange('presence_penalty', parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Advanced Settings Toggle */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h2 className="text-xl font-semibold text-gray-900">Advanced Settings</h2>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showAdvanced && (
                  <div className="mt-4 space-y-4 border-t border-gray-200 pt-4">
                    {/* Purpose Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Conversation Purpose
                      </label>
                      <textarea
                        value={config.conversation_structure.purpose}
                        onChange={(e) => handleConfigChange('conversation_structure.purpose', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                        placeholder="Describe the educational purpose of this conversation..."
                      />
                    </div>

                    {/* Language Setting */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select
                        value={config.language || 'english'}
                        onChange={(e) => handleConfigChange('language', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                        <option value="german">German</option>
                        <option value="chinese">Chinese</option>
                        <option value="japanese">Japanese</option>
                      </select>
                    </div>

                    {/* Response Format */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Response Format</label>
                      <select
                        value={config.response_format || 'json'}
                        onChange={(e) => handleConfigChange('response_format', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="json">JSON</option>
                        <option value="text">Plain Text</option>
                        <option value="structured">Structured</option>
                      </select>
                    </div>

                    {/* Include Metadata */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="include_metadata"
                        checked={config.include_metadata !== false}
                        onChange={(e) => handleConfigChange('include_metadata', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="include_metadata" className="ml-2 block text-sm text-gray-700">
                        Include conversation metadata
                      </label>
                    </div>

                    {/* Vocabulary Complexity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vocabulary Complexity</label>
                      <select
                        value={config.vocabulary.complexity}
                        onChange={(e) => handleConfigChange('vocabulary.complexity', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    {/* Domain Specific Vocabulary */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="domain_specific"
                        checked={config.vocabulary.domain_specific}
                        onChange={(e) => handleConfigChange('vocabulary.domain_specific', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="domain_specific" className="ml-2 block text-sm text-gray-700">
                        Use domain-specific vocabulary
                      </label>
                    </div>

                    {/* Student Engagement */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Student Engagement</label>
                      <select
                        value={config.student_utterances.engagement}
                        onChange={(e) => handleConfigChange('student_utterances.engagement', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="low">Low</option>
                        <option value="moderate">Moderate</option>
                        <option value="high">High</option>
                        <option value="very_high">Very High</option>
                      </select>
                    </div>

                    {/* Question Frequency */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tutor Question Frequency</label>
                      <select
                        value={config.tutor_questions.frequency}
                        onChange={(e) => handleConfigChange('tutor_questions.frequency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="low">Low</option>
                        <option value="moderate">Moderate</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    {/* Question Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tutor Question Type</label>
                      <select
                        value={config.tutor_questions.type}
                        onChange={(e) => handleConfigChange('tutor_questions.type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="scaffolding">Scaffolding</option>
                        <option value="socratic">Socratic</option>
                        <option value="inquiry_based">Inquiry Based</option>
                        <option value="analytical">Analytical</option>
                        <option value="problem_solving">Problem Solving</option>
                        <option value="conversational">Conversational</option>
                        <option value="exploratory">Exploratory</option>
                      </select>
                    </div>

                    {/* Conversation Starter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Conversation Starter</label>
                      <select
                        value={config.conversation_structure.starter}
                        onChange={(e) => handleConfigChange('conversation_structure.starter', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="tutor">Tutor Starts</option>
                        <option value="student">Student Starts</option>
                      </select>
                    </div>

                    {/* Confusion Level */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Student Confusion Level</label>
                      <select
                        value={config.student_utterances.confusion_level}
                        onChange={(e) => handleConfigChange('student_utterances.confusion_level', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="low">Low</option>
                        <option value="moderate">Moderate</option>
                        <option value="realistic">Realistic</option>
                        <option value="challenging">Challenging</option>
                      </select>
                    </div>

                    {/* Confusion Score Mean */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confusion Score Mean: {config.student_utterances.confusion_scores.mean}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="0.5"
                        value={config.student_utterances.confusion_scores.mean}
                        onChange={(e) => handleConfigChange('student_utterances.confusion_scores.mean', parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    {/* Tutor Student Ratio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tutor-Student Ratio</label>
                      <select
                        value={config.conversation_structure.tutor_student_ratio}
                        onChange={(e) => handleConfigChange('conversation_structure.tutor_student_ratio', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="1:1">1:1 (Individual)</option>
                        <option value="1:2">1:2 (Small Group)</option>
                        <option value="1:3">1:3 (Small Group)</option>
                        <option value="1:5">1:5 (Group)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <button
                type="submit"
                disabled={isGenerating || !apiKey.trim()}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
                  isGenerating || !apiKey.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {!apiKey.trim() ? (
                  'Please provide API key first'
                ) : isGenerating ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating... {progress}%</span>
                  </div>
                ) : (
                  `Generate ${config.generationMode === 'dual_ai' ? config.conversation_count : 1} Conversation${config.conversation_count > 1 ? 's' : ''}`
                )}
              </button>
            </form>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Generated Conversations</h2>
                {getConversationsArray().length > 0 && (
                  <div className="flex space-x-2">
                    <button
                      onClick={onDownload}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => onCopy(JSON.stringify(getConversationsArray(), null, 2))}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Generation Error</h3>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              {isGenerating && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Generating conversation {currentConversation}...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Conversations Display */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {getConversationsArray().length === 0 && !isGenerating && (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p>No conversations generated yet.</p>
                    <p className="text-sm">Select a preset and click generate to start.</p>
                  </div>
                )}

                {getConversationsArray().map((conversationData, index) => {
                  const conversationContent = getConversationContent(conversationData);
                  
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">
                          Conversation {conversationData.id || index + 1}
                        </h3>
                        {conversationData.metadata && (
                          <span className="text-xs text-gray-500">
                            {conversationData.metadata.total_turns || conversationContent.length} turns
                          </span>
                        )}
                      </div>

                      {/* Metadata display */}
                      {conversationData.metadata && (
                        <div className="mb-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          <div className="grid grid-cols-2 gap-2">
                            <span>Subject: {conversationData.metadata.subject}</span>
                            <span>Mode: {conversationData.metadata.generation_mode}</span>
                            <span>Model: {conversationData.metadata.model}</span>
                            <span>Generated: {new Date(conversationData.metadata.generated_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {conversationContent.length > 0 ? (
                          conversationContent.map((turn, turnIndex) => (
                            <div
                              key={turnIndex}
                              className={`p-3 rounded-lg ${
                                turn.role === 'tutor'
                                  ? 'bg-blue-50 border-l-4 border-blue-400'
                                  : 'bg-green-50 border-l-4 border-green-400'
                              }`}
                            >
                              <div className="flex items-center mb-1">
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                  turn.role === 'tutor'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {turn.role === 'tutor' ? 'Tutor' : 'Student'}
                                </span>
                                {turn.purpose && (
                                  <span className="text-xs text-gray-500 ml-2">
                                    ({turn.purpose})
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-700">{turn.content}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-500 text-sm">
                            No conversation content available
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
