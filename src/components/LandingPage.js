import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Settings, Zap, Brain, Users, Download, Upload, Play, Save, Loader } from 'lucide-react';

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('presets');
  const [selectedPreset, setSelectedPreset] = useState('');
  const [config, setConfig] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    models: true,
    conversation: false,
    intervention: false,
    educational: false,
    logging: false
  });

  // Preset configurations
  const presets = {
    basic_math_tutoring: {
      name: "Basic Math Tutoring",
      description: "Simple algebra tutoring with single AI",
      icon: "📚",
      config: {
        generationMode: "single_ai",
        models: {
          coordinator: { model: "gpt-4o", temperature: 0.3, max_tokens: 1500 },
          tutor: { model: "gpt-3.5-turbo", temperature: 0.8, max_tokens: 1000 },
          student: { model: "gpt-3.5-turbo", temperature: 0.9, max_tokens: 800 }
        },
        conversation_structure: {
          turns: { mean: 6, std: 2, min: 4, max: 10 },
          tutor_student_ratio: "1:1",
          conversation_starter: "tutor"
        },
        educational_objectives: {
          subject: "mathematics",
          topic: "basic algebra",
          target_concepts: ["variables", "coefficients", "solving equations"],
          vocabulary_targets: {
            "variable": { frequency: 5, context: "unknown quantity" },
            "equation": { frequency: 4, context: "mathematical equality" },
            "solve": { frequency: 3, context: "find the value" }
          }
        },
        student_profile: {
          level: "middle_school",
          confusion_scores: { mean: 3, std: 1, min: 1, max: 5 },
          learning_preferences: ["visual examples", "step-by-step"],
          correctness_distribution: { correct_independent: 0.3, correct_assisted: 0.5, incorrect: 0.2 }
        }
      }
    },
    
    advanced_coordinated: {
      name: "Advanced Coordinated Learning",
      description: "Three-AI system with intelligent coordination",
      icon: "🧠",
      config: {
        generationMode: "three_ai_coordinated",
        models: {
          coordinator: { model: "gpt-4o", temperature: 0.2, max_tokens: 2000, reasoning_effort: "high" },
          tutor: { model: "gpt-4", temperature: 0.7, max_tokens: 1200 },
          student: { model: "gpt-3.5-turbo", temperature: 0.9, max_tokens: 800 }
        },
        conversation_structure: {
          turns: { mean: 10, std: 3, min: 8, max: 15 },
          tutor_student_ratio: "1:1",
          conversation_starter: "student",
          natural_ending_enabled: true,
          force_educational_closure: true
        },
        intervention_system: {
          analysis_frequency: "concern_triggered",
          metrics_thresholds: {
            student_understanding: { concern_below: 0.3, excellent_above: 0.8 },
            engagement: { concern_below: 0.4, excellent_above: 0.7 },
            topic_relevance: { concern_below: 0.6, excellent_above: 0.9 },
            educational_progress: { concern_below: 0.4, target_minimum: 0.7 }
          },
          intervention_strategies: {
            student_confusion: {
              description: "Student understanding below threshold",
              tutor_guidance: "Provide simpler explanation with concrete examples",
              student_guidance: "Express specific confusion more clearly",
              context_injection: "Student is struggling, simplify approach naturally"
            },
            low_engagement: {
              description: "Student engagement below threshold",
              tutor_guidance: "Ask engaging questions or provide real-world connections",
              student_guidance: "Show more curiosity and ask questions",
              context_injection: "Student seems disengaged, make this more interesting"
            }
          }
        },
        educational_objectives: {
          subject: "mathematics",
          topic: "linear equations",
          target_concepts: [
            "variables represent unknown quantities",
            "coefficients are numbers multiplying variables", 
            "solving means isolating the variable",
            "balance must be maintained on both sides"
          ],
          vocabulary_targets: {
            "variable": { frequency: 6, context: "x represents the unknown number" },
            "coefficient": { frequency: 4, context: "number in front of variable" },
            "equation": { frequency: 5, context: "mathematical statement of equality" },
            "solve": { frequency: 4, context: "find value that makes equation true" }
          },
          success_criteria: [
            "student can identify variables in equations",
            "student understands role of coefficients",
            "student can solve basic linear equations"
          ]
        },
        logging: {
          coordinator_decisions: true,
          intervention_triggers: true,
          metrics_tracking: true,
          conversation_analysis: true
        }
      }
    },

    science_discovery: {
      name: "Science Discovery Learning",
      description: "Dual AI with focus on scientific method",
      icon: "🔬",
      config: {
        generationMode: "dual_ai",
        models: {
          coordinator: { model: "gpt-4o", temperature: 0.3, max_tokens: 1500 },
          tutor: { model: "gpt-4", temperature: 0.6, max_tokens: 1000 },
          student: { model: "gpt-3.5-turbo", temperature: 1.0, max_tokens: 600 }
        },
        conversation_structure: {
          turns: { mean: 8, std: 2, min: 6, max: 12 },
          tutor_student_ratio: "1:1.2",
          conversation_starter: "student"
        },
        educational_objectives: {
          subject: "science",
          topic: "scientific method",
          target_concepts: ["hypothesis", "experiment", "observation", "conclusion"],
          vocabulary_targets: {
            "hypothesis": { frequency: 5, context: "testable prediction" },
            "experiment": { frequency: 6, context: "controlled test" },
            "observation": { frequency: 4, context: "gathering data" },
            "variable": { frequency: 3, context: "factor that can change" }
          }
        },
        student_profile: {
          level: "high_school",
          confusion_scores: { mean: 2.5, std: 1, min: 1, max: 4 },
          learning_preferences: ["hands-on examples", "discovery learning"],
          correctness_distribution: { correct_independent: 0.4, correct_assisted: 0.4, incorrect: 0.2 }
        }
      }
    },

    language_arts_creative: {
      name: "Creative Writing Workshop",
      description: "Expressive writing with creative guidance",
      icon: "✍️",
      config: {
        generationMode: "dual_ai",
        models: {
          coordinator: { model: "gpt-4", temperature: 0.4, max_tokens: 1500 },
          tutor: { model: "gpt-4", temperature: 0.9, max_tokens: 1200 },
          student: { model: "gpt-3.5-turbo", temperature: 1.1, max_tokens: 800 }
        },
        conversation_structure: {
          turns: { mean: 12, std: 3, min: 8, max: 16 },
          tutor_student_ratio: "1:1.5",
          conversation_starter: "tutor"
        },
        educational_objectives: {
          subject: "language_arts",
          topic: "creative writing",
          target_concepts: ["character development", "plot structure", "dialogue", "setting"],
          vocabulary_targets: {
            "character": { frequency: 4, context: "person in the story" },
            "plot": { frequency: 3, context: "sequence of events" },
            "dialogue": { frequency: 3, context: "conversation between characters" },
            "setting": { frequency: 2, context: "time and place of story" }
          }
        },
        student_profile: {
          level: "middle_school",
          confusion_scores: { mean: 2, std: 0.5, min: 1, max: 3 },
          learning_preferences: ["creative expression", "peer feedback"],
          correctness_distribution: { correct_independent: 0.6, correct_assisted: 0.3, incorrect: 0.1 }
        }
      }
    }
  };

  const loadPreset = (presetKey) => {
    setSelectedPreset(presetKey);
    setConfig(presets[presetKey].config);
    setActiveTab('configure');
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateConfig = (path, value) => {
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

const generateConversation = async () => {
  setIsGenerating(true);
  try {
    // Validate required fields
    if (!config.generationMode) {
      alert('Please select a generation mode');
      return;
    }

    if (!config.educational_objectives?.subject) {
      alert('Please specify a subject');
      return;
    }

    // Prepare the config for the API
    const apiConfig = {
      ...config,
      // Ensure ai_settings is properly formatted
      ai_settings: {
        model: config.models?.coordinator?.model || config.models?.tutor?.model || 'gpt-4o',
        temperature: config.models?.coordinator?.temperature || config.models?.tutor?.temperature || 0.8,
        max_tokens: config.models?.coordinator?.max_tokens || config.models?.tutor?.max_tokens || 2000,
        reasoning_effort: config.models?.coordinator?.reasoning_effort || 'medium'
      }
    };

    console.log('Sending config:', apiConfig);

    // Your API Gateway endpoint
    const API_ENDPOINT = 'https://3py5676r52.execute-api.us-east-1.amazonaws.com/prod/generate';
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      mode: 'cors',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(apiConfig)
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Response data:', data);
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    setResults(data);
    setActiveTab('results');
  } catch (error) {
    console.error('Generation failed:', error);
    alert(`Failed to generate conversation: ${error.message}`);
  } finally {
    setIsGenerating(false);
  }
};

  const exportConfig = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'conversation-config.json';
    link.click();
  };

  const importConfig = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          setConfig(imported);
          setSelectedPreset('custom');
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ChatSynth</h1>
                <p className="text-sm text-gray-600">Conversation AI Studio</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={exportConfig}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <label className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Import</span>
                <input type="file" accept=".json" onChange={importConfig} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
          {[
            { id: 'presets', label: 'Presets', icon: Zap },
            { id: 'configure', label: 'Configure', icon: Settings },
            { id: 'results', label: 'Results', icon: Users }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Presets Tab */}
        {activeTab === 'presets' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Starting Point</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Select a preset configuration to get started quickly, or create your own custom setup.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(presets).map(([key, preset]) => (
                <div
                  key={key}
                  className={`bg-white rounded-xl shadow-sm border-2 transition-all cursor-pointer hover:shadow-md ${
                    selectedPreset === key ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => loadPreset(key)}
                >
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{preset.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{preset.name}</h3>
                        <p className="text-gray-600 mb-4">{preset.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Mode:</span>
                            <span className="font-medium text-gray-900">{preset.config.generationMode}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Subject:</span>
                            <span className="font-medium text-gray-900">{preset.config.educational_objectives?.subject}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Complexity:</span>
                            <span className="font-medium text-gray-900">
                              {preset.config.student_profile?.level?.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          loadPreset(key);
                        }}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Use This Preset
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Configure Tab */}
        {activeTab === 'configure' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Configuration Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuration</h2>

                {/* Models Section */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection('models')}
                    className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">AI Models</h3>
                    {expandedSections.models ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>
                  
                  {expandedSections.models && (
                    <div className="mt-4 space-y-4 p-4 border border-gray-200 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Generation Mode</label>
                        <select
                          value={config.generationMode || 'single_ai'}
                          onChange={(e) => updateConfig('generationMode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="single_ai">Single AI</option>
                          <option value="dual_ai">Dual AI</option>
                          <option value="three_ai_coordinated">Three AI Coordinated</option>
                        </select>
                      </div>

                      {['coordinator', 'tutor', 'student'].map(role => (
                        <div key={role} className="space-y-3">
                          <h4 className="font-medium text-gray-900 capitalize">{role} Model</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Model</label>
                              <select
                                value={config.models?.[role]?.model || 'gpt-3.5-turbo'}
                                onChange={(e) => updateConfig(`models.${role}.model`, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                                <option value="gpt-4">GPT-4</option>
                                <option value="gpt-4o">GPT-4o</option>
                                <option value="o1-mini">O1 Mini</option>
                                <option value="o1-preview">O1 Preview</option>
                                <option value="o3-mini">O3 Mini</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Temperature</label>
                              <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="2"
                                value={config.models?.[role]?.temperature || 0.8}
                                onChange={(e) => updateConfig(`models.${role}.temperature`, parseFloat(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Educational Objectives */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection('educational')}
                    className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">Educational Objectives</h3>
                    {expandedSections.educational ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>
                  
                  {expandedSections.educational && (
                    <div className="mt-4 space-y-4 p-4 border border-gray-200 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                          <select
                            value={config.educational_objectives?.subject || 'mathematics'}
                            onChange={(e) => updateConfig('educational_objectives.subject', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="mathematics">Mathematics</option>
                            <option value="science">Science</option>
                            <option value="language_arts">Language Arts</option>
                            <option value="history">History</option>
                            <option value="custom">Custom</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                          <input
                            type="text"
                            value={config.educational_objectives?.topic || ''}
                            onChange={(e) => updateConfig('educational_objectives.topic', e.target.value)}
                            placeholder="e.g., linear equations"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Target Concepts</label>
                        <textarea
                          value={config.educational_objectives?.target_concepts?.join('\n') || ''}
                          onChange={(e) => updateConfig('educational_objectives.target_concepts', e.target.value.split('\n').filter(Boolean))}
                          placeholder="Enter concepts, one per line"
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Intervention System */}
                {config.generationMode === 'three_ai_coordinated' && (
                  <div className="mb-6">
                    <button
                      onClick={() => toggleSection('intervention')}
                      className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">Intervention System</h3>
                      {expandedSections.intervention ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>
                    
                    {expandedSections.intervention && (
                      <div className="mt-4 space-y-4 p-4 border border-gray-200 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Analysis Frequency</label>
                          <select
                            value={config.intervention_system?.analysis_frequency || 'concern_triggered'}
                            onChange={(e) => updateConfig('intervention_system.analysis_frequency', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="concern_triggered">Only When Concerns Detected</option>
                            <option value="every_turn">Every Turn</option>
                            <option value="phase_transitions">At Phase Transitions</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Understanding Threshold</label>
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              max="1"
                              value={config.intervention_system?.metrics_thresholds?.student_understanding?.concern_below || 0.3}
                              onChange={(e) => updateConfig('intervention_system.metrics_thresholds.student_understanding.concern_below', parseFloat(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Engagement Threshold</label>
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              max="1"
                              value={config.intervention_system?.metrics_thresholds?.engagement?.concern_below || 0.4}
                              onChange={(e) => updateConfig('intervention_system.metrics_thresholds.engagement.concern_below', parseFloat(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Conversation Structure */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection('conversation')}
                    className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">Conversation Structure</h3>
                    {expandedSections.conversation ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>
                  
                  {expandedSections.conversation && (
                    <div className="mt-4 space-y-4 p-4 border border-gray-200 rounded-lg">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Average Turns</label>
                          <input
                            type="number"
                            value={config.conversation_structure?.turns?.mean || 8}
                            onChange={(e) => updateConfig('conversation_structure.turns.mean', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Min Turns</label>
                          <input
                            type="number"
                            value={config.conversation_structure?.turns?.min || 6}
                            onChange={(e) => updateConfig('conversation_structure.turns.min', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Max Turns</label>
                          <input
                            type="number"
                            value={config.conversation_structure?.turns?.max || 12}
                            onChange={(e) => updateConfig('conversation_structure.turns.max', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Conversation Starter</label>
                        <select
                          value={config.conversation_structure?.conversation_starter || 'tutor'}
                          onChange={(e) => updateConfig('conversation_structure.conversation_starter', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="tutor">Tutor Starts</option>
                          <option value="student">Student Starts</option>
                          <option value="random">Random</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Logging Options */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection('logging')}
                    className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">Logging & Debug</h3>
                    {expandedSections.logging ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>
                  
                  {expandedSections.logging && (
                    <div className="mt-4 space-y-3 p-4 border border-gray-200 rounded-lg">
                      {[
                        { key: 'coordinator_decisions', label: 'Coordinator Decisions' },
                        { key: 'intervention_triggers', label: 'Intervention Triggers' },
                        { key: 'metrics_tracking', label: 'Metrics Tracking' },
                        { key: 'conversation_analysis', label: 'Conversation Analysis' }
                      ].map(option => (
                        <label key={option.key} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={config.logging?.[option.key] || false}
                            onChange={(e) => updateConfig(`logging.${option.key}`, e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Generate Button */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <button
                  onClick={generateConversation}
                  disabled={isGenerating || !config.generationMode}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                >
                  {isGenerating ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Generating Conversation...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      <span>Generate Conversation</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Configuration Preview */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration Preview</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mode:</span>
                    <span className="font-medium">{config.generationMode || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subject:</span>
                    <span className="font-medium">{config.educational_objectives?.subject || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Turns:</span>
                    <span className="font-medium">{config.conversation_structure?.turns?.mean || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Starter:</span>
                    <span className="font-medium">{config.conversation_structure?.conversation_starter || 'Not set'}</span>
                  </div>
                  {config.generationMode === 'three_ai_coordinated' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Coordinator:</span>
                      <span className="font-medium">{config.models?.coordinator?.model || 'Not set'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={exportConfig}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Configuration</span>
                  </button>
                  
                  <label className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Load Configuration</span>
                    <input type="file" accept=".json" onChange={importConfig} className="hidden" />
                  </label>
                </div>
              </div>

              {selectedPreset && (
                <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Current Preset: {presets[selectedPreset]?.name}
                  </h3>
                  <p className="text-blue-700 text-sm">
                    {presets[selectedPreset]?.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            {results ? (
              <div className="space-y-6">
                {/* Results Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Generated Conversation</h2>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">
                        {results.metadata?.total_turns} turns
                      </span>
                      <span className="text-sm text-gray-600">
                        {results.metadata?.generation_mode}
                      </span>
                      <button
                        onClick={() => {
                          const dataStr = JSON.stringify(results, null, 2);
                          const dataBlob = new Blob([dataStr], { type: 'application/json' });
                          const url = URL.createObjectURL(dataBlob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = 'conversation-results.json';
                          link.click();
                        }}
                        className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export Results</span>
                      </button>
                    </div>
                  </div>

                  {results.metadata && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-gray-600">Subject</div>
                        <div className="font-semibold">{results.metadata.subject}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-gray-600">Model Used</div>
                        <div className="font-semibold">{results.metadata.model_used}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-gray-600">Generated</div>
                        <div className="font-semibold">
                          {new Date(results.metadata.generated_at).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-gray-600">Duration</div>
                        <div className="font-semibold">
                          {results.metadata.intervention_count ? `${results.metadata.intervention_count} interventions` : 'No interventions'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Conversation Display */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversation</h3>
                    <div className="space-y-4">
                      {results.conversations?.[0]?.map((turn, index) => (
                        <div
                          key={index}
                          className={`flex ${turn.role === 'tutor' ? 'justify-start' : 'justify-end'}`}
                        >
                          <div
                            className={`max-w-3xl px-4 py-3 rounded-lg ${
                              turn.role === 'tutor'
                                ? 'bg-blue-50 text-blue-900 border border-blue-200'
                                : 'bg-green-50 text-green-900 border border-green-200'
                            }`}
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-xs font-medium uppercase tracking-wide">
                                {turn.role}
                              </span>
                              <span className="text-xs text-gray-500">Turn {index + 1}</span>
                            </div>
                            <p className="text-sm leading-relaxed">{turn.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Coordinator Log */}
                {results.coordinator_log && results.coordinator_log.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Coordinator Decisions</h3>
                    <div className="space-y-4">
                      {results.coordinator_log.map((log, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">Turn {log.turn}</span>
                            <span className="text-xs text-gray-500">{log.timestamp}</span>
                          </div>
                          <div className="text-sm text-gray-700">
                            <strong>Strategy:</strong> {log.intervention_strategy}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {log.context_injected}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metrics Progression */}
                {results.metrics_progression && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Metrics Progression</h3>
                    <div className="text-sm text-gray-600">
                      Metrics tracking visualization would go here in a full implementation.
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Users className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Yet</h3>
                <p className="text-gray-600 mb-6">
                  Configure your settings and generate a conversation to see results here.
                </p>
                <button
                  onClick={() => setActiveTab('configure')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Configuration
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
