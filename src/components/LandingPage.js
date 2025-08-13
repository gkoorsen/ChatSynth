import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Settings, Zap, Brain, Users, Download, Upload, Play, Save, Loader, Plus, X } from 'lucide-react';

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
    purposes: false,
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
        conversation_count: 1,
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
        },
        student_purposes: {
          purpose_weights: {
            "better_understanding": 0.4,
            "practice": 0.3,
            "clarification": 0.2,
            "validation": 0.1
          },
          custom_purposes: []
        },
        tutor_purposes: {
          purpose_weights: {
            "scaffolding": 0.4,
            "explanation": 0.3,
            "assessment": 0.2,
            "encouragement": 0.1
          },
          custom_purposes: []
        }
      }
    },
    
    advanced_coordinated: {
      name: "Advanced Coordinated Learning",
      description: "Three-AI system with intelligent coordination",
      icon: "🧠",
      config: {
        generationMode: "three_ai_coordinated",
        conversation_count: 3,
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
        student_purposes: {
          purpose_weights: {
            "better_understanding": 0.3,
            "clarification": 0.3,
            "validation": 0.2,
            "practice": 0.2
          },
          custom_purposes: []
        },
        tutor_purposes: {
          purpose_weights: {
            "guided_discovery": 0.4,
            "scaffolding": 0.3,
            "assessment": 0.2,
            "explanation": 0.1
          },
          custom_purposes: []
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
        conversation_count: 2,
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
        },
        student_purposes: {
          purpose_weights: {
            "better_understanding": 0.4,
            "help_with_problem": 0.3,
            "practice": 0.2,
            "clarification": 0.1
          },
          custom_purposes: []
        },
        tutor_purposes: {
          purpose_weights: {
            "guided_discovery": 0.5,
            "explanation": 0.3,
            "encouragement": 0.2
          },
          custom_purposes: []
        }
      }
    },

    language_arts_creative: {
      name: "Creative Writing Workshop",
      description: "Expressive writing with creative guidance",
      icon: "✍️",
      config: {
        generationMode: "dual_ai",
        conversation_count: 2,
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
        },
        student_purposes: {
          purpose_weights: {
            "better_understanding": 0.3,
            "practice": 0.4,
            "validation": 0.2,
            "clarification": 0.1
          },
          custom_purposes: []
        },
        tutor_purposes: {
          purpose_weights: {
            "encouragement": 0.4,
            "guided_discovery": 0.3,
            "explanation": 0.2,
            "scaffolding": 0.1
          },
          custom_purposes: []
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

  const addCustomPurpose = (role) => {
    const newPurpose = prompt(`Enter a custom ${role} purpose:`);
    if (newPurpose && newPurpose.trim()) {
      const cleanPurpose = newPurpose.trim().toLowerCase().replace(/[^a-z0-9_\s]/g, '').replace(/\s+/g, '_');
      if (cleanPurpose) {
        // Add to custom purposes list
        updateConfig(`${role}_purposes.custom_purposes`, [
          ...(config[`${role}_purposes`]?.custom_purposes || []),
          cleanPurpose
        ]);
        // Add to purpose weights with default weight
        updateConfig(`${role}_purposes.purpose_weights.${cleanPurpose}`, 0.1);
      }
    }
  };

  const removeCustomPurpose = (role, purpose) => {
    // Remove from custom purposes list
    const customPurposes = config[`${role}_purposes`]?.custom_purposes || [];
    updateConfig(`${role}_purposes.custom_purposes`, customPurposes.filter(p => p !== purpose));
    
    // Remove from purpose weights
    const newWeights = { ...(config[`${role}_purposes`]?.purpose_weights || {}) };
    delete newWeights[purpose];
    updateConfig(`${role}_purposes.purpose_weights`, newWeights);
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
        ai_settings: {
          model: config.models?.coordinator?.model || config.models?.tutor?.model || 'gpt-4o',
          temperature: config.models?.coordinator?.temperature || config.models?.tutor?.temperature || 0.8,
          max_tokens: config.models?.coordinator?.max_tokens || config.models?.tutor?.max_tokens || 2000,
          reasoning_effort: config.models?.coordinator?.reasoning_effort || 'medium'
        }
      };

      const conversationCount = config.conversation_count || 1;
      const BASE_URL = 'https://3py5676r52.execute-api.us-east-1.amazonaws.com/prod';
      
      console.log('Generating', conversationCount, 'conversations...');
      
      const conversations = [];
      const errors = [];
      
      // Determine if we need async processing
      const needsAsync = config.generationMode === 'dual_ai' || config.generationMode === 'three_ai_coordinated';
      
      // TEMPORARY: Force sync mode until async endpoints are deployed
      const forceSync = false; // Set to false once Lambda is updated
      
      // Loop through and generate conversations one by one
      for (let i = 0; i < conversationCount; i++) {
        try {
          console.log(`Generating conversation ${i + 1} of ${conversationCount}...`);
          
          if (needsAsync && !forceSync) {
            // === ASYNC PROCESSING PATH ===
            console.log(`Using async processing for ${config.generationMode} mode`);
            console.log(`Calling: ${BASE_URL}/generate?mode=async`);
            
            // Start async job
            setResults({
              status: 'generating',
              progress: {
                current: i + 1,
                total: conversationCount,
                percentage: Math.round(((i) / conversationCount) * 100)
              },
              conversations: [...conversations],
              message: `Starting async generation for conversation ${i + 1}...`
            });
            
            const startResponse = await fetch(`${BASE_URL}/generate?mode=async`, {
              method: 'POST',
              mode: 'cors',
              headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify(apiConfig)
            });
            
            if (!startResponse.ok) {
              const errorText = await startResponse.text();
              throw new Error(`HTTP ${startResponse.status}: ${errorText}`);
            }
            
            const startData = await startResponse.json();
            const jobId = startData.jobId;
            
            console.log(`Async job started: ${jobId}`);
            
            // Poll for completion
            const conversation = await pollJobCompletion(jobId, BASE_URL, i + 1, conversationCount, conversations);
            
            conversations.push({
              conversation: conversation.conversation,
              metadata: conversation.metadata,
              conversation_number: i + 1,
              generated_at: new Date().toISOString(),
              generation_method: 'async',
              job_id: jobId
            });
            
          } else {
            // === SYNCHRONOUS PROCESSING PATH (Single AI or Forced Sync) ===
            if (needsAsync && forceSync) {
              console.log(`TEMPORARILY using sync mode for ${config.generationMode} (async not deployed yet)`);
            } else {
              console.log(`Using synchronous processing for ${config.generationMode} mode`);
            }
            
            console.log(`Calling: ${BASE_URL}/generate`);
            
            setResults({
              status: 'generating',
              progress: {
                current: i + 1,
                total: conversationCount,
                percentage: Math.round(((i + 1) / conversationCount) * 100)
              },
              conversations: [...conversations],
              message: `Generating conversation ${i + 1} of ${conversationCount}...`
            });
            
            const response = await fetch(`${BASE_URL}/generate`, {
              method: 'POST',
              mode: 'cors',
              headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify(apiConfig)
            });
            
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
            
            const data = await response.json();
            
            if (data.error) {
              throw new Error(data.error);
            }
            
            conversations.push({
              conversation: data.conversation,
              metadata: data.metadata,
              conversation_number: i + 1,
              generated_at: new Date().toISOString(),
              generation_method: 'sync'
            });
          }
          
          console.log(`Conversation ${i + 1} completed successfully`);
          
          // Add a small delay between requests to be nice to the API
          if (i < conversationCount - 1) {
            console.log('Waiting 2 seconds before next conversation...');
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
          
        } catch (error) {
          console.error(`Error generating conversation ${i + 1}:`, error);
          errors.push({
            conversation_number: i + 1,
            error: error.message,
            timestamp: new Date().toISOString()
          });
          
          // Continue with next conversation even if one fails
          conversations.push({
            conversation: null,
            error: error.message,
            conversation_number: i + 1,
            generated_at: new Date().toISOString()
          });
        }
      }
      
      // Final results
      const finalResults = {
        status: 'completed',
        conversations,
        errors,
        metadata: {
          generated_at: new Date().toISOString(),
          conversation_count: conversations.length,
          successful_count: conversations.filter(c => c.conversation && !c.error).length,
          failed_count: errors.length,
          total_turns: conversations.reduce((sum, conv) => {
            return sum + (conv.conversation?.length || 0);
          }, 0),
          subject: config.educational_objectives?.subject,
          model_used: apiConfig.ai_settings.model,
          generation_mode: config.generationMode,
          processing_method: needsAsync ? 'async' : 'sync'
        }
      };
      
      console.log('All conversations completed:', finalResults);
      setResults(finalResults);
      setActiveTab('results');
      
    } catch (error) {
      console.error('Generation failed:', error);
      alert(`Failed to generate conversations: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to poll job completion
  const pollJobCompletion = async (jobId, baseUrl, conversationNum, totalConversations, existingConversations) => {
    const maxPollTime = 10 * 60 * 1000; // 10 minutes max
    const pollInterval = 2000; // 2 seconds
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxPollTime) {
      try {
        console.log(`Polling job ${jobId}...`);
        
        const statusResponse = await fetch(`${baseUrl}/generate?mode=status&jobId=${jobId}`, {
          method: 'GET',
          mode: 'cors',
          headers: { 'Accept': 'application/json' }
        });
        
        if (!statusResponse.ok) {
          throw new Error(`Status check failed: ${statusResponse.status}`);
        }
        
        const status = await statusResponse.json();
        console.log(`Job ${jobId} status:`, status.status, `${status.progress || 0}%`);
        
        // Update UI with current job progress
        const overallProgress = Math.round(((conversationNum - 1) / totalConversations) * 100) + 
                               Math.round((status.progress || 0) / totalConversations);
        
        setResults({
          status: 'generating',
          progress: {
            current: conversationNum,
            total: totalConversations,
            percentage: Math.min(overallProgress, 95),
            jobProgress: status.progress || 0
          },
          conversations: [...existingConversations],
          message: status.message || `Processing conversation ${conversationNum}...`,
          asyncJobId: jobId,
          currentJobStatus: status
        });
        
        if (status.status === 'completed') {
          console.log(`Job ${jobId} completed successfully`);
          return {
            conversation: status.conversation,
            metadata: status.metadata
          };
        }
        
        if (status.status === 'failed') {
          throw new Error(`Job failed: ${status.error || 'Unknown error'}`);
        }
        
        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, pollInterval));
        
      } catch (error) {
        console.error(`Error polling job ${jobId}:`, error);
        // Continue polling unless it's a permanent error
        if (error.message.includes('Job not found')) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }
    }
    
    throw new Error(`Job ${jobId} timed out after ${maxPollTime / 1000} seconds`);
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

  // Helper to render purpose configuration UI
  const renderPurposeSection = (role, roleTitle) => {
    const roleConfig = config[`${role}_purposes`] || {};
    const purposeWeights = roleConfig.purpose_weights || {};
    const customPurposes = roleConfig.custom_purposes || [];

    // Define predefined purposes
    const predefinedPurposes = role === 'student' 
      ? ['better_understanding', 'clarification', 'practice', 'validation', 'help_with_problem']
      : ['scaffolding', 'explanation', 'assessment', 'encouragement', 'guided_discovery'];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">{roleTitle} Purposes</h4>
          <button
            onClick={() => addCustomPurpose(role)}
            className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {predefinedPurposes.map(purpose => (
            <div key={purpose} className="flex items-center space-x-3">
              <input
                type="checkbox"
                id={`${role}_${purpose}`}
                checked={(purposeWeights[purpose] || 0) > 0}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateConfig(`${role}_purposes.purpose_weights.${purpose}`, 0.2);
                  } else {
                    const newWeights = { ...purposeWeights };
                    delete newWeights[purpose];
                    updateConfig(`${role}_purposes.purpose_weights`, newWeights);
                  }
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor={`${role}_${purpose}`}
                className="flex-1 text-sm text-gray-700 capitalize cursor-pointer"
              >
                {purpose.replace(/_/g, ' ')}
              </label>
              {(purposeWeights[purpose] || 0) > 0 && (
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={purposeWeights[purpose] || 0}
                  onChange={(e) => updateConfig(`${role}_purposes.purpose_weights.${purpose}`, parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          ))}

          {/* Custom purposes */}
          {customPurposes.map(purpose => (
            <div key={purpose} className="flex items-center space-x-3 bg-blue-50 p-2 rounded">
              <input
                type="checkbox"
                id={`${role}_custom_${purpose}`}
                checked={(purposeWeights[purpose] || 0) > 0}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateConfig(`${role}_purposes.purpose_weights.${purpose}`, 0.2);
                  } else {
                    const newWeights = { ...purposeWeights };
                    delete newWeights[purpose];
                    updateConfig(`${role}_purposes.purpose_weights`, newWeights);
                  }
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor={`${role}_custom_${purpose}`}
                className="flex-1 text-sm text-blue-700 capitalize cursor-pointer"
              >
                {purpose.replace(/_/g, ' ')} (custom)
              </label>
              {(purposeWeights[purpose] || 0) > 0 && (
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={purposeWeights[purpose] || 0}
                  onChange={(e) => updateConfig(`${role}_purposes.purpose_weights.${purpose}`, parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
              <button
                onClick={() => removeCustomPurpose(role, purpose)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
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
                            <span className="text-gray-500">Conversations:</span>
                            <span className="font-medium text-gray-900">{preset.config.conversation_count || 1}</span>
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

                {/* NEW: Conversation Purposes Section */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection('purposes')}
                    className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">Conversation Purposes</h3>
                    {expandedSections.purposes ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>
                  
                  {expandedSections.purposes && (
                    <div className="mt-4 space-y-6 p-4 border border-gray-200 rounded-lg">
                      <div className="text-sm text-gray-600 mb-4">
                        Configure the purposes that guide conversation flow. Purposes are selected based on who starts the conversation.
                        Higher weights make purposes more likely to be selected.
                      </div>
                      
                      {renderPurposeSection('student', 'Student')}
                      <div className="border-t border-gray-200 pt-6">
                        {renderPurposeSection('tutor', 'Tutor')}
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
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Number of Conversations</label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={config.conversation_count || 1}
                            onChange={(e) => updateConfig('conversation_count', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
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
                      <span>Generating {config.conversation_count || 1} Conversation{(config.conversation_count || 1) > 1 ? 's' : ''}...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      <span>Generate {config.conversation_count || 1} Conversation{(config.conversation_count || 1) > 1 ? 's' : ''}</span>
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
                    <span className="text-gray-600">Conversations:</span>
                    <span className="font-medium">{config.conversation_count || 1}</span>
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
                  
                  {/* Purpose Preview */}
                  {(config.student_purposes?.purpose_weights || config.tutor_purposes?.purpose_weights) && (
                    <>
                      <div className="border-t border-gray-200 pt-3 mt-3">
                        <span className="text-gray-600 text-xs uppercase tracking-wide">Purposes</span>
                      </div>
                      {config.student_purposes?.purpose_weights && Object.keys(config.student_purposes.purpose_weights).length > 0 && (
                        <div>
                          <span className="text-gray-600">Student:</span>
                          <div className="text-xs text-gray-500 mt-1">
                            {Object.entries(config.student_purposes.purpose_weights)
                              .filter(([_, weight]) => weight > 0)
                              .map(([purpose, weight]) => `${purpose.replace(/_/g, ' ')} (${weight})`)
                              .join(', ')}
                          </div>
                        </div>
                      )}
                      {config.tutor_purposes?.purpose_weights && Object.keys(config.tutor_purposes.purpose_weights).length > 0 && (
                        <div>
                          <span className="text-gray-600">Tutor:</span>
                          <div className="text-xs text-gray-500 mt-1">
                            {Object.entries(config.tutor_purposes.purpose_weights)
                              .filter(([_, weight]) => weight > 0)
                              .map(([purpose, weight]) => `${purpose.replace(/_/g, ' ')} (${weight})`)
                              .join(', ')}
                          </div>
                        </div>
                      )}
                    </>
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
                {/* Show progress while generating */}
                {results.status === 'generating' ? (
                  <>
                    {/* Progress Header */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">Generating Conversations</h2>
                        <div className="flex items-center space-x-2">
                          <Loader className="w-5 h-5 animate-spin text-blue-600" />
                          <span className="text-sm text-gray-600">
                            {results.progress?.current} of {results.progress?.total}
                          </span>
                          {results.asyncJobId && (
                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              Async Mode
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${results.progress?.percentage || 0}%` }}
                        ></div>
                      </div>
                      
                      {/* Progress Message */}
                      <p className="text-gray-600">{results.message}</p>
                      
                      {/* Async Job Details */}
                      {results.currentJobStatus && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <div className="text-sm text-blue-800">
                            <div className="flex justify-between items-center">
                              <span>Job Progress:</span>
                              <span className="font-medium">{results.currentJobStatus.progress || 0}%</span>
                            </div>
                            {results.asyncJobId && (
                              <div className="text-xs text-blue-600 mt-1">
                                Job ID: {results.asyncJobId}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Show completed conversations so far */}
                    {results.conversations && results.conversations.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Completed Conversations</h3>
                        {results.conversations.map((convData, index) => (
                          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900 mb-2">
                                Conversation {convData.conversation_number}
                                {convData.error && <span className="text-red-600 ml-2">(Error)</span>}
                                {convData.generation_method && (
                                  <span className={`ml-2 text-xs px-2 py-1 rounded ${
                                    convData.generation_method === 'async' 
                                      ? 'bg-blue-100 text-blue-800' 
                                      : 'bg-green-100 text-green-800'
                                  }`}>
                                    {convData.generation_method}
                                  </span>
                                )}
                              </h4>
                            </div>
                            {convData.error ? (
                              <p className="text-red-600 text-sm">{convData.error}</p>
                            ) : (
                              <p className="text-gray-600 text-sm">
                                {convData.conversation?.length || 0} turns completed
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* Final Results Header */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">Generated Conversations</h2>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">
                            {results.metadata?.successful_count || 0} successful
                          </span>
                          {results.metadata?.failed_count > 0 && (
                            <span className="text-sm text-red-600">
                              {results.metadata.failed_count} failed
                            </span>
                          )}
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
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-gray-600">Subject</div>
                            <div className="font-semibold">{results.metadata.subject}</div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-gray-600">Model Used</div>
                            <div className="font-semibold">{results.metadata.model_used}</div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-gray-600">Total Conversations</div>
                            <div className="font-semibold">{results.metadata.conversation_count}</div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-gray-600">Total Turns</div>
                            <div className="font-semibold">{results.metadata.total_turns}</div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-gray-600">Processing</div>
                            <div className={`font-semibold ${
                              results.metadata.processing_method === 'async' ? 'text-blue-600' : 'text-green-600'
                            }`}>
                              {results.metadata.processing_method || 'sync'}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Individual Conversations */}
                    {results.conversations && Array.isArray(results.conversations) && results.conversations.map((convData, convIndex) => (
                      <div key={convIndex} className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Conversation {convData.conversation_number || (convIndex + 1)}
                              {convData.error && <span className="text-red-600 ml-2">(Error)</span>}
                            </h3>
                            <span className="text-sm text-gray-500">
                              {convData.conversation?.length || 0} turns
                            </span>
                          </div>
                          
                          {convData.error ? (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                              <p className="text-red-800">{convData.error}</p>
                            </div>
                          ) : convData.conversation && Array.isArray(convData.conversation) ? (
                            <div className="space-y-4">
                              {convData.conversation.map((turn, index) => (
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
                          ) : (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                              <p className="text-gray-600">No conversation data available</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Handle old format for backward compatibility */}
                    {results.conversations && results.conversations.length === 0 && results.conversation && (
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Conversation</h3>
                          {Array.isArray(results.conversation) ? (
                            <div className="space-y-4">
                              {results.conversation.map((turn, index) => (
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
                          ) : (
                            <p className="text-gray-600">Invalid conversation format</p>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Users className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Yet</h3>
                <p className="text-gray-600 mb-6">
                  Configure your settings and generate conversations to see results here.
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
