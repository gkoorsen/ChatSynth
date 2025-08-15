import React, { useState } from 'react';

const LandingPage = ({ onSubmit, loading, error, progress }) => {
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [config, setConfig] = useState({
    generationMode: 'single_ai',
    numberOfConversations: 3,
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
    ai_settings: {
      model: 'gpt-4o',
      temperature: 0.7,
      max_tokens: 2000
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(config);
    } else {
      // Mock submission for testing
      console.log('Configuration submitted:', config);
      alert('Configuration ready! (This is a test - no actual generation)');
    }
  };

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'Beginner': return 'background-color: #dcfce7; color: #166534;';
      case 'Intermediate': return 'background-color: #fef3c7; color: #92400e;';
      case 'Advanced': return 'background-color: #fee2e2; color: #991b1b;';
      default: return 'background-color: #f3f4f6; color: #374151;';
    }
  };

  const getModeColor = (mode) => {
    return mode === 'Dual AI' 
      ? 'background-color: #ede9fe; color: #6b21a8;'
      : 'background-color: #dbeafe; color: #1e40af;';
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #faf5ff 100%)'
  };

  const headerStyle = {
    backgroundColor: 'white',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid #e5e7eb'
  };

  const headerContentStyle = {
    maxWidth: '72rem',
    margin: '0 auto',
    padding: '2rem 1.5rem',
    textAlign: 'center'
  };

  const titleStyle = {
    fontSize: '2.25rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '1rem'
  };

  const subtitleStyle = {
    fontSize: '1.25rem',
    color: '#6b7280',
    maxWidth: '48rem',
    margin: '0 auto'
  };

  const mainGridStyle = {
    maxWidth: '72rem',
    margin: '0 auto',
    padding: '1.5rem',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '2rem'
  };

  const presetsContainerStyle = {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '1.5rem'
  };

  const presetsTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '1.5rem'
  };

  const presetsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1rem'
  };

  const configContainerStyle = {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '1.5rem',
    position: 'sticky',
    top: '1.5rem',
    height: 'fit-content',
    maxHeight: '90vh',
    overflowY: 'auto'
  };

  const configTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '1.5rem'
  };

  const sectionStyle = {
    backgroundColor: '#f9fafb',
    padding: '1rem',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
    marginBottom: '1.5rem'
  };

  const sectionTitleStyle = {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '1rem'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    marginBottom: '1rem'
  };

  const selectStyle = {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    marginBottom: '1rem',
    backgroundColor: 'white'
  };

  const textareaStyle = {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    minHeight: '80px',
    resize: 'vertical',
    marginBottom: '1rem'
  };

  const rangeStyle = {
    width: '100%',
    height: '0.5rem',
    backgroundColor: '#e5e7eb',
    borderRadius: '0.5rem',
    appearance: 'none',
    cursor: 'pointer',
    marginBottom: '0.25rem'
  };

  const buttonStyle = {
    width: '100%',
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '0.75rem 1rem',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  };

  const buttonHoverStyle = {
    backgroundColor: '#374151'
  };

  // Media query for responsive design
  const mediaQueryStyle = `
    @media (min-width: 1024px) {
      .main-grid {
        grid-template-columns: 2fr 1fr;
      }
    }
  `;

  return (
    <div style={containerStyle}>
      <style>{mediaQueryStyle}</style>
      
      {/* Header */}
      <div style={headerStyle}>
        <div style={headerContentStyle}>
          <h1 style={titleStyle}>ChatSynth</h1>
          <p style={subtitleStyle}>
            Generate realistic educational conversations using advanced AI models. 
            Choose from preset configurations or customize your own tutoring scenarios.
          </p>
        </div>
      </div>

      <div style={mainGridStyle} className="main-grid">
        
        {/* Preset Cards */}
        <div style={presetsContainerStyle}>
          <h2 style={presetsTitleStyle}>Choose a Preset Configuration</h2>
          
          <div style={presetsGridStyle}>
            {presets.map((preset) => {
              const isSelected = selectedPreset?.id === preset.id;
              const cardStyle = {
                position: 'relative',
                padding: '1.5rem',
                border: isSelected ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: isSelected ? '#eff6ff' : 'white'
              };

              return (
                <div
                  key={preset.id}
                  style={cardStyle}
                  onClick={() => handlePresetSelect(preset)}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  {preset.popular && (
                    <div style={{
                      position: 'absolute',
                      top: '-0.5rem',
                      right: '-0.5rem',
                      backgroundColor: '#f97316',
                      color: 'white',
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '9999px'
                    }}>
                      Popular
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>{preset.title}</h3>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '9999px',
                        ...getModeColor(preset.mode).split(';').reduce((acc, style) => {
                          const [key, value] = style.split(':').map(s => s.trim());
                          if (key && value) acc[key.replace(/-([a-z])/g, (g) => g[1].toUpperCase())] = value;
                          return acc;
                        }, {})
                      }}>
                        {preset.mode}
                      </span>
                      <span style={{
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '9999px',
                        ...getComplexityColor(preset.complexity).split(';').reduce((acc, style) => {
                          const [key, value] = style.split(':').map(s => s.trim());
                          if (key && value) acc[key.replace(/-([a-z])/g, (g) => g[1].toUpperCase())] = value;
                          return acc;
                        }, {})
                      }}>
                        {preset.complexity}
                      </span>
                    </div>
                  </div>
                  
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>{preset.description}</p>
                  
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    <div>Model: {preset.config.ai_settings.model}</div>
                    <div>Turns: {preset.config.conversation_structure.turns}</div>
                    <div>Starter: {preset.config.conversation_structure.starter}</div>
                    <div>Type: {preset.config.tutor_questions.type}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Configuration Panel */}
        <div style={configContainerStyle}>
          <h2 style={configTitleStyle}>Configuration</h2>
          
          <form onSubmit={handleSubmit}>
            
            {/* Basic Settings */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Basic Settings</h3>
              
              {/* Generation Mode */}
              <div>
                <label style={labelStyle}>Generation Mode</label>
                <select
                  value={config.generationMode}
                  onChange={(e) => setConfig(prev => ({ ...prev, generationMode: e.target.value }))}
                  style={selectStyle}
                >
                  <option value="single_ai">Single AI (Faster)</option>
                  <option value="dual_ai">Dual AI (More Realistic)</option>
                </select>
              </div>

              {/* Number of Conversations */}
              <div>
                <label style={labelStyle}>
                  Number of Conversations: {config.numberOfConversations}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={config.numberOfConversations}
                  onChange={(e) => setConfig(prev => ({ ...prev, numberOfConversations: parseInt(e.target.value) }))}
                  style={rangeStyle}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                  <span>1</span>
                  <span>5</span>
                </div>
              </div>

              {/* Conversation Length */}
              <div>
                <label style={labelStyle}>
                  Conversation Length: {config.conversation_structure.turns} turns
                </label>
                <input
                  type="range"
                  min="4"
                  max="15"
                  value={config.conversation_structure.turns}
                  onChange={(e) => handleConfigChange('conversation_structure', 'turns', parseInt(e.target.value))}
                  style={rangeStyle}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                  <span>4</span>
                  <span>15</span>
                </div>
              </div>
            </div>

            {/* Conversation Structure */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Conversation Structure</h3>
              
              {/* Conversation Starter */}
              <div>
                <label style={labelStyle}>Who Starts the Conversation?</label>
                <select
                  value={config.conversation_structure.starter}
                  onChange={(e) => {
                    const starter = e.target.value;
                    handleConfigChange('conversation_structure', 'starter', starter);
                    handleConfigChange('conversation_structure', 'conversation_starter', starter);
                  }}
                  style={selectStyle}
                >
                  <option value="tutor">Tutor starts</option>
                  <option value="student">Student starts</option>
                </select>
              </div>

              {/* Conversation Purpose */}
              <div>
                <label style={labelStyle}>Conversation Purpose</label>
                <textarea
                  value={config.conversation_structure.purpose}
                  onChange={(e) => handleConfigChange('conversation_structure', 'purpose', e.target.value)}
                  style={textareaStyle}
                  placeholder="Describe the overall goal and focus of the conversation..."
                />
              </div>
            </div>

            {/* Teaching Approach */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Teaching Approach</h3>
              
              {/* Tutor Question Type */}
              <div>
                <label style={labelStyle}>Tutor Question Type</label>
                <select
                  value={config.tutor_questions.type}
                  onChange={(e) => handleConfigChange('tutor_questions', 'type', e.target.value)}
                  style={selectStyle}
                >
                  <option value="scaffolding">Scaffolding (Step-by-step guidance)</option>
                  <option value="socratic">Socratic (Leading questions)</option>
                  <option value="analytical">Analytical (Critical thinking)</option>
                  <option value="reasoning">Reasoning (Logic-based)</option>
                  <option value="exploratory">Exploratory (Open-ended)</option>
                </select>
              </div>

              {/* Tutor Question Frequency */}
              <div>
                <label style={labelStyle}>Question Frequency</label>
                <select
                  value={config.tutor_questions.frequency}
                  onChange={(e) => handleConfigChange('tutor_questions', 'frequency', e.target.value)}
                  style={selectStyle}
                >
                  <option value="low">Low (Fewer questions)</option>
                  <option value="moderate">Moderate (Balanced)</option>
                  <option value="high">High (Many questions)</option>
                </select>
              </div>
            </div>

            {/* Student Characteristics */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Student Characteristics</h3>
              
              {/* Student Engagement */}
              <div>
                <label style={labelStyle}>Student Engagement Level</label>
                <select
                  value={config.student_utterances.engagement}
                  onChange={(e) => handleConfigChange('student_utterances', 'engagement', e.target.value)}
                  style={selectStyle}
                >
                  <option value="low">Low (Passive responses)</option>
                  <option value="moderate">Moderate (Some initiative)</option>
                  <option value="high">High (Active participation)</option>
                </select>
              </div>

              {/* Student Confusion Level */}
              <div>
                <label style={labelStyle}>Student Confusion Level</label>
                <select
                  value={config.student_utterances.confusion_level}
                  onChange={(e) => handleConfigChange('student_utterances', 'confusion_level', e.target.value)}
                  style={selectStyle}
                >
                  <option value="low">Low (Understands easily)</option>
                  <option value="moderate">Moderate (Some confusion)</option>
                  <option value="high">High (Frequently confused)</option>
                  <option value="realistic">Realistic (Natural variation)</option>
                </select>
              </div>
            </div>

            {/* AI Model Settings */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>AI Model Settings</h3>
              
              {/* AI Model Selection */}
              <div>
                <label style={labelStyle}>AI Model</label>
                <select
                  value={config.ai_settings.model}
                  onChange={(e) => handleConfigChange('ai_settings', 'model', e.target.value)}
                  style={selectStyle}
                >
                  <option value="gpt-4o">GPT-4o (Recommended)</option>
                  <option value="o3-mini">O3-mini (Advanced Reasoning)</option>
                </select>
              </div>

              {/* Temperature */}
              <div>
                <label style={labelStyle}>
                  Creativity Level: {config.ai_settings.temperature}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={config.ai_settings.temperature}
                  onChange={(e) => handleConfigChange('ai_settings', 'temperature', parseFloat(e.target.value))}
                  style={rangeStyle}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                  <span>Focused</span>
                  <span>Creative</span>
                </div>
              </div>

              {/* Max Tokens */}
              <div>
                <label style={labelStyle}>
                  Response Length: {config.ai_settings.max_tokens} tokens
                </label>
                <input
                  type="range"
                  min="1000"
                  max="3000"
                  step="200"
                  value={config.ai_settings.max_tokens}
                  onChange={(e) => handleConfigChange('ai_settings', 'max_tokens', parseInt(e.target.value))}
                  style={rangeStyle}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                  <span>Short</span>
                  <span>Long</span>
                </div>
              </div>

              {/* O3-mini specific settings */}
              {config.ai_settings.model === 'o3-mini' && (
                <div>
                  <label style={labelStyle}>Reasoning Effort</label>
                  <select
                    value={config.ai_settings.reasoning_effort || 'medium'}
                    onChange={(e) => handleConfigChange('ai_settings', 'reasoning_effort', e.target.value)}
                    style={selectStyle}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              )}
            </div>

            {/* Advanced Settings Toggle */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
              <div 
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '1rem' }}
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <span style={{ fontSize: '0.875rem', marginRight: '0.5rem' }}>
                  {showAdvanced ? '▼' : '▶'}
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                  Advanced Settings
                </span>
              </div>

              {showAdvanced && (
                <div style={sectionStyle}>
                  <h3 style={sectionTitleStyle}>Vocabulary & Language</h3>
                  
                  {/* Vocabulary Complexity */}
                  <div>
                    <label style={labelStyle}>Vocabulary Complexity</label>
                    <select
                      value={config.vocabulary.complexity}
                      onChange={(e) => handleConfigChange('vocabulary', 'complexity', e.target.value)}
                      style={selectStyle}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  {/* Domain Specific */}
                  <div>
                    <label style={{ ...labelStyle, display: 'flex', alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        checked={config.vocabulary.domain_specific}
                        onChange={(e) => handleConfigChange('vocabulary', 'domain_specific', e.target.checked)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      Use domain-specific vocabulary
                    </label>
                  </div>

                  {/* Subject */}
                  <div>
                    <label style={labelStyle}>Subject Area</label>
                    <input
                      type="text"
                      value={config.vocabulary.subject}
                      onChange={(e) => handleConfigChange('vocabulary', 'subject', e.target.value)}
                      style={inputStyle}
                      placeholder="e.g., mathematics, science, history"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...buttonStyle,
                ...(loading ? { opacity: 0.6, cursor: 'not-allowed' } : {})
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = buttonHoverStyle.backgroundColor;
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = buttonStyle.backgroundColor;
                }
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{
                    animation: 'spin 1s linear infinite',
                    borderRadius: '50%',
                    height: '1rem',
                    width: '1rem',
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    marginRight: '0.5rem'
                  }}></div>
                  Generating...
                </div>
              ) : (
                'Generate Conversations'
              )}
            </button>

            {/* Progress Display */}
            {loading && progress && progress.total > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                  Progress: {progress.current}/{progress.total}
                </div>
                <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '0.5rem' }}>
                  <div 
                    style={{
                      backgroundColor: '#2563eb',
                      height: '0.5rem',
                      borderRadius: '9999px',
                      transition: 'all 0.3s',
                      width: `${(progress.current / progress.total) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                backgroundColor: '#fee2e2',
                border: '1px solid #fca5a5',
                color: '#991b1b',
                borderRadius: '0.375rem',
                fontSize: '0.875rem'
              }}>
                {error}
              </div>
            )}

          </form>

          {/* Mode Information */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.75rem' }}>Mode Information</h3>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Single AI:</strong> Faster generation (10-30s), cost-effective, good for basic scenarios
              </div>
              <div>
                <strong>Dual AI:</strong> More realistic interactions (30-120s), separate tutor/student personalities
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation for spinner */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LandingPage;

