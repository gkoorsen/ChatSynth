import React, { useState } from 'react';

const LandingPage = ({ onSubmit, loading, error, progress }) => {
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [config, setConfig] = useState({
    generationMode: 'single_ai',
    numberOfConversations: 3,
    conversation_structure: {
      turns: 8,
      starter: 'tutor',
      purpose: 'tutoring'
    },
    vocabulary: {
      complexity: 'intermediate',
      domain_specific: true
    },
    tutor_questions: {
      frequency: 'moderate',
      type: 'scaffolding'
    },
    student_utterances: {
      engagement: 'high',
      confusion_level: 'realistic'
    },
    ai_settings: {
      model: 'gpt-4o',
      temperature: 0.7,
      max_tokens: 2000
    }
  });

  // Professional preset configurations
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
        conversation_structure: {
          turns: 8,
          starter: 'tutor',
          purpose: 'mathematics tutoring focusing on algebra and problem-solving'
        },
        vocabulary: {
          complexity: 'intermediate',
          domain_specific: true,
          subject: 'mathematics'
        },
        tutor_questions: {
          frequency: 'high',
          type: 'scaffolding'
        },
        student_utterances: {
          engagement: 'high',
          confusion_level: 'moderate'
        },
        ai_settings: {
          model: 'gpt-4o',
          temperature: 0.6,
          max_tokens: 1800
        }
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
        conversation_structure: {
          turns: 10,
          starter: 'student',
          purpose: 'science discovery learning with inquiry-based approach'
        },
        vocabulary: {
          complexity: 'intermediate',
          domain_specific: true,
          subject: 'science'
        },
        tutor_questions: {
          frequency: 'moderate',
          type: 'socratic'
        },
        student_utterances: {
          engagement: 'high',
          confusion_level: 'realistic'
        },
        ai_settings: {
          model: 'gpt-4o',
          temperature: 0.8,
          max_tokens: 2200
        }
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
        conversation_structure: {
          turns: 12,
          starter: 'tutor',
          purpose: 'language arts discussion focusing on reading comprehension'
        },
        vocabulary: {
          complexity: 'advanced',
          domain_specific: true,
          subject: 'language arts'
        },
        tutor_questions: {
          frequency: 'moderate',
          type: 'analytical'
        },
        student_utterances: {
          engagement: 'high',
          confusion_level: 'low'
        },
        ai_settings: {
          model: 'gpt-4o',
          temperature: 0.7,
          max_tokens: 2000
        }
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
        conversation_structure: {
          turns: 10,
          starter: 'tutor',
          purpose: 'historical analysis with critical thinking emphasis'
        },
        vocabulary: {
          complexity: 'advanced',
          domain_specific: true,
          subject: 'history'
        },
        tutor_questions: {
          frequency: 'high',
          type: 'analytical'
        },
        student_utterances: {
          engagement: 'high',
          confusion_level: 'moderate'
        },
        ai_settings: {
          model: 'gpt-4o',
          temperature: 0.7,
          max_tokens: 2400
        }
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
        conversation_structure: {
          turns: 8,
          starter: 'tutor',
          purpose: 'custom topic exploration with adaptive approach'
        },
        vocabulary: {
          complexity: 'intermediate',
          domain_specific: false
        },
        tutor_questions: {
          frequency: 'moderate',
          type: 'exploratory'
        },
        student_utterances: {
          engagement: 'moderate',
          confusion_level: 'realistic'
        },
        ai_settings: {
          model: 'gpt-4o',
          temperature: 0.8,
          max_tokens: 2000
        }
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
        conversation_structure: {
          turns: 6,
          starter: 'tutor',
          purpose: 'advanced problem solving with step-by-step reasoning'
        },
        vocabulary: {
          complexity: 'advanced',
          domain_specific: true
        },
        tutor_questions: {
          frequency: 'high',
          type: 'reasoning'
        },
        student_utterances: {
          engagement: 'high',
          confusion_level: 'high'
        },
        ai_settings: {
          model: 'o3-mini',
          temperature: 0.5,
          max_tokens: 1500,
          reasoning_effort: 'medium'
        }
      }
    }
  ];

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset);
    setConfig({ ...config, ...preset.config });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(config);
  };

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getModeColor = (mode) => {
    return mode === 'Dual AI' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">ChatSynth</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Generate realistic educational conversations using advanced AI models. 
              Choose from preset configurations or customize your own tutoring scenarios.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Preset Cards - 2/3 width */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose a Preset Configuration</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {presets.map((preset) => (
                  <div
                    key={preset.id}
                    className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedPreset?.id === preset.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
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
                        <span className={`text-xs px-2 py-1 rounded-full ${getModeColor(preset.mode)}`}>
                          {preset.mode}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getComplexityColor(preset.complexity)}`}>
                          {preset.complexity}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">{preset.description}</p>
                    
                    <div className="text-xs text-gray-500">
                      <div>Model: {preset.config.ai_settings.model}</div>
                      <div>Turns: {preset.config.conversation_structure.turns}</div>
                      <div>Mode: {preset.config.generationMode.replace('_', ' ')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Configuration Panel - 1/3 width */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Configuration</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Generation Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Generation Mode
                  </label>
                  <select
                    value={config.generationMode}
                    onChange={(e) => setConfig(prev => ({ ...prev, generationMode: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="single_ai">Single AI (Faster)</option>
                    <option value="dual_ai">Dual AI (More Realistic)</option>
                  </select>
                </div>

                {/* Number of Conversations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Conversations: {config.numberOfConversations}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={config.numberOfConversations}
                    onChange={(e) => setConfig(prev => ({ ...prev, numberOfConversations: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1</span>
                    <span>5</span>
                  </div>
                </div>

                {/* Conversation Length */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conversation Length: {config.conversation_structure.turns} turns
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="15"
                    value={config.conversation_structure.turns}
                    onChange={(e) => handleConfigChange('conversation_structure', 'turns', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>4</span>
                    <span>15</span>
                  </div>
                </div>

                {/* AI Model Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI Model
                  </label>
                  <select
                    value={config.ai_settings.model}
                    onChange={(e) => handleConfigChange('ai_settings', 'model', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="gpt-4o">GPT-4o (Recommended)</option>
                    <option value="o3-mini">O3-mini (Advanced Reasoning)</option>
                  </select>
                </div>

                {/* Temperature */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Creativity Level: {config.ai_settings.temperature}
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={config.ai_settings.temperature}
                    onChange={(e) => handleConfigChange('ai_settings', 'temperature', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Focused</span>
                    <span>Creative</span>
                  </div>
                </div>

                {/* Max Tokens */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Response Length: {config.ai_settings.max_tokens} tokens
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="3000"
                    step="200"
                    value={config.ai_settings.max_tokens}
                    onChange={(e) => handleConfigChange('ai_settings', 'max_tokens', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Short</span>
                    <span>Long</span>
                  </div>
                </div>

                {/* O3-mini specific settings */}
                {config.ai_settings.model === 'o3-mini' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reasoning Effort
                    </label>
                    <select
                      value={config.ai_settings.reasoning_effort || 'medium'}
                      onChange={(e) => handleConfigChange('ai_settings', 'reasoning_effort', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                )}

                {/* Generate Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </div>
                  ) : (
                    'Generate Conversations'
                  )}
                </button>

                {/* Progress Display */}
                {loading && progress.total > 0 && (
                  <div className="mt-4">
                    <div className="text-sm text-gray-600 mb-2">
                      Progress: {progress.current}/{progress.total}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(progress.current / progress.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

              </form>

              {/* Mode Information */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Mode Information</h3>
                <div className="space-y-2 text-xs text-gray-600">
                  <div>
                    <strong>Single AI:</strong> Faster generation (10-30s), cost-effective, good for basic scenarios
                  </div>
                  <div>
                    <strong>Dual AI:</strong> More realistic interactions (30-120s), separate tutor/student personalities
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
