import React, { useState } from 'react';
import ConfigViewer from './ConfigViewer';

export default function LandingPage({ onSubmit, loading, error, progress }) {
  const [activeTab, setActiveTab] = useState('create');
  const [config, setConfig] = useState(null);
  const [showApiKey, setShowApiKey] = useState(false);
  
  const [formData, setFormData] = useState({
    // Basic Settings
    subject: 'mathematics',
    numberOfConversations: 3,
    generationMode: 'single_ai',
    
    // AI Model Controls
    aiModel: 'gpt-3.5-turbo',
    temperature: 0.8,
    maxTokens: 2000,
    reasoningEffort: 'medium',
    customInstructions: '',
    conversationStarter: 'tutor',
    
    // Conversation Structure
    avgTurns: 12,
    stdTurns: 4.8,
    minTurns: 4,
    maxTurns: 30,
    tutorStudentRatio: 1.2,
    
    // Vocabulary
    customVocabulary: {},
    usePresetVocabulary: true,
    
    // Tutor Questions
    tutorPurposes: {
      guidance: 0.4,
      assessment: 0.3,
      encouragement: 0.2,
      clarification: 0.1
    },
    
    // Student Utterances
    confusionMean: 3.0,
    confusionStd: 1.0,
    confusionMin: 1,
    confusionMax: 5,
    correctIndependent: 1400,
    correctAssisted: 400,
    incorrect: 200
  });

  const aiModelOptions = [
    { 
      value: 'gpt-3.5-turbo', 
      label: 'GPT-3.5 Turbo',
      description: 'Fast, cost-effective, good for most conversations',
      cost: '$',
      speed: 'Fast'
    },
    { 
      value: 'gpt-4o', 
      label: 'GPT-4o',
      description: 'High quality, better reasoning, more expensive',
      cost: '$$$',
      speed: 'Medium'
    },
    { 
      value: 'o3-mini', 
      label: 'o3-mini',
      description: 'Latest reasoning model, excellent for STEM subjects',
      cost: '$$',
      speed: 'Slow',
      reasoning: true
    }
  ];

  const subjectOptions = [
    { value: 'mathematics', label: 'Mathematics', icon: '📊', color: 'blue' },
    { value: 'science', label: 'Science', icon: '🔬', color: 'green' },
    { value: 'language', label: 'Language Arts', icon: '📚', color: 'purple' },
    { value: 'history', label: 'History', icon: '🏛️', color: 'yellow' },
    { value: 'custom', label: 'Custom Subject', icon: '⚙️', color: 'gray' }
  ];

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateVocabularyTerm = (term, frequency) => {
    setFormData(prev => ({
      ...prev,
      customVocabulary: {
        ...prev.customVocabulary,
        [term]: frequency
      }
    }));
  };

  const removeVocabularyTerm = (term) => {
    setFormData(prev => {
      const newVocab = { ...prev.customVocabulary };
      delete newVocab[term];
      return {
        ...prev,
        customVocabulary: newVocab
      };
    });
  };

  const updateTutorPurpose = (purpose, weight) => {
    setFormData(prev => ({
      ...prev,
      tutorPurposes: {
        ...prev.tutorPurposes,
        [purpose]: weight
      }
    }));
  };

  const removeTutorPurpose = (purpose) => {
    setFormData(prev => {
      const newPurposes = { ...prev.tutorPurposes };
      delete newPurposes[purpose];
      return {
        ...prev,
        tutorPurposes: newPurposes
      };
    });
  };

  const normalizeTutorWeights = () => {
    const purposes = formData.tutorPurposes;
    const total = Object.values(purposes).reduce((sum, weight) => sum + weight, 0);
    
    if (total > 0) {
      const normalizedPurposes = {};
      Object.keys(purposes).forEach(purpose => {
        normalizedPurposes[purpose] = purposes[purpose] / total;
      });
      
      setFormData(prev => ({
        ...prev,
        tutorPurposes: normalizedPurposes
      }));
    }
  };

  const generateConfig = () => {
    const purposes = formData.tutorPurposes;
    const total = Object.values(purposes).reduce((sum, weight) => sum + weight, 0);
    
    const normalizedWeights = total > 0 ? 
      Object.keys(purposes).reduce((acc, purpose) => {
        acc[purpose] = purposes[purpose] / total;
        return acc;
      }, {}) : 
      { guidance: 0.4, assessment: 0.3, encouragement: 0.2, clarification: 0.1 };

    const vocabulary = formData.usePresetVocabulary 
      ? getVocabularyForSubject(formData.subject)
      : Object.keys(formData.customVocabulary).length > 0
        ? formData.customVocabulary
        : getVocabularyForSubject(formData.subject);

    const generatedConfig = {
      subject: formData.subject,
      numberOfConversations: formData.numberOfConversations,
      generationMode: formData.generationMode,
      
      ai_settings: {
        model: formData.aiModel,
        temperature: formData.temperature,
        max_tokens: formData.maxTokens,
        ...(formData.aiModel === 'o3-mini' && { reasoning_effort: formData.reasoningEffort }),
        custom_instructions: formData.customInstructions.trim() || null
      },
      
      conversation_structure: {
        turns: {
          mean: formData.avgTurns,
          std: formData.stdTurns,
          min: formData.minTurns,
          max: formData.maxTurns
        },
        tutor_student_ratio: formData.tutorStudentRatio,
        conversation_starter: formData.conversationStarter
      },
      
      vocabulary: {
        term_frequencies: vocabulary
      },
      
      tutor_questions: {
        purpose_distribution: normalizedWeights
      },
      
      student_utterances: {
        confusion_scores: {
          mean: formData.confusionMean,
          std: formData.confusionStd,
          min: formData.confusionMin,
          max: formData.confusionMax
        },
        correctness_distribution: {
          correct_independent: formData.correctIndependent,
          correct_assisted: formData.correctAssisted,
          incorrect: formData.incorrect
        }
      }
    };
    
    setConfig(generatedConfig);
    return generatedConfig;
  };

  const getVocabularyForSubject = (subject) => {
    const vocabularies = {
      mathematics: {
        "equation": 0.15, "variable": 0.14, "solve": 0.12, "function": 0.10,
        "graph": 0.08, "coefficient": 0.08, "polynomial": 0.07, "linear": 0.06,
        "quadratic": 0.05, "derivative": 0.05, "integral": 0.04, "limit": 0.04
      },
      science: {
        "experiment": 0.15, "hypothesis": 0.12, "theory": 0.10, "observation": 0.10,
        "data": 0.08, "analysis": 0.08, "method": 0.07, "result": 0.06,
        "conclusion": 0.06, "variable": 0.05, "control": 0.05, "evidence": 0.04
      },
      language: {
        "sentence": 0.15, "paragraph": 0.12, "grammar": 0.10, "vocabulary": 0.10,
        "writing": 0.08, "reading": 0.08, "comprehension": 0.07, "analysis": 0.06,
        "essay": 0.06, "thesis": 0.05, "argument": 0.05, "evidence": 0.04
      },
      history: {
        "event": 0.15, "period": 0.12, "civilization": 0.10, "culture": 0.10,
        "society": 0.08, "government": 0.08, "war": 0.07, "revolution": 0.06,
        "empire": 0.06, "timeline": 0.05, "cause": 0.05, "effect": 0.04
      },
      custom: {
        "concept": 0.20, "example": 0.15, "principle": 0.12, "theory": 0.10,
        "practice": 0.08, "method": 0.07, "process": 0.06, "application": 0.05,
        "understanding": 0.05, "analysis": 0.04, "evaluation": 0.04, "synthesis": 0.04
      }
    };
    return vocabularies[subject] || vocabularies.custom;
  };

  const handleSubmit = () => {
    const finalConfig = config || generateConfig();
    onSubmit(finalConfig);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">CS</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ChatSynth</h1>
                <p className="text-xs text-gray-500">AI Conversation Generator</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Lambda Ready</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 lg:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Generate Realistic
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                Educational Conversations
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Create synthetic tutoring conversations with advanced AI. Perfect for training language models, 
              educational research, and conversation analysis.
            </p>
          </div>

          {/* Generation Mode Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            {/* Single AI Mode */}
            <div className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
              formData.generationMode === 'single_ai' 
                ? 'border-green-300 bg-green-50/50 shadow-lg scale-105' 
                : 'border-gray-200 bg-white/70 hover:border-green-200 hover:shadow-md'
            }`}
            onClick={() => handleFormChange('generationMode', 'single_ai')}>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Single AI Mode</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">Fast & Controlled</span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">
                One AI generates entire conversations in a single request. Perfect for controlled vocabulary and structured content.
              </p>
              
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded">Lower cost</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Faster</span>
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">Predictable</span>
              </div>
            </div>

            {/* Interactive AI Mode */}
            <div className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
              formData.generationMode === 'dual_ai' 
                ? 'border-blue-300 bg-blue-50/50 shadow-lg scale-105' 
                : 'border-gray-200 bg-white/70 hover:border-blue-200 hover:shadow-md'
            }`}
            onClick={() => handleFormChange('generationMode', 'dual_ai')}>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Interactive AI Mode</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">Realistic & Dynamic</span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">
                Two separate AIs engage in real conversations. Creates natural interactions with emergent behavior.
              </p>
              
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Realistic</span>
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">Natural flow</span>
                <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded">Slower</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Animation Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-10 w-16 h-16 bg-purple-200/30 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-200/30 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
      </section>

      {/* Configuration Interface */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
            
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200/50">
              <button
                className={`flex-1 px-8 py-6 text-center font-semibold transition-all duration-300 ${
                  activeTab === 'create' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                    : 'bg-gray-50/50 text-gray-700 hover:bg-gray-100/50'
                }`}
                onClick={() => setActiveTab('create')}
              >
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-2xl">⚙️</span>
                  <span>Create Configuration</span>
                </div>
              </button>
              <button
                className={`flex-1 px-8 py-6 text-center font-semibold transition-all duration-300 ${
                  activeTab === 'upload' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                    : 'bg-gray-50/50 text-gray-700 hover:bg-gray-100/50'
                }`}
                onClick={() => setActiveTab('upload')}
              >
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-2xl">📁</span>
                  <span>Upload Configuration</span>
                </div>
              </button>
            </div>

            <div className="p-8">
              {activeTab === 'create' ? (
                <div className="space-y-8">
                  {/* Subject Selection */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900">Subject & Basic Settings</h3>
                    
                    {/* Subject Cards */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">Choose Subject Area</label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {subjectOptions.map(option => (
                          <div
                            key={option.value}
                            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                              formData.subject === option.value
                                ? `border-${option.color}-300 bg-${option.color}-50 shadow-lg transform scale-105`
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                            }`}
                            onClick={() => handleFormChange('subject', option.value)}
                          >
                            <div className="text-center">
                              <div className="text-3xl mb-2">{option.icon}</div>
                              <div className="font-medium text-sm">{option.label}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Number of Conversations & AI Model */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Number of Conversations</label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={formData.numberOfConversations}
                          onChange={(e) => handleFormChange('numberOfConversations', parseInt(e.target.value) || 3)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {formData.generationMode === 'dual_ai' ? 'Interactive mode takes longer' : 'Fast generation mode'}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">AI Model</label>
                        <select
                          value={formData.aiModel}
                          onChange={(e) => handleFormChange('aiModel', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          {aiModelOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label} - {option.cost}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Configuration Sections */}
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* AI Parameters */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
                      <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                        <span className="mr-2">🤖</span>
                        AI Parameters
                      </h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Temperature: {formData.temperature}
                          </label>
                          <input
                            type="range"
                            min="0.1"
                            max="1.0"
                            step="0.1"
                            value={formData.temperature}
                            onChange={(e) => handleFormChange('temperature', parseFloat(e.target.value))}
                            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Focused</span>
                            <span>Balanced</span>
                            <span>Creative</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Max Tokens</label>
                          <input
                            type="number"
                            min="500"
                            max="4000"
                            step="100"
                            value={formData.maxTokens}
                            onChange={(e) => handleFormChange('maxTokens', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        {formData.aiModel === 'o3-mini' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Reasoning Effort</label>
                            <select
                              value={formData.reasoningEffort}
                              onChange={(e) => handleFormChange('reasoningEffort', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Conversation Flow */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50">
                      <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                        <span className="mr-2">💬</span>
                        Conversation Flow
                      </h4>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Avg Turns</label>
                            <input
                              type="number"
                              min="4"
                              max="50"
                              value={formData.avgTurns}
                              onChange={(e) => handleFormChange('avgTurns', parseFloat(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Ratio</label>
                            <input
                              type="number"
                              min="0.1"
                              max="5.0"
                              step="0.1"
                              value={formData.tutorStudentRatio}
                              onChange={(e) => handleFormChange('tutorStudentRatio', parseFloat(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Who Starts?</label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { value: 'tutor', label: '👨‍🏫 Tutor', desc: 'Traditional' },
                              { value: 'student', label: '👨‍🎓 Student', desc: 'Student-led' },
                              { value: 'random', label: '🎲 Random', desc: 'Mixed' }
                            ].map(option => (
                              <label
                                key={option.value}
                                className={`flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                  formData.conversationStarter === option.value
                                    ? 'border-green-300 bg-green-50'
                                    : 'border-gray-200 hover:border-green-200'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="conversationStarter"
                                  value={option.value}
                                  checked={formData.conversationStarter === option.value}
                                  onChange={(e) => handleFormChange('conversationStarter', e.target.value)}
                                  className="sr-only"
                                />
                                <div className="text-lg mb-1">{option.label.split(' ')[0]}</div>
                                <div className="text-xs font-medium">{option.label.split(' ')[1]}</div>
                                <div className="text-xs text-gray-500">{option.desc}</div>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t border-gray-200">
                    <button
                      onClick={() => generateConfig()}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center"
                    >
                      🔧 Generate Configuration
                    </button>
                    
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center ${
                        loading
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <span className="text-xl mr-2">🚀</span>
                          Generate {formData.numberOfConversations} Conversations
                        </>
                      )}
                    </button>
                  </div>

                  {/* Progress Display */}
                  {loading && progress.total > 0 && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-blue-900">
                          Generating conversation {progress.current} of {progress.total}
                        </span>
                        <span className="text-sm font-bold text-blue-700">
                          {Math.round((progress.current / progress.total) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${(progress.current / progress.total) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-blue-600 mt-2 flex items-center">
                        <span className="animate-pulse mr-2">⚡</span>
                        Using {formData.aiModel} in {formData.generationMode.replace('_', ' ')} mode
                      </p>
                    </div>
                  )}

                  {/* Error Display */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                      <div className="flex items-center">
                        <span className="text-red-500 mr-2">⚠️</span>
                        <div className="text-red-800 font-medium">Generation Failed</div>
                      </div>
                      <div className="text-red-700 text-sm mt-2">{error}</div>
                    </div>
                  )}
                </div>
              ) : (
                /* Upload Tab */
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload Configuration</h2>
                    <p className="text-gray-600">Upload an existing JSON configuration file</p>
                  </div>

                  <div className="flex justify-center">
                    <div className="w-full max-w-md">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-sm text-gray-500">Click to upload JSON file</p>
                        </div>
                        <input
                          type="file"
                          accept=".json"
                          className="hidden"
                          disabled={loading}
                        />
                      </label>
                    </div>
                  </div>

                  {config && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Uploaded Configuration</h3>
                      <ConfigViewer config={config} />
                      
                      <div className="mt-6 flex justify-center">
                        <button
                          onClick={handleSubmit}
                          disabled={loading}
                          className={`px-8 py-3 rounded-xl font-semibold text-white transition-all ${
                            loading
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg'
                          }`}
                        >
                          {loading ? 'Generating...' : `🚀 Generate ${formData.numberOfConversations} Conversations`}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
