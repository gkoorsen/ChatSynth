import React, { useState } from 'react';
import ConfigViewer from './ConfigViewer';

/*
 * LandingPage
 *
 * This component defines the user interface for constructing and
 * uploading conversation generation configurations.  The UI has been
 * redesigned to follow established UX guidelines: related fields are
 * grouped into clearly delineated sections, labels sit above their
 * corresponding inputs, and the form flows in a predominantly
 * single‑column layout.  Neutral colours and consistent input
 * styling help create a more cohesive and professional look.  The
 * design choices reference best practices such as grouping fields
 * logically and visually【36261110837497†L323-L340】, using a one‑column
 * layout to reduce cognitive load and errors【36261110837497†L356-L362】,
 * and ensuring consistent padding and focus states across inputs【88235514889555†L110-L115】.
 */

export default function LandingPage({ onSubmit, loading, error, progress }) {
  /*--------------------------------------------------------------------------
   *  Utility definitions
   *--------------------------------------------------------------------------*/
  // Shared input classes for consistent styling across the form.  All
  // text, number, select, and textarea elements reuse these classes.
  const inputBaseClasses =
    'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

  // SectionCard: wraps each major section with a neutral background,
  // border and padding.  Titles and optional descriptions are
  // provided.  This promotes visual grouping of related fields【36261110837497†L323-L340】.
  const SectionCard = ({ title, description, children }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      )}
      {description && (
        <p className="text-sm text-gray-600 mb-4">{description}</p>
      )}
      {children}
    </div>
  );

  /*--------------------------------------------------------------------------
   *  State management
   *--------------------------------------------------------------------------*/
  const [activeTab, setActiveTab] = useState('create');
  const [config, setConfig] = useState(null);
  const [formData, setFormData] = useState({
    // Basic Settings
    subject: 'mathematics',
    numberOfConversations: 3,
    generationMode: 'single_ai',
    // AI Settings (metadata only)
    aiModel: 'gpt-3.5-turbo',
    temperature: 0.8,
    maxTokens: 2000,
    reasoningEffort: 'medium',
    customInstructions: '',
    conversationStarter: 'tutor',
    // Conversation structure
    avgTurns: 12,
    stdTurns: 4.8,
    minTurns: 4,
    maxTurns: 30,
    tutorStudentRatio: 1.2,
    // Vocabulary
    customVocabulary: {},
    usePresetVocabulary: true,
    // Tutor question weights
    tutorPurposes: {
      guidance: 0.4,
      assessment: 0.3,
      encouragement: 0.2,
      clarification: 0.1,
    },
    // Student utterances
    confusionMean: 3.0,
    confusionStd: 1.0,
    confusionMin: 1,
    confusionMax: 5,
    correctIndependent: 1400,
    correctAssisted: 400,
    incorrect: 200,
  });

  /*--------------------------------------------------------------------------
   *  Options definitions
   *--------------------------------------------------------------------------*/
  const aiModelOptions = [
    {
      value: 'gpt-3.5-turbo',
      label: 'GPT-3.5 Turbo',
      description: 'Fast, cost‑effective, good for most conversations',
    },
    {
      value: 'gpt-4o',
      label: 'GPT-4o',
      description: 'High quality, better reasoning, more expensive',
    },
    {
      value: 'o3-mini',
      label: 'o3-mini',
      description: 'Latest reasoning model, excellent for STEM subjects',
    },
  ];

  const subjectOptions = [
    { value: 'mathematics', label: 'Mathematics', icon: '📊' },
    { value: 'science', label: 'Science', icon: '🔬' },
    { value: 'language', label: 'Language Arts', icon: '📚' },
    { value: 'history', label: 'History', icon: '🏛️' },
    { value: 'custom', label: 'Custom Subject', icon: '⚙️' },
  ];

  /*--------------------------------------------------------------------------
   *  Handler functions
   *--------------------------------------------------------------------------*/
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateVocabularyTerm = (term, frequency) => {
    setFormData((prev) => ({
      ...prev,
      customVocabulary: {
        ...prev.customVocabulary,
        [term]: frequency,
      },
    }));
  };

  const removeVocabularyTerm = (term) => {
    setFormData((prev) => {
      const newVocab = { ...prev.customVocabulary };
      delete newVocab[term];
      return {
        ...prev,
        customVocabulary: newVocab,
      };
    });
  };

  const updateTutorPurpose = (purpose, weight) => {
    setFormData((prev) => ({
      ...prev,
      tutorPurposes: {
        ...prev.tutorPurposes,
        [purpose]: weight,
      },
    }));
  };

  const removeTutorPurpose = (purpose) => {
    setFormData((prev) => {
      const newPurposes = { ...prev.tutorPurposes };
      delete newPurposes[purpose];
      return { ...prev, tutorPurposes: newPurposes };
    });
  };

  const normalizeTutorWeights = () => {
    const purposes = formData.tutorPurposes;
    const total = Object.values(purposes).reduce((sum, w) => sum + w, 0);
    if (total > 0) {
      const normalized = {};
      Object.keys(purposes).forEach((key) => {
        normalized[key] = purposes[key] / total;
      });
      setFormData((prev) => ({ ...prev, tutorPurposes: normalized }));
    }
  };

  /*--------------------------------------------------------------------------
   *  Vocabulary retrieval
   *--------------------------------------------------------------------------*/
  const getVocabularyForSubject = (subject) => {
    const vocabularies = {
      mathematics: {
        equation: 0.15,
        variable: 0.14,
        solve: 0.12,
        function: 0.1,
        graph: 0.08,
        coefficient: 0.08,
        polynomial: 0.07,
        linear: 0.06,
        quadratic: 0.05,
        derivative: 0.05,
        integral: 0.04,
        limit: 0.04,
      },
      science: {
        experiment: 0.15,
        hypothesis: 0.12,
        theory: 0.1,
        observation: 0.1,
        data: 0.08,
        analysis: 0.08,
        method: 0.07,
        result: 0.06,
        conclusion: 0.06,
        variable: 0.05,
        control: 0.05,
        evidence: 0.04,
      },
      language: {
        sentence: 0.15,
        paragraph: 0.12,
        grammar: 0.1,
        vocabulary: 0.1,
        writing: 0.08,
        reading: 0.08,
        comprehension: 0.07,
        analysis: 0.06,
        essay: 0.06,
        thesis: 0.05,
        argument: 0.05,
        evidence: 0.04,
      },
      history: {
        event: 0.15,
        period: 0.12,
        civilization: 0.1,
        culture: 0.1,
        society: 0.08,
        government: 0.08,
        war: 0.07,
        revolution: 0.06,
        empire: 0.06,
        timeline: 0.05,
        cause: 0.05,
        effect: 0.04,
      },
      custom: {
        concept: 0.2,
        example: 0.15,
        principle: 0.12,
        theory: 0.1,
        practice: 0.08,
        method: 0.07,
        process: 0.06,
        application: 0.05,
        understanding: 0.05,
        analysis: 0.04,
        evaluation: 0.04,
        synthesis: 0.04,
      },
    };
    return vocabularies[subject] || vocabularies.custom;
  };

  /*--------------------------------------------------------------------------
   *  Configuration generator
   *--------------------------------------------------------------------------*/
  const generateConfig = () => {
    const purposes = formData.tutorPurposes;
    const total = Object.values(purposes).reduce((sum, w) => sum + w, 0);
    const normalized = total
      ? Object.keys(purposes).reduce((acc, key) => {
          acc[key] = purposes[key] / total;
          return acc;
        }, {})
      : { guidance: 0.4, assessment: 0.3, encouragement: 0.2, clarification: 0.1 };
    const vocabulary = formData.usePresetVocabulary
      ? getVocabularyForSubject(formData.subject)
      : Object.keys(formData.customVocabulary).length > 0
        ? formData.customVocabulary
        : getVocabularyForSubject(formData.subject);
    const generated = {
      subject: formData.subject,
      numberOfConversations: formData.numberOfConversations,
      generationMode: formData.generationMode,
      ai_settings: {
        model: formData.aiModel,
        temperature: formData.temperature,
        max_tokens: formData.maxTokens,
        ...(formData.aiModel === 'o3-mini' && {
          reasoning_effort: formData.reasoningEffort,
        }),
        custom_instructions: formData.customInstructions.trim() || null,
      },
      conversation_structure: {
        turns: {
          mean: formData.avgTurns,
          std: formData.stdTurns,
          min: formData.minTurns,
          max: formData.maxTurns,
        },
        tutor_student_ratio: formData.tutorStudentRatio,
        conversation_starter: formData.conversationStarter,
      },
      vocabulary: {
        term_frequencies: vocabulary,
      },
      tutor_questions: {
        purpose_distribution: normalized,
      },
      student_utterances: {
        confusion_scores: {
          mean: formData.confusionMean,
          std: formData.confusionStd,
          min: formData.confusionMin,
          max: formData.confusionMax,
        },
        correctness_distribution: {
          correct_independent: formData.correctIndependent,
          correct_assisted: formData.correctAssisted,
          incorrect: formData.incorrect,
        },
      },
    };
    setConfig(generated);
    return generated;
  };

  /*--------------------------------------------------------------------------
   *  Preset loader
   *--------------------------------------------------------------------------*/
  const loadPresetConfig = (preset) => {
    const presets = {
      basic_math: {
        subject: 'mathematics',
        generationMode: 'single_ai',
        avgTurns: 8,
        stdTurns: 3,
        minTurns: 4,
        maxTurns: 15,
        tutorStudentRatio: 1.5,
        conversationStarter: 'tutor',
        tutorPurposes: { guidance: 0.5, assessment: 0.2, encouragement: 0.2, clarification: 0.1 },
        confusionMean: 2.5,
        confusionStd: 1.0,
        correctIndependent: 1500,
        correctAssisted: 400,
        incorrect: 100,
      },
      advanced_science: {
        subject: 'science',
        generationMode: 'dual_ai',
        avgTurns: 15,
        stdTurns: 6,
        minTurns: 8,
        maxTurns: 30,
        tutorStudentRatio: 1.0,
        conversationStarter: 'tutor',
        tutorPurposes: { guidance: 0.3, assessment: 0.4, encouragement: 0.1, clarification: 0.2 },
        confusionMean: 4.0,
        confusionStd: 1.2,
        correctIndependent: 800,
        correctAssisted: 600,
        incorrect: 600,
      },
      writing_practice: {
        subject: 'language',
        generationMode: 'single_ai',
        avgTurns: 12,
        stdTurns: 4,
        minTurns: 6,
        maxTurns: 25,
        tutorStudentRatio: 1.3,
        conversationStarter: 'tutor',
        tutorPurposes: { guidance: 0.45, assessment: 0.25, encouragement: 0.2, clarification: 0.1 },
        confusionMean: 3.2,
        confusionStd: 1.1,
        correctIndependent: 1200,
        correctAssisted: 500,
        incorrect: 300,
      },
    };
    if (presets[preset]) {
      setFormData((prev) => ({ ...prev, ...presets[preset] }));
    }
  };

  /*--------------------------------------------------------------------------
   *  File upload handler
   *--------------------------------------------------------------------------*/
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const uploaded = JSON.parse(e.target.result);
        const newFormData = {
          ...formData,
          subject: uploaded.subject || 'mathematics',
          numberOfConversations: uploaded.numberOfConversations || 3,
          generationMode: uploaded.generationMode || 'single_ai',
          aiModel: uploaded.ai_settings?.model || 'gpt-3.5-turbo',
          temperature: uploaded.ai_settings?.temperature || 0.8,
          maxTokens: uploaded.ai_settings?.max_tokens || 2000,
          reasoningEffort: uploaded.ai_settings?.reasoning_effort || 'medium',
          customInstructions: uploaded.ai_settings?.custom_instructions || '',
          avgTurns: uploaded.conversation_structure?.turns?.mean || 12,
          stdTurns: uploaded.conversation_structure?.turns?.std || 4.8,
          minTurns: uploaded.conversation_structure?.turns?.min || 4,
          maxTurns: uploaded.conversation_structure?.turns?.max || 30,
          tutorStudentRatio: uploaded.conversation_structure?.tutor_student_ratio || 1.2,
          conversationStarter: uploaded.conversation_structure?.conversation_starter || 'tutor',
          customVocabulary: uploaded.vocabulary?.term_frequencies || {},
          usePresetVocabulary: false,
          tutorPurposes: uploaded.tutor_questions?.purpose_distribution || {
            guidance: 0.4,
            assessment: 0.3,
            encouragement: 0.2,
            clarification: 0.1,
          },
          confusionMean: uploaded.student_utterances?.confusion_scores?.mean || 3.0,
          confusionStd: uploaded.student_utterances?.confusion_scores?.std || 1.0,
          confusionMin: uploaded.student_utterances?.confusion_scores?.min || 1,
          confusionMax: uploaded.student_utterances?.confusion_scores?.max || 5,
          correctIndependent: uploaded.student_utterances?.correctness_distribution?.correct_independent || 1400,
          correctAssisted: uploaded.student_utterances?.correctness_distribution?.correct_assisted || 400,
          incorrect: uploaded.student_utterances?.correctness_distribution?.incorrect || 200,
        };
        setFormData(newFormData);
        setConfig(uploaded);
        setActiveTab('upload');
      } catch (err) {
        alert('Invalid JSON file. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  /*--------------------------------------------------------------------------
   *  Submit & download handlers
   *--------------------------------------------------------------------------*/
  const handleSubmit = () => {
    const finalConfig = config || generateConfig();
    onSubmit(finalConfig);
  };
  const downloadConfig = () => {
    const configToDownload = config || generateConfig();
    const blob = new Blob([JSON.stringify(configToDownload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chatsynth-config-${formData.subject}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /*--------------------------------------------------------------------------
   *  Render
   *--------------------------------------------------------------------------*/
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ChatSynth</h1>
            <p className="text-gray-600 mt-1">Synthetic Educational Conversation Generator</p>
          </div>
          <div className="text-sm text-gray-500 text-right">
            <div>Lambda Environment Variables</div>
            <div className="text-xs">Model: {formData.aiModel} • API Key: Environment</div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'create' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('create')}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xl">⚙️</span>
                <span>Create Configuration</span>
              </div>
            </button>
            <button
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('upload')}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xl">📁</span>
                <span>Upload Configuration</span>
              </div>
            </button>
          </div>

          <div className="p-8 space-y-8">
            {activeTab === 'create' ? (
              <>
                {/* Presets */}
                <SectionCard
                  title="Quick Start Presets"
                  description="Select a preset to quickly load common configurations"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => loadPresetConfig('basic_math')}
                      className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 text-left"
                    >
                      <div className="font-medium text-gray-900">Basic Math Tutoring</div>
                      <div className="text-sm text-gray-600 mt-1">Simple problems, encouraging style</div>
                    </button>
                    <button
                      onClick={() => loadPresetConfig('advanced_science')}
                      className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 text-left"
                    >
                      <div className="font-medium text-gray-900">Advanced Science</div>
                      <div className="text-sm text-gray-600 mt-1">Complex topics, assessment‑focused</div>
                    </button>
                    <button
                      onClick={() => loadPresetConfig('writing_practice')}
                      className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 text-left"
                    >
                      <div className="font-medium text-gray-900">Writing Practice</div>
                      <div className="text-sm text-gray-600 mt-1">Language arts, guidance‑heavy</div>
                    </button>
                  </div>
                </SectionCard>

                {/* Basic Settings */}
                <SectionCard title="Basic Settings">
                  <div className="space-y-6">
                    {/* Subject selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Subject Area</label>
                      <div className="space-y-2">
                        {subjectOptions.map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                          >
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
                    {/* Generation mode */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Generation Method</label>
                      <div className="space-y-3">
                        <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="generationMode"
                            value="single_ai"
                            checked={formData.generationMode === 'single_ai'}
                            onChange={(e) => handleFormChange('generationMode', e.target.value)}
                            className="mt-1 mr-3"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">🤖 Single AI (Scripted)</div>
                            <div className="text-xs text-gray-600 mt-1">One AI generates the entire conversation based on parameters.</div>
                            <div className="text-xs text-green-600 mt-1">✓ Fast • ✓ Cheaper • ✓ Controlled • ✓ Predictable vocabulary</div>
                          </div>
                        </label>
                        <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="generationMode"
                            value="dual_ai"
                            checked={formData.generationMode === 'dual_ai'}
                            onChange={(e) => handleFormChange('generationMode', e.target.value)}
                            className="mt-1 mr-3"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">🤖↔️🤖 Dual AI (Interactive)</div>
                            <div className="text-xs text-gray-600 mt-1">Separate tutor and student AIs have a real conversation.</div>
                            <div className="text-xs text-blue-600 mt-1">✓ Realistic • ✓ Dynamic • ✓ Emergent behaviour • ✓ Natural flow</div>
                            <div className="text-xs text-amber-600 mt-1">⚠️ Slower • ⚠️ Less predictable</div>
                          </div>
                        </label>
                      </div>
                    </div>
                    {/* Number of conversations */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Number of Conversations</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={formData.numberOfConversations}
                        onChange={(e) => handleFormChange('numberOfConversations', parseInt(e.target.value) || 1)}
                        className={inputBaseClasses}
                      />
                      <p className="text-xs text-gray-500 mt-1">Recommended: 1–5 conversations • {formData.generationMode === 'dual_ai' ? 'Dual AI takes longer' : 'Single AI is faster'}</p>
                    </div>
                    {/* AI Model selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">AI Model (Metadata Only)</label>
                      <select
                        value={formData.aiModel}
                        onChange={(e) => handleFormChange('aiModel', e.target.value)}
                        className={inputBaseClasses}
                      >
                        {aiModelOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label} – {option.description}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Lambda uses OPENAI_API_KEY environment variable</p>
                    </div>
                  </div>
                </SectionCard>

                {/* AI model parameters */}
                <SectionCard title="AI Model Parameters">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Temperature: {formData.temperature}</label>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.1"
                        value={formData.temperature}
                        onChange={(e) => handleFormChange('temperature', parseFloat(e.target.value))}
                        className="w-full"
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
                        className={inputBaseClasses}
                      />
                    </div>
                    {formData.aiModel === 'o3-mini' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Reasoning Effort</label>
                        <select
                          value={formData.reasoningEffort}
                          onChange={(e) => handleFormChange('reasoningEffort', e.target.value)}
                          className={inputBaseClasses}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Custom Instructions</label>
                      <textarea
                        value={formData.customInstructions}
                        onChange={(e) => handleFormChange('customInstructions', e.target.value)}
                        placeholder="Additional instructions for the AI…"
                        className={`${inputBaseClasses} h-24 resize-none`}
                      />
                    </div>
                  </div>
                </SectionCard>

                {/* Conversation structure */}
                <SectionCard title="Conversation Structure">
                  <div className="space-y-6">
                    {/* Turn configuration */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Turn Configuration</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Average Turns</label>
                          <input
                            type="number"
                            min="4"
                            max="50"
                            value={formData.avgTurns}
                            onChange={(e) => handleFormChange('avgTurns', parseFloat(e.target.value))}
                            className={inputBaseClasses}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Std Deviation</label>
                          <input
                            type="number"
                            min="0.5"
                            max="10"
                            step="0.1"
                            value={formData.stdTurns}
                            onChange={(e) => handleFormChange('stdTurns', parseFloat(e.target.value))}
                            className={inputBaseClasses}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Min Turns</label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={formData.minTurns}
                            onChange={(e) => handleFormChange('minTurns', parseInt(e.target.value))}
                            className={inputBaseClasses}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Max Turns</label>
                          <input
                            type="number"
                            min="10"
                            max="100"
                            value={formData.maxTurns}
                            onChange={(e) => handleFormChange('maxTurns', parseInt(e.target.value))}
                            className={inputBaseClasses}
                          />
                        </div>
                      </div>
                    </div>
                    {/* Interaction configuration */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Interaction Configuration</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tutor : Student Ratio</label>
                          <input
                            type="number"
                            min="0.1"
                            max="5.0"
                            step="0.1"
                            value={formData.tutorStudentRatio}
                            onChange={(e) => handleFormChange('tutorStudentRatio', parseFloat(e.target.value))}
                            className={inputBaseClasses}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {formData.tutorStudentRatio > 1
                              ? 'Tutor talks more'
                              : formData.tutorStudentRatio < 1
                              ? 'Student talks more'
                              : 'Equal participation'}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Who Starts the Conversation?</label>
                          <div className="space-y-2">
                            <label className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50">
                              <input
                                type="radio"
                                name="conversationStarter"
                                value="tutor"
                                checked={formData.conversationStarter === 'tutor'}
                                onChange={(e) => handleFormChange('conversationStarter', e.target.value)}
                                className="mr-3"
                              />
                              <div>
                                <div className="font-medium text-sm">👨‍🏫 Tutor Starts</div>
                                <div className="text-xs text-gray-600">Traditional approach – tutor initiates with question/topic</div>
                              </div>
                            </label>
                            <label className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50">
                              <input
                                type="radio"
                                name="conversationStarter"
                                value="student"
                                checked={formData.conversationStarter === 'student'}
                                onChange={(e) => handleFormChange('conversationStarter', e.target.value)}
                                className="mr-3"
                              />
                              <div>
                                <div className="font-medium text-sm">👨‍🎓 Student Starts</div>
                                <div className="text-xs text-gray-600">Student‑driven approach – student asks a question or states a problem</div>
                              </div>
                            </label>
                            <label className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50">
                              <input
                                type="radio"
                                name="conversationStarter"
                                value="random"
                                checked={formData.conversationStarter === 'random'}
                                onChange={(e) => handleFormChange('conversationStarter', e.target.value)}
                                className="mr-3"
                              />
                              <div>
                                <div className="font-medium text-sm">🎲 Random</div>
                                <div className="text-xs text-gray-600">Randomly choose who starts each conversation</div>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SectionCard>

                {/* Vocabulary */}
                <SectionCard title="Vocabulary Configuration">
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.usePresetVocabulary}
                          onChange={(e) => handleFormChange('usePresetVocabulary', e.target.checked)}
                          className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium">Use preset vocabulary for {formData.subject}</span>
                      </label>
                    </div>
                    {!formData.usePresetVocabulary && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Custom Vocabulary Terms</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {Object.entries(formData.customVocabulary).map(([term, frequency]) => (
                            <div key={term} className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={term}
                                onChange={(e) => {
                                  const oldTerm = term;
                                  const newTerm = e.target.value;
                                  if (newTerm !== oldTerm) {
                                    removeVocabularyTerm(oldTerm);
                                    updateVocabularyTerm(newTerm, frequency);
                                  }
                                }}
                                className={`${inputBaseClasses} flex-1 text-sm`}
                                placeholder="Term"
                              />
                              <input
                                type="number"
                                min="0"
                                max="1"
                                step="0.01"
                                value={frequency}
                                onChange={(e) => updateVocabularyTerm(term, parseFloat(e.target.value))}
                                className={`${inputBaseClasses} w-20 text-sm`}
                                placeholder="0.15"
                              />
                              <button
                                onClick={() => removeVocabularyTerm(term)}
                                className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => updateVocabularyTerm('new_term', 0.1)}
                          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm"
                        >
                          + Add Term
                        </button>
                      </div>
                    )}
                  </div>
                </SectionCard>

                {/* Tutor question distribution */}
                <SectionCard title="Tutor Question Distribution">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">Purpose Types & Weights</h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {Object.entries(formData.tutorPurposes).map(([purpose, weight]) => (
                        <div key={purpose} className="flex items-center space-x-3 bg-gray-50 p-3 rounded border">
                          <input
                            type="text"
                            value={purpose}
                            onChange={(e) => {
                              const oldPurpose = purpose;
                              const newPurpose = e.target.value;
                              if (newPurpose && newPurpose !== oldPurpose) {
                                removeTutorPurpose(oldPurpose);
                                updateTutorPurpose(newPurpose.trim().toLowerCase(), weight);
                              }
                            }}
                            className={`${inputBaseClasses} flex-1 text-sm font-medium capitalize`}
                            placeholder="Purpose name"
                          />
                          <input
                            type="number"
                            min="0"
                            max="1"
                            step="0.1"
                            value={weight}
                            onChange={(e) => updateTutorPurpose(purpose, parseFloat(e.target.value) || 0)}
                            className={`${inputBaseClasses} w-20 text-sm`}
                            placeholder="0.4"
                          />
                          <span className="text-xs text-gray-500 w-12">{(weight * 100).toFixed(0)}%</span>
                          <button
                            onClick={() => removeTutorPurpose(purpose)}
                            className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                            title="Remove purpose"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    {/* Add new purpose */}
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded border-2 border-dashed border-gray-300">
                      <input
                        type="text"
                        placeholder="New purpose name (e.g., 'motivation', 'scaffolding')"
                        className={`${inputBaseClasses} flex-1 text-sm`}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const purposeName = e.target.value.trim().toLowerCase();
                            if (purposeName && !formData.tutorPurposes[purposeName]) {
                              updateTutorPurpose(purposeName, 0.1);
                              e.target.value = '';
                            }
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          const input = e.currentTarget.parentElement.querySelector('input');
                          const purposeName = input.value.trim().toLowerCase();
                          if (purposeName && !formData.tutorPurposes[purposeName]) {
                            updateTutorPurpose(purposeName, 0.1);
                            input.value = '';
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
                      >
                        + Add Purpose
                      </button>
                    </div>
                    {/* Quick add common purposes */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Quick Add Common Purposes:</h5>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'motivation',
                          'scaffolding',
                          'reflection',
                          'verification',
                          'elaboration',
                          'connection',
                          'application',
                          'synthesis',
                          'metacognition',
                          'feedback',
                          'probing',
                          'redirection',
                        ]
                          .filter((p) => !formData.tutorPurposes[p])
                          .map((purpose) => (
                            <button
                              key={purpose}
                              onClick={() => updateTutorPurpose(purpose, 0.1)}
                              className="px-3 py-1 bg-white border border-gray-200 rounded text-sm hover:bg-gray-50 capitalize"
                            >
                              + {purpose}
                            </button>
                          ))}
                      </div>
                    </div>
                    {/* Weight summary */}
                    <div className="flex justify-between items-center pt-3 border-t">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Total Weight: </span>
                        <span
                          className={`${Math.abs(Object.values(formData.tutorPurposes).reduce((sum, w) => sum + w, 0) - 1.0) < 0.01 ? 'text-green-600 font-medium' : 'text-amber-600 font-medium'}`}
                        >
                          {Object.values(formData.tutorPurposes)
                            .reduce((sum, w) => sum + w, 0)
                            .toFixed(3)}
                        </span>
                        <span className="ml-2 text-xs">({Object.keys(formData.tutorPurposes).length} purposes)</span>
                      </div>
                      <button
                        onClick={normalizeTutorWeights}
                        className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
                      >
                        ⚖️ Normalize to 1.0
                      </button>
                    </div>
                  </div>
                </SectionCard>

                {/* Student utterances */}
                <SectionCard title="Student Response Characteristics">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Confusion Levels</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Mean (1–5)</label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            step="0.1"
                            value={formData.confusionMean}
                            onChange={(e) => handleFormChange('confusionMean', parseFloat(e.target.value))}
                            className={inputBaseClasses}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Std Dev</label>
                          <input
                            type="number"
                            min="0.1"
                            max="3"
                            step="0.1"
                            value={formData.confusionStd}
                            onChange={(e) => handleFormChange('confusionStd', parseFloat(e.target.value))}
                            className={inputBaseClasses}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Min</label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={formData.confusionMin}
                            onChange={(e) => handleFormChange('confusionMin', parseInt(e.target.value))}
                            className={inputBaseClasses}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Max</label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={formData.confusionMax}
                            onChange={(e) => handleFormChange('confusionMax', parseInt(e.target.value))}
                            className={inputBaseClasses}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Correctness Distribution</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Correct Independent</label>
                          <input
                            type="number"
                            min="0"
                            max="2000"
                            value={formData.correctIndependent}
                            onChange={(e) => handleFormChange('correctIndependent', parseInt(e.target.value))}
                            className={inputBaseClasses}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Correct Assisted</label>
                          <input
                            type="number"
                            min="0"
                            max="2000"
                            value={formData.correctAssisted}
                            onChange={(e) => handleFormChange('correctAssisted', parseInt(e.target.value))}
                            className={inputBaseClasses}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Incorrect</label>
                          <input
                            type="number"
                            min="0"
                            max="2000"
                            value={formData.incorrect}
                            onChange={(e) => handleFormChange('incorrect', parseInt(e.target.value))}
                            className={inputBaseClasses}
                          />
                        </div>
                        <div className="text-sm text-gray-600">Total: {formData.correctIndependent + formData.correctAssisted + formData.incorrect}</div>
                      </div>
                    </div>
                  </div>
                </SectionCard>

                {/* Configuration preview */}
                {config && (
                  <SectionCard title="Generated Configuration Preview">
                    <ConfigViewer config={config} />
                  </SectionCard>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => generateConfig()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    🔧 Generate Configuration
                  </button>
                  <button
                    onClick={downloadConfig}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    💾 Download Config
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`px-8 py-3 rounded-lg font-semibold text-white transition-all ${
                      loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 shadow-lg'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Generating with {formData.aiModel}…</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">🚀</span>
                        <span>Generate {formData.numberOfConversations} Conversations</span>
                      </div>
                    )}
                  </button>
                </div>

                {/* Progress indicator */}
                {loading && progress.total > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-900">Generating conversation {progress.current} of {progress.total}</span>
                      <span className="text-sm text-blue-700">{Math.round((progress.current / progress.total) * 100)}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(progress.current / progress.total) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">Using {formData.aiModel} • Estimated time: {(progress.total - progress.current) * 15} seconds remaining</p>
                  </div>
                )}

                {/* Error display */}
                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-red-800 font-medium mb-1">Generation Failed</div>
                    <div className="text-red-700 text-sm">{error}</div>
                  </div>
                )}
              </>
            ) : (
              // Upload tab
              <>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Configuration</h2>
                  <p className="text-gray-600">Upload an existing JSON configuration file</p>
                </div>
                {/* Number of conversations override */}
                <div className="mb-6 max-w-md mx-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Conversations to Generate</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.numberOfConversations}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value) || 1;
                      handleFormChange('numberOfConversations', newValue);
                      if (config) {
                        setConfig((prev) => ({ ...prev, numberOfConversations: newValue }));
                      }
                    }}
                    className={inputBaseClasses}
                  />
                  <p className="text-xs text-gray-500 mt-1">This value overrides any value in the uploaded configuration.</p>
                </div>
                {/* File upload */}
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
                    <div className="mt-6 flex gap-4 justify-center">
                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`px-8 py-3 rounded-lg font-semibold text-white transition-all ${
                          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 shadow-lg'
                        }`}
                      >
                        {loading ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Generating…</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="text-xl">🚀</span>
                            <span>Generate {formData.numberOfConversations} Conversations</span>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
