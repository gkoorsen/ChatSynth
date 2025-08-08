import React, { useState } from 'react';
import ConfigViewer from './ConfigViewer';

export default function LandingPage({ onSubmit, loading }) {
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'upload'
  const [config, setConfig] = useState(null);
  const [formData, setFormData] = useState({
    subject: 'mathematics',
    numberOfConversations: 3,
    difficulty: 'medium',
    studentLevel: 'high_school',
    conversationStyle: 'supportive',
    // Conversation structure
    avgTurns: 12,
    minTurns: 4,
    maxTurns: 30,
    tutorStudentRatio: 1.2,
    // Student characteristics
    avgConfusion: 3.0,
    confusionVariability: 1.0,
    correctIndependent: 70,
    correctAssisted: 20,
    incorrect: 10
  });

  const subjectOptions = [
    { value: 'mathematics', label: 'Mathematics', icon: '📊' },
    { value: 'science', label: 'Science', icon: '🔬' },
    { value: 'language', label: 'Language Arts', icon: '📚' },
    { value: 'history', label: 'History', icon: '🏛️' },
    { value: 'custom', label: 'Custom Subject', icon: '⚙️' }
  ];

  const difficultyOptions = [
    { value: 'easy', label: 'Easy', description: 'Simple concepts, more guidance' },
    { value: 'medium', label: 'Medium', description: 'Balanced challenge' },
    { value: 'hard', label: 'Hard', description: 'Complex problems, less guidance' }
  ];

  const studentLevelOptions = [
    { value: 'elementary', label: 'Elementary', description: 'Basic concepts' },
    { value: 'middle_school', label: 'Middle School', description: 'Intermediate level' },
    { value: 'high_school', label: 'High School', description: 'Standard curriculum' },
    { value: 'college', label: 'College', description: 'Advanced topics' }
  ];

  const conversationStyleOptions = [
    { value: 'supportive', label: 'Supportive', description: 'Encouraging, patient' },
    { value: 'challenging', label: 'Challenging', description: 'More assessment, rigorous' },
    { value: 'encouraging', label: 'Very Encouraging', description: 'Lots of praise' },
    { value: 'socratic', label: 'Socratic', description: 'Question-based learning' }
  ];

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateConfig = () => {
    const generatedConfig = {
      subject: formData.subject,
      numberOfConversations: formData.numberOfConversations,
      conversation_structure: {
        turns: {
          mean: formData.avgTurns,
          std: formData.avgTurns * 0.4, // 40% of mean as std dev
          min: formData.minTurns,
          max: formData.maxTurns
        },
        tutor_student_ratio: formData.tutorStudentRatio
      },
      vocabulary: {
        term_frequencies: getVocabularyForSubject(formData.subject)
      },
      tutor_questions: {
        purpose_distribution: getTutorQuestionsForStyle(formData.conversationStyle)
      },
      student_utterances: {
        confusion_scores: {
          mean: formData.avgConfusion,
          std: formData.confusionVariability,
          min: 1,
          max: 5
        },
        correctness_distribution: {
          correct_independent: Math.round((formData.correctIndependent / 100) * 2000),
          correct_assisted: Math.round((formData.correctAssisted / 100) * 2000),
          incorrect: Math.round((formData.incorrect / 100) * 2000)
        }
      }
    };
    
    setConfig(generatedConfig);
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

  const getTutorQuestionsForStyle = (style) => {
    const styles = {
      supportive: { "guidance": 0.4, "encouragement": 0.3, "assessment": 0.2, "clarification": 0.1 },
      challenging: { "assessment": 0.5, "guidance": 0.3, "clarification": 0.15, "encouragement": 0.05 },
      encouraging: { "encouragement": 0.4, "guidance": 0.4, "assessment": 0.15, "clarification": 0.05 },
      socratic: { "guidance": 0.5, "assessment": 0.3, "clarification": 0.15, "encouragement": 0.05 }
    };
    return styles[style] || styles.supportive;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const uploadedConfig = JSON.parse(e.target.result);
        // Preserve the numberOfConversations from form if not in uploaded config
        if (!uploadedConfig.numberOfConversations) {
          uploadedConfig.numberOfConversations = formData.numberOfConversations;
        }
        setConfig(uploadedConfig);
        setActiveTab('upload');
      } catch (error) {
        alert('Invalid JSON file. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = () => {
    if (config) {
      // Ensure the config has the current numberOfConversations value
      const finalConfig = { ...config, numberOfConversations: formData.numberOfConversations };
      onSubmit(finalConfig);
    } else if (activeTab === 'create') {
      generateConfig();
      // Auto-submit after generating
      setTimeout(() => {
        const generatedConfig = {
          subject: formData.subject,
          numberOfConversations: formData.numberOfConversations,
          conversation_structure: {
            turns: {
              mean: formData.avgTurns,
              std: formData.avgTurns * 0.4,
              min: formData.minTurns,
              max: formData.maxTurns
            },
            tutor_student_ratio: formData.tutorStudentRatio
          },
          vocabulary: {
            term_frequencies: getVocabularyForSubject(formData.subject)
          },
          tutor_questions: {
            purpose_distribution: getTutorQuestionsForStyle(formData.conversationStyle)
          },
          student_utterances: {
            confusion_scores: {
              mean: formData.avgConfusion,
              std: formData.confusionVariability,
              min: 1,
              max: 5
            },
            correctness_distribution: {
              correct_independent: Math.round((formData.correctIndependent / 100) * 2000),
              correct_assisted: Math.round((formData.correctAssisted / 100) * 2000),
              incorrect: Math.round((formData.incorrect / 100) * 2000)
            }
          }
        };
        onSubmit(generatedConfig);
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ChatSynth</h1>
              <p className="text-gray-600 mt-1">Synthetic Educational Conversation Generator</p>
            </div>
            <div className="text-sm text-gray-500">
              Powered by OpenAI GPT-3.5-turbo
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'create' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('create')}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xl">⚙️</span>
                <span>Create New Configuration</span>
              </div>
            </button>
            <button
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'upload' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('upload')}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xl">📁</span>
                <span>Upload Configuration</span>
              </div>
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'create' ? (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Configuration</h2>
                  <p className="text-gray-600">Fill out the form below to generate synthetic educational conversations</p>
                </div>

                {/* Basic Settings */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Settings</h3>
                    
                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Subject Area</label>
                      <div className="grid grid-cols-1 gap-2">
                        {subjectOptions.map(option => (
                          <label key={option.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name="subject"
                              value={option.value}
                              checked={formData.subject === option.value}
                              onChange={(e) => handleFormChange('subject', e.target.value)}
                              className="mr-3"
                            />
                            <span className="text-xl mr-3">{option.icon}</span>
                            <span className="font-medium">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Number of Conversations */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Number of Conversations</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={formData.numberOfConversations}
                        onChange={(e) => handleFormChange('numberOfConversations', parseInt(e.target.value) || 3)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Recommended: 1-5 conversations</p>
                    </div>

                    {/* Difficulty */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Difficulty Level</label>
                      <div className="space-y-2">
                        {difficultyOptions.map(option => (
                          <label key={option.value} className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name="difficulty"
                              value={option.value}
                              checked={formData.difficulty === option.value}
                              onChange={(e) => handleFormChange('difficulty', e.target.value)}
                              className="mt-1 mr-3"
                            />
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-sm text-gray-600">{option.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Advanced Settings</h3>
                    
                    {/* Student Level */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Student Level</label>
                      <div className="space-y-2">
                        {studentLevelOptions.map(option => (
                          <label key={option.value} className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name="studentLevel"
                              value={option.value}
                              checked={formData.studentLevel === option.value}
                              onChange={(e) => handleFormChange('studentLevel', e.target.value)}
                              className="mt-1 mr-3"
                            />
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-sm text-gray-600">{option.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Conversation Style */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Teaching Style</label>
                      <div className="space-y-2">
                        {conversationStyleOptions.map(option => (
                          <label key={option.value} className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name="conversationStyle"
                              value={option.value}
                              checked={formData.conversationStyle === option.value}
                              onChange={(e) => handleFormChange('conversationStyle', e.target.value)}
                              className="mt-1 mr-3"
                            />
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-sm text-gray-600">{option.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fine-tuning Settings */}
                <details className="border rounded-lg">
                  <summary className="p-4 cursor-pointer hover:bg-gray-50 font-medium">
                    🔧 Fine-tuning Parameters (Optional)
                  </summary>
                  <div className="p-4 border-t bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-700">Conversation Structure</h4>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Average Turns</label>
                        <input
                          type="number"
                          min="4"
                          max="50"
                          value={formData.avgTurns}
                          onChange={(e) => handleFormChange('avgTurns', parseInt(e.target.value) || 12)}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Min Turns</label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={formData.minTurns}
                            onChange={(e) => handleFormChange('minTurns', parseInt(e.target.value) || 4)}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Max Turns</label>
                          <input
                            type="number"
                            min="10"
                            max="100"
                            value={formData.maxTurns}
                            onChange={(e) => handleFormChange('maxTurns', parseInt(e.target.value) || 30)}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-700">Student Characteristics</h4>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Average Confusion (1-5)</label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          step="0.1"
                          value={formData.avgConfusion}
                          onChange={(e) => handleFormChange('avgConfusion', parseFloat(e.target.value) || 3.0)}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Correct (%)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={formData.correctIndependent}
                            onChange={(e) => handleFormChange('correctIndependent', parseInt(e.target.value) || 70)}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Assisted (%)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={formData.correctAssisted}
                            onChange={(e) => handleFormChange('correctAssisted', parseInt(e.target.value) || 20)}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Incorrect (%)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={formData.incorrect}
                            onChange={(e) => handleFormChange('incorrect', parseInt(e.target.value) || 10)}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </details>

                {/* Preview */}
                {config && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Configuration Preview</h3>
                    <ConfigViewer config={config} />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Configuration</h2>
                  <p className="text-gray-600">Upload an existing JSON configuration file</p>
                </div>

                {/* Number of Conversations for Upload */}
                <div className="mb-6">
                  <div className="max-w-md mx-auto">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Conversations to Generate</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.numberOfConversations}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 3;
                        handleFormChange('numberOfConversations', newValue);
                        // Update existing config if loaded
                        if (config) {
                          setConfig(prev => ({ ...prev, numberOfConversations: newValue }));
                        }
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">This will override any value in the uploaded configuration</p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="w-full max-w-md">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm text-gray-500">Click to upload JSON file</p>
                      </div>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleFileUpload}
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
                  </div>
                )}
              </div>
            )}

            {/* Action Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={loading || (!config && activeTab === 'upload')}
                className={`px-8 py-4 rounded-lg font-semibold text-white transition-all transform hover:scale-105 ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg'
                }`}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating Conversations...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">🚀</span>
                    <span>Generate Conversations</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}