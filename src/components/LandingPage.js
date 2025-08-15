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
    }
  });

  const [aiSettings, setAiSettings] = useState({
    model: 'gpt-4o',
    temperature: 0.7,
    max_tokens: 2000
  });

  // Professional preset configurations with complete parameters
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
        }
      },
      aiSettings: {
        model: 'gpt-4o',
        temperature: 0.6,
        max_tokens: 1800
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
        }
      },
      aiSettings: {
        model: 'gpt-4o',
        temperature: 0.8,
        max_tokens: 2200
      }
    },
    {
      id: 'language_arts',
      title: 'Language Arts Discussion',
      description: 'Reading comprehension and literary analysis conversations',
      mode: 'Single AI',
      complexity: 'Intermediate',
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
        }
      },
      aiSettings: {
        model: 'gpt-4o',
        temperature: 0.7,
        max_tokens: 2000
      }
    },
    {
      id: 'history_analysis',
      title: 'Historical Analysis',
      description: 'Critical thinking about historical events and contexts',
      mode: 'Dual AI',
      complexity: 'Advanced',
      config: {
        generationMode: 'dual_ai',
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
        }
      },
      aiSettings: {
        model: 'gpt-4o',
        temperature: 0.7,
        max_tokens: 2400
      }
    },
    {
      id: 'custom_topic',
      title: 'Custom Topic Exploration',
      description: 'Flexible conversation generation for any educational topic',
      mode: 'Single AI',
      complexity: 'Beginner',
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
        }
      },
      aiSettings: {
        model: 'gpt-4o',
        temperature: 0.8,
        max_tokens: 2000
      }
    },
    {
      id: 'advanced_reasoning',
      title: 'Advanced Problem Solving',
      description: 'Complex reasoning tasks using O3-mini model',
      mode: 'Single AI',
      complexity: 'Advanced',
      config: {
        generationMode: 'single_ai',
        subject: 'problem solving',
        conversation_structure: {
          turns: 6,
          starter: 'tutor',
          purpose: 'Advanced problem solving with step-by-step reasoning and logical analysis',
          tutor_student_ratio: "1:1",
          conversation_starter: 'tutor'
        },
        vocabulary: {
          complexity: 'advanced',
          domain_specific: true,
          subject: 'problem solving'
        },
        tutor_questions: {
          frequency: 'high',
          type: 'reasoning',
          purpose_distribution: { assessment: 3, guidance: 2, clarification: 1 }
        },
        student_utterances: {
          engagement: 'high',
          confusion_level: 'high',
          confusion_scores: { mean: 4, std: 1, min: 2, max: 5 },
          correctness_distribution: { correct_independent: 0.1, correct_assisted: 0.6, incorrect: 0.3 }
        },
        student_purposes: {
          purpose_weights: { better_understanding: 0.4, clarification: 0.3, practice: 0.1, validation: 0.1, help_with_problem: 0.1 },
          custom_purposes: []
        },
        tutor_purposes: {
          purpose_weights: { scaffolding: 0.4, explanation: 0.3, assessment: 0.2, encouragement: 0.05, guided_discovery: 0.05 },
          custom_purposes: []
        }
      },
      aiSettings: {
        model: 'o3-mini',
        temperature: 0.5,
        max_tokens: 1500,
        reasoning_effort: 'medium'
      }
    }
  ];

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset);
    setConfig({ ...config, ...preset.config });
    setAiSettings({ ...aiSettings, ...preset.aiSettings });
  };

  const handleConfigChange = (section, key, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleNestedConfigChange = (section, subsection, key, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [key]: value
        }
      }
    }));
  };

  const handleAiSettingsChange = (key, value) => {
    setAiSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onGenerate) {
      onGenerate(config, aiSettings);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">ChatSynth</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Generate realistic educational conversations using advanced AI models. 
            Choose from preset configurations or customize your own tutoring scenarios.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Preset Cards - 2/3 width */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose a Preset Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {presets.map((preset) => (
              <div
                key={preset.id}
                className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedPreset?.id === preset.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => handlePresetSelect(preset)}
              >
                {preset.popular && (
                  <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    Popular
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{preset.title}</h3>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      preset.mode === 'Dual AI' 
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {preset.mode}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      preset.complexity === 'Beginner' ? 'bg-green-100 text-green-800' :
                      preset.complexity === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {preset.complexity}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{preset.description}</p>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <div>Model: {preset.aiSettings.model}</div>
                  <div>Turns: {preset.config.conversation_structure.turns}</div>
                  <div>Starter: {preset.config.conversation_structure.starter}</div>
                  <div>Type: {preset.config.tutor_questions.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration Panel - 1/3 width */}
        <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-6 h-fit max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuration</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Basic Settings */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Basic Settings</h3>
              
              {/* Generation Mode */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Generation Mode
                </label>
                <select
                  value={config.generationMode}
                  onChange={(e) => setConfig(prev => ({ ...prev, generationMode: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="single_ai">Single AI</option>
                  <option value="dual_ai">Dual AI</option>
                </select>
              </div>

              {/* Number of Conversations */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Conversations: {config.conversation_count}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={config.conversation_count}
                  onChange={(e) => setConfig(prev => ({ ...prev, conversation_count: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>

              {/* Subject */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={config.subject}
                  onChange={(e) => setConfig(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  placeholder="e.g., mathematics, science, history"
                />
              </div>
            </div>

            {/* Conversation Structure */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Conversation Structure</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Turns: {config.conversation_structure.turns}
                </label>
                <input
                  type="range"
                  min="4"
                  max="15"
                  value={config.conversation_structure.turns}
                  onChange={(e) => handleConfigChange('conversation_structure', 'turns', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Who Starts
                </label>
                <select
                  value={config.conversation_structure.starter}
                  onChange={(e) => handleConfigChange('conversation_structure', 'starter', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="tutor">Tutor</option>
                  <option value="student">Student</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conversation Purpose
                </label>
                <textarea
                  value={config.conversation_structure.purpose}
                  onChange={(e) => handleConfigChange('conversation_structure', 'purpose', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows="3"
                  placeholder="Describe the educational goal of this conversation..."
                />
              </div>
            </div>

            {/* AI Model Settings */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">AI Model Settings</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model
                </label>
                <select
                  value={aiSettings.model}
                  onChange={(e) => handleAiSettingsChange('model', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="o3-mini">O3-mini</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature: {aiSettings.temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={aiSettings.temperature}
                  onChange={(e) => handleAiSettingsChange('temperature', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Tokens: {aiSettings.max_tokens}
                </label>
                <input
                  type="range"
                  min="500"
                  max="4000"
                  step="100"
                  value={aiSettings.max_tokens}
                  onChange={(e) => handleAiSettingsChange('max_tokens', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {aiSettings.model === 'o3-mini' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reasoning Effort
                  </label>
                  <select
                    value={aiSettings.reasoning_effort || 'medium'}
                    onChange={(e) => handleAiSettingsChange('reasoning_effort', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              )}
            </div>

            {/* Advanced Settings Toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full text-left text-sm font-medium text-blue-600 hover:text-blue-800 mb-4"
              >
                {showAdvanced ? '▼ Hide Advanced Settings' : '▶ Show Advanced Settings'}
              </button>

              {showAdvanced && (
                <div className="space-y-4">
                  {/* Vocabulary Settings */}
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Vocabulary Settings</h3>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Complexity Level
                      </label>
                      <select
                        value={config.vocabulary.complexity}
                        onChange={(e) => handleConfigChange('vocabulary', 'complexity', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={config.vocabulary.domain_specific}
                          onChange={(e) => handleConfigChange('vocabulary', 'domain_specific', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Use domain-specific vocabulary</span>
                      </label>
                    </div>
                  </div>

                  {/* Tutor Questions */}
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Tutor Questions</h3>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question Frequency
                      </label>
                      <select
                        value={config.tutor_questions.frequency}
                        onChange={(e) => handleConfigChange('tutor_questions', 'frequency', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="low">Low</option>
                        <option value="moderate">Moderate</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question Type
                      </label>
                      <select
                        value={config.tutor_questions.type}
                        onChange={(e) => handleConfigChange('tutor_questions', 'type', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="scaffolding">Scaffolding</option>
                        <option value="socratic">Socratic</option>
                        <option value="analytical">Analytical</option>
                        <option value="reasoning">Reasoning</option>
                        <option value="exploratory">Exploratory</option>
                      </select>
                    </div>
                  </div>

                  {/* Student Characteristics */}
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Student Characteristics</h3>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Engagement Level
                      </label>
                      <select
                        value={config.student_utterances.engagement}
                        onChange={(e) => handleConfigChange('student_utterances', 'engagement', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="low">Low</option>
                        <option value="moderate">Moderate</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confusion Level
                      </label>
                      <select
                        value={config.student_utterances.confusion_level}
                        onChange={(e) => handleConfigChange('student_utterances', 'confusion_level', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="low">Low</option>
                        <option value="moderate">Moderate</option>
                        <option value="high">High</option>
                        <option value="realistic">Realistic</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? 'Generating...' : 'Generate Conversations'}
            </button>

            {/* Progress Display */}
            {isGenerating && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                {currentConversation > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    Generating conversation {currentConversation}...
                  </p>
                )}
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-red-800 font-semibold mb-2">Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Results Section */}
      {conversations.length > 0 && (
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Generated Conversations</h2>
              <button
                onClick={onDownload}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Download Results
              </button>
            </div>
            
            <div className="space-y-6">
              {conversations.map((conv, index) => (
                <div key={index} className="border rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Conversation {conv.id}</h3>
                    <div className="text-sm text-gray-600">
                      {conv.metadata.total_turns} turns • {conv.metadata.generation_mode} • {conv.metadata.model}
                    </div>
                  </div>
                  
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {conv.conversation.map((turn, turnIndex) => (
                      <div key={turnIndex} className={`p-3 rounded-lg ${
                        turn.role === 'tutor' ? 'bg-blue-50 border-l-4 border-blue-400' : 'bg-green-50 border-l-4 border-green-400'
                      }`}>
                        <div className="font-semibold text-sm capitalize mb-1">{turn.role}</div>
                        <div className="text-sm">{turn.content}</div>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => onCopy(JSON.stringify(conv.conversation, null, 2))}
                    className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Copy Conversation
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;

