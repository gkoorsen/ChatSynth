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
    if (onSubmit) {
      onSubmit(config);
    }
  };

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'Beginner': return { backgroundColor: '#dcfce7', color: '#166534' };
      case 'Intermediate': return { backgroundColor: '#fef3c7', color: '#92400e' };
      case 'Advanced': return { backgroundColor: '#fecaca', color: '#991b1b' };
      default: return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  const getModeColor = (mode) => {
    return mode === 'Dual AI' 
      ? { backgroundColor: '#e9d5ff', color: '#7c3aed' }
      : { backgroundColor: '#dbeafe', color: '#1d4ed8' };
  };

  // Embedded styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #faf5ff 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    header: {
      backgroundColor: '#ffffff',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      borderBottom: '1px solid #e5e7eb',
      padding: '2rem 0'
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1.5rem',
      textAlign: 'center'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '1rem'
    },
    subtitle: {
      fontSize: '1.25rem',
      color: '#6b7280',
      maxWidth: '48rem',
      margin: '0 auto'
    },
    mainContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1.5rem',
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '2rem'
    },
    presetsSection: {
      backgroundColor: '#ffffff',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      padding: '1.5rem'
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '1.5rem'
    },
    presetsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1rem'
    },
    presetCard: {
      position: 'relative',
      padding: '1.5rem',
      border: '2px solid #e5e7eb',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out'
    },
    presetCardSelected: {
      borderColor: '#3b82f6',
      backgroundColor: '#eff6ff'
    },
    presetCardHover: {
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      borderColor: '#d1d5db'
    },
    popularBadge: {
      position: 'absolute',
      top: '-0.5rem',
      right: '-0.5rem',
      backgroundColor: '#f97316',
      color: '#ffffff',
      fontSize: '0.75rem',
      padding: '0.25rem 0.5rem',
      borderRadius: '9999px'
    },
    presetHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '0.75rem'
    },
    presetTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#111827'
    },
    badgeContainer: {
      display: 'flex',
      gap: '0.5rem'
    },
    badge: {
      fontSize: '0.75rem',
      padding: '0.25rem 0.5rem',
      borderRadius: '9999px'
    },
    presetDescription: {
      color: '#6b7280',
      fontSize: '0.875rem',
      marginBottom: '1rem'
    },
    presetDetails: {
      fontSize: '0.75rem',
      color: '#9ca3af'
    },
    configSection: {
      backgroundColor: '#ffffff',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      padding: '1.5rem',
      position: 'sticky',
      top: '1.5rem',
      height: 'fit-content'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '0.5rem'
    },
    select: {
      width: '100%',
      padding: '0.5rem 0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    slider: {
      width: '100%',
      height: '0.5rem',
      borderRadius: '0.25rem',
      background: '#e5e7eb',
      outline: 'none',
      cursor: 'pointer'
    },
    sliderLabels: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.75rem',
      color: '#9ca3af',
      marginTop: '0.25rem'
    },
    button: {
      width: '100%',
      padding: '0.75rem 1rem',
      borderRadius: '0.5rem',
      fontWeight: '500',
      transition: 'all 0.2s',
      border: 'none',
      cursor: 'pointer'
    },
    buttonPrimary: {
      backgroundColor: '#2563eb',
      color: '#ffffff'
    },
    buttonDisabled: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed'
    },
    loadingSpinner: {
      display: 'inline-block',
      width: '1rem',
      height: '1rem',
      border: '2px solid transparent',
      borderTop: '2px solid #ffffff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '0.5rem'
    },
    progressContainer: {
      marginTop: '1rem'
    },
    progressText: {
      fontSize: '0.875rem',
      color: '#6b7280',
      marginBottom: '0.5rem'
    },
    progressBar: {
      width: '100%',
      height: '0.5rem',
      backgroundColor: '#e5e7eb',
      borderRadius: '9999px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#2563eb',
      transition: 'width 0.3s ease'
    },
    errorMessage: {
      marginTop: '1rem',
      padding: '0.75rem',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#dc2626',
      borderRadius: '0.5rem',
      fontSize: '0.875rem'
    },
    modeInfo: {
      marginTop: '1.5rem',
      paddingTop: '1.5rem',
      borderTop: '1px solid #e5e7eb'
    },
    modeInfoTitle: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#111827',
      marginBottom: '0.75rem'
    },
    modeInfoContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      fontSize: '0.75rem',
      color: '#6b7280'
    },
    responsive: {
      '@media (max-width: 1024px)': {
        gridTemplateColumns: '1fr',
        gap: '1.5rem'
      }
    }
  };

  return (
    <div style={styles.container}>
      {/* Add keyframes for spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @media (max-width: 1024px) {
            .main-content {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>ChatSynth</h1>
          <p style={styles.subtitle}>
            Generate realistic educational conversations using advanced AI models. 
            Choose from preset configurations or customize your own tutoring scenarios.
          </p>
        </div>
      </div>

      <div style={styles.mainContent} className="main-content">
        
        {/* Preset Cards - 2/3 width */}
        <div style={styles.presetsSection}>
          <h2 style={styles.sectionTitle}>Choose a Preset Configuration</h2>
          
          <div style={styles.presetsGrid}>
            {presets.map((preset) => (
              <div
                key={preset.id}
                style={{
                  ...styles.presetCard,
                  ...(selectedPreset?.id === preset.id ? styles.presetCardSelected : {})
                }}
                onClick={() => handlePresetSelect(preset)}
                onMouseEnter={(e) => {
                  if (selectedPreset?.id !== preset.id) {
                    Object.assign(e.target.style, styles.presetCardHover);
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedPreset?.id !== preset.id) {
                    e.target.style.boxShadow = 'none';
                    e.target.style.borderColor = '#e5e7eb';
                  }
                }}
              >
                {preset.popular && (
                  <div style={styles.popularBadge}>
                    Popular
                  </div>
                )}
                
                <div style={styles.presetHeader}>
                  <h3 style={styles.presetTitle}>{preset.title}</h3>
                  <div style={styles.badgeContainer}>
                    <span style={{...styles.badge, ...getModeColor(preset.mode)}}>
                      {preset.mode}
                    </span>
                    <span style={{...styles.badge, ...getComplexityColor(preset.complexity)}}>
                      {preset.complexity}
                    </span>
                  </div>
                </div>
                
                <p style={styles.presetDescription}>{preset.description}</p>
                
                <div style={styles.presetDetails}>
                  <div>Model: {preset.config.ai_settings.model}</div>
                  <div>Turns: {preset.config.conversation_structure.turns}</div>
                  <div>Mode: {preset.config.generationMode.replace('_', ' ')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration Panel - 1/3 width */}
        <div style={styles.configSection}>
          <h2 style={styles.sectionTitle}>Configuration</h2>
          
          <form onSubmit={handleSubmit} style={styles.form}>
            
            {/* Generation Mode */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Generation Mode
              </label>
              <select
                value={config.generationMode}
                onChange={(e) => setConfig(prev => ({ ...prev, generationMode: e.target.value }))}
                style={styles.select}
              >
                <option value="single_ai">Single AI (Faster)</option>
                <option value="dual_ai">Dual AI (More Realistic)</option>
              </select>
            </div>

            {/* Number of Conversations */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Number of Conversations: {config.numberOfConversations}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={config.numberOfConversations}
                onChange={(e) => setConfig(prev => ({ ...prev, numberOfConversations: parseInt(e.target.value) }))}
                style={styles.slider}
              />
              <div style={styles.sliderLabels}>
                <span>1</span>
                <span>5</span>
              </div>
            </div>

            {/* Conversation Length */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Conversation Length: {config.conversation_structure.turns} turns
              </label>
              <input
                type="range"
                min="4"
                max="15"
                value={config.conversation_structure.turns}
                onChange={(e) => handleConfigChange('conversation_structure', 'turns', parseInt(e.target.value))}
                style={styles.slider}
              />
              <div style={styles.sliderLabels}>
                <span>4</span>
                <span>15</span>
              </div>
            </div>

            {/* AI Model Selection */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                AI Model
              </label>
              <select
                value={config.ai_settings.model}
                onChange={(e) => handleConfigChange('ai_settings', 'model', e.target.value)}
                style={styles.select}
              >
                <option value="gpt-4o">GPT-4o (Recommended)</option>
                <option value="o3-mini">O3-mini (Advanced Reasoning)</option>
              </select>
            </div>

            {/* Temperature */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Creativity Level: {config.ai_settings.temperature}
              </label>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={config.ai_settings.temperature}
                onChange={(e) => handleConfigChange('ai_settings', 'temperature', parseFloat(e.target.value))}
                style={styles.slider}
              />
              <div style={styles.sliderLabels}>
                <span>Focused</span>
                <span>Creative</span>
              </div>
            </div>

            {/* Max Tokens */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Response Length: {config.ai_settings.max_tokens} tokens
              </label>
              <input
                type="range"
                min="1000"
                max="3000"
                step="200"
                value={config.ai_settings.max_tokens}
                onChange={(e) => handleConfigChange('ai_settings', 'max_tokens', parseInt(e.target.value))}
                style={styles.slider}
              />
              <div style={styles.sliderLabels}>
                <span>Short</span>
                <span>Long</span>
              </div>
            </div>

            {/* O3-mini specific settings */}
            {config.ai_settings.model === 'o3-mini' && (
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Reasoning Effort
                </label>
                <select
                  value={config.ai_settings.reasoning_effort || 'medium'}
                  onChange={(e) => handleConfigChange('ai_settings', 'reasoning_effort', e.target.value)}
                  style={styles.select}
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
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : styles.buttonPrimary)
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={styles.loadingSpinner}></div>
                  Generating...
                </div>
              ) : (
                'Generate Conversations'
              )}
            </button>

            {/* Progress Display */}
            {loading && progress && progress.total > 0 && (
              <div style={styles.progressContainer}>
                <div style={styles.progressText}>
                  Progress: {progress.current}/{progress.total}
                </div>
                <div style={styles.progressBar}>
                  <div 
                    style={{
                      ...styles.progressFill,
                      width: `${(progress.current / progress.total) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div style={styles.errorMessage}>
                {error}
              </div>
            )}

          </form>

          {/* Mode Information */}
          <div style={styles.modeInfo}>
            <h3 style={styles.modeInfoTitle}>Mode Information</h3>
            <div style={styles.modeInfoContent}>
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
  );
};

export default LandingPage;
